import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Image,
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

interface LiveGamesProps {
  navigation: any;
}

const LiveGamesScreen: React.FC<LiveGamesProps> = ({ navigation }) => {
  const { theme, isDark, toggleTheme } = useTheme();

  const liveGames = [
    {
      id: '1',
      homeTeam: 'Alabama',
      awayTeam: 'Georgia',
      homeScore: 21,
      awayScore: 17,
      quarter: '4th',
      time: '8:42',
      sentiment: 78,
    },
    {
      id: '2',
      homeTeam: 'Ohio State',
      awayTeam: 'Michigan',
      homeScore: 14,
      awayScore: 10,
      quarter: '3rd',
      time: '12:15',
      sentiment: -34,
    },
    {
      id: '3',
      homeTeam: 'Texas',
      awayTeam: 'Oklahoma',
      homeScore: 0,
      awayScore: 0,
      quarter: 'Pre',
      time: '30:00',
      sentiment: 45,
    },
  ];

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
          Live Games
        </Text>
        <Text style={[styles.headerSubtitle, { color: theme.textSecondary }]}>
          Real-time College Football
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

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {renderHeader()}
      
      <ScrollView style={styles.scrollContainer}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          Currently Live
        </Text>
        
        {liveGames.map((game) => (
          <TouchableOpacity
            key={game.id}
            style={[styles.gameCard, { backgroundColor: theme.card }]}
            onPress={() => navigation.navigate('GameDetails', { gameId: game.id })}
          >
            <View style={styles.gameHeader}>
              <Text style={[styles.gameTeams, { color: theme.text }]}>
                {game.awayTeam} @ {game.homeTeam}
              </Text>
              <View style={[styles.liveBadge, { backgroundColor: theme.error }]}>
                <Text style={styles.liveText}>LIVE</Text>
              </View>
            </View>
            
            <View style={styles.scoreRow}>
              <Text style={[styles.score, { color: theme.text }]}>
                {game.awayScore} - {game.homeScore}
              </Text>
              <Text style={[styles.gameTime, { color: theme.textSecondary }]}>
                {game.quarter} {game.time}
              </Text>
            </View>
            
            <View style={styles.sentimentRow}>
              <Text style={[styles.sentimentLabel, { color: theme.textSecondary }]}>
                Fan Sentiment:
              </Text>
              <Text style={[
                styles.sentimentValue,
                { color: game.sentiment > 0 ? theme.success : theme.error }
              ]}>
                {game.sentiment > 0 ? '+' : ''}{game.sentiment}%
              </Text>
            </View>
          </TouchableOpacity>
        ))}
        
        <View style={[styles.noticeCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.noticeText, { color: theme.textSecondary }]}>Real-time game data integration coming soon</Text>
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
  iconImage: {
    width: 24,
    height: 24,
  },
  scrollContainer: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  gameCard: {
    padding: 16,
    marginBottom: 12,
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
  },
  liveBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  liveText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  score: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  gameTime: {
    fontSize: 14,
  },
  sentimentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sentimentLabel: {
    fontSize: 14,
  },
  sentimentValue: {
    fontSize: 14,
    fontWeight: 'bold',
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

export default LiveGamesScreen;