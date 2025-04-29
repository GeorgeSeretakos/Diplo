import { constants } from "../../../../../../../constants/constants.js";

const STRAPI_URL = constants.STRAPI_URL;

export async function GET(request, { params }) {
  const { id } =await params; // Extract the dynamic `id` from the URL

  if (!id) {
    return new Response(JSON.stringify({ error: "Speaker ID is required" }), { status: 400 });
  }

  // Define the GraphQL query
  const query = `
    query GetSpeaker($id: ID!) {
      speaker(documentId: $id) {
        documentId
        speaker_name
        description
        image {
          formats
          url
        }
        date_of_birth
        link
        place_of_birth
        date_of_death
        educated_at
        occupation
        website
        languages
        political_parties {
          name
          image {
            formats
            url
          }
        }
        debates {
          documentId
          title
          date
          period
          session
          meeting
          topics {
            topic
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
      },
      body: JSON.stringify({
        query,
        variables: { id },
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
    console.error("Error fetching speaker data:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
  }
}