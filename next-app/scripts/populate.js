import path from 'path';
import { transform } from './transform.js';
import { insertDebate } from './strapiInsertions/insertDebate.js';
import {insertHtml} from "./strapiInsertions/insertHtml.js";
import { insertParliamentSession } from './strapiInsertions/insertParliamentSession.js';
import { insertSpeech } from './strapiInsertions/insertSpeech.js';
import { insertSpeaker } from './strapiInsertions/insertSpeaker.js';
import fs from "fs";
import {constants} from "../constants/constants.js"

export default async function populate() {
  const xsltPath = path.join(process.cwd(), 'public', 'debate.xsl');
  const xmlDir = path.join(process.cwd(), 'public', 'data', 'xml_files');

  const xmlFiles = fs.readdirSync(xmlDir).filter(file => file.endsWith('.xml'));

  const STRAPI_URL = constants.STRAPI_URL;
  const API_TOKEN = constants.API_TOKEN;

  for (const file of xmlFiles) {
    const xmlPath = path.join(xmlDir, file);

    try {
      const { jsonData, htmlData } = await transform(xmlPath, xsltPath);

      // Insert Debate data and retrieve debateId
      const debateId = await insertDebate(jsonData, STRAPI_URL, API_TOKEN);

      // If debateId exists, insert Parliament Session data and connect it to the Debate
      if (debateId) {
        // await insertHtml(htmlData, debateId, STRAPI_URL, API_TOKEN);

        // await insertParliamentSession(jsonData, debateId, STRAPI_URL, API_TOKEN);

        await insertSpeaker(jsonData, debateId, STRAPI_URL, API_TOKEN);

        // await insertSpeech(jsonData, debateId, STRAPI_URL, API_TOKEN);

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

