import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import ThemeToggle from './ThemeToggle';
import { mockGames } from '../data/mockData';

interface Props {
  title: string;
  subtitle?: string;
  currentScreen?: string;
}

const Header = ({ title, subtitle, currentScreen = 'Dashboard' }: Props) => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const [menuVisible, setMenuVisible] = useState(false);

  const getMenuItems = () => {
    const allItems = [
      { name: 'Home', screen: 'Dashboard', icon: '🏠', params: undefined },
      { name: 'Dashboard', screen: 'Dashboard', icon: '🏈', params: undefined },
      { name: 'Game Analysis', screen: 'GameDetail', icon: '🎯', params: { game: mockGames[0] } },
      { name: 'Fan Sentiment', screen: 'Sentiment', icon: '💭', params: { gameId: mockGames[0].id } },
    ];
    
    // Filter out current screen but always keep Home option
    return allItems.filter(item => item.name === 'Home' || item.name !== currentScreen);
  };

  const menuItems = getMenuItems();

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  const navigateToScreen = (item: typeof menuItems[0]) => {
    toggleMenu();
    if (item.screen === 'Dashboard') {
      (navigation as any).navigate('Dashboard');
    } else if (item.screen === 'GameDetail') {
      (navigation as any).navigate('GameDetail', item.params);
    } else if (item.screen === 'Sentiment') {
      (navigation as any).navigate('Sentiment', item.params);
    }
  };



  return (
    <>
      <View style={[styles.header, { backgroundColor: theme.colors.header }]}>
        <View style={styles.headerContent}>
          <View style={styles.leftSection}>
            <TouchableOpacity onPress={toggleMenu} style={styles.menuButton}>
              <View style={styles.hamburger}>
                <View style={[styles.line, { backgroundColor: theme.isDark ? theme.colors.text : '#ffffff' }]} />
                <View style={[styles.line, { backgroundColor: theme.isDark ? theme.colors.text : '#ffffff' }]} />
                <View style={[styles.line, { backgroundColor: theme.isDark ? theme.colors.text : '#ffffff' }]} />
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.centerSection}>
            <Text style={[styles.title, { color: theme.isDark ? theme.colors.text : '#ffffff' }]}>{title}</Text>
            {subtitle && (
              <Text style={[styles.subtitle, { color: theme.isDark ? theme.colors.textSecondary : '#c5cae9' }]}>
                {subtitle}
              </Text>
            )}
          </View>

          <View style={styles.rightSection}>
            <ThemeToggle />
          </View>
        </View>
      </View>

      <Modal
        transparent
        visible={menuVisible}
        animationType="none"
        onRequestClose={toggleMenu}
      >
        <TouchableOpacity style={styles.modalOverlay} onPress={toggleMenu}>
          <View 
            style={[
              styles.menuContainer, 
              { 
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.border,
              }
            ]}
          >
            <View style={styles.menuHeader}>
              <Text style={[styles.menuTitle, { color: theme.colors.text }]}>Navigation</Text>
            </View>
            
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={item.name}
                style={[
                  styles.menuItem,
                  { borderBottomColor: theme.colors.border },
                  currentScreen === item.name && { backgroundColor: theme.colors.primary + '20' }
                ]}
                onPress={() => navigateToScreen(item)}
              >
                <Text style={styles.menuIcon}>{item.icon}</Text>
                <Text style={[
                  styles.menuItemText, 
                  { color: theme.colors.text },
                  currentScreen === item.name && { fontWeight: 'bold', color: theme.colors.primary }
                ]}>
                  {item.name}
                </Text>
                {currentScreen === item.name && (
                  <View style={[styles.activeIndicator, { backgroundColor: theme.colors.primary }]} />
                )}
              </TouchableOpacity>
            ))}

            <View style={[styles.menuFooter, { borderTopColor: theme.colors.border }]}>
              <Text style={[styles.footerText, { color: theme.colors.textTertiary }]}>
                CFB Betting Dashboard v1.0
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftSection: {
    width: 50,
  },
  centerSection: {
    flex: 1,
    alignItems: 'center',
  },
  rightSection: {
    width: 50,
    alignItems: 'flex-end',
  },

  menuButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hamburger: {
    width: 24,
    height: 18,
    justifyContent: 'space-between',
  },
  line: {
    height: 3,
    borderRadius: 1.5,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-start',
    paddingTop: 120,
    paddingHorizontal: 20,
  },
  menuContainer: {
    borderRadius: 12,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  menuHeader: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  menuTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  menuIcon: {
    fontSize: 20,
    marginRight: 15,
  },
  menuItemText: {
    fontSize: 16,
    flex: 1,
  },
  activeIndicator: {
    width: 4,
    height: 20,
    borderRadius: 2,
  },
  menuFooter: {
    padding: 15,
    borderTopWidth: 1,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
  },
});

export default Header;