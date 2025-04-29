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
  speakers
}) {
  const filters = [];

  const dateFilterParts = [];
  if (startDate) dateFilterParts.push(`gte: "${startDate}"`);
  if (endDate) dateFilterParts.push(`lte: "${endDate}"`);
  if (dateFilterParts.length > 0) {
    filters.push(`date: { ${dateFilterParts.join(", ")} }`);
  }

  if (session) filters.push(`session: { eq: "${session}" }`);
  if (meeting) filters.push(`meeting: { eq: "${meeting}" }`);
  if (period) filters.push(`period: { eq: "${period}" }`);
  if (topics?.length) filters.push(`topics: { topic: { in: [${topics.map(t => `"${t}"`).join(", ")}] } }`);
  if (speakers?.length) filters.push(`speakers: { speaker_name: { in: [${speakers.map(s => `"${s}"`).join(", ")}] } }`);

  const query = `
    query {
      debates(
        filters: { ${filters.join(", ")} }
        pagination: { limit: 10000 }
      ) {
        documentId
      }
    }
  `;

  const response = await axios.post(`${STRAPI_URL}/graphql`, { query }, {
    headers: {
      Authorization: `Bearer ${API_TOKEN}`,
      "Content-Type": "application/json",
    },
  });

  return response?.data?.data?.debates || [];
}
