import requests
import json
from secrets import reddit_client_id, reddit_client_secret
from requests.auth import HTTPBasicAuth

def parse_html(html):
    return html.replace('&lt;', '<').replace('&gt;', '>').replace('&amp;', '&').replace('&#39;', "'").replace('&quot;', '"')\
        .replace('<bold>', '**').replace('</bold>', '**')\
        .replace('<div class=\"md\">', '').replace('</div>', '')\
        .replace('<p>', '').replace('</p>', '').replace("\n", " ").strip()

def get_access_token(client_id, client_secret, user_agent):
    auth = HTTPBasicAuth(client_id, client_secret)
    data = {'grant_type': 'client_credentials'}
    headers = {'User-Agent': user_agent}
    resp = requests.post('https://www.reddit.com/api/v1/access_token',
                         auth=auth, data=data, headers=headers)
    resp.raise_for_status()
    return resp.json()['access_token']

def fetch_comments(post_id, access_token, user_agent):
    headers = {
        'Authorization': f'bearer {access_token}',
        'User-Agent': user_agent
    }
    url = f'https://oauth.reddit.com/comments/{post_id}'
    resp = requests.get(url, headers=headers)
    resp.raise_for_status()
    return resp.json()

def fetch_more_comments(link_id, children_ids, access_token, user_agent):
    headers = {
        "Authorization": f"bearer {access_token}",
        "User-Agent": user_agent
    }
    url = "https://oauth.reddit.com/api/morechildren"
    params = {
        "link_id": f"t3_{link_id}",
        "children": ",".join(children_ids),
        "api_type": "json",
        "depth": 1
    }
    resp = requests.get(url, headers=headers, params=params)
    resp.raise_for_status()
    return resp.json()

def extract_comments(comments_json, link_id, access_token, user_agent, max_more_calls=1):
    queue = comments_json[1]["data"]["children"]
    results = []
    more_calls = 0

    while queue:
        item = queue.pop(0)

        if item["kind"] == "t1":  # comment
            data = item["data"]
            results.append({
                "body_html": parse_html(data.get("body_html", "")),
                "created_utc": data.get("created_utc", None)
            })
            # add replies if present
            # if data.get("replies") and isinstance(data["replies"], dict):
            #     queue.extend(data["replies"]["data"]["children"])

        elif item["kind"] == "more" and more_calls < max_more_calls:
            children = item["data"].get("children", [])
            children = children[:max_more_calls]
            if children:
                more_calls += 1
                more_data = fetch_more_comments(link_id, children, access_token, user_agent)
                new_items = more_data["json"]["data"]["things"]
                queue.extend(new_items)

    return results

if __name__ == '__main__':
    user_agent = 'myApp/0.1 by Evening_Falcon'

    token = get_access_token(reddit_client_id, reddit_client_secret, user_agent)
    post_ids = ['1nm0fcx', '1ncjuls', '1nmu7lj', '1nre9o8', '1nripmj', '1nrgwd9', '1gnn13c', '1nm0fga']

    all_comments = []

    for post_id in post_ids:
        raw = fetch_comments(post_id, token, user_agent)
        all_comments.extend(extract_comments(raw, post_id, token, user_agent, max_more_calls=200))

    with open("full.json", "w", encoding="utf-8") as f:
        json.dump(all_comments, f, ensure_ascii=False, indent=2)

    print(f"✅ Saved {len(all_comments)} comments to full.json")