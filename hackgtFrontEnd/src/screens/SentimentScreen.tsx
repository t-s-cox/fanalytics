import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, Platform } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../App';
import { SentimentData } from '../types';
import { mockSentiment, mockSentimentChartData } from '../data/mockData';
import { useTheme } from '../context/ThemeContext';
import Header from '../components/Header';
import SentimentChart from '../components/SentimentChart';

type SentimentScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Sentiment'>;
type SentimentScreenRouteProp = RouteProp<RootStackParamList, 'Sentiment'>;

interface Props {
  navigation: SentimentScreenNavigationProp;
  route: SentimentScreenRouteProp;
}

interface SentimentPost {
  id: string;
  platform: 'twitter' | 'reddit' | 'facebook';
  content: string;
  sentiment: 'bullish' | 'bearish' | 'neutral';
  timestamp: string;
  engagement: number;
}

const mockPosts: SentimentPost[] = [
  {
    id: '1',
    platform: 'twitter',
    content: 'Both offenses looking explosive in practice! This game is going OVER 🚀 #CFB',
    sentiment: 'bullish',
    timestamp: '2025-09-27T14:30:00Z',
    engagement: 47
  },
  {
    id: '2',
    platform: 'reddit',
    content: 'Weather forecast shows heavy rain. Expecting a low-scoring defensive battle.',
    sentiment: 'bearish',
    timestamp: '2025-09-27T14:25:00Z',
    engagement: 23
  },
  {
    id: '3',
    platform: 'twitter',
    content: 'Key injuries on both offensive lines. Could limit scoring opportunities.',
    sentiment: 'bearish',
    timestamp: '2025-09-27T14:20:00Z',
    engagement: 31
  },
  {
    id: '4',
    platform: 'facebook',
    content: 'Historic matchup! Both teams averaging 35+ points. Take the OVER!',
    sentiment: 'bullish',
    timestamp: '2025-09-27T14:15:00Z',
    engagement: 89
  },
  {
    id: '5',
    platform: 'reddit',
    content: 'Defense wins championships. Both teams have elite defenses this year.',
    sentiment: 'bearish',
    timestamp: '2025-09-27T14:10:00Z',
    engagement: 156
  }
];

