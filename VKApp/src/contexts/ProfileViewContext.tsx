import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ProfileViewContextType {
  profileViews: number;
  decrementProfileViews: () => void;
  hasUnlimitedAccess: boolean;
  activateUnlimitedAccess: () => void;
  clearAllData: () => void; // For testing/debugging
}

const ProfileViewContext = createContext<ProfileViewContextType | undefined>(undefined);

interface ProfileViewProviderProps {
  children: ReactNode;
}

export const ProfileViewProvider: React.FC<ProfileViewProviderProps> = ({ children }) => {
  const [viewsLeft, setViewsLeft] = useState(5); // Start with 5 free views
  const [unlimitedAccessActive, setUnlimitedAccessActive] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Reset views daily and check unlimited access expiry
  useEffect(() => {
    const initializeViews = async () => {
      try {
        const now = new Date();
        const lastReset = await AsyncStorage.getItem('lastViewReset');
        const unlimitedExpiry = await AsyncStorage.getItem('unlimitedAccessExpiry');
        
        console.log('=== ProfileViewContext Debug ===');
        console.log('lastReset:', lastReset);
        console.log('unlimitedExpiry:', unlimitedExpiry);
        console.log('Current time:', now.toISOString());
        
        // Check unlimited access expiry
        if (unlimitedExpiry) {
          const expiryTime = parseInt(unlimitedExpiry);
          console.log('Expiry time:', new Date(expiryTime).toISOString());
          console.log('Time difference:', now.getTime() - expiryTime);
          
          if (now.getTime() > expiryTime) {
            // Unlimited access expired
            setUnlimitedAccessActive(false);
            await AsyncStorage.removeItem('unlimitedAccessExpiry');
            console.log('Unlimited access expired - removed from storage');
          } else {
            // Unlimited access still valid
            setUnlimitedAccessActive(true);
            console.log('Unlimited access still active until:', new Date(expiryTime));
          }
        } else {
          // No unlimited access stored
          setUnlimitedAccessActive(false);
          console.log('No unlimited access stored - using free credits');
        }
        
        // Reset daily views
        if (!lastReset) {
          // Fresh install - set to 5 free views
          setViewsLeft(5);
          await AsyncStorage.setItem('lastViewReset', now.toDateString());
          console.log('Fresh install - initialized with 5 free views');
          return;
        }
        
        const lastResetDate = new Date(lastReset);
        const daysDiff = Math.floor((now.getTime() - lastResetDate.getTime()) / (1000 * 60 * 60 * 24));
        
        console.log('Last reset date:', lastResetDate.toISOString());
        console.log('Days difference:', daysDiff);
        
        if (daysDiff >= 1) {
          setViewsLeft(5); // Reset to 5 free views
          await AsyncStorage.setItem('lastViewReset', now.toDateString());
          console.log('Daily reset - restored 5 free views');
        } else {
          console.log('Same day - views remaining:', viewsLeft);
        }
        
        console.log('=== End Debug ===');
        setIsInitialized(true);
      } catch (error) {
        console.error('Error initializing profile views:', error);
        // Fallback to safe defaults
        setViewsLeft(5);
        setUnlimitedAccessActive(false);
        setIsInitialized(true);
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

  const clearAllData = async () => {
    try {
      await AsyncStorage.removeItem('lastViewReset');
      await AsyncStorage.removeItem('unlimitedAccessExpiry');
      setViewsLeft(5);
      setUnlimitedAccessActive(false);
      console.log('All profile view data cleared - reset to 5 free views');
    } catch (error) {
      console.error('Error clearing profile view data:', error);
    }
  };

  const value: ProfileViewContextType = {
    profileViews: isInitialized ? (unlimitedAccessActive ? Infinity : viewsLeft) : 5,
    decrementProfileViews,
    hasUnlimitedAccess: isInitialized ? unlimitedAccessActive : false,
    activateUnlimitedAccess,
    clearAllData,
  };

  // Debug logging
  console.log('ProfileViewContext - isInitialized:', isInitialized, 'unlimitedAccessActive:', unlimitedAccessActive, 'viewsLeft:', viewsLeft, 'profileViews:', value.profileViews);

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
