import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, Dimensions, Platform } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';
import { Game, BettingOdds, SentimentData, BetRecommendation } from '../types';
import GameCard from '../components/GameCard';
import StatsCard from '../components/StatsCard';
import Header from '../components/Header';
import SocialHighlights from '../components/SocialHighlights';
import { mockGames, mockOdds, mockSentiment, mockRecommendations, mockSocialPosts } from '../data/mockData';
import { useTheme } from '../context/ThemeContext';

type DashboardScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Dashboard'>;

interface Props {
  navigation: DashboardScreenNavigationProp;
}

const DashboardScreen = ({ navigation }: Props) => {
  const { theme } = useTheme();
  const [games, setGames] = useState<Game[]>([]);
  const [odds, setOdds] = useState<BettingOdds[]>([]);
  const [sentiment, setSentiment] = useState<SentimentData[]>([]);
  const [recommendations, setRecommendations] = useState<BetRecommendation[]>([]);
  const [socialPosts, setSocialPosts] = useState<typeof mockSocialPosts>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedWeek, setSelectedWeek] = useState(4);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    // In real implementation, these would be API calls
    setGames(mockGames);
    setOdds(mockOdds);
    setSentiment(mockSentiment);
    setRecommendations(mockRecommendations);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const getStrongRecommendations = () => {
    return recommendations.filter(rec => rec.confidence > 75 && rec.recommendation !== 'no-bet');
  };

  const getAverageConfidence = () => {
    const validRecs = recommendations.filter(rec => rec.recommendation !== 'no-bet');
    if (validRecs.length === 0) return 0;
    return validRecs.reduce((sum, rec) => sum + rec.confidence, 0) / validRecs.length;
  };

  const ScrollContainer = Platform.OS === 'web' ? View : ScrollView;
  const scrollProps = Platform.OS === 'web' ? {} : {
    refreshControl: <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />,
    showsVerticalScrollIndicator: false,
    contentContainerStyle: styles.contentContainer
  };

  return (
    <ScrollContainer 
      style={Platform.OS === 'web' ? 
        [styles.webContainer, { backgroundColor: theme.colors.background }] : 
        [styles.container, { backgroundColor: theme.colors.background }]}
      {...scrollProps}
    >
      <Header 
        title="College Football Dashboard" 
        subtitle={`Live Analysis • Week ${selectedWeek} • ${games.length} Games Today`}
        currentScreen="Dashboard"
      />

      {/* Quick Stats Row */}
      <View style={[styles.quickStatsRow, { backgroundColor: theme.colors.surface }]}>
        <View style={styles.statCard}>
          <Text style={[styles.statNumber, { color: '#4caf50' }]}>{getStrongRecommendations().length}</Text>
          <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Strong Bets</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={[styles.statNumber, { color: '#2196f3' }]}>{getAverageConfidence().toFixed(0)}%</Text>
          <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Avg Confidence</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={[styles.statNumber, { color: '#ff9800' }]}>{games.length}</Text>
          <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Games Today</Text>
        </View>
      </View>

      {/* Top Games Row */}
      <View style={[styles.sectionContainer, { backgroundColor: theme.colors.surface }]}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>🔥 Featured Games</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalGames}
        >
          {games.slice(0, 3).map((game) => {
            const gameOdds = odds.find(o => o.gameId === game.id);
            const gameSentiment = sentiment.find(s => s.gameId === game.id);
            const gameRec = recommendations.find(r => r.gameId === game.id);
            
            return (
              <View key={game.id} style={styles.featuredGameCard}>
                <GameCard
                  game={game}
                  odds={gameOdds}
                  sentiment={gameSentiment}
                  recommendation={gameRec}
                  onPress={() => navigation.navigate('GameDetail', { game })}
                />
              </View>
            );
          })}
        </ScrollView>
      </View>

      {/* Social Media Highlights */}
      <SocialHighlights 
        posts={socialPosts} 
        onPostPress={(post: any) => {
          // Navigate to game detail for the post's game
          const game = games.find(g => g.id === post.gameId);
          if (game) {
            navigation.navigate('GameDetail', { game });
          }
        }}
      />

      {/* All Games Grid */}
      <View style={[styles.sectionContainer, { backgroundColor: theme.colors.surface }]}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>📅 All Games Today</Text>
        {games.slice(3).map((game) => {
          const gameOdds = odds.find(o => o.gameId === game.id);
          const gameSentiment = sentiment.find(s => s.gameId === game.id);
          const gameRec = recommendations.find(r => r.gameId === game.id);
          
          return (
            <GameCard
              key={game.id}
              game={game}
              odds={gameOdds}
              sentiment={gameSentiment}
              recommendation={gameRec}
              onPress={() => navigation.navigate('GameDetail', { game })}
            />
          );
        })}
      </View>
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

  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 15,
  },
  sectionContainer: {
    margin: 10,
    marginTop: 0,
    borderRadius: 10,
    padding: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  quickStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: 10,
    marginBottom: 10,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statCard: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    textAlign: 'center',
    fontWeight: '600',
  },
  horizontalGames: {
    paddingRight: 10,
  },
  featuredGameCard: {
    width: 300,
    marginRight: 15,
  },
});

export default DashboardScreen;