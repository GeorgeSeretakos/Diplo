/**
 * Any function in a Next.js pages/api route or under app/api is automatically run on the server,
 * so it doesn’t depend on the browser. It’s backend code by nature, even if a client triggers it.
 *
 * When you make a fetch call to an API endpoint in Next.js, it’s technically a client-to-server request,
 * even if it’s initiated by client-side code. The server executes any processing, then sends back a response.
 */

import path from 'path';
import xslt4node from 'xslt4node';
import { parseStringPromise } from "xml2js";
import fs from "fs";
import axios from 'axios';

export default async function handler(req, res) {
  const {query} = req;

  try {
    const xmlPath = path.join(process.cwd(), 'public', 'data', '01031994.doc.xml'); // Path to XML file

    // Handle XMl to HTML transformation
    if (query.format === 'html') {
      const xsltPath = path.join(process.cwd(), 'public', 'debate.xsl'); // Path to XSLT file

      // Configure XSLT transformation options
      const config = {
        sourcePath: xmlPath, // Path to XML file
        xsltPath: xsltPath, // Path to XSLT file
        result: String, // Return result as a string
      };

      // Perform transformation
      xslt4node.transform(config, (error, result) => {
        if (error) {
          console.error('Transformation error:', error);
          res.status(500).json({ error: 'Failed to transform XML' });
        } else {
          // Set content type to HTML and return result
          res.setHeader('Content-Type', 'text/html');
          res.status(200).send(result);
        }
      });
    }

    // Handle XML to JSON transformation
    else if (query.format === 'json') {
      let xmlData = fs.readFileSync(xmlPath, 'utf-8');
      xmlData = xmlData.replace(/<scene[\s\S]*?<\/scene>/gi, ''); // Remove <scene> tags and their content using a regex

      const jsonData = await parseStringPromise(xmlData, {
        explicitArray: true,
        preserveChildrenOrder: true,
      });

      // console.log("jsonData: ", JSON.stringify(jsonData, null, 2));

      // Strapi API credentials
      const STRAPI_URL = "http://localhost:1337"; // My Strapi instance URL
      const API_TOKEN = "64fdbf5db98e8feaf246072c2b6c7b4b9b82771f622a84ffc2a06e8bc4c9534272481f7730d283d571f206dd20522cb360221ef4b01e2861e1bebc33c71099f420ae7186182234051d2b95f404c16b8bc377d703f3af6d52eb5a8e6e98f89a0dd17a16873fff69a30df0efe715977c73e21d391cb84523fcdfa25f286968a61a";

      // Create Debate entry
      const debateData = extractDebateData(jsonData);
      const debateId = await sendDebateToStrapi(debateData, STRAPI_URL, API_TOKEN);

      // Create Parliament Session entry
      const parliamentSessionData = extractParliamentSessionData(jsonData, debateData.data);
      const parliamentSessionId = await sendParliamentSessionToStrapi(parliamentSessionData, STRAPI_URL, API_TOKEN);

      await connect(parliamentSessionId, debateId, STRAPI_URL, API_TOKEN);

      // Fetch Data to test
      // await fetchData(STRAPI_URL, API_TOKEN);

      res.status(200).json({message: 'Data transformed and sent to Strapi successfully.'});
    }
  } catch (error) {
    console.error('Transformation error:', error);
    res.status(500).json({ error: 'Failed to transform XML' });
  }
}


// Helper function to extract debate data
function extractDebateData(jsonData) {
  const dData = jsonData.akomaNtoso.debate[0].meta[0].identification[0];
  return {
    title: dData.FRBRWork[0].FRBRalias[0].$.value,
    date: dData.FRBRWork[0].FRBRdate[0].$.date,
    country: dData.FRBRWork[0].FRBRcountry[0].$.value,
    language: dData.FRBRExpression[0].FRBRlanguage[0].$.language,
  };
}

// Helper function to send debate to Strapi
async function sendDebateToStrapi(debateData, STRAPI_URL, API_TOKEN) {
  try{
    const debateResponse = await axios.post(
      `${STRAPI_URL}/api/debates`,
      { data: debateData },
      {
        headers: {
          Authorization: `Bearer ${API_TOKEN}`,
          'Content-Type': 'application/json',
        }
      }
    );
    console.log("Debate imported successfully: ", debateResponse.data);
    return debateResponse.data.data.documentId;

  } catch (error) {
    const message = error.response.data.error.details.errors[0].message;
    const status = error.response.status;
    if (error.response && status === 400 && message === "This attribute must be unique") {
      console.log("Debate already exists with the same title and date: ");
      return null;
    } else {
      throw error;
    }
  }
}


