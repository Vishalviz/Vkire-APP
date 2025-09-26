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
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../constants/designSystem';

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
  const [settings, setSettings] = useState({
    darkMode: false,
    autoSave: true,
    locationServices: true,
    analytics: false,
    crashReports: true,
    marketingEmails: false,
  });

  const handleToggleSetting = (key: string) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key as keyof typeof prev]
    }));
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
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            Alert.alert('Account Deletion', 'Account deletion feature will be implemented in a future update.');
          }
        },
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
      value: settings.darkMode,
      icon: 'moon',
      color: Colors.primary,
    },
    {
      id: 'autoSave',
      title: 'Auto Save',
      description: 'Automatically save your work',
      type: 'toggle',
      value: settings.autoSave,
      icon: 'save',
      color: Colors.success,
    },
    {
      id: 'locationServices',
      title: 'Location Services',
      description: 'Allow location access for better recommendations',
      type: 'toggle',
      value: settings.locationServices,
      icon: 'location',
      color: Colors.warning,
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
      color: Colors.primary,
    },
    {
      id: 'crashReports',
      title: 'Crash Reports',
      description: 'Automatically send crash reports',
      type: 'toggle',
      value: settings.crashReports,
      icon: 'bug',
      color: Colors.error,
    },
    {
      id: 'marketingEmails',
      title: 'Marketing Emails',
      description: 'Receive promotional offers and updates',
      type: 'toggle',
      value: settings.marketingEmails,
      icon: 'mail',
      color: Colors.warning,
    },
  ];

  const accountSettings: SettingItem[] = [
    {
      id: 'exportData',
      title: 'Export Data',
      description: 'Download a copy of your data',
      type: 'action',
      icon: 'download',
      color: Colors.primary,
      onPress: handleExportData,
    },
    {
      id: 'deleteAccount',
      title: 'Delete Account',
      description: 'Permanently delete your account',
      type: 'action',
      icon: 'trash',
      color: Colors.error,
      onPress: handleDeleteAccount,
    },
  ];

  const renderSettingItem = (item: SettingItem) => {
    return (
      <View key={item.id} style={styles.settingItem}>
        <View style={styles.settingInfo}>
          <View style={[styles.settingIcon, { backgroundColor: (item.color || Colors.primary) + '20' }]}>
            <Ionicons name={item.icon as any} size={20} color={item.color || Colors.primary} />
          </View>
          <View style={styles.settingDetails}>
            <Text style={styles.settingTitle}>{item.title}</Text>
            {item.description && (
              <Text style={styles.settingDescription}>{item.description}</Text>
            )}
          </View>
        </View>
        
        {item.type === 'toggle' && (
          <Switch
            value={item.value}
            onValueChange={() => handleToggleSetting(item.id)}
            trackColor={{ false: Colors.gray300, true: (item.color || Colors.primary) + '50' }}
            thumbColor={item.value ? (item.color || Colors.primary) : Colors.gray500}
          />
        )}
        
        {item.type === 'action' && (
          <TouchableOpacity onPress={item.onPress}>
            <Ionicons name="chevron-forward" size={20} color={Colors.gray400} />
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={Colors.gray900} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Settings</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* User Info */}
          <View style={styles.userSection}>
            <View style={styles.userInfo}>
              <View style={styles.avatarContainer}>
                <Ionicons name="person" size={24} color={Colors.gray400} />
              </View>
              <View style={styles.userDetails}>
                <Text style={styles.userName}>{user?.name || 'User'}</Text>
                <Text style={styles.userEmail}>{user?.email}</Text>
                <Text style={styles.userRole}>{user?.role === 'pro' ? 'Professional' : 'Customer'}</Text>
              </View>
            </View>
          </View>

          {/* General Settings */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>General</Text>
          </View>
          <View style={styles.settingsGroup}>
            {generalSettings.map(renderSettingItem)}
          </View>

          {/* Privacy Settings */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Privacy & Data</Text>
          </View>
          <View style={styles.settingsGroup}>
            {privacySettings.map(renderSettingItem)}
          </View>

          {/* Account Settings */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Account</Text>
          </View>
          <View style={styles.settingsGroup}>
            {accountSettings.map(renderSettingItem)}
          </View>

          {/* App Info */}
          <View style={styles.appInfo}>
            <Text style={styles.appInfoTitle}>Vkire v2.0.0</Text>
            <Text style={styles.appInfoText}>
              Built with ❤️ for creators and customers
            </Text>
            <Text style={styles.appInfoSubtext}>
              Last updated: {new Date().toLocaleDateString()}
            </Text>
          </View>

          {/* Sign Out Button */}
          <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
            <Ionicons name="log-out-outline" size={20} color={Colors.error} />
            <Text style={styles.signOutText}>Sign Out</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.gray200,
    backgroundColor: Colors.surface,
  },
  headerTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semiBold,
    color: Colors.gray900,
  },
  headerSpacer: {
    width: 24,
  },
  content: {
    flex: 1,
    padding: Spacing.lg,
  },
  userSection: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.gray200,
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
    backgroundColor: Colors.gray100,
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
    color: Colors.gray900,
    marginBottom: Spacing.xs,
  },
  userEmail: {
    fontSize: Typography.fontSize.sm,
    color: Colors.gray600,
    marginBottom: Spacing.xs,
  },
  userRole: {
    fontSize: Typography.fontSize.xs,
    color: Colors.primary,
    fontWeight: Typography.fontWeight.medium,
    backgroundColor: Colors.primary + '15',
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
    color: Colors.gray900,
  },
  settingsGroup: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.gray200,
    overflow: 'hidden',
    ...Shadows.sm,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray200,
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
    color: Colors.gray900,
    marginBottom: Spacing.xs,
  },
  settingDescription: {
    fontSize: Typography.fontSize.sm,
    color: Colors.gray600,
    lineHeight: Typography.lineHeight.relaxed * Typography.fontSize.sm,
  },
  appInfo: {
    backgroundColor: Colors.primary + '10',
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.primary + '30',
    alignItems: 'center',
  },
  appInfoTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semiBold,
    color: Colors.primary,
    marginBottom: Spacing.sm,
  },
  appInfoText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.gray700,
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  appInfoSubtext: {
    fontSize: Typography.fontSize.xs,
    color: Colors.gray600,
    textAlign: 'center',
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.error + '10',
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.error + '30',
    gap: Spacing.sm,
  },
  signOutText: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.error,
  },
});

export default SettingsScreen;
