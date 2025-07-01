import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, '../../../strapi-app/.tmp/data.db');
const db = new Database(dbPath);

// Excluded speaker names (unchanged)
const excludedNames = new Set(['ΙΩΑΝΝΗΣ ΜΠΡΑΤΑΚΟΣ', 'ΑΓΓΕΛΟΣ ΜΠΡΑΤΑΚΟΣ', 'ΔΗΜΗΤΡΙΟΣ ΚΟΥΤΣΟΥΜΠΑΣ', 'ΔΗΜΗΤΡΙΟΣ ΚΟΥΤΣΟΓΙΩΡΓΑΣ',
  'ΠΕΤΡΟΣ ΔΗΜΗΤΡΙΑΔΗΣ', 'ΔΗΜΗΤΡΙΟΣ ΝΑΤΣΙΟΣ', 'ΧΡΗΣΤΟΣ ΜΑΡΚΟΓΙΑΝΝΑΚΗΣ', 'ΙΩΑΝΝΗΣ ΜΑΡΚΟΓΙΑΝΝΑΚΗΣ',
  'ΑΝΤΩΝΙΟΣ ΔΡΟΣΟΓΙΑΝΝΗΣ', 'ΙΩΑΝΝΗΣ ΔΡΟΣΟΓΙΑΝΝΗΣ', 'ΚΩΝΣΤΑΝΤΙΝΟΣ ΚΑΡΑΜΑΝΛΗΣ', 'ΚΩΝΣΤΑΝΤΙΝΑ ΚΑΡΑΜΠΑΤΣΩΛΗ',
  'ΔΗΜΗΤΡΙΟΣ ΣΤΑΜΕΝΙΤΗΣ', 'ΑΘΑΝΑΣΙΟΣ ΚΟΥΡΑΚΗΣ', 'ΓΕΩΡΓΙΟΣ ΔΑΣΚΑΛΑΚΗΣ', 'ΓΕΩΡΓΙΟΣ ΔΕΙΚΤΑΚΗΣ', 'ΜΑΚΗΣ ΒΟΡΙΔΗΣ',
  'ΠΑΝΑΓΙΩΤΗΣ ΣΚΟΥΡΛΕΤΗΣ', 'ΠΑΝΑΓΙΩΤΗΣ ΣΚΟΥΡΟΛΙΑΚΟΣ', 'ΕΥΣΤΑΘΙΟΣ ΚΩΝΣΤΑΝΤΙΝΙΔΗΣ', 'ΘΕΟΔΟΣΙΟΣ ΚΩΝΣΤΑΝΤΙΝΙΔΗΣ',
  'ΔΗΜΗΤΡΙΟΣ ΠΕΠΟΝΗΣ', 'ΔΗΜΗΤΡΙΟΣ ΚΡΕΜΑΣΤΙΝΟΣ', 'ΑΝΔΡΕΑΣ ΚΡΕΜΑΣΤΙΝΟΣ', 'ΑΘΑΝΑΣΙΑ ΑΝΑΓΝΩΣΤΟΠΟΥΛΟΥ', 'ΑΝΑΣΤΑΣΙΑ ΑΝΑΓΝΩΣΤΟΠΟΥΛΟΥ',
  'ΑΠΟΣΤΟΛΟΣ ΚΑΡΑΝΑΣΤΑΣΗΣ', 'ΑΝΑΣΤΑΣΙΟΣ ΚΑΡΑΝΑΣΤΑΣΗΣ', 'ΤΡΙΑΝΤΑΦΥΛΛΟΣ ΜΠΕΛΛΟΣ', 'ΤΡΙΑΝΤΑΦΥΛΛΟΣ ΜΗΤΑΦΙΔΗΣ',
  'ΑΠΟΣΤΟΛΟΣ ΤΑΣΟΥΛΑΣ', 'ΚΩΝΣΤΑΝΤΙΝΟΣ ΤΑΣΟΥΛΑΣ', 'ΙΩΑΝΝΗΣ ΤΡΑΓΑΚΗΣ', 'ΓΕΩΡΓΙΟΣ ΤΡΑΓΑΚΗΣ', 'ΣΠΥΡΙΔΩΝ ΚΑΡΑΜΟΥΤΣΟΣ',
  'ΜΕΡΚΟΥΡΗΣ ΚΥΡΑΤΣΟΥΣ', 'ΣΠΥΡΙΔΩΝ ΚΥΡΙΑΚΗΣ', 'ΣΠΥΡΙΔΩΝ ΜΟΣΧΟΠΟΥΛΟΣ', 'ΓΕΩΡΓΙΟΣ ΠΑΠΑΓΕΩΡΓΙΟΥ', 'ΓΕΩΡΓΙΟΣ ΠΑΥΛΑΚΑΚΗΣ',
  'ΠΑΝΑΓΙΩΤΗΣ ΨΩΜΙΑΔΗΣ', 'ΠΑΝΑΓΙΩΤΗΣ ΣΑΛΑΓΚΟΥΔΗΣ', 'ΑΝΑΣΤΑΣΙΟΣ ΠΕΠΟΝΗΣ', 'ΑΘΑΝΑΣΙΟΣ ΠΕΠΟΝΗΣ', 'ΙΩΑΝΝΗΣ ΛΟΒΕΡΔΟΣ',
  'ΙΩΑΝΝΗΣ ΒΑΛΗΝΑΚΗΣ', 'ΓΕΩΡΓΙΟΣ ΑΛΟΓΟΣΚΟΥΦΗΣ', 'ΔΗΜΗΤΡΙΟΣ ΑΛΟΓΟΣΚΟΥΦΗΣ', 'ΣΠΥΡΙΔΩΝ ΒΟΥΓΙΑΣ', 'ΣΠΥΡΙΔΩΝ ΜΠΙΜΠΙΛΑΣ',
  'ΣΤΑΥΡΟΣ ΔΗΜΑΣ', 'ΣΤΑΥΡΟΣ ΣΟΥΜΑΚΗΣ', 'ΑΝΑΚΟΙΝΩΣΗ', 'ΚΥΡΙΑΚΟΠΟΥΛΟΣ ΒΕΛΟΠΟΥΛΟΣ', 'ΚΥΡΙΑΚΟΣ ΒΕΛΟΠΟΥΛΟΣ',
  'ΠΑΝΑΓΙΩΤΗΣ Ν. ΤΙΚΟΣ', 'ΠΑΝΑΓΙΩΤΗΣ ΘΕΟΔΩΡΙΚΑΚΟΣ', 'ΓΕΡΑΣΙΜΟΣ ΑΡΣΕΝΗΣ', 'ΙΩΑΝΝΗΣ ΠΟΤΤΑΚΗΣ', 'ΓΙΑΝΝΗΣ ΧΑΡΑΛΑΜΠΟΠΟΥΛΟΣ',
  'ΚΩΝΣΤΑΝΤΙΝΟΣ ΧΑΡΑΛΑΜΠΟΠΟΥΛΟΣ', 'ΦΙΛΛΙΠΠΟΣ ΠΕΤΣΑΛΝΙΚΟΣ', 'ΒΑΣΙΛΕΙΟΣ ΠΕΤΣΑΛΝΙΚΟΣ', 'ΣΤΕΦΑΝΟΣ ΜΑΝΟΣ', 'ΜΑΝΟΣ ΦΡΑΓΚΙΑΔΟΥΛΑΚΗΣ',
  'ΒΑΣΙΛΕΙΟΣ ΚΙΚΙΛΙΑΣ', 'ΒΑΣΙΛΕΙΟΣ ΒΑΣΙΛΑΚΑΚΗΣ', 'ΙΟΡΔΑΝΗΣ ΤΖΑΜΤΖΗΣ', 'ΙΩΑΝΝΗΣ ΤΖΑΜΤΖΗΣ', 'ΔΗΜΗΤΡΙΟΣ ΣΤΑΜΕΝΙΤΗΣ',
  'ΙΩΑΝΝΗΣ ΠΡΩΤΟΥΛΗΣ', 'ΙΩΑΝΝΗΣ ΘΩΜΟΠΟΥΛΟΣ', 'ΑΝΑΚΟΙΝΩΣΗ', 'ΜΑΡΙΕΤΤΑ ΓΙΑΝΝΑΚΟΥ-ΚΟΥΤΣΙΚΟΥ', 'ΜΑΡΙΕΤΑ ΓΙΑΝΝΑΚΟΥ'
]);

