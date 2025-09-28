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
import { LinearGradient } from 'expo-linear-gradient';

interface GameSelectionProps {
  navigation: any;
}

interface Game {
  id: string;
  homeTeam: string;
  awayTeam: string;
  date: string;
  time: string;
  status: 'live' | 'upcoming' | 'completed';
  week: string;
  venue: string;
  jsonFile: string;
}

const teamColors: Record<string, string> = {
  Clemson: '#F56600',
  Syracuse: '#F76900',
  Kansas: '#0051ba',
  Cincinnati: '#e00122',
  Pitt: '#003594',
  Pittsburgh: '#003594',
  Louisville: '#AD0000',
  Duke: '#012169',
  Arkansas: '#9D2235',
  'Notre Dame': '#ae9142',
  Vanderbilt: '#CFAE70',
  'Utah State': '#0F2439',
  LSU: '#461D7C',
  'Ole Miss': '#CE1126',
  Northwestern: '#4E2A84',
  UCLA: '#2774AE',
  Illinois: '#FF5F05',
  USC: '#990000',
  Virginia: '#E57200',
  'Florida State': '#782F40',
  FSU: '#782F40',
};

const mockGames: Game[] = [
  {
    id: '1',
    homeTeam: 'Cincinnati',
    awayTeam: 'Kansas',
    date: 'Nov 22, 2024',
    time: '6:00 PM EST',
    status: 'completed',
    week: 'Week 13',
    venue: 'Nippert Stadium',
    jsonFile: 'cincinativskansas.json',
  },
  {
    id: '2',
    homeTeam: 'Duke',
    awayTeam: 'Syracuse',
    date: 'Nov 22, 2024',
    time: '2:00 PM EST',
    status: 'completed',
    week: 'Week 13',
    venue: 'Wallace Wade Stadium',
    jsonFile: 'dukevsyracuse.json',
  },
  {
    id: '3',
    homeTeam: 'FSU',
    awayTeam: 'Virginia',
    date: 'Nov 22, 2024',
    time: '1:00 PM EST',
    status: 'completed',
    week: 'Week 13',
    venue: 'Doak Campbell Stadium',
    jsonFile: 'fsuvsvirginia.json',
  },
  {
    id: '4',
    homeTeam: 'Louisville',
    awayTeam: 'Pittsburgh',
    date: 'Nov 23, 2024',
    time: '3:30 PM EST',
  status: 'completed',
    week: 'Week 13',
    venue: 'Cardinal Stadium',
    jsonFile: 'louisvillevspittsburgh.json',
  },
  {
    id: '5',
    homeTeam: 'LSU',
    awayTeam: 'Ole Miss',
    date: 'Nov 23, 2024',
    time: '7:00 PM EST',
  status: 'completed',
    week: 'Week 13',
    venue: 'Tiger Stadium',
    jsonFile: 'lsuvolemiss.json',
  },
  {
    id: '6',
    homeTeam: 'Notre Dame',
    awayTeam: 'Arkansas',
    date: 'Nov 23, 2024',
    time: '12:00 PM EST',
  status: 'completed',
    week: 'Week 13',
    venue: 'Notre Dame Stadium',
    jsonFile: 'notredamevsarkansas.json',
  },
  {
    id: '7',
    homeTeam: 'Syracuse',
    awayTeam: 'Clemson',
    date: 'Nov 23, 2024',
    time: '4:30 PM EST',
  status: 'completed',
    week: 'Week 13',
    venue: 'Carrier Dome',
    jsonFile: 'syracusevsclemson.json',
  },
  {
    id: '8',
    homeTeam: 'UCLA',
    awayTeam: 'Northwestern',
    date: 'Nov 22, 2024',
    time: '8:00 PM EST',
    status: 'completed',
    week: 'Week 13',
    venue: 'Rose Bowl',
    jsonFile: 'uclavsnorthwestern.json',
  },
  {
    id: '9',
    homeTeam: 'USC',
    awayTeam: 'Illinois',
    date: 'Nov 23, 2024',
    time: '5:00 PM EST',
  status: 'completed',
    week: 'Week 13',
    venue: 'Los Angeles Memorial Coliseum',
    jsonFile: 'uscvillinois.json',
  },
  {
    id: '10',
    homeTeam: 'Utah',
    awayTeam: 'Vanderbilt',
    date: 'Nov 23, 2024',
    time: '6:30 PM EST',
  status: 'completed',
    week: 'Week 13',
    venue: 'Rice-Eccles Stadium',
    jsonFile: 'utahvsvandy.json',
  },
];

