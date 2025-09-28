import React, { useState } from 'react';
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
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { useTheme } from '../contexts/ThemeContext';

interface GameDetailsProps {
  navigation: any;
  route: any;
}

interface BetData {
  type: string;
  line: number;
  over: string;
  under: string;
}

interface SentimentQuote {
  id: string;
  text: string;
  sentiment: number;
  timestamp: string;
  quarter: string;
}

const GameDetailsScreen: React.FC<GameDetailsProps> = ({ navigation, route }) => {
  const { theme, isDark, toggleTheme } = useTheme();
  const drawerNavigation = useNavigation();
  const [selectedTab, setSelectedTab] = useState('overview');

  // Mock data for game details
  const gameData = {
    homeTeam: 'Alabama',
    awayTeam: 'Georgia',
    homeScore: 21,
    awayScore: 17,
    quarter: '4th',
    timeRemaining: '8:42',
    currentSentiment: 78,
  };

  const bettingData: BetData[] = [
    { type: 'Total Points', line: 215.5, over: '-110', under: '-110' },
    { type: 'Spread', line: -3.5, over: '-105', under: '-115' },
    { type: 'Moneyline', line: 0, over: '+145', under: '-165' },
  ];

  const sentimentQuotes: SentimentQuote[] = [
    {
      id: '1',
      text: 'LEBRON IS ABSOLUTELY COOKING! This is the best game of the season! 🔥🔥🔥',
      sentiment: 95,
      timestamp: '8:32 PM',
      quarter: '4th',
    },
    {
      id: '2',
      text: 'This refereeing is absolutely terrible. Worst calls I\'ve seen all year.',
      sentiment: -87,
      timestamp: '8:28 PM', 
      quarter: '4th',
    },
    {
      id: '3',
      text: 'Warriors are falling apart in the clutch. No defense at all.',
      sentiment: -65,
      timestamp: '8:25 PM',
      quarter: '4th',
    },
  ];

  const renderHeader = () => (
    <View style={[styles.header, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
      <TouchableOpacity
        style={styles.menuButton}
        onPress={() => drawerNavigation.dispatch(DrawerActions.openDrawer())}
      >
        <Image 
          source={require('../../assets/hamburger2.png')}
          style={styles.hamburgerIcon}
        />
      </TouchableOpacity>
      <View style={styles.headerCenter}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>
          Game Details
        </Text>
        <Text style={[styles.headerSubtitle, { color: theme.textSecondary }]}>
          Live Game Analysis
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

  const renderGameScore = () => (
    <View style={[styles.scoreCard, { backgroundColor: theme.card }]}>
      <View style={styles.scoreRow}>
        <Text style={[styles.teamName, { color: theme.text }]}>{gameData.awayTeam}</Text>
        <Text style={[styles.score, { color: theme.text }]}>{gameData.awayScore}</Text>
      </View>
      <Text style={[styles.vs, { color: theme.textSecondary }]}>VS</Text>
      <View style={styles.scoreRow}>
        <Text style={[styles.teamName, { color: theme.text }]}>{gameData.homeTeam}</Text>
        <Text style={[styles.score, { color: theme.text }]}>{gameData.homeScore}</Text>
      </View>
      <Text style={[styles.gameTime, { color: theme.textSecondary }]}>
        {gameData.quarter} Quarter - {gameData.timeRemaining}
      </Text>
    </View>
  );

  const renderTabs = () => (
    <View style={[styles.tabs, { backgroundColor: theme.surface }]}>
      {['overview', 'betting', 'sentiment', 'highlights'].map((tab) => (
        <TouchableOpacity
          key={tab}
          style={[
            styles.tab,
            selectedTab === tab && { backgroundColor: theme.primary + '20' }
          ]}
          onPress={() => setSelectedTab(tab)}
        >
          <Text
            style={[
              styles.tabText,
              { color: selectedTab === tab ? theme.primary : theme.textSecondary }
            ]}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderOverviewTab = () => (
    <View style={styles.tabContent}>
      <View style={[styles.sentimentCard, { backgroundColor: theme.card }]}>
        <Text style={[styles.cardTitle, { color: theme.text }]}>Current Sentiment</Text>
        <Text style={[styles.sentimentValue, { color: theme.success }]}>
          +{gameData.currentSentiment}% Positive
        </Text>
        <View style={styles.sentimentBar}>
          <View
            style={[
              styles.sentimentFill,
              {
                width: `${gameData.currentSentiment}%`,
                backgroundColor: theme.success,
              }
            ]}
          />
        </View>
      </View>

      <View style={[styles.predictionCard, { backgroundColor: theme.card }]}>
        <Text style={[styles.cardTitle, { color: theme.text }]}>AI Prediction</Text>
        <Text style={[styles.predictionText, { color: theme.textSecondary }]}>
          Based on current sentiment trends and game progress:
        </Text>
        <Text style={[styles.predictionValue, { color: theme.primary }]}>
          Warriors 67% chance to win
        </Text>
        <Text style={[styles.predictionDetails, { color: theme.textSecondary }]}>
          • 78% game elapsed
          • +15% sentiment swing favoring Warriors
          • Historical comeback probability: 23%
        </Text>
      </View>
    </View>
  );

  const renderBettingTab = () => (
    <View style={styles.tabContent}>
      <Text style={[styles.sectionTitle, { color: theme.text }]}>
        Over/Under Betting Lines
      </Text>
      {bettingData.map((bet, index) => (
        <View key={index} style={[styles.betCard, { backgroundColor: theme.card }]}>
          <Text style={[styles.betType, { color: theme.text }]}>
            {bet.type} {bet.line !== 0 ? `(${bet.line > 0 ? '+' : ''}${bet.line})` : ''}
          </Text>
          <View style={styles.betRow}>
            <View style={[styles.betOption, { backgroundColor: theme.success + '20' }]}>
              <Text style={[styles.betLabel, { color: theme.text }]}>Over</Text>
              <Text style={[styles.betOdds, { color: theme.success }]}>{bet.over}</Text>
            </View>
            <View style={[styles.betOption, { backgroundColor: theme.error + '20' }]}>
              <Text style={[styles.betLabel, { color: theme.text }]}>Under</Text>
              <Text style={[styles.betOdds, { color: theme.error }]}>{bet.under}</Text>
            </View>
          </View>
        </View>
      ))}
      
      <View style={[styles.noticeCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <Text style={[styles.noticeText, { color: theme.textSecondary }]}>
          💡 Real-time betting data integration coming soon
        </Text>
      </View>
    </View>
  );

  const renderSentimentTab = () => (
    <View style={styles.tabContent}>
      <Text style={[styles.sectionTitle, { color: theme.text }]}>
        Extreme Sentiment Quotes
      </Text>
      
      {sentimentQuotes.map((quote) => (
        <View key={quote.id} style={[styles.quoteCard, { backgroundColor: theme.card }]}>
          <View style={styles.quoteHeader}>
            <View style={[
              styles.sentimentBadge,
              { backgroundColor: quote.sentiment > 0 ? theme.success : theme.error }
            ]}>
              <Text style={styles.sentimentBadgeText}>
                {quote.sentiment > 0 ? '+' : ''}{quote.sentiment}%
              </Text>
            </View>
            <Text style={[styles.quoteTime, { color: theme.textSecondary }]}>
              {quote.quarter} • {quote.timestamp}
            </Text>
          </View>
          <Text style={[styles.quoteText, { color: theme.text }]}>
            "{quote.text}"
          </Text>
        </View>
      ))}

      <View style={[styles.chartPlaceholder, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <Text style={[styles.chartTitle, { color: theme.text }]}>
          📈 Sentiment Over Time
        </Text>
        <Text style={[styles.chartSubtitle, { color: theme.textSecondary }]}>
          Interactive sentiment graph will be displayed here
        </Text>
        <View style={[styles.chartArea, { backgroundColor: theme.background }]}>
          <Text style={[styles.chartPlaceholderText, { color: theme.textSecondary }]}>
            Python-generated sentiment timeline visualization
          </Text>
        </View>
      </View>
    </View>
  );

  const renderHighlightsTab = () => (
    <View style={styles.tabContent}>
      <Text style={[styles.sectionTitle, { color: theme.text }]}>
        Game Highlights
      </Text>
      
      {[1, 2, 3].map((highlight) => (
        <View key={highlight} style={[styles.highlightCard, { backgroundColor: theme.card }]}>
          <View style={[styles.videoPlaceholder, { backgroundColor: theme.background }]}>
            <Text style={[styles.videoIcon, { color: theme.primary }]}>▶️</Text>
            <Text style={[styles.videoText, { color: theme.textSecondary }]}>
              Highlight Reel #{highlight}
            </Text>
          </View>
          <Text style={[styles.highlightTitle, { color: theme.text }]}>
            Amazing Play - Quarter {highlight}
          </Text>
          <Text style={[styles.highlightDescription, { color: theme.textSecondary }]}>
            Video highlights and fan reactions will be displayed here
          </Text>
        </View>
      ))}
      
      <View style={[styles.noticeCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <Text style={[styles.noticeText, { color: theme.textSecondary }]}>
          🎥 Video highlight integration coming soon
        </Text>
      </View>
    </View>
  );

  const renderTabContent = () => {
    switch (selectedTab) {
      case 'overview': return renderOverviewTab();
      case 'betting': return renderBettingTab();
      case 'sentiment': return renderSentimentTab();
      case 'highlights': return renderHighlightsTab();
      default: return renderOverviewTab();
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {renderHeader()}
      {renderGameScore()}
      {renderTabs()}
      
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {renderTabContent()}
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
  scoreCard: {
    margin: 16,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 8,
  },
  teamName: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  score: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  vs: {
    fontSize: 14,
    marginVertical: 8,
  },
  gameTime: {
    fontSize: 16,
    marginTop: 8,
  },
  tabs: {
    flexDirection: 'row',
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
  },
  scrollContainer: {
    flex: 1,
  },
  tabContent: {
    padding: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  sentimentCard: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sentimentValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  sentimentBar: {
    height: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
  },
  sentimentFill: {
    height: '100%',
    borderRadius: 4,
  },
  predictionCard: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  predictionText: {
    fontSize: 14,
    marginBottom: 8,
  },
  predictionValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  predictionDetails: {
    fontSize: 14,
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  betCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  betType: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  betRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  betOption: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  betLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  betOdds: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  quoteCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quoteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sentimentBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  sentimentBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  quoteTime: {
    fontSize: 12,
  },
  quoteText: {
    fontSize: 16,
    lineHeight: 22,
    fontStyle: 'italic',
  },
  chartPlaceholder: {
    padding: 20,
    borderRadius: 12,
    borderWidth: 2,
    borderStyle: 'dashed',
    marginTop: 16,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  chartSubtitle: {
    fontSize: 14,
    marginBottom: 16,
  },
  chartArea: {
    height: 200,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chartPlaceholderText: {
    fontSize: 14,
    textAlign: 'center',
  },
  highlightCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  videoPlaceholder: {
    height: 120,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  videoIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  videoText: {
    fontSize: 14,
  },
  highlightTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  highlightDescription: {
    fontSize: 14,
  },
  noticeCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 16,
  },
  noticeText: {
    fontSize: 14,
    textAlign: 'center',
  },
});

export default GameDetailsScreen;