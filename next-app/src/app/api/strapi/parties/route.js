import axios from "axios";
import { constants } from "../../../../../constants/constants.js";

export async function GET() {
  console.log("API got called");

  const STRAPI_URL = constants.STRAPI_URL;
  const API_TOKEN = constants.API_TOKEN;

  try {
    const query = `
      query {
        politicalParties (pagination: { limit: -1 }) {
          documentId
          name
          image {
            formats
            url
          }
        }
      }
    `;

    // Make POST request to Strapi's GraphQL endpoint
    const response = await axios.post(
      `${STRAPI_URL}/graphql`,
      { query },
      {
        headers: {
          Authorization: `Bearer ${API_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("GraphQL Response:", response.data.data);

    // Return response data
    return new Response(JSON.stringify(response.data.data.politicalParties), { status: 200 });
  } catch (error) {
    console.error("Error fetching data via GraphQL:", error);
    return new Response("Error fetching data via GraphQL", { status: 500 });
  }
}
