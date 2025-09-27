import { Game, BettingOdds, SentimentData, BetRecommendation } from '../types';

export const mockGames: Game[] = [
  {
    id: '1',
    homeTeam: 'Alabama',
    awayTeam: 'Georgia',
    gameTime: '2025-09-27T19:30:00Z',
    week: 4,
    season: '2025',
    status: 'upcoming'
  },
  {
    id: '2',
    homeTeam: 'Ohio State',
    awayTeam: 'Penn State',
    gameTime: '2025-09-27T20:00:00Z',
    week: 4,
    season: '2025',
    status: 'upcoming'
  },
  {
    id: '3',
    homeTeam: 'Clemson',
    awayTeam: 'Florida State',
    gameTime: '2025-09-27T15:30:00Z',
    week: 4,
    season: '2025',
    status: 'upcoming'
  },
  {
    id: '4',
    homeTeam: 'Texas',
    awayTeam: 'Oklahoma',
    gameTime: '2025-09-27T16:00:00Z',
    week: 4,
    season: '2025',
    status: 'upcoming'
  },
  {
    id: '5',
    homeTeam: 'Michigan',
    awayTeam: 'USC',
    gameTime: '2025-09-27T17:00:00Z',
    week: 4,
    season: '2025',
    status: 'upcoming'
  },
  {
    id: '6',
    homeTeam: 'Notre Dame',
    awayTeam: 'Stanford',
    gameTime: '2025-09-27T21:30:00Z',
    week: 4,
    season: '2025',
    status: 'upcoming'
  },
  {
    id: '4',
    homeTeam: 'Clemson',
    awayTeam: 'Florida State',
    gameTime: '2025-09-27T20:00:00Z',
    week: 1,
    season: '2025',
    status: 'upcoming'
  },
  {
    id: '5',
    homeTeam: 'Notre Dame',
    awayTeam: 'USC',
    gameTime: '2025-09-27T22:30:00Z',
    week: 1,
    season: '2025',
    status: 'upcoming'
  }
];

export const mockOdds: BettingOdds[] = [
  {
    gameId: '1',
    overUnder: 52.5,
    overOdds: -110,
    underOdds: -110,
    sportsbook: 'DraftKings',
    lastUpdated: '2025-09-27T14:30:00Z'
  },
  {
    gameId: '2',
    overUnder: 48.5,
    overOdds: -105,
    underOdds: -115,
    sportsbook: 'FanDuel',
    lastUpdated: '2025-09-27T14:25:00Z'
  },
  {
    gameId: '3',
    overUnder: 55.5,
    overOdds: -112,
    underOdds: -108,
    sportsbook: 'BetMGM',
    lastUpdated: '2025-09-27T14:45:00Z'
  },
  {
    gameId: '4',
    overUnder: 44.5,
    overOdds: -110,
    underOdds: -110,
    sportsbook: 'Caesars',
    lastUpdated: '2025-09-27T14:20:00Z'
  },
  {
    gameId: '5',
    overUnder: 51.0,
    overOdds: -108,
    underOdds: -112,
    sportsbook: 'DraftKings',
    lastUpdated: '2025-09-27T14:35:00Z'
  }
];

export const mockSentiment: SentimentData[] = [
  {
    gameId: '1',
    fanSentiment: {
      bullish: 68,
      bearish: 22,
      neutral: 10,
      totalPosts: 2847
    },
    espnSentiment: {
      tone: 'positive',
      overUnderLean: 'over',
      confidence: 75
    },
    lastUpdated: '2025-09-27T14:40:00Z'
  },
  {
    gameId: '2',
    fanSentiment: {
      bullish: 45,
      bearish: 38,
      neutral: 17,
      totalPosts: 1923
    },
    espnSentiment: {
      tone: 'neutral',
      overUnderLean: 'under',
      confidence: 55
    },
    lastUpdated: '2025-09-27T14:38:00Z'
  },
  {
    gameId: '3',
    fanSentiment: {
      bullish: 72,
      bearish: 18,
      neutral: 10,
      totalPosts: 3421
    },
    espnSentiment: {
      tone: 'positive',
      overUnderLean: 'over',
      confidence: 85
    },
    lastUpdated: '2025-09-27T14:50:00Z'
  },
  {
    gameId: '4',
    fanSentiment: {
      bullish: 35,
      bearish: 52,
      neutral: 13,
      totalPosts: 1654
    },
    espnSentiment: {
      tone: 'negative',
      overUnderLean: 'under',
      confidence: 70
    },
    lastUpdated: '2025-09-27T14:33:00Z'
  },
  {
    gameId: '5',
    fanSentiment: {
      bullish: 58,
      bearish: 28,
      neutral: 14,
      totalPosts: 2156
    },
    espnSentiment: {
      tone: 'positive',
      overUnderLean: 'over',
      confidence: 65
    },
    lastUpdated: '2025-09-27T14:42:00Z'
  }
];

