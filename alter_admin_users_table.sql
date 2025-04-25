-- First, check if there are any existing rows
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM admin_users) THEN
        -- If there are existing rows, drop the table and recreate it
        DROP TABLE admin_users;
    END IF;
END $$;

-- Create the table with the correct schema
CREATE TABLE admin_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    UNIQUE(user_id)
);

-- Drop existing policies first
DROP POLICY IF EXISTS "Service role has full access" ON admin_users;
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON admin_users;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON admin_users;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON admin_users;
DROP POLICY IF EXISTS "Enable delete for authenticated users" ON admin_users;

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable Row Level Security
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Allow service role full access
CREATE POLICY "Service role has full access" ON admin_users
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- Allow authenticated users to read
CREATE POLICY "Enable read access for authenticated users" ON admin_users
    FOR SELECT 
    TO authenticated
    USING (true);

-- Allow authenticated users to insert if they don't exist in the table
CREATE POLICY "Enable insert for authenticated users" ON admin_users
    FOR INSERT 
    TO authenticated
    WITH CHECK (
        NOT EXISTS (
            SELECT 1 
            FROM admin_users 
            WHERE user_id = auth.uid()
        )
    );

-- Allow authenticated users to update their own records
CREATE POLICY "Enable update for authenticated users" ON admin_users
    FOR UPDATE 
    TO authenticated
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());

-- Allow authenticated users to delete their own records
CREATE POLICY "Enable delete for authenticated users" ON admin_users
    FOR DELETE 
    TO authenticated
    USING (user_id = auth.uid());

-- Grant permissions
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO service_role;
GRANT ALL ON admin_users TO authenticated;
GRANT ALL ON admin_users TO service_role;
GRANT SELECT ON admin_users TO anon; 