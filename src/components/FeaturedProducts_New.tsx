import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Star, Heart, ShoppingCart, Sparkles, Eye } from 'lucide-react';
import { Product } from '@/types/product';
import { useCart } from '@/contexts/CartContext';
import { useNavigate } from 'react-router-dom';
import { ProductService } from '@/services/productService';

const FeaturedProducts = () => {
  // Get featured products instantly from our new service
  const [products, setProducts] = useState<Product[]>(ProductService.getFeaturedProducts());
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    // Products are already loaded instantly, no need for loading states
    setProducts(ProductService.getFeaturedProducts());
  }, []);

  const handleAddToCart = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart({
      ...product,
      quantity: 1
    });
    
    // Show a beautiful add to cart animation
    const button = e.currentTarget as HTMLElement;
    button.classList.add('animate-bounce');
    setTimeout(() => button.classList.remove('animate-bounce'), 500);
  };

  const handleProductClick = (productId: string) => {
    navigate(`/product/${productId}`);
  };

  const toggleFavorite = (productId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newFavorites = new Set(favorites);
    if (favorites.has(productId)) {
      newFavorites.delete(productId);
    } else {
      newFavorites.add(productId);
    }
    setFavorites(newFavorites);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <Star key="half" className="w-4 h-4 fill-yellow-400/50 text-yellow-400" />
      );
    }

    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(
        <Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />
      );
    }

    return stars;
  };

  return (
    <section className="py-20 bg-gradient-to-b from-white via-rose-50/30 to-pink-50/20 relative overflow-hidden">
      {/* Floating Floral Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-br from-pink-200/20 to-rose-300/20 rounded-full animate-float blur-2xl"></div>
        <div className="absolute bottom-32 right-16 w-40 h-40 bg-gradient-to-br from-purple-200/15 to-pink-200/15 rounded-full animate-float blur-2xl" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-gradient-to-br from-rose-200/25 to-pink-300/25 rounded-full animate-pulse"></div>
        
        {/* Sparkle Effects */}
        <Sparkles className="absolute top-32 right-1/4 w-6 h-6 text-pink-300/40 animate-pulse" style={{ animationDelay: '1s' }} />
        <Sparkles className="absolute bottom-40 left-1/4 w-4 h-4 text-rose-300/40 animate-pulse" style={{ animationDelay: '3s' }} />
        <Sparkles className="absolute top-2/3 right-1/3 w-5 h-5 text-purple-300/40 animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Beautiful Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 text-rose-600 mb-6 animate-fade-in-up">
            <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-rose-400 to-rose-500 rounded-full"></div>
            <Sparkles className="w-5 h-5" />
            <span className="text-sm font-bold tracking-widest uppercase">Featured Collection</span>
            <Sparkles className="w-5 h-5" />
            <div className="w-16 h-0.5 bg-gradient-to-r from-rose-500 via-rose-400 to-transparent rounded-full"></div>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <span className="bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">
              Handcrafted with Love
            </span>
          </h2>
          
          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            Discover our most beloved creations, each piece carefully handcrafted with premium materials and attention to every beautiful detail.
          </p>
          
          <div className="flex items-center justify-center gap-3 mt-6 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
            <div className="w-12 h-1 bg-gradient-to-r from-transparent via-pink-400 to-transparent rounded-full"></div>
            <div className="w-2 h-2 bg-rose-400 rounded-full animate-pulse"></div>
            <div className="w-12 h-1 bg-gradient-to-r from-transparent via-pink-400 to-transparent rounded-full"></div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-12">
          {products.map((product, index) => (
            <Card 
              key={product.id}
              className="group cursor-pointer transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 bg-white/80 backdrop-blur-sm border-0 shadow-lg overflow-hidden animate-fade-in-up hover-scale"
              style={{ animationDelay: `${index * 150}ms` }}
              onClick={() => handleProductClick(product.id)}
            >
              <div className="relative overflow-hidden">
                {/* Product Image */}
                <div className="aspect-square overflow-hidden bg-gradient-to-br from-pink-50 to-rose-50">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />
                  
                  {/* Overlay Actions */}
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      className="bg-white/90 hover:bg-white text-slate-700 shadow-lg"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleProductClick(product.id);
                      }}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                  </div>

                  {/* Favorite Button */}
                  <Button
                    size="sm"
                    variant="ghost"
                    className="absolute top-3 right-3 p-2 bg-white/80 hover:bg-white text-gray-600 rounded-full shadow-md"
                    onClick={(e) => toggleFavorite(product.id, e)}
                  >
                    <Heart 
                      className={`w-4 h-4 transition-colors ${
                        favorites.has(product.id) ? 'fill-red-500 text-red-500' : 'text-gray-400'
                      }`} 
                    />
                  </Button>

                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-2">
                    {product.featured && (
                      <Badge className="bg-gradient-to-r from-pink-500 to-rose-500 text-white border-0 shadow-md">
                        ✨ Featured
                      </Badge>
                    )}
                    {product.stock_quantity && product.stock_quantity <= 5 && (
                      <Badge variant="destructive" className="shadow-md">
                        Only {product.stock_quantity} left
                      </Badge>
                    )}
                  </div>
                </div>

                <CardContent className="p-6">
                  {/* Category */}
                  <div className="text-xs text-rose-600 font-medium mb-2 uppercase tracking-wider">
                    {product.category}
                  </div>

                  {/* Product Name */}
                  <h3 className="font-bold text-lg text-slate-800 mb-2 line-clamp-2 group-hover:text-rose-600 transition-colors">
                    {product.name}
                  </h3>

                  {/* Rating */}
                  {product.rating && (
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center gap-1">
                        {renderStars(product.rating)}
                      </div>
                      <span className="text-sm text-gray-500">
                        ({product.reviews} reviews)
                      </span>
                    </div>
                  )}

                  {/* Description */}
                  <p className="text-sm text-slate-600 mb-4 line-clamp-2">
                    {product.description}
                  </p>

                  {/* Price and Add to Cart */}
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold text-slate-800">
                      {formatPrice(product.price)}
                    </div>
                    
                    <Button
                      size="sm"
                      className="btn-floral hover-scale"
                      onClick={(e) => handleAddToCart(product, e)}
                    >
                      <ShoppingCart className="w-4 h-4 mr-1" />
                      Add to Cart
                    </Button>
                  </div>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>

        {/* View All Products Button */}
        <div className="text-center animate-fade-in-up" style={{ animationDelay: '1s' }}>
          <Button 
            size="lg"
            className="btn-floral-gradient hover-scale group"
            onClick={() => navigate('/products')}
          >
            <span>Explore All Products</span>
            <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;