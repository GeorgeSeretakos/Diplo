import requests
import json
import os
import signal
import threading
import sys
import re
from utils import (
    get_debates_with_summary_without_topics,
    update_topics_in_db
)

ec2_ip = "54.76.129.50"
url_topic = f"http://{ec2_ip}:8060/api/topic"
username = "anotrandom-EMP-USER"
password = "EMP-EC2_123_TEXT_PROC"

# Load LLM → Greek topic mappings
base_dir = os.path.dirname(__file__)
mapping_path = os.path.join(base_dir, "llm_to_greek_topic.json")

with open(mapping_path, "r", encoding="utf-8") as f:
    llm_to_greek_topic = json.load(f)


shutdown_event = threading.Event()
unique_topics = set()

def handle_interrupt(signum, frame):
    print("\n🛑 Ctrl+C detected! Stopping...")
    shutdown_event.set()
    print("\n📦 Unique topics returned by the model:")
    print(json.dumps(sorted(unique_topics), ensure_ascii=False, indent=2))
    sys.exit(0)

signal.signal(signal.SIGINT, handle_interrupt)

def classify_topics(summary, source_name="text", threshold=0.65):
    prompt = f"""Περίληψη: {summary}"""
    payload = {
        "model": "krikri-topic:latest",
        "prompt": prompt,
        "stream": False,
        "options": {
            "num_ctx": 8192,
            "temperature": 0.1,
            "top_p": 0.8,
            "repeat_penalty": 1.0
        }
    }

    response = requests.post(url_topic, json=payload, auth=(username, password))
    response.raise_for_status()
    result = json.loads(response.text)["response"]

    try:
        match = re.search(r'\[\s*{.*?}\s*(,\s*{.*?}\s*)?\]', result, re.DOTALL)
        if not match:
            raise ValueError("No valid JSON array found in response.")

        parsed_result = json.loads(match.group(0))
        if not isinstance(parsed_result, list):
            raise ValueError("Expected a list")

        # Collect all topic labels regardless of threshold
        for topic_obj in parsed_result:
            topic_label = topic_obj.get("topic")
            if topic_label:
                clean_label = topic_label.strip()
                unique_topics.add(clean_label)

                greek_topic = llm_to_greek_topic.get(clean_label)
                print(f"🧾 Model returned topic: '{clean_label}' → 🇬🇷 Greek mapping: '{greek_topic}'")

        return parsed_result

    except Exception as e:
        print(f"❌ Invalid response for {source_name}:\n{result}\nError: {e}")
        return []

if __name__ == "__main__":
    base_dir = os.path.dirname(__file__)
    DB_PATH = os.path.join(base_dir, "..", "strapi-app", ".tmp", "data.db")

    candidates = get_debates_with_summary_without_topics(DB_PATH)
    total = len(candidates)
    print(f"🔍 Found {total} debates with summaries but no topics.\n")

    for index, (debate_id, summary) in enumerate(candidates, start=1):
        if shutdown_event.is_set():
            break

        print(f"\n[{index}/{total}] 🧠 Collecting topics for debate {debate_id}...")
        parsed_topics = classify_topics(summary, source_name=f"debate-{debate_id}")

        update_topics_in_db(DB_PATH, debate_id, parsed_topics)

    # Fallback print if the script finishes normally
    print("\n✅ Finished. Unique topics returned:")
    print(json.dumps(sorted(unique_topics), ensure_ascii=False, indent=2))
