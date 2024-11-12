import axios from 'axios';

// Helper function to extract speech data
function extractSpeechData(speech, debateId) {
  const content = {
    paragraphs: speech.p.map(paragraph => ({
      type: "paragraph",
      text: paragraph._ || paragraph,
    }))
  }

  const eId = speech.$.eId; // Unique ID for the speech
  const speakerName = speech.from[0] || "Unknown Speaker"; // Speaker's name
  const speaker_id = speech.$.by;

  return {
    speaker_name: speakerName,
    speaker_id: speaker_id,
    speech_id: eId,
    content: content,
    debate: debateId, // Link the speech to the debate ID in Strapi
  };
}


// Function to find speaker by speaker_id
async function findSpeakerId(speaker_id, STRAPI_URL, API_TOKEN) {
  try {
    const response = await axios.get(
      `${STRAPI_URL}/api/speakers?filters[speaker_id][$eq]=${speaker_id}`,
      {
        headers: {
          Authorization: `Bearer ${API_TOKEN}`,
        },
      }
    );


    // Check if the speaker exists and return the ID
    if (response.data.data.length > 0) {
      // console.log("I GOT IN THE CORRECT LOOP: ");
      return response.data.data[0].documentId;
    } else {
      console.error(`Speaker with ID ${speaker_id} not found.`);
      return null;
    }
  } catch (error) {
    console.error("Error finding speaker:", error.response ? error.response.data : error);
    throw error;
  }
}


// Function to connect Speech to Debate
async function connect(speechId, speechData, debateId, STRAPI_URL, API_TOKEN) {
  const speakerId = await findSpeakerId(speechData.speaker_id, STRAPI_URL, API_TOKEN);

  if (!speechId || !debateId) {
    console.log("Skipping relationship establishment due to missing IDs.");
    return;
  }

  try {
    await axios.put(
      `${STRAPI_URL}/api/speeches/${speechId}`,
      {
        data: {
          debate: {
            connect: [debateId]
          },
        }
      },
      {
        headers: {
          Authorization: `Bearer ${API_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );
    await axios.put(
      `${STRAPI_URL}/api/debates/${debateId}`,
      {
        data: {
          speeches: {
            connect: [speechId]
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

    if (speakerId) {
      await axios.put(
        `${STRAPI_URL}/api/speeches/${speechId}`,
        {
          data: {
            speaker: {
              connect: [speakerId]
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
      await axios.put(
        `${STRAPI_URL}/api/speakers/${speakerId}`,
        {
          data: {
            speeches: {
              connect: [speechId]
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
    }

    console.log(`Speech ${speechId} successfully connected to Debate ${debateId}.`);
  } catch (error) {
    console.error("Error establishing relationship between Speech and Debate:", error.response ? error.response.data : error);
    throw error;
  }
}

// Function to insert Speech data into Strapi
export async function insertSpeech(jsonData, debateId, STRAPI_URL, API_TOKEN) {
  try {
    // Extract the speech data from jsonData
    const speeches = jsonData.akomaNtoso.debate[0].debateBody[0].debateSection.flatMap(
      section => section.speech || []
    );

    // Iterate over each speech and insert it into Strapi
    for (const speech of speeches) {
      const speechData = extractSpeechData(speech, debateId);

      console.log("THIS IS THE SPEECH DATA: ", speechData);

      // Insert the speech data into Strapi
      const response = await axios.post(
        `${STRAPI_URL}/api/speeches`,
        { data: speechData },
        {
          headers: {
            Authorization: `Bearer ${API_TOKEN}`,
            'Content-Type': 'application/json',
          }
        }
      );
      const speechId = response.data.data.documentId;
      console.log("Speech inserted successfully:", speechData.speech_id);

      await connect(speechId, speechData, debateId, STRAPI_URL, API_TOKEN);
    }
  } catch (error) {
    console.error("Error inserting speech:", error.response ? error.response.data : error);
    throw error;
  }
}
