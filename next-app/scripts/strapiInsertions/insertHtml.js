import axios from "axios";


// Helper function to connect Parliament Session to Debate using documentId
async function connect(htmlId, debateId, STRAPI_URL, API_TOKEN) {
  if (!htmlId || !debateId) {
    console.log("Skipping relationship establishment due to missing IDs.");
    return;
  }

  try {
    await axios.put(
      `${STRAPI_URL}/api/htmls/${htmlId}`,
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
          html: {
            connect: [htmlId]  // Use documentId in the connect array
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
export async function insertHtml(htmlData, debateId, STRAPI_URL, API_TOKEN) {

  try {
    const htmlResponse = await axios.post(
      `${STRAPI_URL}/api/htmls`,
      {
        data: {
          html: htmlData
        }},
      {
        headers: {
          Authorization: `Bearer ${API_TOKEN}`,
          'Content-Type': 'application/json',
        }
      }
    );
    const htmlId = htmlResponse.data.data.documentId;
    // console.log("HERE IS THE DOCUMENT ID OF THE PARLIAMENT SESSION: ", parliamentSessionId);

    // console.log("HTML imported successfully: ", htmlResponse.data);
    console.log("HTML imported successfully.");

    await connect(htmlId, debateId, STRAPI_URL, API_TOKEN);
    return htmlId;

  } catch (error) {
    console.log("Error inserting HTML: ",error.response.data);
    return null;
  }
}

