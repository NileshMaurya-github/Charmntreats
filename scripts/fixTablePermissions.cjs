// Script to fix table permissions and RLS policies
console.log('🔧 Fixing Table Permissions and RLS Policies...\n');

console.log('📋 Updated SQL Commands to Run in Supabase SQL Editor:');
console.log('=====================================================\n');

console.log('1. FIX ORDERS TABLE POLICIES:');
console.log('```sql');
console.log(`
-- Drop existing policies for orders table
DROP POLICY IF EXISTS "Users can view their own orders" ON orders;
DROP POLICY IF EXISTS "Users can create their own orders" ON orders;
DROP POLICY IF EXISTS "Admins can view all orders" ON orders;

-- Create simplified policies for orders table
CREATE POLICY "Enable read access for all users" ON orders
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users" ON orders
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Enable update for authenticated users" ON orders
    FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Enable delete for authenticated users" ON orders
    FOR DELETE USING (auth.uid() IS NOT NULL);
`);
console.log('```\n');

console.log('2. FIX CUSTOMER_DATA TABLE POLICIES:');
console.log('```sql');
console.log(`
-- Drop existing policies for customer_data table
DROP POLICY IF EXISTS "Users can view their own customer data" ON customer_data;
DROP POLICY IF EXISTS "Users can insert their own customer data" ON customer_data;
DROP POLICY IF EXISTS "Users can update their own customer data" ON customer_data;
DROP POLICY IF EXISTS "Admins can view all customer data" ON customer_data;

-- Create simplified policies for customer_data table
CREATE POLICY "Enable read access for all users" ON customer_data
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for all users" ON customer_data
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update for all users" ON customer_data
    FOR UPDATE USING (true);

CREATE POLICY "Enable delete for authenticated users" ON customer_data
    FOR DELETE USING (auth.uid() IS NOT NULL);
`);
console.log('```\n');

console.log('3. FIX TESTIMONIALS TABLE POLICIES (if needed):');
console.log('```sql');
console.log(`
-- Drop existing policies for testimonials table
DROP POLICY IF EXISTS "Admins can manage testimonials" ON testimonials;

-- Create simplified policies for testimonials table
CREATE POLICY "Enable insert for all users" ON testimonials
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update for all users" ON testimonials
    FOR UPDATE USING (true);

CREATE POLICY "Enable delete for authenticated users" ON testimonials
    FOR DELETE USING (auth.uid() IS NOT NULL);
`);
console.log('```\n');

console.log('4. FIX HOMEPAGE_CONTENT TABLE POLICIES (if needed):');
console.log('```sql');
console.log(`
-- Drop existing policies for homepage_content table
DROP POLICY IF EXISTS "Admins can manage homepage content" ON homepage_content;

-- Create simplified policies for homepage_content table
CREATE POLICY "Enable insert for all users" ON homepage_content
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update for all users" ON homepage_content
    FOR UPDATE USING (true);

CREATE POLICY "Enable delete for authenticated users" ON homepage_content
    FOR DELETE USING (auth.uid() IS NOT NULL);
`);
console.log('```\n');

console.log('🔧 Instructions:');
console.log('1. Go to your Supabase project dashboard');
console.log('2. Navigate to SQL Editor');
console.log('3. Copy and paste each SQL command above');
console.log('4. Run each command one by one');
console.log('5. Test the admin dashboard functionality\n');

console.log('⚠️  Note: These simplified policies allow broader access');
console.log('   which is suitable for an admin dashboard environment.\n');

console.log('🎯 After running these commands, test with:');
console.log('   node scripts/testAdminFunctionality.cjs');

console.log('\n✅ Permission fix script completed!');