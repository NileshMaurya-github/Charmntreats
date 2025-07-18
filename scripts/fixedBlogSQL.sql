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
    '# The Art of Dream Catchers: History and Meaning

## Origins and Cultural Significance

Dream catchers originated from the Ojibwe people, also known as Chippewa, who believed that the night air is filled with both good and bad dreams. According to their legend, the good dreams know how to pass through the dream catcher, while the bad dreams get trapped in the web.

## Materials and Craftsmanship

Traditional dream catchers are made using a willow hoop, with a net or web woven inside the circle. The web is designed to mimic a spider''s web, with a small hole in the center. Various sacred items such as feathers and beads are hung from the bottom of the dream catcher.

## Modern Interpretations

Today, dream catchers have evolved beyond their traditional roots and have become popular decorative items. Modern dream catchers often incorporate various materials like colorful threads, crystals, and different types of feathers, making each piece unique.

## How to Choose the Perfect Dream Catcher

When selecting a dream catcher, consider the following:

- **Size**: Smaller dream catchers are traditionally hung above beds, while larger ones make beautiful wall decorations.
- **Colors**: Different colors can represent various elements - blue for water, green for earth, etc.
- **Materials**: Look for high-quality, ethically sourced materials.
- **Craftsmanship**: A well-made dream catcher will have tight, even weaving and secure attachments.

## Caring for Your Dream Catcher

To keep your dream catcher looking beautiful:

- Avoid placing it in direct sunlight, which can fade the colors
- Dust gently with a soft brush or use low-pressure compressed air
- Keep away from moisture to prevent warping of the hoop

## Our Collection

At Charmntreats, we offer a variety of handcrafted dream catchers, each made with care and attention to detail. Our artisans combine traditional techniques with modern aesthetics to create pieces that are both meaningful and beautiful.', 
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
    '# DIY Macramé Wall Hanging: A Step-by-Step Tutorial

## Introduction

Macramé is an ancient form of textile-making that has seen a huge revival in recent years. This knotting technique creates beautiful, textured pieces that add warmth and bohemian charm to any space. In this tutorial, we will guide you through creating your very own macramé wall hanging.

## Materials You Will Need

- Cotton macramé cord (4-5mm thickness recommended)
- Wooden dowel or branch (about 12-15 inches long)
- Scissors
- Measuring tape
- Optional: beads, rings, or other decorative elements

## Basic Knots to Know

### Lark Head Knot

This is the foundation knot used to attach your cords to the dowel:

1. Fold your cord in half to create a loop
2. Place the loop behind the dowel
3. Pull the ends through the loop
4. Pull tight to secure

### Square Knot

The most common decorative knot in macramé:

1. Arrange four cords with the middle two serving as filler cords
2. Take the left outer cord and place it over the filler cords and under the right outer cord
3. Take the right outer cord, bring it under the filler cords and through the loop created by the left cord
4. Pull tight
5. Repeat, starting from the right side

## Step-by-Step Instructions

1. **Prepare your dowel**: Sand if necessary and cut to desired length
2. **Cut your cords**: For a medium-sized wall hanging, cut 8-10 pieces of cord, each about 4 feet long
3. **Attach cords to dowel**: Use lark head knots to attach all cords to your dowel
4. **Create your design**: Alternate between square knots and other patterns to create your design
5. **Trim and style**: Once you have reached your desired length, trim the ends to create a neat fringe

## Variations and Ideas

- Add wooden beads between rows of knots
- Incorporate dyed cords for a colorful effect
- Use different thicknesses of cord for varied texture
- Add a second dowel at the bottom for a hanging shelf

## Conclusion

Macramé is a wonderfully meditative craft that allows for endless creativity. Do not be afraid to experiment with different knots and patterns as you become more comfortable with the technique. Happy knotting!', 
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
    '# 5 Essential Tools Every Crafting Beginner Should Have

## Introduction

Embarking on your crafting journey is exciting, but it can also be overwhelming when you see the vast array of tools available. To help you get started without breaking the bank, we have compiled a list of five essential tools that will serve you well across various crafting projects.

## 1. Quality Scissors Set

A good set of scissors is perhaps the most important tool in any crafter arsenal. We recommend investing in at least two pairs:

- **Fabric scissors**: Reserved exclusively for cutting fabric to keep them sharp
- **General crafting scissors**: For paper, cardboard, and other materials

Look for comfortable handles and stainless steel blades for longevity.

## 2. Precision Cutting Mat

A self-healing cutting mat protects your work surface and extends the life of your cutting tools. These mats typically have grid lines that help with measuring and making straight cuts. A medium-sized mat (18 x 24 inches) is versatile enough for most projects.

## 3. Reliable Measuring Tools

Accurate measurements are crucial for successful crafting. Essential measuring tools include:

- A clear ruler with visible markings
- A flexible measuring tape for curved surfaces
- A set square for perfect right angles

## 4. Adhesive Collection

Different projects require different types of adhesives:

- **PVA glue**: For paper, card, and general crafting
- **Fabric glue**: For textile projects
- **Hot glue gun**: For quick bonds and three-dimensional projects
- **Double-sided tape**: For clean paper crafting

## 5. Storage System

Start with a basic storage system to keep your tools organized and accessible. This could be as simple as:

- Clear containers for small items
- Pen holders for frequently used tools
- Drawer dividers to categorize supplies

As your collection grows, you can expand your storage solutions.

## Conclusion

Remember, it is better to invest in fewer, higher-quality tools than many inexpensive ones that might need replacing quickly. These five essentials will form the foundation of your crafting toolkit and serve you well as you develop your skills and explore different techniques.

At Charmntreats, we believe in setting up crafters for success. Check out our curated selection of high-quality crafting tools to start your journey right!', 
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
(1, 'Ananya Singh', 'ananya.singh@example.com', 'I recently purchased a dream catcher from your store and it is beautiful. This article makes me appreciate it even more.', true),
(2, 'Vikram Desai', 'vikram.d@example.com', 'I tried this tutorial over the weekend and it was so easy to follow! My wall hanging turned out great for a first attempt.', true),
(2, 'Priya Mehta', 'priya.m@example.com', 'Could you please suggest some places to buy quality macramé cord in India?', true),
(3, 'Deepak Sharma', 'deepak.s@example.com', 'Great list! I would also add a good pair of pliers for jewelry making and wire work.', true)
ON CONFLICT DO NOTHING;