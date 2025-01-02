import axios from "axios";
import { constants } from "../../../../../../constants/constants.js";

export async function POST(req) {
  console.log("API got called");

  const { session, meeting, period } = await req.json(); // Parse the request body
  const STRAPI_URL = constants.STRAPI_URL;
  const API_TOKEN = constants.API_TOKEN;

  console.log("Received: ", session, meeting, period);

  try {
    // Construct GraphQL query dynamically based on provided filters
    const filters = [];
    if (session) filters.push(`session: { eq: "${session}" }`);
    if (meeting) filters.push(`meeting: { eq: "${meeting}" }`);
    if (period) filters.push(`period: { eq: "${period}" }`);

    console.log("Filters Array: ", filters);

    const filtersClause = filters.length > 0 ? `filters: { ${filters.join(", ")} }` : "";

    console.log("Where Clause: ", filtersClause);

    const query = `
      query {
        debates(${filtersClause}) {
            documentId
            date
            session
            meeting
            period
            topics {
              topic
            }
        }
      }
      `;

    console.log("GraphQL Query:", query);

    // Make POST request to Strapi's GraphQL endpoint
    const response = await axios.post(
      `${STRAPI_URL}/graphql`,
      { query },
      {
        headers: {
          Authorization: `Bearer ${API_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("GraphQL Response:", response.data.data);
    return new Response(JSON.stringify(response.data.data.debates), { status: 200 });

  } catch (error) {
    console.error("Error fetching data via GraphQL:", error);
    return new Response("Error fetching data via GraphQL", { status: 500 });
  }
}
