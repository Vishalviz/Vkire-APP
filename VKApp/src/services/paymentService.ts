import { StripeProvider, useStripe } from '@stripe/stripe-react-native';
import { DatabaseService } from './supabase';

export interface PaymentIntent {
  id: string;
  client_secret: string;
  amount: number;
  currency: string;
}

export interface PaymentResult {
  success: boolean;
  paymentIntentId?: string;
  error?: string;
}

export class PaymentService {
  // Initialize Stripe (call this in your app initialization)
  static async initializeStripe() {
    // In a real app, you would initialize Stripe with your publishable key
    // Stripe.setPublishableKey('pk_test_...');
    console.log('Stripe initialized');
  }

  // Create payment intent for deposit
  static async createDepositPaymentIntent(
    bookingId: string,
    amount: number,
    currency: string = 'INR'
  ): Promise<PaymentIntent> {
    try {
      // In a real app, you would call your backend API to create a payment intent
      // const response = await fetch('/api/create-payment-intent', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ bookingId, amount, currency }),
      // });
      // const data = await response.json();

      // Mock response for demo
      const mockPaymentIntent: PaymentIntent = {
        id: `pi_${Date.now()}`,
        client_secret: `pi_${Date.now()}_secret_${Math.random().toString(36).substr(2, 9)}`,
        amount: amount * 100, // Convert to cents
        currency: currency.toLowerCase(),
      };

      return mockPaymentIntent;
    } catch (error) {
      console.error('Error creating payment intent:', error);
      throw new Error('Failed to create payment intent');
    }
  }

  // Process payment using Stripe
  static async processPayment(
    clientSecret: string,
    paymentMethodId?: string
  ): Promise<PaymentResult> {
    try {
      // In a real app, you would use the Stripe SDK to confirm the payment
      // const { error, paymentIntent } = await confirmPayment(clientSecret, {
      //   paymentMethodId,
      // });

      // Mock successful payment for demo
      const mockResult: PaymentResult = {
        success: true,
        paymentIntentId: `pi_${Date.now()}`,
      };

      return mockResult;
    } catch (error) {
      console.error('Error processing payment:', error);
      return {
        success: false,
        error: 'Payment failed. Please try again.',
      };
    }
  }

  // Save payment record to database
  static async savePaymentRecord(
    bookingId: string,
    paymentIntentId: string,
    amount: number,
    type: 'deposit' | 'balance' | 'refund' | 'payout' = 'deposit'
  ) {
    try {
      const paymentData = {
        booking_id: bookingId,
        type,
        amount,
        processor_ref: paymentIntentId,
        status: 'completed',
      };

      // In a real app, you would save this to your database
      // await DatabaseService.createPayment(paymentData);
      
      console.log('Payment record saved:', paymentData);
      return paymentData;
    } catch (error) {
      console.error('Error saving payment record:', error);
      throw new Error('Failed to save payment record');
    }
  }

  // Process refund
  static async processRefund(
    paymentIntentId: string,
    amount?: number
  ): Promise<PaymentResult> {
    try {
      // In a real app, you would call Stripe's refund API
      // const refund = await stripe.refunds.create({
      //   payment_intent: paymentIntentId,
      //   amount: amount,
      // });

      // Mock successful refund for demo
      const mockResult: PaymentResult = {
        success: true,
        paymentIntentId: `re_${Date.now()}`,
      };

      return mockResult;
    } catch (error) {
      console.error('Error processing refund:', error);
      return {
        success: false,
        error: 'Refund failed. Please contact support.',
      };
    }
  }

  // Get payment methods for user
  static async getPaymentMethods(userId: string) {
    try {
      // In a real app, you would fetch saved payment methods from Stripe
      // const paymentMethods = await stripe.paymentMethods.list({
      //   customer: userId,
      //   type: 'card',
      // });

      // Mock payment methods for demo
      const mockPaymentMethods = [
        {
          id: 'pm_1',
          type: 'card',
          card: {
            brand: 'visa',
            last4: '4242',
            exp_month: 12,
            exp_year: 2025,
          },
        },
        {
          id: 'pm_2',
          type: 'card',
          card: {
            brand: 'mastercard',
            last4: '5555',
            exp_month: 8,
            exp_year: 2026,
          },
        },
      ];

      return mockPaymentMethods;
    } catch (error) {
      console.error('Error fetching payment methods:', error);
      return [];
    }
  }

  // Calculate deposit amount (30% of total)
  static calculateDepositAmount(totalAmount: number): number {
    return Math.round(totalAmount * 0.3);
  }

  // Calculate balance amount
  static calculateBalanceAmount(totalAmount: number, depositAmount: number): number {
    return totalAmount - depositAmount;
  }

  // Format amount for display
  static formatAmount(amount: number, currency: string = 'INR'): string {
    const formatter = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency,
    });
    return formatter.format(amount);
  }
}
