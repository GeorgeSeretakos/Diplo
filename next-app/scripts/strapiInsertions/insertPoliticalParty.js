import uploadImageToStrapi from "../utils/uploadImageToStrapi.js";
import axios from "axios";

export default async function findOrCreatePoliticalParty(politicalParty, STRAPI_URL, API_TOKEN) {
  // console.log("The findOrCreatePoliticalParty function got politicalParty data: ", politicalParty);

  if(!politicalParty || !politicalParty.name) return null;

  try {
    // Check if the political party already exists
    const response = await axios.get(
      `${STRAPI_URL}/api/political-parties?filters[name][$eq]=${encodeURIComponent(politicalParty.name)}`,
      {
        headers: {
          Authorization: `Bearer ${API_TOKEN}`,
        },
      }
    );

    // If the party exists, return its ID
    if (response.data.data.length > 0) {
      console.log(`Political Party ${politicalParty.name} with documentId ${response.data.data} already exists.`);
      return response.data.data[0].documentId;
    }

    // Upload the political party's image (optional)
    let partyImageId = null;
    if (politicalParty.image) {
      partyImageId = await uploadImageToStrapi(politicalParty.image, STRAPI_URL, API_TOKEN);
    }

    // If the party doesn't exist, create a new one
    const createResponse = await axios.post(
      `${STRAPI_URL}/api/political-parties`,
      {
        data: {
          name: politicalParty.name,
          image: partyImageId, // Link the uploaded image
        },
      },
      {
        headers: {
          Authorization: `Bearer ${API_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log(`Poliitcal party ${politicalParty.name} created successfully.`);
    return createResponse.data.data.documentId;
  } catch (error) {
    console.error("Error finding or creating political party:", error.response ? error.response.data : error);
    throw error;
  }
}
