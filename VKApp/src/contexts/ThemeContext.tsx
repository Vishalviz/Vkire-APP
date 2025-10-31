import React, { createContext, useContext, useState, useMemo, ReactNode } from 'react';
import { Colors as LightColors } from '../constants/designSystem';

const DarkColors = {
  ...LightColors,
  background: '#1A1A1A',
  surface: '#222329',
  surfaceSecondary: '#292A30',
  gray50: '#23232E',
  gray100: '#23232E',
  gray200: '#474658',
  gray300: '#5A5B6A',
  gray400: '#7C7E8C',
  gray500: '#9697A6',
  gray600: '#BFC0CF',
  gray700: '#E0E1EE',
  gray800: '#F2F2F7',
  gray900: '#FAFAFC',
  white: '#222329',
  black: '#FFFFFF',
};

export type ThemeType = 'light' | 'dark';

interface ThemeContextValue {
  theme: ThemeType;
  colors: typeof LightColors;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: 'light',
  colors: LightColors,
  toggleTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<ThemeType>('light');
  const toggleTheme = () => setTheme((t) => (t === 'light' ? 'dark' : 'light'));
  const colors = useMemo(() => (theme === 'light' ? LightColors : DarkColors), [theme]);
  
  return (
    <ThemeContext.Provider value={{ theme, colors, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
