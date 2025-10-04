import { useState, useCallback, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/types/product';

// Cache for products
const productCache = new Map<string, Product[]>();
const categoryCache = new Map<string, Product[]>();

export const useProductOptimization = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Optimized product fetching with caching
  const fetchProductsOptimized = useCallback(async (
    category?: string,
    limit: number = 12,
    offset: number = 0
  ): Promise<Product[]> => {
    const cacheKey = `${category || 'all'}-${limit}-${offset}`;
    
    // Check cache first - instant return
    if (productCache.has(cacheKey)) {
      return productCache.get(cacheKey)!;
    }

    setLoading(true);
    setError(null);

    try {
      // Optimize query - select only essential fields and add timeout
      let query = supabase
        .from('products')
        .select('id,name,price,category,images,in_stock,stock_quantity,catalog_number,rating,reviews,featured')
        .eq('in_stock', true)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1)
        .abortSignal(AbortSignal.timeout(3000)); // 3 second timeout

      if (category && category !== 'all') {
        query = query.eq('category', category);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;

      // Transform and filter data
      const transformedProducts: Product[] = (data || [])
        .filter(product => 
          product.stock_quantity === null || 
          product.stock_quantity === undefined || 
          product.stock_quantity > 0
        )
        .map(product => ({
          id: product.id,
          name: product.name,
          description: '',
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

      // Cache the results
      productCache.set(cacheKey, transformedProducts);
      
      // Auto-clear cache after 5 minutes
      setTimeout(() => {
        productCache.delete(cacheKey);
      }, 5 * 60 * 1000);

      return transformedProducts;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch products');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Optimized image preloading
  const preloadImages = useCallback((products: Product[]) => {
    products.forEach(product => {
      if (product.images[0]) {
        const img = new Image();
        img.src = product.images[0];
      }
    });
  }, []);

  // Get featured products with optimization
  const getFeaturedProducts = useCallback(async (): Promise<Product[]> => {
    const cacheKey = 'featured-products';
    
    if (productCache.has(cacheKey)) {
      return productCache.get(cacheKey)!;
    }

    try {
      const products = await fetchProductsOptimized();
      const featuredProducts = products.filter(p => p.featured).slice(0, 8);
      
      if (featuredProducts.length === 0) {
        // If no featured products, return first 8 products
        const fallbackProducts = products.slice(0, 8);
        if (fallbackProducts.length > 0) {
          productCache.set(cacheKey, fallbackProducts);
          preloadImages(fallbackProducts);
          return fallbackProducts;
        }
        // If no products at all, return empty array (component will handle fallback)
        return [];
      }

      productCache.set(cacheKey, featuredProducts);
      preloadImages(featuredProducts);
      
      return featuredProducts;
    } catch (error) {
      console.error('🚨 Error in getFeaturedProducts:', error);
      return []; // Return empty array, let component handle fallback
    }
  }, [fetchProductsOptimized, preloadImages]);

  // Clear cache manually
  const clearCache = useCallback(() => {
    productCache.clear();
    categoryCache.clear();
  }, []);

  return {
    loading,
    error,
    fetchProductsOptimized,
    getFeaturedProducts,
    preloadImages,
    clearCache
  };
};

// Virtual scrolling hook for large product lists
export const useVirtualScrolling = (
  items: Product[],
  itemHeight: number = 400,
  containerHeight: number = 600
) => {
  const [scrollTop, setScrollTop] = useState(0);
  
  const visibleItems = useMemo(() => {
    const startIndex = Math.floor(scrollTop / itemHeight);
    const endIndex = Math.min(
      startIndex + Math.ceil(containerHeight / itemHeight) + 1,
      items.length
    );
    
    return {
      startIndex,
      endIndex,
      items: items.slice(startIndex, endIndex),
      totalHeight: items.length * itemHeight,
      offsetY: startIndex * itemHeight
    };
  }, [items, itemHeight, containerHeight, scrollTop]);

  return {
    ...visibleItems,
    onScroll: (e: React.UIEvent<HTMLDivElement>) => {
      setScrollTop(e.currentTarget.scrollTop);
    }
  };
};