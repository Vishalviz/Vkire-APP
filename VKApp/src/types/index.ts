// User Types
export type UserRole = 'customer' | 'pro' | 'admin';

export interface User {
  id: string;
  role: UserRole;
  name: string;
  handle?: string;
  email: string;
  phone?: string;
  city?: string;
  location?: string;
  bio?: string;
  avatar_url?: string;
  website?: string;
  instagram?: string;
  created_at: string;
  profileCompleted?: boolean;
}

// Professional Profile Types
export interface ProProfile {
  user_id: string;
  business_name?: string;
  bio?: string;
  main_camera?: string;
  secondary_camera?: string;
  equipment?: string;
  experience_years?: number;
  photography_style?: string[];
  video_style?: string[];
  editing_software?: string[];
  service_areas?: string[];
  primary_gear?: string;
  services: ServiceType[];
  travel_radius_km?: number;
  rating_avg?: number;
  review_count?: number;
}

export type ServiceType = 'photo' | 'video' | 'edit';

// Package Types
export interface Package {
  id: string;
  pro_id: string;
  type: 'individual' | 'bundle';
  services_included: ServiceType[];
  title: string;
  description: string;
  base_price: number;
  currency: string;
  duration_hours?: number;
  deliverables: string[];
  is_active: boolean;
  created_at: string;
}

// Portfolio Types
export interface PortfolioPost {
  id: string;
  pro_id: string;
  media_url: string;
  media_type: 'image' | 'video';
  caption?: string;
  tags: string[];
  created_at: string;
  likes_count?: number;
  comments_count?: number;
}

export interface PostReaction {
  post_id: string;
  user_id: string;
  type: 'like' | 'comment';
  comment_text?: string;
  created_at: string;
}

// Booking Types
export interface Inquiry {
  id: string;
  customer_id: string;
  pro_id: string;
  package_id: string;
  date: string;
  location: string;
  notes?: string;
  status: 'pending' | 'accepted' | 'declined' | 'expired';
  created_at: string;
}

export interface Booking {
  id: string;
  inquiry_id: string;
  deposit_amount: number;
  total_amount: number;
  status: 'deposit_paid' | 'confirmed' | 'completed' | 'cancelled';
  created_at: string;
}

// Payment Types
export interface Payment {
  id: string;
  booking_id: string;
  type: 'deposit' | 'balance' | 'refund' | 'payout';
  amount: number;
  processor_ref?: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  created_at: string;
}

// Chat Types
export interface Chat {
  id: string;
  booking_id: string;
  created_at: string;
}

export interface Message {
  id: string;
  chat_id: string;
  sender_id: string;
  text?: string;
  media_url?: string;
  created_at: string;
}

// Review Types
export interface Review {
  id: string;
  booking_id: string;
  reviewer_id: string;
  reviewee_id: string;
  rating: number;
  comment?: string;
  created_at: string;
}

// Report Types
export interface Report {
  id: string;
  reporter_id: string;
  target_type: 'user' | 'post' | 'booking';
  target_id: string;
  reason: string;
  created_at: string;
  resolution?: string;
}

// Navigation Types
export type RootStackParamList = {
  Splash: undefined;
  Auth: undefined;
  Main: undefined;
  Inbox: undefined;
  Profile: { userId: string };
  CreatorProfile: { proId: string };
  PackageDetails: { packageId: string };
  Chat: { 
    bookingId?: string; 
    professionalId?: string; 
    professionalName?: string; 
    packageId?: string; 
    transactionId?: string; 
  };
  BookingDetails: { bookingId: string; booking?: any };
  Inquiry: { packageId: string };
  Review: { bookingId: string };
  Payment: { 
    amount: number; 
    bookingDetails: {
      date: Date;
      time: string;
      location: string;
    };
    packageDetails: any;
  };
  Booking: {
    packageDetails: any;
    proDetails: any;
  };
  PostDetail: { post: any };
  EditProfile: undefined;
  PaymentMethods: undefined;
  NotificationSettings: undefined;
  HelpSupport: undefined;
  Settings: undefined;
  ProfessionalOnboarding: { role: 'photographer' | 'videographer' | 'editor' };
};

// Shared tabs for all users
export type SharedTabParamList = {
  Feed: undefined;
  Search: undefined;
};

// Customer-specific tabs
export type CustomerTabParamList = {
  Feed: undefined;
  Search: undefined;
  MyBookings: undefined;
  Profile: undefined;
};

// Professional-specific tabs
export type ProfessionalTabParamList = {
  Feed: undefined;
  Search: undefined;
  Dashboard: undefined;
  MyJobs: undefined;
  PortfolioManager: undefined;
  Profile: undefined;
};

// Legacy type for backward compatibility
export type MainTabParamList = CustomerTabParamList;

// Auth Types
export interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string, name?: string, role?: UserRole) => Promise<void>;
  signUp: (email: string, password: string, role: UserRole, name?: string, businessName?: string, city?: string, phone?: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  markProfileCompleted: () => Promise<void>;
  createProfessionalProfile?: (profile: Partial<ProProfile>) => Promise<void>;
}