// Step 1: Find links that appear more than once (excluding NULL and '-')
const duplicateLinks = db
  .prepare(`
      SELECT link
      FROM speakers
      WHERE link IS NOT NULL AND link != '-'
      GROUP BY link
      HAVING COUNT(*) > 1
  `)
  .all()
  .map(row => row.link);

// Step 2: Build merge groups
const mergeGroups = [];

for (const link of duplicateLinks) {
  const speakers = db
    .prepare(`
        SELECT id, speaker_name
        FROM speakers
        WHERE link = ?
        ORDER BY LENGTH(speaker_name) DESC
    `)
    .all(link);

  const main = speakers.find(s => !excludedNames.has(s.speaker_name));
  if (!main) continue;

  const mainId = main.id;
  const secondaryIds = speakers.filter(s => s.id !== mainId).map(s => s.id);

  if (secondaryIds.length) {
    mergeGroups.push({ link, mainId, mainName: main.speaker_name, secondaryIds });
  }
}

// Step 3: Perform merges with progress output
console.log(`🔄 Starting merge of ${mergeGroups.length} speaker groups...\n`);

mergeGroups.forEach(({ link, mainId, mainName, secondaryIds }, index) => {
  console.log(`🔧 [${index + 1}/${mergeGroups.length}] Merging into: ${mainName} (ID ${mainId}) [${secondaryIds.length} duplicates]`);

  const tx = db.transaction(() => {
    for (const secId of secondaryIds) {
      db.prepare(`UPDATE speeches SET speaker_id = ? WHERE speaker_id = ?`).run(mainId, secId);
      db.prepare(`UPDATE speeches_speaker_lnk SET speaker_id = ? WHERE speaker_id = ?`).run(mainId, secId);
      db.prepare(`
          INSERT OR IGNORE INTO speakers_debates_lnk (speaker_id, debate_id)
          SELECT ?, debate_id FROM speakers_debates_lnk WHERE speaker_id = ?
      `).run(mainId, secId);
      db.prepare(`DELETE FROM speakers_debates_lnk WHERE speaker_id = ?`).run(secId);
      db.prepare(`DELETE FROM speeches_speaker_lnk WHERE speaker_id = ?`).run(secId);
      db.prepare(`DELETE FROM speakers WHERE id = ?`).run(secId);
    }

    // ✅ Ensure no speech is left out of speeches_speaker_lnk
    db.prepare(`
        INSERT OR IGNORE INTO speeches_speaker_lnk (speech_id, speaker_id)
        SELECT id, ? FROM speeches WHERE speaker_id = ?
    `).run(mainId, mainId);
  });

  tx();
});

console.log(`\n✅ Done. Merged ${mergeGroups.length} speaker groups based on shared links.`);
