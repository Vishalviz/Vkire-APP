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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { PortfolioPost, RootStackParamList } from '../types';
import { Colors, Typography, Spacing, BorderRadius, Shadows, Animation } from '../constants/designSystem';
import Logo from '../components/Logo';
import logger from '../utils/logger';

type FeedScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Main'>;

const FeedScreen = () => {
  const [posts, setPosts] = useState<PortfolioPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const navigation = useNavigation<FeedScreenNavigationProp>();
  
  // Animation refs for micro-interactions
  const likeAnimations = useRef<{ [key: string]: Animated.Value }>({});
  const commentAnimations = useRef<{ [key: string]: Animated.Value }>({});
  const shareAnimations = useRef<{ [key: string]: Animated.Value }>({});

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      // Mock data with more realistic content
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
        },
      ];
      setPosts(mockPosts);
      
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
    
    logger.debug('Share post:', postId);
  };

  const handleCreatorPress = (proId: string) => {
    navigation.navigate('CreatorProfile', { proId });
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
    const creator = getCreatorName(item.pro_id);
    const isLiked = likedPosts.has(item.id);
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
              <Text style={styles.creatorHandle}>@{creator.handle}</Text>
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
        <View style={styles.mediaContainer}>
          <Image source={{ uri: item.media_url }} style={styles.media} />
        </View>

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
          
          <TouchableOpacity style={styles.bookmarkButton}>
            <Ionicons name="bookmark-outline" size={24} color={Colors.gray500} />
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
      {/* Enhanced Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.logoContainer}>
            <View style={styles.logoWrapper}>
              <Logo size="medium" />
            </View>
            <Text style={styles.appTitle}>Vkire</Text>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <Ionicons name="notifications-outline" size={24} color={Colors.gray700} />
            <View style={styles.notificationBadge} />
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  
  // Header Styles
  header: {
    backgroundColor: Colors.surface,
    paddingTop: 50,
    paddingBottom: Spacing.lg,
    paddingHorizontal: Spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray200,
    ...Shadows.sm,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoWrapper: {
    marginRight: Spacing.sm,
  },
  appTitle: {
    fontSize: Typography.fontSize['2xl'],
    fontWeight: Typography.fontWeight.extraBold,
    color: Colors.primary,
    letterSpacing: 0.5,
  },
  notificationButton: {
    padding: Spacing.sm,
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.error,
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
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    marginHorizontal: Spacing.lg,
    marginVertical: Spacing.sm,
    ...Shadows.md,
    overflow: 'hidden',
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
});

export default FeedScreen;