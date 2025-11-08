import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import { Spacing, Typography, BorderRadius, Shadows } from '../constants/designSystem';
import { useTheme } from '../contexts/AppThemeContext';

type InboxScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Main'>;

const InboxScreen = () => {
  const navigation = useNavigation<InboxScreenNavigationProp>();
  const [activeTab, setActiveTab] = useState<'chats' | 'notifications'>('chats');
  const [refreshing, setRefreshing] = useState(false);
  const [conversations, setConversations] = useState([
    {
      id: '1',
      bookingId: 'booking1',
      otherUser: {
        name: 'John Photography',
        handle: '@johnphoto',
      },
      lastMessage: 'Thanks for the inquiry! I\'d love to work with you.',
      timestamp: '2 hours ago',
      unreadCount: 2,
      type: 'inquiry',
    },
    {
      id: '2',
      bookingId: 'booking2',
      otherUser: {
        name: 'Sarah Studios',
        handle: '@sarahstudios',
      },
      lastMessage: 'The photos are ready for review.',
      timestamp: '1 day ago',
      unreadCount: 0,
      type: 'booking',
    },
  ]);

  const [notifications, setNotifications] = useState([
    {
      id: '1',
      type: 'inquiry_response',
      title: 'New Response to Your Inquiry',
      message: 'John Photography responded to your wedding photography inquiry',
      timestamp: '5 minutes ago',
      read: false,
      professionalId: 'pro1',
      professionalName: 'John Photography',
    },
    {
      id: '2',
      type: 'booking_confirmed',
      title: 'Booking Confirmed',
      message: 'Your portrait session with Sarah Studios has been confirmed',
      timestamp: '1 hour ago',
      read: false,
      bookingId: 'booking2',
    },
    {
      id: '3',
      type: 'message',
      title: 'New Message',
      message: 'You have a new message from Creative Lens',
      timestamp: '2 hours ago',
      read: true,
      professionalId: 'pro3',
      professionalName: 'Creative Lens',
    },
  ]);

  const { colors } = useTheme();

  const handleConversationPress = (bookingId: string) => {
    // Mark conversation as read when opened
    setConversations(prev => prev.map(conv => 
      conv.bookingId === bookingId 
        ? { ...conv, unreadCount: 0 }
        : conv
    ));
    navigation.navigate('Chat', { bookingId });
  };

  const handleNotificationPress = (notification: any) => {
    // Mark notification as read when opened
    setNotifications(prev => prev.map(notif => 
      notif.id === notification.id 
        ? { ...notif, read: true }
        : notif
    ));

    if (notification.type === 'inquiry_response' || notification.type === 'message') {
      // Navigate to chat with professional
      navigation.navigate('Chat', { 
        professionalId: notification.professionalId,
        professionalName: notification.professionalName,
        transactionId: 'existing_access'
      });
    } else if (notification.type === 'booking_confirmed') {
      // Navigate to booking details
      navigation.navigate('BookingDetails', { 
        bookingId: notification.bookingId 
      });
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const renderNotification = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={[styles.notificationItem, !item.read && styles.unreadNotification]}
      onPress={() => handleNotificationPress(item)}
    >
      <View style={styles.notificationIcon}>
        <Ionicons 
          name={
            item.type === 'inquiry_response' ? 'chatbubble-outline' :
            item.type === 'booking_confirmed' ? 'checkmark-circle-outline' :
            'notifications-outline'
          } 
          size={24} 
          color={item.read ? colors.gray500 : colors.primary} 
        />
      </View>
      <View style={styles.notificationContent}>
        <Text style={[styles.notificationTitle, !item.read && styles.unreadNotificationText]}>
          {item.title}
        </Text>
        <Text style={styles.notificationMessage}>
          {item.message}
        </Text>
        <Text style={styles.notificationTimestamp}>
          {item.timestamp}
        </Text>
      </View>
      {!item.read && <View style={styles.unreadDot} />}
    </TouchableOpacity>
  );

  const renderConversation = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.conversationItem}
      onPress={() => handleConversationPress(item.bookingId)}
    >
      <View style={styles.avatarContainer}>
        <View style={styles.avatarPlaceholder}>
          <Ionicons name="person" size={24} color={colors.gray500} />
        </View>
        {item.unreadCount > 0 && (
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadText}>{item.unreadCount}</Text>
          </View>
        )}
      </View>

      <View style={styles.conversationContent}>
        <View style={styles.conversationHeader}>
          <Text style={styles.userName}>{item.otherUser.name}</Text>
          <Text style={styles.timestamp}>{item.timestamp}</Text>
        </View>
        <Text style={styles.lastMessage} numberOfLines={2}>
          {item.lastMessage}
        </Text>
        <View style={styles.conversationFooter}>
          <View style={styles.typeTag}>
            <Text style={styles.typeText}>
              {item.type === 'inquiry' ? 'Inquiry' : 'Booking'}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Inbox</Text>
          <TouchableOpacity>
            <Ionicons name="create-outline" size={24} color={colors.primary} />
          </TouchableOpacity>
        </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'chats' && styles.activeTab]}
          onPress={() => setActiveTab('chats')}
        >
          <Text style={[styles.tabText, activeTab === 'chats' && styles.activeTabText]}>
            Chats ({conversations.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'notifications' && styles.activeTab]}
          onPress={() => setActiveTab('notifications')}
        >
          <Text style={[styles.tabText, activeTab === 'notifications' && styles.activeTabText]}>
            Notifications ({notifications.filter(n => !n.read).length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      {activeTab === 'chats' ? (
        conversations.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="chatbubbles-outline" size={64} color={colors.gray500} />
            <Text style={styles.emptyTitle}>No messages yet</Text>
            <Text style={styles.emptySubtitle}>
              Start a conversation by sending an inquiry to a creator
            </Text>
          </View>
        ) : (
          <FlatList
            data={conversations}
            renderItem={renderConversation}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.conversationsList}
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
        )
      ) : (
        notifications.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="notifications-outline" size={64} color={colors.gray500} />
            <Text style={styles.emptyTitle}>No notifications</Text>
            <Text style={styles.emptySubtitle}>
              You'll see updates about your bookings and inquiries here
            </Text>
          </View>
        ) : (
          <FlatList
            data={notifications}
            renderItem={renderNotification}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.notificationsList}
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
        )
      )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F5F5', // Merged color
  },
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5', // Merged color
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.lg,
    backgroundColor: '#F5F5F5', // Merged color
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0', // Merged color
    ...Shadows.sm,
  },
  headerTitle: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.semiBold,
    color: '#333', // Merged color
  },
  // Tab Navigation Styles
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#F5F5F5', // Merged color
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0', // Merged color
  },
  tab: {
    flex: 1,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    marginHorizontal: Spacing.xs,
    borderRadius: BorderRadius.full,
    backgroundColor: '#E0E0E0', // Merged color
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#007AFF', // Merged color
  },
  tabText: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.medium,
    color: '#666', // Merged color
  },
  activeTabText: {
    color: '#FFF', // Merged color
  },
  // Notification Styles
  notificationItem: {
    flexDirection: 'row',
    padding: Spacing.lg,
    backgroundColor: '#F5F5F5', // Merged color
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0', // Merged color
    alignItems: 'flex-start',
  },
  unreadNotification: {
    backgroundColor: '#F0F0F0', // Merged color
  },
  notificationIcon: {
    marginRight: Spacing.md,
    marginTop: Spacing.xs,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationContent: {
    flex: 1,
    paddingTop: Spacing.xs,
  },
  notificationTitle: {
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.semiBold,
    color: '#333', // Merged color
    marginBottom: Spacing.xs,
  },
  unreadNotificationText: {
    fontWeight: Typography.fontWeight.bold,
    color: '#333', // Merged color
  },
  notificationMessage: {
    fontSize: Typography.fontSize.base,
    color: '#666', // Merged color
    marginBottom: Spacing.xs,
    lineHeight: Typography.lineHeight.relaxed * Typography.fontSize.base,
  },
  notificationTimestamp: {
    fontSize: Typography.fontSize.sm,
    color: '#999', // Merged color
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: BorderRadius.full,
    backgroundColor: '#007AFF', // Merged color
    marginTop: Spacing.sm,
  },
  notificationsList: {
    paddingBottom: 20,
  },
  conversationsList: {
    padding: Spacing.lg,
  },
  conversationItem: {
    flexDirection: 'row',
    backgroundColor: '#F5F5F5', // Merged color
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    ...Shadows.md,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: BorderRadius.full,
    backgroundColor: '#E0E0E0', // Merged color
    justifyContent: 'center',
    alignItems: 'center',
  },
  unreadBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#FF5252', // Merged color
    borderRadius: BorderRadius.full,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unreadText: {
    color: '#FFF', // Merged color
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semiBold,
  },
  conversationContent: {
    flex: 1,
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  userName: {
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.semiBold,
    color: '#333', // Merged color
  },
  timestamp: {
    fontSize: Typography.fontSize.sm,
    color: '#999', // Merged color
  },
  lastMessage: {
    fontSize: Typography.fontSize.base,
    color: '#666', // Merged color
    lineHeight: Typography.lineHeight.relaxed * Typography.fontSize.base,
    marginBottom: Spacing.sm,
  },
  conversationFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  typeTag: {
    backgroundColor: '#007AFF', // Merged color
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  typeText: {
    fontSize: Typography.fontSize.xs,
    color: '#FFF', // Merged color
    fontWeight: Typography.fontWeight.medium,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing['3xl'],
  },
  emptyTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semiBold,
    color: '#333', // Merged color
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  emptySubtitle: {
    fontSize: Typography.fontSize.base,
    color: '#666', // Merged color
    textAlign: 'center',
    lineHeight: Typography.lineHeight.relaxed * Typography.fontSize.base,
  },
});

export default InboxScreen;