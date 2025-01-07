import { Client } from '@elastic/elasticsearch';
import { constants } from "../constants/constants.js";

const client = new Client({
  node: constants.ELASTICSEARCH_URL, // ElasticSearch URL
  auth: {
    username: constants.ELASTICSEARCH_USERNAME, // Username
    password: constants.ELASTICSEARCH_PASSWORD, // Password
  },
  tls: {
    rejectUnauthorized: false, // Disable certificate validation (only for development) TODO: avoid in production
  },
});

client.ping({}, (error, response) => {
  if (error) {
    console.error("Elasticsearch Connection Error:", error);
  } else {
    console.log("Elasticsearch Connection Successful:", response);
  }
});

export default client;
