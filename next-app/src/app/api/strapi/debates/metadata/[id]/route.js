import { constants } from "../../../../../../../constants/constants.js";

const STRAPI_URL = constants.STRAPI_URL;
const API_TOKEN = constants.API_TOKEN;

export async function GET(request, { params }) {
  const { id } = params; // Extract the dynamic `id` from the URL

  if (!id) {
    return new Response(JSON.stringify({ error: "Debate ID is required" }), { status: 400 });
  }

  // Define the GraphQL query
  const query = `
    query GetDebate($id: ID!) {
      debate(documentId: $id) {
        documentId
        title
        opening_section
        summary
        topics {
          topic
        }
        parliament_session {
          period
          session_date
          session
          meeting
        }
        speakers(pagination: { limit: -1 }) {  # Fetch all speakers
          speaker_id
          speaker_name
          image {
            formats
            url
          }
        }
        political_parties {
          name
          image {
            url
          }
        }
      }
    }
  `;

  // Send the request to Strapi's GraphQL endpoint
  try {
    const response = await fetch(`${STRAPI_URL}/graphql`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_TOKEN}`, // Add API token for authorization
      },
      body: JSON.stringify({
        query, // The GraphQL query
        variables: { id }, // Pass the `id` as a variable
      }),
    });

    const data = await response.json();

    // Handle errors from the GraphQL response
    if (data.errors) {
      return new Response(
        JSON.stringify({ error: data.errors.map((e) => e.message).join(", ") }),
        { status: 500 }
      );
    }

    // Return the data from the GraphQL response
    return new Response(JSON.stringify(data.data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    // Handle network or server errors
    console.error("Error fetching debate data:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
  }
}