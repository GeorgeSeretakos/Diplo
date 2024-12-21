import { constants } from "../../../../../../constants/constants.js";

const STRAPI_URL = constants.STRAPI_URL;
const API_TOKEN = constants.API_TOKEN;

export async function GET() {
  try {
    const response = await fetch(`${STRAPI_URL}/api/speakers?populate=*`, {
      headers: { Authorization: `Bearer ${API_TOKEN}` },
    });
    const data = await response.json();
    return new Response(JSON.stringify(data?.data || []), { status: 200 });
  } catch (error) {
    console.error("Error fetching all speakers:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch speakers" }), { status: 500 });
  }
}
