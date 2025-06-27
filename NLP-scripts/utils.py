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
    """Fetch debates that have a summary but no topics yet."""
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    cursor.execute("""
        SELECT id, summary
        FROM debates
        WHERE summary IS NOT NULL AND TRIM(summary) != ''
        AND (topics IS NULL OR TRIM(topics) = '')
    """)
    result = cursor.fetchall()
    conn.close()

    # Returns a list of (id, summary) tuples
    return result


def update_topics_in_db(db_path, debate_id, topics_list):
    """Update the topics column in the debates table."""
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    topics_json = json.dumps(topics_list, ensure_ascii=False)

    cursor.execute("""
        UPDATE debates
        SET topics = ?
        WHERE id = ?
    """, (topics_json, debate_id))

    conn.commit()
    conn.close()
    print(f"✅ Topics saved to DB for debate {debate_id}: {topics_json}")

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

