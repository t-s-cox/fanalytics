import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import DashboardScreen from './src/screens/DashboardScreen';
import GameDetailScreen from './src/screens/GameDetailScreen';
import SentimentScreen from './src/screens/SentimentScreen';
import { StatusBar } from 'expo-status-bar';
import { Game } from './src/types';
import { ThemeProvider } from './src/context/ThemeContext';

export type RootStackParamList = {
  Dashboard: undefined;
  GameDetail: { game: Game };
  Sentiment: { gameId: string };
};

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <ThemeProvider>
      <NavigationContainer>
      <StatusBar style="auto" />
      <Stack.Navigator 
        initialRouteName="Dashboard"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen 
          name="Dashboard" 
          component={DashboardScreen} 
          options={{ title: 'CFB Betting Dashboard' }}
        />
        <Stack.Screen 
          name="GameDetail" 
          component={GameDetailScreen} 
          options={{ title: 'Game Analysis' }}
        />
        <Stack.Screen 
          name="Sentiment" 
          component={SentimentScreen} 
          options={{ title: 'Fan Sentiment' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
    </ThemeProvider>
  );
}