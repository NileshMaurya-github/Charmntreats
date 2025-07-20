import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { supabase, SUPABASE_URL } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ShoppingCart, Filter } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { Product } from '@/types/product';
import { useCart } from '@/contexts/CartContext';

const ProductsPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('newest');
  const [filterCategory, setFilterCategory] = useState(searchParams.get('category') || 'all');

  const categories = [
    'Dream Catcher',
    'Embroidery', 
    'Lippan Arts',
    'Resin Art Work',
    'Illustration',
    'Candles',
    'Calligraphy',
    'Hair Accessories',
    'Others'
  ];

  useEffect(() => {
    // Scroll to top on page load/refresh
    window.scrollTo(0, 0);
    fetchProducts();
  }, [filterCategory, sortBy]);

  useEffect(() => {
    // Always scroll to top when component mounts
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      // Lightning-fast query with absolute minimal data
      let query = supabase
        .from('products')
        .select('id, name, price, category, images, catalog_number, in_stock')
        .limit(20) // Smaller limit for instant loading
        .eq('in_stock', true) // Only available products
        .not('images', 'is', null) // Only products with images
        .not('name', 'is', null); // Only products with names

      // Apply category filter first for better performance
      if (filterCategory && filterCategory !== 'all') {
        query = query.eq('category', filterCategory);
      }

      // Simplified sorting for maximum speed
      switch (sortBy) {
        case 'price-low':
          query = query.order('price', { ascending: true });
          break;
        case 'price-high':
          query = query.order('price', { ascending: false });
          break;
        default:
          query = query.order('id', { ascending: true }); // Fastest sort by primary key
      }

      const { data, error } = await query;

      if (error) throw error;

      // Ultra-fast transformation with minimal processing
      const transformedProducts: Product[] = (data || []).map(product => {
        const imageUrl = Array.isArray(product.images) 
          ? product.images[0] 
          : product.images || 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?ixlib=rb-1.2.1&auto=format&fit=crop&w=250&q=50';
        
        return {
          id: product.id,
          name: product.name,
          description: '',
          price: product.price,
          category: product.category,
          images: [imageUrl],
          catalogNumber: product.catalog_number,
          in_stock: product.in_stock,
          stock_quantity: undefined,
          featured: false,
          rating: undefined,
          reviews: undefined
        };
      });

      setProducts(transformedProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (category: string) => {
    // Force page refresh for category changes
    if (category === 'all') {
      window.location.href = '/products';
    } else {
      window.location.href = `/products?category=${encodeURIComponent(category)}`;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-floral-gradient page-transition">
        <Header />
        <div className="container mx-auto px-4 py-8">
          {/* Skeleton Breadcrumb */}
          <div className="flex items-center gap-2 mb-6">
            <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
            <span className="text-slate-400">•</span>
            <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
          </div>
          
          {/* Skeleton Header */}
          <div className="mb-8">
            <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-2"></div>
            <div className="h-4 w-96 bg-gray-200 rounded animate-pulse"></div>
          </div>
          
          {/* Skeleton Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="h-10 w-64 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-10 w-48 bg-gray-200 rounded animate-pulse"></div>
          </div>
          
          {/* Skeleton Product Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="h-48 bg-gray-200 animate-pulse"></div>
                <div className="p-4">
                  <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse mb-2"></div>
                  <div className="h-6 w-1/2 bg-gray-200 rounded animate-pulse mb-3"></div>
                  <div className="h-10 w-full bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-floral-gradient page-transition performance-optimized">
      <Header />
      
      <div className="container mx-auto px-4 py-8 fast-load">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-slate-600 hover:text-pink-600 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
          <span className="text-slate-400">•</span>
          <span className="text-pink-600 font-medium">
            {filterCategory === 'all' ? 'All Products' : filterCategory}
          </span>
        </div>

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            {filterCategory === 'all' ? 'All Products' : filterCategory}
          </h1>
          <p className="text-slate-600">
            Discover our handcrafted {filterCategory === 'all' ? 'treasures' : filterCategory.toLowerCase()} collection
          </p>
        </div>

        {/* Filters and Sorting */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-slate-600" />
            <span className="text-sm font-medium text-slate-700">Category:</span>
            <Select value={filterCategory} onValueChange={handleCategoryChange}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-slate-700">Sort by:</span>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="name">Name (A-Z)</SelectItem>
                <SelectItem value="price-low">Price (Low to High)</SelectItem>
                <SelectItem value="price-high">Price (High to Low)</SelectItem>
                <SelectItem value="rating">Rating</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Products Grid */}
        {products.length === 0 ? (
          <Card className="p-8 text-center">
            <CardContent>
              <ShoppingCart className="h-16 w-16 text-slate-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-700 mb-2">No Products Found</h3>
              <p className="text-slate-600 mb-4">
                {filterCategory === 'all' 
                  ? "We don't have any products available right now." 
                  : `No products found in the ${filterCategory} category.`
                }
              </p>
              <Button 
                onClick={() => navigate('/')}
                className="btn-dark-pink"
              >
                Back to Home
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 performance-optimized">
              {products.map((product) => (
                <div key={product.id} className="fast-load">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>

            {/* Results Summary */}
            <div className="mt-8 text-center">
              <p className="text-slate-600">
                Showing {products.length} product{products.length !== 1 ? 's' : ''} 
                {filterCategory !== 'all' && ` in ${filterCategory}`}
              </p>
            </div>
          </>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default ProductsPage;
