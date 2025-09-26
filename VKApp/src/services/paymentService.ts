// Payment service for handling Stripe payments
// Note: Stripe integration would be implemented here in a real app

export interface PaymentIntent {
  id: string;
  client_secret: string;
  amount: number;
  currency: string;
  status: string;
  created: number;
}

export interface PaymentMethod {
  id: string;
  type: string;
  card?: {
    brand: string;
    last4: string;
    exp_month: number;
    exp_year: number;
  };
}

// Mock payment service - replace with actual Stripe implementation
export const PaymentService = {
  // Create payment intent
  async createPaymentIntent(amount: number, currency: string = 'inr'): Promise<PaymentIntent> {
    // Mock implementation
    return {
      id: 'pi_mock_' + Date.now(),
      client_secret: 'pi_mock_' + Date.now() + '_secret_mock',
      amount: amount * 100, // Convert to paise
      currency,
      status: 'requires_payment_method',
      created: Date.now(),
    };
  },

  // Confirm payment
  async confirmPayment(
    _paymentIntentId: string,
    _paymentMethodId: string
  ): Promise<{ success: boolean; error?: string }> {
    // Mock implementation - simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simulate success/failure
    const success = Math.random() > 0.1; // 90% success rate
    
    if (success) {
      return { success: true };
    } else {
      return { success: false, error: 'Payment failed. Please try again.' };
    }
  },

  // Get payment history
  async getPaymentHistory(_userId: string): Promise<PaymentIntent[]> {
    // Mock implementation
    return [
      {
        id: 'pi_1',
        client_secret: 'pi_1_secret',
        amount: 250000, // ₹2500
        currency: 'inr',
        status: 'succeeded',
        created: Date.now() - 86400000, // 1 day ago
      },
      {
        id: 'pi_2',
        client_secret: 'pi_2_secret',
        amount: 150000, // ₹1500
        currency: 'inr',
        status: 'succeeded',
        created: Date.now() - 172800000, // 2 days ago
      },
    ];
  },

  // Save payment method
  async savePaymentMethod(
    _userId: string,
    _paymentMethodId: string
  ): Promise<{ success: boolean; error?: string }> {
    // Mock implementation
    return { success: true };
  },

  // Get saved payment methods
  async getSavedPaymentMethods(_userId: string): Promise<PaymentMethod[]> {
    // Mock implementation
    return [
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
    ];
  },

  // Delete payment method
  async deletePaymentMethod(_paymentMethodId: string): Promise<{ success: boolean; error?: string }> {
    // Mock implementation
    return { success: true };
  },

  // Refund payment
  async refundPayment(
    _paymentIntentId: string,
    _amount: number
  ): Promise<{ success: boolean; error?: string }> {
    // Mock implementation
    return { success: true };
  },
};