export interface User {
  id: string;
  name: string;
  email: string;
}

export interface AppState {
  isLoading: boolean;
  user: User | null;
}

export interface Game {
  id: string;
  homeTeam: string;
  awayTeam: string;
  gameTime: string;
  week: number;
  season: string;
  homeScore?: number;
  awayScore?: number;
  status: 'upcoming' | 'live' | 'completed';
}

export interface BettingOdds {
  gameId: string;
  overUnder: number;
  overOdds: number;
  underOdds: number;
  sportsbook: string;
  lastUpdated: string;
}

export interface SentimentData {
  gameId: string;
  fanSentiment: {
    bullish: number; // percentage expecting over
    bearish: number; // percentage expecting under
    neutral: number;
    totalPosts: number;
  };
  espnSentiment?: {
    tone: 'positive' | 'negative' | 'neutral';
    overUnderLean: 'over' | 'under' | 'neutral';
    confidence: number;
  };
  lastUpdated: string;
}

export interface BetRecommendation {
  gameId: string;
  recommendation: 'over' | 'under' | 'no-bet';
  confidence: number;
  reasoning: string;
  expectedValue: number;
  fanSentimentWeight: number;
  oddsWeight: number;
}