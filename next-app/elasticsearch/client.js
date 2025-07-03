import { Client } from '@elastic/elasticsearch';
import dotenv from "dotenv";

dotenv.config();

const client = new Client({
  node: process.env.ELASTICSEARCH_URL,
  auth: {
    username: process.env.ELASTICSEARCH_USERNAME,
    password: process.env.ELASTICSEARCH_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

// Async function to validate connection
async function verifyElasticsearchConnection() {
  try {
    await client.ping();
    if (process.env.NODE_ENV !== 'production') {
      console.log("✅ Elasticsearch Connection Successful");
    }
  } catch (error) {
    console.error("❌ Elasticsearch Connection Error:", error.message);
    // Optionally throw to crash the process if it's critical
    throw new Error("Failed to connect to Elasticsearch. Exiting...");
  }
}

// Immediately verify connection once (synchronously triggered)
verifyElasticsearchConnection();

export default client;