-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    received_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    read BOOLEAN DEFAULT FALSE
);

-- Set up Row Level Security (RLS)
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist, then recreate them
DROP POLICY IF EXISTS "Allow anonymous message insertion" ON messages;
CREATE POLICY "Allow anonymous message insertion" ON messages
    FOR INSERT 
    TO anon
    WITH CHECK (true);

DROP POLICY IF EXISTS "Allow authenticated users to read messages" ON messages;
CREATE POLICY "Allow authenticated users to read messages" ON messages
    FOR SELECT 
    TO authenticated
    USING (true);

DROP POLICY IF EXISTS "Allow authenticated users to update messages" ON messages;
CREATE POLICY "Allow authenticated users to update messages" ON messages
    FOR UPDATE 
    TO authenticated
    USING (true)
    WITH CHECK (true);

DROP POLICY IF EXISTS "Allow authenticated users to delete messages" ON messages;
CREATE POLICY "Allow authenticated users to delete messages" ON messages
    FOR DELETE 
    TO authenticated
    USING (true); 