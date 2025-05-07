import path from "path";
import { fileURLToPath } from "url";
import Database from "better-sqlite3";
import { randomUUID } from "crypto";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, "../../../strapi-app/.tmp/data.db");
const db = new Database(dbPath);


function extractDebateData(jsonData) {
  const dData = jsonData.akomaNtoso.debate[0].meta[0].identification[0];
  const opening_section = jsonData.akomaNtoso.debate[0].debateBody[0].debateSection[0].p[0];

  const containers = jsonData.akomaNtoso.debate[0].preface[0].container;
  const parliamentDetailsContainer = containers.find(
    c => c.$?.name === "parliament_details"
  );
  const pData = parliamentDetailsContainer?.p || [];

  return {
    title: dData.FRBRWork[0].FRBRalias[0].$.value,
    date: dData.FRBRWork[0].FRBRdate[0].$.date,
    opening_section: opening_section,
    period: pData[1] || "Unknown Period",
    session: pData[2] || "Unknown Session",
    meeting: pData[3] || "Unknown Meeting",
    session_date: pData[4] || "Unknown Session Date",
  };
}

export async function insertDebate(jsonData) {
  const debateData = extractDebateData(jsonData);

  const documentId = randomUUID();
  const insert = db.prepare(
    `INSERT INTO debates (document_id, title, date, opening_section, period, session, meeting, session_date, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`
  );

  insert.run(
    documentId,
    debateData.title,
    debateData.date,
    debateData.opening_section,
    debateData.period,
    debateData.session,
    debateData.meeting,
    debateData.session_date
  );

  console.log("✅ Debate inserted successfully.");
  return documentId;
}