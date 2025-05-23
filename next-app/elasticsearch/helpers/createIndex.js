import client from "../client.js"; // Elasticsearch client

const INDEX_NAME = "speeches";

async function createSpeechesIndex() {
  try {
    // Check if the index already exists
    const indexExists = await client.indices.exists({ index: INDEX_NAME });

    if (indexExists) {
      console.log(`Index "${INDEX_NAME}" already exists.`);
      return;
    }

    // Define the index mappings to match the Strapi structure
    const mappings = {
      properties: {
        speech_id: { type: "keyword" },
        speaker_name: {
          type: "text",
          fields: {
            keyword: { type: "keyword" }
          }
        },
        content: {
          type: "text",
          analyzer: "custom_analyzer",
          search_analyzer: "custom_analyzer"
        },
        speaker_id: { type: "keyword" },
        debate_id: { type: "keyword" },
        speech_number: { type: "integer" }
      },
    };

    const settings = {
      analysis: {
        analyzer: {
          custom_analyzer: {
            tokenizer: "standard",
            filter: ["lowercase", "asciifolding"]
          }
        }
      }
    }

    // Create the index with the specified mappings
    const response = await client.indices.create({
      index: INDEX_NAME,
      body: {
        mappings,
        settings
      },
    });

    console.log(`Index "${INDEX_NAME}" created successfully.`, response);
  } catch (error) {
    console.error("Error creating index:", error.message);
  }
}

createSpeechesIndex();
