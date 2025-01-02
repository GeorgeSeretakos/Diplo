import axios from "axios";
import { constants } from "../../../../../../constants/constants.js";
import {start} from "node:repl";

const STRAPI_URL = constants.STRAPI_URL;
const API_TOKEN = constants.API_TOKEN;

export async function POST(req) {
  const body = await req.json();
  const { startDate, endDate } = body;
  console.log("Received: ", startDate, endDate);

  try {

    // Construct GraphQL query dynamically based on provided filters
    const filters = [];
    if (startDate) filters.push(`gte: "${startDate}"`);
    if (endDate) filters.push(`lte: "${endDate}"`);

    console.log("Filters Array: ", filters);

    const filtersClause = filters.length > 0 ? `filters: { date: { ${filters.join(", ")} } }` : "";

    console.log("Where Clause: ", filtersClause);

    // Define the GraphQL query
    const query = `
      query {
        debates(${filtersClause}) {
          documentId
          date
          period
          meeting
          session
          topics {
            topic
          }
        }
      }
    `;

    console.log("Constructed query: ", query);

    const response = await axios.post(
      `${STRAPI_URL}/graphql`,
      { query },
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
