import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Mock Supabase configuration for demo purposes
// Replace with your actual Supabase URL and anon key when ready
const supabaseUrl = 'https://demo.supabase.co';
const supabaseAnonKey = 'demo-key-for-testing';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Database service functions
export class DatabaseService {
  // User operations
  static async createUser(userData: any) {
    const { data, error } = await supabase
      .from('users')
      .insert([userData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async getUser(userId: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) throw error;
    return data;
  }

  static async updateUser(userId: string, updates: any) {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // Professional profile operations
  static async createProProfile(profileData: any) {
    const { data, error } = await supabase
      .from('pro_profiles')
      .insert([profileData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async getProProfile(userId: string) {
    const { data, error } = await supabase
      .from('pro_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (error) throw error;
    return data;
  }

  // Package operations
  static async createPackage(packageData: any) {
    const { data, error } = await supabase
      .from('packages')
      .insert([packageData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async getPackagesByPro(proId: string) {
    const { data, error } = await supabase
      .from('packages')
      .select('*')
      .eq('pro_id', proId)
      .eq('is_active', true)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }

  // Portfolio operations
  static async createPortfolioPost(postData: any) {
    const { data, error } = await supabase
      .from('portfolio_posts')
      .insert([postData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async getPortfolioPosts(proId?: string, limit = 20) {
    let query = supabase
      .from('portfolio_posts')
      .select(`
        *,
        post_reactions!inner(count)
      `)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (proId) {
      query = query.eq('pro_id', proId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  }

  // Search operations
  static async searchProfessionals(filters: {
    location?: string;
    services?: string[];
    priceRange?: { min: number; max: number };
    tags?: string[];
  }) {
    let query = supabase
      .from('users')
      .select(`
        *,
        pro_profiles!inner(*),
        packages(*)
      `)
      .eq('role', 'pro');

    if (filters.location) {
      query = query.ilike('city', `%${filters.location}%`);
    }

    if (filters.services && filters.services.length > 0) {
      query = query.contains('pro_profiles.services', filters.services);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  }

  // Get all creators/professionals
  static async getCreators() {
    const { data, error } = await supabase
      .from('users')
      .select(`
        *,
        pro_profiles!inner(*),
        packages(*)
      `)
      .eq('role', 'pro')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  // Search creators by query
  static async searchCreators(query: string) {
    const { data, error } = await supabase
      .from('users')
      .select(`
        *,
        pro_profiles!inner(*),
        packages(*)
      `)
      .eq('role', 'pro')
      .eq('is_active', true)
      .or(`name.ilike.%${query}%,city.ilike.%${query}%,pro_profiles.services.cs.{${query}}`)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  // Inquiry operations
  static async createInquiry(inquiryData: any) {
    const { data, error } = await supabase
      .from('inquiries')
      .insert([inquiryData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async getInquiriesByPro(proId: string) {
    const { data, error } = await supabase
      .from('inquiries')
      .select(`
        *,
        customers:users!inquiries_customer_id_fkey(*),
        packages(*)
      `)
      .eq('pro_id', proId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }

  // Chat operations
  static async createChat(chatData: any) {
    const { data, error } = await supabase
      .from('chats')
      .insert([chatData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async getMessages(chatId: string) {
    const { data, error } = await supabase
      .from('messages')
      .select(`
        *,
        sender:users!messages_sender_id_fkey(*)
      `)
      .eq('chat_id', chatId)
      .order('created_at', { ascending: true });
    
    if (error) throw error;
    return data;
  }

  static async sendMessage(messageData: any) {
    const { data, error } = await supabase
      .from('messages')
      .insert([messageData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // Job/Booking operations
  static async updateJobStatus(jobId: string, status: string) {
    const { data, error } = await supabase
      .from('inquiries')
      .update({ status })
      .eq('id', jobId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async getJobsByPro(proId: string) {
    const { data, error } = await supabase
      .from('inquiries')
      .select(`
        *,
        customer:users!inquiries_customer_id_fkey(*),
        package:packages(*)
      `)
      .eq('pro_id', proId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }

  // Review operations
  static async createReview(reviewData: any) {
    const { data, error } = await supabase
      .from('reviews')
      .insert([reviewData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async getReviewsByPro(proId: string) {
    const { data, error } = await supabase
      .from('reviews')
      .select(`
        *,
        reviewer:users!reviews_reviewer_id_fkey(*)
      `)
      .eq('reviewee_id', proId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }

  // Package operations (additional)
  static async deletePackage(packageId: string) {
    const { data, error } = await supabase
      .from('packages')
      .update({ is_active: false })
      .eq('id', packageId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
}