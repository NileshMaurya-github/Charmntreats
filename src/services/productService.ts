import { Product } from '@/types/product';

// Rich product database with beautiful handcrafted items and real images
export const PRODUCTS_DATABASE: Product[] = [
  // Dream Catchers
  {
    id: 'dc-001',
    name: 'Mystic Moon Dream Catcher',
    description: 'Handwoven dream catcher with genuine feathers, moonstone beads, and silver accents. Protects your dreams and brings peaceful sleep with its ethereal beauty.',
    price: 1299,
    category: 'Dream Catcher',
    images: [
      'https://images.unsplash.com/photo-1583225173442-9bdb73e83c27?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1618225214889-c7b61ba6eab5?w=600&h=600&fit=crop'
    ],
    catalogNumber: 'DC-MOON-001',
    in_stock: true,
    stock_quantity: 12,
    featured: true,
    rating: 4.9,
    reviews: 24,
    tags: ['handmade', 'spiritual', 'bedroom', 'gift'],
    materials: ['Cotton thread', 'Natural feathers', 'Moonstone', 'Silver wire'],
    size: '25cm diameter',
    care_instructions: 'Dust gently with soft brush. Keep away from direct sunlight.'
  },
  {
    id: 'dc-002',
    name: 'Boho Sunset Dream Catcher',
    description: 'Vibrant dream catcher featuring warm sunset colors, macrame details, and cascading tassels. Perfect for adding bohemian charm to any space.',
    price: 899,
    category: 'Dream Catcher',
    images: [
      'https://images.unsplash.com/photo-1618225230010-1848c5c49d93?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1583225173442-9bdb73e83c27?w=600&h=600&fit=crop'
    ],
    catalogNumber: 'DC-BOHO-002',
    in_stock: true,
    stock_quantity: 8,
    featured: false,
    rating: 4.7,
    reviews: 18,
    tags: ['boho', 'colorful', 'macrame', 'wall-decor'],
    materials: ['Macrame cord', 'Dyed feathers', 'Wooden beads'],
    size: '20cm diameter',
    care_instructions: 'Gentle hand wash if needed. Air dry completely.'
  },
  {
    id: 'dc-003',
    name: 'Celestial Stars Dream Catcher',
    description: 'Magical dream catcher adorned with star charms, crystal beads, and silver moon. Captures dreams under the night sky.',
    price: 1099,
    category: 'Dream Catcher',
    images: [
      'https://images.unsplash.com/photo-1583225173442-9bdb73e83c27?w=600&h=600&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1618225230010-1848c5c49d93?w=600&h=600&fit=crop&auto=format'
    ],
    catalogNumber: 'DC-STAR-003',
    in_stock: true,
    stock_quantity: 10,
    featured: false,
    rating: 4.8,
    reviews: 15,
    tags: ['celestial', 'stars', 'spiritual', 'bedroom'],
    materials: ['Cotton thread', 'Crystal beads', 'Metal charms'],
    size: '22cm diameter',
    care_instructions: 'Keep dry. Dust with soft cloth.'
  },
  {
    id: 'dc-004',
    name: 'Rainbow Feather Dream Catcher',
    description: 'Vibrant rainbow-colored dream catcher with multicolor feathers and beads. Brings joy and positive energy.',
    price: 849,
    category: 'Dream Catcher',
    images: [
      'https://images.unsplash.com/photo-1618225214889-c7b61ba6eab5?w=600&h=600&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=600&h=600&fit=crop&auto=format'
    ],
    catalogNumber: 'DC-RAIN-004',
    in_stock: true,
    stock_quantity: 14,
    featured: true,
    rating: 4.6,
    reviews: 20,
    tags: ['rainbow', 'colorful', 'kids', 'cheerful'],
    materials: ['Dyed feathers', 'Colorful beads', 'Cotton thread'],
    size: '18cm diameter',
    care_instructions: 'Avoid direct sunlight to prevent fading.'
  },
  {
    id: 'dc-005',
    name: 'Mandala Dream Catcher',
    description: 'Intricate mandala pattern woven with precision and patience. Perfect for meditation spaces.',
    price: 1499,
    category: 'Dream Catcher',
    images: [
      'https://images.unsplash.com/photo-1583225173442-9bdb73e83c27?w=600&h=600&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1618225230010-1848c5c49d93?w=600&h=600&fit=crop&auto=format'
    ],
    catalogNumber: 'DC-MAND-005',
    in_stock: true,
    stock_quantity: 7,
    featured: false,
    rating: 5.0,
    reviews: 19,
    tags: ['mandala', 'meditation', 'spiritual', 'intricate'],
    materials: ['Fine cotton thread', 'Natural feathers', 'Wooden beads'],
    size: '28cm diameter',
    care_instructions: 'Handle with care. Dust gently.'
  },
  {
    id: 'dc-006',
    name: 'Triple Hoop Dream Catcher',
    description: 'Unique triple-layered dream catcher with cascading hoops and feathers. Makes a stunning statement piece.',
    price: 1799,
    category: 'Dream Catcher',
    images: [
      'https://images.unsplash.com/photo-1618225214889-c7b61ba6eab5?w=600&h=600&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1583225173442-9bdb73e83c27?w=600&h=600&fit=crop&auto=format'
    ],
    catalogNumber: 'DC-TRIP-006',
    in_stock: true,
    stock_quantity: 5,
    featured: true,
    rating: 4.9,
    reviews: 22,
    tags: ['triple-hoop', 'statement', 'large', 'dramatic'],
    materials: ['Multiple hoops', 'Long feathers', 'Macrame cord'],
    size: '35cm x 80cm',
    care_instructions: 'Hang securely. Avoid humid areas.'
  },
  {
    id: 'dc-007',
    name: 'Mini Dream Catcher Set',
    description: 'Set of 3 adorable mini dream catchers perfect for car mirrors, small spaces, or gifts.',
    price: 599,
    category: 'Dream Catcher',
    images: [
      'https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=600&h=600&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1618225230010-1848c5c49d93?w=600&h=600&fit=crop&auto=format'
    ],
    catalogNumber: 'DC-MINI-007',
    in_stock: true,
    stock_quantity: 25,
    featured: false,
    rating: 4.5,
    reviews: 30,
    tags: ['mini', 'set', 'car', 'gift'],
    materials: ['Small hoops', 'Mini feathers', 'Colorful thread'],
    size: '8cm diameter each',
    care_instructions: 'Perfect for car mirrors and small spaces.'
  },
  {
    id: 'dc-008',
    name: 'Heart Shaped Dream Catcher',
    description: 'Romantic heart-shaped dream catcher with pink and white feathers. Perfect for expressing love.',
    price: 949,
    category: 'Dream Catcher',
    images: [
      'https://images.unsplash.com/photo-1583225173442-9bdb73e83c27?w=600&h=600&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1618225214889-c7b61ba6eab5?w=600&h=600&fit=crop&auto=format'
    ],
    catalogNumber: 'DC-HEART-008',
    in_stock: true,
    stock_quantity: 11,
    featured: false,
    rating: 4.7,
    reviews: 16,
    tags: ['heart', 'romantic', 'love', 'valentine'],
    materials: ['Heart-shaped hoop', 'Pink feathers', 'Pearl beads'],
    size: '20cm x 18cm',
    care_instructions: 'Handle gently to maintain shape.'
  },
  {
    id: 'dc-009',
    name: 'Peacock Feather Dream Catcher',
    description: 'Luxurious dream catcher featuring authentic peacock feathers and turquoise beads.',
    price: 1699,
    category: 'Dream Catcher',
    images: [
      'https://images.unsplash.com/photo-1618225230010-1848c5c49d93?w=600&h=600&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1583225173442-9bdb73e83c27?w=600&h=600&fit=crop&auto=format'
    ],
    catalogNumber: 'DC-PCOCK-009',
    in_stock: true,
    stock_quantity: 6,
    featured: true,
    rating: 5.0,
    reviews: 14,
    tags: ['peacock', 'luxury', 'turquoise', 'elegant'],
    materials: ['Peacock feathers', 'Turquoise beads', 'Gold accents'],
    size: '30cm diameter',
    care_instructions: 'Premium feathers - keep in dry area.'
  },
  {
    id: 'dc-010',
    name: 'Minimalist White Dream Catcher',
    description: 'Clean and simple all-white dream catcher perfect for modern minimalist interiors.',
    price: 749,
    category: 'Dream Catcher',
    images: [
      'https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=600&h=600&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1618225214889-c7b61ba6eab5?w=600&h=600&fit=crop&auto=format'
    ],
    catalogNumber: 'DC-MIN-010',
    in_stock: true,
    stock_quantity: 18,
    featured: false,
    rating: 4.6,
    reviews: 21,
    tags: ['minimalist', 'white', 'modern', 'simple'],
    materials: ['White cotton thread', 'White feathers', 'Natural wood'],
    size: '24cm diameter',
    care_instructions: 'Keep away from dust and dirt.'
  },

  // Embroidery
  {
    id: 'emb-001',
    name: 'Botanical Garden Hoop Art',
    description: 'Exquisite hand-embroidered botanical design featuring delicate flowers, leaves, and vines. Each stitch tells a story of nature\'s beauty.',
    price: 1599,
    category: 'Embroidery',
    images: [
      'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1515405295579-ba7b45403062?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1611605645802-c21be743c321?w=600&h=600&fit=crop'
    ],
    catalogNumber: 'EMB-BOT-001',
    in_stock: true,
    stock_quantity: 15,
    featured: true,
    rating: 5.0,
    reviews: 32,
    tags: ['botanical', 'wall-art', 'handstitched', 'nature'],
    materials: ['Cotton fabric', 'Embroidery thread', 'Wooden hoop'],
    size: '30cm hoop',
    care_instructions: 'Frame under glass to protect. Avoid direct sunlight.'
  },
  {
    id: 'emb-002',
    name: 'Vintage Rose Cushion Cover',
    description: 'Romantic cushion cover with hand-embroidered vintage roses in soft pastels. Adds elegance and comfort to your living space.',
    price: 799,
    category: 'Embroidery',
    images: [
      'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1616627781431-00abe0a4c1cf?w=600&h=600&fit=crop'
    ],
    catalogNumber: 'EMB-ROSE-002',
    in_stock: true,
    stock_quantity: 20,
    featured: false,
    rating: 4.8,
    reviews: 27,
    tags: ['vintage', 'roses', 'cushion', 'home-decor'],
    materials: ['Linen fabric', 'Silk thread', 'Hidden zipper'],
    size: '40x40cm',
    care_instructions: 'Dry clean only to preserve embroidery.'
  },
  {
    id: 'emb-003',
    name: 'Peacock Embroidered Wall Hanging',
    description: 'Majestic peacock design with colorful thread work and sequin details. A stunning focal point.',
    price: 1899,
    category: 'Embroidery',
    images: [
      'https://images.unsplash.com/photo-1515405295579-ba7b45403062?w=600&h=600&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=600&h=600&fit=crop&auto=format'
    ],
    catalogNumber: 'EMB-PCOCK-003',
    in_stock: true,
    stock_quantity: 8,
    featured: true,
    rating: 4.9,
    reviews: 25,
    tags: ['peacock', 'wall-hanging', 'colorful', 'decorative'],
    materials: ['Velvet fabric', 'Silk thread', 'Sequins', 'Beads'],
    size: '45x60cm',
    care_instructions: 'Professional dry clean recommended.'
  },
  {
    id: 'emb-004',
    name: 'Floral Table Runner',
    description: 'Elegant table runner with hand-embroidered floral borders. Perfect for dining tables.',
    price: 1299,
    category: 'Embroidery',
    images: [
      'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=600&h=600&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1611605645802-c21be743c321?w=600&h=600&fit=crop&auto=format'
    ],
    catalogNumber: 'EMB-TABLE-004',
    in_stock: true,
    stock_quantity: 12,
    featured: false,
    rating: 4.7,
    reviews: 18,
    tags: ['table-runner', 'dining', 'floral', 'home-decor'],
    materials: ['Cotton linen', 'Embroidery thread', 'Tassels'],
    size: '40x150cm',
    care_instructions: 'Hand wash cold. Iron on reverse side.'
  },
  {
    id: 'emb-005',
    name: 'Butterfly Garden Hoop',
    description: 'Whimsical butterfly and flower design in vibrant colors. Brings spring indoors year-round.',
    price: 899,
    category: 'Embroidery',
    images: [
      'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=600&h=600&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1515405295579-ba7b45403062?w=600&h=600&fit=crop&auto=format'
    ],
    catalogNumber: 'EMB-BUTT-005',
    in_stock: true,
    stock_quantity: 15,
    featured: false,
    rating: 4.8,
    reviews: 22,
    tags: ['butterfly', 'spring', 'colorful', 'nature'],
    materials: ['Cotton fabric', 'DMC thread', 'Wooden hoop'],
    size: '25cm hoop',
    care_instructions: 'Keep away from moisture.'
  },
  {
    id: 'emb-006',
    name: 'Monogram Pillow Cover',
    description: 'Personalized pillow cover with elegant embroidered monogram. Makes a thoughtful gift.',
    price: 699,
    category: 'Embroidery',
    images: [
      'https://images.unsplash.com/photo-1616627781431-00abe0a4c1cf?w=600&h=600&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=600&h=600&fit=crop&auto=format'
    ],
    catalogNumber: 'EMB-MONO-006',
    in_stock: true,
    stock_quantity: 20,
    featured: false,
    rating: 4.6,
    reviews: 30,
    tags: ['monogram', 'personalized', 'gift', 'custom'],
    materials: ['Linen blend', 'Gold thread', 'Hidden zipper'],
    size: '45x45cm',
    care_instructions: 'Machine wash gentle. Tumble dry low.'
  },
  {
    id: 'emb-007',
    name: 'Traditional Mandala Tapestry',
    description: 'Intricate mandala pattern hand-embroidered on premium fabric. Meditation and yoga spaces.',
    price: 2299,
    category: 'Embroidery',
    images: [
      'https://images.unsplash.com/photo-1611605645802-c21be743c321?w=600&h=600&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1515405295579-ba7b45403062?w=600&h=600&fit=crop&auto=format'
    ],
    catalogNumber: 'EMB-MAND-007',
    in_stock: true,
    stock_quantity: 6,
    featured: true,
    rating: 5.0,
    reviews: 17,
    tags: ['mandala', 'tapestry', 'meditation', 'spiritual'],
    materials: ['Cotton canvas', 'Metallic thread', 'Border trim'],
    size: '90x90cm',
    care_instructions: 'Spot clean only. Professional care preferred.'
  },
  {
    id: 'emb-008',
    name: 'Bohemian Tote Bag',
    description: 'Stylish tote bag with colorful boho embroidery patterns. Eco-friendly and fashionable.',
    price: 599,
    category: 'Embroidery',
    images: [
      'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=600&h=600&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=600&h=600&fit=crop&auto=format'
    ],
    catalogNumber: 'EMB-TOTE-008',
    in_stock: true,
    stock_quantity: 25,
    featured: false,
    rating: 4.5,
    reviews: 35,
    tags: ['tote-bag', 'boho', 'eco-friendly', 'fashion'],
    materials: ['Canvas', 'Colorful thread', 'Sturdy straps'],
    size: '35x40cm',
    care_instructions: 'Spot clean. Air dry.'
  },
  {
    id: 'emb-009',
    name: 'Vintage Bird Hoop Art',
    description: 'Charming vintage-style bird embroidery with delicate details. Perfect for nursery or bedroom.',
    price: 1099,
    category: 'Embroidery',
    images: [
      'https://images.unsplash.com/photo-1515405295579-ba7b45403062?w=600&h=600&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1611605645802-c21be743c321?w=600&h=600&fit=crop&auto=format'
    ],
    catalogNumber: 'EMB-BIRD-009',
    in_stock: true,
    stock_quantity: 10,
    featured: false,
    rating: 4.8,
    reviews: 19,
    tags: ['bird', 'vintage', 'nursery', 'nature'],
    materials: ['Cotton fabric', 'Pastel threads', 'Wooden hoop'],
    size: '20cm hoop',
    care_instructions: 'Frame to protect. Avoid direct sunlight.'
  },
  {
    id: 'emb-010',
    name: 'Abstract Art Cushion',
    description: 'Modern abstract embroidery design in geometric patterns. Contemporary home decor.',
    price: 849,
    category: 'Embroidery',
    images: [
      'https://images.unsplash.com/photo-1616627781431-00abe0a4c1cf?w=600&h=600&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=600&h=600&fit=crop&auto=format'
    ],
    catalogNumber: 'EMB-ABS-010',
    in_stock: true,
    stock_quantity: 14,
    featured: false,
    rating: 4.7,
    reviews: 16,
    tags: ['abstract', 'modern', 'geometric', 'contemporary'],
    materials: ['Velvet', 'Contrasting threads', 'Premium zipper'],
    size: '40x40cm',
    care_instructions: 'Dry clean for best results.'
  },

  // Lippan Arts
  {
    id: 'lip-001',
    name: 'Royal Peacock Mirror Art',
    description: 'Traditional Lippan art featuring intricate peacock design with authentic mirror work. A masterpiece that reflects both light and cultural heritage.',
    price: 2499,
    category: 'Lippan Arts',
    images: [
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=600&h=600&fit=crop'
    ],
    catalogNumber: 'LIP-PEA-001',
    in_stock: true,
    stock_quantity: 6,
    featured: true,
    rating: 4.9,
    reviews: 15,
    tags: ['traditional', 'peacock', 'mirror-work', 'cultural'],
    materials: ['Clay', 'Mirror pieces', 'Acrylic paint', 'Gold leaf'],
    size: '45x45cm',
    care_instructions: 'Dust with dry cloth. Handle with care to preserve mirrors.'
  },
  {
    id: 'lip-002',
    name: 'Mandala Mirror Wall Hanging',
    description: 'Geometric mandala design in traditional Lippan style with precise mirror placement. Creates stunning light patterns throughout the day.',
    price: 1899,
    category: 'Lippan Arts',
    images: [
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1544967082-d9d25d867d66?w=600&h=600&fit=crop'
    ],
    catalogNumber: 'LIP-MAN-002',
    in_stock: true,
    stock_quantity: 10,
    featured: false,
    rating: 4.6,
    reviews: 22,
    tags: ['mandala', 'geometric', 'spiritual', 'wall-hanging'],
    materials: ['MDF base', 'Mirror tiles', 'Textured paint'],
    size: '35cm diameter',
    care_instructions: 'Clean mirrors with glass cleaner. Avoid moisture on base.'
  },
  {
    id: 'lip-003',
    name: 'Elephant Design Wall Plate',
    description: 'Traditional elephant motif with intricate mirror work. Symbol of wisdom and prosperity.',
    price: 1599,
    category: 'Lippan Arts',
    images: [
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=600&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600&h=600&fit=crop&auto=format'
    ],
    catalogNumber: 'LIP-ELE-003',
    in_stock: true,
    stock_quantity: 12,
    featured: false,
    rating: 4.7,
    reviews: 18,
    tags: ['elephant', 'prosperity', 'traditional', 'symbolic'],
    materials: ['Wood base', 'Mirror pieces', 'Clay work', 'Paint'],
    size: '30cm diameter',
    care_instructions: 'Dust regularly. Keep in dry environment.'
  },
  {
    id: 'lip-004',
    name: 'Floral Pattern Decorative Plate',
    description: 'Beautiful floral design with colorful mirror work. Brightens any wall space.',
    price: 1299,
    category: 'Lippan Arts',
    images: [
      'https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=600&h=600&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=600&h=600&fit=crop&auto=format'
    ],
    catalogNumber: 'LIP-FLOR-004',
    in_stock: true,
    stock_quantity: 15,
    featured: false,
    rating: 4.8,
    reviews: 20,
    tags: ['floral', 'colorful', 'decorative', 'vibrant'],
    materials: ['Circular base', 'Colored mirrors', 'Textured clay'],
    size: '25cm diameter',
    care_instructions: 'Wipe with soft dry cloth only.'
  },
  {
    id: 'lip-005',
    name: 'Sun and Moon Art',
    description: 'Celestial themed Lippan art combining sun and moon imagery with mirror work.',
    price: 2199,
    category: 'Lippan Arts',
    images: [
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600&h=600&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=600&fit=crop&auto=format'
    ],
    catalogNumber: 'LIP-SUN-005',
    in_stock: true,
    stock_quantity: 8,
    featured: true,
    rating: 4.9,
    reviews: 16,
    tags: ['celestial', 'sun', 'moon', 'spiritual'],
    materials: ['Wood panel', 'Gold mirrors', 'Silver mirrors', 'Metallic paint'],
    size: '40x40cm',
    care_instructions: 'Handle with care. Clean mirrors gently.'
  },
  {
    id: 'lip-006',
    name: 'Rangoli Pattern Mirror Art',
    description: 'Traditional rangoli design transformed into permanent mirror art. Festival vibes all year.',
    price: 1499,
    category: 'Lippan Arts',
    images: [
      'https://images.unsplash.com/photo-1544967082-d9d25d867d66?w=600&h=600&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=600&h=600&fit=crop&auto=format'
    ],
    catalogNumber: 'LIP-RANG-006',
    in_stock: true,
    stock_quantity: 11,
    featured: false,
    rating: 4.6,
    reviews: 24,
    tags: ['rangoli', 'festival', 'colorful', 'traditional'],
    materials: ['Flat surface', 'Multicolor mirrors', 'Decorative stones'],
    size: '35x35cm',
    care_instructions: 'Avoid water exposure. Dust carefully.'
  },
  {
    id: 'lip-007',
    name: 'Lotus Mirror Wall Decor',
    description: 'Sacred lotus flower design with delicate mirror work. Symbol of purity and enlightenment.',
    price: 1799,
    category: 'Lippan Arts',
    images: [
      'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=600&h=600&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=600&fit=crop&auto=format'
    ],
    catalogNumber: 'LIP-LOT-007',
    in_stock: true,
    stock_quantity: 9,
    featured: false,
    rating: 4.8,
    reviews: 17,
    tags: ['lotus', 'spiritual', 'sacred', 'elegant'],
    materials: ['Wooden base', 'Pink mirrors', 'Gold outline'],
    size: '38cm diameter',
    care_instructions: 'Professional cleaning recommended.'
  },
  {
    id: 'lip-008',
    name: 'Abstract Geometric Mirror Set',
    description: 'Set of 3 abstract geometric designs. Modern twist on traditional Lippan art.',
    price: 2799,
    category: 'Lippan Arts',
    images: [
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600&h=600&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1544967082-d9d25d867d66?w=600&h=600&fit=crop&auto=format'
    ],
    catalogNumber: 'LIP-ABS-008',
    in_stock: true,
    stock_quantity: 5,
    featured: true,
    rating: 5.0,
    reviews: 12,
    tags: ['abstract', 'modern', 'geometric', 'set'],
    materials: ['3 panels', 'Contemporary mirrors', 'Minimalist design'],
    size: '25x25cm each',
    care_instructions: 'Display together for maximum impact.'
  },
  {
    id: 'lip-009',
    name: 'Bird Paradise Mirror Art',
    description: 'Colorful birds amidst flowers and vines. Brings nature indoors with sparkling mirrors.',
    price: 1699,
    category: 'Lippan Arts',
    images: [
      'https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=600&h=600&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=600&h=600&fit=crop&auto=format'
    ],
    catalogNumber: 'LIP-BIRD-009',
    in_stock: true,
    stock_quantity: 10,
    featured: false,
    rating: 4.7,
    reviews: 19,
    tags: ['birds', 'nature', 'colorful', 'decorative'],
    materials: ['Clay relief', 'Colored glass pieces', 'Acrylic colors'],
    size: '35x45cm',
    care_instructions: 'Avoid direct water contact.'
  },
  {
    id: 'lip-010',
    name: 'Om Symbol Mirror Decor',
    description: 'Sacred Om symbol with traditional mirror work. Perfect for meditation spaces.',
    price: 1399,
    category: 'Lippan Arts',
    images: [
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=600&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600&h=600&fit=crop&auto=format'
    ],
    catalogNumber: 'LIP-OM-010',
    in_stock: true,
    stock_quantity: 13,
    featured: false,
    rating: 4.9,
    reviews: 21,
    tags: ['om', 'spiritual', 'meditation', 'sacred'],
    materials: ['Round base', 'Mirror fragments', 'Gold paint'],
    size: '28cm diameter',
    care_instructions: 'Keep in sacred clean space.'
  },

  // Resin Art Work
  {
    id: 'res-001',
    name: 'Ocean Waves Serving Tray',
    description: 'Stunning resin art tray capturing the beauty of ocean waves with gold accents. Functional art that brings coastal vibes to your home.',
    price: 2299,
    category: 'Resin Art Work',
    images: [
      'https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1611003228941-98852ba62227?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1615529182904-14819c35db37?w=600&h=600&fit=crop'
    ],
    catalogNumber: 'RES-OCE-001',
    in_stock: true,
    stock_quantity: 14,
    featured: true,
    rating: 4.8,
    reviews: 19,
    tags: ['ocean', 'functional', 'serving', 'coastal'],
    materials: ['Epoxy resin', 'Mica powder', 'Gold leaf', 'Wooden base'],
    size: '40x30cm',
    care_instructions: 'Hand wash with mild soap. Avoid harsh chemicals.'
  },
  {
    id: 'res-002',
    name: 'Galaxy Coaster Set',
    description: 'Set of 4 cosmic-inspired resin coasters with swirling galaxy designs. Each piece is unique, just like stars in the universe.',
    price: 699,
    category: 'Resin Art Work',
    images: [
      'https://images.unsplash.com/photo-1618556450994-a6a128ef0d9d?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=600&h=600&fit=crop'
    ],
    catalogNumber: 'RES-GAL-002',
    in_stock: true,
    stock_quantity: 25,
    featured: false,
    rating: 4.7,
    reviews: 31,
    tags: ['galaxy', 'coasters', 'set', 'cosmic'],
    materials: ['Epoxy resin', 'Alcohol inks', 'Glitter', 'Cork backing'],
    size: '10cm diameter each',
    care_instructions: 'Wipe clean with damp cloth. Heat resistant up to 60°C.'
  },
  {
    id: 'res-003',
    name: 'Geode Slice Art',
    description: 'Stunning geode-inspired resin art with gold leaf and crystals. Natural beauty captured in resin.',
    price: 1899,
    category: 'Resin Art Work',
    images: [
      'https://images.unsplash.com/photo-1615529182904-14819c35db37?w=600&h=600&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=600&h=600&fit=crop&auto=format'
    ],
    catalogNumber: 'RES-GEO-003',
    in_stock: true,
    stock_quantity: 8,
    featured: true,
    rating: 5.0,
    reviews: 16,
    tags: ['geode', 'crystal', 'gold', 'luxury'],
    materials: ['Epoxy resin', 'Gold leaf', 'Crystal pieces', 'Wooden frame'],
    size: '30x30cm',
    care_instructions: 'Display away from direct sunlight.'
  },
  {
    id: 'res-004',
    name: 'Marble Effect Trinket Dish',
    description: 'Elegant marble-like resin dish perfect for jewelry and small items.',
    price: 449,
    category: 'Resin Art Work',
    images: [
      'https://images.unsplash.com/photo-1611003228941-98852ba62227?w=600&h=600&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1618556450994-a6a128ef0d9d?w=600&h=600&fit=crop&auto=format'
    ],
    catalogNumber: 'RES-MAR-004',
    in_stock: true,
    stock_quantity: 20,
    featured: false,
    rating: 4.6,
    reviews: 28,
    tags: ['marble', 'trinket', 'jewelry', 'organizer'],
    materials: ['Resin', 'Marble powder', 'Gold veins'],
    size: '12x12cm',
    care_instructions: 'Wipe with soft cloth.'
  },
  {
    id: 'res-005',
    name: 'Floral Preserved Keychain',
    description: 'Real pressed flowers preserved in crystal-clear resin. Natures beauty to carry with you.',
    price: 299,
    category: 'Resin Art Work',
    images: [
      'https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=600&h=600&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1615529182904-14819c35db37?w=600&h=600&fit=crop&auto=format'
    ],
    catalogNumber: 'RES-KEY-005',
    in_stock: true,
    stock_quantity: 50,
    featured: false,
    rating: 4.8,
    reviews: 42,
    tags: ['floral', 'keychain', 'preserved', 'gift'],
    materials: ['Epoxy resin', 'Dried flowers', 'Metal keyring'],
    size: '5x3cm',
    care_instructions: 'Avoid scratches and impacts.'
  },
  {
    id: 'res-006',
    name: 'Abstract Pour Painting',
    description: 'Dynamic resin pour painting with flowing colors and patterns. Contemporary wall art.',
    price: 2799,
    category: 'Resin Art Work',
    images: [
      'https://images.unsplash.com/photo-1611003228941-98852ba62227?w=600&h=600&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1615529182904-14819c35db37?w=600&h=600&fit=crop&auto=format'
    ],
    catalogNumber: 'RES-ABS-006',
    in_stock: true,
    stock_quantity: 6,
    featured: true,
    rating: 4.9,
    reviews: 14,
    tags: ['abstract', 'pour', 'modern', 'art'],
    materials: ['Canvas', 'Resin', 'Acrylic inks', 'Protective coating'],
    size: '50x50cm',
    care_instructions: 'Hang away from moisture.'
  },
  {
    id: 'res-007',
    name: 'Bookmark Set with Flowers',
    description: 'Set of 3 elegant bookmarks with preserved flowers. Perfect for book lovers.',
    price: 399,
    category: 'Resin Art Work',
    images: [
      'https://images.unsplash.com/photo-1618556450994-a6a128ef0d9d?w=600&h=600&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=600&h=600&fit=crop&auto=format'
    ],
    catalogNumber: 'RES-BOOK-007',
    in_stock: true,
    stock_quantity: 35,
    featured: false,
    rating: 4.7,
    reviews: 38,
    tags: ['bookmark', 'flowers', 'reading', 'set'],
    materials: ['Thin resin', 'Pressed flowers', 'Ribbon'],
    size: '15x4cm each',
    care_instructions: 'Store in book when not in use.'
  },
  {
    id: 'res-008',
    name: 'Night Sky Clock',
    description: 'Functional wall clock with mesmerizing night sky resin design. Time meets art.',
    price: 1599,
    category: 'Resin Art Work',
    images: [
      'https://images.unsplash.com/photo-1615529182904-14819c35db37?w=600&h=600&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1611003228941-98852ba62227?w=600&h=600&fit=crop&auto=format'
    ],
    catalogNumber: 'RES-CLK-008',
    in_stock: true,
    stock_quantity: 12,
    featured: false,
    rating: 4.8,
    reviews: 24,
    tags: ['clock', 'functional', 'night-sky', 'wall-decor'],
    materials: ['Resin face', 'Clock mechanism', 'Mica powder'],
    size: '30cm diameter',
    care_instructions: 'Requires 1 AA battery.'
  },
  {
    id: 'res-009',
    name: 'Jewelry Organizer Tray',
    description: 'Multi-compartment resin tray with gold accents. Organize in style.',
    price: 899,
    category: 'Resin Art Work',
    images: [
      'https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=600&h=600&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1618556450994-a6a128ef0d9d?w=600&h=600&fit=crop&auto=format'
    ],
    catalogNumber: 'RES-ORG-009',
    in_stock: true,
    stock_quantity: 16,
    featured: false,
    rating: 4.6,
    reviews: 27,
    tags: ['organizer', 'jewelry', 'tray', 'storage'],
    materials: ['Resin', 'Gold foil', 'Velvet lining'],
    size: '25x18cm',
    care_instructions: 'Keep jewelry dry before placing.'
  },
  {
    id: 'res-010',
    name: 'Pet Memorial Stone',
    description: 'Personalized memorial stone with paw print. Cherish memories forever.',
    price: 799,
    category: 'Resin Art Work',
    images: [
      'https://images.unsplash.com/photo-1611003228941-98852ba62227?w=600&h=600&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1615529182904-14819c35db37?w=600&h=600&fit=crop&auto=format'
    ],
    catalogNumber: 'RES-PET-010',
    in_stock: true,
    stock_quantity: 10,
    featured: false,
    rating: 5.0,
    reviews: 18,
    tags: ['memorial', 'pet', 'personalized', 'remembrance'],
    materials: ['Resin', 'Personalization', 'Protective finish'],
    size: '15cm diameter',
    care_instructions: 'Suitable for outdoor or indoor display.'
  },

  // Candles
  {
    id: 'can-001',
    name: 'Lavender Fields Soy Candle',
    description: 'Hand-poured soy candle infused with pure lavender essential oil. Creates a calming atmosphere with 40+ hours of clean burning.',
    price: 599,
    category: 'Candles',
    images: [
      'https://images.unsplash.com/photo-1602874801007-594fd1cce6d7?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1587049016823-69c1f68e0d2d?w=600&h=600&fit=crop'
    ],
    catalogNumber: 'CAN-LAV-001',
    in_stock: true,
    stock_quantity: 30,
    featured: true,
    rating: 4.9,
    reviews: 45,
    tags: ['lavender', 'soy', 'aromatherapy', 'relaxation'],
    materials: ['Soy wax', 'Lavender essential oil', 'Cotton wick', 'Glass jar'],
    size: '250g',
    care_instructions: 'Trim wick to 5mm before each use. Burn for max 4 hours at a time.'
  },
  {
    id: 'can-002',
    name: 'Vanilla Rose Luxury Candle',
    description: 'Premium candle with a sophisticated blend of vanilla and rose. Housed in an elegant glass vessel that can be repurposed.',
    price: 899,
    category: 'Candles',
    images: [
      'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1602874801007-594fd1cce6d7?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1587049016823-69c1f68e0d2d?w=600&h=600&fit=crop'
    ],
    catalogNumber: 'CAN-VAN-002',
    in_stock: true,
    stock_quantity: 18,
    featured: false,
    rating: 4.8,
    reviews: 28,
    tags: ['vanilla', 'rose', 'luxury', 'elegant'],
    materials: ['Coconut wax blend', 'Premium fragrance oils', 'Wood wick'],
    size: '300g',
    care_instructions: 'Allow wax to melt to edges on first burn. Keep away from drafts.'
  },
  {
    id: 'can-003',
    name: 'Ocean Breeze Trio Set',
    description: 'Set of three mini candles with refreshing ocean-inspired scents. Includes Sea Salt, Coconut, and Marine notes.',
    price: 749,
    category: 'Candles',
    images: [
      'https://images.unsplash.com/photo-1587016687192-943faa80d8e0?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1602874801006-39554b59d519?w=600&h=600&fit=crop'
    ],
    catalogNumber: 'CAN-OCE-003',
    in_stock: true,
    stock_quantity: 22,
    featured: true,
    rating: 4.9,
    reviews: 61,
    tags: ['gift set', 'fresh', 'ocean', 'trio'],
    materials: ['Soy wax', 'Essential oil blend', 'Cotton wicks'],
    size: '3 x 100g',
    care_instructions: 'Perfect gift set. Burn each candle separately for best results.'
  },
  {
    id: 'can-004',
    name: 'Sandalwood Meditation Candle',
    description: 'Deep, woody sandalwood scent for meditation and relaxation. Hand-carved wooden lid adds rustic charm.',
    price: 849,
    category: 'Candles',
    images: [
      'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=600&h=600&fit=crop'
    ],
    catalogNumber: 'CAN-SAN-004',
    in_stock: true,
    stock_quantity: 15,
    featured: false,
    rating: 5.0,
    reviews: 34,
    tags: ['sandalwood', 'meditation', 'spiritual', 'woody'],
    materials: ['Beeswax blend', 'Sandalwood oil', 'Wooden lid'],
    size: '350g',
    care_instructions: 'Burns for 50+ hours. Keep lid on when not in use to preserve scent.'
  },
  {
    id: 'can-005',
    name: 'Citrus Sunrise Energy Candle',
    description: 'Energizing blend of orange, lemon, and grapefruit. Bright and uplifting scent perfect for mornings.',
    price: 529,
    category: 'Candles',
    images: [
      'https://images.unsplash.com/photo-1587049016823-69c1f68e0d2d?w=600&h=600&fit=crop&sat=10&hue=30',
      'https://images.unsplash.com/photo-1602874801007-594fd1cce6d7?w=600&h=600&fit=crop&sat=20'
    ],
    catalogNumber: 'CAN-CIT-005',
    in_stock: true,
    stock_quantity: 40,
    featured: false,
    rating: 4.7,
    reviews: 52,
    tags: ['citrus', 'energizing', 'fresh', 'morning'],
    materials: ['Coconut soy wax', 'Citrus essential oils', 'Wood wick'],
    size: '220g',
    care_instructions: 'Wood wick creates gentle crackling sound. Trim to 3mm before use.'
  },
  {
    id: 'can-006',
    name: 'Cinnamon Spice Warmth',
    description: 'Warm cinnamon and clove blend perfect for autumn and winter. Creates instant cozy ambiance in any room.',
    price: 579,
    category: 'Candles',
    images: [
      'https://images.unsplash.com/photo-1602874801006-39554b59d519?w=600&h=600&fit=crop&sat=30&hue=-10',
      'https://images.unsplash.com/photo-1587016687192-943faa80d8e0?w=600&h=600&fit=crop&sat=20'
    ],
    catalogNumber: 'CAN-CIN-006',
    in_stock: true,
    stock_quantity: 28,
    featured: true,
    rating: 4.8,
    reviews: 47,
    tags: ['cinnamon', 'spice', 'warm', 'winter'],
    materials: ['Soy wax', 'Cinnamon bark oil', 'Clove oil'],
    size: '240g',
    care_instructions: 'Strong scent throw. Ideal for medium to large rooms.'
  },
  {
    id: 'can-007',
    name: 'Eucalyptus Mint Spa Candle',
    description: 'Spa-quality eucalyptus and mint blend. Refreshing and purifying, creates a luxury spa atmosphere at home.',
    price: 649,
    category: 'Candles',
    images: [
      'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=600&h=600&fit=crop&sat=-20&hue=100',
      'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=600&h=600&fit=crop&sat=-10'
    ],
    catalogNumber: 'CAN-EUC-007',
    in_stock: true,
    stock_quantity: 25,
    featured: false,
    rating: 4.9,
    reviews: 39,
    tags: ['eucalyptus', 'mint', 'spa', 'refreshing'],
    materials: ['Natural soy wax', 'Eucalyptus oil', 'Peppermint oil'],
    size: '280g',
    care_instructions: 'Perfect for bathroom or bedroom. Burns for 45+ hours.'
  },
  {
    id: 'can-008',
    name: 'Honeycomb Beeswax Candle',
    description: 'Pure beeswax candle with natural honey scent. 100% natural with air-purifying properties.',
    price: 899,
    category: 'Candles',
    images: [
      'https://images.unsplash.com/photo-1587049016823-69c1f68e0d2d?w=600&h=600&fit=crop&sat=40&hue=40',
      'https://images.unsplash.com/photo-1602874801007-594fd1cce6d7?w=600&h=600&fit=crop&sat=30&hue=35'
    ],
    catalogNumber: 'CAN-HON-008',
    in_stock: true,
    stock_quantity: 12,
    featured: true,
    rating: 5.0,
    reviews: 29,
    tags: ['beeswax', 'natural', 'honey', 'premium'],
    materials: ['100% pure beeswax', 'Cotton wick'],
    size: '400g',
    care_instructions: 'Natural air purifier. Burns very clean and long-lasting 60+ hours.'
  },
  {
    id: 'can-009',
    name: 'Jasmine Night Garden Candle',
    description: 'Exotic jasmine flower candle with subtle musk undertones. Creates romantic evening atmosphere.',
    price: 729,
    category: 'Candles',
    images: [
      'https://images.unsplash.com/photo-1602874801006-39554b59d519?w=600&h=600&fit=crop&sat=10&hue=280',
      'https://images.unsplash.com/photo-1587016687192-943faa80d8e0?w=600&h=600&fit=crop&sat=5&hue=270'
    ],
    catalogNumber: 'CAN-JAS-009',
    in_stock: true,
    stock_quantity: 20,
    featured: false,
    rating: 4.8,
    reviews: 36,
    tags: ['jasmine', 'floral', 'romantic', 'evening'],
    materials: ['Coconut wax', 'Jasmine absolute', 'Musk'],
    size: '310g',
    care_instructions: 'Reusable ceramic vessel. Burns for 48+ hours with strong scent throw.'
  },
  {
    id: 'can-010',
    name: 'Coffee Bean Energizer Candle',
    description: 'Rich espresso and coffee bean scent. Invigorating aroma perfect for home office or kitchen.',
    price: 599,
    category: 'Candles',
    images: [
      'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=600&h=600&fit=crop&sat=20&hue=-30',
      'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=600&h=600&fit=crop&sat=15&hue=-25'
    ],
    catalogNumber: 'CAN-COF-010',
    in_stock: true,
    stock_quantity: 32,
    featured: false,
    rating: 4.7,
    reviews: 44,
    tags: ['coffee', 'energizing', 'kitchen', 'unique'],
    materials: ['Soy wax', 'Coffee bean extract', 'Vanilla notes'],
    size: '260g',
    care_instructions: 'Realistic coffee aroma. Burns for 40+ hours. Great gift for coffee lovers.'
  },

  // Hair Accessories
  {
    id: 'hair-001',
    name: 'Pearl Flower Hair Crown',
    description: 'Delicate hair crown adorned with silk flowers and freshwater pearls. Perfect for weddings, special occasions, or feeling like royalty.',
    price: 1499,
    category: 'Hair Accessories',
    images: [
      'https://images.unsplash.com/photo-1535632787350-4e68ef0ac584?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&h=600&fit=crop'
    ],
    catalogNumber: 'HAIR-CRO-001',
    in_stock: true,
    stock_quantity: 12,
    featured: true,
    rating: 5.0,
    reviews: 16,
    tags: ['wedding', 'pearls', 'crown', 'bridal'],
    materials: ['Silk flowers', 'Freshwater pearls', 'Wire base', 'Ribbon ties'],
    size: 'Adjustable (52-58cm)',
    care_instructions: 'Store in provided box. Avoid water and perfume contact.'
  },
  {
    id: 'hair-002',
    name: 'Boho Braided Headband',
    description: 'Handwoven headband with intricate braiding and natural hemp. Comfortable and stylish for everyday bohemian elegance.',
    price: 399,
    category: 'Hair Accessories',
    images: [
      'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1535632787350-4e68ef0ac584?w=600&h=600&fit=crop'
    ],
    catalogNumber: 'HAIR-BOH-002',
    in_stock: true,
    stock_quantity: 22,
    featured: false,
    rating: 4.6,
    reviews: 33,
    tags: ['boho', 'braided', 'natural', 'everyday'],
    materials: ['Hemp rope', 'Cotton thread', 'Wooden beads'],
    size: 'One size fits most',
    care_instructions: 'Hand wash gently. Air dry completely before storing.'
  },
  {
    id: 'hair-003',
    name: 'Satin Scrunchie Set',
    description: 'Set of 5 luxurious satin scrunchies in pastel colors. Gentle on hair, prevents breakage and creases.',
    price: 299,
    category: 'Hair Accessories',
    images: [
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=600&h=600&fit=crop'
    ],
    catalogNumber: 'HAIR-SCR-003',
    in_stock: true,
    stock_quantity: 50,
    featured: true,
    rating: 4.8,
    reviews: 92,
    tags: ['scrunchies', 'satin', 'set', 'gentle'],
    materials: ['100% satin', 'Elastic'],
    size: '5 pieces - Standard size',
    care_instructions: 'Hand wash in cold water. Air dry.'
  },
  {
    id: 'hair-004',
    name: 'Crystal Butterfly Hair Claw',
    description: 'Elegant butterfly-shaped hair claw with sparkling crystals. Holds thick hair securely with style.',
    price: 549,
    category: 'Hair Accessories',
    images: [
      'https://images.unsplash.com/photo-1535632787350-4e68ef0ac584?w=600&h=600&fit=crop&sat=20',
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&h=600&fit=crop&sat=15'
    ],
    catalogNumber: 'HAIR-BUT-004',
    in_stock: true,
    stock_quantity: 35,
    featured: false,
    rating: 4.7,
    reviews: 58,
    tags: ['claw', 'butterfly', 'crystal', 'elegant'],
    materials: ['Metal alloy', 'Rhinestones', 'Acrylic'],
    size: '9cm length',
    care_instructions: 'Wipe clean with soft cloth. Keep dry.'
  },
  {
    id: 'hair-005',
    name: 'Velvet Bow Hair Clip',
    description: 'Oversized velvet bow clip in rich jewel tones. Makes a statement while keeping hair perfectly in place.',
    price: 449,
    category: 'Hair Accessories',
    images: [
      'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=600&h=600&fit=crop&sat=30&hue=-20',
      'https://images.unsplash.com/photo-1535632787350-4e68ef0ac584?w=600&h=600&fit=crop&sat=25'
    ],
    catalogNumber: 'HAIR-BOW-005',
    in_stock: true,
    stock_quantity: 28,
    featured: true,
    rating: 4.9,
    reviews: 45,
    tags: ['bow', 'velvet', 'vintage', 'statement'],
    materials: ['Velvet fabric', 'Metal clip', 'Stiffening'],
    size: '12cm width',
    care_instructions: 'Spot clean only. Reshape bow if needed.'
  },
  {
    id: 'hair-006',
    name: 'Gold Leaf Hair Pins Set',
    description: 'Set of 3 delicate gold leaf-shaped pins. Perfect for adding subtle elegance to any hairstyle.',
    price: 599,
    category: 'Hair Accessories',
    images: [
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&h=600&fit=crop&sat=40&hue=40',
      'https://images.unsplash.com/photo-1535632787350-4e68ef0ac584?w=600&h=600&fit=crop&sat=35&hue=35'
    ],
    catalogNumber: 'HAIR-LEAF-006',
    in_stock: true,
    stock_quantity: 40,
    featured: false,
    rating: 4.8,
    reviews: 67,
    tags: ['pins', 'gold', 'leaf', 'minimal'],
    materials: ['Gold-plated metal', 'Enamel coating'],
    size: '3 pieces - 6cm each',
    care_instructions: 'Store separately to prevent scratching. Avoid water.'
  },
  {
    id: 'hair-007',
    name: 'Macrame Hair Tie Collection',
    description: 'Handmade macrame hair ties in earth tones. Boho-chic style meets functionality.',
    price: 349,
    category: 'Hair Accessories',
    images: [
      'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=600&h=600&fit=crop&sat=-10&hue=20',
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&h=600&fit=crop&sat=-5'
    ],
    catalogNumber: 'HAIR-MAC-007',
    in_stock: true,
    stock_quantity: 32,
    featured: false,
    rating: 4.6,
    reviews: 41,
    tags: ['macrame', 'boho', 'handmade', 'natural'],
    materials: ['Cotton cord', 'Wooden beads', 'Elastic'],
    size: '4 pieces - One size',
    care_instructions: 'Hand wash if needed. Dry flat.'
  },
  {
    id: 'hair-008',
    name: 'Vintage Floral Headband',
    description: 'Romantic headband with vintage-inspired fabric flowers and lace details. Timeless beauty.',
    price: 799,
    category: 'Hair Accessories',
    images: [
      'https://images.unsplash.com/photo-1535632787350-4e68ef0ac584?w=600&h=600&fit=crop&sat=10&hue=-30',
      'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=600&h=600&fit=crop&sat=5&hue=-25'
    ],
    catalogNumber: 'HAIR-VINT-008',
    in_stock: true,
    stock_quantity: 18,
    featured: true,
    rating: 5.0,
    reviews: 29,
    tags: ['vintage', 'floral', 'romantic', 'lace'],
    materials: ['Fabric flowers', 'Lace', 'Satin band'],
    size: 'Adjustable - One size',
    care_instructions: 'Spot clean delicately. Store flat.'
  },
  {
    id: 'hair-009',
    name: 'Minimalist Metal Hair Rings',
    description: 'Set of 10 sleek metal rings for creating trendy loc and braid styles. Modern and versatile.',
    price: 249,
    category: 'Hair Accessories',
    images: [
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&h=600&fit=crop&sat=-30',
      'https://images.unsplash.com/photo-1535632787350-4e68ef0ac584?w=600&h=600&fit=crop&sat=-25'
    ],
    catalogNumber: 'HAIR-RING-009',
    in_stock: true,
    stock_quantity: 60,
    featured: false,
    rating: 4.7,
    reviews: 85,
    tags: ['rings', 'minimal', 'modern', 'braids'],
    materials: ['Stainless steel', 'Silver finish'],
    size: '10 pieces - 1cm diameter',
    care_instructions: 'Wipe clean. Hypoallergenic material.'
  },
  {
    id: 'hair-010',
    name: 'Silk Flower Hair Combs Pair',
    description: 'Pair of decorative hair combs with handmade silk flowers. Perfect for updos and special occasions.',
    price: 899,
    category: 'Hair Accessories',
    images: [
      'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=600&h=600&fit=crop&sat=20&hue=10',
      'https://images.unsplash.com/photo-1535632787350-4e68ef0ac584?w=600&h=600&fit=crop&sat=15&hue=5'
    ],
    catalogNumber: 'HAIR-COMB-010',
    in_stock: true,
    stock_quantity: 24,
    featured: false,
    rating: 4.9,
    reviews: 38,
    tags: ['combs', 'silk', 'flowers', 'wedding'],
    materials: ['Silk flowers', 'Metal combs', 'Pearl accents'],
    size: 'Pair - 8cm each',
    care_instructions: 'Handle gently. Store in protective box.'
  },

  // Illustration & Art
  {
    id: 'ill-001',
    name: 'Custom Pet Portrait',
    description: 'Beautiful custom watercolor portrait of your beloved pet. Hand-painted with love and attention to every detail that makes them special.',
    price: 1999,
    category: 'Illustration',
    images: [
      'https://images.unsplash.com/photo-1541364983171-a8ba01e95cfc?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?w=600&h=600&fit=crop'
    ],
    catalogNumber: 'ILL-PET-001',
    in_stock: true,
    stock_quantity: 50,
    featured: true,
    rating: 5.0,
    reviews: 67,
    tags: ['custom', 'pet', 'watercolor', 'personal'],
    materials: ['Watercolor paper', 'Professional paints', 'Protective coating'],
    size: 'A4 (21x30cm)',
    care_instructions: 'Frame under glass. Avoid direct sunlight and moisture.'
  },
  {
    id: 'ill-002',
    name: 'Botanical Garden Print Set',
    description: 'Set of 4 detailed botanical illustrations featuring native flowers. Perfect for nature lovers and home decor.',
    price: 1299,
    category: 'Illustration',
    images: [
      'https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?w=600&h=600&fit=crop&sat=30',
      'https://images.unsplash.com/photo-1541364983171-a8ba01e95cfc?w=600&h=600&fit=crop&sat=25'
    ],
    catalogNumber: 'ILL-BOT-002',
    in_stock: true,
    stock_quantity: 20,
    featured: true,
    rating: 4.9,
    reviews: 54,
    tags: ['botanical', 'nature', 'set', 'prints'],
    materials: ['Fine art paper', 'Archival inks', 'Hand-signed'],
    size: '4 prints - A5 each (15x21cm)',
    care_instructions: 'Store flat. Frame in UV-protective glass for longevity.'
  },
  {
    id: 'ill-003',
    name: 'Abstract Minimalist Portrait',
    description: 'Modern abstract portrait using bold lines and minimal colors. Contemporary art for modern spaces.',
    price: 1799,
    category: 'Illustration',
    images: [
      'https://images.unsplash.com/photo-1541364983171-a8ba01e95cfc?w=600&h=600&fit=crop&sat=-20',
      'https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?w=600&h=600&fit=crop&sat=-15'
    ],
    catalogNumber: 'ILL-ABS-003',
    in_stock: true,
    stock_quantity: 15,
    featured: false,
    rating: 4.7,
    reviews: 38,
    tags: ['abstract', 'minimalist', 'modern', 'portrait'],
    materials: ['Canvas paper', 'Acrylic markers', 'Fixative'],
    size: 'A3 (30x42cm)',
    care_instructions: 'Keep away from moisture. Display in low-humidity environment.'
  },
  {
    id: 'ill-004',
    name: 'Fairy Tale Character Illustration',
    description: 'Whimsical character illustration perfect for children\'s rooms. Choose from various fairy tale characters.',
    price: 999,
    category: 'Illustration',
    images: [
      'https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?w=600&h=600&fit=crop&sat=40&hue=30',
      'https://images.unsplash.com/photo-1541364983171-a8ba01e95cfc?w=600&h=600&fit=crop&sat=35&hue=25'
    ],
    catalogNumber: 'ILL-FAIR-004',
    in_stock: true,
    stock_quantity: 30,
    featured: true,
    rating: 5.0,
    reviews: 89,
    tags: ['fairy tale', 'kids', 'whimsical', 'character'],
    materials: ['Illustration board', 'Colored pencils', 'Digital enhancement'],
    size: 'A4 (21x30cm)',
    care_instructions: 'Child-safe materials. Frame for protection.'
  },
  {
    id: 'ill-005',
    name: 'Cityscape Skyline Ink Drawing',
    description: 'Detailed ink drawing of iconic city skylines. Available in various cities worldwide.',
    price: 1499,
    category: 'Illustration',
    images: [
      'https://images.unsplash.com/photo-1541364983171-a8ba01e95cfc?w=600&h=600&fit=crop&sat=-30',
      'https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?w=600&h=600&fit=crop&sat=-25'
    ],
    catalogNumber: 'ILL-CITY-005',
    in_stock: true,
    stock_quantity: 25,
    featured: false,
    rating: 4.8,
    reviews: 62,
    tags: ['cityscape', 'skyline', 'urban', 'architecture'],
    materials: ['Bristol paper', 'India ink', 'Fine liner pens'],
    size: 'A3 landscape (42x30cm)',
    care_instructions: 'Keep in portfolio when not displayed. Avoid folding.'
  },
  {
    id: 'ill-006',
    name: 'Mandala Meditation Art',
    description: 'Intricate hand-drawn mandala perfect for meditation spaces. Each line drawn with mindfulness.',
    price: 1199,
    category: 'Illustration',
    images: [
      'https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?w=600&h=600&fit=crop&sat=20&hue=-50',
      'https://images.unsplash.com/photo-1541364983171-a8ba01e95cfc?w=600&h=600&fit=crop&sat=15&hue=-45'
    ],
    catalogNumber: 'ILL-MAND-006',
    in_stock: true,
    stock_quantity: 18,
    featured: true,
    rating: 5.0,
    reviews: 47,
    tags: ['mandala', 'meditation', 'spiritual', 'intricate'],
    materials: ['Handmade paper', 'Pigment ink', 'Gold leaf accents'],
    size: '30x30cm square',
    care_instructions: 'Handle edges carefully. Best displayed in floating frame.'
  },
  {
    id: 'ill-007',
    name: 'Ocean Waves Watercolor',
    description: 'Serene watercolor painting of ocean waves. Brings coastal calm to any space.',
    price: 1699,
    category: 'Illustration',
    images: [
      'https://images.unsplash.com/photo-1541364983171-a8ba01e95cfc?w=600&h=600&fit=crop&sat=10&hue=180',
      'https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?w=600&h=600&fit=crop&sat=5&hue=175'
    ],
    catalogNumber: 'ILL-OCEAN-007',
    in_stock: true,
    stock_quantity: 22,
    featured: false,
    rating: 4.9,
    reviews: 55,
    tags: ['ocean', 'watercolor', 'coastal', 'serene'],
    materials: ['Cold-pressed watercolor paper', 'Professional watercolors'],
    size: 'A3 (30x42cm)',
    care_instructions: 'Keep away from humidity. Frame with mat for best results.'
  },
  {
    id: 'ill-008',
    name: 'Vintage Travel Poster',
    description: 'Retro-style travel poster with vintage aesthetic. Choose from famous destinations worldwide.',
    price: 899,
    category: 'Illustration',
    images: [
      'https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?w=600&h=600&fit=crop&sat=25&hue=-30',
      'https://images.unsplash.com/photo-1541364983171-a8ba01e95cfc?w=600&h=600&fit=crop&sat=20&hue=-25'
    ],
    catalogNumber: 'ILL-TRAV-008',
    in_stock: true,
    stock_quantity: 35,
    featured: false,
    rating: 4.7,
    reviews: 71,
    tags: ['vintage', 'travel', 'retro', 'poster'],
    materials: ['Matte poster paper', 'Digital illustration', 'Vintage finish'],
    size: 'A2 (42x59cm)',
    care_instructions: 'Easy to frame. Avoid direct sunlight to preserve colors.'
  },
  {
    id: 'ill-009',
    name: 'Galaxy Space Art',
    description: 'Stunning galaxy and nebula illustration. Perfect for astronomy enthusiasts and dreamers.',
    price: 1399,
    category: 'Illustration',
    images: [
      'https://images.unsplash.com/photo-1541364983171-a8ba01e95cfc?w=600&h=600&fit=crop&sat=50&hue=270',
      'https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?w=600&h=600&fit=crop&sat=45&hue=265'
    ],
    catalogNumber: 'ILL-SPACE-009',
    in_stock: true,
    stock_quantity: 28,
    featured: true,
    rating: 5.0,
    reviews: 82,
    tags: ['galaxy', 'space', 'cosmic', 'astronomy'],
    materials: ['Black card stock', 'Metallic paints', 'Glow pigments'],
    size: 'A3 (30x42cm)',
    care_instructions: 'Glows subtly in dark. Keep in dark frame for effect.'
  },
  {
    id: 'ill-010',
    name: 'Food Illustration Recipe Card Set',
    description: 'Charming set of 6 illustrated recipe cards with hand-drawn food. Perfect for kitchen display or gifting.',
    price: 699,
    category: 'Illustration',
    images: [
      'https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?w=600&h=600&fit=crop&sat=35&hue=20',
      'https://images.unsplash.com/photo-1541364983171-a8ba01e95cfc?w=600&h=600&fit=crop&sat=30&hue=15'
    ],
    catalogNumber: 'ILL-FOOD-010',
    in_stock: true,
    stock_quantity: 40,
    featured: false,
    rating: 4.8,
    reviews: 66,
    tags: ['food', 'recipe', 'kitchen', 'set'],
    materials: ['Recipe card stock', 'Food-safe coating', 'Colored inks'],
    size: '6 cards - 10x15cm each',
    care_instructions: 'Wipe clean with damp cloth. Water-resistant coating.'
  },

  // Calligraphy
  {
    id: 'cal-001',
    name: 'Love Quote Calligraphy',
    description: 'Romantic quote beautifully hand-lettered in modern calligraphy style. Perfect for anniversaries, weddings, or expressing love.',
    price: 799,
    category: 'Calligraphy',
    images: [
      'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=600&h=600&fit=crop'
    ],
    catalogNumber: 'CAL-LOVE-001',
    in_stock: true,
    stock_quantity: 15,
    featured: false,
    rating: 4.9,
    reviews: 23,
    tags: ['love', 'quotes', 'romantic', 'wedding'],
    materials: ['Handmade paper', 'India ink', 'Gold accents'],
    size: 'A3 (30x42cm)',
    care_instructions: 'Frame immediately to prevent smudging. Handle with clean hands.'
  },
  {
    id: 'cal-002',
    name: 'Custom Name Calligraphy',
    description: 'Personalized name in elegant calligraphy. Perfect for nursery, office, or as a thoughtful gift.',
    price: 899,
    category: 'Calligraphy',
    images: [
      'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=600&h=600&fit=crop&sat=20',
      'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=600&h=600&fit=crop&sat=15'
    ],
    catalogNumber: 'CAL-NAME-002',
    in_stock: true,
    stock_quantity: 25,
    featured: true,
    rating: 5.0,
    reviews: 94,
    tags: ['custom', 'name', 'personalized', 'gift'],
    materials: ['Premium vellum', 'Calligraphy ink', 'Flourish details'],
    size: 'A4 (21x30cm)',
    care_instructions: 'Keep in protective sleeve. Frame under glass for display.'
  },
  {
    id: 'cal-003',
    name: 'Wedding Vows Keepsake',
    description: 'Your wedding vows hand-lettered in beautiful script. A treasured keepsake to display in your home.',
    price: 1999,
    category: 'Calligraphy',
    images: [
      'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=600&h=600&fit=crop&sat=10&hue=-20',
      'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=600&h=600&fit=crop&sat=5&hue=-15'
    ],
    catalogNumber: 'CAL-VOWS-003',
    in_stock: true,
    stock_quantity: 10,
    featured: true,
    rating: 5.0,
    reviews: 56,
    tags: ['wedding', 'vows', 'keepsake', 'anniversary'],
    materials: ['Cotton rag paper', 'Walnut ink', 'Gold leaf border'],
    size: 'A3 (30x42cm)',
    care_instructions: 'Heirloom quality. Professional framing recommended.'
  },
  {
    id: 'cal-004',
    name: 'Motivational Quote Art',
    description: 'Inspiring quote in bold modern calligraphy. Daily motivation for your workspace or home.',
    price: 699,
    category: 'Calligraphy',
    images: [
      'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=600&h=600&fit=crop&sat=30&hue=20',
      'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=600&h=600&fit=crop&sat=25&hue=15'
    ],
    catalogNumber: 'CAL-MOTI-004',
    in_stock: true,
    stock_quantity: 30,
    featured: false,
    rating: 4.8,
    reviews: 78,
    tags: ['motivational', 'inspiration', 'office', 'modern'],
    materials: ['Card stock', 'Brush pen calligraphy', 'Matte finish'],
    size: 'A4 (21x30cm)',
    care_instructions: 'Easy to frame. Avoid moisture and direct sunlight.'
  },
  {
    id: 'cal-005',
    name: 'Arabic Calligraphy Art',
    description: 'Traditional Arabic calligraphy featuring spiritual phrases. Stunning cultural art piece.',
    price: 1499,
    category: 'Calligraphy',
    images: [
      'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=600&h=600&fit=crop&sat=-10',
      'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=600&h=600&fit=crop&sat=-5'
    ],
    catalogNumber: 'CAL-ARAB-005',
    in_stock: true,
    stock_quantity: 12,
    featured: true,
    rating: 5.0,
    reviews: 42,
    tags: ['arabic', 'traditional', 'spiritual', 'cultural'],
    materials: ['Textured paper', 'Traditional reed pen', 'Black ink'],
    size: '40x30cm',
    care_instructions: 'Cultural artifact. Handle with respect and clean hands.'
  },
  {
    id: 'cal-006',
    name: 'Floral Monogram Letter',
    description: 'Ornate initial letter surrounded by delicate floral illustrations. Perfect personalized decor.',
    price: 999,
    category: 'Calligraphy',
    images: [
      'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=600&h=600&fit=crop&sat=35&hue=-30',
      'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=600&h=600&fit=crop&sat=30&hue=-25'
    ],
    catalogNumber: 'CAL-MONO-006',
    in_stock: true,
    stock_quantity: 28,
    featured: false,
    rating: 4.9,
    reviews: 67,
    tags: ['monogram', 'floral', 'initial', 'decorative'],
    materials: ['Watercolor paper', 'Ink and watercolor', 'Gold details'],
    size: '25x25cm square',
    care_instructions: 'Delicate artwork. Frame with mat for best presentation.'
  },
  {
    id: 'cal-007',
    name: 'Bible Verse Calligraphy',
    description: 'Favorite Bible verse in elegant script. Spiritual art for your sacred space.',
    price: 849,
    category: 'Calligraphy',
    images: [
      'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=600&h=600&fit=crop&sat=5&hue=10',
      'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=600&h=600&fit=crop&sat=0&hue=5'
    ],
    catalogNumber: 'CAL-BIBLE-007',
    in_stock: true,
    stock_quantity: 20,
    featured: false,
    rating: 5.0,
    reviews: 88,
    tags: ['bible', 'verse', 'spiritual', 'faith'],
    materials: ['Parchment-style paper', 'Sepia ink', 'Cross decoration'],
    size: 'A4 (21x30cm)',
    care_instructions: 'Sacred art. Handle with care and reverence.'
  },
  {
    id: 'cal-008',
    name: 'Anniversary Date Artwork',
    description: 'Special date beautifully lettered with names and decorative elements. Unique anniversary gift.',
    price: 1199,
    category: 'Calligraphy',
    images: [
      'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=600&h=600&fit=crop&sat=20&hue=-40',
      'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=600&h=600&fit=crop&sat=15&hue=-35'
    ],
    catalogNumber: 'CAL-DATE-008',
    in_stock: true,
    stock_quantity: 18,
    featured: true,
    rating: 4.9,
    reviews: 51,
    tags: ['anniversary', 'date', 'personalized', 'romantic'],
    materials: ['Ivory paper', 'Copper ink', 'Heart motifs'],
    size: 'A4 landscape (30x21cm)',
    care_instructions: 'Romantic keepsake. Frame for lasting memories.'
  },
  {
    id: 'cal-009',
    name: 'Menu Calligraphy Cards',
    description: 'Set of 10 hand-lettered menu cards. Perfect for weddings, events, or elegant dinner parties.',
    price: 1499,
    category: 'Calligraphy',
    images: [
      'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=600&h=600&fit=crop&sat=25&hue=30',
      'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=600&h=600&fit=crop&sat=20&hue=25'
    ],
    catalogNumber: 'CAL-MENU-009',
    in_stock: true,
    stock_quantity: 15,
    featured: false,
    rating: 4.8,
    reviews: 39,
    tags: ['menu', 'wedding', 'event', 'set'],
    materials: ['Heavy card stock', 'Custom calligraphy', 'Ribbon ties'],
    size: '10 cards - 15x20cm each',
    care_instructions: 'Event-ready. Store flat to maintain crisp appearance.'
  },
  {
    id: 'cal-010',
    name: 'Zodiac Sign Calligraphy',
    description: 'Your zodiac sign with constellation in artistic calligraphy. Celestial personalized art.',
    price: 749,
    category: 'Calligraphy',
    images: [
      'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=600&h=600&fit=crop&sat=40&hue=250',
      'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=600&h=600&fit=crop&sat=35&hue=245'
    ],
    catalogNumber: 'CAL-ZODI-010',
    in_stock: true,
    stock_quantity: 35,
    featured: false,
    rating: 4.7,
    reviews: 72,
    tags: ['zodiac', 'astrology', 'constellation', 'personalized'],
    materials: ['Black card stock', 'Metallic ink', 'Star details'],
    size: 'A5 (15x21cm)',
    care_instructions: 'Celestial gift. Frame in simple black frame for best effect.'
  }
];

