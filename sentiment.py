from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
import json

input_file = "reddit2.json"
output_file = "redditSentiments.json"

analyzer = SentimentIntensityAnalyzer()
test = "holy fucking shit the chiefs are so ass. why did taylor swift agree to marry this bum ass travis kelce? his old slow fat ass can’t do shit!"

def get_sentiments(text):
    scores = analyzer.polarity_scores(text)
    denom = scores['pos'] + scores['neg']

    ret = {"positive": scores['pos'], "negative": scores['neg'], "neutral": scores['neu'], "ratio": 0}

    if abs(denom) < 0.0001:
        return ret

    ret["ratio"] = scores['pos'] / denom
    return ret


if __name__ == "__main__":
    with open(input_file, "r", encoding="utf-8") as f:
        comments = json.load(f)

    for comment in comments:
        text = comment.get("body_html", "")
        sentiment = get_sentiments(text)
        comment["sentiment"] = sentiment

    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(comments, f, ensure_ascii=False, indent=2)

    print(f"✅ Sentiment analysis done. Saved to {output_file}")