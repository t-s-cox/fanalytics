import json
import csv

def json_to_csv(json_file, csv_file):
    # Load JSON data
    with open(json_file, "r", encoding="utf-8") as f:
        data = json.load(f)

    # Ensure it's a list
    if not isinstance(data, list):
        raise ValueError("JSON must be a list of objects (dictionaries).")

    # Collect all field names (union of keys)
    fieldnames = set()
    for item in data:
        fieldnames.update(item.keys())
    fieldnames = list(fieldnames)

    # Write CSV
    with open(csv_file, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        for item in data:
            writer.writerow(item)

# Example usage:
json_to_csv("full.json", "full.csv")