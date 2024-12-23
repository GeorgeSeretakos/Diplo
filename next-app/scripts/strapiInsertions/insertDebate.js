import axios from "axios";

// Helper function to extract debate data
function extractDebateData(jsonData) {
  const dData = jsonData.akomaNtoso.debate[0].meta[0].identification[0];
  const opening_section = jsonData.akomaNtoso.debate[0].debateBody[0].debateSection[0].p[0];
  return {
    title: dData.FRBRWork[0].FRBRalias[0].$.value,
    date: dData.FRBRWork[0].FRBRdate[0].$.date,
    country: dData.FRBRWork[0].FRBRcountry[0].$.value,
    language: dData.FRBRExpression[0].FRBRlanguage[0].$.language,
    opening_section: opening_section
  };
}

// Function to send debate to Strapi
export async function insertDebate(jsonData, STRAPI_URL, API_TOKEN) {
  const debateData = extractDebateData(jsonData);

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
    // console.log("Debate imported successfully: ", debateResponse.data);
    console.log("Debate imported successfully.");
    return debateResponse.data.data.documentId;

  } catch (error) {
    console.log(error.response ? error.response.data : error);
    // throw error;
  }
}