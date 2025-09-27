import json
import csv

input_file = "reddit2.json"  # your JSON file
output_file = "redditcomments.csv"  # CSV output

with open(input_file, "r", encoding="utf-8") as f:
    data = json.load(f)

with open(output_file, "w", newline="", encoding="utf-8") as f:
    writer = csv.DictWriter(f, fieldnames=["text"])
    writer.writeheader()
    
    for item in data:
        text = item.get("body_html", "")
        writer.writerow({"text": text})

print(f"✅ Converted {len(data)} comments to CSV with 'text' column at {output_file}")
