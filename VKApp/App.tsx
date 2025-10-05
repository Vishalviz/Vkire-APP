import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from './src/contexts/AuthContext';
import { ProfileViewProvider } from './src/contexts/ProfileViewContext';
import { LocationProvider } from './src/contexts/LocationContext';
import AppNavigator from './src/navigation/AppNavigator';

const AppContent = () => {
  return (
    <>
      <AppNavigator />
      <StatusBar style="auto" />
    </>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <ProfileViewProvider>
        <LocationProvider>
          <AppContent />
        </LocationProvider>
      </ProfileViewProvider>
    </AuthProvider>
  );
}
