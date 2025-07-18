// Test blog post create and update operations
const { createClient } = require('@supabase/supabase-js');

// Load environment variables
const fs = require('fs');
const path = require('path');

function loadEnv() {
  try {
    const envPath = path.join(__dirname, '..', '.env');
    const envContent = fs.readFileSync(envPath, 'utf8');
    const envVars = {};
    
    envContent.split('\n').forEach(line => {
      const [key, value] = line.split('=');
      if (key && value) {
        envVars[key.trim()] = value.trim().replace(/^["']|["']$/g, '');
      }
    });
    
    return envVars;
  } catch (error) {
    console.error('❌ Failed to load .env file:', error.message);
    return {};
  }
}

const env = loadEnv();
const supabaseUrl = env.VITE_SUPABASE_URL;
const supabaseKey = env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function testBlogPostOperations() {
  console.log('🧪 Testing blog post operations...\n');

  try {
    // Test 1: Check if we can read blog_posts
    console.log('1️⃣ Testing blog_posts table access...');
    const { data: posts, error: postsError } = await supabase
      .from('blog_posts')
      .select('*')
      .limit(1);

    if (postsError) {
      console.error('❌ Error reading blog_posts:', postsError);
      return;
    }

    console.log(`✅ Can read blog_posts table (${posts.length} posts found)`);

    // Test 2: Try to create a new blog post
    console.log('\n2️⃣ Testing blog post creation...');
    const testPost = {
      slug: 'test-post-' + Date.now(),
      title: 'Test Post',
      excerpt: 'This is a test post',
      content: 'This is test content for the blog post.',
      featured_image: 'https://via.placeholder.com/800x400',
      author: 'Test Author',
      category: 'craft-tips',
      tags: ['test', 'debug'],
      is_published: false,
      is_featured: false,
      published_at: null
    };

    const { data: newPost, error: createError } = await supabase
      .from('blog_posts')
      .insert(testPost)
      .select()
      .single();

    if (createError) {
      console.error('❌ Error creating blog post:', createError);
      console.log('Error details:', {
        code: createError.code,
        message: createError.message,
        details: createError.details,
        hint: createError.hint
      });
    } else {
      console.log('✅ Blog post created successfully:', newPost.id);

      // Test 3: Try to update the blog post
      console.log('\n3️⃣ Testing blog post update...');
      const { data: updatedPost, error: updateError } = await supabase
        .from('blog_posts')
        .update({ 
          title: 'Updated Test Post',
          content: 'This content has been updated.'
        })
        .eq('id', newPost.id)
        .select()
        .single();

      if (updateError) {
        console.error('❌ Error updating blog post:', updateError);
        console.log('Error details:', {
          code: updateError.code,
          message: updateError.message,
          details: updateError.details,
          hint: updateError.hint
        });
      } else {
        console.log('✅ Blog post updated successfully:', updatedPost.title);
      }

      // Clean up: Delete the test post
      console.log('\n4️⃣ Cleaning up test post...');
      const { error: deleteError } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', newPost.id);

      if (deleteError) {
        console.error('❌ Error deleting test post:', deleteError);
      } else {
        console.log('✅ Test post cleaned up successfully');
      }
    }

    // Test 4: Check RLS policies
    console.log('\n5️⃣ Checking RLS policies for blog_posts...');
    const { data: policies, error: policiesError } = await supabase
      .from('pg_policies')
      .select('*')
      .eq('tablename', 'blog_posts');

    if (policiesError) {
      console.log('⚠️ Could not check policies (this is normal)');
    } else {
      console.log(`📋 Found ${policies?.length || 0} RLS policies for blog_posts`);
    }

    console.log('\n🎯 Blog Post Operations Status:');
    console.log(`   • Read access: ${posts ? '✅ Working' : '❌ Failed'}`);
    console.log(`   • Create access: ${newPost ? '✅ Working' : '❌ Failed'}`);
    console.log(`   • Update access: ${!createError && !updateError ? '✅ Working' : '❌ Failed'}`);

  } catch (error) {
    console.error('❌ Error testing blog post operations:', error);
  }
}

// Run the test
testBlogPostOperations();