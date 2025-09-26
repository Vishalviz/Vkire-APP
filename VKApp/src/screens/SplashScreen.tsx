import React, { useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  Image,
  Dimensions,
} from 'react-native';

interface SplashScreenProps {
  onAnimationComplete: () => void;
}

  // const { width, height } = Dimensions.get('window'); // TODO: Use dimensions for responsive design if needed

const SplashScreen: React.FC<SplashScreenProps> = ({ onAnimationComplete }) => {
  const cameraScale = useRef(new Animated.Value(0)).current;
  const cameraOpacity = useRef(new Animated.Value(0)).current;
  const flashOpacity = useRef(new Animated.Value(0)).current;
  const flashScale = useRef(new Animated.Value(0.5)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const textTranslateY = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    startAnimation();
  }, []);

  const startAnimation = () => {
    // Create a sequence of animations - 3.5 second total duration
    Animated.sequence([
      // 1. Show "Vkire" text first (0.8s)
      Animated.parallel([
        Animated.timing(textOpacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(textTranslateY, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
      
      // 2. Camera icon appears with scale animation (0.8s)
      Animated.parallel([
        Animated.timing(cameraScale, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(cameraOpacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
      
      // 3. Flash animation at camera position (0.6s)
      Animated.sequence([
        Animated.parallel([
          Animated.timing(flashOpacity, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(flashScale, {
            toValue: 1.8,
            duration: 300,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(flashOpacity, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(flashScale, {
            toValue: 0.5,
            duration: 300,
            useNativeDriver: true,
          }),
        ]),
      ]),
      
      // 4. Hold for a moment (0.5s)
      Animated.delay(500),
      
      // 5. Fade out everything (0.8s)
      Animated.parallel([
        Animated.timing(textOpacity, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(cameraOpacity, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      // Animation complete, transition to next screen
      onAnimationComplete();
    });
  };

  return (
    <View style={styles.container}>
      {/* Background gradient effect */}
      <View style={styles.backgroundGradient} />
      
      {/* Main content */}
      <View style={styles.content}>
        {/* App title */}
        <Animated.Text
          style={[
            styles.appTitle,
            {
              opacity: textOpacity,
              transform: [{ translateY: textTranslateY }],
            },
          ]}
        >
          Vkire
        </Animated.Text>
        
        {/* Camera icon with flash effect */}
        <View style={styles.cameraContainer}>
          <Animated.View
            style={[
              styles.cameraIcon,
              {
                opacity: cameraOpacity,
                transform: [{ scale: cameraScale }],
              },
            ]}
          >
            <Image 
              source={require('../../assets/icon.png')} 
              style={styles.cameraImage}
              resizeMode="contain"
            />
          </Animated.View>
          
          {/* Flash effect positioned at the camera flash point */}
          <Animated.View
            style={[
              styles.flashEffect,
              {
                opacity: flashOpacity,
                transform: [{ scale: flashScale }],
              },
            ]}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#f8f9fa',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  appTitle: {
    fontSize: 48,
    fontWeight: '800',
    color: '#007AFF',
    letterSpacing: 2,
    marginBottom: 40,
    textAlign: 'center',
  },
  cameraContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    width: 100,
    height: 100,
  },
  cameraIcon: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraImage: {
    width: 60,
    height: 60,
  },
  flashEffect: {
    position: 'absolute',
    top: 8, // Adjusted to align with the camera flash area
    left: 20, // Adjusted to center on the camera flash
    width: 12,
    height: 8,
    borderRadius: 6,
    backgroundColor: '#FFD700', // Golden flash color
    opacity: 0.9,
  },
});

export default SplashScreen;
