import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle = () => {
  const { theme, toggleTheme, isDark } = useTheme();

  return (
    <TouchableOpacity 
      style={[
        styles.container, 
        { 
          backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.2)',
          borderColor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.3)'
        }
      ]} 
      onPress={toggleTheme}
    >
      <View style={[
        styles.toggle, 
        { 
          backgroundColor: isDark ? '#FFD700' : '#FF6B35',
          transform: [{ rotate: isDark ? '0deg' : '0deg' }]
        }
      ]}>
        <Text style={[styles.icon, { color: isDark ? '#000' : '#FFF' }]}>
          {isDark ? '🌙' : '☀️'}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  toggle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 16,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
  },
});

export default ThemeToggle;