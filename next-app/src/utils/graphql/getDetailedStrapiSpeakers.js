import axios from "axios";
import {constants} from "@constants/constants.js";

const STRAPI_URL = constants.STRAPI_URL;

export async function getDetailedStrapiSpeakers({ ids = [], offset = 0, limit = 1000, }) {

  const query = `
    query {
      speakers(
        filters: { documentId: { in: [${ids.map(id => `"${id}"`).join(", ")}] } }
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

