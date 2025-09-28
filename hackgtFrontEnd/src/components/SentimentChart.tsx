import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { useTheme } from '../context/ThemeContext';

interface DataPoint {
  time: string;
  sentiment: number; // -100 to 100 scale
  confidence: number;
}

interface Props {
  data: DataPoint[];
  title: string;
  height?: number;
}

const SentimentChart = ({ data, title, height = 200 }: Props) => {
  const { theme } = useTheme();
  const screenWidth = Dimensions.get('window').width - 40;

  const renderChart = () => {
    if (data.length === 0) {
      return (
        <View style={[styles.emptyState, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
            📊 Sentiment data will appear here
          </Text>
          <Text style={[styles.emptySubtext, { color: theme.colors.textTertiary }]}>
            Real-time sentiment tracking coming soon
          </Text>
        </View>
      );
    }

    // Mock visualization - will be replaced with actual chart library
    return (
      <View style={[styles.chartContainer, { backgroundColor: theme.colors.surface }]}>
        <View style={styles.chartArea}>
          {/* Y-axis labels */}
          <View style={styles.yAxis}>
            <Text style={[styles.axisLabel, { color: theme.colors.textTertiary }]}>+100</Text>
            <Text style={[styles.axisLabel, { color: theme.colors.textTertiary }]}>0</Text>
            <Text style={[styles.axisLabel, { color: theme.colors.textTertiary }]}>-100</Text>
          </View>
          
          {/* Mock chart visualization */}
          <View style={styles.plotArea}>
            {data.map((point, index) => {
              const yPosition = ((100 - point.sentiment) / 200) * (height - 60);
              const xPosition = (index / (data.length - 1)) * (screenWidth - 80);
              const color = point.sentiment > 20 ? '#4caf50' : point.sentiment < -20 ? '#f44336' : '#ff9800';
              
              return (
                <View
                  key={index}
                  style={[
                    styles.dataPoint,
                    {
                      backgroundColor: color,
                      left: xPosition,
                      top: yPosition,
                      opacity: point.confidence / 100,
                    },
                  ]}
                />
              );
            })}
          </View>
        </View>
        
        {/* X-axis */}
        <View style={styles.xAxis}>
          <Text style={[styles.axisLabel, { color: theme.colors.textTertiary }]}>Pre-Game</Text>
          <Text style={[styles.axisLabel, { color: theme.colors.textTertiary }]}>Live</Text>
          <Text style={[styles.axisLabel, { color: theme.colors.textTertiary }]}>Post-Game</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
      <Text style={[styles.title, { color: theme.colors.text }]}>{title}</Text>
      {renderChart()}
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#4caf50' }]} />
          <Text style={[styles.legendText, { color: theme.colors.textSecondary }]}>Bullish</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#ff9800' }]} />
          <Text style={[styles.legendText, { color: theme.colors.textSecondary }]}>Neutral</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#f44336' }]} />
          <Text style={[styles.legendText, { color: theme.colors.textSecondary }]}>Bearish</Text>
        </View>
      </View>
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
    height: 150,
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
    padding: 10,
  },
  chartArea: {
    flexDirection: 'row',
    height: 160,
  },
  yAxis: {
    width: 40,
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingRight: 10,
  },
  plotArea: {
    flex: 1,
    position: 'relative',
  },
  dataPoint: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  xAxis: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingHorizontal: 40,
  },
  axisLabel: {
    fontSize: 10,
    fontWeight: '500',
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 5,
  },
  legendText: {
    fontSize: 12,
  },
});

export default SentimentChart;