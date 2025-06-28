import axios from "axios";
import { constants } from "@constants/constants.js";

const STRAPI_URL = constants.STRAPI_URL;

export async function getDetailedStrapiDebates({
  ids,
  sortBy = "newest",
  fetchAll = false
}) {
  console.log("Debate ids received from getDetailedStrapiDebates util: ", ids);

  if (!fetchAll && (!ids || ids.length === 0)) {
    return [];
  }

  const filtersPart = !fetchAll && ids && ids.length > 0
    ? `filters: { documentId: { in: [${ids.map(id => `"${id}"`).join(", ")}] } },`
    : "";

  const query = `
    query {
      debates(
        ${filtersPart}
        pagination: { limit: 10000 }
        sort: "${sortBy === "newest" ? "date:desc" : "date:asc"}"
      ) {
        documentId
        date
        title
        session
        period
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