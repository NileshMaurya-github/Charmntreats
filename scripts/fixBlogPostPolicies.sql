-- Fix blog_posts RLS policies to allow create and update operations

-- 1. Drop all existing policies for blog_posts
DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'blog_posts') LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(r.policyname) || ' ON blog_posts';
    END LOOP;
END $$;

-- 2. Create simple, working policies for blog_posts
CREATE POLICY "blog_posts_public_select" ON blog_posts
    FOR SELECT USING (is_published = true OR auth.role() = 'authenticated');

CREATE POLICY "blog_posts_admin_insert" ON blog_posts
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "blog_posts_admin_update" ON blog_posts
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "blog_posts_admin_delete" ON blog_posts
    FOR DELETE USING (auth.role() = 'authenticated');

-- 3. Test by inserting a sample post
INSERT INTO blog_posts (slug, title, excerpt, content, featured_image, author, category, tags, is_published, is_featured, published_at) 
VALUES (
    'test-admin-post', 
    'Test Admin Post', 
    'This is a test post created by admin',
    'This is test content to verify admin can create posts.',
    'https://via.placeholder.com/800x400',
    'Admin User',
    'craft-tips',
    ARRAY['test', 'admin'],
    false,
    false,
    null
) ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content = EXCLUDED.content;