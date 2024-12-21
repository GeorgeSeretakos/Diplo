import { constants } from "../../../../../../constants/constants.js";

const STRAPI_URL = constants.STRAPI_URL;
const API_TOKEN = constants.API_TOKEN;

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get("name"); // Retrieve 'name' query param

  if (!name) {
    return new Response(JSON.stringify({ error: "Speaker name is required" }), { status: 400 });
  }

  try {
    const upperCaseName = name.trim().toUpperCase();

    const response = await fetch(
      `${STRAPI_URL}/api/speakers?filters[speaker_name][$containsi]=${upperCaseName}&populate=*`,
      {
        headers: { Authorization: `Bearer ${API_TOKEN}` },
      }
    );
    const data = await response.json();
    return new Response(JSON.stringify(data?.data || []), { status: 200 });
  } catch (error) {
    console.error("Error fetching speakers by name:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch speakers" }), { status: 500 });
  }
}
