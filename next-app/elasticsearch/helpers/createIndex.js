import client from "../client.js"; // Elasticsearch client

const INDEX_NAME = "speeches";

async function createIndex() {
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
        speech_id: { type: "keyword" }, // Unique identifier
        speaker_name: { type: "text" }, // Speaker name
        content: { type: "text" }, // Full-text search on content
        speaker_id: { type: "keyword" }, // Speaker relation (ID)
        debate_id: { type: "keyword" }, // Debate relation (ID)
      },
    };

    // Create the index with the specified mappings
    const response = await client.indices.create({
      index: INDEX_NAME,
      body: {
        mappings,
      },
    });

    console.log(`Index "${INDEX_NAME}" created successfully.`, response);
  } catch (error) {
    console.error("Error creating index:", error.message);
  }
}

createIndex();
