# College Football Sports Betting Dashboard

This is a React Native web app built with Expo that provides AI-powered over/under betting recommendations for college football games using fan sentiment analysis.

## Project Overview
**Sports Betting Dashboard** - Makes over/under bets using fan sentiment as a major factor by scraping online posts from fans and comparing them to live betting odds and ESPN commentary sentiment.

## Key Features
- **Fan Sentiment Analysis** - Scrapes Twitter, Reddit, Facebook for fan opinions
- **ESPN Commentary Analysis** - Analyzes ESPN commentary tone and betting implications  
- **AI Betting Recommendations** - Combines sentiment data with odds for recommendations
- **Live Odds Integration** - Displays current sportsbook over/under lines
- **Mobile-Friendly Web Interface** - Responsive design for all devices

## Tech Stack
- React Native with Expo SDK 51
- TypeScript configuration
- React Navigation for routing
- Mobile-optimized web deployment
- Real-time data updates (mock data currently)

## Project Structure
- `/src/screens` - Main app screens (Dashboard, GameDetail, Sentiment)
- `/src/components` - Reusable UI components (GameCard, StatsCard)
- `/src/types` - TypeScript interfaces for betting data
- `/src/data` - Mock data for development

## Development Commands
- `npm start` - Start web development server (default)
- `npm run web` - Start web development server  
- `npm run start-all` - Start all platforms (mobile + web)
- `npm run web-build` - Build for production deployment
- `npm run web-serve` - Serve built files locally

## Setup Instructions
1. Install dependencies: `npm install`
2. Start web development server: `npm start`
3. Open browser to `http://localhost:8081`

## Project Status  
✅ Frontend dashboard completed
✅ Mock data integration
✅ Mobile-responsive web interface
✅ Fan sentiment visualization
✅ Betting recommendation engine UI
🔄 Backend analytics integration (pending team implementation)