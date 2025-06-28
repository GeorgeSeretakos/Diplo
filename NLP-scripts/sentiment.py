import requests
import json
import os
import signal
import threading
import sys
import re
from concurrent.futures import ThreadPoolExecutor

from utils import (
    get_valuable_speeches_without_sentiment,
    update_speech_sentiment
)

ec2_ip = "54.76.129.50"
url_senti = f"http://{ec2_ip}:8070/api/senti"
username = "anotrandom-EMP-USER"
password = "EMP-EC2_123_TEXT_PROC"


shutdown_event = threading.Event()
signal.signal(signal.SIGINT, lambda s, f: shutdown_event.set())


progress_counter = {"done": 0, "total": 0}
progress_lock = threading.Lock()


def truncate_text_to_tokens(text, max_tokens=15000):
    words = text.split()
    truncated_words = words[:max_tokens]
    return " ".join(truncated_words)



def get_sentiment(text, source_name="speech"):
    prompt = f"""
    Ανάλυσε το παρακάτω κείμενο και επέστρεψε ένα JSON αυστηρά στη μορφή:
    {{
      "speech_analysis": {{
        "sentiment": {{
          "value": -1 | 0 | 1,
          "explanation": ". . ."
        }},
        "polarity_strength": {{
          "value": -1 | 0 | 1,
          "explanation": ". . ."
        }},
        "rhetorical_intent": {{
          "value": "Inform/Explain | Persuade/Advocate | Motivate/Inspire | Criticize/Denounce | Commemorate/Honor | Other",
          "explanation": ". . ."
        }},
        "emotional_intensity": {{
          "value": 1 | 2 | 3,
          "explanation": ". . ."
        }}
      }}
    }}

    Κείμενο: {text}
    """

    payload = {
        "model": "krikri-senti:latest",
        "prompt": prompt,
        "stream": False,
        "options": {
            "num_ctx": 32768,
            "temperature": 0.1,
            "top_p": 0.8,
            "repeat_penalty": 1.0
        }
    }

    try:
        response = requests.post(url_senti, json=payload, auth=(username, password))
        response.raise_for_status()
        response_json = json.loads(response.text)
        raw_inner = response_json.get("response", "").strip()

        # Remove wrapping ```json ... ``` if exists
        if raw_inner.startswith("```json"):
            raw_inner = raw_inner.strip("` \n")
            raw_inner = re.sub(r"^json\n", "", raw_inner)  # remove 'json\n' if present

        # Attempt to parse the raw_inner string
        parsed = json.loads(raw_inner)
        print(f"🎯 Sentiment for {source_name}:\n{json.dumps(parsed, ensure_ascii=False, indent=2)}")
        return parsed

    except Exception as e:
        print(f"❌ Sentiment API failed for {source_name}\nError: {e}")
        try:
            print("📦 Raw response text:\n", response.text)
        except:
            print("⚠️ No response text available.")
        return None




# --- Processing Function for Thread ---
def process_speech(speech_id, text, index, total, db_path):
    if shutdown_event.is_set():
        return

    # ✅ Truncate input
#     truncated_text = truncate_text_to_tokens(text, max_tokens=15000)

    print(f"\n[{index}/{total}] 🧠 Analyzing sentiment for speech {speech_id}...")
    sentiment = get_sentiment(text, source_name=f"speech-{speech_id}")

    if sentiment:
        update_speech_sentiment(db_path, speech_id, sentiment)

    with progress_lock:
        progress_counter["done"] += 1
        percent = (progress_counter["done"] / progress_counter["total"]) * 100
        print(f"📊 Progress: {progress_counter['done']}/{progress_counter['total']} speeches complete ({percent:.2f}%)")


# === MAIN SCRIPT ===
if __name__ == "__main__":
    base_dir = os.path.dirname(__file__)
    DB_PATH = os.path.join(base_dir, "..", "strapi-app", ".tmp", "data.db")

    speeches = get_valuable_speeches_without_sentiment(DB_PATH)
    total = len(speeches)
    print(f"🔍 Found {total} valuable speeches without sentiment.\n")

    progress_counter["total"] = total

    with ThreadPoolExecutor(max_workers=10) as executor:
        for index, (speech_id, text) in enumerate(speeches, start=1):
            if shutdown_event.is_set():
                print("🛑 Shutdown signal received. Skipping remaining tasks.")
                break
            executor.submit(process_speech, speech_id, text, index, total, DB_PATH)
