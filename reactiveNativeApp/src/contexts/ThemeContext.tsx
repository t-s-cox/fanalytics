import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
  theme: Theme;
}

interface Theme {
  background: string;
  surface: string;
  card: string;
  text: string;
  textSecondary: string;
  primary: string;
  accent: string;
  border: string;
  success: string;
  warning: string;
  error: string;
  shadow: string;
}

const lightTheme: Theme = {
  background: '#f8f9fa',
  surface: '#ffffff',
  card: '#ffffff',
  text: '#202124',
  textSecondary: '#5f6368',
  primary: '#1a73e8',
  accent: '#ff6d00',
  border: '#dadce0',
  success: '#137333',
  warning: '#f29900',
  error: '#d93025',
  shadow: '#000000',
};

const darkTheme: Theme = {
  background: '#0f1419',
  surface: '#1a2332',
  card: '#232d3f',
  text: '#e8eaed',
  textSecondary: '#9aa0a6',
  primary: '#4285f4',
  accent: '#ff6d00',
  border: '#3c4043',
  success: '#34a853',
  warning: '#fbbc04',
  error: '#ea4335',
  shadow: '#000000',
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isDark, setIsDark] = useState(true);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  const theme = isDark ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme, theme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};