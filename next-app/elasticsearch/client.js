import { Client } from '@elastic/elasticsearch';
import { constants } from "../constants/constants.js";

console.log("Initializing Elasticsearch client...");

const client = new Client({
  node: constants.ELASTICSEARCH_URL, // ElasticSearch URL
  auth: {
    username: constants.ELASTICSEARCH_USERNAME, // Username
    password: constants.ELASTICSEARCH_PASSWORD, // Password
  },
  tls: {
    rejectUnauthorized: false, // Disable certificate validation (only for development)
  },
});

console.log("Pinging Elasticsearch server...");

client.ping()
  .then(() => {
    console.log("Elasticsearch Connection Successful!");
  })
  .catch(error => {
    console.error("Elasticsearch Connection Error:", error);
  });

export default client;
