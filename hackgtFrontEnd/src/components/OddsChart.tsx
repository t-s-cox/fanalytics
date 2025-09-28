import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { useTheme } from '../context/ThemeContext';

interface OddsDataPoint {
  time: string;
  overUnder: number;
  overOdds: number;
  underOdds: number;
}

interface Props {
  data: OddsDataPoint[];
  title: string;
  currentLine?: number;
}

const OddsChart = ({ data, title, currentLine }: Props) => {
  const { theme } = useTheme();

  const renderChart = () => {
    if (data.length === 0) {
      return (
        <View style={[styles.emptyState, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
            📈 Odds movement data will appear here
          </Text>
          <Text style={[styles.emptySubtext, { color: theme.colors.textTertiary }]}>
            Live odds tracking integration ready
          </Text>
        </View>
      );
    }

    // Mock visualization for odds movement
    return (
      <View style={[styles.chartContainer, { backgroundColor: theme.colors.surface }]}>
        <View style={styles.currentLine}>
          <Text style={[styles.lineLabel, { color: theme.colors.primary }]}>
            Current O/U: {currentLine || 52.5}
          </Text>
        </View>
        
        <View style={styles.mockChart}>
          <View style={styles.chartLine}>
            <View style={[styles.trendLine, { backgroundColor: theme.colors.primary }]} />
            <Text style={[styles.chartLabel, { color: theme.colors.textSecondary }]}>
              Odds Movement Over Time
            </Text>
          </View>
        </View>

        <View style={styles.oddsInfo}>
          <View style={styles.oddsItem}>
            <Text style={[styles.oddsLabel, { color: theme.colors.textSecondary }]}>Over</Text>
            <Text style={[styles.oddsValue, { color: '#4caf50' }]}>-110</Text>
          </View>
          <View style={styles.oddsItem}>
            <Text style={[styles.oddsLabel, { color: theme.colors.textSecondary }]}>Under</Text>
            <Text style={[styles.oddsValue, { color: '#f44336' }]}>-110</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
      <Text style={[styles.title, { color: theme.colors.text }]}>{title}</Text>
      {renderChart()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 10,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  emptyState: {
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderStyle: 'dashed',
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
  },
  emptySubtext: {
    fontSize: 12,
  },
  chartContainer: {
    borderRadius: 8,
    padding: 15,
  },
  currentLine: {
    alignItems: 'center',
    marginBottom: 15,
  },
  lineLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  mockChart: {
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  chartLine: {
    alignItems: 'center',
  },
  trendLine: {
    width: 200,
    height: 3,
    borderRadius: 1.5,
    marginBottom: 10,
  },
  chartLabel: {
    fontSize: 12,
    fontStyle: 'italic',
  },
  oddsInfo: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  oddsItem: {
    alignItems: 'center',
  },
  oddsLabel: {
    fontSize: 14,
    marginBottom: 5,
  },
  oddsValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default OddsChart;