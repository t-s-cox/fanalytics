import matplotlib.pyplot as plt
import json
from collections import defaultdict

json_file = "merged.json"

with open(json_file, "r", encoding="utf-8") as f:
    json_data = json.load(f)

min_created = 99999999999999
for item in json_data:
    item["created_utc"] = int(item.get("created_utc", 0))
    min_created = min(min_created, int(item["created_utc"]))
base_created = 1758383999+16000

relative = []

for item in json_data:
    item['sentiment'] = int(item.get("sentiment", 0))
    item["relative"] = int((item["created_utc"] - base_created))
    if 0<item['relative'] < 6000:
        relative.append(item)

# Group sentiments into 1-minute bins
buckets = defaultdict(list)
for item in relative:
    rel = int(item.get("relative", 0))
    sentiment = float(item.get("sentiment", 0))  # default neutral if missing

    bucket = rel // 120  # 120s = 2 minutes
    buckets[bucket].append(item)

# Compute averages
x = []
y = []
s = []
negatives = []
for bucket in sorted(buckets.keys()):

    for el in buckets[bucket]:
        if el['sentiment'] == 2:
            negatives.append(el)
    flux = len(buckets[bucket])
    sent = sum(item['sentiment'] for item in buckets[bucket]) / flux if flux > 0 else 0
    x.append(bucket * 120)  # convert bucket index back to seconds
    y.append(flux)
    s.append((sent+4))

for neg in negatives:
    print(f"Prompt: {neg['item']} with sentiment {neg['sentiment']}")

plt.figure(figsize=(10,5))
plt.plot(x, y, marker="o", linestyle="-", color="b", label="Flux")
# plt.plot(x, s, marker="x", linestyle="--", color="r", label="Avg Sentiment")
plt.xlabel("Time")
plt.ylabel("Flux")
plt.title("Flux Every 2 Minutes (First 24h)")
plt.grid(True, linestyle="--", alpha=0.5)
plt.legend()
plt.show()