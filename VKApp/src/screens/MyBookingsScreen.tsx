import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../constants/designSystem';

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
  
  // Mock data for demo
  const bookings: Booking[] = [
    {
      id: '1',
      proName: 'Raj Photography',
      service: 'Wedding Photography',
      date: '2024-10-15',
      location: 'Delhi',
      status: 'confirmed',
      amount: 25000,
      type: 'booking',
    },
    {
      id: '2',
      proName: 'Mumbai Studios',
      service: 'Portfolio Shoot',
      date: '2024-09-20',
      location: 'Mumbai',
      status: 'completed',
      amount: 15000,
      type: 'booking',
    },
  ];

  const inquiries: Inquiry[] = [
    {
      id: '3',
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
      proName: 'Studio Pro',
      service: 'Fashion Photography',
      date: '2024-11-25',
      status: 'declined',
      amount: 499,
      type: 'inquiry',
      chatUnlocked: false,
    },
  ];

  // Combine bookings and inquiries
  const allItems = [...bookings, ...inquiries].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

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
      // Navigate to chat if unlocked, otherwise show payment modal
      if (item.chatUnlocked) {
        navigation.navigate('Chat', { bookingId: item.id });
      } else {
        // Show payment modal to unlock chat
        Alert.alert(
          'Unlock Chat',
          'Pay ₹499 to unlock chat with this professional.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Pay ₹499', onPress: () => {
              // Handle payment and unlock chat
              console.log('Payment for chat unlock');
            }}
          ]
        );
      }
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
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.title}>My Bookings</Text>
          <Text style={styles.subtitle}>Track your photography bookings</Text>
        </View>
      </View>

      <FlatList
        data={allItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="calendar-outline" size={64} color="#8E8E93" />
            <Text style={styles.emptyTitle}>No bookings yet</Text>
            <Text style={styles.emptySubtitle}>
              Browse the feed and book your first photography session
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
    backgroundColor: Colors.gray50,
  },
  header: {
    paddingHorizontal: Spacing.xl,
    paddingTop: 50,
    paddingBottom: Spacing.lg,
    backgroundColor: Colors.white,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.gray200,
    ...Shadows.sm,
  },
  headerContent: {
    alignItems: 'center',
  },
  title: {
    fontSize: Typography.fontSize['2xl'],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.gray900,
    marginBottom: Spacing.xs,
    letterSpacing: 0.3,
  },
  subtitle: {
    fontSize: Typography.fontSize.base,
    color: Colors.gray600,
    fontWeight: Typography.fontWeight.regular,
    textAlign: 'center',
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
    borderRadius: BorderRadius.lg,
  },
  statusText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.semiBold,
    color: Colors.white,
  },
  typeBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
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
});

export default MyBookingsScreen;
