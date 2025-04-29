import axios from "axios";
import { constants } from "@constants/constants.js";
import {removeAccents} from "@utils/removeTones.js";

const STRAPI_URL = constants.STRAPI_URL;
const API_TOKEN = constants.API_TOKEN;


export async function searchSpeakersStrapiFilters({
  speakerName,
  ageRange,
  gender,
  parties,
}) {
  const filters = [];

  if (speakerName) filters.push(`speaker_name: { containsi: "${removeAccents(speakerName.trim()).toUpperCase()}" }`);

  if (ageRange && ageRange.min !== undefined && ageRange.max !== undefined) {
    filters.push(`age: { between: [${ageRange.min}, ${ageRange.max}] }`);
  }

  if (gender) {
    if (gender === "male") {
      filters.push(`gender: { in: ["άνδρας", "ανδρας"] }`);
    } else if (gender === "female") {
      filters.push(`gender: { in: ["γυναίκα", "γυναικα"] }`);
    } else {
      filters.push(`gender: { eq: "${gender}" }`);
    }
  }

  if (parties?.length) filters.push(`political_parties: { name: { in: [${parties.map(p => `"${p}"`).join(", ")}] } }`);

  const query = `
    query {
      speakers(
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

  return response?.data?.data?.speakers || [];
}
