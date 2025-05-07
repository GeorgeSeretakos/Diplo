import path from "path";
import { fileURLToPath } from "url";
import Database from "better-sqlite3";
import { randomUUID } from "crypto";
import uploadImageToStrapi from "../utils/uploadImageToStrapi.js";
import axios from "axios";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, "../../../strapi-app/.tmp/data.db");
const db = new Database(dbPath);

function getInternalPartyId(name) {
  const result = db.prepare("SELECT id FROM political_parties WHERE name = ?").get(name);
  return result ? result.id : null;
}

function insertPoliticalPartyToDB(name) {
  const documentId = randomUUID();
  const insert = db.prepare(
    `INSERT INTO political_parties (document_id, name, created_at, updated_at)
     VALUES (?, ?, datetime('now'), datetime('now'))`
  );
  insert.run(documentId, name);
  return {
    documentId,
    id: db.prepare("SELECT id FROM political_parties WHERE document_id = ?").get(documentId).id
  };
}

export default async function findOrCreatePoliticalParty(politicalParty, STRAPI_URL, API_TOKEN) {
  if (!politicalParty || !politicalParty.name) return null;

  try {
    const existingId = getInternalPartyId(politicalParty.name);
    if (existingId) {
      console.log(`Political Party ${politicalParty.name} already exists.`);
      return existingId;
    }

    const { id, documentId } = insertPoliticalPartyToDB(politicalParty.name);
    console.log("✅", politicalParty.name);

    if (politicalParty.image) {
      const imageId = await uploadImageToStrapi(politicalParty.image, STRAPI_URL, API_TOKEN);
      if (imageId) {
        try {
          await axios.put(
            `${STRAPI_URL}/api/political-parties/${documentId}`,
            {
              data: { image: imageId }
            },
            {
              headers: {
                Authorization: `Bearer ${API_TOKEN}`,
                'Content-Type': 'application/json',
              }
            }
          );
        } catch (patchError) {
          console.warn(`⚠️ Failed to link image to political party ${politicalParty.name}:`, patchError.message);
        }
      } else {
        console.warn(`⚠️ Image upload failed for party ${politicalParty.name}.`);
      }
    }

    return id; // internal id for the linking
  } catch (error) {
    const errorLog = {
      party: politicalParty.name,
      message: error.message,
      stack: error.stack
    };
    console.error("❌ Political Party creation failed:", JSON.stringify(errorLog, null, 2));
    throw error;
  }
}
