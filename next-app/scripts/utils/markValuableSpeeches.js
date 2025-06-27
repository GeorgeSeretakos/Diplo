import path from "path";
import { fileURLToPath } from "url";
import Database from "better-sqlite3";

// Setup DB path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, "../../strapi-app/.tmp/data.db");
const db = new Database(dbPath);

// Parameters
const BATCH_SIZE = 10000;
let offset = 0;

function fetchBatch(offset) {
  const stmt = db.prepare(`
    SELECT id, content
    FROM speeches
    WHERE is_valuable = 0
    LIMIT ? OFFSET ?
  `);
  return stmt.all(BATCH_SIZE, offset);
}

function markValuable(id) {
  const stmt = db.prepare(`UPDATE speeches SET is_valuable = 1 WHERE id = ?`);
  stmt.run(id);
}

function isSpeechValuable(contentJson) {
  try {
    const lines = JSON.parse(contentJson);
    const totalChars = lines.join(" ").length;
    return totalChars >= 150;
  } catch (e) {
    console.log("Couldn't process speech: ", e);
    return false; // skip invalid JSON
  }
}

function main() {
  let batch = fetchBatch(offset);
  let updatedCount = 0;

  while (batch.length > 0) {
    for (const speech of batch) {
      if (isSpeechValuable(speech.content)) {
        markValuable(speech.id);
        updatedCount++;
      }
    }

    console.log(`✅ Processed ${offset + batch.length}, updated ${updatedCount} valuable speeches.`);

    offset += BATCH_SIZE;
    batch = fetchBatch(offset);
  }

  console.log("🎉 Finished processing all speeches.");
}

main();
