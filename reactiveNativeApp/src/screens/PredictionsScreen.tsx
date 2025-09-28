import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Platform, Image } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

interface PredictionsProps { navigation: any; }

const PredictionsScreen: React.FC<PredictionsProps> = ({ navigation }) => {
  const { theme, isDark, toggleTheme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
        <TouchableOpacity style={styles.menuButton} onPress={() => navigation.openDrawer()}>
          <Image 
            source={require('../../assets/hamburger2.png')}
            style={styles.hamburgerIcon}
          />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={[styles.headerTitle, { color: theme.text }]}>AI Predictions</Text>
          <Text style={[styles.headerSubtitle, { color: theme.textSecondary }]}>Game Outcomes</Text>
        </View>
        <TouchableOpacity style={styles.themeButton} onPress={toggleTheme}>
                    <Image 
                      source={isDark ? require('../../assets/lightMode.png') : require('../../assets/darkMode.png')}
                      style={[styles.themeIcon, { tintColor: theme.text }]}
                    />
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.scrollContainer}>
        <View style={[styles.card, { backgroundColor: theme.card }]}>
          <Text style={[styles.cardTitle, { color: theme.text }]}>🔮 AI Predictions</Text>
          <Text style={[styles.placeholderText, { color: theme.textSecondary }]}>
            Machine learning predictions based on sentiment data will be displayed here
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
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
  scrollContainer: { flex: 1, padding: 16 },
  card: { padding: 20, borderRadius: 12, marginBottom: 16 },
  cardTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 16 },
  placeholderText: { fontSize: 14, textAlign: 'center' },
});

export default PredictionsScreen;