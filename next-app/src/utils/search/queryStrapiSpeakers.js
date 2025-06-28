import path from "path";
import { fileURLToPath } from "url";
import Database from "better-sqlite3";
import { constants } from "@constants/constants.js";
import { normalizeGreekName } from "@utils/removeTones.js";

// Setup DB path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, "../../../../strapi-app/.tmp/data.db");
const db = new Database(dbPath, { readonly: true });

export function queryStrapiSpeakers({
  speakerName,
  ageRange = { min: 18, max: 100 },
  gender,
  parties = [],
  allowedIds = [],
  offset = 0,
  limit = 25,
  }) {
  const whereClauses = [];
  const params = {};

  // Filter by allowed speaker IDs
  if (allowedIds?.length > 0) {
    whereClauses.push(`s.document_id IN (${allowedIds.map((_, i) => `@id${i}`).join(", ")})`);
    allowedIds.forEach((id, i) => {
      params[`id${i}`] = id;
    });
  }

  // Filter by name (accent-insensitive + uppercase)
  if (speakerName) {
    const normalized = normalizeGreekName(speakerName);
    whereClauses.push("UPPER(s.speaker_name) LIKE @speakerName");
    params.speakerName = `%${normalized}%`;
  }

  // Filter by age
  if (ageRange.min !== 18 || ageRange.max !== 100) {
    whereClauses.push("s.age BETWEEN @minAge AND @maxAge");
    params.minAge = ageRange.min;
    params.maxAge = ageRange.max;
  }

  // Filter by gender
  if (gender) {
    whereClauses.push("s.gender = @gender");
    params.gender = gender;
  }

  // Filter by political party
  if (parties.length > 0) {
    whereClauses.push(`EXISTS (
    SELECT 1 FROM speakers_political_parties_lnk spl
    JOIN political_parties p ON p.id = spl.political_party_id
    WHERE spl.speaker_id = s.id AND p.name IN (${parties.map((_, i) => `@party${i}`).join(", ")})
  )`);
    parties.forEach((p, i) => {
      params[`party${i}`] = p;
    });
  }


  const whereSQL = whereClauses.length > 0 ? `WHERE ${whereClauses.join(" AND ")}` : "";

  // Count total
  const countQuery = `
    SELECT COUNT(*) as total
    FROM speakers s
    ${whereSQL};
  `;
  const total = db.prepare(countQuery).get(params).total;

  // Main query with LEFT JOIN for image
  const dataQuery = `
      SELECT
          s.document_id AS documentId,
          s.speaker_name,
          s.age,
          s.gender,
          f.url AS imageUrl
      FROM speakers s
               LEFT JOIN files_related_mph r
                         ON r.related_id = s.id
                             AND r.related_type = 'api::speaker.speaker'
                             AND r.field = 'image'
               LEFT JOIN files f
                         ON f.id = r.file_id
          ${whereSQL}
      ORDER BY s.speaker_name ASC
      LIMIT @limit OFFSET @offset;

  `;

  const speakers = db.prepare(dataQuery).all({
    ...params,
    limit,
    offset,
  });

  return { speakers, total };
}