import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  RefreshControl,
  Alert,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { PortfolioPost, RootStackParamList } from '../types';
import { useTheme } from '../contexts/AppThemeContext';
import { useProfileViews } from '../contexts/ProfileViewContext';
import { useLocation } from '../contexts/LocationContext';
import LocationService from '../services/locationService';
import Logo from '../components/Logo';
import PostCard from '../components/PostCard';
import { Typography, Spacing, BorderRadius, Shadows } from '../constants/designSystem';

type FeedScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Main'>;

const FeedScreen = () => {
  const { colors, theme } = useTheme();
  const [posts, setPosts] = useState<PortfolioPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [savedPosts, setSavedPosts] = useState<Set<string>>(new Set());
  const [lastTap, setLastTap] = useState<number>(0);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedCreatorId, setSelectedCreatorId] = useState<string | null>(null);
  const navigation = useNavigation<FeedScreenNavigationProp>();
  const { profileViews, decrementProfileViews, hasUnlimitedAccess, activateUnlimitedAccess } = useProfileViews();
  const {
    isLocationEnabled,
    isLoading: locationLoading,
    showLocationPrompt,
    currentLocation,
    manualLocation
  } = useLocation();

  useEffect(() => {
    loadPosts();
    checkLocationPermission();
  }, []);

  const checkLocationPermission = async () => {
    if (!isLocationEnabled) {
      // Show location prompt on first app launch
      await showLocationPrompt();
    }
  };

  const loadPosts = async () => {
    try {
      // Mock professionals data with location coordinates
      const mockProfessionals = [
        { id: 'pro1', name: 'Sarah Johnson', city: 'Delhi', latitude: 28.6139, longitude: 77.2090 },
        { id: 'pro2', name: 'Mike Chen', city: 'Mumbai', latitude: 19.0760, longitude: 72.8777 },
        { id: 'pro3', name: 'Emma Davis', city: 'Bangalore', latitude: 12.9716, longitude: 77.5946 },
        { id: 'pro4', name: 'Alex Kumar', city: 'Delhi', latitude: 28.7041, longitude: 77.1025 },
        { id: 'pro5', name: 'Lisa Wang', city: 'Mumbai', latitude: 19.0176, longitude: 72.8562 },
      ];

      // Mock data with location coordinates for proximity sorting
      const mockPosts: PortfolioPost[] = [
        {
          id: '1',
          pro_id: 'pro1',
          media_url: 'https://via.placeholder.com/400x400/007AFF/FFFFFF?text=Wedding+Photo',
          media_type: 'image',
          caption: 'Beautiful wedding photography session in Delhi. Capturing those precious moments that last a lifetime ✨',
          tags: ['wedding', 'photography', 'delhi', 'love'],
          created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
          likes_count: 24,
          comments_count: 5,
          professional: mockProfessionals[0], // Add professional data
        },
        {
          id: '2',
          pro_id: 'pro2',
          media_url: 'https://via.placeholder.com/400x400/34C759/FFFFFF?text=Product+Photo',
          media_type: 'image',
          caption: 'Product photography for e-commerce brands. Clean, professional shots that convert! 📸',
          tags: ['product', 'commercial', 'ecommerce'],
          created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
          likes_count: 18,
          comments_count: 3,
          professional: mockProfessionals[1], // Add professional data
        },
        {
          id: '3',
          pro_id: 'pro3',
          media_url: 'https://via.placeholder.com/400x400/FF9500/FFFFFF?text=Fashion+Portfolio',
          media_type: 'image',
          caption: 'Fashion portfolio shoot for upcoming model. Mumbai vibes! 🌟',
          tags: ['fashion', 'portfolio', 'model', 'mumbai'],
          created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
          likes_count: 42,
          comments_count: 8,
          professional: mockProfessionals[2], // Add professional data
        },
      ];

      // Sort posts by proximity if location is enabled
      let sortedPosts = mockPosts;
      if (isLocationEnabled && (currentLocation || manualLocation)) {
        if (currentLocation) {
          // Sort by GPS distance
          sortedPosts = mockPosts
            .map(post => ({
              ...post,
              distance: post.professional
                ? LocationService.calculateDistance(
                  currentLocation.latitude,
                  currentLocation.longitude,
                  post.professional.latitude,
                  post.professional.longitude
                )
                : undefined
            }))
            .sort((a, b) => {
              if (a.distance === undefined && b.distance === undefined) return 0;
              if (a.distance === undefined) return 1;
              if (b.distance === undefined) return -1;
              return a.distance - b.distance;
            });
        } else if (manualLocation) {
          // Sort by city match first, then by other criteria
          sortedPosts = mockPosts.sort((a, b) => {
            const aCityMatch = a.professional?.city?.toLowerCase().includes(manualLocation.toLowerCase()) ? 0 : 1;
            const bCityMatch = b.professional?.city?.toLowerCase().includes(manualLocation.toLowerCase()) ? 0 : 1;

            if (aCityMatch !== bCityMatch) return aCityMatch - bCityMatch;

            // If both match or both don't match, sort by likes
            return (b.likes_count || 0) - (a.likes_count || 0);
          });
        }
      }

      setPosts(sortedPosts);
    } catch (error) {
      console.error('Error loading posts:', error);
      Alert.alert('Error', 'Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadPosts();
    setRefreshing(false);
  };

  const handleLike = async (postId: string) => {
    const isLiked = likedPosts.has(postId);

    // Toggle like state
    if (isLiked) {
      setLikedPosts(prev => {
        const newSet = new Set(prev);
        newSet.delete(postId);
        return newSet;
      });
    } else {
      setLikedPosts(prev => new Set(prev).add(postId));
    }

    console.debug('Like post:', postId, isLiked ? 'unliked' : 'liked');
  };

  const handleComment = (postId: string) => {
    // TODO: Navigate to comment screen or show comment modal
    Alert.alert('Comments', 'Comment functionality will be implemented soon!');
    console.debug('Comment on post:', postId);
  };

  const handleShare = (postId: string) => {
    // TODO: Implement proper sharing functionality
    Alert.alert('Share', 'Share functionality will be implemented soon!');
    console.debug('Share post:', postId);
  };

  const handleSave = (postId: string) => {
    const isSaved = savedPosts.has(postId);

    // Toggle save state
    if (isSaved) {
      setSavedPosts(prev => {
        const newSet = new Set(prev);
        newSet.delete(postId);
        return newSet;
      });
      Alert.alert('Removed', 'Post removed from saved items');
    } else {
      setSavedPosts(prev => new Set(prev).add(postId));
      Alert.alert('Saved', 'Post saved to your collection');
    }

    console.debug('Save post:', postId, isSaved ? 'unsaved' : 'saved');
  };

  const handleDoubleTap = (postId: string) => {
    const now = Date.now();
    const DOUBLE_PRESS_DELAY = 300;

    if (lastTap && (now - lastTap) < DOUBLE_PRESS_DELAY) {
      // Double tap detected
      handleLike(postId);
      setLastTap(0);
    } else {
      setLastTap(now);
    }
  };

  const handleCreatorPress = (proId: string) => {
    if (hasUnlimitedAccess || profileViews > 0) {
      if (!hasUnlimitedAccess) {
        decrementProfileViews();
      }
      navigation.navigate('CreatorProfile', { proId });
    } else {
      setSelectedCreatorId(proId);
      setShowPaymentModal(true);
    }
  };

  const handlePaymentOption = (option: 'single' | 'unlimited') => {
    setShowPaymentModal(false);
    if (option === 'unlimited') {
      activateUnlimitedAccess();
      Alert.alert(
        'Unlimited Access Activated!',
        'You now have unlimited profile views for 24 hours.',
        [{ text: 'OK' }]
      );
    } else {
      Alert.alert(
        'Profile View Purchased!',
        'You can now view this profile.',
        [{ text: 'OK' }]
      );
    }
    if (selectedCreatorId) {
      navigation.navigate('CreatorProfile', { proId: selectedCreatorId });
    }
  };

  // Helper functions
  const formatTimestamp = (timestamp: string) => {
    const now = new Date();
    const postTime = new Date(timestamp);
    const diffInHours = Math.floor((now.getTime() - postTime.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now.getTime() - postTime.getTime()) / (1000 * 60));
      return `${diffInMinutes}m`;
    } else if (diffInHours < 24) {
      return `${diffInHours}h`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d`;
    }
  };

  const getCreatorName = (proId: string) => {
    const names: { [key: string]: { name: string; handle: string } } = {
      'pro1': { name: 'Raj Photography', handle: 'raj_photography' },
      'pro2': { name: 'Mumbai Studios', handle: 'mumbai_studios' },
      'pro3': { name: 'Delhi Lens', handle: 'delhi_lens' },
    };
    return names[proId] || { name: 'Professional', handle: 'pro_handle' };
  };

  const renderPost = ({ item }: { item: PortfolioPost }) => {
    return (
      <PostCard
        item={item}
        isLiked={likedPosts.has(item.id)}
        isSaved={savedPosts.has(item.id)}
        onLike={handleLike}
        onComment={handleComment}
        onShare={handleShare}
        onSave={handleSave}
        onPressCreator={handleCreatorPress}
        onDoubleTap={handleDoubleTap}
      />
    );
  };

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <View style={styles.skeletonContainer}>
          <View style={[styles.skeletonHeader, { backgroundColor: colors.gray200 }]} />
          <View style={[styles.skeletonMedia, { backgroundColor: colors.gray200 }]} />
          <View style={[styles.skeletonContent, { backgroundColor: colors.gray200 }]} />
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Modern Header */}
      <View style={[styles.header, { backgroundColor: colors.white, borderBottomColor: colors.gray200 }]}>
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <Logo size="small" />
            <View>
              <Text style={[styles.headerTitle, { color: colors.gray900 }]}>Feed</Text>
              {isLocationEnabled && (
                <View style={styles.locationContainer}>
                  <Ionicons name="location" size={12} color={colors.primary} />
                  <Text style={[styles.locationText, { color: colors.primary }]}>
                    {manualLocation || currentLocation?.city || 'Location enabled'}
                  </Text>
                </View>
              )}
            </View>
          </View>
          <TouchableOpacity
            style={[styles.headerButton, { backgroundColor: colors.gray50 }]}
            activeOpacity={0.7}
            onPress={() => {
              // Navigate to notifications/chat screen
              navigation.navigate('Inbox');
            }}
          >
            <Ionicons name="notifications-outline" size={24} color={colors.primary} />
            {/* Unread notification badge */}
            <View style={[styles.notificationBadge, { backgroundColor: colors.error, borderColor: colors.white }]}>
              <Text style={[styles.notificationBadgeText, { color: colors.white }]}>3</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="images-outline" size={64} color={colors.gray400} />
            <Text style={[styles.emptyTitle, { color: colors.gray600 }]}>No posts yet</Text>
            <Text style={[styles.emptySubtitle, { color: colors.gray500 }]}>
              Be the first to share your photography work
            </Text>
          </View>
        }
      />

      {/* Payment Modal */}
      <Modal
        visible={showPaymentModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowPaymentModal(false)}
      >
        <View style={[styles.modalOverlay, { backgroundColor: colors.black + '66' }]}>
          <View style={[styles.modalContent, { backgroundColor: colors.white }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.gray900 }]}>View Profile</Text>
              <TouchableOpacity onPress={() => setShowPaymentModal(false)}>
                <Ionicons name="close" size={24} color={colors.gray600} />
              </TouchableOpacity>
            </View>
            <Text style={[styles.modalDescription, { color: colors.gray600 }]}>
              You've used all your free profile views. Choose an option to continue:
            </Text>
            <View style={styles.paymentOptions}>
              <TouchableOpacity
                style={[styles.paymentOption, { borderColor: colors.gray200 }]}
                onPress={() => handlePaymentOption('single')}
              >
                <View style={styles.optionHeader}>
                  <Text style={[styles.optionTitle, { color: colors.gray900 }]}>View This Profile</Text>
                  <Text style={[styles.optionPrice, { color: colors.primary }]}>₹59</Text>
                </View>
                <Text style={[styles.optionDescription, { color: colors.gray600 }]}>One-time access to this profile</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.paymentOption, styles.recommendedOption, { borderColor: colors.primary, backgroundColor: colors.primary + '08' }]}
                onPress={() => handlePaymentOption('unlimited')}
              >
                <View style={styles.optionHeader}>
                  <Text style={[styles.optionTitle, { color: colors.gray900 }]}>Unlimited Today</Text>
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

  // Modern Header Styles
  header: {
    paddingTop: 50,
    paddingBottom: Spacing.lg,
    paddingHorizontal: Spacing.xl,
    borderBottomWidth: 0.5,
    borderBottomColor: '#E5E7EB', // Static gray200
    backgroundColor: '#FFFFFF', // Static white
    ...Shadows.sm,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: Typography.fontSize['2xl'],
    fontWeight: Typography.fontWeight.bold,
    marginLeft: Spacing.md,
    letterSpacing: 0.3,
    color: '#1F2937', // Static gray900
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: Spacing.md,
    marginTop: 2,
  },
  locationText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.medium,
    marginLeft: 4,
    color: '#007AFF', // Static primary
  },
  headerButton: {
    padding: Spacing.sm,
    borderRadius: BorderRadius.lg,
    position: 'relative',
    backgroundColor: '#F8F9FA', // Static gray50
  },
  notificationBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    borderRadius: BorderRadius.full,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    backgroundColor: '#EF4444', // Static error
    borderColor: '#FFFFFF', // Static white
  },
  notificationBadgeText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.bold,
    textAlign: 'center',
    color: '#FFFFFF', // Static white
  },

  // Loading States
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA', // Static background
  },
  skeletonContainer: {
    width: '90%',
    maxWidth: 400,
  },
  skeletonHeader: {
    height: 60,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.lg,
    backgroundColor: '#E5E7EB', // Static gray200
  },
  skeletonMedia: {
    height: 300,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.lg,
    backgroundColor: '#E5E7EB', // Static gray200
  },
  skeletonContent: {
    height: 80,
    borderRadius: BorderRadius.lg,
    backgroundColor: '#E5E7EB', // Static gray200
  },

  // List Styles
  listContainer: {
    paddingBottom: Spacing['2xl'],
  },

  // Post Card Styles
  postCard: {
    borderRadius: BorderRadius['2xl'],
    marginHorizontal: Spacing.lg,
    marginVertical: Spacing.sm,
    backgroundColor: '#FFFFFF', // Static white
    ...Shadows.lg,
    overflow: 'hidden',
    borderWidth: 0.5,
    borderColor: '#E5E7EB', // Static gray100
  },

  // Post Header
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  creatorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarContainer: {
    marginRight: Spacing.md,
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    backgroundColor: '#F3F4F6', // Static gray100
    borderColor: '#E5E7EB', // Static gray200
  },
  creatorDetails: {
    flex: 1,
  },
  creatorName: {
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.bold,
    marginBottom: 2,
    color: '#1F2937', // Static gray900
  },
  creatorHandle: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.regular,
    color: '#6B7280', // Hardcoded static hex, as this is a specific gray that doesn't change with theme
  },
  creatorLocationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  creatorLocation: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.medium,
    marginLeft: 4,
    color: '#6B7280', // Static gray500
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timestamp: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.medium,
    marginRight: Spacing.sm,
    color: '#6B7280', // Static gray500
  },
  moreButton: {
    padding: Spacing.xs,
  },

  // Media Styles
  mediaContainer: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#F3F4F6', // Static gray100
  },
  media: {
    width: '100%',
    height: '100%',
  },

  // Action Buttons
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  leftActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    marginRight: Spacing.xl,
    padding: Spacing.xs,
  },
  bookmarkButton: {
    padding: Spacing.xs,
  },

  // Post Content
  postContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
  },
  likesContainer: {
    marginBottom: Spacing.sm,
  },
  likesText: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.medium,
    color: '#4B5563', // Static gray700
  },
  likesCount: {
    fontWeight: Typography.fontWeight.bold,
    color: '#1F2937', // Static black
  },
  caption: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.regular,
    lineHeight: Typography.lineHeight.relaxed * Typography.fontSize.base,
    marginBottom: Spacing.sm,
    color: '#1F2937', // Static black
  },
  creatorNameInline: {
    fontWeight: Typography.fontWeight.bold,
    color: '#1F2937', // Static black
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: Spacing.sm,
  },
  tag: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.medium,
    marginRight: Spacing.sm,
    marginBottom: Spacing.xs,
    color: '#007AFF', // Static primary
  },

  // Empty State
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing['6xl'],
    paddingHorizontal: Spacing.xl,
  },
  emptyTitle: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.semiBold,
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
    color: '#4B5563', // Static gray600
  },
  emptySubtitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.regular,
    textAlign: 'center',
    lineHeight: Typography.lineHeight.relaxed * Typography.fontSize.base,
    color: '#6B7280', // Static gray500
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF', // Static white
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
    color: '#1F2937', // Static gray900
  },
  modalDescription: {
    fontSize: Typography.fontSize.base,
    marginBottom: Spacing.lg,
    textAlign: 'center',
    color: '#4B5563', // Static gray600
  },
  paymentOptions: {
    gap: Spacing.md,
  },
  paymentOption: {
    borderWidth: 1,
    borderColor: '#E5E7EB', // Static gray200
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    position: 'relative',
  },
  recommendedOption: {
    borderColor: '#007AFF', // Static primary
    backgroundColor: '#007AFF08', // Static primary + '08'
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
    color: '#1F2937', // Static gray900
  },
  optionPrice: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: '#007AFF', // Static primary
  },
  optionDescription: {
    fontSize: Typography.fontSize.sm,
    color: '#4B5563', // Static gray600
  },
  recommendedBadge: {
    position: 'absolute',
    top: -Spacing.xs,
    right: Spacing.lg,
    backgroundColor: '#007AFF', // Static primary
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  recommendedText: {
    color: '#FFFFFF', // Static white
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.semiBold,
  },
});

export default FeedScreen;