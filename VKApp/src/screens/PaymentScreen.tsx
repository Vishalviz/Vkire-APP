import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import { Typography, Spacing, BorderRadius, Shadows } from '../constants/designSystem';
import PaymentService from '../services/paymentService';
import { useTheme } from '../contexts/AppThemeContext';

type PaymentScreenRouteProp = RouteProp<RootStackParamList, 'Payment'>;
type PaymentScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Payment'>;

interface PaymentScreenProps {}

const PaymentScreen: React.FC<PaymentScreenProps> = () => {
  const navigation = useNavigation<PaymentScreenNavigationProp>();
  const route = useRoute<PaymentScreenRouteProp>();
  const { amount = 0, bookingDetails, packageDetails } = route.params || {};

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'card' | 'upi' | 'wallet'>('card');
  const [loading, setLoading] = useState(false);

  const paymentMethods = [
    {
      id: 'card' as const,
      title: 'Credit/Debit Card',
      icon: 'card-outline',
      description: 'Pay with your card',
    },
    {
      id: 'upi' as const,
      title: 'UPI',
      icon: 'phone-portrait-outline',
      description: 'Pay with UPI',
    },
    {
      id: 'wallet' as const,
      title: 'Digital Wallet',
      icon: 'wallet-outline',
      description: 'Pay with wallet',
    },
  ];

  const handlePayment = async () => {
    setLoading(true);
    
    try {
      const result = await PaymentService.purchaseProduct('booking_payment');
      
      if (result.success && result.transactionId) {
        Alert.alert(
          'Payment Successful!',
          'Your booking has been confirmed. You will receive a confirmation email shortly.',
          [
            {
              text: 'OK',
              onPress: () => {
                // Navigate back to main screen or booking confirmation
                navigation.navigate('Main' as any, { screen: 'MyBookings' });
              },
            },
          ]
        );
      } else {
        Alert.alert(
          'Payment Failed',
          result.error || 'Please try again.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      Alert.alert(
        'Error',
        'Something went wrong. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
    }
  };

  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.white, borderBottomColor: colors.gray200 }]}>
        <TouchableOpacity
          style={[styles.backButton, { backgroundColor: colors.gray50 }]}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.primary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.gray900 }]}>Payment</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Booking Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Booking Summary</Text>
          <View style={[styles.summaryCard, { backgroundColor: colors.white, borderColor: colors.gray100 }]}>
            {packageDetails?.title && (
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Package</Text>
                <Text style={styles.summaryValue}>{packageDetails.title}</Text>
              </View>
            )}
            {bookingDetails?.date && (
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Date</Text>
                <Text style={styles.summaryValue}>
                  {new Date(bookingDetails.date).toLocaleDateString()}
                </Text>
              </View>
            )}
            {bookingDetails?.time && (
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Time</Text>
                <Text style={styles.summaryValue}>{bookingDetails.time}</Text>
              </View>
            )}
            {bookingDetails?.location && (
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Location</Text>
                <Text style={styles.summaryValue}>{bookingDetails.location}</Text>
              </View>
            )}
            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total Amount</Text>
              <Text style={styles.totalValue}>₹{amount.toLocaleString()}</Text>
            </View>
          </View>
        </View>

        {/* Payment Methods */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          <View style={styles.paymentMethods}>
            {paymentMethods.map((method) => (
              <TouchableOpacity
                key={method.id}
                style={[
                  styles.paymentMethod,
                  selectedPaymentMethod === method.id && styles.selectedPaymentMethod,
                ]}
                onPress={() => setSelectedPaymentMethod(method.id)}
              >
                <View style={styles.paymentMethodContent}>
                  <View style={[styles.paymentMethodIcon, { backgroundColor: colors.gray50 }]}>
                    <Ionicons
                      name={method.icon as any}
                      size={24}
                      color={selectedPaymentMethod === method.id ? colors.primary : colors.gray600}
                    />
                  </View>
                  <View style={styles.paymentMethodInfo}>
                    <Text
                      style={[
                        styles.paymentMethodTitle,
                        selectedPaymentMethod === method.id && styles.selectedPaymentMethodText,
                      ]}
                    >
                      {method.title}
                    </Text>
                    <Text style={styles.paymentMethodDescription}>
                      {method.description}
                    </Text>
                  </View>
                </View>
                <View
                  style={[
                    styles.radioButton,
                    selectedPaymentMethod === method.id && styles.selectedRadioButton,
                  ]}
                >
                  {selectedPaymentMethod === method.id && (
                    <View style={styles.radioButtonInner} />
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Terms and Conditions */}
        <View style={styles.section}>
          <Text style={styles.termsText}>
            By proceeding with the payment, you agree to our Terms of Service and Privacy Policy.
            A 30% deposit is required to confirm your booking.
          </Text>
        </View>
      </ScrollView>

      {/* Payment Button */}
      <View style={[styles.paymentFooter, { backgroundColor: colors.white, borderTopColor: colors.gray200 }]}>
        <TouchableOpacity
          style={[styles.payButton, loading && styles.payButtonDisabled]}
          onPress={handlePayment}
          disabled={loading}
        >
          <Text style={styles.payButtonText}>
            {loading ? 'Processing...' : `Pay ₹${amount.toLocaleString()}`}
          </Text>
          <Ionicons name="card" size={20} color={colors.white} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.xl, paddingTop: 50, paddingBottom: Spacing.lg,
  },
  backButton: {
    padding: Spacing.sm, borderRadius: BorderRadius.lg,
  },
  headerTitle: {
    fontSize: Typography.fontSize['2xl'], fontWeight: Typography.fontWeight.bold, letterSpacing: 0.3,
  },
  placeholder: { width: 40 },
  content: { flex: 1, paddingHorizontal: Spacing.xl },
  section: { marginTop: Spacing.xl },
  sectionTitle: { fontSize: Typography.fontSize.lg, fontWeight: Typography.fontWeight.semiBold, marginBottom: Spacing.md, },
  summaryCard: {
    borderRadius: BorderRadius['2xl'], padding: Spacing.lg, ...Shadows.lg, borderWidth: 0.5,
  },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: Spacing.sm },
  totalRow: { borderTopWidth: 1, marginTop: Spacing.sm, paddingTop: Spacing.md },
  summaryLabel: { fontSize: Typography.fontSize.base },
  summaryValue: { fontSize: Typography.fontSize.base, fontWeight: Typography.fontWeight.medium },
  totalLabel: { fontSize: Typography.fontSize.lg, fontWeight: Typography.fontWeight.semiBold },
  totalValue: { fontSize: Typography.fontSize.lg, fontWeight: Typography.fontWeight.bold },
  paymentMethods: { gap: Spacing.md },
  paymentMethod: { borderRadius: BorderRadius['2xl'], padding: Spacing.lg, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', ...Shadows.lg, borderWidth: 0.5 },
  selectedPaymentMethod: { borderWidth: 2 },
  paymentMethodContent: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  paymentMethodIcon: { width: 48, height: 48, borderRadius: BorderRadius.lg, justifyContent: 'center', alignItems: 'center', marginRight: Spacing.md },
  paymentMethodInfo: { flex: 1 },
  paymentMethodTitle: { fontSize: Typography.fontSize.base, fontWeight: Typography.fontWeight.semiBold, marginBottom: 2 },
  selectedPaymentMethodText: {},
  paymentMethodDescription: { fontSize: Typography.fontSize.sm },
  radioButton: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, justifyContent: 'center', alignItems: 'center' },
  selectedRadioButton: {},
  radioButtonInner: { width: 10, height: 10, borderRadius: 5 },
  termsText: { fontSize: Typography.fontSize.sm, lineHeight: Typography.lineHeight.relaxed * Typography.fontSize.sm, textAlign: 'center', },
  paymentFooter: { padding: Spacing.xl, borderTopWidth: 0.5, ...Shadows.lg, },
  payButton: { borderRadius: BorderRadius.xl, padding: Spacing.lg, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', ...Shadows.lg },
  payButtonDisabled: {},
  payButtonText: { fontSize: Typography.fontSize.lg, fontWeight: Typography.fontWeight.semiBold, marginRight: Spacing.sm },
});

export default PaymentScreen;