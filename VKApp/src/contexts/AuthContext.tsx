import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, AuthContextType, UserRole, ProProfile } from '../types';
import logger from '../utils/logger';
import { MockAuthService } from '../services/auth/MockAuthService';
import { IAuthService } from '../services/auth/types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

// Initialize the service (in a real app, this might be dependency injected or configured based on environment)
const authService: IAuthService = new MockAuthService();

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedUser = await authService.initialize();
        if (storedUser) {
          setUser(storedUser);
        }
      } catch (error) {
        logger.error('Error initializing auth:', error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const signIn = async (email: string, password: string, name?: string, role?: UserRole) => {
    setLoading(true);
    try {
      const loggedInUser = await authService.signIn(email, password, name, role);
      setUser(loggedInUser);
    } catch (error) {
      logger.error('Sign in error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, role: UserRole, name?: string, businessName?: string, city?: string, phone?: string) => {
    setLoading(true);
    try {
      const newUser = await authService.signUp(email, password, role, name, businessName, city, phone);
      setUser(newUser);
    } catch (error) {
      logger.error('Sign up error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      await authService.signOut();
      setUser(null);
    } catch (error) {
      logger.error('Sign out error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!user) throw new Error('No user logged in');

    try {
      const updatedUser = await authService.updateProfile(user.id, updates);
      setUser(updatedUser);
      console.log('Profile updated successfully:', updatedUser);
    } catch (error) {
      logger.error('Auth error:', error);
      throw error;
    }
  };

  const markProfileCompleted = async () => {
    if (!user) throw new Error('No user logged in');

    try {
      const updatedUser = await authService.markProfileCompleted(user.id);
      setUser(updatedUser);
      console.log('Profile marked as completed');
    } catch (error) {
      logger.error('Error marking profile as completed:', error);
      throw error;
    }
  };

  const createProfessionalProfile = async (profile: Partial<ProProfile>) => {
    if (!user) throw new Error('No user logged in');

    try {
      await authService.createProfessionalProfile(user.id, profile);
    } catch (error) {
      logger.error('Error creating professional profile:', error);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    updateProfile,
    markProfileCompleted,
    createProfessionalProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};