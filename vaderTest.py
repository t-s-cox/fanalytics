from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer

analyzer = SentimentIntensityAnalyzer()
test = "holy fucking shit the chiefs are so ass. why did taylor swift agree to marry this bum ass travis kelce? his old slow fat ass can’t do shit!"
scores = analyzer.polarity_scores(test)

print(f"\nTest Sentence: {test}\n")
print(f"Sentiment Scores: {scores}")
print(f"Negative Sentiment: {scores['neg']*100:0.3}%")
print(f"Positive Sentiment: {scores['pos']*100:0.3}%\n")

overall = scores['pos'] / (scores['pos'] + scores['neg'])

print(f"Overall Score: {overall*100:0.3}%")

if overall >=0.2:
    print("Overall Sentiment: Positive")
elif overall <= 0.2:
    print("Overall Sentiment: Negative")
else:
    print("Overall Sentiment: Neutral")