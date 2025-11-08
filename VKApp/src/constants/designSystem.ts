// Vkire Design System
// Based on modern mobile UI/UX principles for social media applications

// Light theme colors - defined as plain object and exported immediately
export const LightColors = {
  // Primary Brand Colors
  primary: '#007AFF',
  primaryDark: '#0056CC',
  primaryLight: '#4DA6FF',
  
  // Secondary Colors
  secondary: '#34C759',
  accent: '#FF9500',
  
  // Neutral Colors
  black: '#1A1A1A',
  gray900: '#2C2C2E',
  gray800: '#3A3A3C',
  gray700: '#48484A',
  gray600: '#636366',
  gray500: '#8E8E93',
  gray400: '#AEAEB2',
  gray300: '#C7C7CC',
  gray200: '#D1D1D6',
  gray100: '#F2F2F7',
  gray50: '#F8F9FA',
  white: '#FFFFFF',
  
  // Status Colors
  success: '#34C759',
  warning: '#FF9500',
  error: '#FF3B30',
  info: '#007AFF',
  
  // Social Media Colors
  like: '#FF3B30',
  likeActive: '#FF3B30',
  comment: '#8E8E93',
  share: '#8E8E93',
  
  // Background Colors
  background: '#F8F9FA',
  surface: '#FFFFFF',
  surfaceSecondary: '#F2F2F7',
  card: '#FFFFFF', // Added for React Navigation
  border: '#D1D1D6', // Added for React Navigation
  notification: '#FF3B30', // Added for React Navigation
  text: '#1A1A1A', // Added for text color
};

// Dark theme colors - defined as plain object (no spread operator) and exported immediately
export const DarkColors = {
  // Primary Brand Colors
  primary: '#007AFF',
  primaryDark: '#0056CC',
  primaryLight: '#4DA6FF',
  
  // Secondary Colors
  secondary: '#34C759',
  accent: '#FF9500',
  
  // Neutral Colors (dark theme variants)
  black: '#FFFFFF',
  gray900: '#FAFAFC',
  gray800: '#F2F2F7',
  gray700: '#E0E1EE',
  gray600: '#BFC0CF',
  gray500: '#9697A6',
  gray400: '#7C7E8C',
  gray300: '#5A5B6A',
  gray200: '#474658',
  gray100: '#23232E',
  gray50: '#23232E',
  white: '#222329',
  
  // Status Colors
  success: '#34C759',
  warning: '#FF9500',
  error: '#FF3B30',
  info: '#007AFF',
  
  // Social Media Colors
  like: '#FF3B30',
  likeActive: '#FF3B30',
  comment: '#9697A6',
  share: '#9697A6',
  
  // Background Colors (dark theme variants)
  background: '#1A1A1A',
  surface: '#222329',
  surfaceSecondary: '#292A30',
  card: '#222329', // Added for React Navigation
  border: '#474658', // Added for React Navigation
  notification: '#FF3B30', // Added for React Navigation
  text: '#FFFFFF', // Added for text color
};

export const Typography = {
  // Font Families
  fontFamily: {
    regular: 'System',
    medium: 'System',
    semiBold: 'System',
    bold: 'System',
  },
  
  // Font Sizes
  fontSize: {
    xs: 10,
    sm: 12,
    base: 14,
    md: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 28,
    '4xl': 32,
  },
  
  // Font Weights
  fontWeight: {
    regular: '400' as const,
    medium: '500' as const,
    semiBold: '600' as const,
    bold: '700' as const,
    extraBold: '800' as const,
  },
  
  // Line Heights
  lineHeight: {
    tight: 1.2,
    normal: 1.4,
    relaxed: 1.6,
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 40,
  '5xl': 48,
  '6xl': 64,
};

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 28,
  full: 9999,
};

export const Shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
};

export const Animation = {
  duration: {
    fast: 150,
    normal: 200,
    slow: 300,
  },
  easing: {
    easeInOut: 'ease-in-out',
    easeOut: 'ease-out',
    easeIn: 'ease-in',
  },
};

// Component-specific styles
// Using ALL direct values to avoid ANY circular dependency issues during module evaluation
export const ComponentStyles = {
  // Post Card Styles
  postCard: {
    backgroundColor: '#FFFFFF', // Use colors.surface dynamically
    borderRadius: 20, // BorderRadius.xl
    marginHorizontal: 16, // Spacing.lg
    marginVertical: 8, // Spacing.sm
    shadowColor: '#000', // Shadows.md
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  
  // Button Styles
  button: {
    primary: {
      backgroundColor: '#007AFF', // Use colors.primary dynamically
      borderRadius: 20, // BorderRadius.xl
      paddingVertical: 16, // Spacing.lg
      paddingHorizontal: 20, // Spacing.xl
    },
    secondary: {
      backgroundColor: '#FFFFFF', // Use colors.surface dynamically
      borderWidth: 1,
      borderColor: '#C7C7CC', // Use colors.gray300 dynamically
      borderRadius: 20, // BorderRadius.xl
      paddingVertical: 16, // Spacing.lg
      paddingHorizontal: 20, // Spacing.xl
    },
    rounded: {
      backgroundColor: '#007AFF', // Use colors.primary dynamically
      borderRadius: 9999, // BorderRadius.full
      paddingVertical: 12, // Spacing.md
      paddingHorizontal: 16, // Spacing.lg
    },
  },
  
  // Navigation Styles
  tabBar: {
    backgroundColor: '#FFFFFF', // Use colors.surface dynamically
    borderTopWidth: 1,
    borderTopColor: '#D1D1D6', // Use colors.gray200 dynamically
    paddingTop: 8, // Spacing.sm
    paddingBottom: 8, // Spacing.sm
    height: 80,
  },
  
  tabBarIcon: {
    size: 24,
    activeColor: '#007AFF', // Use colors.primary dynamically
    inactiveColor: '#8E8E93', // Use colors.gray500 dynamically
  },
  
  tabBarLabel: {
    fontSize: 10, // Typography.fontSize.xs
    fontWeight: '500', // Typography.fontWeight.medium
    marginTop: 4, // Spacing.xs
  },
};

// Default export removed to avoid circular dependency issues
// Use named imports instead: import { Typography } from '../constants/designSystem'