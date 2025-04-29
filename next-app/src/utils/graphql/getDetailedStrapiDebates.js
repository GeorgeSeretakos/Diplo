import axios from "axios";
import { constants } from "@constants/constants.js";

const STRAPI_URL = constants.STRAPI_URL;

export async function getDetailedStrapiDebates({ ids, offset = 0, limit = 10000, sortBy = "newest" }) {
  console.log("Debate ids received from util: ", ids);

  const query = `
    query {
      debates(
        filters: { documentId: { in: [${ids.map(id => `"${id}"`).join(", ")}] } }
        pagination: { start: ${offset}, limit: ${limit} }
        sort: "date:${sortBy === "oldest" ? "asc" : "desc"}"
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

  // console.log("Query: ", query);

  const response = await axios.post(`${STRAPI_URL}/graphql`, { query }, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response?.data?.data?.debates || [];
}
