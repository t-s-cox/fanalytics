import json
import math
import matplotlib.pyplot as plt
from datetime import datetime

import numpy as np

export = {}

window_size = 45
confidence_min = 2

mins = []

sorted_times = []
live_time_index = -1
file_name = "fsuvsvirginia"

with open(f"jsons/{file_name}P.json", "r") as f:
    data = json.load(f)

for i in range(len(data)):
    data[i]["time"] = datetime.fromtimestamp(data[i]["timestamp"])
    # data[i]["prediction"] = 1

data.sort(key=lambda x: x["time"])

if live_time_index != -1:
    with open('LIVE_SCORES.json', 'r') as f:
        live_scores = json.load(f)
        for drive in live_scores[live_time_index]['drives']:
            for play in drive['plays']:
                if play['wallClock'] is None:
                    continue
                time = tuple(map(int, play['wallClock'].split('T')[1].split('.')[0].split('+')[0].split(":")))
                if not sorted_times or time > sorted_times[-1][0]:
                    sorted_times.append((time, play['period'], play['clock']))

def print_prompts(data):
    prompts = [(d["text"], d["prediction"]) for d in data]
    prompts.sort(key=lambda x: x[1])
    # print top 5 and bottom 5
    print("Negatives")
    for p in prompts[:2]:
        print(p)
    print("Positives")
    for p in prompts[-2:]:
        print(p)

def get_score(window_data):
    return sum(abs(0.5 - s['prediction']) for s in window_data if abs(s['prediction']-0.5) < 0.3) * math.log(1+len(window_data)) * 2

to_print = set()
texts = set()

def compute_sliding_avgs(data, window_size):

    # print_prompts(data)

    # Sort data by time (already sorted but just to be sure)
    data.sort(key=lambda x: x["time"])
    
    # Store original data in mins for later use
    for d in data:
        mins.append((d["prediction"], d['text']))

    start_time = min(d["time"] for d in data)
    end_time = max(d["time"] for d in data)
    
    times, avgs, counts = [], [], []
    
    # Create sliding windows at regular intervals (every 1 second for very smooth curve)
    step_size = window_size // 4  # Step forward 1 second at a time
    current_time = start_time
    
    num_points_above_40 = 0
    flag = True

    max_score = 0
    while current_time <= end_time:
        max_score = max(max_score, get_score([d for d in data if current_time <= d["time"] <= datetime.fromtimestamp(current_time.timestamp() + window_size)]))
        current_time = datetime.fromtimestamp(current_time.timestamp() + step_size)
    current_time = start_time

    while current_time <= end_time:
        # Find all data points within the sliding window
        window_start = current_time
        window_end = datetime.fromtimestamp(current_time.timestamp() + window_size)
        
        window_data = [d for d in data if window_start <= d["time"] <= window_end]
        
        if len(window_data) > 0:
            
            score = get_score(window_data) / max_score
            
            if live_time_index == -1:
                times.append(current_time)
                avgs.append(score)
                counts.append(len(window_data))
            else:
                # Convert to game time (same logic as before)
                current_seconds = ((current_time.hour+4) * 3600 + current_time.minute * 60 + current_time.second)
                
                # Binary search to find corresponding game time
                lo = 0
                hi = len(sorted_times) - 1
                while lo <= hi:
                    mid = (lo + hi) // 2
                    mid_time = sorted_times[mid][0]
                    mid_seconds = mid_time[0] * 3600 + mid_time[1] * 60 + mid_time[2]
                    
                    if mid_seconds < current_seconds:
                        lo = mid + 1
                    else:
                        hi = mid - 1
                
                if hi != -1 and lo != len(sorted_times)-1 and hi != len(sorted_times)-1:
                    n = int(sorted_times[hi][1])
                    t = int(sorted_times[hi][2].split(":")[0]) + int(sorted_times[hi][2].split(":")[1]) / 60
                    
                    gt = 15*n - t

                    for s in window_data:
                        if s['text'] not in texts:
                            to_print.add((s['text'], s['prediction'], gt))
                            texts.add(s['text'])

                    if score > 0.3:
                        if flag:
                            num_points_above_40 += 1
                            flag = False
                    else:
                        flag = True
                    
                    times.append(gt)
                    avgs.append(score)
                    counts.append(len(window_data))

        # Move to next step
        current_time = datetime.fromtimestamp(current_time.timestamp() + step_size)
    
    print(f"Number of points above 0.4: {num_points_above_40-1}")

    return times, avgs, counts

# Plot each window size with a different color
color = "green"

times, avgs, counts = compute_sliding_avgs(data, window_size)
export['times'] = times
export['avgs'] = avgs
export['worst15'] = [[a[0], a[1], a[2]] for a in sorted(to_print, key=lambda x: (x[1], x[0]))][:15]
export['best5'] = [[a[0], a[1], a[2]] for a in sorted(to_print, key=lambda x: (x[1], x[0]))][-5:]

if not live_time_index == -1:
    with open(f"exports/{file_name}.json", "w") as f:
        json.dump(export, f, indent=2)

fig, ax1 = plt.subplots(figsize=(9,5))

# Plot score on primary y-axis
ax1.plot(times, avgs, linestyle="-", color=color, label=f"{window_size}s window (Score)")
ax1.set_xlabel("Time")
ax1.set_ylabel("Score", color=color)
ax1.tick_params(axis='y', labelcolor=color)
ax1.grid(True)

print("\n".join([a[0] for a in sorted(to_print, key=lambda x: (x[1], x[0]))][:5]))
print("----")
print("\n".join([a[0] for a in sorted(to_print, key=lambda x: (x[1], x[0]))][-5:]))

# # Create secondary y-axis for counts
# ax2 = ax1.twinx()
# ax2.plot(times, counts, marker="s", linestyle="--", color="orange", label=f"Bucket Counts")
# ax2.set_ylabel("Number of Occurrences", color="orange")
# ax2.tick_params(axis='y', labelcolor="orange")

# Add legends
lines1, labels1 = ax1.get_legend_handles_labels()
# lines2, labels2 = ax2.get_legend_handles_labels()
ax1.legend(lines1, labels1, loc='upper left')

plt.title(f"Score and Bucket Counts with {window_size}s Sliding Window")
plt.tight_layout()
plt.show()

# mins.sort()
# mins = mins[::-1]
# print(mins[:20])
