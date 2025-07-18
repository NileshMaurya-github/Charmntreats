-- Fix all blog system issues

-- 1. Fix comment policies (most important)
DROP POLICY IF EXISTS "Allow public to insert blog comments" ON blog_comments;
DROP POLICY IF EXISTS "Allow public to view approved blog comments" ON blog_comments;
DROP POLICY IF EXISTS "Allow authenticated users to manage blog comments" ON blog_comments;
DROP POLICY IF EXISTS "Enable public comment submission" ON blog_comments;
DROP POLICY IF EXISTS "Enable public to view approved comments" ON blog_comments;
DROP POLICY IF EXISTS "Enable authenticated users to manage all comments" ON blog_comments;
DROP POLICY IF EXISTS "Enable anonymous comment submission" ON blog_comments;

-- Create simple, working policies
CREATE POLICY "blog_comments_select_policy" ON blog_comments
    FOR SELECT USING (is_approved = true OR auth.role() = 'authenticated');

CREATE POLICY "blog_comments_insert_policy" ON blog_comments
    FOR INSERT WITH CHECK (true);

CREATE POLICY "blog_comments_update_policy" ON blog_comments
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "blog_comments_delete_policy" ON blog_comments
    FOR DELETE USING (auth.role() = 'authenticated');

-- 2. Create storage bucket for images
INSERT INTO storage.buckets (id, name, public)
VALUES ('blog-images', 'blog-images', true)
ON CONFLICT (id) DO NOTHING;

-- 3. Set up storage policies
DROP POLICY IF EXISTS "Allow public to view blog images" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to upload blog images" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to update blog images" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to delete blog images" ON storage.objects;

CREATE POLICY "blog_images_select_policy" ON storage.objects
    FOR SELECT USING (bucket_id = 'blog-images');

CREATE POLICY "blog_images_insert_policy" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'blog-images' AND auth.role() = 'authenticated');

CREATE POLICY "blog_images_update_policy" ON storage.objects
    FOR UPDATE USING (bucket_id = 'blog-images' AND auth.role() = 'authenticated');

CREATE POLICY "blog_images_delete_policy" ON storage.objects
    FOR DELETE USING (bucket_id = 'blog-images' AND auth.role() = 'authenticated');