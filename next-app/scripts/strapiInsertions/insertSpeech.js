import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, "../../../strapi-app/.tmp/data.db");
const db = new Database(dbPath);

import { randomUUID } from 'crypto';

function getInternalIdFromTable(table, field, value) {
  const result = db.prepare(`SELECT id FROM ${table} WHERE ${field} = ?`).get(value);
  return result ? result.id : null;
}

function insertSpeechRecord(speechData) {
  const documentId = randomUUID();

  const insert = db.prepare(
    `INSERT INTO speeches (document_id, speech_id, speaker_name, speaker_id, content, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, datetime('now'), datetime('now'))`
  );
  const result = insert.run(
    documentId,
    speechData.speech_id,
    speechData.speaker_name,
    speechData.speaker_id,
    JSON.stringify(speechData.content)
  );
  return result.lastInsertRowid;
}

function linkSpeechToDebate(speechId, debateId) {
  db.prepare(
    `INSERT OR IGNORE INTO speeches_debate_lnk (speech_id, debate_id)
     VALUES (?, ?)`
  ).run(speechId, debateId);
}

function linkSpeechToSpeaker(speechId, speakerId) {
  db.prepare(
    `INSERT OR IGNORE INTO speeches_speaker_lnk (speech_id, speaker_id)
     VALUES (?, ?)`
  ).run(speechId, speakerId);
}

export async function insertSpeech(jsonData, debateId) {

  const speeches = jsonData.akomaNtoso.debate[0].debateBody[0].debateSection.flatMap(
    section => section.speech || []
  );

  for (const speech of speeches) {
    if (!speech.$?.eId || !speech.from) {
      console.log("Skipping speech due to missing essential fields:", speech);
      continue;
    }

    const content = (speech.p || []).map(paragraph => paragraph._ || paragraph);
    const speech_id = speech.$.eId;
    const speaker_id = speech.$.by;
    const speaker_name = (speech.from[0] || "Unknown Speaker").toUpperCase();

    const speakerRowId = getInternalIdFromTable("speakers", "speaker_id", speaker_id);
    const debateRowId = getInternalIdFromTable("debates", "document_id", debateId);

    if (!debateRowId) {
      console.error(`❌ Debate with documentId ${debateId} not found.`);
      continue;
    }

    const newSpeechId = insertSpeechRecord({
      speech_id,
      speaker_id,
      speaker_name,
      content
    });

    console.log("✅", speech_id);

    linkSpeechToDebate(newSpeechId, debateRowId);
    // console.log(`🔗 Speech - Debate.`);


    if (speakerRowId) {
      linkSpeechToSpeaker(newSpeechId, speakerRowId);
      // console.log(`🔗 Speech - Speaker.`);
    }
  }
}
