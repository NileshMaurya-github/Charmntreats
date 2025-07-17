-- Simple demo products for Charmntreats
-- Copy and paste this into your Supabase SQL Editor

-- Clear existing products (optional)
DELETE FROM products;

-- Insert featured demo products
INSERT INTO products (name, description, price, category, catalog_number, images, in_stock, stock_quantity, featured, rating, reviews) VALUES
('Mystic Moon Dream Catcher', 'Handwoven dream catcher with natural feathers and moonstone beads. Perfect for peaceful sleep and positive energy.', 899, 'Dream Catcher', 'DC-001', '{"https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400"}', true, 15, true, 4.8, 24),
('Boho Feather Dream Catcher', 'Beautiful bohemian style dream catcher with colorful feathers and wooden beads.', 749, 'Dream Catcher', 'DC-002', '{"https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400"}', true, 20, true, 4.6, 18),
('Rainbow Macrame Dream Catcher', 'Vibrant rainbow colored dream catcher with intricate macrame work and soft feathers.', 1299, 'Dream Catcher', 'DC-003', '{"https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400"}', true, 8, false, 4.9, 32),

('Floral Hoop Embroidery Art', 'Beautiful hand-embroidered floral design on premium cotton fabric in wooden hoop.', 1299, 'Embroidery', 'EM-001', '{"https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=400"}', true, 18, true, 4.8, 35),
('Mandala Embroidery Wall Art', 'Intricate mandala pattern embroidered with colorful threads on linen fabric.', 1899, 'Embroidery', 'EM-002', '{"https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=400"}', true, 12, true, 4.9, 22),
('Vintage Rose Embroidery', 'Classic vintage rose design with French knots and satin stitch techniques.', 1599, 'Embroidery', 'EM-003', '{"https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=400"}', true, 15, false, 4.7, 28),

('Traditional Lippan Mirror Work', 'Authentic Kutchi Lippan art with intricate mirror work and mud relief patterns.', 2499, 'Lippan Arts', 'LA-001', '{"https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400"}', true, 12, true, 4.9, 26),
('Peacock Lippan Wall Art', 'Beautiful peacock design in traditional Lippan style with colorful mirrors.', 3299, 'Lippan Arts', 'LA-002', '{"https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400"}', true, 8, true, 5.0, 18),
('Elephant Motif Lippan Art', 'Majestic elephant design with traditional Gujarati Lippan work and mirror embellishments.', 2899, 'Lippan Arts', 'LA-003', '{"https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400"}', true, 10, false, 4.8, 21),

('Ocean Wave Resin Art', 'Stunning ocean wave design with blue and white resin creating realistic water effects.', 3499, 'Resin Art Work', 'RA-001', '{"https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400"}', true, 10, true, 4.9, 28),
('Galaxy Resin Coasters Set', 'Set of 4 galaxy-themed resin coasters with glitter and cosmic colors.', 899, 'Resin Art Work', 'RA-002', '{"https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400"}', true, 25, true, 4.7, 45),
('Flower Preservation Resin Art', 'Real flowers preserved in clear resin creating a timeless botanical display.', 2299, 'Resin Art Work', 'RA-003', '{"https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400"}', true, 15, false, 4.8, 32),

('Custom Portrait Illustration', 'Hand-drawn custom portrait in watercolor and ink, perfect for gifts.', 2999, 'Illustration', 'IL-001', '{"https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400"}', false, 0, true, 5.0, 42),
('Botanical Illustration Set', 'Set of 3 detailed botanical illustrations featuring native Indian plants.', 1899, 'Illustration', 'IL-002', '{"https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400"}', true, 12, true, 4.8, 29),
('Animal Kingdom Illustration', 'Whimsical animal illustrations perfect for children''s rooms and nurseries.', 1299, 'Illustration', 'IL-003', '{"https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400"}', true, 20, false, 4.9, 36),

('Lavender Soy Candle', 'Relaxing lavender scented soy candle in handcrafted ceramic holder.', 799, 'Candles', 'CA-001', '{"https://images.unsplash.com/photo-1602874801006-e26c2c9e8c5e?w=400"}', true, 25, true, 4.8, 52),
('Vanilla Bean Pillar Candle', 'Rich vanilla bean scented pillar candle with 40+ hour burn time.', 649, 'Candles', 'CA-002', '{"https://images.unsplash.com/photo-1602874801006-e26c2c9e8c5e?w=400"}', true, 30, true, 4.7, 38),
('Rose Garden Candle Set', 'Set of 3 rose scented candles in different sizes with floral decorations.', 1299, 'Candles', 'CA-003', '{"https://images.unsplash.com/photo-1602874801006-e26c2c9e8c5e?w=400"}', true, 18, false, 4.9, 41),

('Wedding Invitation Calligraphy', 'Elegant wedding invitation with custom calligraphy in gold ink.', 2499, 'Calligraphy', 'CL-001', '{"https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400"}', false, 0, true, 5.0, 23),
('Inspirational Quote Art', 'Beautiful inspirational quotes written in modern calligraphy style.', 1299, 'Calligraphy', 'CL-002', '{"https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400"}', true, 15, true, 4.8, 34),
('Arabic Calligraphy Art', 'Traditional Arabic calligraphy featuring verses and beautiful patterns.', 1899, 'Calligraphy', 'CL-003', '{"https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400"}', true, 12, false, 4.9, 19),

('Floral Hair Crown', 'Delicate floral hair crown with silk flowers and pearl accents.', 1299, 'Hair Accessories', 'HA-001', '{"https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=400"}', true, 20, true, 4.8, 38),
('Vintage Hair Pins Set', 'Set of 6 vintage-style hair pins with crystal and pearl decorations.', 899, 'Hair Accessories', 'HA-002', '{"https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=400"}', true, 30, true, 4.7, 45),
('Bridal Hair Comb', 'Elegant bridal hair comb with rhinestones and silver-plated base.', 1899, 'Hair Accessories', 'HA-003', '{"https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=400"}', true, 15, false, 4.9, 27),

('Handmade Soap Collection', 'Set of 4 natural handmade soaps with essential oils and organic ingredients.', 899, 'Others', 'OT-001', '{"https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400"}', true, 30, true, 4.7, 43),
('Macrame Plant Hanger', 'Beautiful macrame plant hanger perfect for indoor plants and home decor.', 1299, 'Others', 'OT-002', '{"https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400"}', true, 20, true, 4.8, 35),
('Ceramic Tea Set', 'Handcrafted ceramic tea set with teapot and 4 cups in traditional design.', 2499, 'Others', 'OT-003', '{"https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400"}', true, 12, false, 4.9, 22);