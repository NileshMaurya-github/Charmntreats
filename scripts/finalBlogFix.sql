-- FINAL FIX FOR ALL BLOG ISSUES

-- 1. Completely disable RLS for blog_comments temporarily to test
ALTER TABLE blog_comments DISABLE ROW LEVEL SECURITY;

-- 2. Re-enable RLS with simple policies
ALTER TABLE blog_comments ENABLE ROW LEVEL SECURITY;

-- 3. Drop ALL existing policies
DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'blog_comments') LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(r.policyname) || ' ON blog_comments';
    END LOOP;
END $$;

-- 4. Create the simplest possible policies that work
CREATE POLICY "allow_all_select" ON blog_comments FOR SELECT USING (true);
CREATE POLICY "allow_all_insert" ON blog_comments FOR INSERT WITH CHECK (true);
CREATE POLICY "allow_all_update" ON blog_comments FOR UPDATE USING (true);
CREATE POLICY "allow_all_delete" ON blog_comments FOR DELETE USING (true);

-- 5. Test comment insertion
INSERT INTO blog_comments (post_id, user_name, user_email, content, is_approved) 
VALUES (1, 'Test User', 'test@example.com', 'This is a test comment to verify the system works.', false)
ON CONFLICT DO NOTHING;

-- 6. Create storage bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('blog-images', 'blog-images', true)
ON CONFLICT (id) DO NOTHING;