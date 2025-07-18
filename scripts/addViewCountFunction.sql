-- Create function to increment view count for blog posts
CREATE OR REPLACE FUNCTION increment_view_count(post_id BIGINT)
RETURNS void AS $$
BEGIN
    UPDATE blog_posts 
    SET view_count = view_count + 1 
    WHERE id = post_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to public (for anonymous users)
GRANT EXECUTE ON FUNCTION increment_view_count(BIGINT) TO public;