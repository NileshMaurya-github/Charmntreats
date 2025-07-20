import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import ProductCard from './ProductCard';
import { Product } from '@/types/product';

const FeaturedProducts = () => {
  const navigate = useNavigate();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false); // No loading state

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      // First try to get featured products that are actually in stock
      let { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('featured', true)
        .eq('in_stock', true)
        .limit(6)
        .order('created_at', { ascending: false });

      // Filter out products with 0 stock quantity
      if (!error && data) {
        data = data.filter(product => 
          product.stock_quantity === null || 
          product.stock_quantity === undefined || 
          product.stock_quantity > 0
        );
      }

      // If no featured products found, get any in-stock products
      if (!error && (!data || data.length === 0)) {
        const { data: allData, error: allError } = await supabase
          .from('products')
          .select('*')
          .eq('in_stock', true)
          .limit(6)
          .order('created_at', { ascending: false });
        
        // Filter out products with 0 stock quantity
        if (!allError && allData) {
          data = allData.filter(product => 
            product.stock_quantity === null || 
            product.stock_quantity === undefined || 
            product.stock_quantity > 0
          );
        } else {
          data = allData;
        }
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

  // Remove loading state completely

  return (
    <section className="compact-section bg-craft-gradient">
      <div className="container mx-auto compact-container">
        <div className="text-center mb-10 featured-header-animate">
          <h2 className="text-3xl md:text-4xl font-bold text-black-primary mb-3 featured-title-animate">
            Featured <span className="heading-craft featured-gradient-text">Creations</span>
          </h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto font-medium featured-description-animate">
            Discover our most loved handcrafted pieces, each one carefully selected for its exceptional quality and artistry
          </p>
        </div>

        {featuredProducts.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-700 mb-4 font-medium">No featured products available at the moment.</p>
            <button 
              onClick={() => navigate('/products')}
              className="btn-orange px-6 py-2 rounded-lg font-medium"
            >
              View All Products
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 featured-products-grid">
              {featuredProducts.map((product, index) => (
                <div 
                  key={product.id} 
                  className="featured-product-item"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>

            <div className="text-center mt-12 featured-button-animate">
              <button 
                onClick={() => navigate('/products')}
                className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 rounded-lg font-medium transition-all duration-300 premium-button-hover"
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
