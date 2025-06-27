import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import Database from "better-sqlite3";

// Setup __dirname and DB path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, "../../../strapi-app/.tmp/data.db");
const db = new Database(dbPath);

// Define and run query
const query = `
  SELECT speaker_id, speaker_name
  FROM speakers
  WHERE link IS NOT NULL
    AND link != ''
    AND link != '-'
    AND (
      description NOT LIKE '%ολιτικός%'
      AND description NOT LIKE '%ολικτικος%'
      AND description NOT LIKE '%olitician%'
    )
    AND (
      occupation NOT LIKE '%ολιτικός%'
          AND occupation NOT LIKE '%ολικτικος%'
          AND occupation NOT LIKE '%olitician%'
      );
`;

const results = db.prepare(query).all();

// Map to desired JSON format
const output = results.map(({ speaker_id, speaker_name }) => ({
  speaker_name,
  speaker_id,
  wikidata_url: ""
}));

// Write to JSON file
const outPath = path.join(__dirname, "../../public/data/wrong-wiki-url-speakers.json");
fs.writeFileSync(outPath, JSON.stringify(output, null, 2), "utf-8");

console.log(`✅ Saved ${output.length} entries to wrong-wiki-url-speakers.json`);
