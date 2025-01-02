import axios from "axios";
import { constants } from "../../../../../../constants/constants.js";

const STRAPI_URL = constants.STRAPI_URL;
const API_TOKEN = constants.API_TOKEN;

export async function POST(req) {
  try {
    console.log("I am in the right place");

    const body = await req.json();
    const { startDate, endDate } = body;

    console.log("Received: ", startDate, endDate);

    // Define the GraphQL query
    const query = `
      query GetDebates($startDate: Date, $endDate: Date) {
        debates(
          filters: {
            date: {
              ${startDate ? "gte: $startDate" : ""}
              ${endDate ? "lte: $endDate" : ""}
            }
          }
        ) {
          documentId
          date
          topics {
            topic
          }
          parliament_session {
            period
            meeting
            session
          }
        }
      }
    `;

    // Construct variables for the query
    const variables = {};
    if (startDate) variables.startDate = startDate;
    if (endDate) variables.endDate = endDate;

    console.log("Constructed query: ", query);
    console.log("Variables: ", variables);

    const response = await axios.post(
      `${STRAPI_URL}/graphql`,
      { query, variables },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_TOKEN}`,
        },
      }
    );

    console.log("Response data: ", response.data);

    // Extract debates or return an empty array
    const debates = response.data?.data?.debates || [];
    return new Response(JSON.stringify(debates), { status: 200 });
  } catch (error) {
    console.error("Error fetching debates via GraphQL: ", error.message);
    console.error("GraphQL error details: ", error.response?.data);

    const errorMessage =
      error.response?.data?.error || "Failed to fetch debates by date range.";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: error.response?.status || 500,
    });
  }
}
