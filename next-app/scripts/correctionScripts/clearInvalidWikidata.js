import sqlite3 from "sqlite3";
import { open } from "sqlite";
import path from "path";
import { promises as fs } from "fs";

// === CONFIG ===
const DB_PATH = path.resolve("../../../strapi-app/.tmp/data.db");
const JSON_PATH = path.resolve("../../public/data/wrong-wiki-url-speakers.json");
console.log("json path: ", JSON_PATH);

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


async function runClearFilteredEnrichment() {
  const db = await open({
    filename: DB_PATH,
    driver: sqlite3.Database,
  });

  try {
    const rawData = await fs.readFile(JSON_PATH, "utf-8");
    const speakers = JSON.parse(rawData);
    console.log("speakers: ", speakers);

    console.log(`🔍 Found ${speakers.length} speakers in JSON file.`);

    await db.exec("BEGIN TRANSACTION;");
    for (const { speaker_id } of speakers) {
      await db.run(CLEAR_SQL, [speaker_id]);
      console.log(`🧹 Cleared enrichment for: ${speaker_id}`);
    }
    await db.exec("COMMIT;");
    console.log("✅ All listed speakers cleaned.");
  } catch (err) {
    await db.exec("ROLLBACK;");
    console.error("❌ Error during enrichment cleanup:", err.message);
  } finally {
    await db.close();
  }
}

await runClearFilteredEnrichment();
