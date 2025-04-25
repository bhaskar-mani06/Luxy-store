-- Create products table if not exists
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    original_price DECIMAL(10,2),
    category TEXT NOT NULL,
    image_url TEXT NOT NULL,
    featured BOOLEAN DEFAULT FALSE,
    is_new BOOLEAN DEFAULT FALSE,
    on_sale BOOLEAN DEFAULT FALSE,
    discount INTEGER DEFAULT 0,
    rating DECIMAL(3,1) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- First disable RLS
ALTER TABLE products DISABLE ROW LEVEL SECURITY;

-- Then enable it
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Drop all existing policies
DROP POLICY IF EXISTS "Allow anonymous product viewing" ON products;
DROP POLICY IF EXISTS "Allow authenticated users to manage products" ON products;
DROP POLICY IF EXISTS "Enable read access for all users" ON products;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON products;
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON products;
DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON products;

-- Create policies
-- 1. Allow anyone to view products
CREATE POLICY "Enable read access for all users" ON products
    FOR SELECT 
    USING (true);

-- 2. Allow authenticated users full access
CREATE POLICY "Enable authenticated users full access" ON products
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Grant permissions
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON products TO authenticated;
GRANT SELECT ON products TO anon; 