import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { ThemeProvider } from './src/contexts/ThemeContext';
import DrawerContent from './src/components/DrawerContent';

// Import screens
import DashboardScreen from './src/screens/DashboardScreen';
import LiveGamesScreen from './src/screens/LiveGamesScreen';
import GameDetailsScreen from './src/screens/GameDetailsScreen';
import SentimentAnalysisScreen from './src/screens/SentimentAnalysisScreen';
import PredictionsScreen from './src/screens/PredictionsScreen';
import HighlightsScreen from './src/screens/HighlightsScreen';
import GameSelectionScreen from './src/screens/GameSelectionScreen';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

function DrawerNavigator() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <DrawerContent {...props} currentRoute={props.state.routeNames[props.state.index]} />}
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          width: 280,
        },
      }}
    >
      <Drawer.Screen name="GameSelection" component={GameSelectionScreen} />
      <Drawer.Screen name="Dashboard" component={DashboardScreen} />
      <Drawer.Screen name="LiveGames" component={LiveGamesScreen} />
      <Drawer.Screen name="SentimentAnalysis" component={SentimentAnalysisScreen} />
      <Drawer.Screen name="Predictions" component={PredictionsScreen} />
      <Drawer.Screen name="Highlights" component={HighlightsScreen} />
      <Drawer.Screen 
        name="GameDetails" 
        component={GameDetailsScreen}
        options={{
          drawerItemStyle: { display: 'none' }
        }}
      />
    </Drawer.Navigator>
  );
}

function RootNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="DrawerNavigator" component={DrawerNavigator} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

