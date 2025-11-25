import { Product } from '@/types/product';
import { supabase } from '@/integrations/supabase/client';

// Comprehensive product database with 10+ items per category
export const PRODUCTS_DATABASE: Product[] = [
  // ============ DREAM CATCHERS (10 products) ============
  {
    id: 'dc-001',
    name: 'Mystic Moon Dream Catcher',
    description: 'Handwoven dream catcher with genuine feathers, moonstone beads, and silver accents.',
    price: 1299,
    category: 'Dream Catcher',
    images: ['https://images.unsplash.com/photo-1583225173442-9bdb73e83c27?w=600&h=600&fit=crop'],
    catalogNumber: 'DC-001',
    in_stock: true,
    stock_quantity: 12,
    featured: true,
    rating: 4.9,
    reviews: 24
  },
  {
    id: 'dc-002',
    name: 'Boho Macrame Wall Hanging',
    description: 'Intricate macrame wall hanging with dream catcher center.',
    price: 1899,
    category: 'Dream Catcher',
    images: ['https://images.unsplash.com/photo-1526047932273-341f2a7631f9?w=600&h=600&fit=crop'],
    catalogNumber: 'DC-002',
    in_stock: true,
    stock_quantity: 8,
    featured: false,
    rating: 4.7,
    reviews: 15
  },
  {
    id: 'dc-003',
    name: 'Rainbow Feather Dream Catcher',
    description: 'Colorful dream catcher with rainbow feathers and beads.',
    price: 999,
    category: 'Dream Catcher',
    images: ['https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=600&h=600&fit=crop'],
    catalogNumber: 'DC-003',
    in_stock: true,
    stock_quantity: 15,
    featured: true,
    rating: 4.8,
    reviews: 18
  },
  {
    id: 'dc-004',
    name: 'Woodland Spirit Dream Catcher',
    description: 'Earthy tones with natural wood elements and forest-themed beads.',
    price: 1499,
    category: 'Dream Catcher',
    images: ['https://images.unsplash.com/photo-1595867865639-676c21c90969?w=600&h=600&fit=crop'],
    catalogNumber: 'DC-004',
    in_stock: true,
    stock_quantity: 6,
    featured: false,
    rating: 4.6,
    reviews: 12
  },
  {
    id: 'dc-005',
    name: 'Triple Moon Goddess Catcher',
    description: 'Three-tiered dream catcher representing the triple goddess.',
    price: 1799,
    category: 'Dream Catcher',
    images: ['https://images.unsplash.com/photo-1583225173442-9bdb73e83c27?w=600&h=600&fit=crop'],
    catalogNumber: 'DC-005',
    in_stock: true,
    stock_quantity: 10,
    featured: true,
    rating: 4.9,
    reviews: 22
  },
  {
    id: 'dc-006',
    name: 'Crystal Healing Dream Catcher',
    description: 'Infused with healing crystals and chakra stones.',
    price: 2199,
    category: 'Dream Catcher',
    images: ['https://images.unsplash.com/photo-1526047932273-341f2a7631f9?w=600&h=600&fit=crop'],
    catalogNumber: 'DC-006',
    in_stock: true,
    stock_quantity: 5,
    featured: false,
    rating: 5.0,
    reviews: 8
  },
  {
    id: 'dc-007',
    name: 'Mini Dream Catcher Set',
    description: 'Set of 3 mini dream catchers for car or window decoration.',
    price: 699,
    category: 'Dream Catcher',
    images: ['https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=600&h=600&fit=crop'],
    catalogNumber: 'DC-007',
    in_stock: true,
    stock_quantity: 25,
    featured: false,
    rating: 4.5,
    reviews: 30
  },
  {
    id: 'dc-008',
    name: 'Peacock Feather Dream Catcher',
    description: 'Luxurious dream catcher with genuine peacock feathers.',
    price: 2499,
    category: 'Dream Catcher',
    images: ['https://images.unsplash.com/photo-1595867865639-676c21c90969?w=600&h=600&fit=crop'],
    catalogNumber: 'DC-008',
    in_stock: true,
    stock_quantity: 4,
    featured: true,
    rating: 4.9,
    reviews: 14
  },
  {
    id: 'dc-009',
    name: 'Nautical Dream Catcher',
    description: 'Beach-themed with shells, starfish, and ocean colors.',
    price: 1399,
    category: 'Dream Catcher',
    images: ['https://images.unsplash.com/photo-1583225173442-9bdb73e83c27?w=600&h=600&fit=crop'],
    catalogNumber: 'DC-009',
    in_stock: true,
    stock_quantity: 11,
    featured: false,
    rating: 4.7,
    reviews: 16
  },
  {
    id: 'dc-010',
    name: 'Vintage Lace Dream Catcher',
    description: 'Delicate lace doily center with vintage ribbon.',
    price: 1199,
    category: 'Dream Catcher',
    images: ['https://images.unsplash.com/photo-1526047932273-341f2a7631f9?w=600&h=600&fit=crop'],
    catalogNumber: 'DC-010',
    in_stock: true,
    stock_quantity: 9,
    featured: false,
    rating: 4.8,
    reviews: 20
  },

  // ============ EMBROIDERY (10 products) ============
  {
    id: 'emb-001',
    name: 'Floral Hoop Art',
    description: 'Delicate hand-embroidered floral design on linen fabric.',
    price: 899,
    category: 'Embroidery',
    images: ['https://images.unsplash.com/photo-1628266236306-0b1a20d40e02?w=600&h=600&fit=crop'],
    catalogNumber: 'EMB-001',
    in_stock: true,
    stock_quantity: 5,
    featured: true,
    rating: 5.0,
    reviews: 8
  },
  {
    id: 'emb-002',
    name: 'Custom Name Embroidery',
    description: 'Personalized name embroidery with floral border.',
    price: 1499,
    category: 'Embroidery',
    images: ['https://images.unsplash.com/photo-1617336117210-98759d627586?w=600&h=600&fit=crop'],
    catalogNumber: 'EMB-002',
    in_stock: true,
    stock_quantity: 20,
    featured: false,
    rating: 4.8,
    reviews: 32
  },
  {
    id: 'emb-003',
    name: 'Embroidered Cushion Cover',
    description: 'Bohemian pattern cushion cover with colorful threads.',
    price: 799,
    category: 'Embroidery',
    images: ['https://images.unsplash.com/photo-1523293836414-90fa84428319?w=600&h=600&fit=crop'],
    catalogNumber: 'EMB-003',
    in_stock: true,
    stock_quantity: 12,
    featured: true,
    rating: 4.7,
    reviews: 25
  },
  {
    id: 'emb-004',
    name: 'Botanical Wall Art',
    description: 'Detailed botanical embroidery with Latin names.',
    price: 1299,
    category: 'Embroidery',
    images: ['https://images.unsplash.com/photo-1628266236306-0b1a20d40e02?w=600&h=600&fit=crop'],
    catalogNumber: 'EMB-004',
    in_stock: true,
    stock_quantity: 8,
    featured: false,
    rating: 4.9,
    reviews: 15
  },
  {
    id: 'emb-005',
    name: 'Modern Abstract Hoop',
    description: 'Contemporary abstract design in pastel colors.',
    price: 999,
    category: 'Embroidery',
    images: ['https://images.unsplash.com/photo-1617336117210-98759d627586?w=600&h=600&fit=crop'],
    catalogNumber: 'EMB-005',
    in_stock: true,
    stock_quantity: 14,
    featured: false,
    rating: 4.6,
    reviews: 18
  },
  {
    id: 'emb-006',
    name: 'Baby Birth Announcement',
    description: 'Custom embroidered birth details for nursery.',
    price: 1699,
    category: 'Embroidery',
    images: ['https://images.unsplash.com/photo-1523293836414-90fa84428319?w=600&h=600&fit=crop'],
    catalogNumber: 'EMB-006',
    in_stock: true,
    stock_quantity: 6,
    featured: true,
    rating: 5.0,
    reviews: 12
  },
  {
    id: 'emb-007',
    name: 'Mandala Embroidery',
    description: 'Intricate mandala pattern in metallic threads.',
    price: 1399,
    category: 'Embroidery',
    images: ['https://images.unsplash.com/photo-1628266236306-0b1a20d40e02?w=600&h=600&fit=crop'],
    catalogNumber: 'EMB-007',
    in_stock: true,
    stock_quantity: 7,
    featured: false,
    rating: 4.8,
    reviews: 21
  },
  {
    id: 'emb-008',
    name: 'Landscape Stitch Art',
    description: 'Mountain and forest landscape embroidered scene.',
    price: 1899,
    category: 'Embroidery',
    images: ['https://images.unsplash.com/photo-1617336117210-98759d627586?w=600&h=600&fit=crop'],
    catalogNumber: 'EMB-008',
    in_stock: true,
    stock_quantity: 5,
    featured: true,
    rating: 4.9,
    reviews: 10
  },
  {
    id: 'emb-009',
    name: 'Pet Portrait Embroidery',
    description: 'Custom embroidered portrait of your pet.',
    price: 2199,
    category: 'Embroidery',
    images: ['https://images.unsplash.com/photo-1523293836414-90fa84428319?w=600&h=600&fit=crop'],
    catalogNumber: 'EMB-009',
    in_stock: true,
    stock_quantity: 10,
    featured: false,
    rating: 5.0,
    reviews: 28
  },
  {
    id: 'emb-010',
    name: 'Vintage Sampler Hoop',
    description: 'Traditional cross-stitch sampler with alphabet.',
    price: 849,
    category: 'Embroidery',
    images: ['https://images.unsplash.com/photo-1628266236306-0b1a20d40e02?w=600&h=600&fit=crop'],
    catalogNumber: 'EMB-010',
    in_stock: true,
    stock_quantity: 16,
    featured: false,
    rating: 4.7,
    reviews: 19
  },

  // ============ LIPPAN ARTS (10 products) ============
  {
    id: 'lip-001',
    name: 'Traditional Kutch Mud Work',
    description: 'Authentic Lippan Kam wall panel with mirrors.',
    price: 2499,
    category: 'Lippan Arts',
    images: ['https://images.unsplash.com/photo-1629196914375-f7e48f477b6d?w=600&h=600&fit=crop'],
    catalogNumber: 'LIP-001',
    in_stock: true,
    stock_quantity: 3,
    featured: true,
    rating: 4.9,
    reviews: 10
  },
  {
    id: 'lip-002',
    name: 'Peacock Lippan Panel',
    description: 'Colorful peacock design with mirror work.',
    price: 2899,
    category: 'Lippan Arts',
    images: ['https://images.unsplash.com/photo-1584552528352-7c3042e61626?w=600&h=600&fit=crop'],
    catalogNumber: 'LIP-002',
    in_stock: true,
    stock_quantity: 4,
    featured: true,
    rating: 5.0,
    reviews: 7
  },
  {
    id: 'lip-003',
    name: 'Floral Mandala Lippan',
    description: 'Circular mandala with intricate floral patterns.',
    price: 1999,
    category: 'Lippan Arts',
    images: ['https://images.unsplash.com/photo-1629196914375-f7e48f477b6d?w=600&h=600&fit=crop'],
    catalogNumber: 'LIP-003',
    in_stock: true,
    stock_quantity: 6,
    featured: false,
    rating: 4.8,
    reviews: 12
  },
  {
    id: 'lip-004',
    name: 'Ganesha Lippan Wall Art',
    description: 'Lord Ganesha design with traditional mirror work.',
    price: 3299,
    category: 'Lippan Arts',
    images: ['https://images.unsplash.com/photo-1584552528352-7c3042e61626?w=600&h=600&fit=crop'],
    catalogNumber: 'LIP-004',
    in_stock: true,
    stock_quantity: 2,
    featured: true,
    rating: 5.0,
    reviews: 5
  },
  {
    id: 'lip-005',
    name: 'Tribal Pattern Lippan',
    description: 'Traditional tribal motifs with clay and mirrors.',
    price: 2199,
    category: 'Lippan Arts',
    images: ['https://images.unsplash.com/photo-1629196914375-f7e48f477b6d?w=600&h=600&fit=crop'],
    catalogNumber: 'LIP-005',
    in_stock: true,
    stock_quantity: 5,
    featured: false,
    rating: 4.7,
    reviews: 9
  },
  {
    id: 'lip-006',
    name: 'Elephant Lippan Decor',
    description: 'Royal elephant design with gold accents.',
    price: 2699,
    category: 'Lippan Arts',
    images: ['https://images.unsplash.com/photo-1584552528352-7c3042e61626?w=600&h=600&fit=crop'],
    catalogNumber: 'LIP-006',
    in_stock: true,
    stock_quantity: 4,
    featured: false,
    rating: 4.9,
    reviews: 8
  },
  {
    id: 'lip-007',
    name: 'Geometric Lippan Panel',
    description: 'Modern geometric patterns in traditional style.',
    price: 1899,
    category: 'Lippan Arts',
    images: ['https://images.unsplash.com/photo-1629196914375-f7e48f477b6d?w=600&h=600&fit=crop'],
    catalogNumber: 'LIP-007',
    in_stock: true,
    stock_quantity: 7,
    featured: false,
    rating: 4.6,
    reviews: 11
  },
  {
    id: 'lip-008',
    name: 'Tree of Life Lippan',
    description: 'Sacred tree of life with mirror embellishments.',
    price: 2999,
    category: 'Lippan Arts',
    images: ['https://images.unsplash.com/photo-1584552528352-7c3042e61626?w=600&h=600&fit=crop'],
    catalogNumber: 'LIP-008',
    in_stock: true,
    stock_quantity: 3,
    featured: true,
    rating: 5.0,
    reviews: 6
  },
  {
    id: 'lip-009',
    name: 'Om Symbol Lippan',
    description: 'Sacred Om symbol in traditional Kutch style.',
    price: 2399,
    category: 'Lippan Arts',
    images: ['https://images.unsplash.com/photo-1629196914375-f7e48f477b6d?w=600&h=600&fit=crop'],
    catalogNumber: 'LIP-009',
    in_stock: true,
    stock_quantity: 5,
    featured: false,
    rating: 4.8,
    reviews: 13
  },
  {
    id: 'lip-010',
    name: 'Camel Caravan Lippan',
    description: 'Desert scene with camel caravan and mirrors.',
    price: 3099,
    category: 'Lippan Arts',
    images: ['https://images.unsplash.com/photo-1584552528352-7c3042e61626?w=600&h=600&fit=crop'],
    catalogNumber: 'LIP-010',
    in_stock: true,
    stock_quantity: 2,
    featured: false,
    rating: 4.9,
    reviews: 4
  },

  // ============ RESIN ART WORK (10 products) ============
  {
    id: 'res-001',
    name: 'Ocean Waves Resin Clock',
    description: 'Stunning wall clock with realistic ocean waves.',
    price: 3299,
    category: 'Resin Art Work',
    images: ['https://images.unsplash.com/photo-1615457938967-672945c71a33?w=600&h=600&fit=crop'],
    catalogNumber: 'RES-001',
    in_stock: true,
    stock_quantity: 4,
    featured: true,
    rating: 5.0,
    reviews: 18
  },
  {
    id: 'res-002',
    name: 'Floral Resin Coasters (Set of 4)',
    description: 'Elegant coasters with preserved flowers and gold flakes.',
    price: 1299,
    category: 'Resin Art Work',
    images: ['https://images.unsplash.com/photo-1615457938883-71f45617a223?w=600&h=600&fit=crop'],
    catalogNumber: 'RES-002',
    in_stock: true,
    stock_quantity: 15,
    featured: false,
    rating: 4.6,
    reviews: 22
  },
  {
    id: 'res-003',
    name: 'Galaxy Resin Tray',
    description: 'Serving tray with swirling galaxy colors.',
    price: 2199,
    category: 'Resin Art Work',
    images: ['https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=600&h=600&fit=crop'],
    catalogNumber: 'RES-003',
    in_stock: true,
    stock_quantity: 8,
    featured: true,
    rating: 4.9,
    reviews: 16
  },
  {
    id: 'res-004',
    name: 'Geode Resin Artwork',
    description: 'Luxurious geode-inspired wall art with gold leaf.',
    price: 4299,
    category: 'Resin Art Work',
    images: ['https://images.unsplash.com/photo-1615457938967-672945c71a33?w=600&h=600&fit=crop'],
    catalogNumber: 'RES-004',
    in_stock: true,
    stock_quantity: 3,
    featured: true,
    rating: 5.0,
    reviews: 11
  },
  {
    id: 'res-005',
    name: 'Resin Jewelry Dish',
    description: 'Small trinket dish with pastel marble effect.',
    price: 699,
    category: 'Resin Art Work',
    images: ['https://images.unsplash.com/photo-1615457938883-71f45617a223?w=600&h=600&fit=crop'],
    catalogNumber: 'RES-005',
    in_stock: true,
    stock_quantity: 20,
    featured: false,
    rating: 4.5,
    reviews: 28
  },
  {
    id: 'res-006',
    name: 'Butterfly Resin Bookmark',
    description: 'Preserved butterfly wing in resin bookmark.',
    price: 499,
    category: 'Resin Art Work',
    images: ['https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=600&h=600&fit=crop'],
    catalogNumber: 'RES-006',
    in_stock: true,
    stock_quantity: 25,
    featured: false,
    rating: 4.7,
    reviews: 35
  },
  {
    id: 'res-007',
    name: 'Agate Slice Resin Table',
    description: 'Coffee table with agate slice design.',
    price: 12999,
    category: 'Resin Art Work',
    images: ['https://images.unsplash.com/photo-1615457938967-672945c71a33?w=600&h=600&fit=crop'],
    catalogNumber: 'RES-007',
    in_stock: true,
    stock_quantity: 1,
    featured: true,
    rating: 5.0,
    reviews: 3
  },
  {
    id: 'res-008',
    name: 'Resin Phone Stand',
    description: 'Functional phone holder with marble pattern.',
    price: 899,
    category: 'Resin Art Work',
    images: ['https://images.unsplash.com/photo-1615457938883-71f45617a223?w=600&h=600&fit=crop'],
    catalogNumber: 'RES-008',
    in_stock: true,
    stock_quantity: 12,
    featured: false,
    rating: 4.6,
    reviews: 19
  },
  {
    id: 'res-009',
    name: 'Sunset Resin Wall Art',
    description: 'Circular wall art with sunset gradient.',
    price: 3799,
    category: 'Resin Art Work',
    images: ['https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=600&h=600&fit=crop'],
    catalogNumber: 'RES-009',
    in_stock: true,
    stock_quantity: 5,
    featured: true,
    rating: 4.9,
    reviews: 14
  },
  {
    id: 'res-010',
    name: 'Resin Letter Keychains',
    description: 'Personalized initial keychain with flowers.',
    price: 399,
    category: 'Resin Art Work',
    images: ['https://images.unsplash.com/photo-1615457938883-71f45617a223?w=600&h=600&fit=crop'],
    catalogNumber: 'RES-010',
    in_stock: true,
    stock_quantity: 30,
    featured: false,
    rating: 4.8,
    reviews: 42
  },

  // ============ ILLUSTRATION (10 products) ============
  {
    id: 'ill-001',
    name: 'Custom Couple Portrait',
    description: 'Digital illustration of couple on archival paper.',
    price: 1999,
    category: 'Illustration',
    images: ['https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600&h=600&fit=crop'],
    catalogNumber: 'ILL-001',
    in_stock: true,
    stock_quantity: 999,
    featured: true,
    rating: 5.0,
    reviews: 40
  },
  {
    id: 'ill-002',
    name: 'Pet Portrait Illustration',
    description: 'Watercolor-style portrait of your beloved pet.',
    price: 1699,
    category: 'Illustration',
    images: ['https://images.unsplash.com/photo-1544531586-fde5298cdd40?w=600&h=600&fit=crop'],
    catalogNumber: 'ILL-002',
    in_stock: true,
    stock_quantity: 999,
    featured: true,
    rating: 4.9,
    reviews: 52
  },
  {
    id: 'ill-003',
    name: 'Family Portrait Art',
    description: 'Cartoon-style family illustration.',
    price: 2499,
    category: 'Illustration',
    images: ['https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600&h=600&fit=crop'],
    catalogNumber: 'ILL-003',
    in_stock: true,
    stock_quantity: 999,
    featured: false,
    rating: 5.0,
    reviews: 36
  },
  {
    id: 'ill-004',
    name: 'Birth Announcement Card',
    description: 'Custom illustrated birth announcement.',
    price: 899,
    category: 'Illustration',
    images: ['https://images.unsplash.com/photo-1544531586-fde5298cdd40?w=600&h=600&fit=crop'],
    catalogNumber: 'ILL-004',
    in_stock: true,
    stock_quantity: 999,
    featured: false,
    rating: 4.8,
    reviews: 28
  },
  {
    id: 'ill-005',
    name: 'House Portrait',
    description: 'Detailed illustration of your home.',
    price: 2199,
    category: 'Illustration',
    images: ['https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600&h=600&fit=crop'],
    catalogNumber: 'ILL-005',
    in_stock: true,
    stock_quantity: 999,
    featured: true,
    rating: 4.9,
    reviews: 22
  },
  {
    id: 'ill-006',
    name: 'Wedding Invitation Design',
    description: 'Custom illustrated wedding invitation.',
    price: 1499,
    category: 'Illustration',
    images: ['https://images.unsplash.com/photo-1544531586-fde5298cdd40?w=600&h=600&fit=crop'],
    catalogNumber: 'ILL-006',
    in_stock: true,
    stock_quantity: 999,
    featured: false,
    rating: 5.0,
    reviews: 44
  },
  {
    id: 'ill-007',
    name: 'Avatar Creation',
    description: 'Personalized digital avatar in your style.',
    price: 699,
    category: 'Illustration',
    images: ['https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600&h=600&fit=crop'],
    catalogNumber: 'ILL-007',
    in_stock: true,
    stock_quantity: 999,
    featured: false,
    rating: 4.7,
    reviews: 68
  },
  {
    id: 'ill-008',
    name: 'Botanical Print Set',
    description: 'Set of 3 botanical illustrations.',
    price: 1299,
    category: 'Illustration',
    images: ['https://images.unsplash.com/photo-1544531586-fde5298cdd40?w=600&h=600&fit=crop'],
    catalogNumber: 'ILL-008',
    in_stock: true,
    stock_quantity: 999,
    featured: false,
    rating: 4.8,
    reviews: 31
  },
  {
    id: 'ill-009',
    name: 'Book Cover Illustration',
    description: 'Custom book cover or poster design.',
    price: 2999,
    category: 'Illustration',
    images: ['https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600&h=600&fit=crop'],
    catalogNumber: 'ILL-009',
    in_stock: true,
    stock_quantity: 999,
    featured: true,
    rating: 5.0,
    reviews: 15
  },
  {
    id: 'ill-010',
    name: 'Map Illustration',
    description: 'Custom illustrated map of special location.',
    price: 1899,
    category: 'Illustration',
    images: ['https://images.unsplash.com/photo-1544531586-fde5298cdd40?w=600&h=600&fit=crop'],
    catalogNumber: 'ILL-010',
    in_stock: true,
    stock_quantity: 999,
    featured: false,
    rating: 4.9,
    reviews: 19
  },

  // ============ CANDLES (10 products) ============
  {
    id: 'can-001',
    name: 'Lavender Bliss Soy Candle',
    description: 'Hand-poured soy candle with calming lavender.',
    price: 599,
    category: 'Candles',
    images: ['https://images.unsplash.com/photo-1602826347632-004a6d06443e?w=600&h=600&fit=crop'],
    catalogNumber: 'CAN-001',
    in_stock: true,
    stock_quantity: 50,
    featured: false,
    rating: 4.8,
    reviews: 45
  },
  {
    id: 'can-002',
    name: 'Bubble Cube Candle',
    description: 'Trendy aesthetic bubble cube candle.',
    price: 399,
    category: 'Candles',
    images: ['https://images.unsplash.com/photo-1612152605347-f932c6f655e9?w=600&h=600&fit=crop'],
    catalogNumber: 'CAN-002',
    in_stock: true,
    stock_quantity: 30,
    featured: true,
    rating: 4.7,
    reviews: 28
  },
  {
    id: 'can-003',
    name: 'Vanilla Bean Candle',
    description: 'Rich vanilla scented candle in glass jar.',
    price: 649,
    category: 'Candles',
    images: ['https://images.unsplash.com/photo-1570823635306-250abb06d4b3?w=600&h=600&fit=crop'],
    catalogNumber: 'CAN-003',
    in_stock: true,
    stock_quantity: 40,
    featured: false,
    rating: 4.9,
    reviews: 38
  },
  {
    id: 'can-004',
    name: 'Cinnamon Spice Candle',
    description: 'Warm cinnamon and spice blend candle.',
    price: 699,
    category: 'Candles',
    images: ['https://images.unsplash.com/photo-1602826347632-004a6d06443e?w=600&h=600&fit=crop'],
    catalogNumber: 'CAN-004',
    in_stock: true,
    stock_quantity: 35,
    featured: true,
    rating: 4.8,
    reviews: 42
  },
  {
    id: 'can-005',
    name: 'Rose Garden Candle',
    description: 'Fresh rose scent with dried rose petals.',
    price: 749,
    category: 'Candles',
    images: ['https://images.unsplash.com/photo-1570823635306-250abb06d4b3?w=600&h=600&fit=crop'],
    catalogNumber: 'CAN-005',
    in_stock: true,
    stock_quantity: 28,
    featured: false,
    rating: 4.9,
    reviews: 33
  },
  {
    id: 'can-006',
    name: 'Ocean Breeze Candle',
    description: 'Fresh ocean scent for relaxation.',
    price: 599,
    category: 'Candles',
    images: ['https://images.unsplash.com/photo-1602826347632-004a6d06443e?w=600&h=600&fit=crop'],
    catalogNumber: 'CAN-006',
    in_stock: true,
    stock_quantity: 45,
    featured: false,
    rating: 4.7,
    reviews: 36
  },
  {
    id: 'can-007',
    name: 'Coffee Shop Candle',
    description: 'Rich coffee aroma candle.',
    price: 649,
    category: 'Candles',
    images: ['https://images.unsplash.com/photo-1570823635306-250abb06d4b3?w=600&h=600&fit=crop'],
    catalogNumber: 'CAN-007',
    in_stock: true,
    stock_quantity: 32,
    featured: false,
    rating: 4.8,
    reviews: 29
  },
  {
    id: 'can-008',
    name: 'Citrus Burst Candle',
    description: 'Energizing citrus blend candle.',
    price: 599,
    category: 'Candles',
    images: ['https://images.unsplash.com/photo-1602826347632-004a6d06443e?w=600&h=600&fit=crop'],
    catalogNumber: 'CAN-008',
    in_stock: true,
    stock_quantity: 38,
    featured: false,
    rating: 4.6,
    reviews: 31
  },
  {
    id: 'can-009',
    name: 'Sandalwood Luxury Candle',
    description: 'Premium sandalwood scented candle.',
    price: 899,
    category: 'Candles',
    images: ['https://images.unsplash.com/photo-1570823635306-250abb06d4b3?w=600&h=600&fit=crop'],
    catalogNumber: 'CAN-009',
    in_stock: true,
    stock_quantity: 20,
    featured: true,
    rating: 5.0,
    reviews: 25
  },
  {
    id: 'can-010',
    name: 'Eucalyptus Mint Candle',
    description: 'Refreshing eucalyptus and mint blend.',
    price: 649,
    category: 'Candles',
    images: ['https://images.unsplash.com/photo-1602826347632-004a6d06443e?w=600&h=600&fit=crop'],
    catalogNumber: 'CAN-010',
    in_stock: true,
    stock_quantity: 34,
    featured: false,
    rating: 4.7,
    reviews: 27
  },

  // ============ CALLIGRAPHY (10 products) ============
  {
    id: 'cal-001',
    name: 'Inspirational Quote Frame',
    description: 'Hand-lettered quote on handmade paper.',
    price: 699,
    category: 'Calligraphy',
    images: ['https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=600&h=600&fit=crop'],
    catalogNumber: 'CAL-001',
    in_stock: true,
    stock_quantity: 10,
    featured: false,
    rating: 4.5,
    reviews: 12
  },
  {
    id: 'cal-002',
    name: 'Custom Name Sign',
    description: 'Elegant calligraphy name for nursery or home.',
    price: 1299,
    category: 'Calligraphy',
    images: ['https://images.unsplash.com/photo-1455849318743-b2233052fcff?w=600&h=600&fit=crop'],
    catalogNumber: 'CAL-002',
    in_stock: true,
    stock_quantity: 15,
    featured: true,
    rating: 4.9,
    reviews: 22
  },
  {
    id: 'cal-003',
    name: 'Wedding Vows Art',
    description: 'Your wedding vows in beautiful calligraphy.',
    price: 1899,
    category: 'Calligraphy',
    images: ['https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=600&h=600&fit=crop'],
    catalogNumber: 'CAL-003',
    in_stock: true,
    stock_quantity: 8,
    featured: true,
    rating: 5.0,
    reviews: 18
  },
  {
    id: 'cal-004',
    name: 'Arabic Calligraphy Art',
    description: 'Traditional Arabic script wall art.',
    price: 1599,
    category: 'Calligraphy',
    images: ['https://images.unsplash.com/photo-1455849318743-b2233052fcff?w=600&h=600&fit=crop'],
    catalogNumber: 'CAL-004',
    in_stock: true,
    stock_quantity: 6,
    featured: false,
    rating: 4.8,
    reviews: 14
  },
  {
    id: 'cal-005',
    name: 'Love Letter Calligraphy',
    description: 'Romantic love letter in cursive script.',
    price: 899,
    category: 'Calligraphy',
    images: ['https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=600&h=600&fit=crop'],
    catalogNumber: 'CAL-005',
    in_stock: true,
    stock_quantity: 12,
    featured: false,
    rating: 4.7,
    reviews: 16
  },
  {
    id: 'cal-006',
    name: 'Family Tree Calligraphy',
    description: 'Family names in decorative tree design.',
    price: 2199,
    category: 'Calligraphy',
    images: ['https://images.unsplash.com/photo-1455849318743-b2233052fcff?w=600&h=600&fit=crop'],
    catalogNumber: 'CAL-006',
    in_stock: true,
    stock_quantity: 5,
    featured: true,
    rating: 5.0,
    reviews: 10
  },
  {
    id: 'cal-007',
    name: 'Poetry Calligraphy',
    description: 'Your favorite poem in elegant script.',
    price: 1499,
    category: 'Calligraphy',
    images: ['https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=600&h=600&fit=crop'],
    catalogNumber: 'CAL-007',
    in_stock: true,
    stock_quantity: 9,
    featured: false,
    rating: 4.8,
    reviews: 13
  },
  {
    id: 'cal-008',
    name: 'Scripture Verse Art',
    description: 'Religious verse in beautiful calligraphy.',
    price: 1099,
    category: 'Calligraphy',
    images: ['https://images.unsplash.com/photo-1455849318743-b2233052fcff?w=600&h=600&fit=crop'],
    catalogNumber: 'CAL-008',
    in_stock: true,
    stock_quantity: 11,
    featured: false,
    rating: 4.9,
    reviews: 20
  },
  {
    id: 'cal-009',
    name: 'Zodiac Sign Calligraphy',
    description: 'Your zodiac constellation in gold ink.',
    price: 799,
    category: 'Calligraphy',
    images: ['https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=600&h=600&fit=crop'],
    catalogNumber: 'CAL-009',
    in_stock: true,
    stock_quantity: 14,
    featured: false,
    rating: 4.6,
    reviews: 17
  },
  {
    id: 'cal-010',
    name: 'Gift Tags Set',
    description: 'Set of 20 hand-lettered gift tags.',
    price: 499,
    category: 'Calligraphy',
    images: ['https://images.unsplash.com/photo-1455849318743-b2233052fcff?w=600&h=600&fit=crop'],
    catalogNumber: 'CAL-010',
    in_stock: true,
    stock_quantity: 25,
    featured: false,
    rating: 4.7,
    reviews: 32
  },

  // ============ HAIR ACCESSORIES (10 products) ============
  {
    id: 'hair-001',
    name: 'Pearl Embellished Headband',
    description: 'Luxurious velvet headband with faux pearls.',
    price: 499,
    category: 'Hair Accessories',
    images: ['https://images.unsplash.com/photo-1596462502278-27bfdd403ccc?w=600&h=600&fit=crop'],
    catalogNumber: 'HAIR-001',
    in_stock: true,
    stock_quantity: 25,
    featured: true,
    rating: 4.8,
    reviews: 30
  },
  {
    id: 'hair-002',
    name: 'Silk Scrunchie Set',
    description: 'Set of 3 pure silk scrunchies.',
    price: 599,
    category: 'Hair Accessories',
    images: ['https://images.unsplash.com/photo-1600607686527-6fb886090705?w=600&h=600&fit=crop'],
    catalogNumber: 'HAIR-002',
    in_stock: true,
    stock_quantity: 40,
    featured: false,
    rating: 4.9,
    reviews: 50
  },
  {
    id: 'hair-003',
    name: 'Flower Crown',
    description: 'Handmade flower crown for special occasions.',
    price: 899,
    category: 'Hair Accessories',
    images: ['https://images.unsplash.com/photo-1589156280159-27698a70f29e?w=600&h=600&fit=crop'],
    catalogNumber: 'HAIR-003',
    in_stock: true,
    stock_quantity: 12,
    featured: true,
    rating: 5.0,
    reviews: 24
  },
  {
    id: 'hair-004',
    name: 'Vintage Hair Clips Set',
    description: 'Set of 5 vintage-style hair clips.',
    price: 399,
    category: 'Hair Accessories',
    images: ['https://images.unsplash.com/photo-1596462502278-27bfdd403ccc?w=600&h=600&fit=crop'],
    catalogNumber: 'HAIR-004',
    in_stock: true,
    stock_quantity: 35,
    featured: false,
    rating: 4.7,
    reviews: 42
  },
  {
    id: 'hair-005',
    name: 'Bridal Hair Comb',
    description: 'Elegant crystal and pearl bridal comb.',
    price: 1499,
    category: 'Hair Accessories',
    images: ['https://images.unsplash.com/photo-1589156280159-27698a70f29e?w=600&h=600&fit=crop'],
    catalogNumber: 'HAIR-005',
    in_stock: true,
    stock_quantity: 8,
    featured: true,
    rating: 5.0,
    reviews: 18
  },
  {
    id: 'hair-006',
    name: 'Boho Turban Headband',
    description: 'Soft jersey knit turban headband.',
    price: 349,
    category: 'Hair Accessories',
    images: ['https://images.unsplash.com/photo-1596462502278-27bfdd403ccc?w=600&h=600&fit=crop'],
    catalogNumber: 'HAIR-006',
    in_stock: true,
    stock_quantity: 28,
    featured: false,
    rating: 4.6,
    reviews: 35
  },
  {
    id: 'hair-007',
    name: 'Crystal Bobby Pins',
    description: 'Set of 10 crystal-topped bobby pins.',
    price: 299,
    category: 'Hair Accessories',
    images: ['https://images.unsplash.com/photo-1600607686527-6fb886090705?w=600&h=600&fit=crop'],
    catalogNumber: 'HAIR-007',
    in_stock: true,
    stock_quantity: 45,
    featured: false,
    rating: 4.5,
    reviews: 38
  },
  {
    id: 'hair-008',
    name: 'Velvet Bow Hair Tie',
    description: 'Large velvet bow scrunchie.',
    price: 449,
    category: 'Hair Accessories',
    images: ['https://images.unsplash.com/photo-1596462502278-27bfdd403ccc?w=600&h=600&fit=crop'],
    catalogNumber: 'HAIR-008',
    in_stock: true,
    stock_quantity: 30,
    featured: false,
    rating: 4.8,
    reviews: 26
  },
  {
    id: 'hair-009',
    name: 'Hair Vine Accessory',
    description: 'Delicate gold leaf and crystal hair vine.',
    price: 1299,
    category: 'Hair Accessories',
    images: ['https://images.unsplash.com/photo-1589156280159-27698a70f29e?w=600&h=600&fit=crop'],
    catalogNumber: 'HAIR-009',
    in_stock: true,
    stock_quantity: 10,
    featured: true,
    rating: 4.9,
    reviews: 21
  },
  {
    id: 'hair-010',
    name: 'Satin Sleep Bonnet',
    description: 'Protective satin bonnet for sleeping.',
    price: 399,
    category: 'Hair Accessories',
    images: ['https://images.unsplash.com/photo-1600607686527-6fb886090705?w=600&h=600&fit=crop'],
    catalogNumber: 'HAIR-010',
    in_stock: true,
    stock_quantity: 38,
    featured: false,
    rating: 4.7,
    reviews: 44
  },
];

