import { Client } from '@elastic/elasticsearch';
import { constants } from "../constants/constants.js";

console.log("Initializing Elasticsearch client...");

const client = new Client({
  node: constants.ELASTICSEARCH_URL,
  auth: {
    username: constants.ELASTICSEARCH_USERNAME,
    password: constants.ELASTICSEARCH_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
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
