import Database from "better-sqlite3";
import { encode } from "gpt-3-encoder";
import path from "path";
import { fileURLToPath } from "url";

// === CONFIG ===
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, "../../../../strapi-app/.tmp/data.db");
const db = new Database(dbPath);

const BATCH_SIZE = 10000;
const TOTAL_DEBATES = 5592;

// === MAIN ===
function estimateTokensFromTextArray(content) {
  const fullText = content.join(" ");
  return encode(fullText).length;
}

function main() {
  const stmt = db.prepare("SELECT content FROM speeches WHERE valuable = 1 LIMIT ? OFFSET ?");

  let offset = 0;
  let totalTokens = 0;
  let totalSpeeches = 0;

  while (true) {
    const speeches = stmt.all(BATCH_SIZE, offset);
    if (speeches.length === 0) break;

    for (const { content } of speeches) {
      const parsedContent = typeof content === "string" ? JSON.parse(content) : content;
      totalTokens += estimateTokensFromTextArray(parsedContent);
      totalSpeeches += 1;
    }

    offset += BATCH_SIZE;
    console.log(`🧱 Processed ${offset} speeches...`);
  }

  const avgTokensPerDebate = totalTokens / TOTAL_DEBATES;

  console.log(`\n✅ Total valuable speeches: ${totalSpeeches}`);
  console.log(`🧠 Total tokens: ${totalTokens}`);
  console.log(`📊 Average tokens per debate: ${Math.round(avgTokensPerDebate)}`);
}

main();

// ✅ Total valuable speeches: 532632
// 🧠 Total tokens: 1 436 987 302
// 📊 Average tokens per debate: 256972
