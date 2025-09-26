import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Keyboard,
  Platform,
  ScrollView,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../types';
import Logo from '../components/Logo';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../constants/designSystem';

const AuthScreen = () => {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [city, setCity] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  const { signIn, signUp } = useAuth();
  
  // Animation refs for smooth transitions
  const customerButtonScale = useRef(new Animated.Value(1)).current;
  const proButtonScale = useRef(new Animated.Value(1)).current;
  const signInButtonScale = useRef(new Animated.Value(1)).current;
  const formOpacity = useRef(new Animated.Value(0)).current;

  // Input refs for keyboard management
  const scrollViewRef = useRef<ScrollView>(null);
  const nameInputRef = useRef<TextInput>(null);
  const businessNameInputRef = useRef<TextInput>(null);
  const cityInputRef = useRef<TextInput>(null);
  const phoneInputRef = useRef<TextInput>(null);
  const emailInputRef = useRef<TextInput>(null);
  const passwordInputRef = useRef<TextInput>(null);

  // Keyboard listeners
  useEffect(() => {
    const keyboardWillShow = (event: any) => {
      setKeyboardHeight(event.endCoordinates.height);
    };

    const keyboardWillHide = () => {
      setKeyboardHeight(0);
    };

    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const showSubscription = Keyboard.addListener(showEvent, keyboardWillShow);
    const hideSubscription = Keyboard.addListener(hideEvent, keyboardWillHide);

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const validateEmail = (emailAddress: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(emailAddress);
  };

  const scrollToInput = (inputRef: React.RefObject<TextInput | null>) => {
    if (inputRef.current && scrollViewRef.current) {
      inputRef.current.measure((x, y, width, height, pageX, pageY) => {
        scrollViewRef.current?.scrollTo({
          y: pageY - 100,
          animated: true,
        });
      });
    }
  };

  const handleEmailChange = (text: string) => {
    setEmail(text);
    if (text && !validateEmail(text)) {
      setEmailError('Please enter a valid email address');
    } else {
      setEmailError('');
    }
  };

  const handleRoleSelection = (role: UserRole) => {
    // Animate the button press
    const buttonScale = role === 'customer' ? customerButtonScale : proButtonScale;
    
    Animated.sequence([
      Animated.timing(buttonScale, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(buttonScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setSelectedRole(role);
      // Animate form appearance
      Animated.timing(formOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    });
  };

  const handleSignInPress = () => {
    // Animate button press
    Animated.sequence([
      Animated.timing(signInButtonScale, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(signInButtonScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(() => {
      handleAuth();
    });
  };

  const handleAuth = async () => {
    // Dismiss keyboard
    Keyboard.dismiss();
    
    if (!selectedRole) {
      Alert.alert('Error', 'Please select your role');
      return;
    }

    if (!name || !email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address');
      return;
    }

    if (selectedRole === 'pro') {
      if (!name) {
        Alert.alert('Error', 'Please enter your name');
        return;
      }
      if (!businessName) {
        Alert.alert('Error', 'Please enter your business name');
        return;
      }
      if (!city) {
        Alert.alert('Error', 'Please enter your city');
        return;
      }
    }

    setLoading(true);
    try {
      if (selectedRole === 'pro') {
        await signUp(email, password, selectedRole, name, businessName, city, phone);
      } else {
        await signIn(email, password, name, selectedRole);
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Authentication failed';
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Background Gradient */}
      <View style={styles.backgroundGradient} />
      
      {/* Modern Header */}
      <View style={styles.header}>
        <Text style={styles.appTitle}>Vkire</Text>
        <Text style={styles.subtitle}>Where creativity meets opportunity</Text>
      </View>

      {/* Main Content - Centered with Keyboard Awareness */}
      <KeyboardAvoidingView 
        style={styles.mainContent}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView 
          ref={scrollViewRef}
          style={styles.scrollView}
          contentContainerStyle={[
            styles.scrollContainer,
            { paddingBottom: keyboardHeight > 0 ? keyboardHeight + 20 : 20 }
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          automaticallyAdjustKeyboardInsets={true}
          contentInsetAdjustmentBehavior="automatic"
          bounces={false}
        >
          {/* Modern Role Selection */}
          {!selectedRole ? (
            <View style={styles.roleSelectionContainer}>
              <Text style={styles.roleSelectionTitle}>Choose your path</Text>
              <Text style={styles.roleSelectionSubtitle}>How would you like to use Vkire?</Text>
              
              <View style={styles.roleButtons}>
                <Animated.View style={{ transform: [{ scale: customerButtonScale }] }}>
                  <TouchableOpacity
                    style={styles.roleButton}
                    onPress={() => handleRoleSelection('customer')}
                    activeOpacity={0.8}
                  >
                    <View style={styles.roleButtonIconContainer}>
                      <Ionicons name="search" size={32} color={Colors.primary} />
                    </View>
                    <View style={styles.roleButtonContent}>
                      <Text style={styles.roleButtonTitle}>Find Creatives</Text>
                      <Text style={styles.roleButtonDescription}>
                        Find creative professionals
                      </Text>
                    </View>
                    <View style={styles.roleButtonArrow}>
                      <Ionicons name="arrow-forward" size={20} color={Colors.gray400} />
                    </View>
                  </TouchableOpacity>
                </Animated.View>
                
                <Animated.View style={{ transform: [{ scale: proButtonScale }] }}>
                  <TouchableOpacity
                    style={styles.roleButton}
                    onPress={() => handleRoleSelection('pro')}
                    activeOpacity={0.8}
                  >
                    <View style={styles.roleButtonIconContainer}>
                      <Ionicons name="camera" size={32} color={Colors.primary} />
                    </View>
                    <View style={styles.roleButtonContent}>
                      <Text style={styles.roleButtonTitle}>Showcase Talent</Text>
                      <Text style={styles.roleButtonDescription}>
                        Showcase your work
                      </Text>
                    </View>
                    <View style={styles.roleButtonArrow}>
                      <Ionicons name="arrow-forward" size={20} color={Colors.gray400} />
                    </View>
                  </TouchableOpacity>
                </Animated.View>
              </View>
            </View>
          ) : (
            /* Modern Form Container */
            <Animated.View style={[styles.formContainer, { opacity: formOpacity }]}>
              <View style={styles.formHeader}>
                <TouchableOpacity
                  style={styles.backButton}
                  onPress={() => {
                    Animated.timing(formOpacity, {
                      toValue: 0,
                      duration: 200,
                      useNativeDriver: true,
                    }).start(() => {
                      setSelectedRole(null);
                    });
                  }}
                  activeOpacity={0.7}
                >
                  <Ionicons name="arrow-back" size={24} color={Colors.primary} />
                </TouchableOpacity>
                <View style={styles.formTitleContainer}>
                  <Text style={styles.formTitle}>
                    {selectedRole === 'pro' ? 'Join as Professional' : 'Find Creatives'}
                  </Text>
                  <Text style={styles.formSubtitle}>
                    {selectedRole === 'pro' 
                      ? 'Showcase your work'
                      : 'Find creative professionals'
                    }
                  </Text>
                </View>
              </View>

              <View style={styles.formContent}>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Full Name</Text>
                  <View style={styles.inputWrapper}>
                    <Ionicons name="person-outline" size={20} color={Colors.primary} style={styles.inputIcon} />
                    <TextInput
                      ref={nameInputRef}
                      style={styles.input}
                      placeholder="Enter your full name"
                      placeholderTextColor={Colors.gray500}
                      value={name}
                      onChangeText={setName}
                      autoCapitalize="words"
                      onFocus={() => scrollToInput(nameInputRef)}
                      onSubmitEditing={() => selectedRole === 'pro' ? businessNameInputRef.current?.focus() : emailInputRef.current?.focus()}
                    />
                  </View>
                </View>

                {selectedRole === 'pro' && (
                  <>
                    <View style={styles.inputGroup}>
                      <Text style={styles.inputLabel}>Business Name</Text>
                      <View style={styles.inputWrapper}>
                        <Ionicons name="business-outline" size={20} color={Colors.primary} style={styles.inputIcon} />
                        <TextInput
                          ref={businessNameInputRef}
                          style={styles.input}
                          placeholder="Enter your business name"
                          placeholderTextColor={Colors.gray500}
                          value={businessName}
                          onChangeText={setBusinessName}
                          autoCapitalize="words"
                          onFocus={() => scrollToInput(businessNameInputRef)}
                          onSubmitEditing={() => cityInputRef.current?.focus()}
                        />
                      </View>
                    </View>

                    <View style={styles.inputGroup}>
                      <Text style={styles.inputLabel}>City</Text>
                      <View style={styles.inputWrapper}>
                        <Ionicons name="location-outline" size={20} color={Colors.primary} style={styles.inputIcon} />
                        <TextInput
                          ref={cityInputRef}
                          style={styles.input}
                          placeholder="Enter your city"
                          placeholderTextColor={Colors.gray500}
                          value={city}
                          onChangeText={setCity}
                          autoCapitalize="words"
                          onFocus={() => scrollToInput(cityInputRef)}
                          onSubmitEditing={() => phoneInputRef.current?.focus()}
                        />
                      </View>
                    </View>

                    <View style={styles.inputGroup}>
                      <Text style={styles.inputLabel}>Phone (Optional)</Text>
                      <View style={styles.inputWrapper}>
                        <Ionicons name="call-outline" size={20} color={Colors.primary} style={styles.inputIcon} />
                        <TextInput
                          ref={phoneInputRef}
                          style={styles.input}
                          placeholder="Enter your phone number"
                          placeholderTextColor={Colors.gray500}
                          value={phone}
                          onChangeText={setPhone}
                          keyboardType="phone-pad"
                          onFocus={() => scrollToInput(phoneInputRef)}
                          onSubmitEditing={() => emailInputRef.current?.focus()}
                        />
                      </View>
                    </View>
                  </>
                )}

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Email Address</Text>
                  <View style={[styles.inputWrapper, emailError && styles.inputWrapperError]}>
                    <Ionicons name="mail-outline" size={20} color={emailError ? Colors.error : Colors.primary} style={styles.inputIcon} />
                    <TextInput
                      ref={emailInputRef}
                      style={styles.input}
                      placeholder="Enter your email"
                      placeholderTextColor={Colors.gray500}
                      value={email}
                      onChangeText={handleEmailChange}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoCorrect={false}
                      onFocus={() => scrollToInput(emailInputRef)}
                      onSubmitEditing={() => passwordInputRef.current?.focus()}
                    />
                  </View>
                  {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Password</Text>
                  <View style={styles.inputWrapper}>
                    <Ionicons name="lock-closed-outline" size={20} color={Colors.primary} style={styles.inputIcon} />
                    <TextInput
                      ref={passwordInputRef}
                      style={styles.input}
                      placeholder="Enter your password"
                      placeholderTextColor={Colors.gray500}
                      value={password}
                      onChangeText={setPassword}
                      secureTextEntry={!showPassword}
                      autoCapitalize="none"
                      onFocus={() => scrollToInput(passwordInputRef)}
                      onSubmitEditing={handleAuth}
                    />
                    <TouchableOpacity
                      style={styles.passwordToggle}
                      onPress={() => setShowPassword(!showPassword)}
                      activeOpacity={0.7}
                    >
                      <Ionicons 
                        name={showPassword ? "eye-off-outline" : "eye-outline"} 
                        size={20} 
                        color={Colors.gray500} 
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              <Animated.View style={{ transform: [{ scale: signInButtonScale }] }}>
                <TouchableOpacity
                  style={[styles.primaryButton, loading && styles.primaryButtonDisabled]}
                  onPress={handleSignInPress}
                  disabled={loading}
                  activeOpacity={0.8}
                >
                  <Text style={styles.primaryButtonText}>
                    {loading ? 'Loading...' : selectedRole === 'pro' ? 'Create Account' : 'Sign In'}
                  </Text>
                  <Ionicons 
                    name={selectedRole === 'pro' ? "arrow-forward" : "log-in-outline"} 
                    size={20} 
                    color="#fff" 
                    style={styles.buttonIcon}
                  />
                </TouchableOpacity>
              </Animated.View>
            </Animated.View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#FAFAFA',
  },
  header: {
    alignItems: 'center',
    paddingTop: Spacing['2xl'],
    paddingBottom: Spacing['2xl'],
    paddingHorizontal: Spacing['2xl'],
    backgroundColor: 'transparent',
  },
  appTitle: {
    fontSize: Typography.fontSize['4xl'],
    fontWeight: Typography.fontWeight.extraBold,
    color: Colors.primary,
    letterSpacing: 0.5,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.gray600,
    textAlign: 'center',
    lineHeight: Typography.lineHeight.relaxed * Typography.fontSize.lg,
    marginBottom: 0,
  },
  mainContent: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  roleSelectionContainer: {
    backgroundColor: 'transparent',
    padding: 0,
    maxWidth: 400,
    alignSelf: 'center',
    width: '100%',
  },
  roleSelectionTitle: {
    fontSize: Typography.fontSize['2xl'],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.gray900,
    textAlign: 'center',
    marginBottom: Spacing.xs,
    letterSpacing: 0.3,
  },
  roleSelectionSubtitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.regular,
    color: Colors.gray600,
    textAlign: 'center',
    marginBottom: Spacing['2xl'],
    lineHeight: Typography.lineHeight.relaxed * Typography.fontSize.base,
  },
  roleButtons: {
    gap: Spacing.md,
  },
  roleButton: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 0.5,
    borderColor: Colors.gray200,
    minHeight: 88,
  },
  roleButtonIconContainer: {
    width: 52,
    height: 52,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.primary + '12',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  roleButtonContent: {
    flex: 1,
  },
  roleButtonTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semiBold,
    color: Colors.gray900,
    marginBottom: 4,
  },
  roleButtonDescription: {
    fontSize: Typography.fontSize.sm,
    color: Colors.gray600,
    lineHeight: Typography.lineHeight.relaxed * Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.regular,
  },
  roleButtonArrow: {
    marginLeft: Spacing.sm,
    opacity: 0.6,
  },
  formContainer: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius['2xl'],
    padding: Spacing['2xl'],
    ...Shadows.lg,
    maxWidth: 420,
    alignSelf: 'center',
    width: '100%',
    borderWidth: 0.5,
    borderColor: Colors.gray200,
    marginTop: Spacing.lg,
  },
  formContent: {
    flex: 1,
    paddingTop: Spacing.md,
  },
  formHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.xl,
  },
  backButton: {
    marginRight: Spacing.lg,
    padding: Spacing.sm,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.gray50,
  },
  formTitleContainer: {
    flex: 1,
  },
  formTitle: {
    fontSize: Typography.fontSize['2xl'],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.gray900,
    marginBottom: Spacing.xs,
    letterSpacing: 0.3,
  },
  formSubtitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.regular,
    color: Colors.gray600,
    lineHeight: Typography.lineHeight.relaxed * Typography.fontSize.base,
  },
  inputGroup: {
    marginBottom: Spacing.lg,
  },
  inputLabel: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.gray700,
    marginBottom: Spacing.sm,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.gray200,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    minHeight: 48,
    ...Shadows.sm,
  },
  inputWrapperError: {
    borderColor: Colors.error,
    backgroundColor: Colors.error + '08',
  },
  inputIcon: {
    marginRight: Spacing.md,
  },
  input: {
    flex: 1,
    paddingVertical: 0,
    fontSize: Typography.fontSize.base,
    color: Colors.gray900,
    fontWeight: Typography.fontWeight.medium,
  },
  passwordToggle: {
    padding: Spacing.sm,
    marginLeft: Spacing.sm,
  },
  errorText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.error,
    marginTop: Spacing.xs,
    fontWeight: Typography.fontWeight.medium,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    padding: Spacing.lg,
    borderRadius: BorderRadius.xl,
    marginTop: Spacing.xl,
    minHeight: 56,
    ...Shadows.lg,
  },
  primaryButtonDisabled: {
    backgroundColor: Colors.gray400,
    ...Shadows.sm,
  },
  primaryButtonText: {
    color: Colors.white,
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semiBold,
    marginRight: Spacing.sm,
  },
  buttonIcon: {
    marginLeft: Spacing.xs,
  },
});

export default AuthScreen;