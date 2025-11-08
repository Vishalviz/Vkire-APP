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
import { useTheme } from '../contexts/AppThemeContext';
import { Typography, Spacing, BorderRadius, Shadows } from '../constants/designSystem';

type SearchScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Main'>;

const SearchScreen = () => {
  const { colors } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedCreator, setSelectedCreator] = useState<any>(null);
  const [creators, setCreators] = useState<any[]>([]);
  const [suggestedPosts, setSuggestedPosts] = useState<any[]>([]);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
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
      performSearch(searchQuery);
      setShowSearchResults(true);
    } else {
      setShowSearchResults(false);
      setSearchResults([]);
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

  const performSearch = (query: string) => {
    const searchTerm = query.toLowerCase().trim();
    
    // Search through creators
    const filteredCreators = mockCreators.filter(creator => 
      creator.name.toLowerCase().includes(searchTerm) ||
      creator.handle.toLowerCase().includes(searchTerm) ||
      creator.city.toLowerCase().includes(searchTerm) ||
      creator.services.some((service: string) => 
        service.toLowerCase().includes(searchTerm)
      )
    );

    // Search through posts for creators
    const postsWithMatchingCreators = mockSuggestedPosts.filter(post =>
      post.creator.name.toLowerCase().includes(searchTerm) ||
      post.creator.handle.toLowerCase().includes(searchTerm) ||
      post.caption.toLowerCase().includes(searchTerm) ||
      post.tags.some((tag: string) => tag.toLowerCase().includes(searchTerm))
    );

    // Combine and deduplicate results
    const allResults = [...filteredCreators];
    postsWithMatchingCreators.forEach(post => {
      if (!allResults.find(creator => creator.id === post.creator.id)) {
        allResults.push({
          ...post.creator,
          // Add some additional info from the post
          recentPost: post.caption,
          recentPostLikes: post.likes
        } as any);
      }
    });

    setSearchResults(allResults);
  };

  const searchCreators = async (query: string) => {
    try {
      setLoading(true);
      performSearch(query);
    } catch (error) {
      console.error('Error searching creators:', error);
      performSearch(query);
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
    navigation.navigate('PostDetail', { post });
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

  const handleSearchResultPress = (creator: any) => {
    setSearchQuery('');
    setShowSearchResults(false);
    handleCreatorPress(creator);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setShowSearchResults(false);
    setSearchResults([]);
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
    <TouchableOpacity style={styles.postGridItem} onPress={() => handlePostPress(item)}>
      <Image source={{ uri: item.image }} style={styles.postGridImage} />
      <View style={styles.postOverlay}>
        <View style={styles.postStats}>
          <View style={styles.postStat}>
            <Ionicons name="heart" size={16} color={colors.white} />
            <Text style={styles.postStatText}>{item.likes}</Text>
          </View>
          <View style={styles.postStat}>
            <Ionicons name="chatbubble" size={16} color={colors.white} />
            <Text style={styles.postStatText}>{item.comments}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderSearchResult = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={styles.searchResultItem} 
      onPress={() => handleSearchResultPress(item)}
    >
      <Image source={{ uri: item.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100' }} style={styles.searchResultAvatar} />
      <View style={styles.searchResultInfo}>
        <Text style={styles.searchResultName}>{item.name}</Text>
        <Text style={styles.searchResultHandle}>{item.handle}</Text>
        <Text style={styles.searchResultLocation}>{item.city}</Text>
        {item.recentPost && (
          <Text style={styles.searchResultPost} numberOfLines={1}>
            Recent: {item.recentPost}
          </Text>
        )}
      </View>
      <View style={styles.searchResultActions}>
        <Ionicons name="chevron-forward" size={20} color={colors.gray400} />
      </View>
    </TouchableOpacity>
  );


  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {/* Instagram-style Header */}
        <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.gray200 }]}>
          <View style={styles.headerContent}>
            <Text style={[styles.headerTitle, { color: colors.gray900 }]}>Search</Text>
          </View>
          <View style={[styles.searchContainer, { backgroundColor: colors.gray100 }]}>
            <Ionicons name="search" size={20} color={colors.gray500} style={styles.searchIcon} />
            <TextInput
              style={[styles.searchInput, { color: colors.gray900 }]}
              placeholder="Search creators, services, locations..."
              placeholderTextColor={colors.gray500}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
                <Ionicons name="close-circle" size={20} color={colors.gray500} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Content */}
        {showSearchResults ? (
          <View style={[styles.searchResultsContainer, { backgroundColor: colors.background }]}>
            <View style={[styles.searchResultsHeader, { borderBottomColor: colors.gray200 }]}>
              <Text style={[styles.searchResultsTitle, { color: colors.gray900 }]}>
                {searchResults.length > 0 
                  ? `${searchResults.length} result${searchResults.length === 1 ? '' : 's'} found`
                  : 'No results found'
                }
              </Text>
            </View>
            <FlatList
              data={searchResults}
              renderItem={renderSearchResult}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.searchResultsList}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                <View style={styles.emptySearchResults}>
                  <Ionicons name="search" size={48} color={colors.gray400} />
                  <Text style={[styles.emptySearchTitle, { color: colors.gray900 }]}>No results found</Text>
                  <Text style={[styles.emptySearchSubtitle, { color: colors.gray600 }]}>
                    Try searching for photographer, videographer, editor, or location names
                  </Text>
                </View>
              }
            />
          </View>
        ) : (
          <FlatList
            data={suggestedPosts}
            renderItem={renderPost}
            keyExtractor={(item) => item.id}
            numColumns={3}
            contentContainerStyle={styles.postsGrid}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor={colors.primary}
                colors={[colors.primary]}
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
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.gray900 }]}>View Profile</Text>
              <TouchableOpacity onPress={() => setShowPaymentModal(false)}>
                <Ionicons name="close" size={24} color={colors.gray600} />
              </TouchableOpacity>
            </View>
            <Text style={[styles.modalDescription, { color: colors.gray600 }]}>
              You have {profileViews} free profile views remaining. Choose an option to view {selectedCreator?.name}'s profile.
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
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    borderBottomWidth: 0.5,
    ...Shadows.sm,
  },
  headerContent: {
    marginBottom: Spacing.lg,
  },
  headerTitle: {
    fontSize: Typography.fontSize['2xl'],
    fontWeight: Typography.fontWeight.bold,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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
  },
  clearButton: {
    marginLeft: Spacing.sm,
  },
  // Post Grid Styles (Instagram Search Page Style)
  postsGrid: {
    padding: 1, // Small padding for grid spacing
  },
  postGridItem: {
    flex: 1,
    aspectRatio: 1,
    margin: 1,
    position: 'relative',
  },
  postGridImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#F3F4F6',
  },
  postOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'flex-end',
    padding: Spacing.sm,
  },
  postStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  postStat: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  postStatText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semiBold,
    marginLeft: Spacing.xs,
    color: '#fff', // Statically set for overlay, as it's always white text
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    width: '90%',
    maxWidth: 400,
    // backgroundColor is set at render using colors.surface
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
  },
  modalDescription: {
    fontSize: Typography.fontSize.base,
    lineHeight: Typography.lineHeight.relaxed * Typography.fontSize.base,
    marginBottom: Spacing.lg,
  },
  paymentOptions: {
    gap: Spacing.md,
  },
  paymentOption: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
  },
  recommendedOption: {
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
  },
  optionPrice: {
    fontSize: Typography.fontSize.lg,
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
    borderRadius: BorderRadius.md,
  },
  recommendedText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.semiBold,
  },
  // Search Results Styles
  searchResultsContainer: {
    flex: 1,
  },
  searchResultsHeader: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 0.5,
    borderBottomColor: '#D1D1D6',
  },
  searchResultsTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semiBold,
    color: '#1F2937',
  },
  searchResultsList: {
    paddingVertical: Spacing.sm,
  },
  searchResultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 0.5,
    borderBottomColor: '#F3F4F6',
    backgroundColor: '#fff',
  },
  searchResultAvatar: {
    width: 50,
    height: 50,
    borderRadius: BorderRadius.full,
    marginRight: Spacing.md,
  },
  searchResultInfo: {
    flex: 1,
  },
  searchResultName: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semiBold,
    color: '#1F2937',
    marginBottom: Spacing.xs,
  },
  searchResultHandle: {
    fontSize: Typography.fontSize.sm,
    color: '#4B5563',
    marginBottom: Spacing.xs,
  },
  searchResultLocation: {
    fontSize: Typography.fontSize.sm,
    color: '#4B5563',
    marginBottom: Spacing.xs,
  },
  searchResultPost: {
    fontSize: Typography.fontSize.sm,
    color: '#6B7280',
    fontStyle: 'italic',
  },
  searchResultActions: {
    paddingLeft: Spacing.sm,
  },
  emptySearchResults: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Spacing['4xl'],
    paddingHorizontal: Spacing.xl,
  },
  emptySearchTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semiBold,
    color: '#1F2937',
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  emptySearchSubtitle: {
    fontSize: Typography.fontSize.base,
    color: '#4B5563',
    textAlign: 'center',
    lineHeight: Typography.lineHeight.relaxed * Typography.fontSize.base,
  },
});

export default SearchScreen;