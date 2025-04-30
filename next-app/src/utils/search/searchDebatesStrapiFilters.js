import axios from "axios";
import { constants } from "@constants/constants.js";

const STRAPI_URL = constants.STRAPI_URL;
const API_TOKEN = constants.API_TOKEN;

export async function searchDebatesStrapiFilters({
                                                   startDate,
                                                   endDate,
                                                   session,
                                                   meeting,
                                                   period,
                                                   topics,
                                                   speakers,
                                                 }) {
  const andFilters = [];

  // Date filter
  const dateParts = [];
  if (startDate) dateParts.push(`gte: "${startDate}"`);
  if (endDate) dateParts.push(`lte: "${endDate}"`);
  if (dateParts.length > 0) {
    andFilters.push(`{ date: { ${dateParts.join(", ")} } }`);
  }

  // Session / Meeting / Period
  if (session) andFilters.push(`{ session: { eq: "${session}" } }`);
  if (meeting) andFilters.push(`{ meeting: { eq: "${meeting}" } }`);
  if (period) andFilters.push(`{ period: { eq: "${period}" } }`);

  // Topics
  if (topics?.length > 0) {
    const topicsList = topics.map(t => `"${t}"`).join(", ");
    andFilters.push(`{ topics: { topic: { in: [${topicsList}] } } }`);
  }

  // Speakers (each must appear)
  if (speakers?.length > 0) {
    for (const s of speakers) {
      andFilters.push(`{ speakers: { speaker_name: { eq: "${s}" } } }`);
    }
  }

  // Final filter block
  const filterBlock = andFilters.length > 0
    ? `filters: { and: [${andFilters.join(", ")}] },`
    : "";

  // Final query
  const query = `
    query {
      debates(
        ${filterBlock}
        pagination: { limit: 10000 }
      ) {
        documentId
      }
    }
  `;

  console.log("Query sent to Strapi:\n", query);

  try {
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

    return response?.data?.data?.debates || [];
  } catch (error) {
    console.error("Strapi GraphQL request failed:", error.response?.data || error.message);
    throw error;
  }
}
