import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TextInput,
  Alert,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import { Typography, Spacing, BorderRadius, Shadows } from '../constants/designSystem';
import { useTheme } from '../contexts/AppThemeContext';

type HelpSupportScreenNavigationProp = StackNavigationProp<RootStackParamList, 'HelpSupport'>;

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'general' | 'booking' | 'payment' | 'account';
}

interface ContactOption {
  id: string;
  title: string;
  description: string;
  icon: string;
  action: () => void;
  color: string;
}

const HelpSupportScreen = () => {
  const navigation = useNavigation<HelpSupportScreenNavigationProp>();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);
  const [contactMessage, setContactMessage] = useState('');
  const { colors } = useTheme();

  const faqData: FAQItem[] = [
    {
      id: '1',
      question: 'How do I book a service?',
      answer: 'To book a service, browse through our creators, view their packages, and click "Book" on your preferred package. You\'ll be guided through the booking process including date selection and payment.',
      category: 'booking',
    },
    {
      id: '2',
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit/debit cards, UPI payments, and digital wallets. All payments are processed securely through our encrypted payment gateway.',
      category: 'payment',
    },
    {
      id: '3',
      question: 'How do I cancel a booking?',
      answer: 'You can cancel a booking from your "My Bookings" section. Cancellation policies vary by creator, so please check the specific terms before booking.',
      category: 'booking',
    },
    {
      id: '4',
      question: 'How do I contact a creator?',
      answer: 'After sending an inquiry or booking a service, you can chat with the creator directly through our in-app messaging system.',
      category: 'general',
    },
    {
      id: '5',
      question: 'How do I update my profile?',
      answer: 'Go to your Profile tab, tap "Edit Profile", and update your information. Don\'t forget to save your changes!',
      category: 'account',
    },
    {
      id: '6',
      question: 'What if I have issues with a service?',
      answer: 'If you encounter any issues, please contact our support team immediately. We\'ll work with you and the creator to resolve the matter quickly.',
      category: 'general',
    },
    {
      id: '7',
      question: 'How do I become a creator?',
      answer: 'Sign up as a professional, complete your profile, and start creating service packages. Our team will review your application and approve your account.',
      category: 'account',
    },
    {
      id: '8',
      question: 'Are there any fees for creators?',
      answer: 'We charge a small commission on completed bookings to maintain our platform. This fee is automatically deducted from your earnings.',
      category: 'payment',
    },
  ];

  const contactOptions: ContactOption[] = [
    {
      id: 'email',
      title: 'Email Support',
      description: 'Get help via email within 24 hours',
      icon: 'mail',
      color: colors.primary,
      action: () => {
        Linking.openURL('mailto:support@vkire.com?subject=Support Request');
      },
    },
    {
      id: 'phone',
      title: 'Phone Support',
      description: 'Call us for immediate assistance',
      icon: 'call',
      color: colors.success,
      action: () => {
        Linking.openURL('tel:+1234567890');
      },
    },
    {
      id: 'chat',
      title: 'Live Chat',
      description: 'Chat with our support team',
      icon: 'chatbubble',
      color: colors.warning,
      action: () => {
        Alert.alert('Live Chat', 'Live chat feature will be available soon!');
      },
    },
    {
      id: 'whatsapp',
      title: 'WhatsApp',
      description: 'Message us on WhatsApp',
      icon: 'logo-whatsapp',
      color: colors.success,
      action: () => {
        Linking.openURL('https://wa.me/1234567890');
      },
    },
  ];

  const filteredFAQ = faqData.filter(faq => 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleFAQPress = (id: string) => {
    setExpandedFAQ(expandedFAQ === id ? null : id);
  };

  const handleSendMessage = () => {
    if (!contactMessage.trim()) {
      Alert.alert('Error', 'Please enter your message');
      return;
    }

    Alert.alert(
      'Message Sent',
      'Thank you for contacting us! We\'ll get back to you within 24 hours.',
      [{ text: 'OK', onPress: () => setContactMessage('') }]
    );
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'general': return colors.primary;
      case 'booking': return colors.success;
      case 'payment': return colors.warning;
      case 'account': return colors.error;
      default: return colors.primary;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'general': return 'help-circle';
      case 'booking': return 'calendar';
      case 'payment': return 'card';
      case 'account': return 'person';
      default: return 'help-circle';
    }
  };

  const styles = useMemo(() => StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.surface,
    },
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: Spacing.lg,
      paddingVertical: Spacing.md,
      borderBottomWidth: 0.5,
      borderBottomColor: colors.gray200,
      backgroundColor: colors.surface,
    },
    headerTitle: {
      fontSize: Typography.fontSize.lg,
      fontWeight: Typography.fontWeight.semiBold,
      color: colors.gray900,
    },
    headerSpacer: {
      width: 24,
    },
    content: {
      flex: 1,
      padding: Spacing.lg,
    },
    searchSection: {
      marginBottom: Spacing.xl,
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surface,
      borderRadius: BorderRadius.full,
      paddingHorizontal: Spacing.md,
      borderWidth: 1,
      borderColor: colors.gray200,
      ...Shadows.sm,
    },
    searchIcon: {
      marginRight: Spacing.sm,
    },
    searchInput: {
      flex: 1,
      paddingVertical: Spacing.md,
      fontSize: Typography.fontSize.base,
      color: colors.gray900,
    },
    sectionHeader: {
      marginBottom: Spacing.lg,
    },
    sectionTitle: {
      fontSize: Typography.fontSize.lg,
      fontWeight: Typography.fontWeight.semiBold,
      color: colors.gray900,
      marginBottom: Spacing.xs,
    },
    sectionSubtitle: {
      fontSize: Typography.fontSize.sm,
      color: colors.gray600,
    },
    contactGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: Spacing.md,
      marginBottom: Spacing.xl,
    },
    contactCard: {
      width: '48%',
      backgroundColor: colors.surface,
      borderRadius: BorderRadius.lg,
      padding: Spacing.lg,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.gray200,
      ...Shadows.sm,
    },
    contactIcon: {
      width: 48,
      height: 48,
      borderRadius: BorderRadius.lg,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: Spacing.md,
    },
    contactTitle: {
      fontSize: Typography.fontSize.sm,
      fontWeight: Typography.fontWeight.semiBold,
      color: colors.gray900,
      marginBottom: Spacing.xs,
      textAlign: 'center',
    },
    contactDescription: {
      fontSize: Typography.fontSize.xs,
      color: colors.gray600,
      textAlign: 'center',
      lineHeight: Typography.lineHeight.relaxed * Typography.fontSize.xs,
    },
    faqList: {
      marginBottom: Spacing.xl,
    },
    faqItem: {
      backgroundColor: colors.surface,
      borderRadius: BorderRadius.lg,
      marginBottom: Spacing.md,
      borderWidth: 1,
      borderColor: colors.gray200,
      overflow: 'hidden',
      ...Shadows.sm,
    },
    faqHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: Spacing.lg,
    },
    faqInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    categoryBadge: {
      width: 24,
      height: 24,
      borderRadius: BorderRadius.full,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: Spacing.sm,
    },
    faqQuestion: {
      fontSize: Typography.fontSize.sm,
      fontWeight: Typography.fontWeight.medium,
      color: colors.gray900,
      flex: 1,
    },
    faqAnswer: {
      paddingHorizontal: Spacing.lg,
      paddingBottom: Spacing.lg,
      borderTopWidth: 1,
      borderTopColor: colors.gray200,
    },
    faqAnswerText: {
      fontSize: Typography.fontSize.sm,
      color: colors.gray700,
      lineHeight: Typography.lineHeight.relaxed * Typography.fontSize.sm,
    },
    contactForm: {
      backgroundColor: colors.surface,
      borderRadius: BorderRadius.lg,
      padding: Spacing.lg,
      marginBottom: Spacing.xl,
      borderWidth: 1,
      borderColor: colors.gray200,
      ...Shadows.sm,
    },
    messageInput: {
      backgroundColor: colors.background,
      borderRadius: BorderRadius.lg,
      padding: Spacing.md,
      fontSize: Typography.fontSize.base,
      color: colors.gray900,
      borderWidth: 1,
      borderColor: colors.gray200,
      marginBottom: Spacing.lg,
      minHeight: 100,
    },
    sendButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.primary,
      borderRadius: BorderRadius.full,
      paddingVertical: Spacing.md,
      paddingHorizontal: Spacing.lg,
      gap: Spacing.sm,
    },
    sendButtonText: {
      fontSize: Typography.fontSize.base,
      fontWeight: Typography.fontWeight.semiBold,
      color: colors.white,
    },
    appInfo: {
      backgroundColor: colors.primary + '10',
      borderRadius: BorderRadius.lg,
      padding: Spacing.lg,
      borderWidth: 1,
      borderColor: colors.primary + '30',
      alignItems: 'center',
    },
    appInfoTitle: {
      fontSize: Typography.fontSize.base,
      fontWeight: Typography.fontWeight.semiBold,
      color: colors.primary,
      marginBottom: Spacing.sm,
    },
    appInfoText: {
      fontSize: Typography.fontSize.sm,
      color: colors.gray700,
      textAlign: 'center',
      lineHeight: Typography.lineHeight.relaxed * Typography.fontSize.sm,
    },
  }), [colors]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={colors.gray900} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Help & Support</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Search Section */}
          <View style={styles.searchSection}>
            <View style={styles.searchContainer}>
              <Ionicons name="search" size={20} color={colors.gray500} style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search for help..."
                placeholderTextColor={colors.gray500}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                  <Ionicons name="close-circle" size={20} color={colors.gray500} />
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Quick Contact */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Get Help</Text>
            <Text style={styles.sectionSubtitle}>Choose your preferred way to contact us</Text>
          </View>

          <View style={styles.contactGrid}>
            {contactOptions.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={styles.contactCard}
                onPress={option.action}
              >
                <View style={[styles.contactIcon, { backgroundColor: option.color + '20' }]}>
                  <Ionicons name={option.icon as any} size={24} color={option.color} />
                </View>
                <Text style={styles.contactTitle}>{option.title}</Text>
                <Text style={styles.contactDescription}>{option.description}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* FAQ Section */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
            <Text style={styles.sectionSubtitle}>
              {searchQuery ? `${filteredFAQ.length} result${filteredFAQ.length === 1 ? '' : 's'} found` : 'Find answers to common questions'}
            </Text>
          </View>

          <View style={styles.faqList}>
            {filteredFAQ.map((faq) => (
              <View key={faq.id} style={styles.faqItem}>
                <TouchableOpacity
                  style={styles.faqHeader}
                  onPress={() => handleFAQPress(faq.id)}
                >
                  <View style={styles.faqInfo}>
                    <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(faq.category) + '20' }]}>
                      <Ionicons name={getCategoryIcon(faq.category) as any} size={14} color={getCategoryColor(faq.category)} />
                    </View>
                    <Text style={styles.faqQuestion}>{faq.question}</Text>
                  </View>
                  <Ionicons 
                    name={expandedFAQ === faq.id ? "chevron-up" : "chevron-down"} 
                    size={20} 
                    color={colors.gray500} 
                  />
                </TouchableOpacity>
                
                {expandedFAQ === faq.id && (
                  <View style={styles.faqAnswer}>
                    <Text style={styles.faqAnswerText}>{faq.answer}</Text>
                  </View>
                )}
              </View>
            ))}
          </View>

          {/* Contact Form */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Send us a Message</Text>
            <Text style={styles.sectionSubtitle}>Can't find what you're looking for? Send us a message</Text>
          </View>

          <View style={styles.contactForm}>
            <TextInput
              style={styles.messageInput}
              placeholder="Describe your issue or question..."
              placeholderTextColor={colors.gray500}
              value={contactMessage}
              onChangeText={setContactMessage}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
            <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
              <Ionicons name="send" size={20} color={colors.white} />
              <Text style={styles.sendButtonText}>Send Message</Text>
            </TouchableOpacity>
          </View>

          {/* App Info */}
          <View style={styles.appInfo}>
            <Text style={styles.appInfoTitle}>Vkire v2.0.0</Text>
            <Text style={styles.appInfoText}>
              We're constantly improving our app. If you have any suggestions or feedback, please let us know!
            </Text>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default HelpSupportScreen;
