import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useTheme } from '../context/ThemeContext';

interface SocialPost {
  id: string;
  platform: 'twitter' | 'reddit' | 'facebook';
  author: string;
  content: string;
  sentiment: 'bullish' | 'bearish' | 'neutral';
  engagement: number;
  timestamp: string;
  gameId?: string;
}

interface Props {
  posts: SocialPost[];
  onPostPress?: (post: SocialPost) => void;
}

const SocialHighlights = ({ posts, onPostPress }: Props) => {
  const { theme } = useTheme();

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'twitter': return '#1da1f2';
      case 'reddit': return '#ff4500';
      case 'facebook': return '#4267b2';
      default: return '#666';
    }
  };

  const getSentimentEmoji = (sentiment: string) => {
    switch (sentiment) {
      case 'bullish': return '📈';
      case 'bearish': return '📉';
      default: return '➖';
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'bullish': return '#4caf50';
      case 'bearish': return '#f44336';
      default: return '#757575';
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
    return `${Math.floor(diffMins / 1440)}d ago`;
  };

  if (posts.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
        <Text style={[styles.title, { color: theme.colors.text }]}>🔥 Trending Posts</Text>
        <View style={[styles.emptyState, { borderColor: theme.colors.border }]}>
          <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
            📱 Social media highlights will appear here
          </Text>
          <Text style={[styles.emptySubtext, { color: theme.colors.textTertiary }]}>
            Real-time fan sentiment tracking coming soon
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
      <Text style={[styles.title, { color: theme.colors.text }]}>🔥 Trending Posts</Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.postsContainer}
      >
        {posts.map((post) => (
          <TouchableOpacity
            key={post.id}
            style={[styles.postCard, { 
              backgroundColor: theme.colors.background,
              borderColor: theme.colors.border 
            }]}
            onPress={() => onPostPress?.(post)}
          >
            <View style={styles.postHeader}>
              <View style={styles.platformInfo}>
                <View style={[styles.platformBadge, { backgroundColor: getPlatformColor(post.platform) }]}>
                  <Text style={styles.platformText}>{post.platform}</Text>
                </View>
                <Text style={[styles.author, { color: theme.colors.textSecondary }]}>@{post.author}</Text>
              </View>
              <View style={styles.sentimentBadge}>
                <Text style={styles.sentimentEmoji}>{getSentimentEmoji(post.sentiment)}</Text>
              </View>
            </View>
            
            <Text style={[styles.postContent, { color: theme.colors.text }]} numberOfLines={3}>
              {post.content}
            </Text>
            
            <View style={styles.postFooter}>
              <Text style={[styles.engagement, { color: theme.colors.textTertiary }]}>
                ❤️ {post.engagement}
              </Text>
              <Text style={[styles.timestamp, { color: theme.colors.textTertiary }]}>
                {formatTime(post.timestamp)}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
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
  postsContainer: {
    paddingRight: 10,
  },
  postCard: {
    width: 280,
    marginRight: 15,
    borderRadius: 10,
    padding: 15,
    borderWidth: 1,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  platformInfo: {
    flex: 1,
  },
  platformBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  platformText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  author: {
    fontSize: 12,
    fontWeight: '500',
  },
  sentimentBadge: {
    marginLeft: 10,
  },
  sentimentEmoji: {
    fontSize: 16,
  },
  postContent: {
    fontSize: 14,
    lineHeight: 18,
    marginBottom: 10,
  },
  postFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  engagement: {
    fontSize: 12,
  },
  timestamp: {
    fontSize: 11,
  },
});

export default SocialHighlights;