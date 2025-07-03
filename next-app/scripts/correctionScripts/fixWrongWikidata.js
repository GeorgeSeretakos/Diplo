import fs from "fs";
import dotenv from "dotenv";
import enrichSpeakerFromWikidata from "../utils/enrichSpeakerFromWikidata.js";

// Load environment variables
dotenv.config();

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL;
const API_TOKEN = process.env.API_TOKEN;

const inputPath = "../../public/data/wrong-wiki-url-speakers.json";

async function runBatchFix() {
  const rawData = fs.readFileSync(inputPath, "utf-8");
  const speakerList = JSON.parse(rawData);

  for (const { speaker_id, wikidata_url } of speakerList) {
    try {
      console.log(`🔧 Fixing speaker: ${speaker_id}`);
      await enrichSpeakerFromWikidata(speaker_id, wikidata_url, STRAPI_URL, API_TOKEN);
    } catch (err) {
      console.error(`❌ Failed to fix ${speaker_id}:`, err.message);
    }
  }

  console.log("✅ Batch fix completed.");
}

await runBatchFix();
