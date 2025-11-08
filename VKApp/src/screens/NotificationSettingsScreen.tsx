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
import { Typography, Spacing, BorderRadius, Shadows } from '../constants/designSystem';
import { useTheme } from '../contexts/AppThemeContext';

type NotificationSettingsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'NotificationSettings'>;

interface NotificationSetting {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
  category: 'general' | 'bookings' | 'messages' | 'marketing';
  icon: string;
}

const NotificationSettingsScreen = () => {
  const navigation = useNavigation<NotificationSettingsScreenNavigationProp>();
  const { colors } = useTheme();
  const [settings, setSettings] = useState<NotificationSetting[]>([
    // General Notifications
    {
      id: 'push_notifications',
      title: 'Push Notifications',
      description: 'Receive notifications on your device',
      enabled: true,
      category: 'general',
      icon: 'notifications',
    },
    {
      id: 'email_notifications',
      title: 'Email Notifications',
      description: 'Receive notifications via email',
      enabled: true,
      category: 'general',
      icon: 'mail',
    },
    {
      id: 'sound_notifications',
      title: 'Sound & Vibration',
      description: 'Play sound and vibrate for notifications',
      enabled: true,
      category: 'general',
      icon: 'volume-high',
    },
    
    // Booking Notifications
    {
      id: 'booking_requests',
      title: 'New Booking Requests',
      description: 'Get notified when someone books your services',
      enabled: true,
      category: 'bookings',
      icon: 'calendar',
    },
    {
      id: 'booking_updates',
      title: 'Booking Updates',
      description: 'Updates on your existing bookings',
      enabled: true,
      category: 'bookings',
      icon: 'refresh',
    },
    {
      id: 'booking_reminders',
      title: 'Booking Reminders',
      description: 'Reminders before your scheduled bookings',
      enabled: true,
      category: 'bookings',
      icon: 'time',
    },
    {
      id: 'booking_cancellations',
      title: 'Booking Cancellations',
      description: 'Notifications when bookings are cancelled',
      enabled: true,
      category: 'bookings',
      icon: 'close-circle',
    },
    
    // Message Notifications
    {
      id: 'new_messages',
      title: 'New Messages',
      description: 'Get notified of new chat messages',
      enabled: true,
      category: 'messages',
      icon: 'chatbubble',
    },
    {
      id: 'message_requests',
      title: 'Message Requests',
      description: 'Notifications for new inquiry messages',
      enabled: true,
      category: 'messages',
      icon: 'chatbubble-ellipses',
    },
    
    // Marketing Notifications
    {
      id: 'promotional_offers',
      title: 'Promotional Offers',
      description: 'Special offers and discounts',
      enabled: false,
      category: 'marketing',
      icon: 'gift',
    },
    {
      id: 'app_updates',
      title: 'App Updates',
      description: 'New features and app improvements',
      enabled: true,
      category: 'marketing',
      icon: 'rocket',
    },
    {
      id: 'tips_tricks',
      title: 'Tips & Tricks',
      description: 'Helpful tips to improve your experience',
      enabled: false,
      category: 'marketing',
      icon: 'bulb',
    },
  ]);

  const handleToggleSetting = (id: string) => {
    setSettings(prev => 
      prev.map(setting => 
        setting.id === id 
          ? { ...setting, enabled: !setting.enabled }
          : setting
      )
    );
  };

  const handleToggleCategory = (category: string) => {
    const categorySettings = settings.filter(s => s.category === category);
    const allEnabled = categorySettings.every(s => s.enabled);
    
    setSettings(prev => 
      prev.map(setting => 
        setting.category === category 
          ? { ...setting, enabled: !allEnabled }
          : setting
      )
    );
  };

  const handleSaveSettings = () => {
    Alert.alert(
      'Settings Saved',
      'Your notification preferences have been updated successfully!',
      [{ text: 'OK' }]
    );
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'general': return 'settings';
      case 'bookings': return 'calendar';
      case 'messages': return 'chatbubbles';
      case 'marketing': return 'megaphone';
      default: return 'settings';
    }
  };

  const getCategoryTitle = (category: string) => {
    switch (category) {
      case 'general': return 'General';
      case 'bookings': return 'Bookings';
      case 'messages': return 'Messages';
      case 'marketing': return 'Marketing';
      default: return 'General';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'general': return colors.primary;
      case 'bookings': return colors.success;
      case 'messages': return colors.warning;
      case 'marketing': return colors.error;
      default: return colors.primary;
    }
  };

  const categories = ['general', 'bookings', 'messages', 'marketing'];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={colors.gray900} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Notifications</Text>
          <TouchableOpacity onPress={handleSaveSettings}>
            <Text style={styles.saveButton}>Save</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Quick Actions */}
          <View style={styles.quickActions}>
            <TouchableOpacity 
              style={styles.quickActionButton}
              onPress={() => {
                setSettings(prev => prev.map(s => ({ ...s, enabled: true })));
              }}
            >
              <Ionicons name="checkmark-circle" size={20} color={colors.success} />
              <Text style={styles.quickActionText}>Enable All</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.quickActionButton}
              onPress={() => {
                setSettings(prev => prev.map(s => ({ ...s, enabled: false })));
              }}
            >
              <Ionicons name="close-circle" size={20} color={colors.error} />
              <Text style={styles.quickActionText}>Disable All</Text>
            </TouchableOpacity>
          </View>

          {/* Notification Categories */}
          {categories.map((category) => {
            const categorySettings = settings.filter(s => s.category === category);
            const allEnabled = categorySettings.every(s => s.enabled);
            const someEnabled = categorySettings.some(s => s.enabled);
            
            return (
              <View key={category} style={styles.categorySection}>
                {/* Category Header */}
                <TouchableOpacity 
                  style={styles.categoryHeader}
                  onPress={() => handleToggleCategory(category)}
                >
                  <View style={styles.categoryInfo}>
                    <View style={[styles.categoryIcon, { backgroundColor: getCategoryColor(category) + '20' }]}>
                      <Ionicons name={getCategoryIcon(category) as any} size={20} color={getCategoryColor(category)} />
                    </View>
                    <View style={styles.categoryDetails}>
                      <Text style={styles.categoryTitle}>{getCategoryTitle(category)}</Text>
                      <Text style={styles.categorySubtitle}>
                        {allEnabled ? 'All enabled' : someEnabled ? 'Some enabled' : 'All disabled'}
                      </Text>
                    </View>
                  </View>
                  <Switch
                    value={allEnabled}
                    onValueChange={() => handleToggleCategory(category)}
                    trackColor={{ false: colors.gray300, true: getCategoryColor(category) + '50' }}
                    thumbColor={allEnabled ? getCategoryColor(category) : colors.gray500}
                  />
                </TouchableOpacity>

                {/* Category Settings */}
                <View style={styles.settingsList}>
                  {categorySettings.map((setting) => (
                    <View key={setting.id} style={styles.settingItem}>
                      <View style={styles.settingInfo}>
                        <View style={[styles.settingIcon, { backgroundColor: getCategoryColor(category) + '15' }]}>
                          <Ionicons name={setting.icon as any} size={18} color={getCategoryColor(category)} />
                        </View>
                        <View style={styles.settingDetails}>
                          <Text style={styles.settingTitle}>{setting.title}</Text>
                          <Text style={styles.settingDescription}>{setting.description}</Text>
                        </View>
                      </View>
                      <Switch
                        value={setting.enabled}
                        onValueChange={() => handleToggleSetting(setting.id)}
                        trackColor={{ false: colors.gray300, true: getCategoryColor(category) + '50' }}
                        thumbColor={setting.enabled ? getCategoryColor(category) : colors.gray500}
                      />
                    </View>
                  ))}
                </View>
              </View>
            );
          })}

          {/* Notification Info */}
          <View style={styles.infoSection}>
            <View style={styles.infoHeader}>
              <Ionicons name="information-circle" size={20} color={colors.primary} />
              <Text style={styles.infoTitle}>About Notifications</Text>
            </View>
            <Text style={styles.infoText}>
              You can customize which notifications you receive. Some important notifications like booking confirmations and payment updates cannot be disabled for security reasons.
            </Text>
          </View>
        </ScrollView>
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
    borderBottomColor: '#D1D1D6', // Static gray border
    backgroundColor: '#FFFFFF', // Static white background
  },
  headerTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semiBold,
    color: '#1F2937', // Static dark gray color
  },
  saveButton: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semiBold,
    color: '#007AFF', // Static primary color
  },
  content: {
    flex: 1,
    padding: Spacing.lg,
  },
  quickActions: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  quickActionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF', // Static white background
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: '#E5E7EB', // Static gray200 border
    gap: Spacing.sm,
  },
  quickActionText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
    color: '#4B5563', // Static gray700 color
  },
  categorySection: {
    marginBottom: Spacing.xl,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF', // Static white background
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: '#E5E7EB', // Static gray200 border
    ...Shadows.sm,
  },
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  categoryDetails: {
    flex: 1,
  },
  categoryTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semiBold,
    color: '#1F2937', // Static gray900 color
    marginBottom: Spacing.xs,
  },
  categorySubtitle: {
    fontSize: Typography.fontSize.sm,
    color: '#4B5563', // Static gray600 color
  },
  settingsList: {
    gap: Spacing.sm,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF', // Static white background
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: '#E5E7EB', // Static gray200 border
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  settingDetails: {
    flex: 1,
  },
  settingTitle: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
    color: '#1F2937', // Static gray900 color
    marginBottom: Spacing.xs,
  },
  settingDescription: {
    fontSize: Typography.fontSize.xs,
    color: '#4B5563', // Static gray600 color
    lineHeight: Typography.lineHeight.relaxed * Typography.fontSize.xs,
  },
  infoSection: {
    backgroundColor: '#F0F8FF', // Static primary + '10' color
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: '#CCE0FF', // Static primary + '30' color
    marginTop: Spacing.lg,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  infoTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semiBold,
    color: '#007AFF', // Static primary color
    marginLeft: Spacing.sm,
  },
  infoText: {
    fontSize: Typography.fontSize.sm,
    color: '#4B5563', // Static gray700 color
    lineHeight: Typography.lineHeight.relaxed * Typography.fontSize.sm,
  },
});

export default NotificationSettingsScreen;
