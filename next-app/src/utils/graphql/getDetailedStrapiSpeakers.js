import axios from "axios";
import {constants} from "@constants/constants.js";

const STRAPI_URL = constants.STRAPI_URL;

export async function getDetailedStrapiSpeakers({
ids = [],
offset = 0,
limit = 1000,
fetchAll = false,
}) {

  if (!fetchAll && (!ids || ids.length === 0)) {
    return [];
  }

  const filtersBlock = !fetchAll && ids.length > 0
    ? `filters: { documentId: { in: [${ids.map(id => `"${id}"`).join(", ")}] } },`
    : "";

  const query = `
    query {
      speakers(
        ${filtersBlock}
        pagination: { start: ${offset}, limit: ${limit} } 
      ) {
        documentId
        speaker_name
        image {
          formats
          url
        }
        age
      }
    }
  `;

  const response = await axios.post(`${STRAPI_URL}/graphql`, { query }, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response?.data?.data?.speakers || [];
}

