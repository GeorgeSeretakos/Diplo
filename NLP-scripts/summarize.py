import requests
import json
import glob
import re
import os

from utils import (
    fetch_speeches_from_db,
    update_summary_in_db,
    get_unprocessed_debate_ids
)

from concurrent.futures import ThreadPoolExecutor


import signal
import sys
import threading

import time

shutdown_event = threading.Event()

def handle_interrupt(signum, frame):
    print("\n🛑 Ctrl+C detected! Stopping new tasks...")
    shutdown_event.set()

signal.signal(signal.SIGINT, handle_interrupt)


# FastAPI endpoint
ec2_ip = "54.76.129.50"
url = f"http://{ec2_ip}:8000/api/generate"
username = "anotrandom-EMP-USER"
password = "EMP-EC2_123_TEXT_PROC"


def preprocess_text(text):
    """Remove irrelevant sections like Νομική ισχύς and Υπογραφές."""
    patterns = [
            r'\s+',                                     # Normalize whitespace
    ]
    cleaned_text = text
    for pattern in patterns:
        cleaned_text = re.sub(pattern, ' ', cleaned_text, flags=re.DOTALL | re.IGNORECASE)
    return cleaned_text.strip()



def summarize_chunk(chunk, chunk_index, total_chunks):
    """Summarize a single chunk with context-aware prompt."""
    thread_id = threading.get_ident()
    start_time = time.time()
    print(f"🧵 Thread {thread_id} summarizing chunk {chunk_index+1}/{total_chunks}")

    prompt = f"""
    Δημιούργησε μια περίληψη 100-150 λέξεων για το ακόλουθο κείμενο, που είναι το τμήμα {chunk_index+1} από {total_chunks} ενός μεγαλύτερου εγγράφου:
    - Εστίασε στα κύρια σημεία, αποφεύγοντας δευτερεύουσες λεπτομέρειες.
    - Χρησιμοποίησε φυσική ελληνική γλώσσα, χωρίς επαναλήψεις.
    - Μην αναφέρεις ότι πρόκειται για μερικό κείμενο ή ότι είναι από συγκεκριμένο τμήμα.
    Κείμενο:
    {chunk}
    """
    payload = {
        "model": "krikri-summarizer",
        "prompt": prompt,
        "stream": False,
        "options": {"num_ctx": 32768}
    }
    response = requests.post(url, json=payload, auth=(username, password))
    response.raise_for_status()
    summary = json.loads(response.text)["response"]

    duration = time.time() - start_time
    print(f"⏱️ Thread {thread_id} finished chunk {chunk_index+1} in {duration:.2f}s")
    return summary



def combine_summaries(summaries):
    """Recursively summarize combined chunk summaries."""
    combined_text = ' '.join(summaries)

    # If summary-set is too long, we need to re-chunk
    if len(combined_text) > 15000:
        print("Too long — recursively summarizing summaries")
        return summarize_text(combined_text, source_name="recursive")

    prompt = f"""
    Δημιούργησε μια τελική περίληψη 100-150 λέξεων από τις ακόλουθες επιμέρους περιλήψεις, που καλύπτουν ένα μεγαλύτερο έγγραφο:
    - Συνδύασε τα κύρια σημεία σε μια ενιαία, συνοπτική περίληψη.
    - Αφαίρεσε επαναλήψεις και δευτερεύουσες λεπτομέρειες.
    - Χρησιμοποίησε φυσική, ροϊκή ελληνική γλώσσα.
    - Αγνόησε τυχόν αναφορές σε μερικά κείμενα ή τμήματα.
    Περιλήψεις:
    {combined_text}
    """
    payload = {
        "model": "krikri-summarizer",
        "prompt": prompt,
        "stream": False,
        "options": {"num_ctx": 32768}
    }
    response = requests.post(url, json=payload, auth=(username, password))
    response.raise_for_status()
    final_summary = json.loads(response.text)["response"]
    return final_summary




def summarize_text(text, source_name="text"):
    """Summarize text using recursive summarization with overlap."""
    # Preprocess to remove irrelevant sections
    cleaned_text = preprocess_text(text)
    
    # Parameters
    chunk_size = 15000  # ~9k Greek words, within 32k tokens
    overlap_size = 2000  # ~1k Greek words, ensures context continuity
    
    if len(cleaned_text) <= chunk_size:
        prompt = f"""
        Δημιούργησε μια περίληψη 100-150 λέξεων:
        - Εστίασε στα κύρια σημεία, αποφεύγοντας δευτερεύουσες λεπτομέρειες.
        - Χρησιμοποίησε φυσική ελληνική γλώσσα, χωρίς επαναλήψεις.
        Κείμενο:
        {cleaned_text}
        """
        payload = {
            "model": "krikri-summarizer",
            "prompt": prompt,
            "stream": False,
            "options": {"num_ctx": 32768}
        }
        response = requests.post(url, json=payload, auth=(username, password))
        response.raise_for_status()
        summary = json.loads(response.text)["response"]
        print(f"Summary for {source_name}:\n{summary}")
        return summary
    
    # Chunk with overlap
    chunks = []
    for i in range(0, len(cleaned_text), chunk_size - overlap_size):
        chunk = cleaned_text[i:i + chunk_size]
        if chunk.strip():
            chunks.append(chunk)
    
    # Summarize each chunk
    chunk_summaries = []
    for idx, chunk in enumerate(chunks):
        summary = summarize_chunk(chunk, idx, len(chunks))
        chunk_summaries.append(summary)
    
    # Recursively summarize combined summaries
    final_summary = combine_summaries(chunk_summaries)
    print(f"Final summary for {source_name}:\n{final_summary}")
    return final_summary




import threading

progress_lock = threading.Lock()
progress_counter = {"done": 0, "total": 0}

def process_debate(debate_id, db_path, index, total):
    thread_id = threading.get_ident()
    start_time = time.time()
    try:
        print(f"[{debate_id}] 🧠 Started by thread {thread_id} | Debate {index}/{total}")
        text, count = fetch_speeches_from_db(db_path, debate_id)
        if not text.strip():
            print(f"[{debate_id}] ⚠️ Empty valuable speeches.")
        else:
            summary = summarize_text(text, source_name=f"debate-{debate_id}")
            update_summary_in_db(db_path, debate_id, summary)
            duration = time.time() - start_time
            print(f"[{debate_id}] ✅ Summary complete in {duration:.2f}s by thread {thread_id}")
    except Exception as e:
        print(f"[{debate_id}] ❌ ERROR: {e}")
    finally:
        with progress_lock:
            progress_counter["done"] += 1
            print(f"📊 Progress: {progress_counter['done']}/{total} debates complete.")




# === MAIN SCRIPT ===
if __name__ == "__main__":
    base_dir = os.path.dirname(__file__)
    DB_PATH = os.path.join(base_dir, "..", "strapi-app", ".tmp", "data.db")

    debate_ids = get_unprocessed_debate_ids(DB_PATH)
    total = len(debate_ids)
    progress_counter["total"] = total

    print(f"🔄 Starting parallel summarization of {total} debates...")

    with ThreadPoolExecutor(max_workers=5) as executor:
        for i, debate_id in enumerate(debate_ids, start=1):
            if shutdown_event.is_set():
                print("🛑 Skipping remaining tasks due to shutdown.")
                break
            executor.submit(process_debate, debate_id, DB_PATH, i, total)