import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { useProfileViews } from '../contexts/ProfileViewContext';
import { Typography, Spacing, BorderRadius, Shadows } from '../constants/designSystem';
import { useTheme } from '../contexts/AppThemeContext';

type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Profile'>;

const ProfileScreen = () => {
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const { user, signOut } = useAuth();
  const { profileViews, hasUnlimitedAccess, activateUnlimitedAccess, clearAllData } = useProfileViews();
  const [showCreditModal, setShowCreditModal] = useState(false);
  const { colors } = useTheme();

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

  const handlePurchaseCredits = (option: 'single' | 'unlimited') => {
    setShowCreditModal(false);
    if (option === 'unlimited') {
      activateUnlimitedAccess();
      Alert.alert(
        'Unlimited Access Activated!',
        'You now have unlimited profile views for 24 hours.',
        [{ text: 'OK' }]
      );
    } else {
      Alert.alert(
        'Credits Added!',
        'You can now view more profiles.',
        [{ text: 'OK' }]
      );
    }
  };

  const profileOptions = [
    {
      title: 'Edit Profile',
      icon: 'person-outline',
      onPress: () => navigation.navigate('EditProfile'),
      color: colors.primary,
    },
    {
      title: 'Payment Methods',
      icon: 'card-outline',
      onPress: () => navigation.navigate('PaymentMethods'),
      color: colors.success,
    },
    {
      title: 'Notifications',
      icon: 'notifications-outline',
      onPress: () => navigation.navigate('NotificationSettings'),
      color: colors.warning,
    },
    {
      title: 'Help & Support',
      icon: 'help-circle-outline',
      onPress: () => navigation.navigate('HelpSupport'),
      color: colors.info,
    },
    {
      title: 'Settings',
      icon: 'settings-outline',
      onPress: () => navigation.navigate('Settings'),
      color: colors.gray600,
    },
  ];

  if (user?.role === 'pro') {
    profileOptions.splice(1, 0, {
      title: 'My Services',
      icon: 'briefcase-outline',
      onPress: () => navigation.navigate('PriceListEditor'),
      color: colors.primary,
    });
    profileOptions.splice(2, 0, {
      title: 'Portfolio',
      icon: 'images-outline',
      onPress: () => navigation.navigate('PortfolioManager'),
      color: colors.secondary,
    });
    profileOptions.splice(3, 0, {
      title: 'Earnings',
      icon: 'trending-up-outline',
      onPress: () => Alert.alert('Coming Soon', 'Earnings tracking will be available soon!'),
      color: colors.success,
    });
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Compact Header with Profile Info */}
        <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
          <View style={styles.headerContent}>
            <View style={[styles.avatarSmall, { backgroundColor: colors.surfaceSecondary, borderColor: colors.border }]}>
              <Ionicons name="person" size={32} color={colors.gray500} />
            </View>
            <View style={styles.headerInfo}>
              <Text style={[styles.headerName, { color: colors.gray900 }]}>{user?.name || 'User'}</Text>
              <Text style={[styles.headerEmail, { color: colors.gray600 }]}>{user?.email}</Text>
            </View>
            <TouchableOpacity
              style={[styles.editButton, { backgroundColor: colors.primary + '15' }]}
              onPress={() => navigation.navigate('EditProfile')}
            >
              <Ionicons name="create-outline" size={20} color={colors.primary} />
            </TouchableOpacity>
          </View>

          {/* Role Badge and Location */}
          <View style={styles.headerMeta}>
            <View style={[styles.roleBadge, { backgroundColor: colors.primary + '15' }]}>
              <Ionicons name={user?.role === 'pro' ? 'camera' : 'search'} size={14} color={colors.primary} />
              <Text style={[styles.roleText, { color: colors.primary }]}>
                {user?.role === 'pro' ? 'Professional' : 'Customer'}
              </Text>
            </View>
            {user?.city && (
              <View style={styles.locationBadge}>
                <Ionicons name="location" size={14} color={colors.gray500} />
                <Text style={[styles.locationText, { color: colors.gray600 }]}>{user.city}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Professional Stats - Only for Professionals */}
        {user?.role === 'pro' && (
          <View style={styles.statsSection}>
            <View style={[styles.statCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <View style={[styles.statIconContainer, { backgroundColor: colors.primary + '15' }]}>
                <Ionicons name="briefcase" size={20} color={colors.primary} />
              </View>
              <Text style={[styles.statValue, { color: colors.gray900 }]}>8</Text>
              <Text style={[styles.statLabel, { color: colors.gray600 }]}>Completed</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <View style={[styles.statIconContainer, { backgroundColor: colors.success + '15' }]}>
                <Ionicons name="wallet" size={20} color={colors.success} />
              </View>
              <Text style={[styles.statValue, { color: colors.gray900 }]}>₹1.2L</Text>
              <Text style={[styles.statLabel, { color: colors.gray600 }]}>Earned</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <View style={[styles.statIconContainer, { backgroundColor: colors.warning + '15' }]}>
                <Ionicons name="star" size={20} color={colors.warning} />
              </View>
              <Text style={[styles.statValue, { color: colors.gray900 }]}>4.8</Text>
              <Text style={[styles.statLabel, { color: colors.gray600 }]}>Rating</Text>
            </View>
          </View>
        )}

        {/* Credits Section - Compact */}
        <View style={[styles.creditsCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.creditsRow}>
            <View style={[styles.creditsIconContainer, { backgroundColor: colors.primary + '15' }]}>
              <Ionicons name="eye" size={20} color={colors.primary} />
            </View>
            <View style={styles.creditsInfo}>
              <Text style={[styles.creditsTitle, { color: colors.gray900 }]}>Profile Views</Text>
              <Text style={[styles.creditsSubtitle, { color: colors.gray600 }]}>
                {hasUnlimitedAccess
                  ? 'Unlimited access active'
                  : `${profileViews} free views remaining`
                }
              </Text>
            </View>
            <TouchableOpacity
              style={[styles.buyButton, { backgroundColor: colors.primary }]}
              onPress={() => setShowCreditModal(true)}
            >
              <Ionicons name="add" size={18} color={colors.white} />
            </TouchableOpacity>
          </View>
          {!hasUnlimitedAccess && (
            <View style={[styles.progressBar, { backgroundColor: colors.gray200 }]}>
              <View style={[styles.progressFill, { width: `${(profileViews / 5) * 100}%`, backgroundColor: colors.primary }]} />
            </View>
          )}
        </View>

        {/* Options Section */}
        <View style={styles.optionsSection}>
          <Text style={[styles.sectionTitle, { color: colors.gray900 }]}>Account</Text>
          <View style={[styles.optionsContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            {profileOptions.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.optionItem,
                  { borderBottomColor: colors.border },
                  index === profileOptions.length - 1 && styles.lastOption
                ]}
                onPress={option.onPress}
              >
                <View style={styles.optionLeft}>
                  <View style={[styles.optionIcon, { backgroundColor: option.color + '15' }]}>
                    <Ionicons name={option.icon as any} size={20} color={option.color} />
                  </View>
                  <Text style={[styles.optionText, { color: colors.gray900 }]}>{option.title}</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color={colors.gray400} />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Debug Section */}
        <View style={styles.debugSection}>
          <TouchableOpacity
            style={[styles.debugButton, { backgroundColor: colors.surface, borderColor: colors.warning + '30' }]}
            onPress={() => {
              Alert.alert(
                'Reset Credits',
                'This will reset all credit data to test fresh install behavior.',
                [
                  { text: 'Cancel', style: 'cancel' },
                  { text: 'Reset', style: 'destructive', onPress: clearAllData },
                ]
              );
            }}
          >
            <Ionicons name="refresh-outline" size={18} color={colors.warning} />
            <Text style={[styles.debugText, { color: colors.warning }]}>Reset Credits (Debug)</Text>
          </TouchableOpacity>
        </View>

        {/* Sign Out Button */}
        <View style={styles.signOutSection}>
          <TouchableOpacity
            style={[styles.signOutButton, { backgroundColor: colors.surface, borderColor: colors.error + '30' }]}
            onPress={handleSignOut}
          >
            <Ionicons name="log-out-outline" size={20} color={colors.error} />
            <Text style={[styles.signOutText, { color: colors.error }]}>Sign Out</Text>
          </TouchableOpacity>
        </View>

        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={[styles.appVersion, { color: colors.gray500 }]}>Vkire v2.0.0</Text>
          <Text style={[styles.appDescription, { color: colors.gray400 }]}>
            Connect and create with visual professionals
          </Text>
        </View>
      </ScrollView>

      {/* Credits Purchase Modal */}
      <Modal
        visible={showCreditModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCreditModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
              <Text style={[styles.modalTitle, { color: colors.gray900 }]}>Buy Profile Views</Text>
              <TouchableOpacity onPress={() => setShowCreditModal(false)}>
                <Ionicons name="close" size={24} color={colors.gray600} />
              </TouchableOpacity>
            </View>
            <Text style={[styles.modalDescription, { color: colors.gray600 }]}>
              Choose your profile viewing plan:
            </Text>
            <View style={styles.paymentOptions}>
              <TouchableOpacity
                style={[styles.paymentOption, { borderColor: colors.border, backgroundColor: colors.surface }]}
                onPress={() => handlePurchaseCredits('single')}
              >
                <View style={styles.optionHeader}>
                  <Text style={[styles.optionTitle, { color: colors.gray900 }]}>Single View</Text>
                  <Text style={[styles.optionPrice, { color: colors.primary }]}>₹59</Text>
                </View>
                <Text style={[styles.optionDescription, { color: colors.gray600 }]}>View one more profile</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.paymentOption, styles.recommendedOption, { borderColor: colors.primary, backgroundColor: colors.primary + '08' }]}
                onPress={() => handlePurchaseCredits('unlimited')}
              >
                <View style={styles.optionHeader}>
                  <Text style={[styles.optionTitle, { color: colors.gray900 }]}>Unlimited 24h</Text>
                  <Text style={[styles.optionPrice, { color: colors.primary }]}>₹299</Text>
                </View>
                <Text style={[styles.optionDescription, { color: colors.gray600 }]}>Unlimited profile views for 24 hours</Text>
                <View style={[styles.recommendedBadge, { backgroundColor: colors.primary }]}>
                  <Text style={[styles.recommendedText, { color: colors.white }]}>Most Value</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingBottom: Spacing.lg,
    paddingHorizontal: Spacing.lg,
    borderBottomWidth: 1,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  avatarSmall: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    marginRight: Spacing.md,
  },
  headerInfo: {
    flex: 1,
  },
  headerName: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    marginBottom: 2,
  },
  headerEmail: {
    fontSize: Typography.fontSize.sm,
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerMeta: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.md,
    gap: 4,
  },
  roleText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.semiBold,
  },
  locationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.medium,
  },
  statsSection: {
    flexDirection: 'row',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.lg,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'transparent',
    borderRadius: BorderRadius.xl,
    padding: Spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    ...Shadows.sm,
  },
  statIconContainer: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  statValue: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.medium,
  },
  creditsCard: {
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.lg,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    borderWidth: 1,
    ...Shadows.sm,
  },
  creditsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  creditsIconContainer: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  creditsInfo: {
    flex: 1,
  },
  creditsTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semiBold,
    marginBottom: 2,
  },
  creditsSubtitle: {
    fontSize: Typography.fontSize.sm,
  },
  buyButton: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressBar: {
    height: 6,
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: BorderRadius.full,
  },
  optionsSection: {
    marginTop: Spacing.xl,
    paddingHorizontal: Spacing.lg,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semiBold,
    marginBottom: Spacing.md,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  optionsContainer: {
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    overflow: 'hidden',
    ...Shadows.sm,
  },
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.lg,
    borderBottomWidth: 1,
  },
  lastOption: {
    borderBottomWidth: 0,
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionIcon: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  optionText: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.medium,
  },
  debugSection: {
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.xl,
  },
  debugButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    gap: Spacing.sm,
  },
  debugText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
  },
  signOutSection: {
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.md,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.lg,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    gap: Spacing.sm,
    ...Shadows.sm,
  },
  signOutText: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semiBold,
  },
  appInfo: {
    alignItems: 'center',
    padding: Spacing.xl,
    marginTop: Spacing.lg,
  },
  appVersion: {
    fontSize: Typography.fontSize.sm,
    marginBottom: Spacing.xs,
    fontWeight: Typography.fontWeight.medium,
  },
  appDescription: {
    fontSize: Typography.fontSize.xs,
    textAlign: 'center',
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    borderRadius: BorderRadius['2xl'],
    padding: Spacing.xl,
    width: '90%',
    maxWidth: 400,
    ...Shadows.lg,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
  },
  modalDescription: {
    fontSize: Typography.fontSize.base,
    marginBottom: Spacing.lg,
    textAlign: 'center',
  },
  paymentOptions: {
    gap: Spacing.md,
  },
  paymentOption: {
    borderWidth: 1,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    position: 'relative',
  },
  recommendedOption: {
    borderWidth: 2,
  },
  optionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  optionTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semiBold,
  },
  optionPrice: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
  },
  optionDescription: {
    fontSize: Typography.fontSize.sm,
  },
  recommendedBadge: {
    position: 'absolute',
    top: -Spacing.xs,
    right: Spacing.lg,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  recommendedText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.semiBold,
  },
});

export default ProfileScreen;