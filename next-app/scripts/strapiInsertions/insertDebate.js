import axios from "axios";

// Helper function to extract debate data
function extractDebateData(jsonData) {
  const dData = jsonData.akomaNtoso.debate[0].meta[0].identification[0];
  const pData = jsonData.akomaNtoso.debate[0].preface[0].container[0].p;
  const opening_section = jsonData.akomaNtoso.debate[0].debateBody[0].debateSection[0].p[0];
  return {
    title: dData.FRBRWork[0].FRBRalias[0].$.value,
    date: dData.FRBRWork[0].FRBRdate[0].$.date,
    opening_section: opening_section,
    period: pData[1] || "Unknown Period", // "Η’ ΠΕΡΙΟΔΟΣ (ΠΡΟΕΔΡΕΥΟΜΕΝΗΣ ΔΗΜΟΚΡΑΤΙΑΣ)"
    session: pData[2] || "Unknown Session", // "Σ Υ Ν Ο Δ Ο Σ Α’ "
    meeting: pData[3] || "Unknown Meeting", // "ΣΥΝΕΔΡΙΑΣΗ ΟΒ’ "
    session_date: pData[4] || "Unknown Session Date", //
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
    console.log("Debate imported successfully.");
    return debateResponse.data.data.documentId;

  } catch (error) {
    console.log(error.response ? error.response.data : error);
    // throw error;
  }
}