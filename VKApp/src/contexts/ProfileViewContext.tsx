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

  // Reset views daily (this is a simple implementation)
  useEffect(() => {
    const resetViewsDaily = async () => {
      try {
        const now = new Date();
        const lastReset = await AsyncStorage.getItem('lastViewReset');
        
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
        console.error('Error resetting profile views:', error);
      }
    };

    resetViewsDaily();
  }, []);

  const decrementProfileViews = () => {
    if (!unlimitedAccessActive && viewsLeft > 0) {
      setViewsLeft(prev => prev - 1);
    }
  };

  const activateUnlimitedAccess = () => {
    setUnlimitedAccessActive(true);
    // In a real app, this would integrate with payment processing
    console.log('Unlimited access activated!');
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
