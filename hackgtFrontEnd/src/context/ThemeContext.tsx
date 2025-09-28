import React, { createContext, useContext, useState, useEffect } from 'react';
import { Appearance } from 'react-native';

export interface Theme {
  isDark: boolean;
  colors: {
    background: string;
    surface: string;
    primary: string;
    secondary: string;
    accent: string;
    text: string;
    textSecondary: string;
    textTertiary: string;
    border: string;
    success: string;
    error: string;
    warning: string;
    info: string;
    card: string;
    header: string;
  };
}

const lightTheme: Theme = {
  isDark: false,
  colors: {
    background: '#f5f5f5',
    surface: '#ffffff',
    primary: '#1a237e',
    secondary: '#3f51b5',
    accent: '#2196f3',
    text: '#333333',
    textSecondary: '#666666',
    textTertiary: '#999999',
    border: '#e0e0e0',
    success: '#4caf50',
    error: '#f44336',
    warning: '#ff9800',
    info: '#2196f3',
    card: '#ffffff',
    header: '#1a237e',
  },
};

const darkTheme: Theme = {
  isDark: true,
  colors: {
    background: '#121212',
    surface: '#1e1e1e',
    primary: '#3f51b5',
    secondary: '#5c6bc0',
    accent: '#64b5f6',
    text: '#ffffff',
    textSecondary: '#b3b3b3',
    textTertiary: '#808080',
    border: '#404040',
    success: '#66bb6a',
    error: '#ef5350',
    warning: '#ffa726',
    info: '#42a5f5',
    card: '#2d2d2d',
    header: '#1a1a1a',
  },
};

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [isDark, setIsDark] = useState(true); // Default to dark mode

  useEffect(() => {
    // Keep dark mode as default, but allow manual toggle
    // Remove automatic system preference detection to maintain user's choice
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  const theme = isDark ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
};