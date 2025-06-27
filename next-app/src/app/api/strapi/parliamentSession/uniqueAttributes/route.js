import axios from "axios";
import {constants} from "../../../../../../constants/constants.js";

const STRAPI_URL = constants.STRAPI_URL;

export async function GET() {
  try {
    // Define the GraphQL query to fetch unique values
    const query = `
      query {
        debates(pagination: { limit: 6000 }) {
          session
          period
          meeting
        }
      }
    `;

    // Make a POST request to Strapi's GraphQL endpoint
    const response = await axios.post(
      `${STRAPI_URL}/graphql`,
      { query },
      { headers: { "Content-Type": "application/json", }, }
    );

    const data = response.data.data.debates;

    // Compute unique values for session, period, and meeting
    const sessions = [...new Set(data.map((item) => item.session))];
    const periods = [...new Set(data.map((item) => item.period))];
    const meetings = [...new Set(data.map((item) => item.meeting))];

    // Return the unique values as JSON
    return new Response(
      JSON.stringify({ sessions, periods, meetings }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching unique attributes:", error.message);

    // Return error message
    return new Response(
      JSON.stringify({ error: "Failed to fetch unique attributes" }),
      { status: 500 }
    );
  }
}
