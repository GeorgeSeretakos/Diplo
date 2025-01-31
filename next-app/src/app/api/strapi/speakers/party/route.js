import axios from "axios";
import {constants} from "../../../../../../constants/constants.js";

export async function POST(req) {
  console.log("Fetch debates by topic API got called");

  const {partyNames} = await req.json();
  const STRAPI_URL = constants.STRAPI_URL;
  const API_TOKEN = constants.API_TOKEN;

  // const topicNames = ["Global Europe"];

  console.log("Received: ", partyNames);

  try {

    const query = `
      query ($partyNames: [String]!) {
        speakers(
          filters: { political_parties: { name: { in: $partyNames } } }
          pagination: { limit: -1 }
        ) {
          documentId
          speaker_name
          image {
            formats
            url
          }
          political_parties {
            documentId
            name
          }
        }
      }
    `;

    // console.log("GraphQL Query:", query);

    const response = await axios.post(
      `${STRAPI_URL}/graphql`,
      {
        query,
        variables: { partyNames }, // Properly pass variables
      },
      {
        headers: {
          Authorization: `Bearer ${API_TOKEN}`,
          "Content-Type": "application/json",
        }
      }
    );

    // console.log("GraphQL Response:", response.data.data);
    return new Response(JSON.stringify(response.data.data.speakers), {status: 200});


  } catch (error) {
    console.error("Error Details:", error.response?.data || error.message);
    return new Response("Failed to fetch debates associated with specific topics");
  }


}