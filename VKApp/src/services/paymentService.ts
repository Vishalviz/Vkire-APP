import { Alert } from 'react-native';

export interface PaymentProduct {
  productId: string;
  price: string;
  title: string;
  description: string;
}

export interface PaymentResult {
  success: boolean;
  transactionId?: string;
  error?: string;
}

export class PaymentService {
  private static isInitialized = false;

  // Initialize the payment service (mock implementation)
  static async initialize(): Promise<boolean> {
    try {
      if (!this.isInitialized) {
        // Mock initialization - in a real app, this would connect to payment provider
        console.log('Payment service initialized (mock)');
        this.isInitialized = true;
      }
      return true;
    } catch (error) {
      console.error('Error initializing payment service:', error);
      return false;
    }
  }

  // Get available products (mock implementation)
  static async getProducts(productIds: string[]): Promise<PaymentProduct[]> {
    try {
      await this.initialize();
      
      // Mock products - in a real app, these would come from the payment provider
      const mockProducts: PaymentProduct[] = [
        {
          productId: 'inquiry_chat_unlock',
          price: '₹499',
          title: 'Chat Access',
          description: 'Unlock chat with this professional',
        },
        {
          productId: 'booking_payment',
          price: '₹299',
          title: 'Booking Payment',
          description: 'Complete your booking payment',
        },
      ];
      
      return mockProducts.filter(product => productIds.includes(product.productId));
    } catch (error) {
      console.error('Error getting products:', error);
      return [];
    }
  }

  // Purchase a product (mock implementation)
  static async purchaseProduct(productId: string): Promise<PaymentResult> {
    try {
      await this.initialize();
      
      // Mock purchase - simulate a delay and random success/failure
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // 90% success rate for demo purposes
      const success = Math.random() > 0.1;
      
      if (success) {
        return {
          success: true,
          transactionId: `mock_txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        };
      } else {
        return {
          success: false,
          error: 'Payment failed - please try again',
        };
      }
    } catch (error) {
      console.error('Error purchasing product:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // Restore purchases (mock implementation)
  static async restorePurchases(): Promise<PaymentResult> {
    try {
      await this.initialize();
      
      // Mock restore - in a real app, this would check with the payment provider
      console.log('Mock: Restoring purchases');
      
      return {
        success: true,
      };
    } catch (error) {
      console.error('Error restoring purchases:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // Check if user has purchased a specific product (mock implementation)
  static async hasPurchased(productId: string): Promise<boolean> {
    try {
      await this.initialize();
      
      // Mock check - in a real app, this would check with the payment provider
      // For demo purposes, we'll simulate some purchases
      const mockPurchases = ['inquiry_chat_unlock'];
      return mockPurchases.includes(productId);
    } catch (error) {
      console.error('Error checking purchase status:', error);
      return false;
    }
  }

  // Show payment modal for inquiry
  static async showInquiryPaymentModal(
    onSuccess: (transactionId: string) => void,
    onCancel: () => void
  ): Promise<void> {
    Alert.alert(
      'Unlock Chat Access',
      'Pay ₹499 to unlock chat with this professional and send unlimited messages.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
          onPress: onCancel,
        },
        {
          text: 'Pay ₹499',
          onPress: async () => {
            const result = await this.purchaseProduct('inquiry_chat_unlock');
            
            if (result.success && result.transactionId) {
              Alert.alert(
                'Payment Successful!',
                'You can now chat with this professional.',
                [{ text: 'OK', onPress: () => onSuccess(result.transactionId!) }]
              );
            } else {
              Alert.alert(
                'Payment Failed',
                result.error || 'Please try again.',
                [{ text: 'OK' }]
              );
            }
          },
        },
      ]
    );
  }

  // Show payment modal for booking
  static async showBookingPaymentModal(
    amount: number,
    onSuccess: (transactionId: string) => void,
    onCancel: () => void
  ): Promise<void> {
    Alert.alert(
      'Complete Booking',
      `Pay ₹${amount.toLocaleString()} to confirm your booking.`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
          onPress: onCancel,
        },
        {
          text: `Pay ₹${amount.toLocaleString()}`,
          onPress: async () => {
            const result = await this.purchaseProduct('booking_payment');
            
            if (result.success && result.transactionId) {
              Alert.alert(
                'Payment Successful!',
                'Your booking has been confirmed.',
                [{ text: 'OK', onPress: () => onSuccess(result.transactionId!) }]
              );
            } else {
              Alert.alert(
                'Payment Failed',
                result.error || 'Please try again.',
                [{ text: 'OK' }]
              );
            }
          },
        },
      ]
    );
  }

  // Cleanup (mock implementation)
  static async disconnect(): Promise<void> {
    try {
      if (this.isInitialized) {
        // Mock disconnect - in a real app, this would disconnect from payment provider
        console.log('Payment service disconnected (mock)');
        this.isInitialized = false;
      }
    } catch (error) {
      console.error('Error disconnecting payment service:', error);
    }
  }
}

export default PaymentService;