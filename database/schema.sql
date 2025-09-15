-- VK App Database Schema
-- Run this in your Supabase SQL editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    role VARCHAR(20) NOT NULL CHECK (role IN ('customer', 'pro', 'admin')),
    name VARCHAR(255) NOT NULL,
    handle VARCHAR(50) UNIQUE,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    city VARCHAR(100),
    bio TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Professional profiles table
CREATE TABLE pro_profiles (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    primary_gear TEXT,
    services TEXT[] NOT NULL DEFAULT '{}',
    travel_radius_km INTEGER DEFAULT 0,
    rating_avg DECIMAL(3,2) DEFAULT 0,
    review_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Packages table
CREATE TABLE packages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pro_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(20) NOT NULL CHECK (type IN ('individual', 'bundle')),
    services_included TEXT[] NOT NULL DEFAULT '{}',
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    base_price DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'INR',
    duration_hours INTEGER,
    deliverables TEXT[] DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Portfolio posts table
CREATE TABLE portfolio_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pro_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    media_url TEXT NOT NULL,
    media_type VARCHAR(10) NOT NULL CHECK (media_type IN ('image', 'video')),
    caption TEXT,
    tags TEXT[] DEFAULT '{}',
    likes_count INTEGER DEFAULT 0,
    comments_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Post reactions table (likes and comments)
CREATE TABLE post_reactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id UUID NOT NULL REFERENCES portfolio_posts(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(10) NOT NULL CHECK (type IN ('like', 'comment')),
    comment_text TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(post_id, user_id, type) -- Prevent duplicate likes
);

-- Inquiries table
CREATE TABLE inquiries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    pro_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    package_id UUID NOT NULL REFERENCES packages(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    location TEXT NOT NULL,
    notes TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined', 'expired')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bookings table
CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    inquiry_id UUID NOT NULL REFERENCES inquiries(id) ON DELETE CASCADE,
    deposit_amount DECIMAL(10,2) NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'deposit_paid' CHECK (status IN ('deposit_paid', 'confirmed', 'completed', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payments table
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    type VARCHAR(20) NOT NULL CHECK (type IN ('deposit', 'balance', 'refund', 'payout')),
    amount DECIMAL(10,2) NOT NULL,
    processor_ref TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Chats table
CREATE TABLE chats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Messages table
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    chat_id UUID NOT NULL REFERENCES chats(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    text TEXT,
    media_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reviews table
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    reviewer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    reviewee_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(booking_id, reviewer_id) -- One review per booking per user
);

-- Reports table
CREATE TABLE reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reporter_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    target_type VARCHAR(20) NOT NULL CHECK (target_type IN ('user', 'post', 'booking')),
    target_id UUID NOT NULL,
    reason TEXT NOT NULL,
    resolution TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_handle ON users(handle);
CREATE INDEX idx_packages_pro_id ON packages(pro_id);
CREATE INDEX idx_packages_active ON packages(is_active);
CREATE INDEX idx_portfolio_posts_pro_id ON portfolio_posts(pro_id);
CREATE INDEX idx_portfolio_posts_created_at ON portfolio_posts(created_at DESC);
CREATE INDEX idx_inquiries_pro_id ON inquiries(pro_id);
CREATE INDEX idx_inquiries_customer_id ON inquiries(customer_id);
CREATE INDEX idx_inquiries_status ON inquiries(status);
CREATE INDEX idx_messages_chat_id ON messages(chat_id);
CREATE INDEX idx_messages_created_at ON messages(created_at);
CREATE INDEX idx_reviews_reviewee_id ON reviews(reviewee_id);

-- Row Level Security (RLS) policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE pro_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- Basic RLS policies (users can read all public data, modify their own)
CREATE POLICY "Users can view all profiles" ON users FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Anyone can view pro profiles" ON pro_profiles FOR SELECT USING (true);
CREATE POLICY "Pros can update own profile" ON pro_profiles FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view active packages" ON packages FOR SELECT USING (is_active = true);
CREATE POLICY "Pros can manage own packages" ON packages FOR ALL USING (auth.uid() = pro_id);

CREATE POLICY "Anyone can view portfolio posts" ON portfolio_posts FOR SELECT USING (true);
CREATE POLICY "Pros can manage own posts" ON portfolio_posts FOR ALL USING (auth.uid() = pro_id);

CREATE POLICY "Users can view post reactions" ON post_reactions FOR SELECT USING (true);
CREATE POLICY "Users can manage own reactions" ON post_reactions FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own inquiries" ON inquiries FOR SELECT USING (auth.uid() = customer_id OR auth.uid() = pro_id);
CREATE POLICY "Customers can create inquiries" ON inquiries FOR INSERT WITH CHECK (auth.uid() = customer_id);
CREATE POLICY "Pros can update own inquiries" ON inquiries FOR UPDATE USING (auth.uid() = pro_id);

CREATE POLICY "Users can view own bookings" ON bookings FOR SELECT USING (
    EXISTS (SELECT 1 FROM inquiries WHERE inquiries.id = bookings.inquiry_id AND (inquiries.customer_id = auth.uid() OR inquiries.pro_id = auth.uid()))
);

CREATE POLICY "Users can view own payments" ON payments FOR SELECT USING (
    EXISTS (SELECT 1 FROM bookings 
            JOIN inquiries ON inquiries.id = bookings.inquiry_id 
            WHERE bookings.id = payments.booking_id AND (inquiries.customer_id = auth.uid() OR inquiries.pro_id = auth.uid()))
);

CREATE POLICY "Users can view own chats" ON chats FOR SELECT USING (
    EXISTS (SELECT 1 FROM bookings 
            JOIN inquiries ON inquiries.id = bookings.inquiry_id 
            WHERE bookings.id = chats.booking_id AND (inquiries.customer_id = auth.uid() OR inquiries.pro_id = auth.uid()))
);

CREATE POLICY "Users can view own messages" ON messages FOR SELECT USING (
    EXISTS (SELECT 1 FROM chats 
            JOIN bookings ON bookings.id = chats.booking_id 
            JOIN inquiries ON inquiries.id = bookings.inquiry_id 
            WHERE chats.id = messages.chat_id AND (inquiries.customer_id = auth.uid() OR inquiries.pro_id = auth.uid()))
);

CREATE POLICY "Users can send messages in own chats" ON messages FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM chats 
            JOIN bookings ON bookings.id = chats.booking_id 
            JOIN inquiries ON inquiries.id = bookings.inquiry_id 
            WHERE chats.id = messages.chat_id AND (inquiries.customer_id = auth.uid() OR inquiries.pro_id = auth.uid()))
    AND auth.uid() = sender_id
);

CREATE POLICY "Anyone can view reviews" ON reviews FOR SELECT USING (true);
CREATE POLICY "Users can create reviews for own bookings" ON reviews FOR INSERT WITH CHECK (
    auth.uid() = reviewer_id AND
    EXISTS (SELECT 1 FROM bookings 
            JOIN inquiries ON inquiries.id = bookings.inquiry_id 
            WHERE bookings.id = reviews.booking_id AND inquiries.customer_id = auth.uid())
);

-- Functions for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updating timestamps
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_pro_profiles_updated_at BEFORE UPDATE ON pro_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_packages_updated_at BEFORE UPDATE ON packages FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_inquiries_updated_at BEFORE UPDATE ON inquiries FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_reports_updated_at BEFORE UPDATE ON reports FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to update post reaction counts
CREATE OR REPLACE FUNCTION update_post_reaction_counts()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        IF NEW.type = 'like' THEN
            UPDATE portfolio_posts SET likes_count = likes_count + 1 WHERE id = NEW.post_id;
        ELSIF NEW.type = 'comment' THEN
            UPDATE portfolio_posts SET comments_count = comments_count + 1 WHERE id = NEW.post_id;
        END IF;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        IF OLD.type = 'like' THEN
            UPDATE portfolio_posts SET likes_count = likes_count - 1 WHERE id = OLD.post_id;
        ELSIF OLD.type = 'comment' THEN
            UPDATE portfolio_posts SET comments_count = comments_count - 1 WHERE id = OLD.post_id;
        END IF;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ language 'plpgsql';

-- Trigger for updating post reaction counts
CREATE TRIGGER update_post_reaction_counts_trigger
    AFTER INSERT OR DELETE ON post_reactions
    FOR EACH ROW EXECUTE FUNCTION update_post_reaction_counts();

-- Function to update pro profile rating
CREATE OR REPLACE FUNCTION update_pro_rating()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE pro_profiles 
    SET 
        rating_avg = (SELECT AVG(rating) FROM reviews WHERE reviewee_id = NEW.reviewee_id),
        review_count = (SELECT COUNT(*) FROM reviews WHERE reviewee_id = NEW.reviewee_id)
    WHERE user_id = NEW.reviewee_id;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for updating pro rating
CREATE TRIGGER update_pro_rating_trigger
    AFTER INSERT OR UPDATE OR DELETE ON reviews
    FOR EACH ROW EXECUTE FUNCTION update_pro_rating();