// Product service class
export class ProductService {
  private static products = PRODUCTS_DATABASE;

  static getAllProducts(): Product[] {
    return [...this.products];
  }

  static async fetchProductsFromSupabase(): Promise<Product[]> {
    try {
      const { data, error } = await supabase.from('products').select('*');
      if (error || !data || data.length === 0) return this.products;

      return data.map(item => ({
        id: item.id,
        name: item.name,
        description: item.description || '',
        price: item.price,
        category: item.category,
        images: item.images || [],
        catalogNumber: item.catalog_number,
        in_stock: item.in_stock || false,
        stock_quantity: item.stock_quantity || 0,
        featured: item.featured || false,
        rating: item.rating || 0,
        reviews: item.reviews || 0,
      }));
    } catch (error) {
      return this.products;
    }
  }

  static getProductById(id: string): Product | null {
    return this.products.find(p => p.id === id) || null;
  }

  static getProductsByCategory(category: string): Product[] {
    if (category === 'all') return this.getAllProducts();
    return this.products.filter(p => p.category === category);
  }

  static getFeaturedProducts(): Product[] {
    return this.products.filter(p => p.featured);
  }

  static searchProducts(query: string): Product[] {
    const q = query.toLowerCase();
    return this.products.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    );
  }

  static getCategories(): string[] {
    return [...new Set(this.products.map(p => p.category))].sort();
  }

  static getCategoryWithCount() {
    const categories = this.getCategories();
    return categories.map(category => ({
      name: category,
      count: this.getProductsByCategory(category).length,
      featured_image: this.getProductsByCategory(category)[0]?.images[0] || '/placeholder.svg'
    }));
  }

  static async addProduct(product: Omit<Product, 'id'>): Promise<{ success: boolean; error?: any }> {
    try {
      const newProduct = { ...product, id: `local-${Date.now()}` };
      this.products.push(newProduct);

      const { error } = await supabase.from('products').insert({
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.category,
        images: product.images,
        catalog_number: product.catalogNumber,
        in_stock: product.in_stock,
        stock_quantity: product.stock_quantity,
        featured: product.featured,
        rating: product.rating,
        reviews: product.reviews
      });

      if (error) throw error;
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  }

  static async deleteProduct(id: string): Promise<{ success: boolean; error?: any }> {
    try {
      this.products = this.products.filter(p => p.id !== id);
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  }
}

export default ProductService;