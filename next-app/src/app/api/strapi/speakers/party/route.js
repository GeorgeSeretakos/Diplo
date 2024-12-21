import { constants } from "../../../../../../constants/constants.js";

const STRAPI_URL = constants.STRAPI_URL;
const API_TOKEN = constants.API_TOKEN;

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const partyName = searchParams.get("party"); // Retrieve 'party' query param

  if (!partyName) {
    return new Response(JSON.stringify({ error: "Political party name is required" }), { status: 400 });
  }

  try {
    const response = await fetch(
      `${STRAPI_URL}/api/speakers?filters[political_parties][name][$containsi]=${partyName}&populate=*`,
      {
        headers: { Authorization: `Bearer ${API_TOKEN}` },
      }
    );
    const data = await response.json();
    return new Response(JSON.stringify(data?.data || []), { status: 200 });
  } catch (error) {
    console.error("Error fetching speakers by political party:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch speakers" }), { status: 500 });
  }
}
