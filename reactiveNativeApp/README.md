# Reactive Native App

A cross-platform React Native application built with Expo that runs on iOS, Android, and Web platforms.

## Features

- 📱 **Cross-Platform**: Single codebase for iOS, Android, and Web
- 🔧 **TypeScript**: Type-safe development with full TypeScript support
- 🎯 **Responsive Design**: Adapts beautifully to different screen sizes
- 🧭 **Navigation**: Smooth navigation with React Navigation
- 🌐 **Web Support**: Full web compatibility through Expo Web
- ⚡ **Fast Development**: Hot reloading and instant updates

## Tech Stack

- **React Native** - Cross-platform mobile framework
- **Expo SDK** - Development platform and tools
- **TypeScript** - Static type checking
- **React Navigation** - Navigation library
- **Metro** - JavaScript bundler

## Getting Started

### Prerequisites

- Node.js (version 14 or later)
- npm or yarn
- Expo CLI (optional, for additional commands)

### Installation

1. Clone the repository and navigate to the project directory
2. Install dependencies:
   ```bash
   npm install
   ```

### Running the App

#### Development Mode

Start the development server:
```bash
npm start
```

This will open Expo DevTools in your browser where you can:
- Press `i` to run on iOS simulator
- Press `a` to run on Android emulator
- Press `w` to run in web browser
- Scan QR code with Expo Go app on your mobile device

#### Platform-Specific Commands

Run on specific platforms:
```bash
npm run ios      # iOS simulator
npm run android  # Android emulator
npm run web      # Web browser
```

## Project Structure

```
├── src/
│   ├── screens/          # Screen components
│   │   ├── HomeScreen.tsx
│   │   └── AboutScreen.tsx
│   └── components/       # Reusable components
├── assets/              # Images, fonts, and other assets
├── App.tsx             # Main app component
├── app.json           # Expo configuration
├── package.json       # Dependencies and scripts
└── tsconfig.json      # TypeScript configuration
```

## Web Deployment

To build for web deployment:

1. Install the Expo CLI (if not already installed):
   ```bash
   npm install -g @expo/cli
   ```

2. Build the web version:
   ```bash
   expo build:web
   ```

3. The built files will be in the `web-build/` directory, ready for deployment to any static hosting service.

## Platform-Specific Features

The app includes platform detection and responsive design:

- **Mobile**: Optimized touch interactions and native navigation
- **Web**: Mouse interactions, keyboard navigation, and responsive layout
- **Cross-Platform**: Shared components with platform-specific styling

## Development Notes

- **Assets**: Replace placeholder images in the `assets/` folder with actual icons and splash screens
- **Styling**: Uses StyleSheet.create() for performance optimization
- **Navigation**: Stack navigation with customizable headers
- **TypeScript**: Full type safety with strict mode enabled

## Troubleshooting

### Common Issues

1. **Metro bundler issues**: Clear cache with `npx expo start --clear`
2. **Module resolution**: Ensure all dependencies are properly installed
3. **Web build issues**: Check that all assets exist and are properly referenced

### Platform-Specific Issues

- **iOS**: Ensure Xcode and iOS simulator are installed
- **Android**: Ensure Android Studio and emulator are set up
- **Web**: Modern browsers required (Chrome, Firefox, Safari, Edge)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Learn More

- [React Native Documentation](https://reactnative.dev/)
- [Expo Documentation](https://docs.expo.dev/)
- [React Navigation Documentation](https://reactnavigation.org/)
- [TypeScript Documentation](https://www.typescriptlang.org/)