-- Clean up all existing blog comment policies and create fresh ones
DROP POLICY IF EXISTS "blog_comments_select_policy" ON blog_comments;
DROP POLICY IF EXISTS "blog_comments_insert_policy" ON blog_comments;
DROP POLICY IF EXISTS "blog_comments_update_policy" ON blog_comments;
DROP POLICY IF EXISTS "blog_comments_delete_policy" ON blog_comments;
DROP POLICY IF EXISTS "Allow public to insert blog comments" ON blog_comments;
DROP POLICY IF EXISTS "Allow public to view approved blog comments" ON blog_comments;
DROP POLICY IF EXISTS "Allow authenticated users to manage blog comments" ON blog_comments;
DROP POLICY IF EXISTS "Enable public comment submission" ON blog_comments;
DROP POLICY IF EXISTS "Enable public to view approved comments" ON blog_comments;
DROP POLICY IF EXISTS "Enable authenticated users to manage all comments" ON blog_comments;
DROP POLICY IF EXISTS "Enable anonymous comment submission" ON blog_comments;

-- Create fresh, working policies
CREATE POLICY "blog_comments_public_select" ON blog_comments
    FOR SELECT USING (is_approved = true OR auth.role() = 'authenticated');

CREATE POLICY "blog_comments_public_insert" ON blog_comments
    FOR INSERT WITH CHECK (true);

CREATE POLICY "blog_comments_admin_update" ON blog_comments
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "blog_comments_admin_delete" ON blog_comments
    FOR DELETE USING (auth.role() = 'authenticated');

-- Also ensure storage bucket exists for images
INSERT INTO storage.buckets (id, name, public)
VALUES ('blog-images', 'blog-images', true)
ON CONFLICT (id) DO NOTHING;