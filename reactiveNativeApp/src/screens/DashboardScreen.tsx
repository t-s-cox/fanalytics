import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Platform,
  Image,
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

interface DashboardProps {
  navigation: any;
}

interface GameData {
  id: string;
  homeTeam: string;
  awayTeam: string;
  score: string;
  sentiment: number; // -100 to 100
  status: 'live' | 'upcoming' | 'completed';
}

interface CommunityPost {
  id: string;
  content: string;
  engagement: number;
  timestamp: string;
  platform: 'Twitter' | 'Reddit' | 'Facebook' | 'Instagram';
  sentiment: number;
}

const mockGames: GameData[] = [
  {
    id: '1',
    homeTeam: 'Alabama',
    awayTeam: 'Georgia',
    score: '21-17',
    sentiment: 78,
    status: 'live',
  },
  {
    id: '2',
    homeTeam: 'Ohio State',
    awayTeam: 'Michigan',
    score: '14-10',
    sentiment: -34,
    status: 'live',
  },
  {
    id: '3',
    homeTeam: 'Texas',
    awayTeam: 'Oklahoma',
    score: 'vs',
    sentiment: 45,
    status: 'upcoming',
  },
];

const mockCommunityPosts: CommunityPost[] = [
  {
    id: '1',
    content: 'ROLL TIDE! What a touchdown pass! Alabama looking unstoppable tonight! 🏈🔥',
    engagement: 23847,
    timestamp: '3m ago',
    platform: 'Twitter',
    sentiment: 89,
  },
  {
    id: '2', 
    content: 'These refs are absolutely blind! Worst call I\'ve seen all season. Michigan got robbed!',
    engagement: 18293,
    timestamp: '7m ago',
    platform: 'Reddit',
    sentiment: -76,
  },
  {
    id: '3',
    content: 'The crowd at Memorial Stadium is ELECTRIC! Best college football atmosphere in the country! 🏟️',
    engagement: 12556,
    timestamp: '12m ago',
    platform: 'Instagram',
    sentiment: 82,
  },
];

