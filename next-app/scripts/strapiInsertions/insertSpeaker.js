import path from "path";
import {fileURLToPath} from "url";
import Database from "better-sqlite3";
import { randomUUID } from "crypto";

import fetchSpeakerData from "../utils/fetchSpeakerData.js";
import formatSpeakerFields from "../utils/formatSpeakerFields.js";
import uploadImageToStrapi from "../utils/uploadImageToStrapi.js";
import findOrCreatePoliticalParty from "./insertPoliticalParty.js";
import axios from "axios";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const strapiDbPath = path.join(__dirname, "../../../strapi-app/.tmp/data.db");
const db = new Database(strapiDbPath);


function calculateAge(birthDate, deathDate = null) {
  if (!birthDate) return null;
  const birth = new Date(birthDate);
  const end = deathDate ? new Date(deathDate) : new Date();
  if (isNaN(birth.getTime()) || isNaN(end.getTime())) return null;

  let age = end.getFullYear() - birth.getFullYear();
  const monthDiff = end.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && end.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

function getInternalIdFromTable(table, field, value) {
  const result = db.prepare(`SELECT id FROM ${table} WHERE ${field} = ?`).get(value);
  return result ? result.id : null;
}

function insertSpeakerToDB(data, imageId, politicalPartyIds, debateRowId, STRAPI_URL, API_TOKEN) {
  const insert = db.prepare(
    `INSERT INTO speakers (
        document_id, speaker_name, speaker_id, link, description,
        gender, date_of_birth, date_of_death, place_of_birth,
        educated_at, website, occupation, languages, age,
        created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`
  );

  const docId = randomUUID();
  insert.run(
    docId,
    data.speaker_name,
    data.speaker_id,
    data.link,
    data.description,
    data.gender,
    data.date_of_birth,
    data.date_of_death,
    data.place_of_birth,
    data.educated_at,
    data.website,
    data.occupation,
    data.languages,
    data.age,
  );

  const speakerRowId = db.prepare("SELECT id FROM speakers WHERE document_id = ?").get(docId).id;

  for (const partyId of politicalPartyIds) {
    db.prepare("INSERT OR IGNORE INTO speakers_political_parties_lnk (speaker_id, political_party_id) VALUES (?, ?)").run(speakerRowId, partyId);
  }

  linkSpeakerToDebate(speakerRowId, debateRowId);

  // 👇 Attach the image via Strapi API
  if (imageId) {
    axios.put(`${STRAPI_URL}/api/speakers/${docId}`, {
      data: {
        image: imageId
      }
    }, {
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
        'Content-Type': 'application/json'
      }
    }).catch(err => {
      console.warn(`⚠️ Failed to link image to speaker ${data.speaker_name}: ${err.message}`);
    });
  }

  return speakerRowId;
}

function linkSpeakerToDebate(speakerRowId, debateRowId) {
  db.prepare(
    `INSERT OR IGNORE INTO speakers_debates_lnk (speaker_id, debate_id)
    VALUES (?, ?)`
  ).run(speakerRowId, debateRowId);
  console.log(`🔗 Speaker - Debate.`);
}

export async function insertSpeaker(jsonData, debateId, STRAPI_URL, API_TOKEN) {
  const speakers = jsonData.akomaNtoso.debate[0].meta[0].references[0].TLCPerson;

  const uniqueSpeakers = Array.from(
    new Map(speakers.map(sp => [sp.$.eId, sp])).values()
  );

  const debateRowId = getInternalIdFromTable("debates", "document_id", debateId);
  if (!debateRowId) {
    console.error(`❌ Debate with documentId ${debateId} not found.`);
    return;
  }

  for (const speaker of uniqueSpeakers) {
    const speakerId = speaker.$.eId;
    const exists = getInternalIdFromTable("speakers", "speaker_id", speakerId);

    if (exists) {
      console.log(`Speaker ${speaker.$.showAs} already exists.`);
      linkSpeakerToDebate(exists, debateRowId);
      continue;
    }

    try {
      const wikidata = await fetchSpeakerData(speaker.$.href);
      // console.log("Fetched Speaker data: ", wikidata);

      const imageId = wikidata?.image
        ? await uploadImageToStrapi(wikidata.image, STRAPI_URL, API_TOKEN)
        : null;

      const formatted = formatSpeakerFields({
        speaker_name: speaker.$.showAs,
        speaker_id: speakerId,
        link: speaker.$.href,
        ...wikidata,
        age: calculateAge(wikidata?.date_of_birth, wikidata?.date_of_death),
      });

      // console.log("Formatted Speaker data: ", formatted);

      const politicalPartyIds = [];
      if (formatted.political_parties.length > 0) {
        for (const party of formatted.political_parties) {
          const partyId = await findOrCreatePoliticalParty(party, STRAPI_URL, API_TOKEN);
          if (partyId) politicalPartyIds.push(partyId);
        }
      }

      insertSpeakerToDB(formatted, imageId, politicalPartyIds, debateRowId, STRAPI_URL, API_TOKEN);
      console.log("✅", formatted.speaker_name);
    } catch (error) {
      console.error("❌ Error creating speaker:", speaker.$.showAs);
      const errorLog = {
        speaker: speaker.$.showAs,
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        details: error.response?.data?.error?.message || error.response?.data || null
      };
      console.error(JSON.stringify(errorLog, null, 2));
    }
  }

  return uniqueSpeakers;
}
