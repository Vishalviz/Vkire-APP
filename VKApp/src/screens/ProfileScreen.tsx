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
import { Typography, Spacing, BorderRadius, Shadows } from '../constants/designSystem';
import { useTheme } from '../contexts/AppThemeContext';

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
        <View style={[styles.header, { backgroundColor: colors.white, borderBottomColor: colors.gray200 }]}>
          <View style={styles.headerContent}>
            <Text style={[styles.headerTitle, { color: colors.gray900 }]}>Profile</Text>
          </View>
        </View>

        {/* Profile Section */}
        <View style={[styles.profileHeader, { backgroundColor: colors.white, borderColor: '#E5E7EB' }]}>
          <View style={styles.avatarContainer}>
            <View style={[styles.avatarPlaceholder, { backgroundColor: '#F3F4F6', borderColor: '#FFFFFF' }]}>
              <Ionicons name="person" size={50} color={colors.gray500} />
            </View>
            <TouchableOpacity style={[styles.editAvatarButton, { backgroundColor: '#007AFF', borderColor: '#FFFFFF' }]}>
              <Ionicons name="camera" size={16} color={colors.white} />
            </TouchableOpacity>
          </View>
          <Text style={[styles.userName, { color: '#1F2937' }]}>{user?.name || 'User'}</Text>
          <Text style={[styles.userEmail, { color: '#4B5563' }]}>{user?.email}</Text>
          <View style={[styles.userBadge, { backgroundColor: '#007AFF15' }]}>
            <Text style={[styles.userRole, { color: '#007AFF' }]}>
              {user?.role === 'pro' ? 'Professional' : 'Customer'}
            </Text>
          </View>
          
          {/* Profile Completion Indicator */}
          <View style={styles.profileCompletionContainer}>
            <View style={styles.profileCompletionHeader}>
              <Text style={[styles.profileCompletionLabel, { color: '#4B5563' }]}>Profile Completion</Text>
              <Text style={[styles.profileCompletionPercentage, { color: '#007AFF' }]}>{profileCompletion}%</Text>
            </View>
            <View style={[styles.profileCompletionBar, { backgroundColor: '#E5E7EB' }]}>
              <View 
                style={[
                  styles.profileCompletionProgress, 
                  { width: `${profileCompletion}%`, backgroundColor: '#007AFF' }
                ]} 
              />
            </View>
            {profileCompletion < 100 && (
              <Text style={[styles.profileCompletionHint, { color: '#6B7280' }]}>
                Complete your profile to get more visibility
              </Text>
            )}
          </View>
          {user?.city && (
            <View style={styles.locationContainer}>
              <Ionicons name="location-outline" size={16} color={colors.gray600} />
              <Text style={[styles.userLocation, { color: '#4B5563' }]}>{user.city}</Text>
            </View>
          )}
        </View>

        {/* Credits Section */}
        <View style={[styles.creditsCard, { backgroundColor: '#FFFFFF' }]}>
          <View style={styles.creditsHeader}>
            <View style={[styles.creditsIcon, { backgroundColor: '#007AFF15' }]}>
              <Ionicons name="eye" size={24} color={colors.primary} />
            </View>
            <View style={styles.creditsInfo}>
              <Text style={[styles.creditsTitle, { color: '#1F2937' }]}>Profile Views</Text>
              <Text style={[styles.creditsSubtitle, { color: '#4B5563' }]}>
                {hasUnlimitedAccess 
                  ? 'Unlimited access active' 
                  : `${profileViews} free views remaining`
                }
              </Text>
            </View>
            <TouchableOpacity 
              style={[styles.buyCreditsButton, { backgroundColor: '#007AFF' }]}
              onPress={() => setShowCreditModal(true)}
            >
              <Text style={[styles.buyCreditsText, { color: '#FFFFFF' }]}>Buy More</Text>
            </TouchableOpacity>
          </View>
          {!hasUnlimitedAccess && (
            <View style={styles.creditsProgress}>
              <View style={[styles.progressBar, { backgroundColor: '#E5E7EB' }]}>
                <View style={[styles.progressFill, { width: `${(profileViews / 5) * 100}%`, backgroundColor: '#007AFF' }]} />
              </View>
              <Text style={[styles.progressText, { color: '#4B5563' }]}>{profileViews}/5</Text>
            </View>
          )}
        </View>

        {/* Options Section */}
        <View style={[styles.optionsContainer, { backgroundColor: '#FFFFFF' }]}>
          {profileOptions.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.optionItem, { borderBottomColor: '#E5E7EB' }]}
              onPress={option.onPress}
            >
              <View style={styles.optionLeft}>
                <View style={[styles.optionIconContainer, { backgroundColor: '#007AFF10' }]}>
                  <Ionicons name={option.icon as any} size={20} color={colors.primary} />
                </View>
                <Text style={[styles.optionText, { color: '#1F2937' }]}>{option.title}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.gray600} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Debug Button - Remove in production */}
        <View style={styles.signOutContainer}>
          <TouchableOpacity 
            style={[styles.signOutButton, { backgroundColor: '#FFFFFF', borderColor: '#EF444430' }]} 
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
            <Text style={[styles.signOutText, { color: '#EF4444', fontWeight: Typography.fontWeight.semiBold }]}>Reset Credits (Debug)</Text>
          </TouchableOpacity>
        </View>

        {/* Sign Out Button */}
        <View style={styles.signOutContainer}>
          <TouchableOpacity style={[styles.signOutButton, { backgroundColor: '#FFFFFF', borderColor: '#EF444430' }]} onPress={handleSignOut}>
            <Ionicons name="log-out-outline" size={20} color={colors.error} />
            <Text style={[styles.signOutText, { color: '#EF4444', fontWeight: Typography.fontWeight.semiBold }]}>Sign Out</Text>
          </TouchableOpacity>
        </View>

        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={[styles.appVersion, { color: '#6B7280', fontWeight: Typography.fontWeight.medium }]}>Vkire v2.0.0</Text>
          <Text style={[styles.appDescription, { color: '#9CA3AF' }]}>
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
        <View style={[styles.modalOverlay, { backgroundColor: 'rgba(0, 0, 0, 0.5)' }]}>
          <View style={[styles.modalContent, { backgroundColor: '#FFFFFF' }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: '#1F2937', fontWeight: Typography.fontWeight.semiBold }]}>Buy Profile Views</Text>
              <TouchableOpacity onPress={() => setShowCreditModal(false)}>
                <Ionicons name="close" size={24} color={colors.gray600} />
              </TouchableOpacity>
            </View>
            <Text style={[styles.modalDescription, { color: '#4B5563' }]}>
              Choose your profile viewing plan:
            </Text>
            <View style={styles.paymentOptions}>
              <TouchableOpacity
                style={[styles.paymentOption, { borderWidth: 1, borderColor: '#E5E7EB' }]}
                onPress={() => handlePurchaseCredits('single')}
              >
                <View style={styles.optionHeader}>
                  <Text style={[styles.optionTitle, { color: '#1F2937', fontWeight: Typography.fontWeight.semiBold }]}>Single View</Text>
                  <Text style={[styles.optionPrice, { color: '#007AFF' }]}>₹59</Text>
                </View>
                <Text style={[styles.optionDescription, { color: '#4B5563' }]}>View one more profile</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.paymentOption, styles.recommendedOption, { borderColor: '#007AFF', backgroundColor: '#007AFF08' }]}
                onPress={() => handlePurchaseCredits('unlimited')}
              >
                <View style={styles.optionHeader}>
                  <Text style={[styles.optionTitle, { color: '#1F2937', fontWeight: Typography.fontWeight.semiBold }]}>Unlimited 24h</Text>
                  <Text style={[styles.optionPrice, { color: '#007AFF' }]}>₹299</Text>
                </View>
                <Text style={[styles.optionDescription, { color: '#4B5563' }]}>Unlimited profile views for 24 hours</Text>
                <View style={[styles.recommendedBadge, { backgroundColor: '#007AFF' }]}>
                  <Text style={[styles.recommendedText, { color: '#FFFFFF', fontWeight: Typography.fontWeight.semiBold }]}>Most Value</Text>
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
    paddingTop: 50,
    paddingBottom: Spacing.lg,
    paddingHorizontal: Spacing.xl,
    borderBottomWidth: 0.5,
    ...Shadows.sm,
  },
  headerContent: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: Typography.fontSize['2xl'],
    fontWeight: Typography.fontWeight.bold,
    textAlign: 'center',
  },
  profileHeader: {
    alignItems: 'center',
    padding: Spacing['2xl'],
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.lg,
    borderRadius: BorderRadius['2xl'],
    ...Shadows.lg,
    borderWidth: 0.5,
    borderColor: '#E5E7EB', // Static gray100 border
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: Spacing.lg,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: BorderRadius.full,
    backgroundColor: '#F3F4F6', // Static gray100 background
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#FFFFFF', // Static white border
    ...Shadows.md,
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#007AFF', // Static primary background
    width: 32,
    height: 32,
    borderRadius: BorderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF', // Static white border
  },
  userName: {
    fontSize: Typography.fontSize['2xl'],
    fontWeight: Typography.fontWeight.bold,
    color: '#1F2937', // Static gray900 color
    marginBottom: Spacing.xs,
  },
  userEmail: {
    fontSize: Typography.fontSize.base,
    color: '#4B5563', // Static gray600 color
    marginBottom: Spacing.md,
  },
  userBadge: {
    backgroundColor: '#007AFF15', // Static primary + '15' background
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    marginBottom: Spacing.md,
  },
  userRole: {
    fontSize: Typography.fontSize.sm,
    color: '#007AFF', // Static primary color
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
    color: '#4B5563', // Static gray700 color
    fontWeight: Typography.fontWeight.medium,
  },
  profileCompletionPercentage: {
    fontSize: Typography.fontSize.sm,
    color: '#007AFF', // Static primary color
    fontWeight: Typography.fontWeight.bold,
  },
  profileCompletionBar: {
    height: 6,
    backgroundColor: '#E5E7EB', // Static gray200 background
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
  },
  profileCompletionProgress: {
    height: '100%',
    backgroundColor: '#007AFF', // Static primary background
    borderRadius: BorderRadius.full,
  },
  profileCompletionHint: {
    fontSize: Typography.fontSize.xs,
    color: '#6B7280', // Static gray500 color
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
    color: '#4B5563', // Static gray600 color
  },
  creditsCard: {
    backgroundColor: '#FFFFFF', // Static white background
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
    backgroundColor: '#007AFF15', // Static primary + '15' background
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
    color: '#1F2937', // Static gray900 color
    marginBottom: Spacing.xs,
  },
  creditsSubtitle: {
    fontSize: Typography.fontSize.sm,
    color: '#4B5563', // Static gray600 color
  },
  buyCreditsButton: {
    backgroundColor: '#007AFF', // Static primary background
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.lg,
  },
  buyCreditsText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semiBold,
    color: '#FFFFFF', // Static white color
  },
  creditsProgress: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#E5E7EB', // Static gray200 background
    borderRadius: BorderRadius.sm,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#007AFF', // Static primary background
    borderRadius: BorderRadius.sm,
  },
  progressText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semiBold,
    color: '#4B5563', // Static gray600 color
  },
  optionsContainer: {
    backgroundColor: '#FFFFFF', // Static white background
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
    borderColor: '#E5E7EB', // Static gray100 border
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.lg,
    backgroundColor: '#007AFF10', // Static primary + '10' background
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  optionText: {
    fontSize: Typography.fontSize.base,
    color: '#1F2937', // Static gray900 color
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
    backgroundColor: '#FFFFFF', // Static white background
    padding: Spacing.lg,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: '#EF444430', // Static error + '30' border
    ...Shadows.md,
  },
  signOutText: {
    fontSize: Typography.fontSize.base,
    color: '#EF4444', // Static error color
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
    color: '#6B7280', // Static gray500 color
    marginBottom: Spacing.xs,
    fontWeight: Typography.fontWeight.medium,
  },
  appDescription: {
    fontSize: Typography.fontSize.xs,
    color: '#9CA3AF', // Static gray400 color
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
    backgroundColor: '#FFFFFF', // Static white background
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
    color: '#1F2937', // Static gray900 color
  },
  modalDescription: {
    fontSize: Typography.fontSize.base,
    color: '#4B5563', // Static gray600 color
    marginBottom: Spacing.lg,
    textAlign: 'center',
  },
  paymentOptions: {
    gap: Spacing.md,
  },
  paymentOption: {
    borderWidth: 1,
    borderColor: '#E5E7EB', // Static gray200 border
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    position: 'relative',
  },
  recommendedOption: {
    borderColor: '#007AFF', // Static primary border
    backgroundColor: '#007AFF08', // Static primary + '08' background
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
    color: '#1F2937', // Static gray900 color
  },
  optionPrice: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: '#007AFF', // Static primary color
  },
  optionDescription: {
    fontSize: Typography.fontSize.sm,
    color: '#4B5563', // Static gray600 color
  },
  recommendedBadge: {
    position: 'absolute',
    top: -Spacing.xs,
    right: Spacing.lg,
    backgroundColor: '#007AFF', // Static primary background
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  recommendedText: {
    color: '#FFFFFF', // Static white color
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.semiBold,
  },
});

export default ProfileScreen;