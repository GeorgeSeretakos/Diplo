import axios from "axios";
import fetchSpeakerData from "./fetchSpeakerData.js";
import formatSpeakerFields from "./formatSpeakerFields.js";
import uploadImageToStrapi from "./uploadImageToStrapi.js";
import findOrCreatePoliticalParty from "../../scripts/strapiInsertions/insertPoliticalParty.js";

export default async function enrichSpeakerFromWikidata(speaker_id, wikidataUrl, STRAPI_URL, API_TOKEN) {
  try {
    const wikidata = await fetchSpeakerData(wikidataUrl);
    if (!wikidata) throw new Error("No data from Wikidata");

    const response = await axios.get(`${STRAPI_URL}/api/speakers?filters[speaker_id][$eq]=${speaker_id}`, {
      headers: { Authorization: `Bearer ${API_TOKEN}` },
    });

    if (!response.data.data.length) throw new Error(`Speaker with ID ${speaker_id} not found`);
    const documentId = response.data.data[0].documentId;
    const existingName = response.data.data[0].speaker_name;

    const imageId = wikidata.image
      ? await uploadImageToStrapi(wikidata.image, STRAPI_URL, API_TOKEN)
      : null;

    const partyIds = [];
    if (wikidata.political_parties) {
      for (const party of wikidata.political_parties) {
        const id = await findOrCreatePoliticalParty(party, STRAPI_URL, API_TOKEN);
        if (id) partyIds.push(id);
      }
    }

    const formatted = formatSpeakerFields({
      speaker_name: existingName,
      speaker_id,
      link: wikidataUrl,
      ...wikidata,
    });

    const payload = {
      ...formatted,
      ...(imageId && { image: imageId }),
      political_parties: partyIds,
    };

    await axios.put(`${STRAPI_URL}/api/speakers/${documentId}`, { data: payload }, {
      headers: { Authorization: `Bearer ${API_TOKEN}` },
    });

    console.log(`✅ Speaker ${speaker_id} enriched.`);
  } catch (err) {
    console.error(`❌ Failed to enrich speaker ${speaker_id}:`, err.message);
  }
}
