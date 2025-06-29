import path from "path";
import { fileURLToPath } from "url";
import Database from "better-sqlite3";
import { constants } from "@constants/constants.js";

// Setup DB path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, "../../../../strapi-app/.tmp/data.db");
const db = new Database(dbPath, { readonly: true });

export function queryStrapiDebates({
  startDate,
  endDate,
  session,
  period,
  topics,
  speakers,
  speakingSpeakerId = null,
  allowedIds = [],
  offset = 0,
  limit = 20,
  sortBy = "newest",
  }) {
  const whereClauses = [];
  const params = {};

  // Allowed IDs filter
  if (allowedIds?.length > 0) {
    whereClauses.push(`d.document_id IN (${allowedIds.map((_, i) => `@id${i}`).join(", ")})`);
    allowedIds.forEach((id, i) => {
      params[`id${i}`] = id;
    });
  }

  // Date filters
  if (startDate) {
    whereClauses.push("d.date >= @startDate");
    params.startDate = startDate;
  }
  if (endDate) {
    whereClauses.push("d.date <= @endDate");
    params.endDate = endDate;
  }

  // Session and period filters
  if (session) {
    whereClauses.push("d.session = @session");
    params.session = session;
  }
  if (period) {
    whereClauses.push("d.period = @period");
    params.period = period;
  }

  // Participating speakers filter
  if (speakers?.length > 0) {
    for (let i = 0; i < speakers.length; i++) {
      const alias = `s${i}`;
      whereClauses.push(`EXISTS (
        SELECT 1 FROM speakers_debates_lnk ds
        JOIN speakers ${alias} ON ${alias}.id = ds.speaker_id
        WHERE ds.debate_id = d.id AND ${alias}.speaker_name = @speaker${i}
      )`);
      params[`speaker${i}`] = speakers[i];
    }
  }

  // Filter debates where the specified speaker has at least one speech
  if (speakingSpeakerId) {
    whereClauses.push(`EXISTS (
      SELECT 1
      FROM speeches sp
      JOIN speeches_debate_lnk sdl ON sdl.speech_id = sp.id
      JOIN speeches_speaker_lnk ssl ON ssl.speech_id = sp.id
      JOIN speakers s ON s.id = ssl.speaker_id
      WHERE sdl.debate_id = d.id AND s.document_id = @speakerId
    )`);
    params.speakerId = speakingSpeakerId;
  }


  const whereSQL = whereClauses.length ? `WHERE ${whereClauses.join(" AND ")}` : "";
  const orderSQL = sortBy === "newest" ? "ORDER BY d.date DESC" : "ORDER BY d.date ASC";

  // Count total
  const countQuery = `
    SELECT COUNT(*) as total
    FROM debates d
    ${whereSQL};
  `;
  const total = db.prepare(countQuery).get(params).total;

  // Main query
  const dataQuery = `
    SELECT d.document_id AS documentId, d.date, d.title, d.session, d.period
    FROM debates d
    ${whereSQL}
    ${orderSQL}
    LIMIT @limit OFFSET @offset;
  `;

  const debates = db.prepare(dataQuery).all({
    ...params,
    limit,
    offset,
  });

  return { debates, total };
}

export function getSpeakerImages(speakerIds = []) {
  if (speakerIds.length === 0) return new Map();

  const placeholders = speakerIds.map(() => '?').join(', ');
  const rows = db.prepare(`
    SELECT s.document_id AS speaker_id, f.url AS imageUrl
    FROM speakers s
    LEFT JOIN files_related_mph r
      ON r.related_id = s.id
      AND r.related_type = 'api::speaker.speaker'
      AND r.field = 'image'
    LEFT JOIN files f ON f.id = r.file_id
    WHERE s.document_id IN (${placeholders})
  `).all(...speakerIds);

  const map = new Map();
  for (const row of rows) {
    if (row.imageUrl) {
      map.set(row.speaker_id, row.imageUrl);
    }
  }

  return map;
}