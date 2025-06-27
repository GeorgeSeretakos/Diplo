import path from "path";
import { fileURLToPath } from "url";
import Database from "better-sqlite3";

// Setup paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, "../../../strapi-app/.tmp/data.db");
const db = new Database(dbPath);

// Step 1: Find all speakers with speeches but no linked debates
const disconnectedSpeakers = db
  .prepare(`
      SELECT DISTINCT sp.speaker_id
      FROM speeches sp
               LEFT JOIN speakers_debates_lnk sdl ON sp.speaker_id = sdl.speaker_id
      WHERE sdl.speaker_id IS NULL
        AND sp.speaker_id IS NOT NULL
  `)
  .all();

console.log(`Found ${disconnectedSpeakers.length} speakers missing debate links.`);

// Prepare insert statement
const insertStmt = db.prepare(`
    INSERT OR IGNORE INTO speakers_debates_lnk (speaker_id, debate_id)
    VALUES (?, ?)
`);

let insertCount = 0;

for (const { speaker_id } of disconnectedSpeakers) {
  // Step 2: Find all distinct debate_ids for this speaker's speeches
  const debates = db
    .prepare(`
      SELECT DISTINCT debate_id
      FROM speeches
      WHERE speaker_id = ?
        AND debate_id IS NOT NULL
    `)
    .all(speaker_id);

  // Step 3: Insert missing speaker–debate links
  for (const { debate_id } of debates) {
    insertStmt.run(speaker_id, debate_id);
    insertCount++;
  }
}

console.log(`✅ Inserted ${insertCount} speaker–debate links into speakers_debates_lnk.`);