const SentimentScreen = ({ navigation, route }: Props) => {
  const { theme } = useTheme();
  const { gameId } = route.params;
  const [sentiment, setSentiment] = useState<SentimentData | undefined>();
  const [posts] = useState<SentimentPost[]>(mockPosts);

  useEffect(() => {
    setSentiment(mockSentiment.find(s => s.gameId === gameId));
  }, [gameId]);

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'twitter': return '#1da1f2';
      case 'reddit': return '#ff4500';
      case 'facebook': return '#4267b2';
      default: return '#666';
    }
  };

  const getSentimentColor = (sentimentType: string) => {
    switch (sentimentType) {
      case 'bullish': return '#4caf50';
      case 'bearish': return '#f44336';
      default: return '#757575';
    }
  };

  const getSentimentEmoji = (sentimentType: string) => {
    switch (sentimentType) {
      case 'bullish': return '📈';
      case 'bearish': return '📉';
      default: return '➖';
    }
  };

  if (!sentiment) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Header 
          title="Fan Sentiment Analysis"
          subtitle="Loading..."
          currentScreen="Fan Sentiment"
        />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: theme.colors.text, fontSize: 16 }}>Loading sentiment data...</Text>
        </View>
      </View>
    );
  }

  const ScrollContainer = Platform.OS === 'web' ? View : ScrollView;
  const scrollProps = Platform.OS === 'web' ? {} : {
    showsVerticalScrollIndicator: false,
    contentContainerStyle: styles.contentContainer
  };

  return (
    <View style={[{ flex: 1 }, { backgroundColor: theme.colors.background }]}>
      <Header 
        title="Fan Sentiment Analysis"
        subtitle={`${sentiment.fanSentiment.totalPosts.toLocaleString()} posts analyzed`}
        currentScreen="Fan Sentiment"
      />
      <ScrollContainer 
        style={Platform.OS === 'web' ? [styles.webContainer, { backgroundColor: theme.colors.background }] : [styles.container, { backgroundColor: theme.colors.background }]}
        {...scrollProps}
      >

      {/* Sentiment Over Time Chart */}
      <SentimentChart 
        data={mockSentimentChartData}
        title="Sentiment Trend Throughout Game Day"
      />

      <View style={[styles.section, { backgroundColor: theme.colors.surface }]}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Sentiment Breakdown</Text>
        <View style={styles.sentimentChart}>
          <View style={styles.chartRow}>
            <View style={[styles.chartBar, { width: `${sentiment.fanSentiment.bullish}%`, backgroundColor: '#4caf50' }]} />
            <Text style={[styles.chartLabel, { color: theme.colors.text }]}>{sentiment.fanSentiment.bullish}% Bullish (Over)</Text>
          </View>
          <View style={styles.chartRow}>
            <View style={[styles.chartBar, { width: `${sentiment.fanSentiment.bearish}%`, backgroundColor: '#f44336' }]} />
            <Text style={[styles.chartLabel, { color: theme.colors.text }]}>{sentiment.fanSentiment.bearish}% Bearish (Under)</Text>
          </View>
          <View style={styles.chartRow}>
            <View style={[styles.chartBar, { width: `${sentiment.fanSentiment.neutral}%`, backgroundColor: '#757575' }]} />
            <Text style={[styles.chartLabel, { color: theme.colors.text }]}>{sentiment.fanSentiment.neutral}% Neutral</Text>
          </View>
        </View>
      </View>

      {sentiment.espnSentiment && (
        <View style={[styles.section, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>ESPN Commentary Sentiment</Text>
          <View style={styles.espnContainer}>
            <View style={styles.espnRow}>
              <Text style={[styles.espnLabel, { color: theme.colors.text }]}>Overall Tone:</Text>
              <Text style={[styles.espnValue, { color: getSentimentColor(sentiment.espnSentiment.tone) }]}>
                {sentiment.espnSentiment.tone.toUpperCase()}
              </Text>
            </View>
            <View style={styles.espnRow}>
              <Text style={[styles.espnLabel, { color: theme.colors.text }]}>Over/Under Lean:</Text>
              <Text style={[styles.espnValue, { 
                color: sentiment.espnSentiment.overUnderLean === 'over' ? '#4caf50' : '#f44336' 
              }]}>
                {sentiment.espnSentiment.overUnderLean.toUpperCase()}
              </Text>
            </View>
            <View style={styles.espnRow}>
              <Text style={[styles.espnLabel, { color: theme.colors.text }]}>Confidence:</Text>
              <Text style={[styles.espnValue, { color: theme.colors.text }]}>{sentiment.espnSentiment.confidence}%</Text>
            </View>
          </View>
        </View>
      )}

      <View style={[styles.section, { backgroundColor: theme.colors.surface }]}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Recent Fan Posts</Text>
        {posts.map((post) => (
          <View key={post.id} style={[styles.postCard, { backgroundColor: theme.colors.background, borderColor: theme.colors.border }]}>
            <View style={styles.postHeader}>
              <View style={styles.postMeta}>
                <View style={[styles.platformBadge, { backgroundColor: getPlatformColor(post.platform) }]}>
                  <Text style={styles.platformText}>{post.platform}</Text>
                </View>
                <Text style={[styles.postTime, { color: theme.colors.textSecondary }]}>{formatTime(post.timestamp)}</Text>
              </View>
              <View style={styles.sentimentBadge}>
                <Text style={styles.sentimentEmoji}>{getSentimentEmoji(post.sentiment)}</Text>
                <Text style={[styles.sentimentText, { color: getSentimentColor(post.sentiment) }]}>
                  {post.sentiment}
                </Text>
              </View>
            </View>
            <Text style={[styles.postContent, { color: theme.colors.text }]}>{post.content}</Text>
            <View style={styles.postFooter}>
              <Text style={[styles.engagement, { color: theme.colors.textSecondary }]}>❤️ {post.engagement} engagements</Text>
            </View>
          </View>
        ))}
      </View>

      <View style={[styles.section, { backgroundColor: theme.colors.surface }]}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Methodology</Text>
        <Text style={[styles.methodText, { color: theme.colors.textSecondary }]}>
          • Social media posts are collected from Twitter, Reddit, and Facebook{'\n'}
          • Natural language processing analyzes sentiment toward over/under bets{'\n'}
          • Posts are weighted by engagement and recency{'\n'}
          • ESPN commentary is analyzed for tone and betting implications{'\n'}
          • Data is updated every 15 minutes leading up to game time
        </Text>
      </View>
      </ScrollContainer>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  webContainer: {
    height: Dimensions.get('window').height,
    backgroundColor: '#f5f5f5',
    overflow: 'scroll' as any,
  },
  contentContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  header: {
    backgroundColor: '#1a237e',
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#c5cae9',
  },
  section: {
    margin: 10,
    borderRadius: 10,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  sentimentChart: {
    gap: 15,
  },
  chartRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  chartBar: {
    height: 20,
    borderRadius: 10,
    minWidth: 20,
  },
  chartLabel: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  espnContainer: {
    gap: 10,
  },
  espnRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  espnLabel: {
    fontSize: 16,
    color: '#666',
  },
  espnValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  postCard: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  postMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  platformBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  platformText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  postTime: {
    fontSize: 12,
    color: '#666',
  },
  sentimentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  sentimentEmoji: {
    fontSize: 16,
  },
  sentimentText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  postContent: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
    marginBottom: 10,
  },
  postFooter: {
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingTop: 8,
  },
  engagement: {
    fontSize: 12,
    color: '#666',
  },
  methodText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
  },
});

export default SentimentScreen;