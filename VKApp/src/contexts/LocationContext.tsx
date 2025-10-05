import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Alert } from 'react-native';
import LocationService, { LocationData, LocationPermissionStatus } from '../services/locationService';

interface LocationContextType {
  currentLocation: LocationData | null;
  permissionStatus: LocationPermissionStatus | null;
  isLoading: boolean;
  isLocationEnabled: boolean;
  manualLocation: string | null;
  
  // Actions
  requestLocationPermission: () => Promise<boolean>;
  getCurrentLocation: () => Promise<LocationData | null>;
  setManualLocation: (location: string) => void;
  clearLocation: () => void;
  refreshLocation: () => Promise<void>;
  showLocationPrompt: () => Promise<boolean>;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

interface LocationProviderProps {
  children: ReactNode;
}

export const LocationProvider: React.FC<LocationProviderProps> = ({ children }) => {
  const [currentLocation, setCurrentLocation] = useState<LocationData | null>(null);
  const [permissionStatus, setPermissionStatus] = useState<LocationPermissionStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLocationEnabled, setIsLocationEnabled] = useState(false);
  const [manualLocation, setManualLocation] = useState<string | null>(null);

  // Initialize location context
  useEffect(() => {
    initializeLocation();
  }, []);

  const initializeLocation = async () => {
    setIsLoading(true);
    try {
      // Check if we have saved manual location preference
      const savedManualLocation = await getSavedManualLocation();
      if (savedManualLocation) {
        setManualLocation(savedManualLocation);
        setIsLocationEnabled(true);
        setIsLoading(false);
        return;
      }

      // Check permission status
      const permission = await LocationService.checkPermission();
      setPermissionStatus(permission);

      if (permission.granted) {
        // Try to get current location
        const location = await LocationService.getCurrentLocation();
        if (location) {
          setCurrentLocation(location);
          setIsLocationEnabled(true);
        }
      }
    } catch (error) {
      console.error('Error initializing location:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const requestLocationPermission = async (): Promise<boolean> => {
    setIsLoading(true);
    try {
      const permission = await LocationService.requestPermission();
      setPermissionStatus(permission);
      
      if (permission.granted) {
        const location = await LocationService.getCurrentLocation();
        if (location) {
          setCurrentLocation(location);
          setIsLocationEnabled(true);
          // Clear manual location when GPS is used
          setManualLocation(null);
          await saveManualLocation(null);
        }
      }
      
      return permission.granted;
    } catch (error) {
      console.error('Error requesting location permission:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const getCurrentLocation = async (): Promise<LocationData | null> => {
    setIsLoading(true);
    try {
      const location = await LocationService.getCurrentLocation();
      if (location) {
        setCurrentLocation(location);
        setIsLocationEnabled(true);
        // Clear manual location when GPS is used
        setManualLocation(null);
        await saveManualLocation(null);
      }
      return location;
    } catch (error) {
      console.error('Error getting current location:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const setManualLocationHandler = async (location: string) => {
    setManualLocation(location);
    setIsLocationEnabled(true);
    // Clear GPS location when manual is used
    setCurrentLocation(null);
    await saveManualLocation(location);
  };

  const clearLocation = async () => {
    setCurrentLocation(null);
    setManualLocation(null);
    setIsLocationEnabled(false);
    await saveManualLocation(null);
  };

  const refreshLocation = async () => {
    if (manualLocation) {
      // Manual location doesn't need refresh
      return;
    }

    if (permissionStatus?.granted) {
      await getCurrentLocation();
    }
  };

  const showLocationPrompt = async (): Promise<boolean> => {
    return new Promise((resolve) => {
      Alert.alert(
        'Enable Location Services',
        'To show nearby professionals and provide better recommendations, please enable location services.',
        [
          {
            text: 'Use Manual Location',
            onPress: () => {
              // This will be handled by the calling component
              resolve(false);
            },
          },
          {
            text: 'Enable GPS',
            onPress: async () => {
              const granted = await requestLocationPermission();
              resolve(granted);
            },
          },
        ]
      );
    });
  };

  // Helper functions for AsyncStorage
  const getSavedManualLocation = async (): Promise<string | null> => {
    try {
      // In a real app, you would use AsyncStorage
      // const saved = await AsyncStorage.getItem('manualLocation');
      // return saved;
      return null; // For now, return null
    } catch (error) {
      console.error('Error getting saved manual location:', error);
      return null;
    }
  };

  const saveManualLocation = async (location: string | null): Promise<void> => {
    try {
      // In a real app, you would use AsyncStorage
      // if (location) {
      //   await AsyncStorage.setItem('manualLocation', location);
      // } else {
      //   await AsyncStorage.removeItem('manualLocation');
      // }
    } catch (error) {
      console.error('Error saving manual location:', error);
    }
  };

  const value: LocationContextType = {
    currentLocation,
    permissionStatus,
    isLoading,
    isLocationEnabled,
    manualLocation,
    requestLocationPermission,
    getCurrentLocation,
    setManualLocation: setManualLocationHandler,
    clearLocation,
    refreshLocation,
    showLocationPrompt,
  };

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = (): LocationContextType => {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};
