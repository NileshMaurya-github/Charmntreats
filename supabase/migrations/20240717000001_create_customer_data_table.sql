-- Create customer_data table for tracking customer information and promotional purposes
CREATE TABLE IF NOT EXISTS customer_data (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT NOT NULL,
    mobile TEXT,
    signup_date TIMESTAMPTZ DEFAULT NOW(),
    email_verified BOOLEAN DEFAULT FALSE,
    signup_method TEXT DEFAULT 'email',
    last_login TIMESTAMPTZ,
    login_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create login_history table for detailed login tracking
CREATE TABLE IF NOT EXISTS login_history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    login_time TIMESTAMPTZ DEFAULT NOW(),
    ip_address TEXT,
    user_agent TEXT,
    login_method TEXT DEFAULT 'email_password',
    success BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_customer_data_user_id ON customer_data(user_id);
CREATE INDEX IF NOT EXISTS idx_customer_data_email ON customer_data(email);
CREATE INDEX IF NOT EXISTS idx_customer_data_signup_date ON customer_data(signup_date);
CREATE INDEX IF NOT EXISTS idx_login_history_user_id ON login_history(user_id);
CREATE INDEX IF NOT EXISTS idx_login_history_email ON login_history(email);
CREATE INDEX IF NOT EXISTS idx_login_history_login_time ON login_history(login_time);

-- Enable Row Level Security (RLS)
ALTER TABLE customer_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE login_history ENABLE ROW LEVEL SECURITY;

-- Create policies for customer_data table
CREATE POLICY "Users can view their own customer data" ON customer_data
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own customer data" ON customer_data
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own customer data" ON customer_data
    FOR UPDATE USING (auth.uid() = user_id);

-- Create policies for login_history table
CREATE POLICY "Users can view their own login history" ON login_history
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own login history" ON login_history
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Admin policies (assuming admin role exists)
CREATE POLICY "Admins can view all customer data" ON customer_data
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND auth.users.email = 'nileshmaurya2020@gmail.com'
        )
    );

CREATE POLICY "Admins can view all login history" ON login_history
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND auth.users.email = 'nileshmaurya2020@gmail.com'
        )
    );

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_customer_data_updated_at 
    BEFORE UPDATE ON customer_data 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();