export const mockRecommendations: BetRecommendation[] = [
  {
    gameId: '1',
    recommendation: 'over',
    confidence: 87,
    reasoning: 'Strong fan bullish sentiment (68%) aligns with ESPN positive coverage. High-scoring potential.',
    expectedValue: 0.12,
    fanSentimentWeight: 0.6,
    oddsWeight: 0.4
  },
  {
    gameId: '2',
    recommendation: 'under',
    confidence: 65,
    reasoning: 'Mixed fan sentiment but ESPN leans under. Defensive matchup expected.',
    expectedValue: 0.08,
    fanSentimentWeight: 0.5,
    oddsWeight: 0.5
  },
  {
    gameId: '3',
    recommendation: 'over',
    confidence: 92,
    reasoning: 'Extremely bullish fan sentiment (72%) + positive ESPN tone. Game trending high-scoring.',
    expectedValue: 0.18,
    fanSentimentWeight: 0.65,
    oddsWeight: 0.35
  },
  {
    gameId: '4',
    recommendation: 'under',
    confidence: 78,
    reasoning: 'Strong bearish fan sentiment (52%) supported by negative ESPN commentary.',
    expectedValue: 0.11,
    fanSentimentWeight: 0.55,
    oddsWeight: 0.45
  },
  {
    gameId: '5',
    recommendation: 'over',
    confidence: 71,
    reasoning: 'Moderate bullish fan sentiment with positive ESPN lean suggests scoring potential.',
    expectedValue: 0.09,
    fanSentimentWeight: 0.5,
    oddsWeight: 0.5
  }
];

// Social media post highlights for dashboard
export const mockSocialPosts = [
  {
    id: 'sp1',
    platform: 'twitter' as const,
    author: 'CFBFanatic',
    content: 'Alabama offense looking absolutely explosive in practice this week! Both QBs connecting on deep balls. This game is going OVER 🔥 #RollTide #CFB',
    sentiment: 'bullish' as const,
    engagement: 847,
    timestamp: '2025-09-27T10:30:00Z',
    gameId: '1'
  },
  {
    id: 'sp2',
    platform: 'reddit' as const,
    author: 'DawgNation88',
    content: 'Georgia\'s defense has been practicing red zone situations all week. Expecting them to limit Bama in crucial situations. Under might be the play here.',
    sentiment: 'bearish' as const,
    engagement: 423,
    timestamp: '2025-09-27T11:15:00Z',
    gameId: '1'
  },
  {
    id: 'sp3',
    platform: 'twitter' as const,
    author: 'BigTenInsider',
    content: 'Penn State vs Ohio State always delivers! Both teams averaging 35+ PPG this season. Weather looks perfect for an offensive showcase tonight! 🏈',
    sentiment: 'bullish' as const,
    engagement: 1205,
    timestamp: '2025-09-27T09:45:00Z',
    gameId: '2'
  },
  {
    id: 'sp4',
    platform: 'facebook' as const,
    author: 'SoonerNation',
    content: 'Red River Showdown! Texas and OU defenses have been the story this year. Expecting a classic defensive battle. Points will be hard to come by.',
    sentiment: 'bearish' as const,
    engagement: 356,
    timestamp: '2025-09-27T08:20:00Z',
    gameId: '4'
  },
  {
    id: 'sp5',
    platform: 'twitter' as const,
    author: 'ACC_Expert',
    content: 'Clemson is back! FSU struggling on defense lately. This could be a statement game for the Tigers offense. Over 48.5 looking good! 🐅',
    sentiment: 'bullish' as const,
    engagement: 692,
    timestamp: '2025-09-27T12:00:00Z',
    gameId: '3'
  }
];

// Mock sentiment chart data
export const mockSentimentChartData = [
  { time: '09:00', sentiment: 15, confidence: 75 },
  { time: '10:00', sentiment: 28, confidence: 82 },
  { time: '11:00', sentiment: 45, confidence: 88 },
  { time: '12:00', sentiment: 38, confidence: 79 },
  { time: '13:00', sentiment: 52, confidence: 91 },
  { time: '14:00', sentiment: 41, confidence: 85 }
];

// Mock odds chart data
export const mockOddsChartData = [
  { time: '09:00', overUnder: 52.5, overOdds: -110, underOdds: -110 },
  { time: '10:00', overUnder: 53.0, overOdds: -108, underOdds: -112 },
  { time: '11:00', overUnder: 53.5, overOdds: -105, underOdds: -115 },
  { time: '12:00', overUnder: 53.0, overOdds: -110, underOdds: -110 },
  { time: '13:00', overUnder: 54.0, overOdds: -115, underOdds: -105 },
  { time: '14:00', overUnder: 53.5, overOdds: -110, underOdds: -110 }
];

// Mock confidence/model accuracy data
export const mockConfidenceData = [
  { category: 'AI Model Confidence', confidence: 87, color: '#2196f3' },
  { category: 'Fan Sentiment Reliability', confidence: 72, color: '#ff9800' },
  { category: 'Historical Pattern Match', confidence: 94, color: '#4caf50' },
  { category: 'Weather Impact Factor', confidence: 65, color: '#9c27b0' },
  { category: 'Injury Report Influence', confidence: 78, color: '#f44336' }
];