import axios from "axios";
import { constants } from "../../../../../../constants/constants.js";

export async function GET() {
  console.log("API got called");

  const STRAPI_URL = constants.STRAPI_URL;
  const API_TOKEN = constants.API_TOKEN;

  try {
    const query = `
      query {
        topics (pagination: { limit: -1 }) {
          topic
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

    // Return response data
    return new Response(JSON.stringify(response.data.data.topics), { status: 200 });
  } catch (error) {
    console.error("Error fetching data via GraphQL:", error);
    return new Response("Error fetching data via GraphQL", { status: 500 });
  }
}
