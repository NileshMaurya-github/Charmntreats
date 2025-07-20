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
    fetchProducts();
  }, [filterCategory, sortBy]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('products')
        .select('*');

      // Apply category filter
      if (filterCategory && filterCategory !== 'all') {
        query = query.eq('category', filterCategory);
      }

      // Apply sorting
      switch (sortBy) {
        case 'price-low':
          query = query.order('price', { ascending: true });
          break;
        case 'price-high':
          query = query.order('price', { ascending: false });
          break;
        case 'rating':
          query = query.order('rating', { ascending: false });
          break;
        case 'newest':
          query = query.order('created_at', { ascending: false });
          break;
        default:
          query = query.order('name', { ascending: true });
      }

      const { data, error } = await query;
      console.log('Supabase URL:', SUPABASE_URL);
      console.log('Fetched products:', data, 'Error:', error, 'Category filter:', filterCategory);

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      // Transform the data to match our Product interface
      const transformedProducts: Product[] = (data || []).map(product => ({
        id: product.id,
        name: product.name,
        description: product.description || '',
        price: product.price,
        category: product.category,
        images: product.images || ['https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80'],
        catalogNumber: product.catalog_number,
        in_stock: product.in_stock,
        stock_quantity: product.stock_quantity,
        featured: product.featured || false,
        rating: product.rating || undefined,
        reviews: product.reviews || undefined
      }));

      setProducts(transformedProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (category: string) => {
    setFilterCategory(category);
    if (category === 'all') {
      navigate('/products');
    } else {
      navigate(`/products?category=${encodeURIComponent(category)}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-floral-gradient page-transition">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pink-600 mx-auto"></div>
            <p className="mt-4 text-slate-700">Loading products...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-floral-gradient page-transition">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
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
