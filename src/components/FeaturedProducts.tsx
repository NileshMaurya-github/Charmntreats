import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Star, Heart, ShoppingCart, Sparkles, Eye, Shield } from 'lucide-react';
import { Product } from '@/types/product';
import { useCart } from '@/contexts/CartContext';
import { useNavigate } from 'react-router-dom';
import { ProductService } from '@/services/productService';

// Define all categories
const CATEGORIES = [
  'Dream Catcher',
  'Embroidery',
  'Lippan Arts',
  'Resin Art Work',
  'Illustration',
  'Candles',
  'Calligraphy',
  'Hair Accessories'
];

interface CategoryProducts {
  category: string;
  products: Product[];
}

const FeaturedProducts = () => {
  const [categoryProducts, setCategoryProducts] = useState<CategoryProducts[]>([]);
  const [scrollPositions, setScrollPositions] = useState<Record<string, number>>({});
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const scrollRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const autoScrollIntervals = useRef<Record<string, NodeJS.Timeout>>({});

  useEffect(() => {
    // Get all products organized by category
    const allProducts = ProductService.getAllProducts();
    const organized: CategoryProducts[] = [];

    CATEGORIES.forEach(category => {
      const categoryItems = allProducts.filter(p => p.category === category);
      if (categoryItems.length > 0) {
        organized.push({
          category,
          products: categoryItems
        });
      }
    });

    setCategoryProducts(organized);
    setLoading(false);

    // Initialize scroll positions
    const initialPositions: Record<string, number> = {};
    CATEGORIES.forEach(cat => {
      initialPositions[cat] = 0;
    });
    setScrollPositions(initialPositions);
  }, []);

  // Auto-scroll effect for each category
  useEffect(() => {
    categoryProducts.forEach(({ category }) => {
      // Clear existing interval if any
      if (autoScrollIntervals.current[category]) {
        clearInterval(autoScrollIntervals.current[category]);
      }

      // Start auto-scroll
      autoScrollIntervals.current[category] = setInterval(() => {
        const container = scrollRefs.current[category];
        if (!container) return;

        const cardWidth = 280; // card width + gap
        const maxScroll = container.scrollWidth - container.clientWidth;
        const currentScroll = container.scrollLeft;

        // If we've reached the end, scroll back to start
        if (currentScroll >= maxScroll - 50) {
          container.scrollTo({
            left: 0,
            behavior: 'smooth'
          });
        } else {
          // Scroll to next product
          container.scrollBy({
            left: cardWidth,
            behavior: 'smooth'
          });
        }
      }, 3000); // Auto-scroll every 3 seconds
    });

    // Cleanup intervals on unmount
    return () => {
      Object.values(autoScrollIntervals.current).forEach(interval => {
        clearInterval(interval);
      });
    };
  }, [categoryProducts]);

  const handleScroll = (category: string, direction: 'left' | 'right') => {
    const container = scrollRefs.current[category];
    if (!container) return;

    // Pause auto-scroll when user manually scrolls
    if (autoScrollIntervals.current[category]) {
      clearInterval(autoScrollIntervals.current[category]);
    }

    const cardWidth = 280; // Approximate card width + gap
    const maxScroll = container.scrollWidth - container.clientWidth;
    const currentScroll = container.scrollLeft;

    if (direction === 'right') {
      // If at the end, loop back to start
      if (currentScroll >= maxScroll - 50) {
        container.scrollTo({
          left: 0,
          behavior: 'smooth'
        });
      } else {
        container.scrollBy({
          left: cardWidth,
          behavior: 'smooth'
        });
      }
    } else {
      // If at the start, loop to end
      if (currentScroll <= 50) {
        container.scrollTo({
          left: maxScroll,
          behavior: 'smooth'
        });
      } else {
        container.scrollBy({
          left: -cardWidth,
          behavior: 'smooth'
        });
      }
    }

    // Update scroll position after animation
    setTimeout(() => {
      setScrollPositions(prev => ({
        ...prev,
        [category]: container.scrollLeft
      }));
    }, 500);

    // Resume auto-scroll after 5 seconds of inactivity
    setTimeout(() => {
      if (autoScrollIntervals.current[category]) {
        clearInterval(autoScrollIntervals.current[category]);
      }
      autoScrollIntervals.current[category] = setInterval(() => {
        const cont = scrollRefs.current[category];
        if (!cont) return;

        const maxScroll = cont.scrollWidth - cont.clientWidth;
        const currentScroll = cont.scrollLeft;

        if (currentScroll >= maxScroll - 50) {
          cont.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          cont.scrollBy({ left: 280, behavior: 'smooth' });
        }
      }, 3000);
    }, 5000);
  };

  const handleMouseEnter = (category: string) => {
    // Pause auto-scroll on hover
    if (autoScrollIntervals.current[category]) {
      clearInterval(autoScrollIntervals.current[category]);
    }
  };

  const handleMouseLeave = (category: string) => {
    // Resume auto-scroll when mouse leaves
    if (autoScrollIntervals.current[category]) {
      clearInterval(autoScrollIntervals.current[category]);
    }
    autoScrollIntervals.current[category] = setInterval(() => {
      const cont = scrollRefs.current[category];
      if (!cont) return;

      const maxScroll = cont.scrollWidth - cont.clientWidth;
      const currentScroll = cont.scrollLeft;

      if (currentScroll >= maxScroll - 50) {
        cont.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        cont.scrollBy({ left: 280, behavior: 'smooth' });
      }
    }, 3000);
  };

  const canScrollLeft = (category: string) => {
    // Always allow scrolling left (loops to end)
    return true;
  };

  const canScrollRight = (category: string) => {
    // Always allow scrolling right (loops to start)
    return true;
  };

  const handleAddToCart = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      images: product.images,
      category: product.category,
      catalogNumber: product.catalogNumber
    });

    // Smooth feedback animation
    const button = e.currentTarget as HTMLElement;
    button.classList.add('scale-110');
    setTimeout(() => button.classList.remove('scale-110'), 200);
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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
      </div>
    );
  }

  return (
    <section className="py-16 bg-transparent relative overflow-hidden">
      {/* Premium Animated Background with Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Giant Glowing Orbs */}
        <div className="absolute top-20 left-20 w-96 h-96 bg-pink-100/40 rounded-full animate-float blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-[500px] h-[500px] bg-purple-100/40 rounded-full animate-float blur-3xl" style={{ animationDelay: '3s' }}></div>

        {/* Floating Particles */}
        <div className="absolute top-[25%] left-[20%] w-2 h-2 bg-pink-300 rounded-full animate-twinkle"></div>
        <div className="absolute top-[45%] right-[25%] w-3 h-3 bg-rose-300 rounded-full animate-twinkle" style={{ animationDelay: '1.5s' }}></div>
        <div className="absolute bottom-[35%] left-[35%] w-2 h-2 bg-purple-300 rounded-full animate-twinkle" style={{ animationDelay: '2.5s' }}></div>
        <div className="absolute top-[65%] right-[18%] w-2 h-2 bg-pink-200 rounded-full animate-twinkle" style={{ animationDelay: '3.5s' }}></div>

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:45px_45px] opacity-35"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* God-Level Section Header */}
        <div className="text-center mb-14 space-y-6">
          {/* Premium Glass Badge */}
          <div className="inline-flex items-center gap-3 px-8 py-3 rounded-full bg-white/80 backdrop-blur-xl border border-pink-200 shadow-xl shadow-pink-100/50 animate-fade-in-up hover:scale-105 transition-transform duration-300">
            <div className="relative">
              <Sparkles className="w-5 h-5 text-pink-500 fill-pink-500 animate-pulse" />
              <div className="absolute inset-0 bg-pink-400 blur-lg opacity-30 animate-pulse"></div>
            </div>
            <span className="text-sm font-black tracking-[0.25em] uppercase bg-gradient-to-r from-pink-600 via-rose-600 to-pink-500 bg-clip-text text-transparent">
              ✨ Featured Collection ✨
            </span>
            <div className="relative">
              <Sparkles className="w-5 h-5 text-pink-500 fill-pink-500 animate-pulse" />
              <div className="absolute inset-0 bg-pink-400 blur-lg opacity-30 animate-pulse"></div>
            </div>
          </div>

          {/* 3D Title with Multiple Shadow Layers */}
          <h2 className="text-4xl md:text-6xl font-black mb-6 animate-fade-in-up animate-delay-200 text-slate-900">
            <span className="block relative inline-block group">
              <span className="relative z-10 bg-gradient-to-r from-pink-600 via-rose-600 to-purple-600 bg-clip-text text-transparent font-extrabold drop-shadow-sm">
                Handcrafted by Category
              </span>
              {/* Massive Glow */}
              <div className="absolute -inset-8 bg-gradient-to-r from-pink-200/30 via-rose-200/40 to-pink-200/30 rounded-3xl blur-3xl group-hover:blur-2xl transition-all duration-500 -z-10"></div>
            </span>
          </h2>

          <p className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed animate-fade-in-up animate-delay-400 font-medium">
            ✨ Explore our unique collections organized by craft type ✨
          </p>
        </div>

        {/* Categories with Carousels */}
        <div className="space-y-16">
          {categoryProducts.map((categoryData, categoryIndex) => (
            <div
              key={categoryData.category}
              className="animate-fade-in-up bg-white/60 backdrop-blur-xl rounded-3xl p-8 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-pink-100/50 transition-all duration-500 border border-white/60 hover:border-pink-200"
              style={{ animationDelay: `${categoryIndex * 0.12 + 0.6}s` }}
            >
              {/* God-Level Category Header */}
              <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-200">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3">
                    {/* Glowing Decorative Bar */}
                    <div className="relative">
                      <div className="w-1.5 h-12 bg-gradient-to-b from-pink-400 via-rose-500 to-pink-600 rounded-full shadow-lg shadow-pink-200"></div>
                    </div>
                    {/* 3D Category Title */}
                    <h3 className="relative inline-block group">
                      <span className="text-3xl md:text-4xl font-black text-slate-800">
                        {categoryData.category}
                      </span>
                    </h3>
                  </div>
                  <Badge
                    variant="outline"
                    className="bg-pink-50 border border-pink-200 text-pink-600 font-black px-4 py-1.5 text-sm rounded-full shadow-sm"
                  >
                    {categoryData.products.length} items
                  </Badge>
                </div>
                <div className="hidden md:flex items-center gap-2 text-sm text-slate-500">
                  <div className="relative">
                    <Sparkles className="w-5 h-5 text-pink-400 fill-pink-400 animate-pulse" />
                  </div>
                  <span className="italic font-medium">Handcrafted with love</span>
                </div>
              </div>

              {/* Products Carousel with Side Navigation */}
              <div
                className="relative flex items-center justify-center gap-3 w-full"
                onMouseEnter={() => handleMouseEnter(categoryData.category)}
                onMouseLeave={() => handleMouseLeave(categoryData.category)}
              >
                {/* Premium Left Navigation Arrow */}
                <button
                  onClick={() => handleScroll(categoryData.category, 'left')}
                  className="relative flex-shrink-0 w-14 h-14 rounded-full overflow-hidden transition-all duration-300 flex items-center justify-center z-20 group active:scale-95 hover:scale-110 shadow-lg"
                  aria-label="Previous products"
                >
                  {/* Gradient Background */}
                  <div className="absolute inset-0 bg-white opacity-90 group-hover:opacity-100 transition-opacity"></div>
                  {/* Border */}
                  <div className="absolute inset-0 border border-slate-200 group-hover:border-pink-300 rounded-full transition-colors"></div>
                  {/* Icon */}
                  <ChevronLeft className="relative z-10 w-7 h-7 text-slate-700 group-hover:text-pink-600 transition-colors" strokeWidth={2.5} />
                </button>

                {/* Products Carousel Container */}
                <div className="flex-1 max-w-[calc(100%-140px)] relative group/carousel overflow-hidden">
                  {/* Premium Gradient Fade on edges */}
                  <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white via-white/60 to-transparent z-10 pointer-events-none opacity-60 group-hover/carousel:opacity-80 transition-opacity"></div>
                  <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white via-white/60 to-transparent z-10 pointer-events-none opacity-60 group-hover/carousel:opacity-80 transition-opacity"></div>

                  <div
                    ref={(el) => { scrollRefs.current[categoryData.category] = el; }}
                    className="flex gap-4 overflow-x-auto scrollbar-hide pb-2"
                    style={{
                      scrollbarWidth: 'none',
                      msOverflowStyle: 'none',
                      scrollBehavior: 'smooth',
                      scrollSnapType: 'x proximity'
                    }}
                    onScroll={(e) => {
                      const target = e.target as HTMLDivElement;
                      setScrollPositions(prev => ({
                        ...prev,
                        [categoryData.category]: target.scrollLeft
                      }));
                    }}
                  >
                    {categoryData.products.map((product, index) => (
                      <Card
                        key={product.id}
                        onClick={() => handleProductClick(product.id)}
                        className="group cursor-pointer overflow-hidden border border-slate-200 hover:border-pink-300 shadow-lg hover:shadow-xl hover:shadow-pink-100 transition-all duration-500 bg-white rounded-2xl transform hover:-translate-y-2 hover:scale-105 flex-shrink-0 w-64 flex flex-col h-[420px]"
                        style={{
                          animation: `slideIn 0.3s ease-out ${index * 0.05}s both`,
                          scrollSnapAlign: 'start'
                        }}
                      >
                        <CardContent className="p-0 flex flex-col h-full">
                          {/* Premium Image Container */}
                          <div className="relative overflow-hidden bg-slate-100 rounded-t-2xl">
                            <div className="aspect-square relative">
                              <img
                                src={product.images[0]}
                                alt={product.name}
                                className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                                loading="eager"
                                crossOrigin="anonymous"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.onerror = null; // Prevent infinite loop
                                  target.src = `https://placehold.co/400x400/ec4899/ffffff?text=${encodeURIComponent(product.name.substring(0, 20))}`;
                                }}
                                onLoad={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.style.opacity = '1';
                                }}
                                style={{ opacity: 0, transition: 'opacity 0.3s ease-in' }}
                              />

                              {/* Enhanced Gradient Overlay */}
                              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-30 transition-opacity duration-500"></div>

                              {/* Premium Quick View */}
                              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0 z-20">
                                <div className="relative">
                                  <Button variant="outline" size="sm" className="relative bg-white hover:bg-pink-50 text-pink-600 hover:text-pink-700 font-bold rounded-xl shadow-lg text-sm px-6 py-2.5 border-2 border-pink-200 hover:border-pink-300 transition-all duration-300 hover:scale-105">
                                    <Eye className="w-4 h-4 mr-2" strokeWidth={2.5} />
                                    View Details
                                  </Button>
                                </div>
                              </div>
                            </div>

                            {/* Badges */}
                            <div className="absolute top-2 left-2 flex flex-col gap-1">
                              {product.featured && (
                                <Badge className="bg-amber-500 text-white shadow-md text-xs py-0.5 px-2 border-none">
                                  <Sparkles className="w-2.5 h-2.5 mr-0.5" />
                                  Featured
                                </Badge>
                              )}
                              {product.stock_quantity && product.stock_quantity < 5 && (
                                <Badge className="bg-red-500 text-white shadow-md animate-pulse text-xs py-0.5 px-2 border-none">
                                  {product.stock_quantity} left
                                </Badge>
                              )}
                            </div>

                            {/* Favorite */}
                            <button
                              onClick={(e) => toggleFavorite(product.id, e)}
                              className="absolute top-2 right-2 p-1.5 rounded-full bg-white/90 backdrop-blur-sm shadow-md hover:bg-white transition-all duration-150 hover:scale-105"
                            >
                              <Heart
                                className={`w-3.5 h-3.5 transition-colors duration-150 ${favorites.has(product.id)
                                  ? 'fill-rose-500 text-rose-500'
                                  : 'text-slate-400'
                                  }`}
                              />
                            </button>
                          </div>

                          {/* Product Details - Fixed Height */}
                          <div className="p-4 bg-white flex-1 flex flex-col justify-between">
                            <div className="space-y-2">
                              {/* Premium Product Name - Fixed Height */}
                              <h4 className="font-bold text-slate-800 text-base leading-tight transition-colors duration-300 group-hover:text-pink-600 h-12 line-clamp-2 flex items-center">
                                {product.name}
                              </h4>

                              {/* Premium Rating */}
                              <div className="flex items-center gap-1.5">
                                <div className="flex items-center">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`w-3.5 h-3.5 ${i < Math.floor(product.rating || 4.5)
                                        ? 'fill-amber-400 text-amber-400'
                                        : 'text-slate-200'
                                        }`}
                                    />
                                  ))}
                                </div>
                                <span className="text-xs text-slate-500 font-medium">
                                  ({product.reviews || 0})
                                </span>
                              </div>
                            </div>

                            {/* Premium Price and Cart - Always at Bottom */}
                            <div className="pt-3 border-t border-slate-100 mt-auto">
                              <div className="flex items-center justify-between">
                                <div className="flex-1">
                                  <p className="text-xl font-black text-slate-900">
                                    {formatPrice(product.price)}
                                  </p>
                                  {product.price > 1000 && (
                                    <p className="text-xs text-green-600 font-bold flex items-center gap-1 mt-1">
                                      <Shield className="w-3 h-3" />
                                      Free Ship
                                    </p>
                                  )}
                                </div>

                                <Button
                                  onClick={(e) => handleAddToCart(product, e)}
                                  size="sm"
                                  className="relative bg-gradient-to-br from-pink-600 via-rose-500 to-pink-600 hover:from-pink-700 hover:via-rose-600 hover:to-pink-700 text-white font-bold shadow-lg shadow-pink-200 hover:shadow-xl hover:shadow-pink-300 rounded-full p-3 hover:scale-110 transition-all duration-300"
                                >
                                  <ShoppingCart className="relative z-10 w-4 h-4" strokeWidth={2.5} />
                                </Button>
                              </div>

                              {/* Premium Trust Badge */}
                              {product.rating && product.rating >= 4.8 && (
                                <div className="flex items-center gap-1 text-xs text-green-600 font-bold mt-2">
                                  <Shield className="w-3.5 h-3.5" strokeWidth={2.5} />
                                  <span>Top Rated</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Premium Right Navigation Arrow */}
                <button
                  onClick={() => handleScroll(categoryData.category, 'right')}
                  className="relative flex-shrink-0 w-14 h-14 rounded-full overflow-hidden transition-all duration-300 flex items-center justify-center z-20 group active:scale-95 hover:scale-110 shadow-lg"
                  aria-label="Next products"
                >
                  {/* Gradient Background */}
                  <div className="absolute inset-0 bg-white opacity-90 group-hover:opacity-100 transition-opacity"></div>
                  {/* Border */}
                  <div className="absolute inset-0 border border-slate-200 group-hover:border-pink-300 rounded-full transition-colors"></div>
                  {/* Icon */}
                  <ChevronRight className="relative z-10 w-7 h-7 text-slate-700 group-hover:text-pink-600 transition-colors" strokeWidth={3} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }

        /* Ultra-smooth scroll behavior */
        .scrollbar-hide {
          -webkit-overflow-scrolling: touch;
          scroll-padding: 0;
          overscroll-behavior-x: contain;
        }

        /* Prevent scroll jump on interaction */
        * {
          scroll-behavior: smooth !important;
        }
      `}</style>
    </section>
  );
};

export default FeaturedProducts;
