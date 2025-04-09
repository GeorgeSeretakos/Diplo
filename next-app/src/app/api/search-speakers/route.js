import client from "../../../../elasticsearch/client.js"; // Elasticsearch client
import axios from "axios";
import { constants } from "../../../../constants/constants.js";

const STRAPI_URL = constants.STRAPI_URL;
const API_TOKEN = constants.API_TOKEN;

export async function POST(req) {
  try {
    const body = await req.json();
    const {
      keyPhrase,
      speakerName,
      parties,
      topics,
      ageRange,
      gender,
      sortBy,
      page = 1,
      limit = 10
    } = body;

    console.log("Body: ", body);

    console.log("🔍 Fetching speakers with filters...");
    console.log("keyPhrase: ", keyPhrase);
    console.log("speakerName: ", speakerName);
    console.log("parties: ", parties);
    console.log("topics: ", topics);
    console.log("ageRange: ", ageRange);
    console.log("gender: ", gender);

    const offset = (page - 1) * limit;

    let speakerIdsFromES = new Set();

    if (keyPhrase) {
      const esQuery = {
        size: 0,
        query: {
          match_phrase: {
            content: keyPhrase
          }
        },
        aggs: {
          unique_speakers: {
            terms: {
              field: "speaker_id.keyword",
              size: 1000
            }
          }
        }
      };

      console.log("🔹 Elasticsearch Query:", JSON.stringify(esQuery, null, 2));

      const esResponse = await client.search({
        index: "speeches",
        body: esQuery
      });

      console.log("🔹 Elasticsearch Response:", esResponse);

      // Extract unique speaker IDs from Elasticsearch response
      speakerIdsFromES = new Set(esResponse.aggregations.unique_speakers.buckets.map(bucket => bucket.key));
    }

    // ✅ Step 2: Build Strapi Query (filters)
    const filters = [];

    if (speakerIdsFromES.size > 0) {
      filters.push(`documentId: { in: [${[...speakerIdsFromES].map(id => `"${id}"`).join(", ")}] }`);
    }

    if (speakerName) {
      filters.push(`speaker_name: { containsi: "${speakerName.trim().toUpperCase()}" }`);
    }

    if (gender) {
      filters.push(`gender: { eq: "${gender}" }`);
    }

    // if (topics?.length) {
    //   filters.push(`topics: { topic: { in: [${topics.map(t => `"${t}"`).join(", ")}] } }`);
    // }

    if (parties?.length) {
      filters.push(`political_parties: { name: { in: [${parties.map(p => `"${p}"`).join(", ")}] } }`);
    }

    // if (ageRange?.min || ageRange?.max) {
    //   filters.push(`age: { gte: ${ageRange.min}, lte: ${ageRange.max} }`);
    // }

    // ✅ Step 3: Query Strapi with the filters
    const strapiQuery = `
      query {
        speakers(filters: { ${filters.join(", ")} }) {
          documentId
          speaker_name
          gender
          political_parties {
            name
          }
          image {
            formats
            url
          }
        }
      }
    `;

    console.log("🟡 Strapi Query:", strapiQuery);

    const strapiResponse = await axios.post(
      `${STRAPI_URL}/graphql`,
      { query: strapiQuery },
      {
        headers: {
          Authorization: `Bearer ${API_TOKEN}`,
          "Content-Type": "application/json"
        },
      }
    );

    const speakersFromStrapi = strapiResponse.data.data.speakers;
    console.log("🟢 Strapi Response:", speakersFromStrapi);

    // ✅ Step 4: Determine the final result based on filters
    let finalSpeakers;

    const hasElasticSearchInput = Boolean(keyPhrase);
    const hasStrapiInput = Boolean(
      speakerName || gender || ageRange || parties?.length || topics?.length
    );

    console.log("hasElasticSearchInput: ", hasElasticSearchInput);
    console.log("hasStrapiInput: ", hasStrapiInput);

    if (hasElasticSearchInput && hasStrapiInput) {
      // Return only speakers that are present in both results (intersection)
      finalSpeakers = speakersFromStrapi.filter(speaker => speakerIdsFromES.has(speaker.documentId));
    } else if (hasElasticSearchInput) {
      // Return speakers from Elasticsearch (since no other filters exist)
      finalSpeakers = speakersFromStrapi.filter(speaker => speakerIdsFromES.has(speaker.documentId));
    } else if (hasStrapiInput) {
      // Return speakers from Strapi filtering
      finalSpeakers = speakersFromStrapi;
    } else {
      // If no filters, return all speakers
      finalSpeakers = speakersFromStrapi;
    }

    console.log("✅ Final Speakers List:", finalSpeakers);

    return new Response(
      JSON.stringify(finalSpeakers),
      { status: 200 }
    );

  } catch (error) {
    console.error("❌ Error fetching speakers:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch speakers." }), { status: 500 });
  }
}
