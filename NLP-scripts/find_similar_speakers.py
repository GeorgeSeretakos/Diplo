import sqlite3
import itertools
from Levenshtein import distance as levenshtein_distance
import os

base_dir = os.path.dirname(__file__)
DB_PATH = os.path.join(base_dir, "..", "strapi-app", ".tmp", "data.db")

# Union-Find (Disjoint Set)
class UnionFind:
    def __init__(self):
        self.parent = dict()

    def find(self, x):
        if x not in self.parent:
            self.parent[x] = x
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])
        return self.parent[x]

    def union(self, x, y):
        self.parent[self.find(x)] = self.find(y)

# Connect to SQLite
conn = sqlite3.connect(DB_PATH)
cursor = conn.cursor()
cursor.execute("SELECT id, speaker_name, speaker_id FROM speakers")
speakers = cursor.fetchall()

# Initialize Union-Find
uf = UnionFind()

# Compare and group similar speakers
for (id1, name1, sid1), (id2, name2, sid2) in itertools.combinations(speakers, 2):
    name_dist = levenshtein_distance(name1.lower(), name2.lower())
    id_dist = levenshtein_distance(sid1.lower(), sid2.lower()) if sid1 and sid2 else 999
    if name_dist <= 2 or id_dist <= 2:
        uf.union(id1, id2)

# Group by root ID
groups = {}
for id, name, sid in speakers:
    root = uf.find(id)
    if root not in groups:
        groups[root] = []
    groups[root].append((id, name, sid))

# Create table if it doesn't exist
cursor.execute("""
    CREATE TABLE IF NOT EXISTS speaker_duplicates (
        main_id INTEGER,
        duplicate_id INTEGER,
        PRIMARY KEY (main_id, duplicate_id)
    );
""")

# Print and insert to DB
cluster_count = 0
all_cluster_speakers = []

for root_id, members in groups.items():
    if len(members) > 1:
        cluster_count += 1
        all_cluster_speakers.extend(members)  # Add all members of this cluster
        print(f"\n🧩 Cluster {cluster_count}:")
        main_id = min([m[0] for m in members])
        for m in members:
            print(f"   - ID: {m[0]:<4} | Name: {m[1]:<40} | SID: {m[2]}")
            if m[0] != main_id:
                cursor.execute(
                    "INSERT OR IGNORE INTO speaker_duplicates (main_id, duplicate_id) VALUES (?, ?)",
                    (main_id, m[0])
                )

conn.commit()

# Final counts
print(f"\n✅ Total clusters with duplicates: {cluster_count}")
print(f"✅ Total speakers involved (main + duplicates): {len(all_cluster_speakers)}")

