-- Fix comment policies to allow public comment submission
DROP POLICY IF EXISTS "Allow public to insert blog comments" ON blog_comments;
DROP POLICY IF EXISTS "Allow public to view approved blog comments" ON blog_comments;
DROP POLICY IF EXISTS "Allow authenticated users to manage blog comments" ON blog_comments;

-- Create new policies that work properly
CREATE POLICY "Enable public comment submission" ON blog_comments
    FOR INSERT TO public
    WITH CHECK (true);

CREATE POLICY "Enable public to view approved comments" ON blog_comments
    FOR SELECT TO public
    USING (is_approved = true);

CREATE POLICY "Enable authenticated users to manage all comments" ON blog_comments
    FOR ALL TO authenticated
    USING (true)
    WITH CHECK (true);

-- Also ensure anon users can insert comments
CREATE POLICY "Enable anonymous comment submission" ON blog_comments
    FOR INSERT TO anon
    WITH CHECK (true);