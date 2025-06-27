import path from 'path';
import { transform } from './transform.js';
import { insertDebate } from './strapiInsertions/insertDebate.js';
import { insertSpeech } from './strapiInsertions/insertSpeech.js';
import { insertSpeaker } from './strapiInsertions/insertSpeaker.js';
import fs from "fs";
import {constants} from "../constants/constants.js"

export default async function populate() {
  const xsltPath = path.join(process.cwd(), 'public', 'debate.xsl');
  const xmlDir = path.join(process.cwd(), 'public', 'data', 'xml_files', 'xml_akn_files');

  const xmlFiles = fs
    .readdirSync(xmlDir)
    .filter(file => file.endsWith('.xml'))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }));

  const STRAPI_URL = constants.STRAPI_URL;
  const API_TOKEN = constants.API_TOKEN;
  let count = 0;

  const problematic_speakers = new Set();
  const problematic_files = new Set();

  for (const file of xmlFiles) {
    // if (count >= 1000) break;

    count++;
    const xmlPath = path.join(xmlDir, file);
    console.log("INSERTING FILE", count, ": ", file);

    try {
      const jsonData = await transform(xmlPath);
      const debateId = await insertDebate(jsonData, STRAPI_URL, API_TOKEN);

      if (debateId) {
        const uniqueSpeakers = await insertSpeaker(jsonData, debateId, STRAPI_URL, API_TOKEN);
        await insertSpeech(jsonData, debateId, STRAPI_URL, API_TOKEN);

        // for (const speakerObj of list_of_null_speakers) {
        //   problematic_speakers.add(JSON.stringify(speakerObj));
        // }

      } else {
        console.log("Debate insertion failed or debate already exists. Skipping Parliament Session, Speakers and Speeches insertion.");
      }
    } catch (error) {
      console.error(`❌ ❌ ❌ Error processing file ${file}:`, error);
      problematic_files.add(file);
    }
  }

  console.log("All XML files have been inserted to Strapi.");

  const speakerArray = [...problematic_speakers].map(str => JSON.parse(str));
  const speakerFile = path.join(process.cwd(), 'public', 'data', 'problematic_speakers.json');
  fs.writeFileSync(speakerFile, JSON.stringify(speakerArray, null, 2), 'utf8');

  const problematicFileOutput = path.join(process.cwd(), 'public', 'data', 'problematic_files.json');
  fs.writeFileSync(problematicFileOutput, JSON.stringify([...problematic_files], null, 2), 'utf8');

  console.log("Problematic speakers are: ", problematic_speakers);
  console.log("Count is: ", count);
}

populate();