// Helper function to extract parliament session data
function extractParliamentSessionData(jsonData, defaultDate) {

  const pData = jsonData.akomaNtoso.debate[0].preface[0].container[0].p;
  return {
    title: pData[0] || "Unknown Title", // "Π Ρ Α Κ Τ Ι Κ Α Β Ο Υ Λ Η Σ"
    period: pData[1] || "Unknown Period", // "Η’ ΠΕΡΙΟΔΟΣ (ΠΡΟΕΔΡΕΥΟΜΕΝΗΣ ΔΗΜΟΚΡΑΤΙΑΣ)"
    session: pData[2] || "Unknown Session", // "Σ Υ Ν Ο Δ Ο Σ Α’ "
    meeting: pData[3] || "Unknown Meeting", // "ΣΥΝΕΔΡΙΑΣΗ ΟΒ’ "
    session_date: pData[4] || defaultDate, // "Τρίτη 1 Μαρτίου 1994"
  };
}


// Helper function to send parliament session data to Strapi
async function sendParliamentSessionToStrapi(parliamentSessionData, STRAPI_URL, API_TOKEN) {
  try {
    const parliamentResponse = await axios.post(
      `${STRAPI_URL}/api/parliament-sessions`,
      { data: parliamentSessionData },
      {
        headers: {
          Authorization: `Bearer ${API_TOKEN}`,
          'Content-Type': 'application/json',
        }
      }
    );
    console.log("Parliament Session imported successfully: ", parliamentResponse.data);
    return parliamentResponse.data.data.documentId;

  } catch (error) {
    // console.log("HERE: ",error.response.data);
    const message = error.response.data.error.message;
    const status = error.response.status;
    if (error.response && status === 400 && message === "This attribute must be unique") {
      console.log("Parliament Session already exists with the same title and date: ");
      return null;
    } else {
      console.log(message);
      throw error;
    }
  }
}


// Function to connect Parliament Session to Debate using documentId
async function connect(parliamentSessionId, debateId, STRAPI_URL, API_TOKEN) {
  if (!parliamentSessionId || !debateId) {
    console.log("Skipping relationship establishment due to missing IDs.");
    return;
  }

  try {
    await axios.put(
      `${STRAPI_URL}/api/parliament-sessions/${parliamentSessionId}`,
      {
        data: {
          debate: {
            connect: [debateId]  // Use documentId in the connect array
          }
        }
      },
      {
        headers: {
          Authorization: `Bearer ${API_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );
    console.log("Relationship between Parliament Session and Debate established successfully.");
  } catch (error) {
    console.error("Error establishing relationship:", error.response ? error.response.data : error);
    throw error;
  }
}


// Helper function to extract speech data from JSON and format it for Strapi
function extractSpeechData(speech, debateId) {
  const content = speech.p.map(paragraph => paragraph._); // Collect paragraphs in an array for JSON content
  const eId = speech.$.eId; // Unique ID for the speech
  const speakerName = speech.$.by || "Unknown Speaker"; // Assuming `by` references the speaker
  const speakerId = eId; // Using eId as speaker ID if applicable

  return {
    speaker_name: speakerName,
    speaker_id: speakerId,
    content: content,
    // debate: debateId, // Link the speech to the debate
  };
}


// Function to add all speeches
async function addSpeechesToStrapi(jsonData, debateId, STRAPI_URL, API_TOKEN) {
  try {
    // Retrieve each speech entry from the JSON
    const speeches = jsonData.akomaNtoso.debate[0].debateBody[0].debateSection.flatMap(section =>
      section.speech
    );

    for (const speech of speeches) {
      const speechData = extractSpeechData(speech, debateId);

      // Inline function to create a Speech entry in Strapi
      await (async function sendSpeechToStrapi(speechData) {
        try {
          const response = await axios.post(
            `${STRAPI_URL}/api/speeches`,
            { data: speechData },
            {
              headers: {
                Authorization: `Bearer ${API_TOKEN}`,
                'Content-Type': 'application/json',
              },
            }
          );
          console.log("Speech added successfully:", response.data);
        } catch (error) {
          console.error("Error adding speech to Strapi:", error.response?.data || error);
        }
      })(speechData); // Immediately invoke sendSpeechToStrapi with speechData
    }
  } catch (error) {
    console.error("Error adding speeches to Strapi:", error);
  }
}



































// Fetch data from Strapi API
async function fetchData (STRAPI_URL, API_TOKEN) {
  const response = await axios.get(
    `${STRAPI_URL}/api/debates`, {
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
      }
    }
  );
  console.log("Fetched Data: ", response.data);
}

