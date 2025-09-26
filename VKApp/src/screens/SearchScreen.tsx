import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  Alert,
  Modal,
  RefreshControl,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import { useProfileViews } from '../contexts/ProfileViewContext';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../constants/designSystem';

type SearchScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Main'>;

const SearchScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'posts' | 'creators'>('posts');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedCreator, setSelectedCreator] = useState<any>(null);
  const [creators, setCreators] = useState<any[]>([]);
  const [suggestedPosts, setSuggestedPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation<SearchScreenNavigationProp>();
  const { profileViews, decrementProfileViews, hasUnlimitedAccess, activateUnlimitedAccess } = useProfileViews();

  // Load data on component mount
  React.useEffect(() => {
    loadCreators();
    loadSuggestedPosts();
  }, []);

  // Search creators when query changes
  React.useEffect(() => {
    if (searchQuery.trim()) {
      searchCreators(searchQuery);
    } else {
      loadCreators();
    }
  }, [searchQuery]);

  const loadCreators = async () => {
    try {
      setLoading(true);
      setCreators(mockCreators);
    } catch (error) {
      console.error('Error loading creators:', error);
      setCreators(mockCreators);
    } finally {
      setLoading(false);
    }
  };

  const loadSuggestedPosts = async () => {
    try {
      setSuggestedPosts(mockSuggestedPosts);
    } catch (error) {
      console.error('Error loading suggested posts:', error);
      setSuggestedPosts(mockSuggestedPosts);
    }
  };

  const searchCreators = async (query: string) => {
    try {
      setLoading(true);
      const filteredCreators = mockCreators.filter(creator => 
        creator.name.toLowerCase().includes(query.toLowerCase()) ||
        creator.services.some((service: string) => 
          service.toLowerCase().includes(query.toLowerCase())
        ) ||
        creator.city.toLowerCase().includes(query.toLowerCase())
      );
      setCreators(filteredCreators);
    } catch (error) {
      console.error('Error searching creators:', error);
      setCreators(mockCreators.filter(creator => 
        creator.name.toLowerCase().includes(query.toLowerCase()) ||
        creator.services.some((service: string) => 
          service.toLowerCase().includes(query.toLowerCase())
        ) ||
        creator.city.toLowerCase().includes(query.toLowerCase())
      ));
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const handlePostLike = (postId: string) => {
    setSuggestedPosts(prev => prev.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            isLiked: !post.isLiked,
            likes: post.isLiked ? post.likes - 1 : post.likes + 1
          }
        : post
    ));
  };

  const handlePostPress = (post: any) => {
    navigation.navigate('CreatorProfile', { proId: post.creator.id });
  };

  const handleCreatorPress = (creator: any) => {
    if (hasUnlimitedAccess || profileViews > 0) {
      if (!hasUnlimitedAccess) {
        decrementProfileViews();
      }
      navigation.navigate('CreatorProfile', { proId: creator.id });
    } else {
      setSelectedCreator(creator);
      setShowPaymentModal(true);
    }
  };

  const handlePaymentOption = (option: 'single' | 'unlimited') => {
    setShowPaymentModal(false);
    if (option === 'unlimited') {
      activateUnlimitedAccess();
      Alert.alert(
        'Unlimited Access Activated!',
        'You now have unlimited profile views for today.',
        [{ text: 'OK' }]
      );
    } else {
      decrementProfileViews();
      Alert.alert(
        'Profile View Purchased!',
        'You can now view this profile.',
        [{ text: 'OK' }]
      );
    }
    if (selectedCreator) {
      navigation.navigate('CreatorProfile', { proId: selectedCreator.id });
    }
  };

  const mockCreators = [
    {
      id: '1',
      name: 'John Photography',
      handle: '@johnphoto',
      city: 'Mumbai',
      rating: 4.8,
      reviewCount: 127,
      services: ['Wedding Photography', 'Portrait'],
      priceRange: '₹15,000 - ₹50,000',
      availability: 'Available',
      portfolio: [
        'https://images.unsplash.com/photo-1519741497674-611481863552?w=400',
        'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=400',
        'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=400',
      ],
      isHighlighted: true,
    },
    {
      id: '2',
      name: 'Sarah Videography',
      handle: '@sarahvideo',
      city: 'Delhi',
      rating: 4.9,
      reviewCount: 89,
      services: ['Wedding Video', 'Corporate Video'],
      priceRange: '₹25,000 - ₹80,000',
      availability: 'Available',
      portfolio: [
        'https://images.unsplash.com/photo-1519741497674-611481863552?w=400',
        'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=400',
        'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=400',
      ],
      isHighlighted: false,
    },
    {
      id: '3',
      name: 'Mike Events',
      handle: '@mikeevents',
      city: 'Bangalore',
      rating: 4.7,
      reviewCount: 156,
      services: ['Corporate Events', 'Wedding Planning'],
      priceRange: '₹30,000 - ₹1,00,000',
      availability: 'Busy',
      portfolio: [
        'https://images.unsplash.com/photo-1519741497674-611481863552?w=400',
        'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=400',
        'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=400',
      ],
      isHighlighted: true,
    },
    {
      id: '4',
      name: 'Lisa Makeup',
      handle: '@lisamakeup',
      city: 'Chennai',
      rating: 4.9,
      reviewCount: 203,
      services: ['Bridal Makeup', 'Party Makeup'],
      priceRange: '₹5,000 - ₹15,000',
      availability: 'Available',
      portfolio: [
        'https://images.unsplash.com/photo-1519741497674-611481863552?w=400',
        'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=400',
        'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=400',
      ],
      isHighlighted: false,
    },
  ];

  const mockSuggestedPosts = [
    {
      id: '1',
      image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=400',
      creator: {
        id: '1',
        name: 'John Photography',
        handle: '@johnphoto',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
      },
      likes: 1247,
      comments: 89,
      caption: 'Beautiful sunset wedding at Taj Palace ✨ #weddingphotography #mumbai',
      tags: ['wedding', 'photography', 'mumbai', 'sunset'],
      isLiked: false,
    },
    {
      id: '2',
      image: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=400',
      creator: {
        id: '2',
        name: 'Sarah Videography',
        handle: '@sarahvideo',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100',
      },
      likes: 892,
      comments: 45,
      caption: 'Behind the scenes of our latest wedding film 🎬 #videography #wedding',
      tags: ['videography', 'wedding', 'behindthescenes'],
      isLiked: true,
    },
    {
      id: '3',
      image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=400',
      creator: {
        id: '3',
        name: 'Mike Events',
        handle: '@mikeevents',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
      },
      likes: 2156,
      comments: 156,
      caption: 'Corporate event setup complete! Ready for tomorrow\'s conference 🎉 #events #corporate',
      tags: ['events', 'corporate', 'setup'],
      isLiked: false,
    },
    {
      id: '4',
      image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400',
      creator: {
        id: '4',
        name: 'Lisa Makeup',
        handle: '@lisamakeup',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
      },
      likes: 3456,
      comments: 234,
      caption: 'Bridal makeup transformation complete! ✨ #bridalmakeup #transformation',
      tags: ['makeup', 'bridal', 'transformation', 'beauty'],
      isLiked: true,
    },
    {
      id: '5',
      image: 'https://images.unsplash.com/photo-1464207687429-7505649dae38?w=400',
      creator: {
        id: '1',
        name: 'John Photography',
        handle: '@johnphoto',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
      },
      likes: 1876,
      comments: 98,
      caption: 'Portrait session in the golden hour 📸 #portrait #goldenhour #photography',
      tags: ['portrait', 'photography', 'goldenhour'],
      isLiked: false,
    },
    {
      id: '6',
      image: 'https://images.unsplash.com/photo-1519167758481-83f1426e3b1a?w=400',
      creator: {
        id: '2',
        name: 'Sarah Videography',
        handle: '@sarahvideo',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100',
      },
      likes: 1234,
      comments: 67,
      caption: 'Product launch video shoot 🚀 #productlaunch #videography #corporate',
      tags: ['videography', 'productlaunch', 'corporate'],
      isLiked: true,
    },
  ];

  const renderPost = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.postCard} onPress={() => handlePostPress(item)}>
      <View style={styles.postHeader}>
        <View style={styles.postCreatorInfo}>
          <Image source={{ uri: item.creator.avatar }} style={styles.postAvatar} />
          <View style={styles.postCreatorDetails}>
            <Text style={styles.postCreatorName}>{item.creator.name}</Text>
            <Text style={styles.postCreatorHandle}>{item.creator.handle}</Text>
          </View>
        </View>
        <TouchableOpacity>
          <Ionicons name="ellipsis-horizontal" size={20} color={Colors.gray600} />
        </TouchableOpacity>
      </View>
      
      <Image source={{ uri: item.image }} style={styles.postImage} />
      
      <View style={styles.postActions}>
        <TouchableOpacity onPress={() => handlePostLike(item.id)}>
          <Ionicons 
            name={item.isLiked ? "heart" : "heart-outline"} 
            size={24} 
            color={item.isLiked ? Colors.error : Colors.gray900} 
          />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="chatbubble-outline" size={24} color={Colors.gray900} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="paper-plane-outline" size={24} color={Colors.gray900} />
        </TouchableOpacity>
        <View style={styles.postActionsSpacer} />
        <TouchableOpacity>
          <Ionicons name="bookmark-outline" size={24} color={Colors.gray900} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.postContent}>
        <Text style={styles.postLikes}>{item.likes.toLocaleString()} likes</Text>
        <Text style={styles.postCaption}>
          <Text style={styles.postCreatorName}>{item.creator.name}</Text> {item.caption}
        </Text>
        <TouchableOpacity>
          <Text style={styles.postViewComments}>View all {item.comments} comments</Text>
        </TouchableOpacity>
        <Text style={styles.postTime}>2 hours ago</Text>
      </View>
    </TouchableOpacity>
  );

  const renderCreator = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.creatorCard}
      onPress={() => handleCreatorPress(item)}
    >
      <View style={styles.portfolioContainer}>
        <Image source={{ uri: item.portfolio[0] }} style={styles.portfolioImage} />
        <View style={styles.availabilityBadge}>
          <View style={[styles.availabilityDot, { backgroundColor: getAvailabilityColor(item.availability) }]} />
          <Text style={styles.availabilityText}>{item.availability}</Text>
        </View>
        {item.isHighlighted && (
          <View style={styles.highlightedBadge}>
            <Ionicons name="star" size={12} color="#FFD700" />
            <Text style={styles.highlightedText}>Featured</Text>
          </View>
        )}
      </View>
      <View style={styles.creatorInfo}>
        <Text style={styles.creatorName}>{item.name}</Text>
        <Text style={styles.creatorHandle}>{item.handle}</Text>
        <Text style={styles.creatorLocation}>{item.city}</Text>
        <View style={styles.ratingContainer}>
          <Ionicons name="star" size={14} color="#FFD700" />
          <Text style={styles.rating}>{item.rating}</Text>
          <Text style={styles.reviewCount}>({item.reviewCount})</Text>
        </View>
        <Text style={styles.priceRange}>{item.priceRange}</Text>
      </View>
    </TouchableOpacity>
  );

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'Available': return Colors.success;
      case 'Busy': return Colors.warning;
      case 'Offline': return Colors.gray500;
      default: return Colors.gray500;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Instagram-style Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Search</Text>
          </View>
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color={Colors.gray500} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search creators, services, locations..."
              placeholderTextColor={Colors.gray500}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        {/* Tab Navigation */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'posts' && styles.activeTab]}
            onPress={() => setActiveTab('posts')}
          >
            <Text style={[styles.tabText, activeTab === 'posts' && styles.activeTabText]}>
              Posts
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'creators' && styles.activeTab]}
            onPress={() => setActiveTab('creators')}
          >
            <Text style={[styles.tabText, activeTab === 'creators' && styles.activeTabText]}>
              Creators
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        {activeTab === 'posts' ? (
          <FlatList
            data={suggestedPosts}
            renderItem={renderPost}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.postsList}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor={Colors.primary}
                colors={[Colors.primary]}
              />
            }
          />
        ) : (
          <FlatList
            data={creators}
            renderItem={renderCreator}
            keyExtractor={(item) => item.id}
            numColumns={2}
            contentContainerStyle={styles.creatorsList}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor={Colors.primary}
                colors={[Colors.primary]}
              />
            }
          />
        )}
      </View>

      {/* Payment Modal */}
      <Modal
        visible={showPaymentModal}
        transparent={true}
        animationType="fade"
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
              You have {profileViews} free profile views remaining. Choose an option to view {selectedCreator?.name}'s profile.
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
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.gray200,
    ...Shadows.sm,
  },
  headerContent: {
    marginBottom: Spacing.lg,
  },
  headerTitle: {
    fontSize: Typography.fontSize['2xl'],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.gray900,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.gray100,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  searchIcon: {
    marginRight: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: Typography.fontSize.base,
    color: Colors.gray900,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.gray200,
  },
  tab: {
    flex: 1,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: Colors.primary,
  },
  tabText: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.gray600,
  },
  activeTabText: {
    color: Colors.primary,
    fontWeight: Typography.fontWeight.semiBold,
  },
  // Post Styles (Instagram-style)
  postsList: {
    paddingBottom: Spacing.xl,
  },
  postCard: {
    backgroundColor: Colors.surface,
    marginBottom: Spacing.lg,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  postCreatorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  postAvatar: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.full,
    marginRight: Spacing.sm,
  },
  postCreatorDetails: {
    flex: 1,
  },
  postCreatorName: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semiBold,
    color: Colors.gray900,
  },
  postCreatorHandle: {
    fontSize: Typography.fontSize.sm,
    color: Colors.gray600,
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
  },
  postActionsSpacer: {
    flex: 1,
  },
  postContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
  },
  postLikes: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semiBold,
    color: Colors.gray900,
    marginBottom: Spacing.xs,
  },
  postCaption: {
    fontSize: Typography.fontSize.base,
    color: Colors.gray900,
    lineHeight: Typography.lineHeight.relaxed * Typography.fontSize.base,
    marginBottom: Spacing.xs,
  },
  postViewComments: {
    fontSize: Typography.fontSize.sm,
    color: Colors.gray600,
    marginBottom: Spacing.xs,
  },
  postTime: {
    fontSize: Typography.fontSize.sm,
    color: Colors.gray500,
  },
  // Creator Styles
  creatorsList: {
    padding: Spacing.lg,
  },
  creatorCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    margin: Spacing.sm,
    ...Shadows.md,
  },
  portfolioContainer: {
    position: 'relative',
  },
  portfolioImage: {
    width: '100%',
    height: 150,
    borderTopLeftRadius: BorderRadius.lg,
    borderTopRightRadius: BorderRadius.lg,
    backgroundColor: Colors.gray100,
  },
  availabilityBadge: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.md,
  },
  availabilityDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: Spacing.xs,
  },
  availabilityText: {
    color: Colors.white,
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.medium,
  },
  highlightedBadge: {
    position: 'absolute',
    top: Spacing.sm,
    left: Spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.9)',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.md,
  },
  highlightedText: {
    color: Colors.gray900,
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.semiBold,
    marginLeft: Spacing.xs,
  },
  creatorInfo: {
    padding: Spacing.lg,
  },
  creatorName: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semiBold,
    color: Colors.gray900,
    marginBottom: Spacing.xs,
  },
  creatorHandle: {
    fontSize: Typography.fontSize.sm,
    color: Colors.gray600,
    marginBottom: Spacing.xs,
  },
  creatorLocation: {
    fontSize: Typography.fontSize.sm,
    color: Colors.gray600,
    marginBottom: Spacing.sm,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  rating: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semiBold,
    color: Colors.gray900,
    marginLeft: Spacing.xs,
  },
  reviewCount: {
    fontSize: Typography.fontSize.sm,
    color: Colors.gray600,
    marginLeft: Spacing.xs,
  },
  priceRange: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semiBold,
    color: Colors.primary,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: Colors.surface,
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
    lineHeight: Typography.lineHeight.relaxed * Typography.fontSize.base,
    marginBottom: Spacing.lg,
  },
  paymentOptions: {
    gap: Spacing.md,
  },
  paymentOption: {
    backgroundColor: Colors.gray100,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.gray200,
  },
  recommendedOption: {
    backgroundColor: Colors.primary + '10',
    borderColor: Colors.primary,
  },
  optionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
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
    borderRadius: BorderRadius.md,
  },
  recommendedText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.semiBold,
    color: Colors.white,
  },
});

export default SearchScreen;