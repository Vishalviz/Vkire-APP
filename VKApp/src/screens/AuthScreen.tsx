import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../types';
import Logo from '../components/Logo';

const AuthScreen = () => {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState('');

  const { signIn, signUp } = useAuth();

  const validateEmail = (emailAddress: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(emailAddress);
  };

  const handleEmailChange = (text: string) => {
    setEmail(text);
    if (text && !validateEmail(text)) {
      setEmailError('Please enter a valid email address');
    } else {
      setEmailError('');
    }
  };

  const handleAuth = async () => {
    if (!selectedRole) {
      Alert.alert('Error', 'Please select your role');
      return;
    }

    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address');
      return;
    }

    if (selectedRole === 'pro' && !name) {
      Alert.alert('Error', 'Please enter your name');
      return;
    }

    setLoading(true);
    try {
      if (selectedRole === 'pro') {
        await signUp(email, password, selectedRole);
      } else {
        await signIn(email, password);
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
      {/* Header with App Title - Fixed at top */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <View style={styles.logoWrapper}>
            <Logo size="large" />
          </View>
          <Text style={styles.appTitle}>Vkire</Text>
        </View>
        <Text style={styles.subtitle}>Connect and create</Text>
      </View>

      {/* Main Content - Centered with Keyboard Awareness */}
      <KeyboardAwareScrollView 
        style={styles.mainContent}
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        enableOnAndroid={true}
        extraScrollHeight={20}
        keyboardShouldPersistTaps="handled"
      >
          {/* Role Selection */}
          {!selectedRole ? (
            <View style={styles.roleSelectionContainer}>
              <Text style={styles.roleSelectionTitle}>Join as a...</Text>
              <View style={styles.roleButtons}>
                <TouchableOpacity
                  style={styles.roleButton}
                  onPress={() => setSelectedRole('customer')}
                >
                  <View style={styles.roleButtonContent}>
                    <Ionicons name="person-outline" size={28} color="#007AFF" />
                    <Text style={styles.roleButtonTitle}>Hire a creative</Text>
                    <Text style={styles.roleButtonDescription}>
                      Find photographers, videographers & editors
                    </Text>
                  </View>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={styles.roleButton}
                  onPress={() => setSelectedRole('pro')}
                >
                  <View style={styles.roleButtonContent}>
                    <Ionicons name="camera-outline" size={28} color="#007AFF" />
                    <Text style={styles.roleButtonTitle}>Offer your services</Text>
                    <Text style={styles.roleButtonDescription}>
                      Get clients & showcase your portfolio
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            /* Form Container */
            <View style={styles.formContainer}>
              <View style={styles.formHeader}>
                <TouchableOpacity
                  style={styles.backButton}
                  onPress={() => setSelectedRole(null)}
                >
                  <Ionicons name="arrow-back" size={24} color="#007AFF" />
                </TouchableOpacity>
                <Text style={styles.formTitle}>
                  {selectedRole === 'pro' ? 'Join as Professional' : 'Sign In as Customer'}
                </Text>
              </View>

              {selectedRole === 'pro' && (
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Full Name</Text>
                  <View style={styles.inputWrapper}>
                    <Ionicons name="person-outline" size={20} color="#666" style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="Enter your full name"
                      value={name}
                      onChangeText={setName}
                      autoCapitalize="words"
                      placeholderTextColor="#999"
                    />
                  </View>
                </View>
              )}

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Email Address</Text>
                <View style={[styles.inputWrapper, emailError && styles.inputWrapperError]}>
                  <Ionicons name="mail-outline" size={20} color={emailError ? "#FF3B30" : "#666"} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your email"
                    value={email}
                    onChangeText={handleEmailChange}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    placeholderTextColor="#999"
                  />
                </View>
                {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Password</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    placeholderTextColor="#999"
                  />
                  <TouchableOpacity
                    style={styles.passwordToggle}
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    <Ionicons 
                      name={showPassword ? "eye-off-outline" : "eye-outline"} 
                      size={20} 
                      color="#666" 
                    />
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity
                style={[styles.primaryButton, loading && styles.primaryButtonDisabled]}
                onPress={handleAuth}
                disabled={loading}
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
            </View>
          )}
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 24,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e5e9',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  logoWrapper: {
    marginRight: 12,
  },
  appTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#007AFF',
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  mainContent: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  roleSelectionContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
    maxWidth: 380,
    alignSelf: 'center',
    width: '100%',
  },
  roleSelectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333',
    textAlign: 'center',
    marginBottom: 32,
    letterSpacing: 0.5,
  },
  roleButtons: {
    gap: 20,
  },
  roleButton: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e1e5e9',
    padding: 28,
    minHeight: 120,
  },
  roleButtonContent: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  roleButtonTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  roleButtonDescription: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
    fontWeight: '400',
  },
  formContainer: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 8,
    maxWidth: 400,
    alignSelf: 'center',
    width: '100%',
  },
  formHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  backButton: {
    marginRight: 16,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e1e5e9',
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  inputWrapperError: {
    borderColor: '#FF3B30',
    backgroundColor: '#FFF5F5',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 16,
    color: '#333',
  },
  passwordToggle: {
    padding: 8,
  },
  errorText: {
    fontSize: 12,
    color: '#FF3B30',
    marginTop: 4,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007AFF',
    padding: 18,
    borderRadius: 12,
    marginTop: 8,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  primaryButtonDisabled: {
    backgroundColor: '#ccc',
    shadowOpacity: 0,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  buttonIcon: {
    marginLeft: 4,
  },
});

export default AuthScreen;