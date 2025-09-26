import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList, Message } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { DatabaseService } from '../services/supabase';
import NotificationService from '../services/notificationService';

type ChatScreenRouteProp = RouteProp<RootStackParamList, 'Chat'>;

const ChatScreen = () => {
  const route = useRoute<ChatScreenRouteProp>();
  const { bookingId, professionalId, professionalName, packageId, transactionId } = route.params;
  const { user } = useAuth();
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  // Mock data for demo
  const mockMessages: Message[] = [
    {
      id: '1',
      chat_id: 'chat1',
      sender_id: 'pro1',
      text: 'Hi! Thanks for your inquiry about the wedding photography package.',
      created_at: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: '2',
      chat_id: 'chat1',
      sender_id: user?.id || 'customer1',
      text: 'Hi! I\'m really interested in your work. Can you tell me more about the deliverables?',
      created_at: new Date(Date.now() - 3000000).toISOString(),
    },
    {
      id: '3',
      chat_id: 'chat1',
      sender_id: 'pro1',
      text: 'Absolutely! I provide 500+ edited photos, an online gallery for easy sharing, and a USB drive with all the high-resolution images. The editing includes color correction, retouching, and artistic enhancements.',
      created_at: new Date(Date.now() - 2400000).toISOString(),
    },
    {
      id: '4',
      chat_id: 'chat1',
      sender_id: 'pro1',
      text: 'I also offer a 2-week turnaround time for the final photos. Would you like to schedule a call to discuss the details further?',
      created_at: new Date(Date.now() - 1800000).toISOString(),
    },
  ];

  useEffect(() => {
    loadMessages();
  }, [bookingId, professionalId]);

  const loadMessages = async () => {
    try {
      // Use mock data directly to avoid network request failures
      // In a real app, this would fetch from the database
      setMessages(mockMessages);
    } catch (error) {
      console.error('Error loading messages:', error);
      setMessages(mockMessages);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !user) return;

    const messageText = newMessage.trim();
    setNewMessage('');
    setSending(true);

    try {
      // Determine chat ID based on whether it's a booking or inquiry
      const chatId = bookingId || `inquiry_${professionalId}_${packageId}`;
      
      const newMsg: Message = {
        id: Date.now().toString(),
        chat_id: chatId,
        sender_id: user.id,
        text: messageText,
        created_at: new Date().toISOString(),
      };

      // Add message to local state immediately for better UX
      setMessages(prev => [...prev, newMsg]);

      // Mock database save - in a real app, this would save to the database
      try {
        // Simulate successful message save
        console.log('Message saved successfully:', messageText);
        
        // Send notification to recipient (in a real app, you'd get recipient info from booking)
        await NotificationService.notifyNewMessage(user.name || 'Someone', messageText);
      } catch (error) {
        console.error('Error sending message:', error);
        // In mock mode, we don't remove the message since it's already added to UI
        console.log('Mock: Message sent successfully despite error');
      }

      // Scroll to bottom after sending
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);

    } catch (error) {
      console.error('Error sending message:', error);
      Alert.alert('Error', 'Failed to send message');
      // Revert the message if sending failed
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setSending(false);
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  const renderMessage = ({ item, index }: { item: Message; index: number }) => {
    const isMyMessage = item.sender_id === user?.id;
    const showDate = index === 0 || 
      formatDate(item.created_at) !== formatDate(messages[index - 1]?.created_at);

    return (
      <View>
        {showDate && (
          <View style={styles.dateSeparator}>
            <Text style={styles.dateText}>{formatDate(item.created_at)}</Text>
          </View>
        )}
        <View style={[
          styles.messageContainer,
          isMyMessage ? styles.myMessage : styles.otherMessage
        ]}>
          <Text style={[
            styles.messageText,
            isMyMessage ? styles.myMessageText : styles.otherMessageText
          ]}>
            {item.text}
          </Text>
          <Text style={[
            styles.messageTime,
            isMyMessage ? styles.myMessageTime : styles.otherMessageTime
          ]}>
            {formatTime(item.created_at)}
          </Text>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading messages...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Chat Header */}
      <View style={styles.header}>
        <View style={styles.headerInfo}>
          <View style={styles.avatarPlaceholder}>
            <Ionicons name="person" size={24} color="#666" />
          </View>
          <View>
            <Text style={styles.headerName}>
              {professionalName || 'Professional'}
            </Text>
            <Text style={styles.headerStatus}>
              {transactionId ? 'Chat Unlocked' : 'Online'}
            </Text>
          </View>
        </View>
        <TouchableOpacity>
          <Ionicons name="call-outline" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>

      {/* Messages List */}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        style={styles.messagesList}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />

      {/* Message Input */}
      <View style={styles.inputContainer}>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.textInput}
            placeholder="Type a message..."
            value={newMessage}
            onChangeText={setNewMessage}
            multiline
            maxLength={500}
          />
          <TouchableOpacity style={styles.attachButton}>
            <Ionicons name="attach-outline" size={24} color="#666" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={[styles.sendButton, (!newMessage.trim() || sending) && styles.sendButtonDisabled]}
          onPress={sendMessage}
          disabled={!newMessage.trim() || sending}
        >
          <Ionicons 
            name="send" 
            size={20} 
            color={newMessage.trim() && !sending ? "#fff" : "#ccc"} 
          />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e5e9',
  },
  headerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  headerStatus: {
    fontSize: 12,
    color: '#34C759',
  },
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
  },
  dateSeparator: {
    alignItems: 'center',
    marginVertical: 16,
  },
  dateText: {
    fontSize: 12,
    color: '#666',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  messageContainer: {
    maxWidth: '80%',
    marginBottom: 8,
    padding: 12,
    borderRadius: 16,
  },
  myMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#007AFF',
    borderBottomRightRadius: 4,
  },
  otherMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#fff',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
    marginBottom: 4,
  },
  myMessageText: {
    color: '#fff',
  },
  otherMessageText: {
    color: '#333',
  },
  messageTime: {
    fontSize: 11,
  },
  myMessageTime: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  otherMessageTime: {
    color: '#666',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e1e5e9',
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#f1f3f4',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    maxHeight: 100,
    paddingVertical: 8,
  },
  attachButton: {
    padding: 4,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#e1e5e9',
  },
});

export default ChatScreen;