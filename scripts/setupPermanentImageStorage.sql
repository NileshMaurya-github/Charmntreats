-- Set up permanent image storage for blog system

-- 1. Create the blog-images storage bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'blog-images', 
    'blog-images', 
    true, 
    52428800, -- 50MB limit
    ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']
) ON CONFLICT (id) DO UPDATE SET
    public = EXCLUDED.public,
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

-- 2. Set up storage policies for permanent access
DROP POLICY IF EXISTS "blog_images_public_select" ON storage.objects;
DROP POLICY IF EXISTS "blog_images_admin_insert" ON storage.objects;
DROP POLICY IF EXISTS "blog_images_admin_update" ON storage.objects;
DROP POLICY IF EXISTS "blog_images_admin_delete" ON storage.objects;

-- 3. Create comprehensive storage policies
CREATE POLICY "blog_images_public_select" ON storage.objects
    FOR SELECT USING (bucket_id = 'blog-images');

CREATE POLICY "blog_images_admin_insert" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'blog-images' AND 
        (auth.role() = 'authenticated' OR auth.role() = 'anon')
    );

CREATE POLICY "blog_images_admin_update" ON storage.objects
    FOR UPDATE USING (
        bucket_id = 'blog-images' AND 
        auth.role() = 'authenticated'
    );

CREATE POLICY "blog_images_admin_delete" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'blog-images' AND 
        auth.role() = 'authenticated'
    );

-- 4. Test storage by checking if bucket exists
SELECT 
    id, 
    name, 
    public, 
    file_size_limit,
    allowed_mime_types,
    created_at
FROM storage.buckets 
WHERE id = 'blog-images';