# HackGT Frontend

A React Native app built with Expo and TypeScript.

## Features

- React Native with Expo SDK 49
- TypeScript support
- React Navigation for routing
- Reusable components
- Type definitions

## Getting Started

### Prerequisites

- Node.js (v16 or later)
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)
- Expo Go app on your mobile device

### Installation

1. Install dependencies:
   ```
   npm install
   ```

2. Start the development server:
   ```
   npm start
   ```

3. Use the Expo Go app to scan the QR code and run the app on your device

### Available Scripts

- `npm start` - Start the Expo development server
- `npm run android` - Run on Android device/emulator  
- `npm run ios` - Run on iOS device/simulator
- `npm run web` - Run on web browser

## Project Structure

```
src/
├── components/     # Reusable UI components
├── screens/        # Screen components
├── types/          # TypeScript type definitions
└── navigation/     # Navigation configuration
```

## Development

The app uses React Navigation for navigation between screens. The main entry point is `App.tsx` which sets up the navigation container and stack navigator.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request