// Product service functions
export class ProductService {
  private static products = PRODUCTS_DATABASE;

  static getAllProducts(): Product[] {
    return [...this.products];
  }

  static getProductById(id: string): Product | null {
    return this.products.find(product => product.id === id) || null;
  }

  static getProductsByCategory(category: string): Product[] {
    if (category === 'all') return this.getAllProducts();
    return this.products.filter(product => product.category === category);
  }

  static getFeaturedProducts(): Product[] {
    return this.products.filter(product => product.featured);
  }

  static searchProducts(query: string): Product[] {
    const lowercaseQuery = query.toLowerCase();
    return this.products.filter(product =>
      product.name.toLowerCase().includes(lowercaseQuery) ||
      product.description.toLowerCase().includes(lowercaseQuery) ||
      product.category.toLowerCase().includes(lowercaseQuery) ||
      product.tags?.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    );
  }

  static getProductsByPriceRange(min: number, max: number): Product[] {
    return this.products.filter(product => product.price >= min && product.price <= max);
  }

  static getCategories(): string[] {
    const categories = [...new Set(this.products.map(product => product.category))];
    return categories.sort();
  }

  static getCategoryWithCount() {
    const categories = this.getCategories();
    return categories.map(category => ({
      name: category,
      count: this.getProductsByCategory(category).length,
      featured_image: this.getProductsByCategory(category)[0]?.images[0] || '/placeholder.svg'
    }));
  }
}

export default ProductService;