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

  // Get instant products from ProductService
  const initialProducts = ProductService.getAllProducts();

  // Initialize state
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [sortBy, setSortBy] = useState('newest');
  const [filterCategory, setFilterCategory] = useState(searchParams.get('category') || 'all');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

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

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filterCategory, sortBy, searchQuery]);

  // Pagination logic
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const displayedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ===== GOD-LEVEL PRODUCTS PAGE - COMPLETE REDESIGN =====
  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden">
      <Header />

      {/* ===== GOD-LEVEL FLOATING PARTICLES ===== */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Large Gradient Orbs */}
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-pink-100/50 rounded-full animate-float blur-3xl"></div>
        <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] bg-purple-100/50 rounded-full animate-float blur-3xl" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-20 right-20 w-64 h-64 bg-rose-100/50 rounded-full animate-pulse blur-2xl"></div>

        {/* Floating Particles */}
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-pink-300 rounded-full animate-twinkle"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              opacity: Math.random() * 0.5 + 0.3
            }}
          ></div>
        ))}

        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:50px_50px] opacity-30"></div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* ===== GOD-LEVEL BREADCRUMB ===== */}
        <div className="flex items-center gap-3 mb-8 animate-fade-in">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-slate-800 hover:text-pink-600 transition-all duration-300 bg-white/60 backdrop-blur-xl border border-slate-200 hover:border-pink-300 rounded-xl px-4 py-2 hover:scale-105 font-bold shadow-sm"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
          <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse"></div>
          <Badge className="bg-white/60 backdrop-blur-xl border border-slate-200 text-slate-900 font-black px-4 py-2 shadow-sm">
            {filterCategory === 'all' ? 'All Products' : filterCategory}
          </Badge>
        </div>

        {/* ===== GOD-LEVEL PAGE HEADER WITH 3D TITLE ===== */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-gradient-to-r from-pink-200 to-purple-200 opacity-30 blur-3xl animate-pulse"></div>

            {/* 3D Title Effect */}
            <h1 className="text-5xl lg:text-7xl font-black leading-tight">
              <span className="block relative inline-block group">
                <span className="relative z-10 bg-gradient-to-r from-pink-600 via-rose-600 to-pink-500 bg-clip-text text-transparent animate-shimmer font-extrabold">
                  {filterCategory === 'all' ? 'All Products' : filterCategory}
                </span>
                {/* 3D Shadow Layers */}
                <span className="absolute top-1 left-1 bg-gradient-to-r from-pink-200 via-rose-200 to-pink-300 bg-clip-text text-transparent opacity-50 blur-sm" aria-hidden="true">
                  {filterCategory === 'all' ? 'All Products' : filterCategory}
                </span>
                <div className="absolute -inset-4 bg-gradient-to-r from-pink-100/50 via-rose-100/50 to-pink-100/50 rounded-3xl blur-3xl -z-10"></div>
              </span>
            </h1>
          </div>

          <p className="text-xl text-slate-800 max-w-3xl mx-auto leading-relaxed font-medium">
            Discover our handcrafted{' '}
            <span className="bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent font-black">
              {filterCategory === 'all' ? 'treasures' : filterCategory.toLowerCase()}
            </span>
            {' '}collection, each piece crafted with love
          </p>

          {/* Premium Stats */}
          <div className="flex items-center justify-center gap-3 mt-6">
            <div className="w-12 h-0.5 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full"></div>
            <span className="text-sm font-black text-pink-600 bg-white/60 backdrop-blur-xl border border-pink-200 rounded-full px-4 py-1 shadow-sm">
              {filteredProducts.length} items
            </span>
            <div className="w-12 h-0.5 bg-gradient-to-r from-rose-500 to-pink-500 rounded-full"></div>
          </div>
        </div>

        {/* ===== GOD-LEVEL FILTERS & SEARCH ===== */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-xl shadow-slate-200/50 border border-slate-200 mb-12 hover:border-pink-200 transition-all duration-500">
          <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
            {/* Search Bar */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-600 group-hover:text-pink-500 transition-colors" />
                <Input
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-4 py-3 text-lg bg-white border border-slate-200 focus:border-pink-300 focus:ring-4 focus:ring-pink-100 text-slate-900 placeholder:text-slate-600 font-medium rounded-xl shadow-sm"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-4">
              {/* Category Filter */}
              <div className="flex items-center gap-3">
                <Filter className="h-5 w-5 text-pink-500" />
                <Select value={filterCategory} onValueChange={handleCategoryChange}>
                  <SelectTrigger className="w-48 bg-white border border-slate-200 text-slate-900 font-bold rounded-xl hover:border-pink-300 transition-all shadow-sm">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-slate-200 shadow-xl rounded-xl">
                    <SelectItem value="all" className="text-slate-900 hover:bg-pink-50 font-bold cursor-pointer">All Categories</SelectItem>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat} className="text-slate-900 hover:bg-pink-50 font-bold cursor-pointer">
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Sort Filter */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-44 bg-white border border-slate-200 text-slate-900 font-bold rounded-xl hover:border-pink-300 transition-all shadow-sm">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-slate-200 shadow-xl rounded-xl">
                  <SelectItem value="newest" className="text-slate-900 hover:bg-pink-50 font-bold cursor-pointer">Newest First</SelectItem>
                  <SelectItem value="name" className="text-slate-900 hover:bg-pink-50 font-bold cursor-pointer">Name (A-Z)</SelectItem>
                  <SelectItem value="price-low" className="text-slate-900 hover:bg-pink-50 font-bold cursor-pointer">Price: Low to High</SelectItem>
                  <SelectItem value="price-high" className="text-slate-900 hover:bg-pink-50 font-bold cursor-pointer">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>

              {/* Items Per Page */}
              <Select value={itemsPerPage.toString()} onValueChange={(val) => setItemsPerPage(Number(val))}>
                <SelectTrigger className="w-24 bg-white border border-slate-200 text-slate-900 font-bold rounded-xl hover:border-pink-300 transition-all shadow-sm">
                  <SelectValue placeholder="12" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-slate-200 shadow-xl rounded-xl">
                  <SelectItem value="12" className="text-slate-900 hover:bg-pink-50 font-bold cursor-pointer">12 / page</SelectItem>
                  <SelectItem value="24" className="text-slate-900 hover:bg-pink-50 font-bold cursor-pointer">24 / page</SelectItem>
                  <SelectItem value="48" className="text-slate-900 hover:bg-pink-50 font-bold cursor-pointer">48 / page</SelectItem>
                </SelectContent>
              </Select>

              {/* View Toggle */}
              <div className="flex items-center gap-1 bg-white rounded-lg p-1 border border-slate-200 shadow-sm">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setViewMode('grid')}
                  className={`${viewMode === 'grid' ? 'bg-pink-500 text-white shadow-md' : 'text-slate-700 hover:bg-slate-100'} rounded-md transition-all`}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setViewMode('list')}
                  className={`${viewMode === 'list' ? 'bg-pink-500 text-white shadow-md' : 'text-slate-700 hover:bg-slate-100'} rounded-md transition-all`}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* ===== GOD-LEVEL PRODUCT GRID ===== */}
        {displayedProducts.length === 0 ? (
          <div className="text-center py-20 bg-white/60 backdrop-blur-xl rounded-3xl border border-slate-200 animate-fade-in shadow-lg">
            <div className="w-24 h-24 bg-pink-50 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
              <Search className="h-10 w-10 text-pink-400" />
            </div>
            <h3 className="text-3xl font-bold text-slate-900 mb-2">No treasures found</h3>
            <p className="text-slate-700">Try adjusting your search or filters to find what you're looking for.</p>
            <Button
              onClick={() => {
                setSearchQuery('');
                setFilterCategory('all');
              }}
              className="mt-6 bg-pink-600 hover:bg-pink-700 text-white font-bold px-8 py-3 rounded-xl shadow-lg shadow-pink-200 hover:shadow-pink-300 transition-all"
            >
              Clear Filters
            </Button>
          </div>
        ) : (
          <>
            <div className={viewMode === 'grid'
              ? "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
              : "flex flex-col gap-6"
            }>
              {displayedProducts.map((product, index) => (
                <div
                  key={product.id}
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>

            {/* ===== GOD-LEVEL PAGINATION ===== */}
            {totalPages > 1 && (
              <div className="mt-16 flex justify-center items-center gap-4">
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="bg-white border-slate-200 hover:border-pink-300 hover:bg-pink-50 text-slate-700 font-bold px-6 py-6 rounded-xl shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105"
                >
                  Previous
                </Button>

                <div className="flex items-center gap-2">
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => handlePageChange(i + 1)}
                      className={`w-12 h-12 rounded-xl font-black text-lg transition-all duration-300 flex items-center justify-center shadow-sm ${currentPage === i + 1
                        ? 'bg-gradient-to-br from-pink-500 to-rose-600 text-white shadow-pink-200 shadow-lg scale-110'
                        : 'bg-white border border-slate-200 text-slate-600 hover:border-pink-300 hover:text-pink-600 hover:bg-pink-50'
                        }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>

                <Button
                  variant="outline"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="bg-white border-slate-200 hover:border-pink-300 hover:bg-pink-50 text-slate-700 font-bold px-6 py-6 rounded-xl shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105"
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default ProductsPage;
