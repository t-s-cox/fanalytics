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

interface SentimentAnalysisProps {
  navigation: any;
}

const SentimentAnalysisScreen: React.FC<SentimentAnalysisProps> = ({ navigation }) => {
  const { theme, isDark, toggleTheme } = useTheme();

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
        <Text style={[styles.headerTitle, { color: theme.text }]}>Sentiment Analysis</Text>
        <Text style={[styles.headerSubtitle, { color: theme.textSecondary }]}>Fan Mood Analytics</Text>
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
        <View style={[styles.chartCard, { backgroundColor: theme.card }]}>
          <Text style={[styles.cardTitle, { color: theme.text }]}>📊 Sentiment Trends</Text>
          <View style={[styles.chartPlaceholder, { backgroundColor: theme.background }]}>
            <Text style={[styles.placeholderText, { color: theme.textSecondary }]}>
              Interactive sentiment charts will be displayed here
            </Text>
          </View>
        </View>
        
        <View style={[styles.metricsCard, { backgroundColor: theme.card }]}>
          <Text style={[styles.cardTitle, { color: theme.text }]}>📈 Key Metrics</Text>
          <View style={styles.metricRow}>
            <Text style={[styles.metricLabel, { color: theme.textSecondary }]}>Average Positive Sentiment</Text>
            <Text style={[styles.metricValue, { color: theme.success }]}>+67%</Text>
          </View>
          <View style={styles.metricRow}>
            <Text style={[styles.metricLabel, { color: theme.textSecondary }]}>Peak Negative Sentiment</Text>
            <Text style={[styles.metricValue, { color: theme.error }]}>-89%</Text>
          </View>
          <View style={styles.metricRow}>
            <Text style={[styles.metricLabel, { color: theme.textSecondary }]}>Sentiment Volatility</Text>
            <Text style={[styles.metricValue, { color: theme.warning }]}>High</Text>
          </View>
        </View>
        
        <View style={[styles.noticeCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.noticeText, { color: theme.textSecondary }]}>
            🤖 Python sentiment analysis integration coming soon
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
  headerSubtitle: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  menuIcon: {
    fontSize: 24,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: -0.5,
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
  chartCard: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  chartPlaceholder: {
    height: 200,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 14,
    textAlign: 'center',
  },
  metricsCard: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  metricLabel: {
    fontSize: 16,
  },
  metricValue: {
    fontSize: 16,
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

export default SentimentAnalysisScreen;