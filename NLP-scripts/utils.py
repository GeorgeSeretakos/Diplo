import sqlite3

import sqlite3
import json

def fetch_speeches_from_db(db_path, debate_id):
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    query = """
    SELECT s.content
    FROM speeches s
    JOIN speeches_debate_lnk l ON s.id = l.speech_id
    WHERE l.debate_id = ? AND s.valuable = 1
    """
    cursor.execute(query, (debate_id,))
    rows = cursor.fetchall()
    conn.close()

    speeches = []
    for row in rows:
        try:
            paragraphs = json.loads(row[0]) if isinstance(row[0], str) else row[0]
            if isinstance(paragraphs, list):
                speeches.append("\n".join(paragraphs))
            else:
                speeches.append(str(paragraphs))
        except json.JSONDecodeError:
            speeches.append(row[0])

    combined_text = "\n\n".join(speeches)
    return combined_text, len(speeches)




def get_unprocessed_debate_ids(db_path):
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    cursor.execute("""
        SELECT d.id
        FROM debates d
        JOIN speeches_debate_lnk l ON d.id = l.debate_id
        JOIN speeches s ON s.id = l.speech_id
        WHERE s.valuable = 1
        GROUP BY d.id
        HAVING d.summary IS NULL OR TRIM(d.summary) = ''
    """)
    result = [row[0] for row in cursor.fetchall()]
    conn.close()
    return result




def update_summary_in_db(db_path, debate_id, summary_text):
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    # Sanity check: ensure debate exists first (optional)
    cursor.execute("SELECT id FROM debates WHERE id = ?", (debate_id,))
    if cursor.fetchone() is None:
        print(f"Debate with ID {debate_id} not found.")
        conn.close()
        return

    # Safe update of only the summary column
    cursor.execute("""
        UPDATE debates
        SET summary = ?
        WHERE id = ?
    """, (summary_text, debate_id))

    conn.commit()
    conn.close()
    print(f"Summary written directly into database for debate {debate_id}.")



def get_debates_with_summary_without_topics(db_path):
    """Fetch debates that have a summary but no related topics yet."""
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    cursor.execute("""
        SELECT d.id, d.summary
        FROM debates d
        WHERE d.summary IS NOT NULL AND TRIM(d.summary) != ''
        AND NOT EXISTS (
            SELECT 1
            FROM topics_debates_lnk tdl
            WHERE tdl.debate_id = d.id
        )
    """)
    result = cursor.fetchall()
    conn.close()

    return result



import os

# Load the mapping just once
base_dir = os.path.dirname(__file__)
mapping_path = os.path.join(base_dir, "llm_to_greek_topic.json")
with open(mapping_path, "r", encoding="utf-8") as f:
    llm_to_greek_topic = json.load(f)

def update_topics_in_db(db_path, debate_id, llm_topics):
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    for topic_obj in llm_topics:
        llm_label = topic_obj.get("topic")
        if not llm_label:
            continue

        greek_label = llm_to_greek_topic.get(llm_label.strip())
        if not greek_label:
            print(f"⚠️ LLM topic '{llm_label}' not found in mapping.")
            continue

        # Get topic ID for Greek label
        cursor.execute("SELECT id FROM topics WHERE name = ?", (greek_label,))
        row = cursor.fetchone()
        if not row:
            print(f"❌ Topic '{greek_label}' not found in DB.")
            continue

        topic_id = row[0]

        # Link to debate
        cursor.execute("""
            INSERT OR IGNORE INTO topics_debates_lnk (topic_id, debate_id)
            VALUES (?, ?)
        """, (topic_id, debate_id))

    conn.commit()
    conn.close()

import sqlite3

def get_valuable_speeches_without_sentiment(db_path):
    import sqlite3
    import json

    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    cursor.execute("""
        SELECT id, content
        FROM speeches
        WHERE valuable = 1 AND (sentiment IS NULL OR TRIM(sentiment) = '')
    """)
    rows = cursor.fetchall()
    conn.close()

    results = []
    for speech_id, content in rows:
        try:
            paragraphs = json.loads(content) if isinstance(content, str) else content
            text = "\n".join(paragraphs) if isinstance(paragraphs, list) else str(paragraphs)
        except Exception:
            text = str(content)
        results.append((speech_id, text.strip()))

    return results



def update_speech_sentiment(db_path, speech_id, sentiment_data):
    import sqlite3
    import json

    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    try:
        sentiment = sentiment_data["speech_analysis"]["sentiment"]["value"]
        polarity = sentiment_data["speech_analysis"]["polarity_strength"]["value"]
        intensity = sentiment_data["speech_analysis"]["emotional_intensity"]["value"]
        intent = sentiment_data["speech_analysis"]["rhetorical_intent"]["value"]

        sentiment_json_str = json.dumps(sentiment_data, ensure_ascii=False)

        cursor.execute("""
            UPDATE speeches
            SET sentiment = ?,
                polarity_strength = ?,
                emotional_intensity = ?,
                rhetorical_intent = ?,
                sentiment_json = ?
            WHERE id = ?
        """, (sentiment, polarity, intensity, intent, sentiment_json_str, speech_id))

        conn.commit()
        print(f"✅ Stored sentiment for speech {speech_id}")
    except Exception as e:
        print(f"❌ Failed to update sentiment for speech {speech_id}: {e}")
    finally:
        conn.close()

