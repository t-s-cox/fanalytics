
import json

json_file = "projections.json"

with open(json_file, "r", encoding="utf-8") as f:
    data = json.load(f)

player_name = "Garrett Nussmeier"
player_id = None

for info in data['included']:
    if info['type'] == 'new_player':
        if info['attributes']['display_name'] == player_name:
            player_id = info['id']
            # print("hi")

for projection in data['data']:
    if projection['relationships']['new_player']['data']['id'] == player_id:
        print(projection['attributes']['stat_display_name'], projection['attributes']['line_score'], projection['attributes']['updated_at'])
