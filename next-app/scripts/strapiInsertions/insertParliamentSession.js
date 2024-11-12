import axios from "axios";

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

// Helper function to connect Parliament Session to Debate using documentId
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

    await axios.put(
      `${STRAPI_URL}/api/debates/${debateId}`,
      {
        data: {
          parliament_session: {
            connect: [parliamentSessionId]  // Use documentId in the connect array
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


// Function to send parliament session data to Strapi
export async function insertParliamentSession(jsonData, debateId, STRAPI_URL, API_TOKEN) {
  const parliamentSessionData = extractParliamentSessionData(jsonData, debateId);

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
    const parliamentSessionId = parliamentResponse.data.data.documentId;
    // console.log("HERE IS THE DOCUMENT ID OF THE PARLIAMENT SESSION: ", parliamentSessionId);

    console.log("Parliament Session imported successfully: ", parliamentResponse.data);

    await connect(parliamentSessionId, debateId, STRAPI_URL, API_TOKEN);

    return parliamentSessionId;

  } catch (error) {
      console.log("Error inserting parliament session: ",error.response.data);
      return null;
  }
}

