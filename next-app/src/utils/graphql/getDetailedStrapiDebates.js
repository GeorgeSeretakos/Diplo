import axios from "axios";
import { constants } from "@constants/constants.js";

const STRAPI_URL = constants.STRAPI_URL;

export async function getDetailedStrapiDebates({ ids, offset = 0, limit = 10000, sortBy = "newest", fetchAll = false }) {
  console.log("Debate ids received from getDetailedStrapiDebates util: ", ids);

  if (!fetchAll && (!ids || ids.length === 0)) {
    return [];
  }

  const sort = sortBy === "newest" ? "date:desc" : "date:asc";

  let filtersPart = "";
  if (!fetchAll && ids && ids.length > 0) {
    filtersPart = `filters: { documentId: { in: [${ids.map(id => `"${id}"`).join(", ")}] } },`;
  }

  const query = `
    query {
      debates(
        ${filtersPart}
        pagination: { start: ${offset}, limit: ${limit} }
        sort: "${sort}"
      ) {
        documentId
        date
        title
        session
        meeting
        period
        topics { topic }
      }
    }
  `;

  console.log("get detailed strapi debates util query: ", query);

  const response = await axios.post(`${STRAPI_URL}/graphql`, { query }, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response?.data?.data?.debates || [];
}
