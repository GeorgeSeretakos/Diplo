import { constants } from "../../../../../constants/constants.js";

const STRAPI_URL = constants.STRAPI_URL;
const API_TOKEN = constants.API_TOKEN;

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");

  if (!startDate || !endDate) {
    return new Response(
      JSON.stringify({ error: "Both startDate and endDate are required." }),
      { status: 400 }
    );
  }

  try {
    const response = await fetch(
      `${STRAPI_URL}/api/debates?filters[date][$gte]=${startDate}&filters[date][$lte]=${endDate}&populate=*`,
      {
        headers: {
          Authorization: `Bearer ${API_TOKEN}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch debates from Strapi.");
    }

    const data = await response.json();
    return new Response(JSON.stringify(data?.data || []), { status: 200 });
  } catch (error) {
    console.error("Error fetching debates by date range: ", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch debates by date range." }),
      { status: 500 }
    );
  }
}
