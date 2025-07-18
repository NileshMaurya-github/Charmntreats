-- Create storage bucket for blog images
INSERT INTO storage.buckets (id, name, public)
VALUES ('blog-images', 'blog-images', true)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies for blog images
CREATE POLICY "Allow public to view blog images" ON storage.objects
FOR SELECT TO public
USING (bucket_id = 'blog-images');

CREATE POLICY "Allow authenticated users to upload blog images" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'blog-images');

CREATE POLICY "Allow authenticated users to update blog images" ON storage.objects
FOR UPDATE TO authenticated
USING (bucket_id = 'blog-images');

CREATE POLICY "Allow authenticated users to delete blog images" ON storage.objects
FOR DELETE TO authenticated
USING (bucket_id = 'blog-images');