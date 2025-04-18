import axios from "axios";
import client from "../client.js"; // Elasticsearch client

const INDEX_NAME = "speeches";
const STRAPI_API_URL = "http://localhost:1338/api/speeches"; // Update with your Strapi endpoint
const PAGE_SIZE = 100; // Number of items to fetch per page

/**
 * Fetch speeches from Strapi API with pagination.
 * @param {number} page - Current page number.
 * @returns {Promise<Object>} - Data from Strapi API.
 */
async function fetchSpeeches(page = 1) {
  try {
    const response = await axios.get(STRAPI_API_URL, {
      params: {
        "pagination[page]": page,
        "pagination[pageSize]": PAGE_SIZE,
        populate: "*",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching speeches:", error.message);
    return null;
  }
}

/**
 * Bulk insert speeches into Elasticsearch.
 */
async function bulkInsert() {
  console.log(`Starting bulk insert into index: ${INDEX_NAME}`);

  let page = 1;
  let totalIndexed = 0;

  while (true) {
    const data = await fetchSpeeches(page);
    if (!data || data.data.length === 0) {
      break; // Stop if no data is returned
    }

    const bulkBody = data.data.flatMap((speech) => {
      console.log("Speech: ", speech);
      if (
        !speech.speaker_name ||
        !speech.content ||
        !speech.speech_id ||
        !speech.debates[0]?.documentId
      ) {
        console.warn(`Skipping speech with missing fields: ${speech.id}`);
        return [];
      }

      // Transform the content field to a single string
      const transformedContent = speech.content.paragraphs
        .map((paragraph) => paragraph) // Extract text from each paragraph
        .join(' '); // Combine paragraphs into one string

      console.log("Transformed Content: ", transformedContent);

      return [
        {
          index: { _index: INDEX_NAME, _id: speech.speech_id },
        },
        {
          speaker_name: speech.speaker_name,
          content: transformedContent,
          debate_id: speech.debates[0].documentId,
          speaker_id: speech.speaker_id,
        },
      ];
    });

    if (bulkBody.length === 0) {
      console.warn(`No valid speeches to index on page ${page}`);
      break;
    }

    try {
      const response = await client.bulk({ body: bulkBody });

      if (response.errors) {
        console.error("Bulk indexing errors occurred:");
        response.items.forEach((item) => {
          if (item.index && item.index.status >= 400) {
            console.error(`Error for document ID ${item.index._id}:`, item.index.error);
          }
        });
      } else {
        const successfulInserts = response.items.filter(
          (item) => item.index && item.index.status < 400
        ).length;

        totalIndexed += successfulInserts; // Increment totalIndexed
        console.log(`Successfully indexed ${successfulInserts} documents on page ${page}.`);
      }
    } catch (error) {
      console.error("Error during bulk insertion:", error.meta?.body?.error || error.message);
      break;
    }

    page++;
  }

  console.log(`Bulk insert completed. Total indexed: ${totalIndexed}`);
}

bulkInsert();
