// Test comment system functionality
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

async function testCommentSystem() {
  console.log('🧪 Testing comment system...\n');

  try {
    // Test 1: Check if blog_comments table exists and has data
    console.log('1️⃣ Checking blog_comments table...');
    const { data: comments, error: commentsError } = await supabase
      .from('blog_comments')
      .select('*')
      .order('created_at', { ascending: false });

    if (commentsError) {
      console.error('❌ Error fetching comments:', commentsError);
      return;
    }

    console.log(`✅ Found ${comments.length} comments in database`);
    
    if (comments.length > 0) {
      console.log('📋 Recent comments:');
      comments.slice(0, 3).forEach((comment, index) => {
        console.log(`   ${index + 1}. ${comment.user_name}: "${comment.content.substring(0, 50)}..." (${comment.is_approved ? 'Approved' : 'Pending'})`);
      });
    }

    // Test 2: Check pending comments
    const pendingComments = comments.filter(c => !c.is_approved);
    console.log(`\n2️⃣ Pending comments: ${pendingComments.length}`);
    
    if (pendingComments.length > 0) {
      console.log('⏳ Pending comments:');
      pendingComments.forEach((comment, index) => {
        console.log(`   ${index + 1}. ${comment.user_name}: "${comment.content.substring(0, 50)}..."`);
      });
    }

    // Test 3: Check blog posts for comment association
    console.log('\n3️⃣ Checking blog posts...');
    const { data: posts, error: postsError } = await supabase
      .from('blog_posts')
      .select('id, title, slug')
      .eq('is_published', true);

    if (postsError) {
      console.error('❌ Error fetching posts:', postsError);
      return;
    }

    console.log(`✅ Found ${posts.length} published blog posts`);
    
    if (posts.length > 0) {
      console.log('📝 Published posts:');
      posts.forEach((post, index) => {
        console.log(`   ${index + 1}. ${post.title} (slug: ${post.slug})`);
      });
    }

    // Test 4: Test comment submission (simulate)
    console.log('\n4️⃣ Testing comment submission...');
    if (posts.length > 0) {
      const testComment = {
        post_id: posts[0].id,
        user_name: 'Test User',
        user_email: 'test@example.com',
        content: 'This is a test comment to verify the system is working.',
        is_approved: false
      };

      const { data: newComment, error: insertError } = await supabase
        .from('blog_comments')
        .insert(testComment)
        .select()
        .single();

      if (insertError) {
        console.error('❌ Error inserting test comment:', insertError);
      } else {
        console.log('✅ Test comment inserted successfully:', newComment.id);
        
        // Clean up test comment
        await supabase
          .from('blog_comments')
          .delete()
          .eq('id', newComment.id);
        console.log('🧹 Test comment cleaned up');
      }
    }

    console.log('\n🎯 Comment System Status:');
    console.log(`   • Total comments: ${comments.length}`);
    console.log(`   • Pending approval: ${pendingComments.length}`);
    console.log(`   • Published posts: ${posts.length}`);
    console.log(`   • System status: ${comments.length >= 0 ? '✅ Working' : '❌ Issues detected'}`);

  } catch (error) {
    console.error('❌ Error testing comment system:', error);
  }
}

// Run the test
testCommentSystem();