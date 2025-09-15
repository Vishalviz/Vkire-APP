import React from 'react';
import { View, Image, StyleSheet, ViewStyle } from 'react-native';
import { Colors, Shadows } from '../constants/designSystem';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  showBackground?: boolean;
  style?: ViewStyle;
}

const Logo: React.FC<LogoProps> = ({ 
  size = 'medium', 
  showBackground = true, 
  style 
}) => {
  const getSize = () => {
    switch (size) {
      case 'small':
        return { width: 24, height: 24 };
      case 'medium':
        return { width: 32, height: 32 };
      case 'large':
        return { width: 48, height: 48 };
      default:
        return { width: 32, height: 32 };
    }
  };

  const getBackgroundSize = () => {
    switch (size) {
      case 'small':
        return { width: 32, height: 32, borderRadius: 16 };
      case 'medium':
        return { width: 40, height: 40, borderRadius: 20 };
      case 'large':
        return { width: 56, height: 56, borderRadius: 28 };
      default:
        return { width: 40, height: 40, borderRadius: 20 };
    }
  };

  const logoSize = getSize();
  const backgroundSize = getBackgroundSize();

  if (showBackground) {
    return (
      <View style={[styles.logoContainer, backgroundSize, style]}>
        <Image 
          source={require('../../assets/icon.png')} 
          style={[styles.logoImage, logoSize]}
          resizeMode="contain"
        />
      </View>
    );
  }

  return (
    <Image 
      source={require('../../assets/icon.png')} 
      style={[styles.logoImage, logoSize, style]}
      resizeMode="contain"
    />
  );
};

const styles = StyleSheet.create({
  logoContainer: {
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.sm,
  },
  logoImage: {
    // Image will be sized by the width/height props
  },
});

export default Logo;
