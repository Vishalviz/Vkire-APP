import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ProfileViewContextType {
  profileViews: number;
  decrementProfileViews: () => void;
  hasUnlimitedAccess: boolean;
  activateUnlimitedAccess: () => void;
}

const ProfileViewContext = createContext<ProfileViewContextType | undefined>(undefined);

interface ProfileViewProviderProps {
  children: ReactNode;
}

export const ProfileViewProvider: React.FC<ProfileViewProviderProps> = ({ children }) => {
  const [viewsLeft, setViewsLeft] = useState(5); // Start with 5 free views
  const [unlimitedAccessActive, setUnlimitedAccessActive] = useState(false);

  // Reset views daily and check unlimited access expiry
  useEffect(() => {
    const initializeViews = async () => {
      try {
        const now = new Date();
        const lastReset = await AsyncStorage.getItem('lastViewReset');
        const unlimitedExpiry = await AsyncStorage.getItem('unlimitedAccessExpiry');
        
        // Check unlimited access expiry
        if (unlimitedExpiry) {
          const expiryTime = parseInt(unlimitedExpiry);
          if (now.getTime() > expiryTime) {
            setUnlimitedAccessActive(false);
            await AsyncStorage.removeItem('unlimitedAccessExpiry');
          } else {
            setUnlimitedAccessActive(true);
          }
        }
        
        // Reset daily views
        if (!lastReset) {
          await AsyncStorage.setItem('lastViewReset', now.toDateString());
          return;
        }
        
        const lastResetDate = new Date(lastReset);
        const daysDiff = Math.floor((now.getTime() - lastResetDate.getTime()) / (1000 * 60 * 60 * 24));
        
        if (daysDiff >= 1) {
          setViewsLeft(5); // Reset to 5 free views
          await AsyncStorage.setItem('lastViewReset', now.toDateString());
        }
      } catch (error) {
        console.error('Error initializing profile views:', error);
      }
    };

    initializeViews();
  }, []);

  const decrementProfileViews = () => {
    if (!unlimitedAccessActive && viewsLeft > 0) {
      setViewsLeft(prev => prev - 1);
    }
  };

  const activateUnlimitedAccess = () => {
    setUnlimitedAccessActive(true);
    // Set expiry for 24 hours
    const expiryTime = new Date().getTime() + (24 * 60 * 60 * 1000);
    AsyncStorage.setItem('unlimitedAccessExpiry', expiryTime.toString());
    console.log('Unlimited access activated for 24 hours!');
  };

  const value: ProfileViewContextType = {
    profileViews: unlimitedAccessActive ? Infinity : viewsLeft,
    decrementProfileViews,
    hasUnlimitedAccess: unlimitedAccessActive,
    activateUnlimitedAccess,
  };

  return (
    <ProfileViewContext.Provider value={value}>
      {children}
    </ProfileViewContext.Provider>
  );
};

export const useProfileViews = (): ProfileViewContextType => {
  const context = useContext(ProfileViewContext);
  if (context === undefined) {
    throw new Error('useProfileViews must be used within a ProfileViewProvider');
  }
  return context;
};
