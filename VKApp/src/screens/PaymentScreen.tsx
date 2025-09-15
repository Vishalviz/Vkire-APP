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
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  contentContainer: {
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  summaryCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
  },
  summaryValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  depositRow: {
    borderTopWidth: 1,
    borderTopColor: '#e1e5e9',
    paddingTop: 12,
    marginTop: 8,
  },
  depositLabel: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },
  depositValue: {
    fontSize: 18,
    color: '#007AFF',
    fontWeight: '700',
  },
  paymentMethodsCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  paymentMethodCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderWidth: 1,
    borderColor: '#e1e5e9',
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: '#f9f9f9',
  },
  selectedPaymentMethod: {
    borderColor: '#007AFF',
    backgroundColor: '#f0f8ff',
  },
  paymentMethodInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardIcon: {
    marginRight: 12,
  },
  cardDetails: {
    flex: 1,
  },
  cardBrand: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  cardExpiry: {
    fontSize: 14,
    color: '#666',
  },
  addPaymentMethodButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderWidth: 1,
    borderColor: '#007AFF',
    borderRadius: 8,
    borderStyle: 'dashed',
  },
  addPaymentMethodText: {
    fontSize: 16,
    color: '#007AFF',
    marginLeft: 8,
    fontWeight: '500',
  },
  securityCard: {
    backgroundColor: '#f0f8ff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  securityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  securityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginLeft: 8,
  },
  securityText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  termsCard: {
    backgroundColor: '#fff3cd',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  termsText: {
    fontSize: 14,
    color: '#856404',
    lineHeight: 20,
  },
  paymentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
  },
  paymentButtonDisabled: {
    backgroundColor: '#ccc',
  },
  paymentButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default PaymentScreen;
