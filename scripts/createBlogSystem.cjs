console.log('🚀 Creating blog system database tables...\n');

console.log('📋 MANUAL TABLE CREATION REQUIRED:');
console.log('Please run this SQL in your Supabase dashboard:\n');
console.log('='.repeat(80));
console.log(`
-- Create blog_posts table for storing blog content
CREATE TABLE IF NOT EXISTS blog_posts (
    id BIGSERIAL PRIMARY KEY,
    slug VARCHAR(255) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    excerpt TEXT,
    content TEXT NOT NULL,
    featured_image TEXT,
    author VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    tags TEXT[], -- Array of tags
    is_published BOOLEAN DEFAULT false,
    is_featured BOOLEAN DEFAULT false,
    view_count INTEGER DEFAULT 0,
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create blog_categories table for organizing blog posts
CREATE TABLE IF NOT EXISTS blog_categories (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create blog_comments table for user comments
CREATE TABLE IF NOT EXISTS blog_comments (
    id BIGSERIAL PRIMARY KEY,
    post_id BIGINT REFERENCES blog_posts(id) ON DELETE CASCADE,
    user_name VARCHAR(255) NOT NULL,
    user_email VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    is_approved BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(is_published);
CREATE INDEX IF NOT EXISTS idx_blog_posts_featured ON blog_posts(is_featured);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON blog_posts(category);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON blog_posts(published_at);
CREATE INDEX IF NOT EXISTS idx_blog_categories_slug ON blog_categories(slug);
CREATE INDEX IF NOT EXISTS idx_blog_comments_post_id ON blog_comments(post_id);

-- Enable RLS
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_comments ENABLE ROW LEVEL SECURITY;

-- Create policies for blog_posts
CREATE POLICY "Allow public to view published blog posts" ON blog_posts
    FOR SELECT TO public
    USING (is_published = true);

CREATE POLICY "Allow authenticated users to manage blog posts" ON blog_posts
    FOR ALL TO authenticated
    USING (true)
    WITH CHECK (true);

-- Create policies for blog_categories
CREATE POLICY "Allow public to view blog categories" ON blog_categories
    FOR SELECT TO public
    USING (true);

CREATE POLICY "Allow authenticated users to manage blog categories" ON blog_categories
    FOR ALL TO authenticated
    USING (true)
    WITH CHECK (true);

-- Create policies for blog_comments
CREATE POLICY "Allow public to view approved blog comments" ON blog_comments
    FOR SELECT TO public
    USING (is_approved = true);

CREATE POLICY "Allow public to insert blog comments" ON blog_comments
    FOR INSERT TO public
    WITH CHECK (true);

CREATE POLICY "Allow authenticated users to manage blog comments" ON blog_comments
    FOR ALL TO authenticated
    USING (true)
    WITH CHECK (true);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_blog_posts_updated_at 
    BEFORE UPDATE ON blog_posts 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insert sample blog categories
INSERT INTO blog_categories (name, slug, description) VALUES
('Handcrafted Art', 'handcrafted-art', 'Articles about handcrafted art and techniques'),
('DIY Projects', 'diy-projects', 'Do-it-yourself craft projects and tutorials'),
('Craft Tips', 'craft-tips', 'Tips and tricks for crafting enthusiasts'),
('Product Spotlights', 'product-spotlights', 'Featuring our best handcrafted products'),
('Behind the Scenes', 'behind-the-scenes', 'A look into our crafting process')
ON CONFLICT (slug) DO NOTHING;

-- Insert sample blog posts
INSERT INTO blog_posts (slug, title, excerpt, content, featured_image, author, category, tags, is_published, is_featured, published_at) VALUES
(
    'the-art-of-dream-catchers', 
    'The Art of Dream Catchers: History and Meaning', 
    'Explore the rich history and cultural significance of dream catchers and how they evolved into beautiful decorative pieces.', 
    E'# The Art of Dream Catchers: History and Meaning\\n\\n## Origins and Cultural Significance\\n\\nDream catchers originated from the Ojibwe people, also known as Chippewa, who believed that the night air is filled with both good and bad dreams. According to their legend, the good dreams know how to pass through the dream catcher, while the bad dreams get trapped in the web.\\n\\n## Materials and Craftsmanship\\n\\nTraditional dream catchers are made using a willow hoop, with a net or web woven inside the circle. The web is designed to mimic a spider\\'s web, with a small hole in the center. Various sacred items such as feathers and beads are hung from the bottom of the dream catcher.\\n\\n## Modern Interpretations\\n\\nToday, dream catchers have evolved beyond their traditional roots and have become popular decorative items. Modern dream catchers often incorporate various materials like colorful threads, crystals, and different types of feathers, making each piece unique.\\n\\n## How to Choose the Perfect Dream Catcher\\n\\nWhen selecting a dream catcher, consider the following:\\n\\n- **Size**: Smaller dream catchers are traditionally hung above beds, while larger ones make beautiful wall decorations.\\n- **Colors**: Different colors can represent various elements - blue for water, green for earth, etc.\\n- **Materials**: Look for high-quality, ethically sourced materials.\\n- **Craftsmanship**: A well-made dream catcher will have tight, even weaving and secure attachments.\\n\\n## Caring for Your Dream Catcher\\n\\nTo keep your dream catcher looking beautiful:\\n\\n- Avoid placing it in direct sunlight, which can fade the colors\\n- Dust gently with a soft brush or use low-pressure compressed air\\n- Keep away from moisture to prevent warping of the hoop\\n\\n## Our Collection\\n\\nAt Charmntreats, we offer a variety of handcrafted dream catchers, each made with care and attention to detail. Our artisans combine traditional techniques with modern aesthetics to create pieces that are both meaningful and beautiful.', 
    'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80', 
    'Priya Sharma', 
    'Handcrafted Art', 
    ARRAY['dream catchers', 'home decor', 'cultural art', 'handcrafted'], 
    true, 
    true, 
    NOW() - INTERVAL '5 days'
),
(
    'diy-macrame-wall-hanging-tutorial', 
    'DIY Macramé Wall Hanging: A Step-by-Step Tutorial', 
    'Learn how to create your own beautiful macramé wall hanging with our detailed tutorial for beginners.', 
    E'# DIY Macramé Wall Hanging: A Step-by-Step Tutorial\\n\\n## Introduction\\n\\nMacramé is an ancient form of textile-making that has seen a huge revival in recent years. This knotting technique creates beautiful, textured pieces that add warmth and bohemian charm to any space. In this tutorial, we\\'ll guide you through creating your very own macramé wall hanging.\\n\\n## Materials You\\'ll Need\\n\\n- Cotton macramé cord (4-5mm thickness recommended)\\n- Wooden dowel or branch (about 12-15 inches long)\\n- Scissors\\n- Measuring tape\\n- Optional: beads, rings, or other decorative elements\\n\\n## Basic Knots to Know\\n\\n### Lark\\'s Head Knot\\n\\nThis is the foundation knot used to attach your cords to the dowel:\\n\\n1. Fold your cord in half to create a loop\\n2. Place the loop behind the dowel\\n3. Pull the ends through the loop\\n4. Pull tight to secure\\n\\n### Square Knot\\n\\nThe most common decorative knot in macramé:\\n\\n1. Arrange four cords with the middle two serving as \"filler cords\"\\n2. Take the left outer cord and place it over the filler cords and under the right outer cord\\n3. Take the right outer cord, bring it under the filler cords and through the loop created by the left cord\\n4. Pull tight\\n5. Repeat, starting from the right side\\n\\n## Step-by-Step Instructions\\n\\n1. **Prepare your dowel**: Sand if necessary and cut to desired length\\n\\n2. **Cut your cords**: For a medium-sized wall hanging, cut 8-10 pieces of cord, each about 4 feet long\\n\\n3. **Attach cords to dowel**: Use lark\\'s head knots to attach all cords to your dowel\\n\\n4. **Create your design**: Alternate between square knots and other patterns to create your design\\n\\n5. **Trim and style**: Once you\\'ve reached your desired length, trim the ends to create a neat fringe\\n\\n## Variations and Ideas\\n\\n- Add wooden beads between rows of knots\\n- Incorporate dyed cords for a colorful effect\\n- Use different thicknesses of cord for varied texture\\n- Add a second dowel at the bottom for a hanging shelf\\n\\n## Conclusion\\n\\nMacramé is a wonderfully meditative craft that allows for endless creativity. Don\\'t be afraid to experiment with different knots and patterns as you become more comfortable with the technique. Happy knotting!', 
    'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80', 
    'Aditya Patel', 
    'DIY Projects', 
    ARRAY['macrame', 'wall hanging', 'DIY', 'tutorial', 'home decor'], 
    true, 
    true, 
    NOW() - INTERVAL '10 days'
),
(
    '5-essential-tools-for-crafting-beginners', 
    '5 Essential Tools Every Crafting Beginner Should Have', 
    'Starting your crafting journey? Here are the five must-have tools that will set you up for success in any project.', 
    E'# 5 Essential Tools Every Crafting Beginner Should Have\\n\\n## Introduction\\n\\nEmbarking on your crafting journey is exciting, but it can also be overwhelming when you see the vast array of tools available. To help you get started without breaking the bank, we\\'ve compiled a list of five essential tools that will serve you well across various crafting projects.\\n\\n## 1. Quality Scissors Set\\n\\nA good set of scissors is perhaps the most important tool in any crafter\\'s arsenal. We recommend investing in at least two pairs:\\n\\n- **Fabric scissors**: Reserved exclusively for cutting fabric to keep them sharp\\n- **General crafting scissors**: For paper, cardboard, and other materials\\n\\nLook for comfortable handles and stainless steel blades for longevity.\\n\\n## 2. Precision Cutting Mat\\n\\nA self-healing cutting mat protects your work surface and extends the life of your cutting tools. These mats typically have grid lines that help with measuring and making straight cuts. A medium-sized mat (18\" x 24\") is versatile enough for most projects.\\n\\n## 3. Reliable Measuring Tools\\n\\nAccurate measurements are crucial for successful crafting. Essential measuring tools include:\\n\\n- A clear ruler with visible markings\\n- A flexible measuring tape for curved surfaces\\n- A set square for perfect right angles\\n\\n## 4. Adhesive Collection\\n\\nDifferent projects require different types of adhesives:\\n\\n- **PVA glue**: For paper, card, and general crafting\\n- **Fabric glue**: For textile projects\\n- **Hot glue gun**: For quick bonds and three-dimensional projects\\n- **Double-sided tape**: For clean paper crafting\\n\\n## 5. Storage System\\n\\nStart with a basic storage system to keep your tools organized and accessible. This could be as simple as:\\n\\n- Clear containers for small items\\n- Pen holders for frequently used tools\\n- Drawer dividers to categorize supplies\\n\\nAs your collection grows, you can expand your storage solutions.\\n\\n## Conclusion\\n\\nRemember, it\\'s better to invest in fewer, higher-quality tools than many inexpensive ones that might need replacing quickly. These five essentials will form the foundation of your crafting toolkit and serve you well as you develop your skills and explore different techniques.\\n\\nAt Charmntreats, we believe in setting up crafters for success. Check out our curated selection of high-quality crafting tools to start your journey right!', 
    'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80', 
    'Meera Joshi', 
    'Craft Tips', 
    ARRAY['crafting tools', 'beginners', 'essentials', 'crafting tips'], 
    true, 
    false, 
    NOW() - INTERVAL '15 days'
)
ON CONFLICT (slug) DO NOTHING;

-- Insert sample comments
INSERT INTO blog_comments (post_id, user_name, user_email, content, is_approved) VALUES
(1, 'Ravi Kumar', 'ravi.kumar@example.com', 'This article was so informative! I never knew the cultural significance behind dream catchers. Thanks for sharing this knowledge.', true),
(1, 'Ananya Singh', 'ananya.singh@example.com', 'I recently purchased a dream catcher from your store and it\\'s beautiful. This article makes me appreciate it even more.', true),
(2, 'Vikram Desai', 'vikram.d@example.com', 'I tried this tutorial over the weekend and it was so easy to follow! My wall hanging turned out great for a first attempt.', true),
(2, 'Priya Mehta', 'priya.m@example.com', 'Could you please suggest some places to buy quality macramé cord in India?', true),
(3, 'Deepak Sharma', 'deepak.s@example.com', 'Great list! I would also add a good pair of pliers for jewelry making and wire work.', true)
ON CONFLICT DO NOTHING;
`);
console.log('='.repeat(80));

console.log('\n📍 Steps to create blog system:');
console.log('1. Go to https://supabase.com/dashboard');
console.log('2. Select your project');
console.log('3. Go to SQL Editor');
console.log('4. Paste the SQL above');
console.log('5. Click "Run"');

console.log('\n🎯 What this creates:');
console.log('✅ Blog posts table with full content management');
console.log('✅ Blog categories for organization');
console.log('✅ Comments system for user engagement');
console.log('✅ Sample blog posts and categories');
console.log('✅ Proper security policies');

console.log('\n📊 Features included:');
console.log('• Markdown content support');
console.log('• Featured images');
console.log('• Categories and tags');
console.log('• Featured posts highlighting');
console.log('• View count tracking');
console.log('• Comment system with moderation');

console.log('\n🔧 Next steps:');
console.log('1. Create blog service for data fetching');
console.log('2. Create blog list and detail pages');
console.log('3. Add blog management to admin dashboard');
console.log('4. Implement comment submission and moderation');