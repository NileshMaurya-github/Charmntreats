-- Complete database setup for Charmntreats order management
-- Run this in your Supabase SQL Editor

-- Drop existing tables if they exist (to start fresh)
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;

-- Create orders table with all required columns
CREATE TABLE orders (
    id BIGSERIAL PRIMARY KEY,
    order_id VARCHAR(50) UNIQUE NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    delivery_address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    pincode VARCHAR(10) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL DEFAULT 0,
    shipping_cost DECIMAL(10,2) NOT NULL DEFAULT 0,
    total_amount DECIMAL(10,2) NOT NULL,
    payment_method VARCHAR(20) NOT NULL CHECK (payment_method IN ('cod', 'online')),
    order_status VARCHAR(50) NOT NULL DEFAULT 'confirmed',
    order_date TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create order_items table
CREATE TABLE order_items (
    id BIGSERIAL PRIMARY KEY,
    order_id VARCHAR(50) NOT NULL,
    product_id VARCHAR(50) NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    product_category VARCHAR(100),
    catalog_number VARCHAR(100),
    quantity INTEGER NOT NULL DEFAULT 1,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    product_image TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX idx_orders_order_id ON orders(order_id);
CREATE INDEX idx_orders_customer_email ON orders(customer_email);
CREATE INDEX idx_orders_order_date ON orders(order_date);
CREATE INDEX idx_orders_status ON orders(order_status);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_product_id ON order_items(product_id);

-- Enable Row Level Security
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Create policies for orders table
CREATE POLICY "Allow public to insert orders" ON orders
    FOR INSERT TO public
    WITH CHECK (true);

CREATE POLICY "Allow public to select orders" ON orders
    FOR SELECT TO public
    USING (true);

CREATE POLICY "Users can view their own orders" ON orders
    FOR SELECT TO authenticated
    USING (customer_email = auth.jwt() ->> 'email');

CREATE POLICY "Service role can access all orders" ON orders
    FOR ALL TO service_role
    USING (true)
    WITH CHECK (true);

-- Create policies for order_items table
CREATE POLICY "Allow public to insert order_items" ON order_items
    FOR INSERT TO public
    WITH CHECK (true);

CREATE POLICY "Allow public to select order_items" ON order_items
    FOR SELECT TO public
    USING (true);

CREATE POLICY "Users can view their own order items" ON order_items
    FOR SELECT TO authenticated
    USING (
        order_id IN (
            SELECT order_id FROM orders 
            WHERE customer_email = auth.jwt() ->> 'email'
        )
    );

CREATE POLICY "Service role can access all order items" ON order_items
    FOR ALL TO service_role
    USING (true)
    WITH CHECK (true);

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_orders_updated_at 
    BEFORE UPDATE ON orders 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insert a test order to verify everything works
INSERT INTO orders (
    order_id, customer_name, customer_email, customer_phone,
    delivery_address, city, state, pincode,
    subtotal, shipping_cost, total_amount,
    payment_method, order_status, order_date
) VALUES (
    'SETUP_TEST_001',
    'Setup Test Customer',
    'setup@test.com',
    '9876543210',
    '123 Setup Test Street',
    'Mumbai',
    'Maharashtra',
    '400001',
    1000.00,
    50.00,
    1050.00,
    'cod',
    'confirmed',
    NOW()
);

-- Insert test order items
INSERT INTO order_items (
    order_id, product_id, product_name, product_category,
    catalog_number, quantity, unit_price, total_price,
    product_image
) VALUES (
    'SETUP_TEST_001',
    'test-product-1',
    'Setup Test Product',
    'Test Category',
    'TEST001',
    2,
    500.00,
    1000.00,
    'https://example.com/test-image.jpg'
);

-- Verify the setup worked
SELECT 
    o.order_id,
    o.customer_name,
    o.total_amount,
    COUNT(oi.id) as item_count
FROM orders o
LEFT JOIN order_items oi ON o.order_id = oi.order_id
WHERE o.order_id = 'SETUP_TEST_001'
GROUP BY o.order_id, o.customer_name, o.total_amount;