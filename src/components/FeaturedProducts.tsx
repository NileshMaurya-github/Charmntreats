import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import ProductCard from './ProductCard';
import { Product } from '@/types/product';

const FeaturedProducts = () => {
  const navigate = useNavigate();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      // First try to get featured products
      let { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('featured', true)
        .eq('in_stock', true)
        .limit(6)
        .order('created_at', { ascending: false });

      // If no featured products found, get any in-stock products
      if (!error && (!data || data.length === 0)) {
        const { data: allData, error: allError } = await supabase
          .from('products')
          .select('*')
          .eq('in_stock', true)
          .limit(6)
          .order('created_at', { ascending: false });
        
        data = allData;
        error = allError;
      }

      if (error) throw error;

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

      setFeaturedProducts(transformedProducts);
    } catch (error) {
      console.error('Error fetching featured products:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-slate-800 mb-4">
              Featured <span className="text-amber-600">Creations</span>
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Discover our most loved handcrafted pieces, each one carefully selected for its exceptional quality and artistry
            </p>
          </div>
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading featured products...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-slate-800 mb-4">
            Featured <span className="text-amber-600">Creations</span>
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Discover our most loved handcrafted pieces, each one carefully selected for its exceptional quality and artistry
          </p>
        </div>

        {featuredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-600 mb-4">No featured products available at the moment.</p>
            <button 
              onClick={() => navigate('/products')}
              className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              View All Products
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            <div className="text-center mt-12">
              <button 
                onClick={() => navigate('/products')}
                className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 rounded-lg font-medium transition-colors"
              >
                View All Products
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default FeaturedProducts;
