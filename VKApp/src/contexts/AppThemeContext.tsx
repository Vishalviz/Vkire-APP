import React, { createContext, useContext, useState, useMemo, ReactNode } from 'react';
import { LightColors, DarkColors } from '../constants/designSystem';
import { Theme as NavigationTheme, Theme } from '@react-navigation/native';
import { TextStyle } from 'react-native'; // Import TextStyle

export type ThemeType = 'light' | 'dark';

// Your full set of custom colors
type AppCustomColors = typeof LightColors; // Changed to type alias

// The value provided by your custom theme context
interface AppTheme {
  theme: ThemeType;
  colors: AppCustomColors; // Your custom colors (renamed for clarity)
  toggleTheme: () => void;
  navigationTheme: NavigationTheme; // The theme object compatible with React Navigation
}

const AppThemeContext = createContext<AppTheme | undefined>(undefined);

export const useAppContextTheme = () => {
  const context = useContext(AppThemeContext);
  if (context === undefined) {
    throw new Error('useAppContextTheme must be used within an AppThemeProvider');
  }
  return context;
};

export const AppThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<ThemeType>('light');
  const toggleTheme = () => setTheme((t) => (t === 'light' ? 'dark' : 'light'));

  const appCustomColors: AppCustomColors = useMemo(() => (theme === 'light' ? LightColors : DarkColors), [theme]);

  // Construct the React Navigation theme object
  const navigationTheme: NavigationTheme = useMemo(
    () => ({
      dark: theme === 'dark',
      colors: {
        primary: appCustomColors.primary,
        background: appCustomColors.background,
        card: appCustomColors.card,
        text: appCustomColors.text,
        border: appCustomColors.border,
        notification: appCustomColors.notification,
      },
      fonts: {
        regular: { fontFamily: 'System', fontWeight: '400' },
        medium: { fontFamily: 'System', fontWeight: '500' },
        semiBold: { fontFamily: 'System', fontWeight: '600' },
        bold: { fontFamily: 'System', fontWeight: '700' },
        heavy: { fontFamily: 'System', fontWeight: '800' }, // Added for React Navigation
      },
    }),
    [theme, appCustomColors]
  );
  
  return (
    <AppThemeContext.Provider value={{ theme, colors: appCustomColors, toggleTheme, navigationTheme }}>
      {children}
    </AppThemeContext.Provider>
  );
};
