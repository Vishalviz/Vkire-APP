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
  // const [activeFilter, setActiveFilter] = useState('all'); // TODO: Implement filter functionality
  // const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid'); // TODO: Implement view mode toggle
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedCreator, setSelectedCreator] = useState<any>(null);
  const navigation = useNavigation<SearchScreenNavigationProp>();
  const { profileViews, decrementProfileViews, hasUnlimitedAccess, activateUnlimitedAccess } = useProfileViews();

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
      services: ['Event Planning', 'Decoration'],
      priceRange: '₹10,000 - ₹30,000',
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

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'Available': return '#34C759';
      case 'Busy': return '#FF9500';
      case 'Offline': return '#8E8E93';
      default: return '#8E8E93';
    }
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

  const renderCreator = ({ item }: { item: typeof mockCreators[0] }) => (
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

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#8E8E93" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search creators..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#8E8E93"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearSearchButton}>
              <Ionicons name="close-circle" size={20} color="#8E8E93" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Creators Grid */}
      <FlatList
        data={mockCreators}
        renderItem={renderCreator}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.creatorsList}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
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
                <Ionicons name="close" size={24} color="#666" />
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
                  <Text style={styles.optionPrice}>₹100</Text>
                </View>
                <Text style={styles.optionDescription}>One-time access to this profile</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.paymentOption, styles.recommendedOption]}
                onPress={() => handlePaymentOption('unlimited')}
              >
                <View style={styles.optionHeader}>
                  <Text style={styles.optionTitle}>Unlimited Today</Text>
                  <Text style={styles.optionPrice}>₹399</Text>
                </View>
                <Text style={styles.optionDescription}>Unlimited profile views for 24 hours</Text>
                <View style={styles.recommendedBadge}>
                  <Text style={styles.recommendedText}>Recommended</Text>
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
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray200,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.gray100,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  searchIcon: {
    marginRight: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: Typography.fontSize.base,
    color: Colors.gray900,
  },
  clearSearchButton: {
    marginLeft: Spacing.sm,
  },
  creatorsList: {
    padding: Spacing.sm,
  },
  creatorCard: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    margin: Spacing.xs,
    ...Shadows.md,
  },
  portfolioContainer: {
    position: 'relative',
  },
  portfolioImage: {
    width: '100%',
    height: 120,
    borderTopLeftRadius: BorderRadius.lg,
    borderTopRightRadius: BorderRadius.lg,
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
    fontWeight: '500',
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
    fontWeight: '600',
    marginLeft: Spacing.xs,
  },
  creatorInfo: {
    padding: Spacing.md,
  },
  creatorName: {
    fontSize: Typography.fontSize.base,
    fontWeight: '600',
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
    fontWeight: '600',
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
    fontWeight: '600',
    color: Colors.primary,
  },
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
    fontWeight: '600',
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
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
  },
  recommendedOption: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + '10',
  },
  optionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  optionTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: '600',
    color: Colors.gray900,
  },
  optionPrice: {
    fontSize: Typography.fontSize.lg,
    fontWeight: '700',
    color: Colors.primary,
  },
  optionDescription: {
    fontSize: Typography.fontSize.sm,
    color: Colors.gray600,
  },
  recommendedBadge: {
    position: 'absolute',
    top: -Spacing.xs,
    right: Spacing.md,
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  recommendedText: {
    color: Colors.white,
    fontSize: Typography.fontSize.xs,
    fontWeight: '600',
  },
});

export default SearchScreen;