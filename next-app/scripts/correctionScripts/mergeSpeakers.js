import fs from 'fs';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

const DB_PATH = '../../../.tmp/data.db';
const inputPath = './public/data/merge-speakers.json';

async function mergeSpeakers() {
  const rawData = fs.readFileSync(inputPath, 'utf-8');
  const { primary_id: primaryId, secondary_ids: secondaryIds } = JSON.parse(rawData);

  if (!primaryId || !Array.isArray(secondaryIds) || secondaryIds.length === 0) {
    console.error('❌ Invalid input JSON. Make sure it contains `primary_id` and non-empty `secondary_ids`.');
    return;
  }

  const db = await open({
    filename: DB_PATH,
    driver: sqlite3.Database,
  });

  try {
    await db.exec('BEGIN TRANSACTION');

    console.log("🔍 Collecting speeches linked to secondary speakers...");
    const placeholders = secondaryIds.map(() => '?').join(',');
    const speeches = await db.all(
      `SELECT speech_id FROM speeches_speaker_lnk WHERE speaker_id IN (${placeholders})`,
      secondaryIds
    );
    const speechIds = speeches.map(row => row.speech_id);

    console.log(`🗑️ Deleting links and secondary speakers...`);
    await db.run(
      `DELETE FROM speeches_speaker_lnk WHERE speaker_id IN (${placeholders})`,
      secondaryIds
    );
    await db.run(
      `DELETE FROM speeches_debate_lnk WHERE speaker_id IN (${placeholders})`,
      secondaryIds
    );
    await db.run(
      `DELETE FROM speakers WHERE id IN (${placeholders})`,
      secondaryIds
    );

    console.log("🔗 Re-linking speeches to the primary speaker...");
    const insertStmt = await db.prepare(
      `INSERT INTO speeches_speaker_lnk (speech_id, speaker_id) VALUES (?, ?)`
    );
    for (const speechId of speechIds) {
      await insertStmt.run(speechId, primaryId);
    }
    await insertStmt.finalize();

    await db.exec('COMMIT');
    console.log("✅ Merge completed successfully.");
  } catch (err) {
    await db.exec('ROLLBACK');
    console.error("❌ Merge failed:", err.message);
  } finally {
    await db.close();
  }
}

await mergeSpeakers();
