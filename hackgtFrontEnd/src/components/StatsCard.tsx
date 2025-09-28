import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';

interface Props {
  title: string;
  value: string;
  subtitle: string;
  color: string;
}

const StatsCard: React.FC<Props> = ({ title, value, subtitle, color }) => {
  const { theme } = useTheme();
  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: theme.colors.textSecondary }]}>{title}</Text>
      <Text style={[styles.value, { color }]}>{value}</Text>
      <Text style={[styles.subtitle, { color: theme.colors.textTertiary }]}>{subtitle}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    padding: 10,
  },
  title: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 5,
    textAlign: 'center',
  },
  value: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 12,
    textAlign: 'center',
  },
});

export default StatsCard;