import path from 'path';
import { transform } from './transform.js';
import { insertDebate } from './strapiInsertions/insertDebate.js';
import {insertHtml} from "./strapiInsertions/insertHtml.js";
import { insertParliamentSession } from './strapiInsertions/insertParliamentSession.js';
import { insertSpeech } from './strapiInsertions/insertSpeech.js';
import { insertSpeaker } from './strapiInsertions/insertSpeaker.js';
import fs from "fs";

const STRAPI_URL = "http://localhost:1337";
const API_TOKEN = "64fdbf5db98e8feaf246072c2b6c7b4b9b82771f622a84ffc2a06e8bc4c9534272481f7730d283d571f206dd20522cb360221ef4b01e2861e1bebc33c71099f420ae7186182234051d2b95f404c16b8bc377d703f3af6d52eb5a8e6e98f89a0dd17a16873fff69a30df0efe715977c73e21d391cb84523fcdfa25f286968a61a";

export default async function populate() {
  const xsltPath = path.join(process.cwd(), 'public', 'debate.xsl');
  const xmlDir = path.join(process.cwd(), 'public', 'data', 'xml_files');

  const xmlFiles = fs.readdirSync(xmlDir).filter(file => file.endsWith('.xml'));

  for (const file of xmlFiles) {
    const xmlPath = path.join(xmlDir, file);

    try {
      const { jsonData, htmlData } = await transform(xmlPath, xsltPath);

      // Insert Debate data and retrieve debateId
      const debateId = await insertDebate(jsonData, STRAPI_URL, API_TOKEN);

      // If debateId exists, insert Parliament Session data and connect it to the Debate
      if (debateId) {
        await insertHtml(htmlData, debateId, STRAPI_URL, API_TOKEN);

        await insertParliamentSession(jsonData, debateId, STRAPI_URL, API_TOKEN);

        await insertSpeaker(jsonData, debateId, STRAPI_URL, API_TOKEN);

        await insertSpeech(jsonData, debateId, STRAPI_URL, API_TOKEN);

      } else {
        console.log("Debate insertion failed or debate already exists. Skipping Parliament Session, Speakers and Speeches insertion.");
      }
    } catch (error) {
      console.error(`Error processing file ${file}: `, error);
    }
  }

  console.log("All XML files have been inserted to Strapi.");
  return;
}

populate();

