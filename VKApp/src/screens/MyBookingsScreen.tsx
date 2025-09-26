import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  RefreshControl,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../constants/designSystem';
import PaymentService from '../services/paymentService';

type MyBookingsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Main'>;

interface Booking {
  id: string;
  proName: string;
  service: string;
  date: string;
  location: string;
  status: 'confirmed' | 'completed' | 'cancelled';
  amount: number;
  proAvatar?: string;
  type: 'booking';
}

interface Inquiry {
  id: string;
  proId: string;
  proName: string;
  service: string;
  date: string;
  status: 'pending' | 'accepted' | 'declined';
  amount: number;
  proAvatar?: string;
  type: 'inquiry';
  chatUnlocked: boolean;
}

const MyBookingsScreen: React.FC = () => {
  const navigation = useNavigation<MyBookingsScreenNavigationProp>();
  
  // Enhanced mock data for comprehensive testing
  const [bookings, setBookings] = useState<Booking[]>([
    {
      id: '1',
      proName: 'Raj Photography',
      service: 'Wedding Photography',
      date: '2024-12-15',
      location: 'Mumbai, Maharashtra',
      status: 'confirmed',
      amount: 25000,
      type: 'booking',
    },
    {
      id: '2',
      proName: 'Creative Studio',
      service: 'Corporate Event',
      date: '2024-11-20',
      location: 'Delhi, NCR',
      status: 'completed',
      amount: 15000,
      type: 'booking',
    },
    {
      id: '6',
      proName: 'Lens Master',
      service: 'Portrait Session',
      date: '2024-12-20',
      location: 'Bangalore, Karnataka',
      status: 'confirmed',
      amount: 8000,
      type: 'booking',
    },
    {
      id: '7',
      proName: 'Event Captures',
      service: 'Birthday Party',
      date: '2024-11-05',
      location: 'Pune, Maharashtra',
      status: 'cancelled',
      amount: 5000,
      type: 'booking',
    },
  ]);

  const [inquiries, setInquiries] = useState<Inquiry[]>([
    {
      id: '3',
      proId: 'pro1',
      proName: 'Creative Lens',
      service: 'Event Photography',
      date: '2024-11-10',
      status: 'pending',
      amount: 499,
      type: 'inquiry',
      chatUnlocked: true,
    },
    {
      id: '4',
      proId: 'pro2',
      proName: 'Photo Magic',
      service: 'Corporate Shoot',
      date: '2024-12-05',
      status: 'accepted',
      amount: 499,
      type: 'inquiry',
      chatUnlocked: true,
    },
    {
      id: '5',
      proId: 'pro3',
      proName: 'Studio Pro',
      service: 'Fashion Photography',
      date: '2024-11-25',
      status: 'declined',
      amount: 499,
      type: 'inquiry',
      chatUnlocked: false,
    },
    {
      id: '8',
      proId: 'pro4',
      proName: 'Wedding Dreams',
      service: 'Pre-Wedding Shoot',
      date: '2024-12-10',
      status: 'pending',
      amount: 499,
      type: 'inquiry',
      chatUnlocked: false,
    },
    {
      id: '9',
      proId: 'pro5',
      proName: 'Nature Clicks',
      service: 'Outdoor Photography',
      date: '2024-11-30',
      status: 'accepted',
      amount: 499,
      type: 'inquiry',
      chatUnlocked: true,
    },
  ]);

  // State management for filtering and search
  const [activeFilter, setActiveFilter] = useState<'all' | 'bookings' | 'inquiries'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);

  // Filter and search functionality
  const getFilteredItems = useCallback(() => {
    let items: (Booking | Inquiry)[] = [];
    
    // Apply type filter
    switch (activeFilter) {
      case 'bookings':
        items = bookings;
        break;
      case 'inquiries':
        items = inquiries;
        break;
      default:
        items = [...bookings, ...inquiries];
    }
    
    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      items = items.filter(item => 
        item.proName.toLowerCase().includes(query) ||
        item.service.toLowerCase().includes(query) ||
        (item.type === 'booking' && 'location' in item && item.location?.toLowerCase().includes(query))
      );
    }
    
    // Sort by date (newest first)
    return items.sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, [bookings, inquiries, activeFilter, searchQuery]);

  const filteredItems = getFilteredItems();

  // Pull to refresh functionality
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    // Simulate API call delay
    setTimeout(() => {
      setRefreshing(false);
      // In a real app, you would refetch data here
      console.log('Data refreshed');
    }, 1000);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return Colors.primary;
      case 'completed': return Colors.success;
      case 'cancelled': return Colors.error;
      case 'pending': return Colors.warning;
      case 'accepted': return Colors.success;
      case 'declined': return Colors.error;
      default: return Colors.gray500;
    }
  };

  const handleItemPress = (item: Booking | Inquiry) => {
    if (item.type === 'booking') {
      navigation.navigate('BookingDetails', { 
        bookingId: item.id, 
        booking: item 
      });
    } else if (item.type === 'inquiry') {
      // Check if user has purchased chat access for this professional
      PaymentService.hasPurchasedChatAccess(item.proId).then(hasAccess => {
        if (hasAccess) {
          // User has access, navigate to chat
          navigation.navigate('Chat', { 
            professionalId: item.proId,
            professionalName: item.proName,
            packageId: item.service,
            transactionId: 'existing_access'
          });
        } else {
          // Show payment modal to unlock chat
          PaymentService.showInquiryPaymentModal(
            item.proId,
            (transactionId) => {
              // Payment successful, navigate to chat
              navigation.navigate('Chat', { 
                professionalId: item.proId,
                professionalName: item.proName,
                packageId: item.service,
                transactionId: transactionId
              });
            },
            () => {
              // Payment cancelled
              console.log('Payment cancelled');
            }
          );
        }
      });
    }
  };

  const renderItem = ({ item }: { item: Booking | Inquiry }) => (
    <TouchableOpacity 
      style={styles.bookingCard}
      onPress={() => handleItemPress(item)}
    >
      <View style={styles.bookingHeader}>
        <View style={styles.proInfo}>
          <View style={styles.avatarPlaceholder}>
            <Ionicons name="person" size={24} color="#8E8E93" />
          </View>
          <View style={styles.proDetails}>
            <Text style={styles.proName}>{item.proName}</Text>
            <Text style={styles.service}>{item.service}</Text>
          </View>
        </View>
        <View style={styles.statusContainer}>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
            <Text style={styles.statusText}>{item.status.toUpperCase()}</Text>
          </View>
          {item.type === 'inquiry' && (
            <View style={styles.typeBadge}>
              <Text style={styles.typeText}>INQUIRY</Text>
            </View>
          )}
        </View>
      </View>
      
      <View style={styles.bookingDetails}>
        <View style={styles.detailRow}>
          <Ionicons name="calendar-outline" size={16} color="#8E8E93" />
          <Text style={styles.detailText}>{item.date}</Text>
        </View>
        {item.type === 'booking' && 'location' in item && (
          <View style={styles.detailRow}>
            <Ionicons name="location-outline" size={16} color="#8E8E93" />
            <Text style={styles.detailText}>{item.location}</Text>
          </View>
        )}
        <View style={styles.detailRow}>
          <Ionicons name="card-outline" size={16} color="#8E8E93" />
          <Text style={styles.detailText}>₹{item.amount.toLocaleString()}</Text>
        </View>
        {item.type === 'inquiry' && (
          <View style={styles.detailRow}>
            <Ionicons 
              name={item.chatUnlocked ? "chatbubble-outline" : "lock-closed-outline"} 
              size={16} 
              color={item.chatUnlocked ? Colors.success : Colors.gray500} 
            />
            <Text style={[styles.detailText, { color: item.chatUnlocked ? Colors.success : Colors.gray500 }]}>
              {item.chatUnlocked ? 'Chat Available' : 'Chat Locked'}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Modern Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>My Bookings</Text>
          <Text style={styles.headerSubtitle}>Track your bookings and inquiries</Text>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={20} color={Colors.gray500} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search bookings, professionals, services..."
            placeholderTextColor={Colors.gray500}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color={Colors.gray500} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterTab, activeFilter === 'all' && styles.activeFilterTab]}
          onPress={() => setActiveFilter('all')}
        >
          <Text style={[styles.filterTabText, activeFilter === 'all' && styles.activeFilterTabText]}>
            All ({bookings.length + inquiries.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterTab, activeFilter === 'bookings' && styles.activeFilterTab]}
          onPress={() => setActiveFilter('bookings')}
        >
          <Text style={[styles.filterTabText, activeFilter === 'bookings' && styles.activeFilterTabText]}>
            Bookings ({bookings.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterTab, activeFilter === 'inquiries' && styles.activeFilterTab]}
          onPress={() => setActiveFilter('inquiries')}
        >
          <Text style={[styles.filterTabText, activeFilter === 'inquiries' && styles.activeFilterTabText]}>
            Inquiries ({inquiries.length})
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.primary}
            colors={[Colors.primary]}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons 
              name={searchQuery ? "search-outline" : "calendar-outline"} 
              size={64} 
              color={Colors.gray400} 
            />
            <Text style={styles.emptyTitle}>
              {searchQuery ? "No results found" : "No bookings yet"}
            </Text>
            <Text style={styles.emptySubtitle}>
              {searchQuery 
                ? `No bookings match "${searchQuery}"`
                : "Browse the feed and book your first photography session"
              }
            </Text>
            {searchQuery && (
              <TouchableOpacity 
                style={styles.clearSearchButton}
                onPress={() => setSearchQuery('')}
              >
                <Text style={styles.clearSearchText}>Clear Search</Text>
              </TouchableOpacity>
            )}
          </View>
        }
      />
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
    marginBottom: Spacing.xs,
  },
  headerSubtitle: {
    fontSize: Typography.fontSize.base,
    color: Colors.gray600,
    fontWeight: Typography.fontWeight.regular,
    textAlign: 'center',
  },
  // Search Bar Styles
  searchContainer: {
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.gray200,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.gray100,
    borderRadius: BorderRadius.xl,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    marginLeft: Spacing.sm,
    fontSize: Typography.fontSize.base,
    color: Colors.gray900,
  },
  // Filter Tabs Styles
  filterContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.gray200,
  },
  filterTab: {
    flex: 1,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    marginHorizontal: Spacing.xs,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.gray100,
    alignItems: 'center',
  },
  activeFilterTab: {
    backgroundColor: Colors.primary,
  },
  filterTabText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.gray600,
  },
  activeFilterTabText: {
    color: Colors.white,
  },
  listContainer: {
    padding: Spacing.lg,
  },
  bookingCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius['2xl'],
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    ...Shadows.lg,
    borderWidth: 0.5,
    borderColor: Colors.gray100,
  },
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  proInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.xl,
    backgroundColor: Colors.gray100,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
    borderWidth: 2,
    borderColor: Colors.gray200,
  },
  proDetails: {
    flex: 1,
  },
  proName: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semiBold,
    color: Colors.gray900,
    marginBottom: Spacing.xs,
  },
  service: {
    fontSize: Typography.fontSize.sm,
    color: Colors.gray600,
    fontWeight: Typography.fontWeight.medium,
  },
  statusContainer: {
    flexDirection: 'row',
    gap: Spacing.sm,
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
  },
  statusText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.semiBold,
    color: Colors.white,
  },
  typeBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primary + '20',
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  typeText: {
    color: Colors.primary,
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.semiBold,
  },
  bookingDetails: {
    gap: Spacing.sm,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  detailText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.gray600,
    fontWeight: Typography.fontWeight.medium,
  },
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
    color: Colors.gray500,
    textAlign: 'center',
    lineHeight: Typography.lineHeight.relaxed * Typography.fontSize.base,
    fontWeight: Typography.fontWeight.regular,
  },
  clearSearchButton: {
    marginTop: Spacing.lg,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.full,
  },
  clearSearchText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.white,
    textAlign: 'center',
  },
});

export default MyBookingsScreen;
