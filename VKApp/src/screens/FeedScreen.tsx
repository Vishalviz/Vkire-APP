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
  Animated,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { PortfolioPost, RootStackParamList } from '../types';
import { Colors, Typography, Spacing, BorderRadius, Shadows, Animation } from '../constants/designSystem';
import Logo from '../components/Logo';
import logger from '../utils/logger';
import { useProfileViews } from '../contexts/ProfileViewContext';
import { useLocation } from '../contexts/LocationContext';
import LocationService from '../services/locationService';

type FeedScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Main'>;

const FeedScreen = () => {
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
  
  // Animation refs for micro-interactions
  const likeAnimations = useRef<{ [key: string]: Animated.Value }>({});
  const commentAnimations = useRef<{ [key: string]: Animated.Value }>({});
  const shareAnimations = useRef<{ [key: string]: Animated.Value }>({});

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
      
      // Initialize animation values for each post
      mockPosts.forEach(post => {
        likeAnimations.current[post.id] = new Animated.Value(1);
        commentAnimations.current[post.id] = new Animated.Value(1);
        shareAnimations.current[post.id] = new Animated.Value(1);
      });
    } catch (error) {
      logger.error('Error loading posts:', error);
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
    
    // Animate like button
    const animation = likeAnimations.current[postId];
    if (animation) {
      Animated.sequence([
        Animated.timing(animation, {
          toValue: 0.8,
          duration: Animation.duration.fast,
          useNativeDriver: true,
        }),
        Animated.timing(animation, {
          toValue: 1.1,
          duration: Animation.duration.fast,
          useNativeDriver: true,
        }),
        Animated.timing(animation, {
          toValue: 1,
          duration: Animation.duration.fast,
          useNativeDriver: true,
        }),
      ]).start();
    }
    
    logger.debug('Like post:', postId, isLiked ? 'unliked' : 'liked');
  };

  const handleComment = (postId: string) => {
    // Animate comment button
    const animation = commentAnimations.current[postId];
    if (animation) {
      Animated.sequence([
        Animated.timing(animation, {
          toValue: 0.7,
          duration: Animation.duration.fast,
          useNativeDriver: true,
        }),
        Animated.timing(animation, {
          toValue: 1,
          duration: Animation.duration.fast,
          useNativeDriver: true,
        }),
      ]).start();
    }
    
    // TODO: Navigate to comment screen or show comment modal
    Alert.alert('Comments', 'Comment functionality will be implemented soon!');
    logger.debug('Comment on post:', postId);
  };

  const handleShare = (postId: string) => {
    // Animate share button
    const animation = shareAnimations.current[postId];
    if (animation) {
      Animated.sequence([
        Animated.timing(animation, {
          toValue: 0.8,
          duration: Animation.duration.fast,
          useNativeDriver: true,
        }),
        Animated.timing(animation, {
          toValue: 1.2,
          duration: Animation.duration.fast,
          useNativeDriver: true,
        }),
        Animated.timing(animation, {
          toValue: 1,
          duration: Animation.duration.fast,
          useNativeDriver: true,
        }),
      ]).start();
    }
    
    // TODO: Implement proper sharing functionality
    Alert.alert('Share', 'Share functionality will be implemented soon!');
    logger.debug('Share post:', postId);
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
    
    logger.debug('Save post:', postId, isSaved ? 'unsaved' : 'saved');
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
    const creator = item.professional 
      ? { name: item.professional.name, handle: `@${item.professional.name.toLowerCase().replace(' ', '_')}` }
      : getCreatorName(item.pro_id);
    const isLiked = likedPosts.has(item.id);
    const isSaved = savedPosts.has(item.id);
    const likeAnimation = likeAnimations.current[item.id];
    const commentAnimation = commentAnimations.current[item.id];
    const shareAnimation = shareAnimations.current[item.id];

    return (
      <View style={styles.postCard}>
        {/* Post Header */}
        <View style={styles.postHeader}>
          <TouchableOpacity
            style={styles.creatorInfo}
            onPress={() => handleCreatorPress(item.pro_id)}
          >
            <View style={styles.avatarContainer}>
              <View style={styles.avatarPlaceholder}>
                <Ionicons name="person" size={20} color={Colors.gray500} />
              </View>
            </View>
            <View style={styles.creatorDetails}>
              <Text style={styles.creatorName}>{creator.name}</Text>
              <View style={styles.creatorLocationContainer}>
                <Ionicons name="location" size={12} color={Colors.gray500} />
                <Text style={styles.creatorLocation}>
                  {item.professional?.city || 'Unknown Location'}
                  {item.distance && ` • ${item.distance}km away`}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
          
          <View style={styles.headerActions}>
            <Text style={styles.timestamp}>{formatTimestamp(item.created_at)}</Text>
            <TouchableOpacity style={styles.moreButton}>
              <Ionicons name="ellipsis-horizontal" size={20} color={Colors.gray500} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Media Content */}
        <TouchableOpacity 
          style={styles.mediaContainer}
          onPress={() => handleDoubleTap(item.id)}
          activeOpacity={1}
        >
          <Image source={{ uri: item.media_url }} style={styles.media} />
        </TouchableOpacity>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <View style={styles.leftActions}>
            <Animated.View style={{ transform: [{ scale: likeAnimation }] }}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handleLike(item.id)}
              >
                <Ionicons 
                  name={isLiked ? "heart" : "heart-outline"} 
                  size={24} 
                  color={isLiked ? Colors.likeActive : Colors.gray500} 
                />
              </TouchableOpacity>
            </Animated.View>
            
            <Animated.View style={{ transform: [{ scale: commentAnimation }] }}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handleComment(item.id)}
              >
                <Ionicons name="chatbubble-outline" size={24} color={Colors.gray500} />
              </TouchableOpacity>
            </Animated.View>
            
            <Animated.View style={{ transform: [{ scale: shareAnimation }] }}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handleShare(item.id)}
              >
                <Ionicons name="share-outline" size={24} color={Colors.gray500} />
              </TouchableOpacity>
            </Animated.View>
          </View>
          
          <TouchableOpacity 
            style={styles.bookmarkButton}
            onPress={() => handleSave(item.id)}
          >
            <Ionicons 
              name={isSaved ? "bookmark" : "bookmark-outline"} 
              size={24} 
              color={isSaved ? Colors.primary : Colors.gray500} 
            />
          </TouchableOpacity>
        </View>

        {/* Post Content */}
        <View style={styles.postContent}>
          <View style={styles.likesContainer}>
            <Text style={styles.likesText}>
              <Text style={styles.likesCount}>{item.likes_count || 0}</Text> likes
            </Text>
          </View>
          
          <Text style={styles.caption}>
            <Text style={styles.creatorNameInline}>{creator.name} </Text>
            {item.caption}
          </Text>
          
          {item.tags.length > 0 && (
            <View style={styles.tagsContainer}>
              {item.tags.map((tag, index) => (
                <Text key={index} style={styles.tag}>
                  #{tag}
                </Text>
              ))}
            </View>
          )}
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <View style={styles.skeletonContainer}>
          <View style={styles.skeletonHeader} />
          <View style={styles.skeletonMedia} />
          <View style={styles.skeletonContent} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Modern Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <Logo size="small" />
            <View>
              <Text style={styles.headerTitle}>Feed</Text>
              {isLocationEnabled && (
                <View style={styles.locationContainer}>
                  <Ionicons name="location" size={12} color={Colors.primary} />
                  <Text style={styles.locationText}>
                    {manualLocation || currentLocation?.city || 'Location enabled'}
                  </Text>
                </View>
              )}
            </View>
          </View>
          <TouchableOpacity 
            style={styles.headerButton} 
            activeOpacity={0.7}
            onPress={() => {
              // Navigate to notifications/chat screen
              navigation.navigate('Inbox');
            }}
          >
            <Ionicons name="notifications-outline" size={24} color={Colors.primary} />
            {/* Unread notification badge */}
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationBadgeText}>3</Text>
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
            tintColor={Colors.primary}
            colors={[Colors.primary]}
          />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="images-outline" size={64} color={Colors.gray400} />
            <Text style={styles.emptyTitle}>No posts yet</Text>
            <Text style={styles.emptySubtitle}>
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
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>View Profile</Text>
              <TouchableOpacity onPress={() => setShowPaymentModal(false)}>
                <Ionicons name="close" size={24} color={Colors.gray600} />
              </TouchableOpacity>
            </View>
            <Text style={styles.modalDescription}>
              You've used all your free profile views. Choose an option to continue:
            </Text>
            <View style={styles.paymentOptions}>
              <TouchableOpacity
                style={styles.paymentOption}
                onPress={() => handlePaymentOption('single')}
              >
                <View style={styles.optionHeader}>
                  <Text style={styles.optionTitle}>View This Profile</Text>
                  <Text style={styles.optionPrice}>₹59</Text>
                </View>
                <Text style={styles.optionDescription}>One-time access to this profile</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.paymentOption, styles.recommendedOption]}
                onPress={() => handlePaymentOption('unlimited')}
              >
                <View style={styles.optionHeader}>
                  <Text style={styles.optionTitle}>Unlimited Today</Text>
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
    backgroundColor: Colors.background,
  },
  
  // Modern Header Styles
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
    color: Colors.gray900,
    marginLeft: Spacing.md,
    letterSpacing: 0.3,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: Spacing.md,
    marginTop: 2,
  },
  locationText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.primary,
    fontWeight: Typography.fontWeight.medium,
    marginLeft: 4,
  },
  headerButton: {
    padding: Spacing.sm,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.gray50,
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: Colors.error,
    borderRadius: BorderRadius.full,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.white,
  },
  notificationBadgeText: {
    color: Colors.white,
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.bold,
    textAlign: 'center',
  },
  
  // Loading States
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  skeletonContainer: {
    width: '90%',
    maxWidth: 400,
  },
  skeletonHeader: {
    height: 60,
    backgroundColor: Colors.gray200,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.lg,
  },
  skeletonMedia: {
    height: 300,
    backgroundColor: Colors.gray200,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.lg,
  },
  skeletonContent: {
    height: 80,
    backgroundColor: Colors.gray200,
    borderRadius: BorderRadius.lg,
  },
  
  // List Styles
  listContainer: {
    paddingBottom: Spacing['2xl'],
  },
  
  // Post Card Styles
  postCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius['2xl'],
    marginHorizontal: Spacing.lg,
    marginVertical: Spacing.sm,
    ...Shadows.lg,
    overflow: 'hidden',
    borderWidth: 0.5,
    borderColor: Colors.gray100,
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
    backgroundColor: Colors.gray100,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.gray200,
  },
  creatorDetails: {
    flex: 1,
  },
  creatorName: {
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.black,
    marginBottom: 2,
  },
  creatorHandle: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.regular,
    color: Colors.gray500,
  },
  creatorLocationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  creatorLocation: {
    fontSize: Typography.fontSize.xs,
    color: Colors.gray500,
    fontWeight: Typography.fontWeight.medium,
    marginLeft: 4,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timestamp: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.gray500,
    marginRight: Spacing.sm,
  },
  moreButton: {
    padding: Spacing.xs,
  },
  
  // Media Styles
  mediaContainer: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: Colors.gray100,
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
    color: Colors.gray700,
  },
  likesCount: {
    fontWeight: Typography.fontWeight.bold,
    color: Colors.black,
  },
  caption: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.regular,
    color: Colors.black,
    lineHeight: Typography.lineHeight.relaxed * Typography.fontSize.base,
    marginBottom: Spacing.sm,
  },
  creatorNameInline: {
    fontWeight: Typography.fontWeight.bold,
    color: Colors.black,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: Spacing.sm,
  },
  tag: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.primary,
    marginRight: Spacing.sm,
    marginBottom: Spacing.xs,
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
    color: Colors.gray600,
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  emptySubtitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.regular,
    color: Colors.gray500,
    textAlign: 'center',
    lineHeight: Typography.lineHeight.relaxed * Typography.fontSize.base,
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

export default FeedScreen;