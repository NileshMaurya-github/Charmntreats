// Generate SQL INSERT statements for demo products

const productData = {
  'Dream Catcher': [
    {
      name: 'Mystic Moon Dream Catcher',
      description: 'Handwoven dream catcher with natural feathers and moonstone beads. Perfect for peaceful sleep and positive energy.',
      price: 899,
      images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400', 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600'],
      rating: 4.8,
      reviews: 24,
      stock_quantity: 15
    },
    {
      name: 'Boho Feather Dream Catcher',
      description: 'Beautiful bohemian style dream catcher with colorful feathers and wooden beads.',
      price: 749,
      images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400'],
      rating: 4.6,
      reviews: 18,
      stock_quantity: 20
    },
    {
      name: 'Rainbow Macrame Dream Catcher',
      description: 'Vibrant rainbow colored dream catcher with intricate macrame work and soft feathers.',
      price: 1299,
      images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400'],
      rating: 4.9,
      reviews: 32,
      stock_quantity: 8
    },
    {
      name: 'White Sage Dream Catcher',
      description: 'Traditional white dream catcher with sage cleansing properties and natural materials.',
      price: 649,
      images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400'],
      rating: 4.7,
      reviews: 15,
      stock_quantity: 25
    },
    {
      name: 'Golden Sun Dream Catcher',
      description: 'Elegant golden dream catcher with sun motifs and amber beads for positive energy.',
      price: 1099,
      images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400'],
      rating: 4.8,
      reviews: 21,
      stock_quantity: 12
    },
    {
      name: 'Mini Dream Catcher Set',
      description: 'Set of 3 mini dream catchers perfect for car decoration or small spaces.',
      price: 399,
      images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400'],
      rating: 4.5,
      reviews: 45,
      stock_quantity: 30
    },
    {
      name: 'Tribal Pattern Dream Catcher',
      description: 'Authentic tribal pattern dream catcher with traditional symbols and natural dyes.',
      price: 1499,
      images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400'],
      rating: 4.9,
      reviews: 12,
      stock_quantity: 6
    },
    {
      name: 'Crystal Healing Dream Catcher',
      description: 'Dream catcher embedded with healing crystals like amethyst and rose quartz.',
      price: 1799,
      images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400'],
      rating: 5.0,
      reviews: 8,
      stock_quantity: 5
    },
    {
      name: 'Owl Feather Dream Catcher',
      description: 'Unique dream catcher featuring authentic owl feathers and woodland elements.',
      price: 999,
      images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400'],
      rating: 4.7,
      reviews: 19,
      stock_quantity: 10
    },
    {
      name: 'LED Light Dream Catcher',
      description: 'Modern dream catcher with built-in LED lights for a magical nighttime glow.',
      price: 1599,
      images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400'],
      rating: 4.6,
      reviews: 27,
      stock_quantity: 14
    }
  ],
  'Embroidery': [
    {
      name: 'Floral Hoop Embroidery Art',
      description: 'Beautiful hand-embroidered floral design on premium cotton fabric in wooden hoop.',
      price: 1299,
      images: ['https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=400'],
      rating: 4.8,
      reviews: 35,
      stock_quantity: 18
    },
    {
      name: 'Mandala Embroidery Wall Art',
      description: 'Intricate mandala pattern embroidered with colorful threads on linen fabric.',
      price: 1899,
      images: ['https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=400'],
      rating: 4.9,
      reviews: 22,
      stock_quantity: 12
    },
    {
      name: 'Vintage Rose Embroidery',
      description: 'Classic vintage rose design with French knots and satin stitch techniques.',
      price: 1599,
      images: ['https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=400'],
      rating: 4.7,
      reviews: 28,
      stock_quantity: 15
    },
    {
      name: 'Modern Geometric Embroidery',
      description: 'Contemporary geometric patterns embroidered with metallic threads.',
      price: 1799,
      images: ['https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=400'],
      rating: 4.6,
      reviews: 16,
      stock_quantity: 10
    },
    {
      name: 'Bird Paradise Embroidery',
      description: 'Colorful tropical birds embroidered with detailed feather work and beading.',
      price: 2299,
      images: ['https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=400'],
      rating: 5.0,
      reviews: 14,
      stock_quantity: 8
    },
    {
      name: 'Botanical Leaf Embroidery',
      description: 'Realistic botanical leaves embroidered with various green shades and textures.',
      price: 1399,
      images: ['https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=400'],
      rating: 4.8,
      reviews: 31,
      stock_quantity: 20
    },
    {
      name: 'Quote Embroidery Art',
      description: 'Inspirational quotes beautifully embroidered with decorative borders.',
      price: 999,
      images: ['https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=400'],
      rating: 4.5,
      reviews: 42,
      stock_quantity: 25
    },
    {
      name: 'Sunset Landscape Embroidery',
      description: 'Scenic sunset landscape embroidered with gradient threads and texture work.',
      price: 2599,
      images: ['https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=400'],
      rating: 4.9,
      reviews: 11,
      stock_quantity: 6
    },
    {
      name: 'Butterfly Garden Embroidery',
      description: 'Delicate butterflies and flowers embroidered with silk threads and beads.',
      price: 1999,
      images: ['https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=400'],
      rating: 4.8,
      reviews: 19,
      stock_quantity: 13
    },
    {
      name: 'Abstract Art Embroidery',
      description: 'Modern abstract design embroidered with mixed media and unconventional techniques.',
      price: 2199,
      images: ['https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=400'],
      rating: 4.7,
      reviews: 17,
      stock_quantity: 9
    }
  ],
  'Lippan Arts': [
    {
      name: 'Traditional Lippan Mirror Work',
      description: 'Authentic Kutchi Lippan art with intricate mirror work and mud relief patterns.',
      price: 2499,
      images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400'],
      rating: 4.9,
      reviews: 26,
      stock_quantity: 12
    },
    {
      name: 'Peacock Lippan Wall Art',
      description: 'Beautiful peacock design in traditional Lippan style with colorful mirrors.',
      price: 3299,
      images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400'],
      rating: 5.0,
      reviews: 18,
      stock_quantity: 8
    },
    {
      name: 'Elephant Motif Lippan Art',
      description: 'Majestic elephant design with traditional Gujarati Lippan work and mirror embellishments.',
      price: 2899,
      images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400'],
      rating: 4.8,
      reviews: 21,
      stock_quantity: 10
    },
    {
      name: 'Floral Lippan Panel',
      description: 'Delicate floral patterns in Lippan art with small mirrors and natural pigments.',
      price: 1999,
      images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400'],
      rating: 4.7,
      reviews: 33,
      stock_quantity: 15
    },
    {
      name: 'Mandala Lippan Creation',
      description: 'Intricate mandala design combining Lippan mud work with mirror mosaic.',
      price: 2799,
      images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400'],
      rating: 4.9,
      reviews: 15,
      stock_quantity: 9
    },
    {
      name: 'Village Scene Lippan Art',
      description: 'Traditional village life depicted in authentic Lippan art style.',
      price: 3599,
      images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400'],
      rating: 5.0,
      reviews: 12,
      stock_quantity: 6
    },
    {
      name: 'Camel Caravan Lippan Work',
      description: 'Desert camel caravan scene crafted in traditional Lippan technique.',
      price: 3199,
      images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400'],
      rating: 4.8,
      reviews: 14,
      stock_quantity: 7
    },
    {
      name: 'Tree of Life Lippan Art',
      description: 'Symbolic tree of life design with intricate Lippan work and mirror details.',
      price: 2699,
      images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400'],
      rating: 4.9,
      reviews: 19,
      stock_quantity: 11
    },
    {
      name: 'Geometric Lippan Pattern',
      description: 'Modern geometric interpretation of traditional Lippan art with contemporary appeal.',
      price: 2299,
      images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400'],
      rating: 4.6,
      reviews: 24,
      stock_quantity: 13
    },
    {
      name: 'Bridal Lippan Wall Hanging',
      description: 'Elaborate bridal themed Lippan art perfect for wedding decorations.',
      price: 4299,
      images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400'],
      rating: 5.0,
      reviews: 9,
      stock_quantity: 5
    }
  ],
  'Resin Art Work': [
    {
      name: 'Ocean Wave Resin Art',
      description: 'Stunning ocean wave design with blue and white resin creating realistic water effects.',
      price: 3499,
      images: ['https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400'],
      rating: 4.9,
      reviews: 28,
      stock_quantity: 10
    },
    {
      name: 'Galaxy Resin Coasters Set',
      description: 'Set of 4 galaxy-themed resin coasters with glitter and cosmic colors.',
      price: 899,
      images: ['https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400'],
      rating: 4.7,
      reviews: 45,
      stock_quantity: 25
    },
    {
      name: 'Flower Preservation Resin Art',
      description: 'Real flowers preserved in clear resin creating a timeless botanical display.',
      price: 2299,
      images: ['https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400'],
      rating: 4.8,
      reviews: 32,
      stock_quantity: 15
    },
    {
      name: 'Abstract Fluid Resin Painting',
      description: 'Dynamic abstract art created with fluid resin techniques and metallic pigments.',
      price: 4299,
      images: ['https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400'],
      rating: 5.0,
      reviews: 16,
      stock_quantity: 8
    },
    {
      name: 'Geode Resin Wall Art',
      description: 'Stunning geode-inspired resin art with gold leaf and crystal-like formations.',
      price: 3899,
      images: ['https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400'],
      rating: 4.9,
      reviews: 21,
      stock_quantity: 9
    },
    {
      name: 'Resin River Table Top',
      description: 'Beautiful live edge wood with blue resin river running through the center.',
      price: 12999,
      images: ['https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400'],
      rating: 5.0,
      reviews: 7,
      stock_quantity: 3
    },
    {
      name: 'Sunset Resin Clock',
      description: 'Functional wall clock with beautiful sunset resin art as the face.',
      price: 2799,
      images: ['https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400'],
      rating: 4.8,
      reviews: 19,
      stock_quantity: 12
    },
    {
      name: 'Marble Effect Resin Tray',
      description: 'Elegant serving tray with marble-like resin finish and gold accents.',
      price: 1599,
      images: ['https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400'],
      rating: 4.6,
      reviews: 38,
      stock_quantity: 18
    },
    {
      name: 'Resin Jewelry Box',
      description: 'Handcrafted jewelry box with colorful resin lid and velvet interior.',
      price: 2199,
      images: ['https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400'],
      rating: 4.7,
      reviews: 24,
      stock_quantity: 14
    },
    {
      name: 'Fire and Ice Resin Art',
      description: 'Dramatic resin artwork combining warm and cool colors in an abstract design.',
      price: 3799,
      images: ['https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400'],
      rating: 4.9,
      reviews: 13,
      stock_quantity: 7
    }
  ],
  'Illustration': [
    {
      name: 'Custom Portrait Illustration',
      description: 'Hand-drawn custom portrait in watercolor and ink, perfect for gifts.',
      price: 2999,
      images: ['https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400'],
      rating: 5.0,
      reviews: 42,
      stock_quantity: 0
    },
    {
      name: 'Botanical Illustration Set',
      description: 'Set of 3 detailed botanical illustrations featuring native Indian plants.',
      price: 1899,
      images: ['https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400'],
      rating: 4.8,
      reviews: 29,
      stock_quantity: 12
    },
    {
      name: 'Animal Kingdom Illustration',
      description: 'Whimsical animal illustrations perfect for children\'s rooms and nurseries.',
      price: 1299,
      images: ['https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400'],
      rating: 4.9,
      reviews: 36,
      stock_quantity: 20
    },
    {
      name: 'Mandala Art Illustration',
      description: 'Intricate mandala designs hand-drawn with fine liner pens and colored pencils.',
      price: 1599,
      images: ['https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400'],
      rating: 4.7,
      reviews: 31,
      stock_quantity: 15
    },
    {
      name: 'Fantasy Character Illustration',
      description: 'Original fantasy character designs with detailed backgrounds and storytelling.',
      price: 3499,
      images: ['https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400'],
      rating: 5.0,
      reviews: 18,
      stock_quantity: 8
    },
    {
      name: 'Cityscape Illustration',
      description: 'Urban cityscape illustrations capturing the essence of metropolitan life.',
      price: 2299,
      images: ['https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400'],
      rating: 4.6,
      reviews: 22,
      stock_quantity: 11
    },
    {
      name: 'Food Illustration Collection',
      description: 'Delicious food illustrations perfect for kitchen decor and restaurants.',
      price: 1799,
      images: ['https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400'],
      rating: 4.8,
      reviews: 27,
      stock_quantity: 16
    },
    {
      name: 'Vintage Travel Poster',
      description: 'Retro-style travel poster illustrations featuring famous Indian landmarks.',
      price: 2199,
      images: ['https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400'],
      rating: 4.9,
      reviews: 24,
      stock_quantity: 9
    },
    {
      name: 'Minimalist Line Art',
      description: 'Clean and simple line art illustrations with modern aesthetic appeal.',
      price: 999,
      images: ['https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400'],
      rating: 4.5,
      reviews: 48,
      stock_quantity: 30
    },
    {
      name: 'Mythology Illustration Series',
      description: 'Indian mythology characters illustrated in contemporary artistic style.',
      price: 2799,
      images: ['https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400'],
      rating: 5.0,
      reviews: 15,
      stock_quantity: 6
    }
  ],
  'Candles': [
    {
      name: 'Lavender Soy Candle',
      description: 'Relaxing lavender scented soy candle in handcrafted ceramic holder.',
      price: 799,
      images: ['https://images.unsplash.com/photo-1602874801006-e26c2c9e8c5e?w=400'],
      rating: 4.8,
      reviews: 52,
      stock_quantity: 25
    },
    {
      name: 'Vanilla Bean Pillar Candle',
      description: 'Rich vanilla bean scented pillar candle with 40+ hour burn time.',
      price: 649,
      images: ['https://images.unsplash.com/photo-1602874801006-e26c2c9e8c5e?w=400'],
      rating: 4.7,
      reviews: 38,
      stock_quantity: 30
    },
    {
      name: 'Rose Garden Candle Set',
      description: 'Set of 3 rose scented candles in different sizes with floral decorations.',
      price: 1299,
      images: ['https://images.unsplash.com/photo-1602874801006-e26c2c9e8c5e?w=400'],
      rating: 4.9,
      reviews: 41,
      stock_quantity: 18
    },
    {
      name: 'Sandalwood Meditation Candle',
      description: 'Pure sandalwood candle perfect for meditation and spiritual practices.',
      price: 899,
      images: ['https://images.unsplash.com/photo-1602874801006-e26c2c9e8c5e?w=400'],
      rating: 5.0,
      reviews: 33,
      stock_quantity: 20
    },
    {
      name: 'Citrus Burst Candle',
      description: 'Energizing citrus blend candle with orange, lemon, and grapefruit oils.',
      price: 749,
      images: ['https://images.unsplash.com/photo-1602874801006-e26c2c9e8c5e?w=400'],
      rating: 4.6,
      reviews: 29,
      stock_quantity: 22
    },
    {
      name: 'Eucalyptus Spa Candle',
      description: 'Refreshing eucalyptus candle for spa-like relaxation at home.',
      price: 849,
      images: ['https://images.unsplash.com/photo-1602874801006-e26c2c9e8c5e?w=400'],
      rating: 4.8,
      reviews: 35,
      stock_quantity: 19
    },
    {
      name: 'Cinnamon Spice Candle',
      description: 'Warm cinnamon spice candle perfect for cozy winter evenings.',
      price: 699,
      images: ['https://images.unsplash.com/photo-1602874801006-e26c2c9e8c5e?w=400'],
      rating: 4.7,
      reviews: 26,
      stock_quantity: 24
    },
    {
      name: 'Ocean Breeze Candle',
      description: 'Fresh ocean breeze scented candle that brings coastal vibes indoors.',
      price: 799,
      images: ['https://images.unsplash.com/photo-1602874801006-e26c2c9e8c5e?w=400'],
      rating: 4.5,
      reviews: 31,
      stock_quantity: 21
    },
    {
      name: 'Jasmine Night Candle',
      description: 'Exotic jasmine scented candle for romantic and peaceful evenings.',
      price: 949,
      images: ['https://images.unsplash.com/photo-1602874801006-e26c2c9e8c5e?w=400'],
      rating: 4.9,
      reviews: 28,
      stock_quantity: 16
    },
    {
      name: 'Coffee Bean Candle',
      description: 'Rich coffee bean scented candle for coffee lovers and cozy mornings.',
      price: 849,
      images: ['https://images.unsplash.com/photo-1602874801006-e26c2c9e8c5e?w=400'],
      rating: 4.8,
      reviews: 37,
      stock_quantity: 17
    }
  ],
  'Calligraphy': [
    {
      name: 'Wedding Invitation Calligraphy',
      description: 'Elegant wedding invitation with custom calligraphy in gold ink.',
      price: 2499,
      images: ['https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400'],
      rating: 5.0,
      reviews: 23,
      stock_quantity: 0
    },
    {
      name: 'Inspirational Quote Art',
      description: 'Beautiful inspirational quotes written in modern calligraphy style.',
      price: 1299,
      images: ['https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400'],
      rating: 4.8,
      reviews: 34,
      stock_quantity: 15
    },
    {
      name: 'Arabic Calligraphy Art',
      description: 'Traditional Arabic calligraphy featuring verses and beautiful patterns.',
      price: 1899,
      images: ['https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400'],
      rating: 4.9,
      reviews: 19,
      stock_quantity: 12
    },
    {
      name: 'Name Personalization Art',
      description: 'Custom name calligraphy perfect for nursery decor and personal gifts.',
      price: 999,
      images: ['https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400'],
      rating: 4.7,
      reviews: 46,
      stock_quantity: 25
    },
    {
      name: 'Sanskrit Mantra Calligraphy',
      description: 'Sacred Sanskrit mantras written in traditional Devanagari script.',
      price: 1599,
      images: ['https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400'],
      rating: 5.0,
      reviews: 17,
      stock_quantity: 10
    },
    {
      name: 'Modern Brush Lettering',
      description: 'Contemporary brush lettering art with vibrant colors and modern style.',
      price: 1199,
      images: ['https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400'],
      rating: 4.6,
      reviews: 28,
      stock_quantity: 18
    },
    {
      name: 'Vintage Calligraphy Certificate',
      description: 'Vintage style calligraphy certificates for special occasions and awards.',
      price: 1799,
      images: ['https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400'],
      rating: 4.8,
      reviews: 21,
      stock_quantity: 8
    },
    {
      name: 'Love Letter Calligraphy',
      description: 'Romantic love letters written in beautiful calligraphy for special occasions.',
      price: 1399,
      images: ['https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400'],
      rating: 4.9,
      reviews: 25,
      stock_quantity: 14
    },
    {
      name: 'Business Logo Calligraphy',
      description: 'Custom business logos and branding elements in elegant calligraphy style.',
      price: 2999,
      images: ['https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400'],
      rating: 5.0,
      reviews: 12,
      stock_quantity: 0
    },
    {
      name: 'Poetry Calligraphy Art',
      description: 'Beautiful poetry and verses written in artistic calligraphy with decorative borders.',
      price: 1699,
      images: ['https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400'],
      rating: 4.8,
      reviews: 22,
      stock_quantity: 11
    }
  ],
  'Hair Accessories': [
    {
      name: 'Floral Hair Crown',
      description: 'Delicate floral hair crown with silk flowers and pearl accents.',
      price: 1299,
      images: ['https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=400'],
      rating: 4.8,
      reviews: 38,
      stock_quantity: 20
    },
    {
      name: 'Vintage Hair Pins Set',
      description: 'Set of 6 vintage-style hair pins with crystal and pearl decorations.',
      price: 899,
      images: ['https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=400'],
      rating: 4.7,
      reviews: 45,
      stock_quantity: 30
    },
    {
      name: 'Bridal Hair Comb',
      description: 'Elegant bridal hair comb with rhinestones and silver-plated base.',
      price: 1899,
      images: ['https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=400'],
      rating: 4.9,
      reviews: 27,
      stock_quantity: 15
    },
    {
      name: 'Bohemian Headband',
      description: 'Boho-style headband with feathers, beads, and natural elements.',
      price: 749,
      images: ['https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=400'],
      rating: 4.6,
      reviews: 32,
      stock_quantity: 25
    },
    {
      name: 'Pearl Hair Barrette',
      description: 'Classic pearl hair barrette perfect for formal occasions and daily wear.',
      price: 649,
      images: ['https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=400'],
      rating: 4.5,
      reviews: 41,
      stock_quantity: 35
    },
    {
      name: 'Butterfly Hair Clips',
      description: 'Set of 4 colorful butterfly hair clips with enamel finish.',
      price: 499,
      images: ['https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=400'],
      rating: 4.4,
      reviews: 52,
      stock_quantity: 40
    },
    {
      name: 'Gold Leaf Hair Vine',
      description: 'Delicate gold leaf hair vine perfect for weddings and special events.',
      price: 1599,
      images: ['https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=400'],
      rating: 5.0,
      reviews: 19,
      stock_quantity: 12
    },
    {
      name: 'Silk Scrunchie Set',
      description: 'Set of 3 pure silk scrunchies in different colors, gentle on hair.',
      price: 799,
      images: ['https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=400'],
      rating: 4.8,
      reviews: 36,
      stock_quantity: 28
    },
    {
      name: 'Crystal Hair Tiara',
      description: 'Sparkling crystal tiara perfect for proms, weddings, and special occasions.',
      price: 2299,
      images: ['https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=400'],
      rating: 4.9,
      reviews: 16,
      stock_quantity: 8
    },
    {
      name: 'Wooden Hair Stick',
      description: 'Handcrafted wooden hair stick with carved patterns and natural finish.',
      price: 599,
      images: ['https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=400'],
      rating: 4.6,
      reviews: 29,
      stock_quantity: 22
    }
  ],
  'Others': [
    {
      name: 'Handmade Soap Collection',
      description: 'Set of 4 natural handmade soaps with essential oils and organic ingredients.',
      price: 899,
      images: ['https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400'],
      rating: 4.7,
      reviews: 43,
      stock_quantity: 30
    },
    {
      name: 'Macrame Plant Hanger',
      description: 'Beautiful macrame plant hanger perfect for indoor plants and home decor.',
      price: 1299,
      images: ['https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400'],
      rating: 4.8,
      reviews: 35,
      stock_quantity: 20
    },
    {
      name: 'Ceramic Tea Set',
      description: 'Handcrafted ceramic tea set with teapot and 4 cups in traditional design.',
      price: 2499,
      images: ['https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400'],
      rating: 4.9,
      reviews: 22,
      stock_quantity: 12
    },
    {
      name: 'Wooden Jewelry Box',
      description: 'Handcrafted wooden jewelry box with multiple compartments and mirror.',
      price: 1899,
      images: ['https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400'],
      rating: 4.6,
      reviews: 28,
      stock_quantity: 15
    },
    {
      name: 'Bamboo Wind Chimes',
      description: 'Natural bamboo wind chimes creating soothing sounds for outdoor spaces.',
      price: 799,
      images: ['https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400'],
      rating: 4.5,
      reviews: 39,
      stock_quantity: 25
    },
    {
      name: 'Leather Journal',
      description: 'Handbound leather journal with handmade paper, perfect for writing and sketching.',
      price: 1599,
      images: ['https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400'],
      rating: 4.8,
      reviews: 31,
      stock_quantity: 18
    },
    {
      name: 'Terracotta Planters Set',
      description: 'Set of 3 handmade terracotta planters with drainage holes and saucers.',
      price: 1199,
      images: ['https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400'],
      rating: 4.7,
      reviews: 26,
      stock_quantity: 22
    },
    {
      name: 'Handwoven Basket',
      description: 'Traditional handwoven basket perfect for storage and home organization.',
      price: 999,
      images: ['https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400'],
      rating: 4.6,
      reviews: 33,
      stock_quantity: 19
    },
    {
      name: 'Copper Water Bottle',
      description: 'Pure copper water bottle with health benefits and elegant design.',
      price: 1399,
      images: ['https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400'],
      rating: 4.8,
      reviews: 24,
      stock_quantity: 16
    },
    {
      name: 'Incense Holder Set',
      description: 'Beautiful incense holder set with natural stone base and wooden accents.',
      price: 699,
      images: ['https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400'],
      rating: 4.5,
      reviews: 37,
      stock_quantity: 28
    }
  ]
};

