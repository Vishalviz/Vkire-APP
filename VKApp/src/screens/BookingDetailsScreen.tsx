import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import { Typography, Spacing, BorderRadius, Shadows } from '../constants/designSystem';
import PaymentService from '../services/paymentService';
import { useTheme } from '../contexts/AppThemeContext';

type BookingDetailsScreenRouteProp = RouteProp<RootStackParamList, 'BookingDetails'>;
type BookingDetailsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'BookingDetails'>;

const BookingDetailsScreen = () => {
  const route = useRoute<BookingDetailsScreenRouteProp>();
  const navigation = useNavigation<BookingDetailsScreenNavigationProp>();
  const { bookingId, booking } = route.params;
  const { colors } = useTheme();

  // Mock booking data
  const mockBooking = booking || {
    id: bookingId,
    proName: 'John Photography',
    service: 'Wedding Photography',
    date: '2024-01-15',
    time: '10:00 AM',
    location: 'Taj Palace, Mumbai',
    status: 'confirmed',
    payment_status: 'paid',
    total_amount: 25000,
    deposit_amount: 7500,
    currency: 'INR',
    package_details: {
      title: 'Premium Wedding Package',
      description: 'Full day wedding coverage with edited photos',
      deliverables: ['500+ edited photos', 'Online gallery', 'USB drive'],
      duration: 8,
    },
    contact_info: {
      phone: '+91 98765 43210',
      email: 'john@photography.com',
    },
  };

  const checkCancellationEligibility = () => {
    const now = new Date();
    const eventDate = new Date(mockBooking.date);
    const timeDiff = eventDate.getTime() - now.getTime();
    const hoursDiff = timeDiff / (1000 * 3600);

    // Check if payment is made
    if (mockBooking.payment_status !== 'paid') {
      return { eligible: false, reason: 'Payment not completed' };
    }

    // Check if event date has passed
    if (eventDate < now) {
      return { eligible: false, reason: 'Event date has passed' };
    }

    // Check if booking is already cancelled
    if (mockBooking.status === 'cancelled') {
      return { eligible: false, reason: 'Booking already cancelled' };
    }

    // Check 24-hour rule
    if (hoursDiff < 24) {
      return { eligible: false, reason: 'Cannot cancel within 24 hours of event' };
    }

    return { eligible: true, reason: '' };
  };

  const handleCancelBooking = () => {
    const eligibility = checkCancellationEligibility();
    
    if (!eligibility.eligible) {
      Alert.alert(
        'Cannot Cancel',
        eligibility.reason,
        [{ text: 'OK' }]
      );
      return;
    }

    Alert.alert(
      'Cancel Booking',
      'Are you sure you want to cancel this booking? This action cannot be undone.',
      [
        { text: 'Keep Booking', style: 'cancel' },
        {
          text: 'Cancel Booking',
          style: 'destructive',
          onPress: () => {
            Alert.alert(
              'Booking Cancelled',
              'Your booking has been cancelled. A refund will be processed within 5-7 business days.',
              [{ text: 'OK', onPress: () => navigation.goBack() }]
            );
          },
        },
      ]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return colors.primary;
      case 'completed': return colors.success;
      case 'cancelled': return colors.error;
      default: return colors.gray600;
    }
  };

  const isCancellationDisabled = !checkCancellationEligibility().eligible;

  const handleContactCreator = async () => {
    const professionalId = 'pro_' + mockBooking.id;
    
    // If user has a confirmed booking, they automatically have chat access
    // No need to check IAP since booking confirmation means they already went through inquiry flow
    if (mockBooking.status === 'confirmed' || mockBooking.status === 'completed') {
      // Navigate directly to chat - booking confirmation grants chat access
      navigation.navigate('Chat', {
        professionalId: professionalId,
        professionalName: mockBooking.proName,
        bookingId: mockBooking.id,
        transactionId: 'booking_access' // Special transaction ID for booking-based access
      });
      return;
    }
    
    // Only check IAP for non-confirmed bookings (e.g., pending, draft bookings)
    const hasAccess = await PaymentService.hasPurchasedChatAccess(professionalId);
    
    if (hasAccess) {
      // Navigate directly to chat
      navigation.navigate('Chat', {
        professionalId: professionalId,
        professionalName: mockBooking.proName,
        bookingId: mockBooking.id,
        transactionId: 'existing_access'
      });
    } else {
      // Show payment modal for chat access (only for non-confirmed bookings)
      PaymentService.showInquiryPaymentModal(
        professionalId,
        mockBooking.proName,
        'Wedding Photography',
        () => {
          // On successful payment, navigate to chat
          navigation.navigate('Chat', {
            professionalId: professionalId,
            professionalName: mockBooking.proName,
            bookingId: mockBooking.id,
            transactionId: 'new_purchase'
          });
        }
      );
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Custom Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={colors.gray900} />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>Booking Details</Text>
          </View>
          <View style={styles.headerRightSpacer} />
        </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Package Details */}
        <View style={styles.packageCard}>
          <View style={styles.packageHeader}>
            <View style={styles.statusContainer}>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(mockBooking.status) }]}>
                <Text style={styles.statusText}>{mockBooking.status.toUpperCase()}</Text>
              </View>
              <Text style={styles.bookingId}>#{mockBooking.id}</Text>
            </View>
          </View>
          
          <Text style={styles.packageTitle}>{mockBooking.package_details?.title || 'Package Details'}</Text>
          <Text style={styles.packageDescription}>{mockBooking.package_details?.description || 'No description available'}</Text>
          
          <View style={styles.deliverablesContainer}>
            <Text style={styles.deliverablesTitle}>What's Included:</Text>
            {(mockBooking.package_details?.deliverables || []).map((item, index) => (
              <View key={index} style={styles.deliverableItem}>
                <Ionicons name="checkmark-circle" size={16} color={colors.success} />
                <Text style={styles.deliverableText}>{item}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Event Details */}
        <View style={styles.detailsCard}>
          <Text style={styles.sectionTitle}>Event Details</Text>
          
          <View style={styles.detailRow}>
            <Ionicons name="calendar-outline" size={20} color={colors.gray600} />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Date & Time</Text>
              <Text style={styles.detailValue}>{mockBooking.date} at {mockBooking.time}</Text>
            </View>
          </View>
          
          <View style={styles.detailRow}>
            <Ionicons name="location-outline" size={20} color={colors.gray600} />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Location</Text>
              <Text style={styles.detailValue}>{mockBooking.location}</Text>
            </View>
          </View>
          
          <View style={styles.detailRow}>
            <Ionicons name="time-outline" size={20} color={colors.gray600} />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Duration</Text>
              <Text style={styles.detailValue}>{mockBooking.package_details?.duration || 0} hours</Text>
            </View>
          </View>
        </View>

        {/* Payment Details */}
        <View style={styles.paymentCard}>
          <Text style={styles.sectionTitle}>Payment Details</Text>
          
          <View style={styles.paymentRow}>
            <Text style={styles.paymentLabel}>Total Amount</Text>
            <Text style={styles.paymentValue}>₹{(mockBooking.total_amount || 0).toLocaleString()}</Text>
          </View>
          
          <View style={styles.paymentRow}>
            <Text style={styles.paymentLabel}>Deposit Paid</Text>
            <Text style={styles.paymentValue}>₹{(mockBooking.deposit_amount || 0).toLocaleString()}</Text>
          </View>
          
          <View style={[styles.paymentRow, styles.paymentTotal]}>
            <Text style={styles.paymentTotalLabel}>Remaining Balance</Text>
            <Text style={styles.paymentTotalValue}>₹{((mockBooking.total_amount || 0) - (mockBooking.deposit_amount || 0)).toLocaleString()}</Text>
          </View>
          
          <View style={styles.paymentStatus}>
            <Ionicons 
              name={mockBooking.payment_status === 'paid' ? 'checkmark-circle' : 'time-outline'} 
              size={16} 
              color={mockBooking.payment_status === 'paid' ? colors.success : colors.warning} 
            />
            <Text style={[styles.paymentStatusText, { color: mockBooking.payment_status === 'paid' ? colors.success : colors.warning }]}>
              {mockBooking.payment_status === 'paid' ? 'Payment Completed' : 'Payment Pending'}
            </Text>
          </View>
        </View>

        {/* Contact Information */}
        <View style={styles.contactCard}>
          <Text style={styles.sectionTitle}>Contact Information</Text>
          
          <TouchableOpacity style={styles.contactRow}>
            <Ionicons name="call-outline" size={20} color={colors.primary} />
            <Text style={styles.contactValue}>{mockBooking.contact_info?.phone || 'Not available'}</Text>
            <Ionicons name="chevron-forward" size={16} color={colors.gray400} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.contactRow}>
            <Ionicons name="mail-outline" size={20} color={colors.primary} />
            <Text style={styles.contactValue}>{mockBooking.contact_info?.email || 'Not available'}</Text>
            <Ionicons name="chevron-forward" size={16} color={colors.gray400} />
          </TouchableOpacity>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.cancelButton, isCancellationDisabled && styles.disabledButton]}
            onPress={handleCancelBooking}
            disabled={isCancellationDisabled}
          >
            <Ionicons name="close-circle-outline" size={20} color={isCancellationDisabled ? colors.gray400 : colors.error} />
            <Text style={[styles.cancelButtonText, isCancellationDisabled && styles.disabledButtonText]}>
              Cancel Booking
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.contactButton} onPress={handleContactCreator}>
            <Ionicons name="chatbubble-outline" size={20} color={colors.white} />
            <Text style={styles.contactButtonText}>
              {mockBooking.status === 'confirmed' || mockBooking.status === 'completed' 
                ? 'Chat with Creator' 
                : 'Contact Creator'
              }
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
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
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
    ...Shadows.sm,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semiBold,
    color: colors.gray900,
    textAlign: 'center',
  },
  headerRightSpacer: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: Spacing.lg,
  },
  packageCard: {
    backgroundColor: colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    ...Shadows.md,
  },
  packageHeader: {
    marginBottom: Spacing.md,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  statusBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  statusText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: '600',
    color: colors.white,
  },
  bookingId: {
    fontSize: Typography.fontSize.sm,
    color: colors.gray600,
  },
  packageTitle: {
    fontSize: Typography.fontSize.xl,
    fontWeight: '700',
    color: colors.gray900,
    marginBottom: Spacing.sm,
  },
  packageDescription: {
    fontSize: Typography.fontSize.base,
    color: colors.gray600,
    lineHeight: 22,
    marginBottom: Spacing.lg,
  },
  deliverablesContainer: {
    marginTop: Spacing.md,
  },
  deliverablesTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: '600',
    color: colors.gray900,
    marginBottom: Spacing.sm,
  },
  deliverableItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  deliverableText: {
    fontSize: Typography.fontSize.sm,
    color: colors.gray600,
    marginLeft: Spacing.sm,
  },
  detailsCard: {
    backgroundColor: colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    ...Shadows.md,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: '600',
    color: colors.gray900,
    marginBottom: Spacing.lg,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.lg,
  },
  detailContent: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  detailLabel: {
    fontSize: Typography.fontSize.sm,
    color: colors.gray600,
    marginBottom: Spacing.xs,
  },
  detailValue: {
    fontSize: Typography.fontSize.base,
    fontWeight: '500',
    color: colors.gray900,
  },
  paymentCard: {
    backgroundColor: colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    ...Shadows.md,
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  paymentLabel: {
    fontSize: Typography.fontSize.base,
    color: colors.gray600,
  },
  paymentValue: {
    fontSize: Typography.fontSize.base,
    fontWeight: '500',
    color: colors.gray900,
  },
  paymentTotal: {
    borderTopWidth: 1,
    borderTopColor: colors.gray200,
    paddingTop: Spacing.sm,
    marginTop: Spacing.sm,
  },
  paymentTotalLabel: {
    fontSize: Typography.fontSize.base,
    fontWeight: '600',
    color: colors.gray900,
  },
  paymentTotalValue: {
    fontSize: Typography.fontSize.lg,
    fontWeight: '700',
    color: colors.primary,
  },
  paymentStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.md,
  },
  paymentStatusText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: '500',
    marginLeft: Spacing.sm,
  },
  contactCard: {
    backgroundColor: colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    ...Shadows.md,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray100,
  },
  contactValue: {
    flex: 1,
    fontSize: Typography.fontSize.base,
    color: colors.gray900,
    marginLeft: Spacing.md,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  cancelButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: colors.error,
    backgroundColor: colors.white,
  },
  cancelButtonText: {
    fontSize: Typography.fontSize.base,
    fontWeight: '600',
    color: colors.error,
    marginLeft: Spacing.sm,
  },
  contactButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    backgroundColor: colors.primary,
  },
  contactButtonText: {
    fontSize: Typography.fontSize.base,
    fontWeight: '600',
    color: colors.white,
    marginLeft: Spacing.sm,
  },
  disabledButton: {
    borderColor: colors.gray300,
    backgroundColor: colors.gray100,
  },
  disabledButtonText: {
    color: colors.gray400,
  },
});

export default BookingDetailsScreen;