const GameSelectionScreen: React.FC<GameSelectionProps> = ({ navigation }) => {
  const { theme, isDark, toggleTheme } = useTheme();
  const screenWidth = Dimensions.get('window').width;

  const getStatusColor = () => theme.textSecondary;

  const getTeamColor = (name: string) => teamColors[name] || theme.primary;

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
          Select Games
        </Text>
        <Text style={[styles.headerSubtitle, { color: theme.textSecondary }]}>
          Choose games for analysis
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

  const renderGameCard = (game: Game) => {
    const cardInner = (
      <View style={styles.cardContent}> 
        <View style={styles.gameHeader}>
          <View style={styles.gameInfo}>
            <Text style={[styles.gameTeams, { color: theme.text }]}>
              {game.homeTeam} vs {game.awayTeam}
            </Text>
            <Text style={[styles.gameVenue, { color: theme.textSecondary }]}>
              {game.venue}
            </Text>
          </View>
          <View style={styles.gameStatus}>
            <View style={[styles.statusBadge,{ backgroundColor: getStatusColor() }]}>
              <Text style={styles.statusText}>
                {game.status.toUpperCase()}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.gameDetails}>
          <Text style={[styles.gameDate, { color: theme.text }]}>
            {game.date}
          </Text>
          <Text style={[styles.gameTime, { color: theme.textSecondary }]}>
            {game.time}
          </Text>
          <Text style={[styles.gameWeek, { color: theme.textSecondary }]}>
            {game.week}
          </Text>
        </View>
      </View>
    );
    return (
      <TouchableOpacity key={game.id} onPress={() => navigation.navigate('GameDetails',{gameId:game.id,gameName:game.homeTeam + ' vs ' + game.awayTeam,jsonFile:game.jsonFile})}>
        <LinearGradient colors={[getTeamColor(game.homeTeam), getTeamColor(game.awayTeam)]} start={{x:0,y:0.5}} end={{x:1,y:0.5}} style={styles.gameCard}>
          <View style={styles.gradientOverlay} />
          {cardInner}
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {renderHeader()}
      
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Available Games
          </Text>
          <Text style={[styles.sectionSubtitle, { color: theme.textSecondary }]}>
            Select a game to view detailed analytics
          </Text>
          
          <View style={styles.gamesContainer}>
            {mockGames.map(renderGameCard)}
          </View>
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
    marginBottom: 20,
  },
  gamesContainer: {
    gap: 12,
  },
  gameCard:{
    padding:16,
    borderRadius:12,
    shadowOffset:{width:0,height:2},
    shadowOpacity:0.1,
    shadowRadius:4,
    elevation:3,
    marginBottom:12,
    position:'relative',
    overflow:'hidden'
  },
  gradientOverlay:{
    ...StyleSheet.absoluteFillObject,
    backgroundColor:'rgba(0,0,0,0.20)'
  },
  cardContent:{
    position:'relative'
  },
  gameHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  gameInfo: {
    flex: 1,
  },
  gameStatus: {
    alignItems: 'flex-end',
    gap: 8,
  },
  gameTeams: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  gameVenue: {
    fontSize: 14,
    fontStyle: 'italic',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  selectedIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  gameDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  gameDate: {
    fontSize: 16,
    fontWeight: '600',
  },
  gameTime: {
    fontSize: 14,
  },
  gameWeek: {
    fontSize: 12,
    fontWeight: '500',
  },
  actionContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  selectionInfo: {
    marginBottom: 12,
    alignItems: 'center',
  },
  selectionCount: {
    fontSize: 16,
    fontWeight: '600',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  clearButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  clearButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  continueButton: {
    flex: 2,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  continueButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default GameSelectionScreen;