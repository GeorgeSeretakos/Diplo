import sqlite3 from "sqlite3";
import { open } from "sqlite";
import path from "path";

import calculateAge from "../utils/calculateAge.js";

// === CONFIG ===
const DB_PATH = path.resolve("../../../strapi-app/.tmp/data.db");

async function updateSpeakerAges() {
  const db = await open({
    filename: DB_PATH,
    driver: sqlite3.Database,
  });

  try {
    const speakers = await db.all(`
      SELECT id, speaker_id, date_of_birth, date_of_death
      FROM speakers
      WHERE link IS NOT '-' AND date_of_birth IS NOT NULL
    `);

    console.log(`🧠 Found ${speakers.length} speakers to update.`);

    await db.exec("BEGIN TRANSACTION;");
    for (const speaker of speakers) {
      const age = calculateAge(speaker.date_of_birth, speaker.date_of_death);
      if (age !== null) {
        await db.run(
          `UPDATE speakers SET age = ? WHERE id = ?`,
          [age, speaker.id]
        );
        console.log(`✅ Updated ${speaker.speaker_id} → age: ${age}`);
      } else {
        console.warn(`⚠️ Skipped ${speaker.speaker_id} due to invalid dates`);
      }
    }
    await db.exec("COMMIT;");
    console.log("🎉 Age update complete.");
  } catch (err) {
    await db.exec("ROLLBACK;");
    console.error("❌ Failed to update ages:", err.message);
  } finally {
    await db.close();
  }
}

await updateSpeakerAges();
