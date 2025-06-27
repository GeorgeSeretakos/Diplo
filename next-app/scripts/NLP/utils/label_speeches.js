import path from "path";
import { fileURLToPath } from "url";
import Database from "better-sqlite3";

// Setup paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, "../../../../strapi-app/.tmp/data.db");
const db = new Database(dbPath);

// Select speeches where valuable is null or false
const selectStmt = db.prepare(`
  SELECT id, content 
  FROM speeches 
  WHERE valuable IS NULL OR valuable = 0
`);

const updateStmt = db.prepare(`
  UPDATE speeches 
  SET valuable = 1 
  WHERE id = ?
`);

let updatedCount = 0;

const speeches = selectStmt.all();
for (const speech of speeches) {
  try {
    console.log("Processing speech: ", updatedCount);
    const parts = JSON.parse(speech.content);
    const totalLength = parts.reduce((sum, part) => sum + part.length, 0);
    if (totalLength > 150) {
      updateStmt.run(speech.id);
      updatedCount++;
    }
  } catch (err) {
    console.error(`Failed to parse content for speech ID ${speech.id}:`, err.message);
  }
}

console.log(`✅ Updated ${updatedCount} speeches as valuable.`);
