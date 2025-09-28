import json
import matplotlib.pyplot as plt
from datetime import datetime

# Load JSON data
with open("jsons/lsuvolemissResults.json", "r") as f:
    data = json.load(f)

# Convert timestamps to datetime
for d in data:
    d["time"] = datetime.fromtimestamp(d["timestamp"])

# Sort data by time just in case
data.sort(key=lambda x: x["time"])

# Define different window sizes in seconds
window_sizes = [90]
confidence_min = 3

mins = []

# Function to bucket predictions
def compute_bucket_avgs(data, window_size):
    start_time = min(d["time"] for d in data)
    buckets = {}
    for d in data:
        delta = (d["time"] - start_time).total_seconds()
        bucket = int(delta // window_size)
        if bucket not in buckets:
            buckets[bucket] = []
        buckets[bucket].append(d)
        mins.append((d["prediction"], d['text']))

    total_avg = sum(d["prediction"] for d in data) / len(data)

    times, avgs = [], []
    for bucket, preds in sorted(buckets.items()):
        avg = sum(d["prediction"] for d in preds) / len(preds)
        score = (avg * len(preds) + confidence_min * total_avg) / (avg * confidence_min)
        if score > 28:
            print(bucket, preds)
        times.append(start_time.timestamp() + bucket * window_size)
        avgs.append(score)

    # Convert to datetime
    times = [datetime.fromtimestamp(t) for t in times]
    return times, avgs

# Plot each window size with a different color
colors = ["blue", "orange", "green"]
plt.figure(figsize=(9,5))

for win, color in zip(window_sizes, colors):
    times, avgs = compute_bucket_avgs(data, win)
    plt.plot(times, avgs, marker="o", linestyle="-", color=color, label=f"{win}s window")

plt.title("Score with 45s Sliding Window")
plt.xlabel("Time")
plt.ylabel("Score")
plt.grid(True)
plt.legend()
plt.show()

# mins.sort()
# mins = mins[::-1]
# print(mins[:20])