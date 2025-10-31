import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Modal,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { useProfileViews } from '../contexts/ProfileViewContext';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../constants/designSystem';
import { useTheme } from '../contexts/ThemeContext';

type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Profile'>;

const ProfileScreen = () => {
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const { user, signOut } = useAuth();
  const { profileViews, hasUnlimitedAccess, activateUnlimitedAccess, clearAllData } = useProfileViews();
  const [showCreditModal, setShowCreditModal] = useState(false);
  const { theme, colors } = useTheme();

  // Profile completion check
  const getProfileCompletionPercentage = () => {
    if (!user) return 0;
    
    const requiredFields = ['name', 'email', 'city'];
    const optionalFields = ['phone', 'bio', 'avatar_url', 'website', 'instagram'];
    
    let completedFields = 0;
    let totalFields = requiredFields.length + optionalFields.length;
    
    // Check required fields
    requiredFields.forEach(field => {
      if (user[field as keyof typeof user] && user[field as keyof typeof user] !== '') {
        completedFields++;
      }
    });
    
    // Check optional fields (weighted less)
    optionalFields.forEach(field => {
      if (user[field as keyof typeof user] && user[field as keyof typeof user] !== '') {
        completedFields += 0.5;
      }
    });
    
    return Math.round((completedFields / totalFields) * 100);
  };

  const profileCompletion = getProfileCompletionPercentage();

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
    },
    {
      title: 'Payment Methods',
      icon: 'card-outline',
      onPress: () => navigation.navigate('PaymentMethods'),
    },
    {
      title: 'Notifications',
      icon: 'notifications-outline',
      onPress: () => navigation.navigate('NotificationSettings'),
    },
    {
      title: 'Help & Support',
      icon: 'help-circle-outline',
      onPress: () => navigation.navigate('HelpSupport'),
    },
    {
      title: 'Settings',
      icon: 'settings-outline',
      onPress: () => navigation.navigate('Settings'),
    },
  ];

  if (user?.role === 'pro') {
    profileOptions.splice(1, 0, {
      title: 'My Services',
      icon: 'briefcase-outline',
      onPress: () => console.log('My Services'),
    });
    profileOptions.splice(2, 0, {
      title: 'Portfolio',
      icon: 'images-outline',
      onPress: () => console.log('Portfolio'),
    });
    profileOptions.splice(3, 0, {
      title: 'Earnings',
      icon: 'trending-up-outline',
      onPress: () => console.log('Earnings'),
    });
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Modern Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Profile</Text>
          </View>
        </View>

        {/* Profile Section */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatarPlaceholder}>
              <Ionicons name="person" size={50} color={colors.textSecondary} />
            </View>
            <TouchableOpacity style={styles.editAvatarButton}>
              <Ionicons name="camera" size={16} color={colors.white} />
            </TouchableOpacity>
          </View>
          <Text style={styles.userName}>{user?.name || 'User'}</Text>
          <Text style={styles.userEmail}>{user?.email}</Text>
          <View style={styles.userBadge}>
            <Text style={styles.userRole}>
              {user?.role === 'pro' ? 'Professional' : 'Customer'}
            </Text>
          </View>
          
          {/* Profile Completion Indicator */}
          <View style={styles.profileCompletionContainer}>
            <View style={styles.profileCompletionHeader}>
              <Text style={styles.profileCompletionLabel}>Profile Completion</Text>
              <Text style={styles.profileCompletionPercentage}>{profileCompletion}%</Text>
            </View>
            <View style={styles.profileCompletionBar}>
              <View 
                style={[
                  styles.profileCompletionProgress, 
                  { width: `${profileCompletion}%` }
                ]} 
              />
            </View>
            {profileCompletion < 100 && (
              <Text style={styles.profileCompletionHint}>
                Complete your profile to get more visibility
              </Text>
            )}
          </View>
          {user?.city && (
            <View style={styles.locationContainer}>
              <Ionicons name="location-outline" size={16} color={colors.textSecondary} />
              <Text style={styles.userLocation}>{user.city}</Text>
            </View>
          )}
        </View>

        {/* Credits Section */}
        <View style={styles.creditsCard}>
          <View style={styles.creditsHeader}>
            <View style={styles.creditsIcon}>
              <Ionicons name="eye" size={24} color={colors.primary} />
            </View>
            <View style={styles.creditsInfo}>
              <Text style={styles.creditsTitle}>Profile Views</Text>
              <Text style={styles.creditsSubtitle}>
                {hasUnlimitedAccess 
                  ? 'Unlimited access active' 
                  : `${profileViews} free views remaining`
                }
              </Text>
            </View>
            <TouchableOpacity 
              style={styles.buyCreditsButton}
              onPress={() => setShowCreditModal(true)}
            >
              <Text style={styles.buyCreditsText}>Buy More</Text>
            </TouchableOpacity>
          </View>
          {!hasUnlimitedAccess && (
            <View style={styles.creditsProgress}>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${(profileViews / 5) * 100}%` }]} />
              </View>
              <Text style={styles.progressText}>{profileViews}/5</Text>
            </View>
          )}
        </View>

        {/* Options Section */}
        <View style={styles.optionsContainer}>
          {profileOptions.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={styles.optionItem}
              onPress={option.onPress}
            >
              <View style={styles.optionLeft}>
                <View style={styles.optionIconContainer}>
                  <Ionicons name={option.icon as any} size={20} color={colors.primary} />
                </View>
                <Text style={styles.optionText}>{option.title}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Debug Button - Remove in production */}
        <View style={styles.signOutContainer}>
          <TouchableOpacity 
            style={[styles.signOutButton, { backgroundColor: colors.warning + '20' }]} 
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
            <Ionicons name="refresh-outline" size={20} color={colors.warning} />
            <Text style={[styles.signOutText, { color: colors.warning }]}>Reset Credits (Debug)</Text>
          </TouchableOpacity>
        </View>

        {/* Sign Out Button */}
        <View style={styles.signOutContainer}>
          <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
            <Ionicons name="log-out-outline" size={20} color={colors.error} />
            <Text style={styles.signOutText}>Sign Out</Text>
          </TouchableOpacity>
        </View>

        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={styles.appVersion}>Vkire v2.0.0</Text>
          <Text style={styles.appDescription}>
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
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Buy Profile Views</Text>
              <TouchableOpacity onPress={() => setShowCreditModal(false)}>
                <Ionicons name="close" size={24} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
            <Text style={styles.modalDescription}>
              Choose your profile viewing plan:
            </Text>
            <View style={styles.paymentOptions}>
              <TouchableOpacity
                style={styles.paymentOption}
                onPress={() => handlePurchaseCredits('single')}
              >
                <View style={styles.optionHeader}>
                  <Text style={styles.optionTitle}>Single View</Text>
                  <Text style={styles.optionPrice}>₹59</Text>
                </View>
                <Text style={styles.optionDescription}>View one more profile</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.paymentOption, styles.recommendedOption]}
                onPress={() => handlePurchaseCredits('unlimited')}
              >
                <View style={styles.optionHeader}>
                  <Text style={styles.optionTitle}>Unlimited 24h</Text>
                  <Text style={styles.optionPrice}>₹299</Text>
                </View>
                <Text style={styles.optionDescription}>Unlimited profile views for 24 hours</Text>
                <View style={styles.recommendedBadge}>
                  <Text style={styles.recommendedText}>Most Value</Text>
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
    backgroundColor: Colors.gray50,
  },
  header: {
    backgroundColor: Colors.white,
    paddingTop: 50,
    paddingBottom: Spacing.lg,
    paddingHorizontal: Spacing.xl,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.gray200,
    ...Shadows.sm,
  },
  headerContent: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: Typography.fontSize['2xl'],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.gray900,
    textAlign: 'center',
  },
  profileHeader: {
    backgroundColor: Colors.white,
    alignItems: 'center',
    padding: Spacing['2xl'],
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.lg,
    borderRadius: BorderRadius['2xl'],
    ...Shadows.lg,
    borderWidth: 0.5,
    borderColor: Colors.gray100,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: Spacing.lg,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.gray100,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: Colors.white,
    ...Shadows.md,
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: Colors.primary,
    width: 32,
    height: 32,
    borderRadius: BorderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: Colors.white,
  },
  userName: {
    fontSize: Typography.fontSize['2xl'],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.gray900,
    marginBottom: Spacing.xs,
  },
  userEmail: {
    fontSize: Typography.fontSize.base,
    color: Colors.gray600,
    marginBottom: Spacing.md,
  },
  userBadge: {
    backgroundColor: Colors.primary + '15',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    marginBottom: Spacing.md,
  },
  userRole: {
    fontSize: Typography.fontSize.sm,
    color: Colors.primary,
    fontWeight: Typography.fontWeight.semiBold,
  },
  profileCompletionContainer: {
    width: '100%',
    marginTop: Spacing.md,
  },
  profileCompletionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  profileCompletionLabel: {
    fontSize: Typography.fontSize.sm,
    color: Colors.gray700,
    fontWeight: Typography.fontWeight.medium,
  },
  profileCompletionPercentage: {
    fontSize: Typography.fontSize.sm,
    color: Colors.primary,
    fontWeight: Typography.fontWeight.bold,
  },
  profileCompletionBar: {
    height: 6,
    backgroundColor: Colors.gray200,
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
  },
  profileCompletionProgress: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.full,
  },
  profileCompletionHint: {
    fontSize: Typography.fontSize.xs,
    color: Colors.gray500,
    textAlign: 'center',
    marginTop: Spacing.xs,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  userLocation: {
    fontSize: Typography.fontSize.sm,
    color: Colors.gray600,
  },
  creditsCard: {
    backgroundColor: Colors.white,
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.lg,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    ...Shadows.md,
  },
  creditsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  creditsIcon: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.xl,
    backgroundColor: Colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  creditsInfo: {
    flex: 1,
  },
  creditsTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semiBold,
    color: Colors.gray900,
    marginBottom: Spacing.xs,
  },
  creditsSubtitle: {
    fontSize: Typography.fontSize.sm,
    color: Colors.gray600,
  },
  buyCreditsButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.lg,
  },
  buyCreditsText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semiBold,
    color: Colors.white,
  },
  creditsProgress: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: Colors.gray200,
    borderRadius: BorderRadius.sm,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.sm,
  },
  progressText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semiBold,
    color: Colors.gray600,
  },
  optionsContainer: {
    backgroundColor: Colors.white,
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.lg,
    borderRadius: BorderRadius.xl,
    ...Shadows.md,
  },
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray100,
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.primary + '10',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  optionText: {
    fontSize: Typography.fontSize.base,
    color: Colors.gray900,
    fontWeight: Typography.fontWeight.medium,
  },
  signOutContainer: {
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.lg,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
    padding: Spacing.lg,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: Colors.error + '30',
    ...Shadows.md,
  },
  signOutText: {
    fontSize: Typography.fontSize.base,
    color: Colors.error,
    marginLeft: Spacing.sm,
    fontWeight: Typography.fontWeight.semiBold,
  },
  appInfo: {
    alignItems: 'center',
    padding: Spacing['2xl'],
    marginTop: Spacing.lg,
  },
  appVersion: {
    fontSize: Typography.fontSize.sm,
    color: Colors.gray500,
    marginBottom: Spacing.xs,
    fontWeight: Typography.fontWeight.medium,
  },
  appDescription: {
    fontSize: Typography.fontSize.xs,
    color: Colors.gray400,
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
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    width: '90%',
    maxWidth: 400,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  modalTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semiBold,
    color: Colors.gray900,
  },
  modalDescription: {
    fontSize: Typography.fontSize.base,
    color: Colors.gray600,
    marginBottom: Spacing.lg,
    textAlign: 'center',
  },
  paymentOptions: {
    gap: Spacing.md,
  },
  paymentOption: {
    borderWidth: 1,
    borderColor: Colors.gray200,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    position: 'relative',
  },
  recommendedOption: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + '08',
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
    color: Colors.gray900,
  },
  optionPrice: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.primary,
  },
  optionDescription: {
    fontSize: Typography.fontSize.sm,
    color: Colors.gray600,
  },
  recommendedBadge: {
    position: 'absolute',
    top: -Spacing.xs,
    right: Spacing.lg,
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  recommendedText: {
    color: Colors.white,
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.semiBold,
  },
});

export default ProfileScreen;