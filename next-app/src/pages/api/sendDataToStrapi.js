import { insertDebate } from './strapiInsertions/insertDebate';
import { insertParliamentSession } from './strapiInsertions/insertParliamentSession';
import { insertSpeech } from './strapiInsertions/insertSpeech';
import { insertSpeaker } from './strapiInsertions/insertSpeaker';

const STRAPI_URL = "http://localhost:1337";
const API_TOKEN = "64fdbf5db98e8feaf246072c2b6c7b4b9b82771f622a84ffc2a06e8bc4c9534272481f7730d283d571f206dd20522cb360221ef4b01e2861e1bebc33c71099f420ae7186182234051d2b95f404c16b8bc377d703f3af6d52eb5a8e6e98f89a0dd17a16873fff69a30df0efe715977c73e21d391cb84523fcdfa25f286968a61a";

export default async function sendDataToStrapi(jsonData) {
  try {
    // Insert Debate data and retrieve debateId
    const debateId = await insertDebate(jsonData, STRAPI_URL, API_TOKEN);

    // If debateId exists, insert Parliament Session data and connect it to the Debate
    if (debateId) {
      await insertParliamentSession(jsonData, debateId, STRAPI_URL, API_TOKEN);

      // await insertSpeaker(jsonData, debateId, STRAPI_URL, API_TOKEN);

      // await insertSpeech(jsonData, debateId, STRAPI_URL, API_TOKEN);


    } else {
      console.log("Debate insertion failed or debate already exists. Skipping Parliament Session and Speech insertion.");
    }


    console.log("Data transformed and sent to Strapi successfully.");
  } catch (error) {
    console.error("Error sending data to Strapi:", error);
  }
}

