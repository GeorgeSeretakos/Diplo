import axios from 'axios';
import cheerio from 'cheerio';
import fs from 'fs';

const url = 'https://www.hellenicparliament.gr/Praktika/Synedriaseis-Olomeleias';

async function fetchSessions() {
  try {
    const { data: html } = await axios.get(url);
    const $ = cheerio.load(html);

    // You may need to adjust this selector based on the actual select's name or ID
    const sessions = [];
    $('option').each((_, el) => {
      const text = $(el).text().trim();
      if (text && !$(el).attr('disabled')) {
        sessions.push(text);
      }
    });

    // Output to console
    console.log(`✅ Found ${sessions.length} session/period labels:\n`);
    sessions.forEach((s, i) => console.log(`${i + 1}. ${s}`));

    // Save to file
    fs.writeFileSync('./parliament_sessions.json', JSON.stringify(sessions, null, 2), 'utf8');
    console.log('\n💾 Saved to parliament_sessions.json');
  } catch (err) {
    console.error('❌ Error fetching or parsing:', err.message);
  }
}

fetchSessions();
