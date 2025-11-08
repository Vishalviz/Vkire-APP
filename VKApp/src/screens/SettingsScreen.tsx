import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Switch,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { useLocation } from '../contexts/LocationContext';
import { useTheme } from '../contexts/AppThemeContext';
import { Typography, Spacing, BorderRadius, Shadows } from '../constants/designSystem';

type SettingsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Settings'>;

interface SettingItem {
  id: string;
  title: string;
  description?: string;
  type: 'toggle' | 'navigate' | 'action';
  value?: boolean;
  icon: string;
  onPress?: () => void;
  color?: string;
}

const SettingsScreen = () => {
  const navigation = useNavigation<SettingsScreenNavigationProp>();
  const { user, signOut } = useAuth();
  const {
    isLocationEnabled, currentLocation, manualLocation, requestLocationPermission, clearLocation, setManualLocation
  } = useLocation();
  const { theme, colors, toggleTheme } = useTheme();
  // Note: settings state for darkMode is now from theme context, rest is local
  const [settings, setSettings] = useState({
    autoSave: true,
    locationServices: true,
    analytics: false,
    crashReports: true,
    marketingEmails: false,
  });
  const [showLocationOptions, setShowLocationOptions] = useState(false);

  const handleToggleSetting = (key: string) => {
    if (key === 'darkMode') {
      toggleTheme();
    } else {
      setSettings(prev => ({ ...prev, [key]: !prev[key as keyof typeof prev] }));
    }
  };

  const handleLocationPreferenceChange = async (preference: 'gps' | 'manual' | 'none') => {
    switch (preference) {
      case 'gps':
        await requestLocationPermission();
        break;
      case 'manual':
        setShowLocationOptions(true);
        break;
      case 'none':
        await clearLocation();
        break;
    }
  };

  const handleManualLocationSet = (location: string) => {
    setManualLocation(location);
    setShowLocationOptions(false);
  };

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign Out', style: 'destructive', onPress: signOut },
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This action cannot be undone. All your data will be permanently deleted.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: async () => { await signOut(); /* More real deletion logic here if you later integrate a backend. */ } },
      ]
    );
  };

  const handleExportData = () => {
    Alert.alert(
      'Export Data',
      'Your data will be exported and sent to your registered email address.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Export', onPress: () => {
          Alert.alert('Success', 'Data export initiated. You will receive an email within 24 hours.');
        }},
      ]
    );
  };

  const generalSettings: SettingItem[] = [
    {
      id: 'darkMode',
      title: 'Dark Mode',
      description: 'Switch to dark theme',
      type: 'toggle',
      value: theme === 'dark',
      icon: 'moon',
      color: colors.primary,
    },
    {
      id: 'autoSave',
      title: 'Auto Save',
      description: 'Automatically save your work',
      type: 'toggle',
      value: settings.autoSave,
      icon: 'save',
      color: colors.success,
    },
    {
      id: 'locationServices',
      title: 'Location Services',
      description: isLocationEnabled
        ? (manualLocation || currentLocation?.city || 'GPS Location Active')
        : 'Manage location preferences',
      type: 'navigate',
      icon: 'location',
      color: isLocationEnabled ? colors.success : colors.warning,
      onPress: () => setShowLocationOptions(true),
    },
  ];

  const privacySettings: SettingItem[] = [
    {
      id: 'analytics',
      title: 'Analytics',
      description: 'Help us improve the app with usage data',
      type: 'toggle',
      value: settings.analytics,
      icon: 'analytics',
      color: colors.primary,
    },
    {
      id: 'crashReports',
      title: 'Crash Reports',
      description: 'Automatically send crash reports',
      type: 'toggle',
      value: settings.crashReports,
      icon: 'bug',
      color: colors.error,
    },
    {
      id: 'marketingEmails',
      title: 'Marketing Emails',
      description: 'Receive promotional offers and updates',
      type: 'toggle',
      value: settings.marketingEmails,
      icon: 'mail',
      color: colors.warning,
    },
  ];

  const accountSettings: SettingItem[] = [
    {
      id: 'exportData',
      title: 'Export Data',
      description: 'Download a copy of your data',
      type: 'action',
      icon: 'download',
      color: colors.primary,
      onPress: handleExportData,
    },
    {
      id: 'deleteAccount',
      title: 'Delete Account',
      description: 'Permanently delete your account',
      type: 'action',
      icon: 'trash',
      color: colors.error,
      onPress: handleDeleteAccount,
    },
  ];

  const renderSettingItem = (item: SettingItem) => {
    return (
      <View key={item.id} style={[styles.settingItem, { backgroundColor: colors.surface }]}> // Use themed color
        <View style={styles.settingInfo}>
          <View style={[styles.settingIcon, { backgroundColor: (item.color || colors.primary) + '20' }]}> //
            <Ionicons name={item.icon as any} size={20} color={item.color || colors.primary} />
          </View>
          <View style={styles.settingDetails}>
            <Text style={[styles.settingTitle, { color: colors.gray900 }]}>{item.title}</Text>
            {item.description && (
              <Text style={[styles.settingDescription, { color: colors.gray600 }]}>{item.description}</Text>
            )}
          </View>
        </View>
        {item.type === 'toggle' && (
          <Switch
            value={item.value}
            onValueChange={() => handleToggleSetting(item.id)}
            trackColor={{ false: colors.gray300, true: (item.color || colors.primary) + '50' }}
            thumbColor={item.value ? (item.color || colors.primary) : colors.gray500}
          />
        )}
        {item.type === 'action' && (
          <TouchableOpacity onPress={item.onPress}>
            <Ionicons name="chevron-forward" size={20} color={colors.gray400} />
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.surface }]}> // themed
      <View style={[styles.container, { backgroundColor: colors.background }]}> // themed
        {/* Header */}
        <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.gray200 }]}> // themed
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={colors.gray900} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.gray900 }]}>{'Settings'}</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* User Info */}
          <View style={[styles.userSection, { backgroundColor: colors.surface, borderColor: colors.gray200 }]}>
            <View style={styles.userInfo}>
              <View style={[styles.avatarContainer, { backgroundColor: colors.gray100 }]}>
                <Ionicons name="person" size={24} color={colors.gray400} />
              </View>
              <View style={styles.userDetails}>
                <Text style={[styles.userName, { color: colors.gray900 }]}>{user?.name || 'User'}</Text>
                <Text style={[styles.userEmail, { color: colors.gray600 }]}>{user?.email}</Text>
                <Text style={[styles.userRole, { color: colors.primary, backgroundColor: colors.primary + '15' }]}>{user?.role === 'pro' ? 'Professional' : 'Customer'}</Text>
              </View>
            </View>
          </View>

          {/* General Settings */}
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.gray900 }]}>General</Text>
          </View>
          <View style={[styles.settingsGroup, { backgroundColor: colors.surface, borderColor: colors.gray200 }]}>
            {generalSettings.map(renderSettingItem)}
          </View>

          {/* Privacy Settings */}
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.gray900 }]}>Privacy & Data</Text>
          </View>
          <View style={[styles.settingsGroup, { backgroundColor: colors.surface, borderColor: colors.gray200 }]}>
            {privacySettings.map(renderSettingItem)}
          </View>

          {/* Account Settings */}
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.gray900 }]}>Account</Text>
          </View>
          <View style={[styles.settingsGroup, { backgroundColor: colors.surface, borderColor: colors.gray200 }]}>
            {accountSettings.map(renderSettingItem)}
          </View>

          {/* App Info */}
          <View style={[styles.appInfo, { backgroundColor: colors.primary + '10', borderColor: colors.primary + '30' }]}>
            <Text style={[styles.appInfoTitle, { color: colors.primary }]}>Vkire v2.0.0</Text>
            <Text style={[styles.appInfoText, { color: colors.gray700 }]}>
              Built with ❤️ for creators and customers
            </Text>
            <Text style={[styles.appInfoSubtext, { color: colors.gray600 }]}>
              Last updated: {new Date().toLocaleDateString()}
            </Text>
          </View>

          {/* Sign Out Button */}
          <TouchableOpacity style={[styles.signOutButton, { backgroundColor: colors.error + '10', borderColor: colors.error + '30' }]}>
            <Ionicons name="log-out-outline" size={20} color={colors.error} />
            <Text style={[styles.signOutText, { color: colors.error }]}>Sign Out</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Location Options Modal */}
        {showLocationOptions && (
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, { backgroundColor: colors.white }]}>
              <View style={[styles.modalHeader, { borderBottomColor: colors.gray200 }]}>
                <Text style={[styles.modalTitle, { color: colors.gray900 }]}>Location Preferences</Text>
                <TouchableOpacity onPress={() => setShowLocationOptions(false)}>
                  <Ionicons name="close" size={24} color={colors.gray600} />
                </TouchableOpacity>
              </View>

              <View style={styles.locationOptions}>
                <TouchableOpacity
                  style={[styles.locationOption, { backgroundColor: colors.gray50 }]}>
                  <View style={[styles.locationOptionIcon, { backgroundColor: colors.white }]}>
                    <Ionicons name="location" size={24} color={colors.primary} />
                  </View>
                  <View style={styles.locationOptionContent}>
                    <Text style={[styles.locationOptionTitle, { color: colors.gray900 }]}>Use GPS Location</Text>
                    <Text style={[styles.locationOptionDescription, { color: colors.gray600 }]}>
                      Automatically detect your current location
                    </Text>
                  </View>
                  {!manualLocation && isLocationEnabled && (
                    <Ionicons name="checkmark-circle" size={20} color={colors.success} />
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.locationOption, { backgroundColor: colors.gray50 }]}>
                  <View style={[styles.locationOptionIcon, { backgroundColor: colors.white }]}>
                    <Ionicons name="map" size={24} color={colors.warning} />
                  </View>
                  <View style={styles.locationOptionContent}>
                    <Text style={[styles.locationOptionTitle, { color: colors.gray900 }]}>Manual Location</Text>
                    <Text style={[styles.locationOptionDescription, { color: colors.gray600 }]}>
                      Set your location manually
                    </Text>
                  </View>
                  {manualLocation && (
                    <Ionicons name="checkmark-circle" size={20} color={colors.success} />
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.locationOption, { backgroundColor: colors.gray50 }]}>
                  <View style={[styles.locationOptionIcon, { backgroundColor: colors.white }]}>
                    <Ionicons name="location" size={24} color={colors.error} />
                  </View>
                  <View style={styles.locationOptionContent}>
                    <Text style={[styles.locationOptionTitle, { color: colors.gray900 }]}>Disable Location</Text>
                    <Text style={[styles.locationOptionDescription, { color: colors.gray600 }]}>
                      Don't use location services
                    </Text>
                  </View>
                  {!isLocationEnabled && (
                    <Ionicons name="checkmark-circle" size={20} color={colors.success} />
                  )}
                </TouchableOpacity>
              </View>

              {manualLocation && (
                <View style={[styles.currentLocation, { borderTopColor: colors.gray200 }]}>
                  <Text style={[styles.currentLocationLabel, { color: colors.gray600 }]}>Current Location:</Text>
                  <Text style={[styles.currentLocationText, { color: colors.gray900 }]}>{manualLocation}</Text>
                </View>
              )}
            </View>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 0.5,
  },
  headerTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semiBold,
  },
  headerSpacer: {
    width: 24,
  },
  content: {
    flex: 1,
    padding: Spacing.lg,
  },
  userSection: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.xl,
    borderWidth: 1,
    ...Shadows.sm,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semiBold,
    marginBottom: Spacing.xs,
  },
  userEmail: {
    fontSize: Typography.fontSize.sm,
    marginBottom: Spacing.xs,
  },
  userRole: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.medium,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    alignSelf: 'flex-start',
  },
  sectionHeader: {
    marginBottom: Spacing.md,
    marginTop: Spacing.lg,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semiBold,
  },
  settingsGroup: {
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    overflow: 'hidden',
    ...Shadows.sm,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: '#D1D1D6', // Replaced colors.gray200 with static hex
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  settingDetails: {
    flex: 1,
  },
  settingTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.medium,
    marginBottom: Spacing.xs,
  },
  settingDescription: {
    fontSize: Typography.fontSize.sm,
    lineHeight: Typography.lineHeight.relaxed * Typography.fontSize.sm,
  },
  appInfo: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.xl,
    borderWidth: 1,
    alignItems: 'center',
  },
  appInfoTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semiBold,
    marginBottom: Spacing.sm,
  },
  appInfoText: {
    fontSize: Typography.fontSize.sm,
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  appInfoSubtext: {
    fontSize: Typography.fontSize.xs,
    textAlign: 'center',
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    gap: Spacing.sm,
  },
  signOutText: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.medium,
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContent: {
    borderRadius: BorderRadius['2xl'],
    margin: Spacing.xl,
    maxWidth: 400,
    width: '90%',
    ...Shadows.lg,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: '#D1D1D6', // Replaced colors.gray200 with static hex
  },
  modalTitle: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
  },
  locationOptions: {
    padding: Spacing.lg,
  },
  locationOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.sm,
  },
  locationOptionIcon: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
    ...Shadows.sm,
  },
  locationOptionContent: {
    flex: 1,
  },
  locationOptionTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semiBold,
    marginBottom: 2,
  },
  locationOptionDescription: {
    fontSize: Typography.fontSize.sm,
  },
  currentLocation: {
    padding: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: '#D1D1D6', // Replaced colors.gray200 with static hex
  },
  currentLocationLabel: {
    fontSize: Typography.fontSize.sm,
    marginBottom: Spacing.xs,
  },
  currentLocationText: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.medium,
  },
});

export default SettingsScreen;
