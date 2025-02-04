import axios from 'axios';
import path from "path";
import fs from "fs";

async function extractSpeechData(speech, debateId, uniqueSpeakers, list_of_null_speakers, STRAPI_URL, API_TOKEN) {
  const content = {
    paragraphs: (speech.p || []).map(paragraph => paragraph._ || paragraph)
  };

  const eId = speech.$.eId; // Unique ID for the speech
  const speakerName = speech.from[0] || "Unknown Speaker"; // Speaker's name
  const speaker_id = speech.$.by;

  // There is a mismatch between the speaker of the speech, and the speakers stated at the begging of the debate
  if (!(uniqueSpeakers.some(speaker => speaker['$'].eId === speaker_id))) {
    list_of_null_speakers.push({
      speakerId: speaker_id
    });
  }

  const speakerId = await findSpeakerId(speaker_id, STRAPI_URL, API_TOKEN);

  return {
    speaker_name: speakerName,
    speaker_id: speaker_id,
    speech_id: eId,
    content: content,
    debates: debateId,
    speakers: speakerId ? speakerId : null
  };
}

async function findSpeakerId(speaker_id, STRAPI_URL, API_TOKEN) {
  try {
    const response = await axios.get(
      `${STRAPI_URL}/api/speakers?filters[speaker_id][$eq]=${speaker_id}`,
      { headers: { Authorization: `Bearer ${API_TOKEN}` } }
    );

    if (response.data.data.length > 0) {
      return response.data.data[0].documentId;
    } else {
      console.error(`Speaker with ID ${speaker_id} not found.`);
      return null;
    }
  } catch (error) {
    console.error("Error finding speakerId:", error.response ? error.response.data : error);
    throw error;
  }
}

// New function to extract and combine speech content
function extractCombinedSpeechContent(speeches) {
  let combinedText = "";

  for (const speech of speeches) {
    if (speech.p) {
      const speechText = speech.p.map(paragraph => paragraph._ || paragraph).join(" ");
      combinedText += speechText + " ";
    }
  }

  return combinedText.trim(); // Remove trailing space
}

export async function insertSpeech(jsonData, debateId, uniqueSpeakers, STRAPI_URL, API_TOKEN) {
  let list_of_null_speakers = [];

  try {
    const speeches = jsonData.akomaNtoso.debate[0].debateBody[0].debateSection.flatMap(
      section => section.speech || []
    );

    // Extract combined speech content
    const combinedSpeechContent = extractCombinedSpeechContent(speeches);

    const outputFile = path.join(process.cwd(), 'public', 'data', 'summary', 'test');
    fs.writeFileSync(outputFile, JSON.stringify(combinedSpeechContent, null, 2), 'utf8');

    for (const speech of speeches) {
      if (!speech.$?.eId || !speech.from) {
        console.log("Skipping speech due to missing essential fields:", speech);
        continue;
      }

      const speechData = await extractSpeechData(speech, debateId, uniqueSpeakers, list_of_null_speakers, STRAPI_URL, API_TOKEN);
      const response = await axios.post(
        `${STRAPI_URL}/api/speeches?populate=false`,
        {
          data: speechData,
        },
        { headers: { Authorization: `Bearer ${API_TOKEN}`, 'Content-Type': 'application/json' } }
      );

      const speechId = response.data.data.documentId;
      console.log("✅", speechData.speech_id);
    }

    return list_of_null_speakers;

  } catch (error) {
    console.error(`❌ Error inserting speech: ${error.response ? error.response.data : error}`);
    throw error;
  }
}