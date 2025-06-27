import client from "../client.js";

const INDEX_NAME = "speeches";

async function deleteIndex() {
  try {
    const response = await client.indices.delete({ index: INDEX_NAME });
    console.log(`Index "${INDEX_NAME}" deleted successfully.`, response);
  } catch (error) {
    console.error(`Error deleting index "${INDEX_NAME}":`, error.message);
  }
}

deleteIndex();
