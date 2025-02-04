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
        period
        session_date
        session
        meeting
        speakers(pagination: { limit: -1 }) {  # Fetch all speakers
          documentId
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
        Authorization: `Bearer ${API_TOKEN}`,
      },
      body: JSON.stringify({
        query,
        variables: { id },
      }),
    });
    const data = await response.json();

    if (data.errors) {
      return new Response(
        JSON.stringify({ error: data.errors.map((e) => e.message).join(", ") }),
        { status: 500 }
      );
    }

    return new Response(JSON.stringify(data.data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching debate data:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
  }
}