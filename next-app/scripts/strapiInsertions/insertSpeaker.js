import axios from "axios";

// Helper function to extract speech data
export function extractSpeakerData(speaker, debateId) {
  return {
    speaker_name: speaker.showAs,
    speaker_id: speaker.eId,
    link: speaker.href,
    debates: debateId
  }
}


// Function to find or create a speaker
async function findOrCreateSpeaker(speakerData, STRAPI_URL, API_TOKEN) {
  // console.log("LOOK HERE FOR SPEAKER DATA: ", speakerData);
  try {
    // Attempt to find the speaker by unique field (e.g., speaker_id)
    const response = await axios.get(
      `${STRAPI_URL}/api/speakers?filters[speaker_id][$eq]=${speakerData.speaker_id}`,
      {
        headers: {
          Authorization: `Bearer ${API_TOKEN}`,
        },
      }
    );

    // If speaker exists, return its ID
    if (response.data.data.length > 0) {
      console.log(`Speaker ${speakerData.speaker_name} with documentId ${response.data.data} already exists.`);
      return response.data.data[0].documentId;
    }

    // If speaker does not exist, create a new speaker
    const createResponse = await axios.post(
      `${STRAPI_URL}/api/speakers`,
      { data: speakerData },
      {
        headers: {
          Authorization: `Bearer ${API_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );

    // console.log("HERE IS THE PLACE YOU SHOULD LOOK FOR THE NEW SPEAKER: ", response.data.data);
    console.log(`Speaker ${speakerData.speaker_name} created successfully.`);
    return createResponse.data.data.documentId;
  } catch (error) {
    console.error("Error finding or creating speaker:", error.response ? error.response.data : error);
    throw error;
  }
}



async function connect(speakerId, debateId, STRAPI_URL, API_TOKEN) {
  if (!speakerId || !debateId) {
    console.log("Skipping relationship establishment due to missing IDs.");
    return;
  }

  try {
    await axios.put(
      `${STRAPI_URL}/api/speakers/${speakerId}`,
      {
        data: {
          debates: {
            connect: [debateId]
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
      `${STRAPI_URL}/api/debates/${debateId}`,
      {
        data: {
          speakers: {
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

    console.log(`Speaker ${speakerId} successfully connected to Debate ${debateId}`);
  } catch (error) {
    console.error("Error establishing relationship between Speaker and Debate:", error.response ? error.response.data : error);
    throw error;
  }
}

// Main function to handle speaker insertion or connection
export async function insertSpeaker(jsonData, debateId, STRAPI_URL, API_TOKEN) {
  try {
    // Extract the speaker data from jsonData
    const speakers = jsonData.akomaNtoso.debate[0].meta[0].references[0].TLCPerson;

    // Iterate over each speaker and insert/connect it in Strapi
    for (const speaker of speakers) {
      const speakerData = extractSpeakerData(speaker.$, debateId);

      // Find or create the speaker, and get the speaker ID
      const speakerId = await findOrCreateSpeaker(speakerData, STRAPI_URL, API_TOKEN);

      // Connect the speaker to the debate, even if they already existed
      await connect(speakerId, debateId, STRAPI_URL, API_TOKEN);
    }
  } catch (error) {
    console.error("Error inserting or connecting speaker:", error.response ? error.response.data : error);
    throw error;
  }
}