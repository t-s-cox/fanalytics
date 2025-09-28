from asyncio import sleep
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

async def extract_comments(comments_json, link_id, access_token, user_agent, max_more_calls=5):
    """
    - max_more_calls: maximum number of extra children to fetch PER "more" object.
                      (set to 5 to fetch up to 5 extra replies beyond data['replies'])
    - Each batch sent to /api/morechildren will be at most 700 IDs.
    """
    # normalize input shape so we accept either the original reddit response
    # or a synthetic [None, {"data": {"children": things}}] used for recursion
    queue = comments_json[1]["data"]["children"]
    results = []

    for item in queue:

        kind = item.get("kind")
        if kind == "t1":  # a normal comment
            data = item["data"]
            results.append({
                "body_html": parse_html(data.get("body_html", "")),
                "created_utc": data.get("created_utc", None)
            })

            # recurse into replies already present in the payload
            replies = data.get("replies")
            if replies and isinstance(replies, dict):
                results.extend(
                    await extract_comments([None, replies], link_id, access_token, user_agent, max_more_calls)
                )

        elif kind == "more":
            children = item["data"].get("children", [])
            if not children:
                continue

            # LIMIT: only fetch up to max_more_calls extra children for THIS "more" object
            children = children[:max_more_calls]

            # batch those children into groups of up to 700 IDs and call /api/morechildren
            for i in range(0, len(children), 700):
                batch = children[i:i+700]

                # throttle a bit to avoid rate limits
                await sleep(0.5)

                try:
                    resp = fetch_more_comments(link_id, batch, access_token, user_agent)
                except Exception as e:
                    print(f"Warning: fetch_more_comments failed for batch (len={len(batch)}): {e}")
                    continue

                # /api/morechildren returns under resp["json"]["data"]["things"]
                things = resp.get("json", {}).get("data", {}).get("things", [])
                if not things:
                    continue

                # treat the returned 'things' like children and recurse to parse them
                results.extend(
                    await extract_comments([None, {"data": {"children": things}}], link_id, access_token, user_agent, max_more_calls)
                )

    return results



async def main():
    user_agent = 'myApp/0.1 by Evening_Falcon'

    token = get_access_token(reddit_client_id, reddit_client_secret, user_agent)
    post_ids = [
        ('1nre9o8', "fsuvsvirginia"), 
        ('1ns2krh', 'uclavsnorthwestern'), 
        ('1nm0fcx', 'syracusevsclemson'),
        ('1nrxdyq', 'cincinativskansas'),
        ('1nrxdy2', 'louisvillevspittsburgh'),
    ]

    for subreddit, file_name in post_ids:
        raw = fetch_comments(subreddit, token, user_agent)
        all_comments = await extract_comments(raw, subreddit, token, user_agent, max_more_calls=6000)

        with open(f"jsons/{file_name}.json", "w", encoding="utf-8") as f:
            json.dump(all_comments, f, ensure_ascii=False, indent=2)

        print(f"✅ Saved {len(all_comments)} comments to {file_name}.json")

if __name__ == "__main__":
    import asyncio
    asyncio.run(main())