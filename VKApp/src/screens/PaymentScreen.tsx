import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { PaymentService, PaymentIntent } from '../services/paymentService';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../constants/designSystem';

type PaymentScreenRouteProp = RouteProp<RootStackParamList, 'BookingDetails'>;
type PaymentScreenNavigationProp = StackNavigationProp<RootStackParamList, 'BookingDetails'>;

const PaymentScreen = () => {
  const route = useRoute<PaymentScreenRouteProp>();
  const navigation = useNavigation<PaymentScreenNavigationProp>();
  const { user } = useAuth();
  const { bookingId } = route.params;

  const [paymentIntent, setPaymentIntent] = useState<PaymentIntent | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null);

  // Mock booking data
  const mockBooking = {
    id: bookingId,
    total_amount: 25000,
    deposit_amount: 7500, // 30% of total
    currency: 'INR',
    service: 'Wedding Photography',
    creator_name: 'John Photography',
    date: '2024-01-15',
  };

  useEffect(() => {
    initializePayment();
  }, []);

  const initializePayment = async () => {
    try {
      setLoading(true);
      const intent = await PaymentService.createDepositPaymentIntent(
        bookingId,
        mockBooking.deposit_amount,
        mockBooking.currency
      );
      setPaymentIntent(intent);
    } catch (error) {
      console.error('Error initializing payment:', error);
      Alert.alert('Error', 'Failed to initialize payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!paymentIntent || !user) return;

    setProcessing(true);
    try {
      const result = await PaymentService.processPayment(
        paymentIntent.client_secret,
        selectedPaymentMethod || undefined
      );

      if (result.success) {
        // Save payment record
        await PaymentService.savePaymentRecord(
          bookingId,
          result.paymentIntentId!,
          mockBooking.deposit_amount,
          'deposit'
        );

        Alert.alert(
          'Payment Successful!',
          'Your deposit has been processed successfully. The creator will be notified.',
          [
            {
              text: 'OK',
              onPress: () => navigation.goBack(),
            },
          ]
        );
      } else {
        Alert.alert('Payment Failed', result.error || 'Please try again.');
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      Alert.alert('Error', 'Payment failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const renderPaymentMethod = (method: any) => (
    <TouchableOpacity
      key={method.id}
      style={[
        styles.paymentMethodCard,
        selectedPaymentMethod === method.id && styles.selectedPaymentMethod,
      ]}
      onPress={() => setSelectedPaymentMethod(method.id)}
    >
      <View style={styles.paymentMethodInfo}>
        <View style={styles.cardIcon}>
          <Ionicons
            name={method.card.brand === 'visa' ? 'card' : 'card-outline'}
            size={24}
            color="#007AFF"
          />
        </View>
        <View style={styles.cardDetails}>
          <Text style={styles.cardBrand}>
            {method.card.brand.toUpperCase()} •••• {method.card.last4}
          </Text>
          <Text style={styles.cardExpiry}>
            Expires {method.card.exp_month}/{method.card.exp_year}
          </Text>
        </View>
      </View>
      {selectedPaymentMethod === method.id && (
        <Ionicons name="checkmark-circle" size={24} color="#007AFF" />
      )}
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Initializing payment...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Custom Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={Colors.gray900} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment</Text>
        <View style={styles.headerSpacer} />
      </View>
      
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
      {/* Booking Summary */}
      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Payment Summary</Text>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Service</Text>
          <Text style={styles.summaryValue}>{mockBooking.service}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Creator</Text>
          <Text style={styles.summaryValue}>{mockBooking.creator_name}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Date</Text>
          <Text style={styles.summaryValue}>{mockBooking.date}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Total Amount</Text>
          <Text style={styles.summaryValue}>
            {PaymentService.formatAmount(mockBooking.total_amount, mockBooking.currency)}
          </Text>
        </View>
        <View style={[styles.summaryRow, styles.depositRow]}>
          <Text style={styles.depositLabel}>Deposit (30%)</Text>
          <Text style={styles.depositValue}>
            {PaymentService.formatAmount(mockBooking.deposit_amount, mockBooking.currency)}
          </Text>
        </View>
      </View>

      {/* Payment Methods */}
      <View style={styles.paymentMethodsCard}>
        <Text style={styles.sectionTitle}>Payment Method</Text>
        <Text style={styles.sectionSubtitle}>
          Choose your preferred payment method
        </Text>

        {/* Mock payment methods */}
        {[
          {
            id: 'pm_1',
            card: { brand: 'visa', last4: '4242', exp_month: 12, exp_year: 2025 },
          },
          {
            id: 'pm_2',
            card: { brand: 'mastercard', last4: '5555', exp_month: 8, exp_year: 2026 },
          },
        ].map(renderPaymentMethod)}

        <TouchableOpacity style={styles.addPaymentMethodButton}>
          <Ionicons name="add-circle-outline" size={24} color="#007AFF" />
          <Text style={styles.addPaymentMethodText}>Add New Payment Method</Text>
        </TouchableOpacity>
      </View>

      {/* Security Info */}
      <View style={styles.securityCard}>
        <View style={styles.securityHeader}>
          <Ionicons name="shield-checkmark" size={20} color="#34C759" />
          <Text style={styles.securityTitle}>Secure Payment</Text>
        </View>
        <Text style={styles.securityText}>
          Your payment information is encrypted and secure. We use industry-standard 
          security measures to protect your data.
        </Text>
      </View>

      {/* Terms */}
      <View style={styles.termsCard}>
        <Text style={styles.termsText}>
          By proceeding with this payment, you agree to our terms and conditions. 
          The deposit is non-refundable unless the creator cancels the booking.
        </Text>
      </View>

      {/* Payment Button */}
      <TouchableOpacity
        style={[styles.paymentButton, processing && styles.paymentButtonDisabled]}
        onPress={handlePayment}
        disabled={processing || !selectedPaymentMethod}
      >
        {processing ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <>
            <Ionicons name="card" size={20} color="#fff" />
            <Text style={styles.paymentButtonText}>
              Pay {PaymentService.formatAmount(mockBooking.deposit_amount, mockBooking.currency)}
            </Text>
          </>
        )}
      </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray50,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    paddingTop: 60,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray200,
  },
  backButton: {
    padding: Spacing.sm,
  },
  headerTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: '600',
    color: Colors.gray900,
    flex: 2,
    textAlign: 'center',
  },
  headerSpacer: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: Spacing.lg,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.gray50,
  },
  loadingText: {
    marginTop: Spacing.md,
    fontSize: Typography.fontSize.base,
    color: Colors.gray600,
  },
  summaryCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    ...Shadows.md,
  },
  summaryTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: '600',
    color: Colors.gray900,
    marginBottom: Spacing.md,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  summaryLabel: {
    fontSize: Typography.fontSize.sm,
    color: Colors.gray600,
  },
  summaryValue: {
    fontSize: Typography.fontSize.sm,
    color: Colors.gray900,
    fontWeight: '500',
  },
  depositRow: {
    borderTopWidth: 1,
    borderTopColor: Colors.gray200,
    paddingTop: Spacing.md,
    marginTop: Spacing.sm,
  },
  depositLabel: {
    fontSize: Typography.fontSize.base,
    color: Colors.gray900,
    fontWeight: '600',
  },
  depositValue: {
    fontSize: Typography.fontSize.lg,
    color: Colors.primary,
    fontWeight: '700',
  },
  paymentMethodsCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    ...Shadows.md,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: '600',
    color: Colors.gray900,
    marginBottom: Spacing.xs,
  },
  sectionSubtitle: {
    fontSize: Typography.fontSize.sm,
    color: Colors.gray600,
    marginBottom: Spacing.md,
  },
  paymentMethodCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.gray200,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.sm,
    backgroundColor: Colors.gray50,
  },
  selectedPaymentMethod: {
    borderColor: Colors.primary,
    backgroundColor: Colors.blue50,
  },
  paymentMethodInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardIcon: {
    marginRight: Spacing.sm,
  },
  cardDetails: {
    flex: 1,
  },
  cardBrand: {
    fontSize: Typography.fontSize.base,
    fontWeight: '500',
    color: Colors.gray900,
  },
  cardExpiry: {
    fontSize: Typography.fontSize.sm,
    color: Colors.gray600,
  },
  addPaymentMethodButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: BorderRadius.md,
    borderStyle: 'dashed',
  },
  addPaymentMethodText: {
    fontSize: Typography.fontSize.base,
    color: Colors.primary,
    marginLeft: Spacing.sm,
    fontWeight: '500',
  },
  securityCard: {
    backgroundColor: Colors.blue50,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
  },
  securityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  securityTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: '600',
    color: Colors.gray900,
    marginLeft: Spacing.sm,
  },
  securityText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.gray600,
    lineHeight: 20,
  },
  termsCard: {
    backgroundColor: Colors.yellow50,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
  },
  termsText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.yellow700,
    lineHeight: 20,
  },
  paymentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.lg,
    ...Shadows.sm,
  },
  paymentButtonDisabled: {
    backgroundColor: Colors.gray300,
  },
  paymentButtonText: {
    color: Colors.white,
    fontSize: Typography.fontSize.base,
    fontWeight: '600',
    marginLeft: Spacing.sm,
  },
});

export default PaymentScreen;
