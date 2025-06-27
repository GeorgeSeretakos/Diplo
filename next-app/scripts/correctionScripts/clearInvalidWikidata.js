import sqlite3 from "sqlite3";
import { open } from "sqlite";
import path from "path";

// === CONFIG ===
const DB_PATH = path.resolve("../../../strapi-app/.tmp/data.db");

// === Fields to Clear ===
const CLEAR_SQL = `
  UPDATE speakers
  SET
    link = '-',
    description = '',
    gender = '',
    date_of_birth = NULL,
    date_of_death = NULL,
    place_of_birth = NULL,
    educated_at = '',
    occupation = '',
    languages = '',
    website = ''
  WHERE speaker_id = ?;
`;

// === Filter query to identify wrongly enriched non-political speakers ===
const GET_WRONG_SPEAKERS_SQL = `
    SELECT speaker_id FROM speakers
    WHERE link IS NOT '-'
  AND (
    description NOT LIKE '%ολιτικός%' AND
    description NOT LIKE '%ολιτικος%' AND
    description NOT LIKE '%ουλευτ%' AND
    description NOT LIKE '%ουλή%' AND
    description NOT LIKE '%ουλη%' AND
    description NOT LIKE '%olitician%' AND
    description NOT LIKE '%arliament%' AND
    description NOT LIKE '%inister%' AND
    description NOT LIKE '%μαρχος%' AND
    description NOT LIKE '%προεδρος%' AND
    description NOT LIKE '%πρόεδρος%' AND
    description NOT LIKE '%leader%' AND
    description NOT LIKE '%πουργός%' AND
    description NOT LIKE '%πουργος%' AND
    description NOT LIKE '%government%'
  )
  AND (
    occupation NOT LIKE '%ολιτικός%' AND
    occupation NOT LIKE '%ολιτικος%' AND
    occupation NOT LIKE '%ουλευτ%' AND
    occupation NOT LIKE '%ουλή%' AND
    occupation NOT LIKE '%ουλη%' AND
    occupation NOT LIKE '%olitician%' AND
    occupation NOT LIKE '%arliament%' AND
    occupation NOT LIKE '%inister%' AND
    occupation NOT LIKE '%μαρχος%' AND
    occupation NOT LIKE '%προεδρος%' AND
    occupation NOT LIKE '%πρόεδρος%' AND
    occupation NOT LIKE '%leader%' AND
    occupation NOT LIKE '%πουργός%' AND
    occupation NOT LIKE '%πουργος%' AND
    occupation NOT LIKE '%government%'
  );
`;

async function runClearFilteredEnrichment() {
  const db = await open({
    filename: DB_PATH,
    driver: sqlite3.Database,
  });

  try {
    const filtered = await db.all(GET_WRONG_SPEAKERS_SQL);
    console.log(`🔍 Found ${filtered.length} non-political enriched speakers to update.`);

    await db.exec("BEGIN TRANSACTION;");
    for (const row of filtered) {
      await db.run(CLEAR_SQL, [row.speaker_id]);
      console.log(`🧹 Cleared enrichment for: ${row.speaker_id}`);
    }
    await db.exec("COMMIT;");
    console.log("✅ All applicable speakers cleaned.");
  } catch (err) {
    await db.exec("ROLLBACK;");
    console.error("❌ Error during enrichment cleanup:", err.message);
  } finally {
    await db.close();
  }
}

await runClearFilteredEnrichment();
