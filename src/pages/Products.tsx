import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, ShoppingCart, Filter, Search, Grid, List } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Product } from '@/types/product';
import { useCart } from '@/contexts/CartContext';
import { ProductService } from '@/services/productService';

const ProductsPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // Get instant products from ProductService - GOD-LEVEL READY
  const initialProducts = ProductService.getAllProducts();
  
  // No more fallback products needed - we have real ones!
  const fallbackProducts: Product[] = [
    {
      id: '1',
      name: 'Mystic Dream Catcher',
      price: 299,
      category: 'Dream Catcher',
      images: ['/placeholder.svg'],
      description: 'Beautiful handcrafted dream catcher with intricate feather details',
      stock_quantity: 15,
      catalogNumber: 'DC001',
      in_stock: true,
      featured: true
    },
    {
      id: '2',
      name: 'Elegant Embroidered Pillow',
      price: 599,
      category: 'Embroidery',
      images: ['/placeholder.svg'],
      description: 'Premium embroidered cushion cover with traditional patterns',
      stock_quantity: 8,
      catalogNumber: 'EMB001',
      in_stock: true,
      featured: true
    },
    {
      id: '3',
      name: 'Mirror Work Wall Art',
      price: 899,
      category: 'Lippan Arts',
      images: ['/placeholder.svg'],
      description: 'Traditional Lippan art with intricate mirror work design',
      stock_quantity: 5,
      catalogNumber: 'LIP001',
      in_stock: true,
      featured: true
    },
    {
      id: '4',
      name: 'Ocean Wave Resin Coaster Set',
      price: 499,
      category: 'Resin Art Work',
      images: ['/placeholder.svg'],
      description: 'Set of 4 ocean-inspired resin coasters with gold accents',
      stock_quantity: 12,
      catalogNumber: 'RES001',
      in_stock: true,
      featured: true
    },
    {
      id: '5',
      name: 'Custom Portrait Illustration',
      price: 1299,
      category: 'Illustration',
      images: ['/placeholder.svg'],
      description: 'Personalized portrait illustration in watercolor style',
      stock_quantity: 20,
      catalogNumber: 'ILL001',
      in_stock: true,
      featured: true
    },
    {
      id: '6',
      name: 'Lavender Soy Candle',
      price: 349,
      category: 'Candles',
      images: ['/placeholder.svg'],
      description: 'Hand-poured soy candle with calming lavender scent',
      stock_quantity: 25,
      catalogNumber: 'CAN001',
      in_stock: true,
      featured: true
    },
    {
      id: '7',
      name: 'Wedding Calligraphy Set',
      price: 799,
      category: 'Calligraphy',
      images: ['/placeholder.svg'],
      description: 'Beautiful wedding invitation calligraphy with gold ink',
      stock_quantity: 10,
      catalogNumber: 'CAL001',
      in_stock: true,
      featured: true
    },
    {
      id: '8',
      name: 'Floral Hair Accessory Set',
      price: 199,
      category: 'Hair Accessories',
      images: ['/placeholder.svg'],
      description: 'Delicate floral hair clips and bands for special occasions',
      stock_quantity: 18,
      catalogNumber: 'HA001',
      in_stock: true,
      featured: true
    }
  ];

  // Initialize with real products instantly!
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [sortBy, setSortBy] = useState('newest');
  const [filterCategory, setFilterCategory] = useState(searchParams.get('category') || 'all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);

  const categories = [
    'Dream Catcher',
    'Embroidery', 
    'Lippan Arts',
    'Resin Art Work',
    'Illustration',
    'Candles',
    'Calligraphy',
    'Hair Accessories'
  ];

  // Load products based on category filter
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    loadProducts();
  }, [filterCategory, sortBy]);

  const loadProducts = () => {
    // Get products instantly from ProductService
    let fetchedProducts: Product[];
    
    if (filterCategory === 'all') {
      fetchedProducts = ProductService.getAllProducts();
    } else {
      fetchedProducts = ProductService.getProductsByCategory(filterCategory);
    }
    
    // Sort products
    const sortedProducts = [...fetchedProducts].sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'newest':
          return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
        default:
          return 0;
      }
    });
    
    setProducts(sortedProducts);
  };

  // Optimized filtering with useMemo
  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return products;
    
    return products.filter(product =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [products, searchQuery]);

  const handleCategoryChange = (category: string) => {
    setFilterCategory(category);
    
    // Update URL without page refresh
    const newURL = category === 'all' ? '/products' : `/products?category=${encodeURIComponent(category)}`;
    window.history.replaceState({}, '', newURL);
  };



  // ===== GOD-LEVEL PRODUCTS PAGE - COMPLETE REDESIGN =====
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-pink-900 relative overflow-hidden">
      <Header />
      
      {/* ===== GOD-LEVEL FLOATING PARTICLES ===== */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Large Gradient Orbs */}
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-gradient-to-br from-pink-500/30 via-rose-500/20 to-purple-500/30 rounded-full animate-float blur-3xl"></div>
        <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] bg-gradient-to-tr from-purple-500/25 via-pink-500/20 to-rose-500/25 rounded-full animate-float blur-3xl" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-20 right-20 w-64 h-64 bg-gradient-to-br from-rose-400/30 to-pink-500/40 rounded-full animate-pulse blur-2xl"></div>
        
        {/* Floating Particles */}
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-pink-400 rounded-full animate-twinkle"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              opacity: Math.random() * 0.5 + 0.3
            }}
          ></div>
        ))}
        
        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px] opacity-30"></div>
      </div>
      
      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* ===== GOD-LEVEL BREADCRUMB ===== */}
        <div className="flex items-center gap-3 mb-8 animate-fade-in">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-white/90 hover:text-pink-300 transition-all duration-300 bg-white/10 backdrop-blur-xl border-2 border-white/20 hover:border-pink-400/50 rounded-xl px-4 py-2 hover:scale-105 font-bold"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
          <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse"></div>
          <Badge className="bg-white/10 backdrop-blur-xl border-2 border-white/20 text-white font-black px-4 py-2">
            {filterCategory === 'all' ? 'All Products' : filterCategory}
          </Badge>
        </div>

        {/* ===== GOD-LEVEL PAGE HEADER WITH 3D TITLE ===== */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-gradient-to-r from-pink-400 to-purple-400 opacity-20 blur-3xl animate-pulse"></div>
            
            {/* 3D Title Effect */}
            <h1 className="text-5xl lg:text-7xl font-black leading-tight">
              <span className="block relative inline-block group">
                <span className="relative z-10 bg-gradient-to-r from-pink-300 via-rose-400 to-pink-500 bg-clip-text text-transparent animate-shimmer font-extrabold" style={{ textShadow: '0 0 60px rgba(236,72,153,0.8), 0 0 100px rgba(244,114,182,0.6)' }}>
                  {filterCategory === 'all' ? 'All Products' : filterCategory}
                </span>
                {/* 3D Shadow Layers */}
                <span className="absolute top-1 left-1 bg-gradient-to-r from-pink-600 via-rose-700 to-pink-800 bg-clip-text text-transparent opacity-30 blur-sm" aria-hidden="true">
                  {filterCategory === 'all' ? 'All Products' : filterCategory}
                </span>
                <span className="absolute top-2 left-2 bg-gradient-to-r from-pink-800 via-rose-900 to-pink-900 bg-clip-text text-transparent opacity-20 blur-md" aria-hidden="true">
                  {filterCategory === 'all' ? 'All Products' : filterCategory}
                </span>
                <div className="absolute -inset-4 bg-gradient-to-r from-pink-500/20 via-rose-500/30 to-pink-500/20 rounded-3xl blur-3xl -z-10"></div>
              </span>
            </h1>
          </div>
          
          <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed font-medium drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
            Discover our handcrafted{' '}
            <span className="bg-gradient-to-r from-pink-300 to-rose-400 bg-clip-text text-transparent font-black">
              {filterCategory === 'all' ? 'treasures' : filterCategory.toLowerCase()}
            </span>
            {' '}collection, each piece crafted with love
          </p>
          
          {/* Premium Stats */}
          <div className="flex items-center justify-center gap-3 mt-6">
            <div className="w-12 h-0.5 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full"></div>
            <span className="text-sm font-black text-pink-300 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full px-4 py-1">
              {filteredProducts.length} items
            </span>
            <div className="w-12 h-0.5 bg-gradient-to-r from-rose-500 to-pink-500 rounded-full"></div>
          </div>
        </div>

        {/* ===== GOD-LEVEL FILTERS & SEARCH ===== */}
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border-2 border-white/20 mb-12 hover:border-pink-400/50 transition-all duration-500">
          <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
            {/* Search Bar */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-pink-300 drop-shadow-[0_0_10px_rgba(236,72,153,0.8)]" />
                <Input
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-4 py-3 text-lg bg-white/10 backdrop-blur-xl border-2 border-white/20 focus:border-pink-400/50 text-white placeholder:text-white/50 font-medium rounded-xl shadow-xl"
                />
              </div>
            </div>
            
            {/* Filters */}
            <div className="flex flex-wrap items-center gap-4">
              {/* Category Filter */}
              <div className="flex items-center gap-3">
                <Filter className="h-5 w-5 text-pink-400 drop-shadow-[0_0_10px_rgba(236,72,153,0.8)]" />
                <Select value={filterCategory} onValueChange={handleCategoryChange}>
                  <SelectTrigger className="w-48 bg-white/10 backdrop-blur-xl border-2 border-white/20 text-white font-bold rounded-xl hover:border-pink-400/50 transition-all">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900/95 backdrop-blur-xl border-2 border-white/20">
                    <SelectItem value="all" className="text-white hover:bg-pink-500/20 font-bold">All Categories</SelectItem>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat} className="text-white hover:bg-pink-500/20 font-bold">
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Sort Filter */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-44 bg-white/10 backdrop-blur-xl border-2 border-white/20 text-white font-bold rounded-xl hover:border-pink-400/50 transition-all">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent className="bg-slate-900/95 backdrop-blur-xl border-2 border-white/20">
                  <SelectItem value="newest" className="text-white hover:bg-pink-500/20 font-bold">Newest First</SelectItem>
                  <SelectItem value="name" className="text-white hover:bg-pink-500/20 font-bold">Name (A-Z)</SelectItem>
                  <SelectItem value="price-low" className="text-white hover:bg-pink-500/20 font-bold">Price: Low to High</SelectItem>
                  <SelectItem value="price-high" className="text-white hover:bg-pink-500/20 font-bold">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>

              {/* View Toggle */}
              <div className="flex items-center gap-1 bg-white/10 backdrop-blur-xl rounded-lg p-1 border-2 border-white/20">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className={`h-8 w-8 p-0 transition-all duration-300 ${
                    viewMode === 'grid'
                      ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white'
                      : 'text-white/70 hover:text-white'
                  }`}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className={`h-8 w-8 p-0 transition-all duration-300 ${
                    viewMode === 'list'
                      ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white'
                      : 'text-white/70 hover:text-white'
                  }`}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* ===== GOD-LEVEL PRODUCTS GRID ===== */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <div className="bg-white/10 backdrop-blur-xl border-2 border-white/20 rounded-3xl p-12 max-w-2xl mx-auto hover:border-pink-400/50 transition-all">
              <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-full flex items-center justify-center border-4 border-white/20">
                <ShoppingCart className="h-16 w-16 text-pink-300" />
              </div>
              <h3 className="text-3xl font-black text-white mb-4">
                {searchQuery ? 'No Search Results' : 'No Products Found'}
              </h3>
              <p className="text-lg text-white/80 mb-6 font-medium">
                {searchQuery 
                  ? `No products match "${searchQuery}"`
                  : `No products in ${filterCategory} category`}
              </p>
              <div className="flex gap-4 justify-center">
                {searchQuery && (
                  <Button 
                    onClick={() => setSearchQuery('')}
                    className="bg-gradient-to-r from-pink-500 via-rose-500 to-purple-500 text-white border-2 border-white/30 hover:scale-105 font-black"
                  >
                    Clear Search
                  </Button>
                )}
                {filterCategory !== 'all' && (
                  <Button 
                    onClick={() => handleCategoryChange('all')}
                    className="bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 text-white border-2 border-white/30 hover:scale-105 font-black"
                  >
                    View All Products
                  </Button>
                )}
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredProducts.map((product, index) => (
                <div 
                  key={product.id} 
                  className="animate-fade-in"
                  style={{ animationDelay: `${Math.min(index * 100, 1500)}ms` }}
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>

            {/* Results Summary */}
            <div className="mt-12 text-center">
              <div className="inline-block bg-white/10 backdrop-blur-xl border-2 border-white/20 rounded-2xl px-8 py-4 hover:border-pink-400/50 transition-all">
                <p className="text-white/90 font-black text-lg">
                  Showing <span className="bg-gradient-to-r from-pink-300 to-rose-400 bg-clip-text text-transparent">{filteredProducts.length}</span> product{filteredProducts.length !== 1 ? 's' : ''}
                  {filterCategory !== 'all' && (
                    <span> in <span className="bg-gradient-to-r from-pink-300 to-rose-400 bg-clip-text text-transparent">{filterCategory}</span></span>
                  )}
                </p>
              </div>
            </div>
          </>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default ProductsPage;
