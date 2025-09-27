import json
import matplotlib.pyplot as plt
from datetime import datetime

# Load JSON data
with open("gtvwakeANNOTATED.json", "r") as f:
    data = json.load(f)

# Convert timestamps to datetime
for d in data:
    d["time"] = datetime.fromtimestamp(d["timestamp"])

# Sort data by time just in case
data.sort(key=lambda x: x["time"])

# Define different window sizes in seconds
window_sizes = [45]

# Function to bucket predictions
def compute_bucket_avgs(data, window_size):
    start_time = min(d["time"] for d in data)
    buckets = {}
    for d in data:
        delta = (d["time"] - start_time).total_seconds()
        bucket = int(delta // window_size)
        if bucket not in buckets:
            buckets[bucket] = []
        buckets[bucket].append(d["prediction"])

    times, avgs = [], []
    for bucket, preds in sorted(buckets.items()):
        avg = sum(preds) / len(preds)
        times.append(start_time.timestamp() + bucket * window_size)
        avgs.append(avg)

    # Convert to datetime
    times = [datetime.fromtimestamp(t) for t in times]
    return times, avgs

# Plot each window size with a different color
colors = ["blue", "orange", "green"]
plt.figure(figsize=(9,5))

for win, color in zip(window_sizes, colors):
    times, avgs = compute_bucket_avgs(data, win)
    plt.plot(times, avgs, marker="o", linestyle="-", color=color, label=f"{win}s window")

plt.title("Average Prediction with 45s Sliding Window")
plt.xlabel("Time")
plt.ylabel("Average Prediction")
plt.grid(True)
plt.legend()
plt.show()