const DashboardScreen: React.FC<DashboardProps> = ({ navigation }) => {
  const { theme, isDark, toggleTheme } = useTheme();
  const screenWidth = Dimensions.get('window').width;

  const getSentimentColor = (sentiment: number) => {
    if (sentiment > 30) return theme.success;
    if (sentiment < -30) return theme.error;
    return theme.warning;
  };

  const getSentimentText = (sentiment: number) => {
    if (sentiment > 30) return 'Positive';
    if (sentiment < -30) return 'Negative';
    return 'Neutral';
  };

  const renderHeader = () => (
    <View style={[styles.header, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
      <TouchableOpacity
        style={styles.menuButton}
        onPress={() => navigation.openDrawer()}
      >
        <Image 
          source={require('../../assets/hamburger2.png')}
          style={styles.hamburgerIcon}
        />
      </TouchableOpacity>
      <View style={styles.headerCenter}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>
          College Football Dashboard
        </Text>
        <Text style={[styles.headerSubtitle, { color: theme.textSecondary }]}>
          Live Sentiment Analytics
        </Text>
      </View>
      <TouchableOpacity
        style={styles.themeButton}
        onPress={toggleTheme}
      >
                <Image 
          source={isDark ? require('../../assets/lightMode.png') : require('../../assets/darkMode.png')}
          style={[styles.themeIcon, { tintColor: theme.text }]}
        />
      </TouchableOpacity>
    </View>
  );

  const renderGameCard = (game: GameData) => (
    <TouchableOpacity
      key={game.id}
      style={[styles.gameCard, { backgroundColor: theme.card }]}
      onPress={() => navigation.navigate('GameDetails', { gameId: game.id })}
    >
      <View style={styles.gameHeader}>
        <Text style={[styles.gameTeams, { color: theme.text }]}>
          {game.homeTeam} vs {game.awayTeam}
        </Text>
        <View style={[
          styles.statusBadge,
          { backgroundColor: game.status === 'live' ? theme.error : theme.textSecondary }
        ]}>
          <Text style={styles.statusText}>
            {game.status.toUpperCase()}
          </Text>
        </View>
      </View>

      <Text style={[styles.gameScore, { color: theme.text }]}>
        {game.score}
      </Text>

      <View style={styles.sentimentContainer}>
        <Text style={[styles.sentimentLabel, { color: theme.textSecondary }]}>
          Fan Sentiment
        </Text>
        <View style={styles.sentimentBarContainer}>
          <View style={[styles.sentimentBar, { backgroundColor: theme.border }]}>
            <View style={styles.sentimentCenter} />
            <View
              style={[
                styles.sentimentFill,
                {
                  width: `${Math.abs(game.sentiment)}%`,
                  backgroundColor: game.sentiment > 0 ? theme.success : theme.error,
                  alignSelf: game.sentiment > 0 ? 'flex-end' : 'flex-start',
                }
              ]}
            />
          </View>
          <View style={styles.sentimentLabels}>
            <Text style={[styles.sentimentLabelText, { color: theme.error }]}>Negative</Text>
            <Text style={[styles.sentimentLabelText, { color: theme.textSecondary }]}>Neutral</Text>
            <Text style={[styles.sentimentLabelText, { color: theme.success }]}>Positive</Text>
          </View>
        </View>
        <Text style={[styles.sentimentText, { color: getSentimentColor(game.sentiment) }]}>
          {getSentimentText(game.sentiment)} ({game.sentiment > 0 ? '+' : ''}{game.sentiment}%)
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderCommunityPostCard = (post: CommunityPost) => (
    <TouchableOpacity
      key={post.id}
      style={[styles.communityCard, { backgroundColor: theme.card }]}
      onPress={() => navigation.navigate('Highlights')}
    >
      <View style={styles.postHeader}>
        <View style={styles.postMeta}>
          <Text style={[styles.platform, { color: theme.primary }]}>{post.platform}</Text>
          <View style={[
            styles.sentimentBadge,
            { backgroundColor: post.sentiment > 0 ? theme.success : theme.error }
          ]}>
            <Text style={styles.sentimentBadgeText}>
              {post.sentiment > 0 ? '+' : ''}{post.sentiment}%
            </Text>
          </View>
        </View>
        <Text style={[styles.postTime, { color: theme.textSecondary }]}>
          {post.timestamp}
        </Text>
      </View>
      <Text style={[styles.postContent, { color: theme.text }]}>
        {post.content}
      </Text>
      <Text style={[styles.postEngagement, { color: theme.primary }]}>
        {post.engagement.toLocaleString()} interactions
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {renderHeader()}
      
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Live Games Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Live & Upcoming Games
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.gamesRow}>
              {mockGames.map(renderGameCard)}
            </View>
          </ScrollView>
        </View>

        {/* Popular Community Posts Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Trending Community Posts
            </Text>
            <Text style={[styles.sectionSubtitle, { color: theme.textSecondary }]}>
              Most popular fan reactions and discussions
            </Text>
          </View>
          {mockCommunityPosts.map(renderCommunityPostCard)}
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Analytics Hub
            </Text>
          </View>
          <View style={styles.actionsGrid}>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: theme.card, borderColor: theme.border }]}
              onPress={() => navigation.navigate('SentimentAnalysis')}
            >
              <View style={[styles.actionIconContainer, { backgroundColor: theme.primary + '20' }]}>
                <Text style={[styles.actionIcon, { color: theme.primary }]}>�</Text>
              </View>
              <Text style={[styles.actionText, { color: theme.text }]}>
                Sentiment Analysis
              </Text>
              <Text style={[styles.actionSubtext, { color: theme.textSecondary }]}>
                Fan mood tracking
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: theme.card, borderColor: theme.border }]}
              onPress={() => navigation.navigate('Predictions')}
            >
              <View style={[styles.actionIconContainer, { backgroundColor: theme.accent + '20' }]}>
                <Text style={[styles.actionIcon, { color: theme.accent }]}>⚡</Text>
              </View>
              <Text style={[styles.actionText, { color: theme.text }]}>
                AI Predictions
              </Text>
              <Text style={[styles.actionSubtext, { color: theme.textSecondary }]}>
                Game outcome analysis
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Data placeholder notice */}
        <View style={[styles.noticeCard, { backgroundColor: theme.primary + '10', borderColor: theme.primary + '30' }]}>
          <View style={styles.noticeHeader}>
            <View style={[styles.noticeIcon, { backgroundColor: theme.primary + '20' }]}>
              <Text style={[styles.noticeIconText, { color: theme.primary }]}>i</Text>
            </View>
            <Text style={[styles.noticeTitle, { color: theme.primary }]}>
              Integration Ready
            </Text>
          </View>
          <Text style={[styles.noticeText, { color: theme.textSecondary }]}>
            Real-time sentiment data and live game statistics will be integrated soon. 
            The UI is ready for Python script integration.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingTop: 60,
    borderBottomWidth: 1,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  menuButton: {
    padding: Platform.OS === 'web' ? 12 : 10,
    borderRadius: 8,
    width: Platform.OS === 'web' ? 44 : 40,
    height: Platform.OS === 'web' ? 44 : 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hamburgerIcon: {
    width: Platform.OS === 'web' ? 28 : 24,
    height: Platform.OS === 'web' ? 28 : 24,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  themeButton: {
    padding: Platform.OS === 'web' ? 12 : 10,
    borderRadius: 8,
    width: Platform.OS === 'web' ? 44 : 40,
    height: Platform.OS === 'web' ? 44 : 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  themeIcon: {
    width: Platform.OS === 'web' ? 24 : 18,
    height: Platform.OS === 'web' ? 24 : 18,
  },
  scrollContainer: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  sectionHeader: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 6,
    letterSpacing: -0.5,
  },
  sectionSubtitle: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
  },
  gamesRow: {
    flexDirection: 'row',
    paddingRight: 16,
  },
  gameCard: {
    width: 280,
    padding: 16,
    marginRight: 12,
    borderRadius: 12,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  gameHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  gameTeams: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  gameScore: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  sentimentContainer: {
    marginTop: 8,
  },
  sentimentLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  sentimentBar: {
    height: 6,
    backgroundColor: '#f0f0f0',
    borderRadius: 3,
    marginBottom: 4,
  },
  sentimentFill: {
    height: '100%',
    borderRadius: 3,
  },
  sentimentText: {
    fontSize: 12,
    fontWeight: '500',
  },
  communityCard: {
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  postMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  platform: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  sentimentBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  sentimentBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  postTime: {
    fontSize: 12,
  },
  postContent: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 8,
  },
  postEngagement: {
    fontSize: 12,
    fontWeight: '500',
  },
  actionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  actionButton: {
    flex: 1,
    padding: 24,
    margin: 8,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  actionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  actionIcon: {
    fontSize: 20,
  },
  actionText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 4,
  },
  actionSubtext: {
    fontSize: 12,
    textAlign: 'center',
    fontWeight: '500',
  },
  noticeCard: {
    margin: 16,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
  },
  noticeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  noticeIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  noticeIconText: {
    fontSize: 14,
    fontWeight: '600',
  },
  noticeTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  noticeText: {
    fontSize: 14,
    lineHeight: 22,
  },
});

export default DashboardScreen;