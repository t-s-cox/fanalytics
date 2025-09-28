import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Platform } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../App';
import { BettingOdds, SentimentData, BetRecommendation } from '../types';
import { mockOdds, mockSentiment, mockRecommendations, mockOddsChartData } from '../data/mockData';
import { useTheme } from '../context/ThemeContext';
import Header from '../components/Header';
import OddsChart from '../components/OddsChart';

type GameDetailScreenNavigationProp = StackNavigationProp<RootStackParamList, 'GameDetail'>;
type GameDetailScreenRouteProp = RouteProp<RootStackParamList, 'GameDetail'>;

interface Props {
  navigation: GameDetailScreenNavigationProp;
  route: GameDetailScreenRouteProp;
}

const GameDetailScreen = ({ navigation, route }: Props) => {
  const { theme } = useTheme();
  const { game } = route.params;
  const [odds, setOdds] = useState<BettingOdds | undefined>();
  const [sentiment, setSentiment] = useState<SentimentData | undefined>();
  const [recommendation, setRecommendation] = useState<BetRecommendation | undefined>();

  useEffect(() => {
    // Load data for this specific game
    setOdds(mockOdds.find(o => o.gameId === game.id));
    setSentiment(mockSentiment.find(s => s.gameId === game.id));
    setRecommendation(mockRecommendations.find(r => r.gameId === game.id));
  }, [game.id]);

  const formatTime = (time: string) => {
    const date = new Date(time);
    return date.toLocaleString('en-US', { 
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const ScrollContainer = Platform.OS === 'web' ? View : ScrollView;
  const scrollProps = Platform.OS === 'web' ? {} : {
    showsVerticalScrollIndicator: false,
    contentContainerStyle: styles.contentContainer
  };

  return (
    <ScrollContainer 
      style={Platform.OS === 'web' ? [styles.webContainer, { backgroundColor: theme.colors.background }] : [styles.container, { backgroundColor: theme.colors.background }]}
      {...scrollProps}
    >
      <Header 
        title={`${game.awayTeam} @ ${game.homeTeam}`}
        subtitle={`${formatTime(game.gameTime)} • Week ${game.week} • ${game.season}`}
        currentScreen="Game Analysis"
      />

      {/* Odds Movement Chart */}
      <OddsChart 
        data={mockOddsChartData}
        title="Over/Under Line Movement"
        currentLine={odds?.overUnder}
      />

      {odds && (
        <View style={[styles.section, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Betting Odds</Text>
          <View style={styles.oddsContainer}>
            <View style={styles.oddsItem}>
              <Text style={[styles.oddsLabel, { color: theme.colors.textSecondary }]}>Over/Under</Text>
              <Text style={[styles.oddsValue, { color: theme.colors.text }]}>{odds.overUnder}</Text>
            </View>
            <View style={styles.oddsItem}>
              <Text style={[styles.oddsLabel, { color: theme.colors.textSecondary }]}>Over</Text>
              <Text style={[styles.oddsValue, { color: theme.colors.text }]}>{odds.overOdds > 0 ? '+' : ''}{odds.overOdds}</Text>
            </View>
            <View style={styles.oddsItem}>
              <Text style={[styles.oddsLabel, { color: theme.colors.textSecondary }]}>Under</Text>
              <Text style={[styles.oddsValue, { color: theme.colors.text }]}>{odds.underOdds > 0 ? '+' : ''}{odds.underOdds}</Text>
            </View>
          </View>
          <Text style={[styles.sportsbook, { color: theme.colors.textTertiary }]}>Source: {odds.sportsbook}</Text>
        </View>
      )}

      {recommendation && (
        <View style={[styles.section, styles.recommendationSection, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>AI Recommendation</Text>
          <View style={[styles.recContainer, { backgroundColor: theme.colors.surface }]}>
            <View style={styles.recHeader}>
              <Text style={[styles.recBet, 
                { color: recommendation.recommendation === 'over' ? '#4caf50' : '#f44336' }
              ]}>
                BET {recommendation.recommendation.toUpperCase()}
              </Text>
              <Text style={[styles.recConfidence, { color: theme.colors.textSecondary }]}>{recommendation.confidence}% Confidence</Text>
            </View>
            <Text style={[styles.recReasoning, { color: theme.colors.text }]}>{recommendation.reasoning}</Text>
            <View style={styles.recMetrics}>
              <Text style={[styles.recMetric, { color: theme.colors.textSecondary }]}>Expected Value: {(recommendation.expectedValue * 100).toFixed(1)}%</Text>
              <Text style={[styles.recMetric, { color: theme.colors.textSecondary }]}>
                Fan Sentiment Weight: {(recommendation.fanSentimentWeight * 100).toFixed(0)}%
              </Text>
              <Text style={[styles.recMetric, { color: theme.colors.textSecondary }]}>
                Odds Weight: {(recommendation.oddsWeight * 100).toFixed(0)}%
              </Text>
            </View>
          </View>
        </View>
      )}

      {sentiment && (
        <View style={[styles.section, { backgroundColor: theme.colors.surface }]}>
          <View style={styles.sentimentHeader}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Fan Sentiment Analysis</Text>
            <TouchableOpacity 
              style={styles.detailButton}
              onPress={() => navigation.navigate('Sentiment', { gameId: game.id })}
            >
              <Text style={[styles.detailButtonText, { color: theme.colors.primary }]}>View Details</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.sentimentGrid}>
            <View style={styles.sentimentCard}>
              <Text style={styles.sentimentPercent}>{sentiment.fanSentiment.bullish}%</Text>
              <Text style={styles.sentimentLabel}>Bullish (Over)</Text>
            </View>
            <View style={styles.sentimentCard}>
              <Text style={styles.sentimentPercent}>{sentiment.fanSentiment.bearish}%</Text>
              <Text style={styles.sentimentLabel}>Bearish (Under)</Text>
            </View>
            <View style={styles.sentimentCard}>
              <Text style={styles.sentimentPercent}>{sentiment.fanSentiment.neutral}%</Text>
              <Text style={styles.sentimentLabel}>Neutral</Text>
            </View>
          </View>
          
          <Text style={styles.postCount}>
            Based on {sentiment.fanSentiment.totalPosts.toLocaleString()} social media posts
          </Text>

          {sentiment.espnSentiment && (
            <View style={[styles.espnSection, { backgroundColor: theme.colors.surface }]}>
              <Text style={styles.espnTitle}>ESPN Commentary Analysis</Text>
              <Text style={styles.espnTone}>
                Tone: <Text style={{ fontWeight: 'bold' }}>{sentiment.espnSentiment.tone}</Text>
              </Text>
              <Text style={styles.espnLean}>
                Lean: <Text style={{ fontWeight: 'bold' }}>{sentiment.espnSentiment.overUnderLean}</Text>
              </Text>
              <Text style={styles.espnConfidence}>
                Confidence: {sentiment.espnSentiment.confidence}%
              </Text>
            </View>
          )}
        </View>
      )}
    </ScrollContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webContainer: {
    height: Dimensions.get('window').height,
    overflow: 'scroll' as any,
  },
  contentContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },

  section: {
    margin: 10,
    borderRadius: 10,
    padding: 20,
  },
  recommendationSection: {
    borderLeftWidth: 4,
    borderLeftColor: '#4caf50',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  oddsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  oddsItem: {
    alignItems: 'center',
  },
  oddsLabel: {
    fontSize: 14,
    marginBottom: 5,
  },
  oddsValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  sportsbook: {
    textAlign: 'center',
    fontSize: 12,
    color: '#999',
  },
  recContainer: {
    padding: 15,
    borderRadius: 8,
  },
  recHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  recBet: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  recConfidence: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  recReasoning: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 10,
  },
  recMetrics: {
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingTop: 10,
  },
  recMetric: {
    fontSize: 12,
    color: '#666',
    marginBottom: 3,
  },
  sentimentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  detailButton: {
    backgroundColor: '#2196f3',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  detailButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  sentimentGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15,
  },
  sentimentCard: {
    alignItems: 'center',
    flex: 1,
  },
  sentimentPercent: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  sentimentLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  postCount: {
    textAlign: 'center',
    fontSize: 12,
    color: '#999',
    marginBottom: 15,
  },
  espnSection: {
    padding: 15,
    borderRadius: 8,
  },
  espnTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  espnTone: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  espnLean: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  espnConfidence: {
    fontSize: 14,
    color: '#666',
  },
});

export default GameDetailScreen;