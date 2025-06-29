import path from "path";
import { fileURLToPath } from "url";
import Database from "better-sqlite3";

// Setup DB
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, "../../../../strapi-app/.tmp/data.db");
const db = new Database(dbPath, { readonly: true });

export function getSpeakerDebateIds(speakerId) {
  const stmt = db.prepare(`
    SELECT
        d.document_id AS documentId,
        s.speaker_name AS speakerName,
        s.document_id AS speakerDocumentId
    FROM debates d
    JOIN speakers_debates_lnk sdl ON sdl.debate_id = d.id
    JOIN speakers s ON s.id = sdl.speaker_id
    WHERE s.document_id = ?
  `);

  const rows = stmt.all(speakerId);

  return rows;
}