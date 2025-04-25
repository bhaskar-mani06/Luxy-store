-- Create admin_users table if not exists
CREATE TABLE IF NOT EXISTS admin_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    UNIQUE(user_id)
);

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable Row Level Security
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Create policies
-- 1. Allow authenticated users to read admin_users
CREATE POLICY "Enable read access for authenticated users" ON admin_users
    FOR SELECT 
    TO authenticated
    USING (true);

-- 2. Allow authenticated users to insert into admin_users
CREATE POLICY "Enable insert for authenticated users" ON admin_users
    FOR INSERT 
    TO authenticated
    WITH CHECK (true);

-- 3. Allow authenticated users to update admin_users
CREATE POLICY "Enable update for authenticated users" ON admin_users
    FOR UPDATE 
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- 4. Allow authenticated users to delete from admin_users
CREATE POLICY "Enable delete for authenticated users" ON admin_users
    FOR DELETE 
    TO authenticated
    USING (true);

-- Grant permissions
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON admin_users TO authenticated;
GRANT SELECT ON admin_users TO anon; 