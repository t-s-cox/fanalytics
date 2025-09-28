import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

interface DrawerContentProps {
  navigation: any;
  currentRoute: string;
}

interface MenuItem {
  title: string;
  route: string;
  icon?: string;
}

const menuItems: MenuItem[] = [
  { title: 'Select Games', route: 'GameSelection' },
  { title: 'Dashboard', route: 'Dashboard' },
  { title: 'Live Games', route: 'LiveGames' },
  { title: 'Sentiment Analysis', route: 'SentimentAnalysis' },
  { title: 'Predictions', route: 'Predictions' },
  { title: 'Highlights', route: 'Highlights' },
];

const DrawerContent: React.FC<DrawerContentProps> = ({ navigation, currentRoute }) => {
  const { theme, isDark, toggleTheme } = useTheme();

  const handleNavigation = (route: string) => {
    navigation.navigate(route);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.surface }]}>
      <ScrollView style={styles.scrollContainer}>
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: theme.border }]}>
          <Text style={[styles.headerTitle, { color: theme.text }]}>
            College Football Dashboard
          </Text>
          <Text style={[styles.headerSubtitle, { color: theme.textSecondary }]}>
            Fan Sentiment Analytics
          </Text>
        </View>



        {/* Menu Items */}
        <View style={styles.menuSection}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.menuItem,
                { backgroundColor: currentRoute === item.route ? theme.primary + '20' : 'transparent' }
              ]}
              onPress={() => handleNavigation(item.route)}
            >
              <Text
                style={[
                  styles.menuItemText,
                  {
                    color: currentRoute === item.route ? theme.primary : theme.text,
                    fontWeight: currentRoute === item.route ? 'bold' : 'normal',
                  }
                ]}
              >
                {item.title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={[styles.footer, { borderTopColor: theme.border }]}>
        <Text style={[styles.footerText, { color: theme.textSecondary }]}>
          v1.0.0 • Sports Analytics
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
  },

  menuSection: {
    paddingVertical: 10,
  },
  menuItem: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginHorizontal: 10,
    borderRadius: 8,
    marginBottom: 2,
  },
  menuItemText: {
    fontSize: 16,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
  },
});

export default DrawerContent;