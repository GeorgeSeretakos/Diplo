import axios from "axios";
import { constants } from "@constants/constants.js";

const STRAPI_URL = constants.STRAPI_URL;

export async function getSpeakerDebateIds({ speakerId, offset = 0, limit = 10000 }) {
  console.log("Util received speakerId: ", speakerId);
  try {
    const query = `
      query {
        speakers(
          filters: { documentId: { eq: "${speakerId}" } }
        ) {
          debates(
            pagination: { start: ${offset}, limit: ${limit} } 
          ) {
            documentId
          }
        }
      }
    `;

    // console.log("Query: ", query);

    const response = await axios.post(`${STRAPI_URL}/graphql`, { query }, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response?.data?.data?.speakers?.[0]?.debates || [];
  } catch (error) {
    console.error("Failed to fetch speaker debates:", error);
    throw error;
  }
}