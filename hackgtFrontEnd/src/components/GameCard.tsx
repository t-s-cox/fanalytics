import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Game, BettingOdds, SentimentData, BetRecommendation } from '../types';
import { useTheme } from '../context/ThemeContext';

interface Props {
  game: Game;
  odds?: BettingOdds;
  sentiment?: SentimentData;
  recommendation?: BetRecommendation;
  onPress: () => void;
}

const GameCard: React.FC<Props> = ({ game, odds, sentiment, recommendation, onPress }) => {
  const { theme } = useTheme();
  const formatTime = (time: string) => {
    const date = new Date(time);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const getStatusColor = () => {
    switch (game.status) {
      case 'live': return '#4caf50';
      case 'completed': return '#757575';
      default: return '#2196f3';
    }
  };

  const getRecommendationColor = () => {
    if (!recommendation || recommendation.recommendation === 'no-bet') return '#757575';
    return recommendation.recommendation === 'over' ? '#4caf50' : '#f44336';
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return '#4caf50';
    if (confidence >= 65) return '#ff9800';
    return '#f44336';
  };

  return (
    <TouchableOpacity style={[styles.container, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]} onPress={onPress}>
      <View style={styles.header}>
        <View style={styles.matchup}>
          <Text style={[styles.team, { color: theme.colors.text }]}>{game.awayTeam}</Text>
          <Text style={[styles.vs, { color: theme.colors.textSecondary }]}>@</Text>
          <Text style={[styles.team, { color: theme.colors.text }]}>{game.homeTeam}</Text>
        </View>
        <View style={[styles.status, { backgroundColor: getStatusColor() }]}>
          <Text style={styles.statusText}>{game.status.toUpperCase()}</Text>
        </View>
      </View>
      
      {game.status === 'live' && game.homeScore !== undefined && game.awayScore !== undefined && (
        <View style={styles.score}>
          <Text style={[styles.scoreText, { color: theme.colors.text }]}>{game.awayScore} - {game.homeScore}</Text>
        </View>
      )}

      <View style={styles.details}>
        <Text style={[styles.time, { color: theme.colors.textSecondary }]}>{formatTime(game.gameTime)}</Text>
        {odds && (
          <Text style={[styles.odds, { color: theme.colors.textSecondary }]}>O/U: {odds.overUnder}</Text>
        )}
      </View>

      {sentiment && (
        <View style={styles.sentiment}>
          <Text style={[styles.sentimentLabel, { color: theme.colors.text }]}>Fan Sentiment:</Text>
          <View style={styles.sentimentBar}>
            <View 
              style={[
                styles.sentimentSegment, 
                { width: `${sentiment.fanSentiment.bullish}%`, backgroundColor: '#4caf50' }
              ]} 
            />
            <View 
              style={[
                styles.sentimentSegment, 
                { width: `${sentiment.fanSentiment.bearish}%`, backgroundColor: '#f44336' }
              ]} 
            />
            <View 
              style={[
                styles.sentimentSegment, 
                { width: `${sentiment.fanSentiment.neutral}%`, backgroundColor: '#757575' }
              ]} 
            />
          </View>
          <Text style={[styles.sentimentText, { color: theme.colors.textSecondary }]}>
            {sentiment.fanSentiment.bullish}% Bullish • {sentiment.fanSentiment.totalPosts} posts
          </Text>
        </View>
      )}

      {recommendation && recommendation.recommendation !== 'no-bet' && (
        <View style={[styles.recommendation, { backgroundColor: theme.colors.surface }]}>
          <View style={styles.recHeader}>
            <View style={[styles.recBadge, { backgroundColor: getRecommendationColor() }]}>
              <Text style={styles.recBadgeText}>{recommendation.recommendation.toUpperCase()}</Text>
            </View>
            <Text style={[styles.confidence, { color: getConfidenceColor(recommendation.confidence) }]}>
              {recommendation.confidence}% confidence
            </Text>
          </View>
          <Text style={[styles.reasoning, { color: theme.colors.textSecondary }]} numberOfLines={2}>
            {recommendation.reasoning}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  matchup: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  team: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  vs: {
    fontSize: 14,
    marginHorizontal: 10,
    textAlign: 'center',
    minWidth: 20,
  },
  status: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  score: {
    alignItems: 'center',
    marginBottom: 10,
  },
  scoreText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  time: {
    fontSize: 14,
  },
  odds: {
    fontSize: 14,
    fontWeight: '500',
  },
  sentiment: {
    marginBottom: 10,
  },
  sentimentLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 5,
  },
  sentimentBar: {
    height: 6,
    backgroundColor: '#e0e0e0',
    borderRadius: 3,
    flexDirection: 'row',
    overflow: 'hidden',
    marginBottom: 5,
  },
  sentimentSegment: {
    height: '100%',
  },
  sentimentText: {
    fontSize: 12,
  },
  recommendation: {
    padding: 10,
    borderRadius: 8,
  },
  recHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  recBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  recBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  confidence: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  reasoning: {
    fontSize: 12,
    lineHeight: 16,
  },
});

export default GameCard;