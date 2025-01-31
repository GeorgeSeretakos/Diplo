import axios from "axios";

// Helper function to extract debate data
function extractDebateData(jsonData, htmlData) {
  const dData = jsonData.akomaNtoso.debate[0].meta[0].identification[0];
  const pData = jsonData.akomaNtoso.debate[0].preface[0].container[0].p;
  const opening_section = jsonData.akomaNtoso.debate[0].debateBody[0].debateSection[0].p[0];

  // Extract the speech data from jsonData
  const speeches = (jsonData.akomaNtoso.debate[0].debateBody[0].debateSection.flatMap(
    section => section.speech || []
  ));

  return {
    title: dData.FRBRWork[0].FRBRalias[0].$.value,
    date: dData.FRBRWork[0].FRBRdate[0].$.date,
    opening_section: opening_section,
    period: pData[1] || "Unknown Period",
    session: pData[2] || "Unknown Session",
    meeting: pData[3] || "Unknown Meeting",
    session_date: pData[4] || "Unknown Session Date",
    content: speeches,
    // HTML: htmlData
  };
}

export async function insertDebate(jsonData, htmlData, STRAPI_URL, API_TOKEN) {
  const debateData = extractDebateData(jsonData, htmlData);

  try{

    const debateResponse = await axios.post(
      `${STRAPI_URL}/api/debates?populate=false`,
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
    console.log(`❌ ${error}`);
  }
}