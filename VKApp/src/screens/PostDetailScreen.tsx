import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import { useProfileViews } from '../contexts/ProfileViewContext';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../constants/designSystem';

type PostDetailScreenNavigationProp = StackNavigationProp<RootStackParamList, 'PostDetail'>;
type PostDetailScreenRouteProp = RouteProp<RootStackParamList, 'PostDetail'>;

const PostDetailScreen = () => {
  const navigation = useNavigation<PostDetailScreenNavigationProp>();
  const route = useRoute<PostDetailScreenRouteProp>();
  const { post } = route.params;
  const { profileViews, decrementProfileViews, hasUnlimitedAccess } = useProfileViews();
  const [isLiked, setIsLiked] = useState(post.isLiked);
  const [likes, setLikes] = useState(post.likes);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes(prev => isLiked ? prev - 1 : prev + 1);
  };

  const handleViewProfile = () => {
    if (hasUnlimitedAccess || profileViews > 0) {
      if (!hasUnlimitedAccess) {
        decrementProfileViews();
      }
      navigation.navigate('CreatorProfile', { proId: post.creator.id });
    } else {
      // Show payment modal for profile access
      Alert.alert(
        'View Profile',
        `You have ${profileViews} free profile views remaining. Would you like to purchase access to view ${post.creator.name}'s profile?`,
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'View Profile (₹59)', 
            onPress: () => {
              decrementProfileViews();
              navigation.navigate('CreatorProfile', { proId: post.creator.id });
            }
          },
          { 
            text: 'Unlimited Today (₹299)', 
            onPress: () => {
              // Activate unlimited access
              navigation.navigate('CreatorProfile', { proId: post.creator.id });
            }
          }
        ]
      );
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={Colors.gray900} />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>Post</Text>
            <View style={styles.creditDisplay}>
              <Ionicons name="eye" size={14} color={Colors.primary} />
              <Text style={styles.creditText}>
                {hasUnlimitedAccess ? '∞' : profileViews} views
              </Text>
            </View>
          </View>
          <TouchableOpacity>
            <Ionicons name="ellipsis-horizontal" size={24} color={Colors.gray900} />
          </TouchableOpacity>
        </View>

        {/* Post Image */}
        <Image source={{ uri: post.image }} style={styles.postImage} />

        {/* Post Actions */}
        <View style={styles.postActions}>
          <TouchableOpacity onPress={handleLike}>
            <Ionicons 
              name={isLiked ? "heart" : "heart-outline"} 
              size={28} 
              color={isLiked ? Colors.error : Colors.gray900} 
            />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="chatbubble-outline" size={28} color={Colors.gray900} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="paper-plane-outline" size={28} color={Colors.gray900} />
          </TouchableOpacity>
          <View style={styles.postActionsSpacer} />
          <TouchableOpacity>
            <Ionicons name="bookmark-outline" size={28} color={Colors.gray900} />
          </TouchableOpacity>
        </View>

        {/* Post Content */}
        <View style={styles.postContent}>
          <Text style={styles.postLikes}>{likes.toLocaleString()} likes</Text>
          
          <Text style={styles.postCaption}>
            <Text style={styles.postCreatorName}>{post.creator.name}</Text> {post.caption}
          </Text>
          
          <TouchableOpacity>
            <Text style={styles.postViewComments}>View all {post.comments} comments</Text>
          </TouchableOpacity>
          
          <Text style={styles.postTime}>2 hours ago</Text>
        </View>

        {/* View Profile Button */}
        <View style={styles.profileSection}>
          <View style={styles.creatorInfo}>
            <Image source={{ uri: post.creator.avatar }} style={styles.creatorAvatar} />
            <View style={styles.creatorDetails}>
              <Text style={styles.creatorName}>{post.creator.name}</Text>
              <Text style={styles.creatorHandle}>{post.creator.handle}</Text>
            </View>
          </View>
          
          <TouchableOpacity style={styles.viewProfileButton} onPress={handleViewProfile}>
            <Text style={styles.viewProfileButtonText}>View Profile</Text>
          </TouchableOpacity>
        </View>
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
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semiBold,
    color: Colors.gray900,
    marginBottom: Spacing.xs,
  },
  creditDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary + '15',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  creditText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.semiBold,
    color: Colors.primary,
    marginLeft: Spacing.xs,
  },
  postImage: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: Colors.gray100,
  },
  postActions: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.surface,
  },
  postActionsSpacer: {
    flex: 1,
  },
  postContent: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.surface,
  },
  postLikes: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semiBold,
    color: Colors.gray900,
    marginBottom: Spacing.sm,
  },
  postCaption: {
    fontSize: Typography.fontSize.base,
    color: Colors.gray900,
    lineHeight: Typography.lineHeight.relaxed * Typography.fontSize.base,
    marginBottom: Spacing.sm,
  },
  postCreatorName: {
    fontWeight: Typography.fontWeight.semiBold,
  },
  postViewComments: {
    fontSize: Typography.fontSize.sm,
    color: Colors.gray600,
    marginBottom: Spacing.sm,
  },
  postTime: {
    fontSize: Typography.fontSize.sm,
    color: Colors.gray500,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    backgroundColor: Colors.surface,
    borderTopWidth: 0.5,
    borderTopColor: Colors.gray200,
  },
  creatorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  creatorAvatar: {
    width: 50,
    height: 50,
    borderRadius: BorderRadius.full,
    marginRight: Spacing.md,
  },
  creatorDetails: {
    flex: 1,
  },
  creatorName: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semiBold,
    color: Colors.gray900,
  },
  creatorHandle: {
    fontSize: Typography.fontSize.sm,
    color: Colors.gray600,
  },
  viewProfileButton: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.full,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
  },
  viewProfileButtonText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semiBold,
    color: Colors.white,
  },
});

export default PostDetailScreen;
