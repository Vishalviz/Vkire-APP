import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../services/supabase';
import { User, AuthContextType, UserRole } from '../types';
import logger from '../utils/logger';

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

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchUserProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          await fetchUserProfile(session.user.id);
        } else {
          setUser(null);
          setLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      setUser(data);
    } catch (error) {
      logger.error('Error fetching user profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string, name?: string, role?: UserRole) => {
    setLoading(true);
    try {
      // For demo purposes, create a mock user
      const userRole = role || 'customer';
      const mockUser: User = {
        id: 'demo-user-1',
        role: userRole,
        name: name || email.split('@')[0],
        email,
        created_at: new Date().toISOString(),
        profileCompleted: userRole === 'customer', // Customers don't need onboarding
      };
      
      setUser(mockUser);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const signUp = async (email: string, password: string, role: UserRole, name?: string, businessName?: string, city?: string, phone?: string) => {
    setLoading(true);
    try {
      // For demo purposes, create a mock user
      const mockUser: User = {
        id: `demo-user-${Date.now()}`,
        role,
        name: name || email.split('@')[0],
        email,
        city: city || 'Delhi', // Use provided city or default
        phone: phone,
        created_at: new Date().toISOString(),
        profileCompleted: role === 'customer', // Customers don't need onboarding
      };
      
      setUser(mockUser);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      // For demo purposes, just clear the user
      setUser(null);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!user) throw new Error('No user logged in');

    try {
      // For demo purposes, update the user state directly
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      
      // In a real app, you would make the database call here:
      // const { data, error } = await supabase
      //   .from('users')
      //   .update(updates)
      //   .eq('id', user.id)
      //   .select()
      //   .single();
      // if (error) throw error;
      // setUser(data);
      
      console.log('Profile updated successfully:', updatedUser);
    } catch (error) {
      console.error('Auth error:', error);
      throw error;
    }
  };

  const markProfileCompleted = async () => {
    if (!user) throw new Error('No user logged in');
    
    try {
      const updatedUser = { ...user, profileCompleted: true };
      setUser(updatedUser);
      console.log('Profile marked as completed');
    } catch (error) {
      console.error('Error marking profile as completed:', error);
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
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};