import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';

interface ConfidenceData {
  category: string;
  confidence: number;
  color: string;
}

interface Props {
  data: ConfidenceData[];
  title: string;
  subtitle?: string;
}

const ConfidenceChart = ({ data, title, subtitle }: Props) => {
  const { theme } = useTheme();

  const renderChart = () => {
    if (data.length === 0) {
      return (
        <View style={[styles.emptyState, { borderColor: theme.colors.border }]}>
          <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
            🎯 Confidence metrics will appear here
          </Text>
          <Text style={[styles.emptySubtext, { color: theme.colors.textTertiary }]}>
            AI model predictions integration ready
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.chartContainer}>
        {data.map((item, index) => (
          <View key={index} style={styles.confidenceRow}>
            <View style={styles.labelContainer}>
              <Text style={[styles.categoryLabel, { color: theme.colors.text }]}>
                {item.category}
              </Text>
              <Text style={[styles.confidenceValue, { color: theme.colors.textSecondary }]}>
                {item.confidence}%
              </Text>
            </View>
            <View style={[styles.progressBar, { backgroundColor: theme.colors.border }]}>
              <View 
                style={[
                  styles.progressFill,
                  { 
                    width: `${item.confidence}%`,
                    backgroundColor: item.color
                  }
                ]} 
              />
            </View>
          </View>
        ))}
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
      <Text style={[styles.title, { color: theme.colors.text }]}>{title}</Text>
      {subtitle && (
        <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>{subtitle}</Text>
      )}
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
    marginBottom: 5,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 15,
  },
  emptyState: {
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 2,
    borderStyle: 'dashed',
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 12,
    textAlign: 'center',
  },
  chartContainer: {
    gap: 15,
  },
  confidenceRow: {
    marginBottom: 10,
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  confidenceValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
});

export default ConfidenceChart;