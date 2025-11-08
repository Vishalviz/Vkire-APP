// App Configuration
export const APP_CONFIG = {
  name: 'VK App',
  version: '1.0.0',
  description: 'A marketplace for hiring photographers, videographers, and editors',
};

// API Configuration
export const API_CONFIG = {
  // Replace with your actual Supabase URL and anon key
  supabaseUrl: 'YOUR_SUPABASE_URL',
  supabaseAnonKey: 'YOUR_SUPABASE_ANON_KEY',
};

// Payment Configuration
export const PAYMENT_CONFIG = {
  stripePublishableKey: 'YOUR_STRIPE_PUBLISHABLE_KEY',
  razorpayKeyId: 'YOUR_RAZORPAY_KEY_ID',
  defaultCurrency: 'INR',
  depositPercentage: 30, // 30% deposit
};

// App Colors
export const COLORS = {
  primary: '#007AFF',
  secondary: '#5856D6',
  success: '#34C759',
  warning: '#FF9500',
  error: '#FF3B30',
  background: '#F2F2F7',
  surface: '#FFFFFF',
  text: '#000000',
  textSecondary: '#8E8E93',
  border: '#C6C6C8',
  placeholder: '#C7C7CC',
};

// Export colors as lowercase alias for consistency
export const colors = COLORS;

// App Dimensions
export const DIMENSIONS = {
  borderRadius: 8,
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
  },
};

// Service Types
export const SERVICE_TYPES = {
  photo: 'Photography',
  video: 'Videography',
  edit: 'Editing',
} as const;

// Package Types
export const PACKAGE_TYPES = {
  individual: 'Individual',
  bundle: 'Bundle',
} as const;

// User Roles
export const USER_ROLES = {
  customer: 'Customer',
  pro: 'Professional',
  admin: 'Admin',
} as const;

// Booking Status
export const BOOKING_STATUS = {
  pending: 'Pending',
  accepted: 'Accepted',
  declined: 'Declined',
  expired: 'Expired',
  deposit_paid: 'Deposit Paid',
  confirmed: 'Confirmed',
  completed: 'Completed',
  cancelled: 'Cancelled',
} as const;

// Payment Status
export const PAYMENT_STATUS = {
  pending: 'Pending',
  completed: 'Completed',
  failed: 'Failed',
  refunded: 'Refunded',
} as const;

// Notification Types
export const NOTIFICATION_TYPES = {
  inquiry: 'New Inquiry',
  booking_accepted: 'Booking Accepted',
  booking_declined: 'Booking Declined',
  payment_received: 'Payment Received',
  message: 'New Message',
  review: 'New Review',
} as const;