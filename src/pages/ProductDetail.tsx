import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  ArrowLeft,
  Star,
  Heart,
  ShoppingCart,
  Minus,
  Plus,
  Share2,
  Package,
  Truck,
  Shield,
  RotateCcw,
  ChevronRight,
  Sparkles,
  CheckCircle,
  Award,
  Lock,
  Clock
} from 'lucide-react';
import { Product } from '@/types/product';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { ProductService } from '@/services/productService';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'description' | 'details' | 'reviews'>('description');
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    if (id) {
      const foundProduct = ProductService.getProductById(id);
      setProduct(foundProduct);
      if (!foundProduct) {
        navigate('/products');
      }
    }
  }, [id, navigate]);

  const isFavorite = product ? isInWishlist(product.id) : false;

  const handleToggleWishlist = () => {
    if (!product) return;
    if (isFavorite) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0],
        category: product.category,
        catalogNumber: product.catalogNumber
      });
    }
  };

  const handleAddToCart = () => {
    if (product) {
      for (let i = 0; i < quantity; i++) {
        addToCart({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.images[0],
          images: product.images,
          category: product.category,
          catalogNumber: product.catalogNumber
        });
      }
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 3000);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(price);
  };

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-pink-100">
      <Header />

      <div className="container mx-auto px-4 py-12 pt-24 relative z-10">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-slate-800 mb-8 animate-fade-in">
          <Link to="/" className="hover:text-pink-600 transition-colors font-bold">
            Home
          </Link>
          <ChevronRight className="w-4 h-4" />
          <Link to="/products" className="hover:text-pink-600 transition-colors font-bold">
            Products
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-slate-900 font-bold">{product.category}</span>
          <ChevronRight className="w-4 h-4" />
          <span className="text-pink-600 font-bold truncate max-w-[200px]">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Image Gallery */}
          <div className="space-y-6 animate-slide-up">
            <div className="group relative">
              <div className="relative bg-white border border-slate-200 rounded-3xl overflow-hidden p-2 shadow-xl shadow-slate-200/50">
                <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-100">
                  <img
                    src={product.images[selectedImage]}
                    alt={product.name}
                    className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-700"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder.svg';
                    }}
                  />

                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                    {product.featured && (
                      <Badge className="bg-amber-500/90 backdrop-blur-md text-white border-0 text-xs py-1.5 px-3 font-bold shadow-lg">
                        <Sparkles className="w-3 h-3 mr-1" />
                        Featured
                      </Badge>
                    )}
                    {product.stock_quantity && product.stock_quantity < 5 && (
                      <Badge className="bg-red-500/90 backdrop-blur-md text-white border-0 text-xs py-1.5 px-3 font-bold shadow-lg animate-pulse">
                        Only {product.stock_quantity} left!
                      </Badge>
                    )}
                  </div>

                  <button
                    onClick={handleToggleWishlist}
                    className="absolute top-4 right-4 p-3 rounded-full bg-white/80 backdrop-blur-md hover:bg-pink-50 transition-all duration-300 border border-slate-200 group/heart shadow-sm"
                  >
                    <Heart
                      className={`w-6 h-6 transition-colors duration-300 ${isFavorite ? 'fill-pink-500 text-pink-500' : 'text-slate-400 group-hover/heart:text-pink-500'
                        }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative aspect-square rounded-xl overflow-hidden transition-all duration-300 border-2 ${selectedImage === index
                    ? 'border-pink-500 scale-105 shadow-lg shadow-pink-100'
                    : 'border-transparent hover:border-pink-300 opacity-70 hover:opacity-100'
                    }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder.svg';
                    }}
                  />
                </button>
              ))}
            </div>

            <div className="grid grid-cols-4 gap-4 pt-4">
              {[
                { icon: Shield, label: 'Authentic', color: 'text-emerald-500' },
                { icon: Truck, label: 'Free Ship', color: 'text-blue-500' },
                { icon: RotateCcw, label: 'Returns', color: 'text-violet-500' },
                { icon: Lock, label: 'Secure', color: 'text-amber-500' }
              ].map((badge, index) => {
                const Icon = badge.icon;
                return (
                  <div key={index} className="text-center p-4 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 transition-colors shadow-sm">
                    <Icon className={`w-6 h-6 mx-auto mb-2 ${badge.color}`} />
                    <p className="text-xs font-bold text-slate-900">{badge.label}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-xl shadow-slate-200/50">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-bold text-pink-600 uppercase tracking-wider bg-pink-50 px-3 py-1 rounded-full border border-pink-100">
                  {product.category}
                </p>
                <div className="flex items-center gap-2 text-amber-500 bg-amber-50 px-3 py-1 rounded-full border border-amber-100">
                  <Star className="w-4 h-4 fill-amber-500" />
                  <span className="text-sm font-bold">
                    {product.rating?.toFixed(1)} <span className="text-slate-500 mx-1">|</span> {product.reviews || 0} reviews
                  </span>
                </div>
              </div>

              <h1 className="text-3xl md:text-5xl font-black mb-6 text-slate-900 leading-tight">
                {product.name}
              </h1>

              <Separator className="bg-slate-100 my-6" />

              <div className="space-y-4 mb-8">
                <div className="flex items-baseline gap-4">
                  <p className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-rose-600">
                    {formatPrice(product.price)}
                  </p>
                  {product.price > 1000 && (
                    <Badge className="bg-green-50 text-green-600 border border-green-200 font-bold px-3 py-1">
                      Free Shipping
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-slate-800 font-medium">Inclusive of all taxes</p>
              </div>

              <div className="flex items-center gap-3 mb-8">
                {product.in_stock ? (
                  <div className="flex items-center gap-2 bg-green-50 px-4 py-2 rounded-xl border border-green-100">
                    <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse shadow-sm"></div>
                    <span className="font-bold text-green-600">In Stock - Ready to Ship</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 bg-red-50 px-4 py-2 rounded-xl border border-red-100">
                    <div className="w-2.5 h-2.5 bg-red-500 rounded-full"></div>
                    <span className="font-bold text-red-600">Out of Stock</span>
                  </div>
                )}
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3 mb-8">
                <div className="flex items-center gap-3 text-sm text-slate-900">
                  <Clock className="w-5 h-5 text-blue-500" />
                  <span className="font-medium">Dispatch: <span className="text-slate-900 font-bold">Within 2-3 business days</span></span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-900">
                  <Package className="w-5 h-5 text-purple-500" />
                  <span className="font-medium">Catalog Number: <span className="text-slate-900 font-mono font-bold">{product.catalogNumber}</span></span>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <label className="text-sm font-bold text-slate-800 uppercase tracking-wider">Quantity</label>
                <div className="flex items-center gap-6">
                  <div className="flex items-center bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-4 hover:bg-slate-50 transition-colors disabled:opacity-50 text-slate-900"
                      disabled={quantity <= 1}
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-6 font-black text-xl text-slate-900 min-w-[3ch] text-center">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-4 hover:bg-slate-50 transition-colors disabled:opacity-50 text-slate-700"
                      disabled={product.stock_quantity ? quantity >= product.stock_quantity : false}
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  {product.stock_quantity && (
                    <span className="text-sm text-slate-800 font-medium">
                      {product.stock_quantity} units available
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <Button
                  onClick={handleAddToCart}
                  disabled={!product.in_stock}
                  size="lg"
                  className="w-full bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white text-lg font-bold h-16 rounded-xl shadow-lg shadow-pink-200 hover:shadow-pink-300 transition-all duration-300 hover:scale-[1.02] uppercase tracking-wide"
                >
                  {addedToCart ? (
                    <>
                      <CheckCircle className="w-6 h-6 mr-2" />
                      Added to Cart!
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-6 h-6 mr-2" />
                      Add to Cart • {formatPrice(product.price * quantity)}
                    </>
                  )}
                </Button>

                <div className="grid grid-cols-2 gap-4">
                  <Button
                    size="lg"
                    className="bg-slate-900 text-white hover:bg-slate-800 font-bold h-14 rounded-xl uppercase tracking-wide shadow-lg shadow-slate-200"
                    onClick={() => {
                      handleAddToCart();
                      navigate('/checkout');
                    }}
                  >
                    Buy Now
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-slate-200 text-slate-900 hover:bg-slate-50 font-bold h-14 rounded-xl"
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({
                          title: product.name,
                          text: `Check out ${product.name} - ${formatPrice(product.price)}`,
                          url: window.location.href
                        }).catch(() => { });
                      } else {
                        navigator.clipboard.writeText(window.location.href);
                        alert('Link copied to clipboard!');
                      }
                    }}
                  >
                    <Share2 className="w-5 h-5 mr-2" />
                    Share
                  </Button>
                </div>
              </div>
            </div>

            <Card className="bg-emerald-50 border border-emerald-100 rounded-2xl shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-white rounded-xl shadow-sm">
                    <Shield className="w-6 h-6 text-emerald-500" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-emerald-900 mb-1">Quality Guarantee</h4>
                    <p className="text-sm text-emerald-700 leading-relaxed">
                      100% authentic handcrafted product. 7-day return policy if you're not completely satisfied with your treasure.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Card className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xl shadow-slate-200/50 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <CardContent className="p-0">
            <div className="flex border-b border-slate-200 bg-slate-50">
              {[
                { id: 'description', label: 'Description' },
                { id: 'details', label: 'Specifications' },
                { id: 'reviews', label: 'Reviews' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-1 px-6 py-5 font-bold text-sm uppercase tracking-wider transition-all ${activeTab === tab.id
                    ? 'text-pink-600 border-b-2 border-pink-600 bg-white'
                    : 'text-slate-800 hover:text-slate-900 hover:bg-white/50'
                    }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="p-8 md:p-10 min-h-[300px]">
              {activeTab === 'description' && (
                <div className="prose prose-slate max-w-none">
                  <p className="text-slate-900 text-lg leading-relaxed">
                    {product.description}
                  </p>
                  {product.tags && product.tags.length > 0 && (
                    <div className="mt-8">
                      <h4 className="font-bold text-slate-900 text-lg mb-4 uppercase tracking-wide flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-pink-500" /> Tags
                      </h4>
                      <div className="flex flex-wrap gap-3">
                        {product.tags.map((tag, index) => (
                          <Badge key={index} className="bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-200 px-4 py-1.5 text-sm transition-colors cursor-default">
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'details' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div>
                    <h4 className="font-bold text-slate-900 text-lg mb-6 uppercase tracking-wide border-b border-slate-200 pb-2">Specifications</h4>
                    <dl className="space-y-4">
                      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex justify-between items-center">
                        <dt className="text-sm font-bold text-slate-600 uppercase tracking-wider">Size</dt>
                        <dd className="text-slate-900 font-bold">{product.size || 'Standard'}</dd>
                      </div>
                      {product.materials && (
                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                          <dt className="text-sm font-bold text-slate-600 uppercase tracking-wider mb-2">Materials</dt>
                          <dd className="text-slate-900 font-medium">{product.materials.join(', ')}</dd>
                        </div>
                      )}
                      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex justify-between items-center">
                        <dt className="text-sm font-bold text-slate-600 uppercase tracking-wider">Stock Status</dt>
                        <dd className="text-slate-900 font-bold">{product.stock_quantity} units available</dd>
                      </div>
                    </dl>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-lg mb-6 uppercase tracking-wide border-b border-slate-200 pb-2">Care Instructions</h4>
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
                      <p className="text-slate-900 leading-relaxed italic">"{product.care_instructions}"</p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="text-center py-12">
                  <div className="mb-8">
                    <div className="flex items-center justify-center gap-2 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-10 h-10 ${i < Math.floor(product.rating || 4.5)
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-slate-200'
                            }`}
                        />
                      ))}
                    </div>
                    <p className="text-4xl font-black text-slate-900 mb-2">
                      {product.rating?.toFixed(1)} <span className="text-2xl text-slate-600">/ 5</span>
                    </p>
                    <p className="text-slate-800 font-medium">Based on {product.reviews} customer reviews</p>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 max-w-lg mx-auto">
                    <p className="text-slate-900 text-lg">
                      Customer reviews section is currently being updated. Check back soon to see what others are saying about this treasure!
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
};

export default ProductDetailPage;
