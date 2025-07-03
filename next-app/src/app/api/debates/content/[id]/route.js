import dotenv from "dotenv";

dotenv.config();
const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL;

export async function GET(request, { params }) {
  const { id } = params;
  const { searchParams } = new URL(request.url);
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;

  if (!id) {
    return new Response(JSON.stringify({ error: "Debate document ID is required" }), { status: 400 });
  }

  const start = (page - 1) * limit;

  const query = `
    query GetSpeechesByDebate($debateId: ID!, $start: Int!, $limit: Int!) {
      debate(documentId: $debateId) {
        title
        speeches(pagination: { start: $start, limit: $limit }) {
          speech_id
          speaker_name
          documentId
          content
          speaker {
            documentId
            image {
              url
            }
          }
        }
      }
    }
  `

  try {
    const response = await fetch(`${STRAPI_URL}/graphql`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
        variables: {debateId: id, start, limit}
      })
    })


    if (!response.ok) {
      console.error(`Failed to fetch speeches: ${response.statusText}`);
    }

    const data = await response.json();

    return new Response(JSON.stringify(data), { status: 200 });
  } catch (error) {
    console.error("Error fetching speeches:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}
