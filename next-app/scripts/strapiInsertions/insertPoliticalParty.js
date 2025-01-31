import uploadImageToStrapi from "../utils/uploadImageToStrapi.js";
import axios from "axios";

export default async function findOrCreatePoliticalParty(politicalParty, STRAPI_URL, API_TOKEN) {
  if(!politicalParty || !politicalParty.name) return null;

  try {
    const response = await axios.get(
      `${STRAPI_URL}/api/political-parties?filters[name][$eq]=${encodeURIComponent(politicalParty.name)}`,
      {
        headers: {Authorization: `Bearer ${API_TOKEN}`,},
      }
    );

    if (response.data.data.length > 0) {
      console.log(`Political Party ${politicalParty.name} with documentId ${response.data.data} already exists.`);
      return response.data.data[0].documentId;
    }

    else {
      let partyImageId = null;
      if (politicalParty.image) {
        partyImageId = await uploadImageToStrapi(politicalParty.image, STRAPI_URL, API_TOKEN);
      }

      const createResponse = await axios.post(
        `${STRAPI_URL}/api/political-parties?populate=false`,
        {
          data: {
            name: politicalParty.name,
            image: partyImageId,
          },
        },
        {headers: {Authorization: `Bearer ${API_TOKEN}`, 'Content-Type': 'application/json',},}
      );

      console.log(`Poliitcal party ${politicalParty.name} created successfully.`);
      return createResponse.data.data.documentId;
    }

  } catch (error) {
    console.error(`❌ Error finding or creating political party:, ${error.response ? error.response.data : error}`);
    throw error;
  }
}
