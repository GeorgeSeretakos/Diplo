import { constants } from "../../../../../../constants/constants.js";

const STRAPI_URL = constants.STRAPI_URL;
const API_TOKEN = constants.API_TOKEN;

export async function GET() {
  const query = `
    {
      debates(pagination: { limit: -1 }) {
        documentId
        title
        date
        period
        session_date
        session
        meeting
        topics {
          topic
        }
      }
    }
  `;

  try {
    const response = await fetch(`${STRAPI_URL}/graphql`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_TOKEN}`,
      },
      body: JSON.stringify({ query }),
    });

    const responseBody = await response.json();

    // Check for errors in the GraphQL response
    if (responseBody.errors) {
      console.error("GraphQL errors:", responseBody.errors);
      return new Response(
        JSON.stringify({ error: responseBody.errors.map((e) => e.message).join(", ") }),
        { status: 500 }
      );
    }

    // Ensure debates data is returned properly
    const debates = responseBody.data?.debates || [];
    return new Response(JSON.stringify(debates), { status: 200 });
  } catch (error) {
    console.error("Error fetching debates via GraphQL:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch debates" }), { status: 500 });
  }
}
