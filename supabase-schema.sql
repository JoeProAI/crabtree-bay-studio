-- Supabase Database Schema for Crabtree Bay Studio
-- Run this in the Supabase SQL Editor to set up the database

-- Enable Row Level Security
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Products table
CREATE TABLE IF NOT EXISTS public.products (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    image_url TEXT,
    category VARCHAR(100),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'draft')),
    featured BOOLEAN DEFAULT false,
    inventory_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Create policies for products table
-- Allow public read access to active products
CREATE POLICY "Public can view active products" ON public.products
    FOR SELECT USING (status = 'active');

-- Allow full access for authenticated users (for admin functions)
CREATE POLICY "Authenticated users can manage products" ON public.products
    FOR ALL USING (auth.role() = 'authenticated');

-- Insert some initial sample products
INSERT INTO public.products (name, description, price, image_url, category, status, featured) VALUES
('Coastal Driftwood Sculpture', 'Hand-carved driftwood sculpture inspired by coastal beauty.', 89.99, 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=500&fit=crop', 'Sculptures', 'active', true),
('Handwoven Sea Glass Bracelet', 'Delicate bracelet featuring authentic sea glass collected from coastal beaches.', 34.99, 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500&h=500&fit=crop', 'Jewelry', 'active', true),
('Rustic Crab Shell Candle', 'Natural soy candle housed in a real crab shell with ocean breeze scent.', 24.99, 'https://images.unsplash.com/photo-1602874801006-e26c4c5b5e8a?w=500&h=500&fit=crop', 'Candles', 'active', true),
('Ocean Wave Glass Bowl', 'Beautiful hand-blown glass bowl with blue and white swirl patterns reminiscent of ocean waves.', 125.00, 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=500&h=500&fit=crop', 'Glass Art', 'active', false),
('Seashell Wind Chime', 'Handcrafted wind chime made from collected seashells and driftwood.', 45.99, 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=500&h=500&fit=crop', 'Home Decor', 'active', false);

-- Orders table for future use
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID,
    stripe_payment_intent_id VARCHAR(255),
    total DECIMAL(10,2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
    shipping_address JSONB,
    billing_address JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Order items table
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id),
    quantity INTEGER NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for orders
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Policies for orders (users can only see their own orders)
CREATE POLICY "Users can view own orders" ON public.orders
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage all orders" ON public.orders
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Users can view own order items" ON public.order_items
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.orders 
            WHERE orders.id = order_items.order_id 
            AND orders.user_id = auth.uid()
        )
    );

CREATE POLICY "Service role can manage all order items" ON public.order_items
    FOR ALL USING (auth.role() = 'service_role');

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers to auto-update updated_at
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
