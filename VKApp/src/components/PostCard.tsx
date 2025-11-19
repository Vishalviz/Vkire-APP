import React, { useRef, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Image,
    Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PortfolioPost } from '../types';
import { useTheme } from '../contexts/AppThemeContext';
import { Typography, Spacing, BorderRadius, Shadows } from '../constants/designSystem';

interface PostCardProps {
    item: PortfolioPost;
    isLiked: boolean;
    isSaved: boolean;
    onLike: (id: string) => void;
    onComment: (id: string) => void;
    onShare: (id: string) => void;
    onSave: (id: string) => void;
    onPressCreator: (proId: string) => void;
    onDoubleTap: (id: string) => void;
}

const PostCard: React.FC<PostCardProps> = ({
    item,
    isLiked,
    isSaved,
    onLike,
    onComment,
    onShare,
    onSave,
    onPressCreator,
    onDoubleTap,
}) => {
    const { colors } = useTheme();

    // Animation values
    const likeAnimation = useRef(new Animated.Value(1)).current;
    const commentAnimation = useRef(new Animated.Value(1)).current;
    const shareAnimation = useRef(new Animated.Value(1)).current;

    // Trigger animation when liked state changes
    useEffect(() => {
        if (isLiked) {
            Animated.sequence([
                Animated.timing(likeAnimation, {
                    toValue: 0.8,
                    duration: 150,
                    useNativeDriver: true,
                }),
                Animated.timing(likeAnimation, {
                    toValue: 1.1,
                    duration: 150,
                    useNativeDriver: true,
                }),
                Animated.timing(likeAnimation, {
                    toValue: 1,
                    duration: 150,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    }, [isLiked]);

    const handleLikePress = () => {
        onLike(item.id);
    };

    const handleCommentPress = () => {
        Animated.sequence([
            Animated.timing(commentAnimation, {
                toValue: 0.7,
                duration: 150,
                useNativeDriver: true,
            }),
            Animated.timing(commentAnimation, {
                toValue: 1,
                duration: 150,
                useNativeDriver: true,
            }),
        ]).start();
        onComment(item.id);
    };

    const handleSharePress = () => {
        Animated.sequence([
            Animated.timing(shareAnimation, {
                toValue: 0.8,
                duration: 150,
                useNativeDriver: true,
            }),
            Animated.timing(shareAnimation, {
                toValue: 1.2,
                duration: 150,
                useNativeDriver: true,
            }),
            Animated.timing(shareAnimation, {
                toValue: 1,
                duration: 150,
                useNativeDriver: true,
            }),
        ]).start();
        onShare(item.id);
    };

    // Helper to format timestamp
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

    const creator = item.professional
        ? { name: item.professional.name, handle: `@${item.professional.name.toLowerCase().replace(' ', '_')}` }
        : getCreatorName(item.pro_id);

    return (
        <View style={[styles.postCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            {/* Post Header */}
            <View style={styles.postHeader}>
                <TouchableOpacity
                    style={styles.creatorInfo}
                    onPress={() => onPressCreator(item.pro_id)}
                >
                    <View style={styles.avatarContainer}>
                        <View style={[styles.avatarPlaceholder, { backgroundColor: colors.surfaceSecondary, borderColor: colors.border }]}>
                            <Ionicons name="person" size={20} color={colors.gray500} />
                        </View>
                    </View>
                    <View style={styles.creatorDetails}>
                        <Text style={[styles.creatorName, { color: colors.gray900 }]}>{creator.name}</Text>
                        <View style={styles.creatorLocationContainer}>
                            <Ionicons name="location" size={12} color={colors.gray500} />
                            <Text style={[styles.creatorLocation, { color: colors.gray500 }]}>
                                {item.professional?.city || 'Unknown Location'}
                                {item.distance ? ` • ${item.distance}km away` : ''}
                            </Text>
                        </View>
                    </View>
                </TouchableOpacity>

                <View style={styles.headerActions}>
                    <Text style={[styles.timestamp, { color: colors.gray500 }]}>{formatTimestamp(item.created_at)}</Text>
                    <TouchableOpacity style={styles.moreButton}>
                        <Ionicons name="ellipsis-horizontal" size={20} color={colors.gray500} />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Media Content */}
            <TouchableOpacity
                style={[styles.mediaContainer, { backgroundColor: colors.surfaceSecondary }]}
                onPress={() => onDoubleTap(item.id)}
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
                            onPress={handleLikePress}
                        >
                            <Ionicons
                                name={isLiked ? "heart" : "heart-outline"}
                                size={24}
                                color={isLiked ? colors.error : colors.gray500}
                            />
                        </TouchableOpacity>
                    </Animated.View>

                    <Animated.View style={{ transform: [{ scale: commentAnimation }] }}>
                        <TouchableOpacity
                            style={styles.actionButton}
                            onPress={handleCommentPress}
                        >
                            <Ionicons name="chatbubble-outline" size={24} color={colors.gray500} />
                        </TouchableOpacity>
                    </Animated.View>

                    <Animated.View style={{ transform: [{ scale: shareAnimation }] }}>
                        <TouchableOpacity
                            style={styles.actionButton}
                            onPress={handleSharePress}
                        >
                            <Ionicons name="share-outline" size={24} color={colors.gray500} />
                        </TouchableOpacity>
                    </Animated.View>
                </View>

                <TouchableOpacity
                    style={styles.bookmarkButton}
                    onPress={() => onSave(item.id)}
                >
                    <Ionicons
                        name={isSaved ? "bookmark" : "bookmark-outline"}
                        size={24}
                        color={isSaved ? colors.primary : colors.gray500}
                    />
                </TouchableOpacity>
            </View>

            {/* Post Content */}
            <View style={styles.postContent}>
                <View style={styles.likesContainer}>
                    <Text style={[styles.likesText, { color: colors.gray700 }]}>
                        <Text style={[styles.likesCount, { color: colors.black }]}>{item.likes_count || 0}</Text>{' likes'}
                    </Text>
                </View>

                <Text style={[styles.caption, { color: colors.black }]}>
                    <Text style={[styles.creatorNameInline, { color: colors.black }]}>{creator.name}</Text>{' '}
                    {item.caption}
                </Text>


                {item.tags && item.tags.length > 0 && (
                    <View style={styles.tagsContainer}>
                        {item.tags.map((tag, index) => (
                            <Text key={index} style={[styles.tag, { color: colors.primary }]}>
                                #{tag}
                            </Text>
                        ))}
                    </View>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    postCard: {
        borderRadius: BorderRadius['2xl'],
        marginHorizontal: Spacing.lg,
        marginVertical: Spacing.sm,
        ...Shadows.lg,
        overflow: 'hidden',
        borderWidth: 0.5,
    },
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
    },
    creatorDetails: {
        flex: 1,
    },
    creatorName: {
        fontSize: Typography.fontSize.md,
        fontWeight: Typography.fontWeight.bold,
        marginBottom: 2,
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
    },
    headerActions: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    timestamp: {
        fontSize: Typography.fontSize.xs,
        fontWeight: Typography.fontWeight.medium,
        marginRight: Spacing.sm,
    },
    moreButton: {
        padding: Spacing.xs,
    },
    mediaContainer: {
        width: '100%',
        aspectRatio: 1,
    },
    media: {
        width: '100%',
        height: '100%',
    },
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
        padding: Spacing.xs,
        marginRight: Spacing.md,
    },
    bookmarkButton: {
        padding: Spacing.xs,
    },
    postContent: {
        paddingHorizontal: Spacing.lg,
        paddingBottom: Spacing.lg,
    },
    likesContainer: {
        marginBottom: Spacing.xs,
    },
    likesText: {
        fontSize: Typography.fontSize.sm,
    },
    likesCount: {
        fontWeight: Typography.fontWeight.bold,
    },
    caption: {
        fontSize: Typography.fontSize.sm,
        lineHeight: Typography.lineHeight.normal,
        marginBottom: Spacing.sm,
    },
    creatorNameInline: {
        fontWeight: Typography.fontWeight.bold,
    },
    tagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    tag: {
        fontSize: Typography.fontSize.xs,
        marginRight: Spacing.sm,
        fontWeight: Typography.fontWeight.medium,
    },
});

export default PostCard;