function escapeString(str) {
  return str.replace(/'/g, "''");
}

function generateSQL() {
  console.log('-- SQL INSERT statements for Charmntreats demo products');
  console.log('-- Run these in your Supabase SQL editor');
  console.log('');
  console.log('-- Clear existing products (optional)');
  console.log('DELETE FROM products;');
  console.log('');
  console.log('-- Insert demo products');
  
  for (const [category, products] of Object.entries(productData)) {
    console.log(`\n-- ${category} products`);
    
    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      const catalogNumber = `${category.replace(/\s+/g, '').toUpperCase()}-${String(i + 1).padStart(3, '0')}`;
      const featured = Math.random() > 0.7 ? 'true' : 'false';
      const imagesArray = `{${product.images.map(img => `"${img}"`).join(',')}}`;
      
      const sql = `INSERT INTO products (
  name, 
  description, 
  price, 
  category, 
  catalog_number, 
  images, 
  in_stock, 
  stock_quantity, 
  featured, 
  rating, 
  reviews
) VALUES (
  '${escapeString(product.name)}',
  '${escapeString(product.description)}',
  ${product.price},
  '${category}',
  '${catalogNumber}',
  '${imagesArray}',
  ${product.stock_quantity > 0},
  ${product.stock_quantity},
  ${featured},
  ${product.rating},
  ${product.reviews}
);`;
      
      console.log(sql);
    }
  }
  
  console.log('\n-- Summary');
  console.log(`-- Total products: ${Object.values(productData).reduce((sum, products) => sum + products.length, 0)}`);
  Object.keys(productData).forEach(category => {
    console.log(`-- ${category}: ${productData[category].length} products`);
  });
}

generateSQL();