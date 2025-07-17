const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Use actual Supabase values
const supabaseUrl = 'https://upvwivmwrxdtsusfhpwy.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVwdndpdm13cnhkdHN1c2ZocHd5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEzNjIwMTgsImV4cCI6MjA2NjkzODAxOH0.M464kdxcTbyefM8J7VNmPL01fvLND5OEjx2jXrnR2jM';

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials');
  console.log('VITE_SUPABASE_URL:', supabaseUrl ? '✅ Set' : '❌ Missing');
  console.log('SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? '✅ Set' : '❌ Missing');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createOrdersTables() {
  try {
    console.log('🚀 Creating orders tables...');

    // Read the migration file
    const migrationPath = path.join(__dirname, '..', 'supabase', 'migrations', '20240717000004_create_orders_tables.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');

    // Execute the migration
    const { data, error } = await supabase.rpc('exec_sql', {
      sql: migrationSQL
    });

    if (error) {
      console.error('❌ Error creating orders tables:', error);
      
      // Try alternative approach - execute statements one by one
      console.log('🔄 Trying alternative approach...');
      
      const statements = migrationSQL
        .split(';')
        .map(stmt => stmt.trim())
        .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

      for (const statement of statements) {
        try {
          const { error: stmtError } = await supabase.rpc('exec_sql', {
            sql: statement + ';'
          });
          
          if (stmtError) {
            console.log('⚠️ Statement failed (might be expected):', statement.substring(0, 50) + '...');
            console.log('Error:', stmtError.message);
          } else {
            console.log('✅ Statement executed:', statement.substring(0, 50) + '...');
          }
        } catch (err) {
          console.log('⚠️ Statement error:', err.message);
        }
      }
    } else {
      console.log('✅ Orders tables created successfully!');
    }

    // Test the tables by checking if they exist
    const { data: tablesData, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .in('table_name', ['orders', 'order_items']);

    if (tablesError) {
      console.log('⚠️ Could not verify tables:', tablesError.message);
    } else {
      console.log('📋 Tables found:', tablesData.map(t => t.table_name));
    }

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

createOrdersTables();