import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
import { ProductService } from '@/services/productService';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-pink-900 relative overflow-hidden">
      {/* GOD-LEVEL Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-float-slow"></div>
        <div className="absolute bottom-20 right-20 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-3xl animate-float-medium"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-rose-500/10 rounded-full blur-3xl animate-float-fast"></div>
      </div>

      {/* Sparkle Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-twinkle"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>
      
      <Header />
      
      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Breadcrumb - GOD LEVEL */}
        <div className="flex items-center gap-1.5 text-xs text-white/70 mb-6 flex-wrap">
          <button onClick={() => navigate('/')} className="hover:text-pink-300 transition-colors duration-200 font-bold">
            Home
          </button>
          <ChevronRight className="w-3 h-3" />
          <button onClick={() => navigate('/products')} className="hover:text-pink-300 transition-colors duration-200 font-bold">
            Products
          </button>
          <ChevronRight className="w-3 h-3" />
          <span className="text-white/50 font-bold">{product.category}</span>
          <ChevronRight className="w-3 h-3" />
          <span className="text-pink-300 font-black truncate">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-12">
          {/* Image Gallery - GOD LEVEL */}
          <div className="space-y-4">
            {/* Main Image with Premium Frame */}
            <div className="group relative">
              {/* Outer Glow */}
              <div className="absolute -inset-2 bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 rounded-3xl blur-2xl opacity-0 group-hover:opacity-40 transition-all duration-700"></div>
              
              {/* Glass Container */}
              <div className="relative bg-white/10 backdrop-blur-xl border-2 border-white/20 hover:border-pink-400/50 transition-all duration-500 rounded-3xl overflow-hidden p-2">
                <div className="relative aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800 shadow-2xl">
                  <img
                    src={product.images[selectedImage]}
                    alt={product.name}
                    className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder.svg';
                    }}
                  />
              
              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.featured && (
                  <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-xl border-0 text-xs py-1 px-3 font-black">
                    <Sparkles className="w-3 h-3 mr-1" />
                    Featured
                  </Badge>
                )}
                {product.stock_quantity && product.stock_quantity < 5 && (
                  <Badge className="bg-red-500 text-white shadow-xl animate-pulse border-0 text-xs py-1 px-3 font-black">
                    Only {product.stock_quantity} left!
                  </Badge>
                )}
              </div>

              {/* Favorite */}
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className="absolute top-4 right-4 p-3 rounded-full bg-white/90 backdrop-blur-xl shadow-xl hover:bg-white transition-all duration-300 hover:scale-110 border-2 border-white/50"
              >
                <Heart
                  className={`w-5 h-5 transition-colors duration-300 ${
                    isFavorite ? 'fill-rose-500 text-rose-500' : 'text-gray-700'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

            {/* Thumbnail Gallery - Premium */}
            <div className="grid grid-cols-4 gap-3">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative aspect-square rounded-2xl overflow-hidden transition-all duration-300 ${
                    selectedImage === index
                      ? 'ring-4 ring-pink-500 scale-105 shadow-2xl shadow-pink-500/50'
                      : 'ring-2 ring-white/20 hover:ring-pink-300 hover:scale-105'
                  }`}
                >
                  <div className="absolute inset-0 bg-white/5 backdrop-blur-sm"></div>
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

            {/* Trust Badges - GOD LEVEL */}
            <div className="grid grid-cols-4 gap-3 pt-4">
              {[
                { icon: Shield, label: 'Authentic', gradient: 'from-emerald-500 to-teal-500', iconColor: 'text-white' },
                { icon: Truck, label: 'Free Ship', gradient: 'from-blue-500 to-cyan-500', iconColor: 'text-white' },
                { icon: RotateCcw, label: 'Returns', gradient: 'from-violet-500 to-purple-500', iconColor: 'text-white' },
                { icon: Lock, label: 'Secure', gradient: 'from-amber-500 to-yellow-500', iconColor: 'text-white' }
              ].map((badge, index) => {
                const Icon = badge.icon;
                return (
                  <div key={index} className="group relative">
                    <div className={`absolute -inset-1 bg-gradient-to-r ${badge.gradient} rounded-2xl blur-lg opacity-0 group-hover:opacity-40 transition-all duration-500`}></div>
                    <div className="relative text-center p-4 bg-white/10 backdrop-blur-xl border-2 border-white/20 hover:border-white/40 rounded-2xl shadow-xl transition-all duration-500 hover:scale-110">
                      <div className={`w-10 h-10 mx-auto mb-2 rounded-xl bg-gradient-to-br ${badge.gradient} flex items-center justify-center shadow-2xl transform group-hover:rotate-12 transition-transform duration-500`}>
                        <Icon className={`w-5 h-5 ${badge.iconColor}`} />
                      </div>
                      <p className="text-xs font-black text-white">{badge.label}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Product Info - GOD LEVEL GLASS CARD */}
          <div className="space-y-6">
            {/* Glass Container */}
            <div className="bg-white/10 backdrop-blur-xl border-2 border-white/20 hover:border-pink-400/50 transition-all duration-500 rounded-3xl p-8 shadow-2xl">
              {/* Category */}
              <p className="text-sm font-black text-pink-300 uppercase tracking-wider mb-4">
                {product.category}
              </p>

              {/* Name - 3D Effect */}
              <h1 className="text-4xl md:text-5xl font-black mb-6 relative">
                <span className="absolute inset-0 text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-rose-200 to-pink-300 blur-sm">
                  {product.name}
                </span>
                <span className="absolute inset-0 text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-rose-300 to-pink-400 blur-xs">
                  {product.name}
                </span>
                <span className="relative text-transparent bg-clip-text bg-gradient-to-r from-white via-pink-100 to-white">
                  {product.name}
                </span>
              </h1>

              {/* Rating - Premium */}
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 transition-all duration-300 ${
                        i < Math.floor(product.rating || 4.5)
                          ? 'fill-amber-400 text-amber-400 drop-shadow-lg animate-pulse'
                          : 'text-white/30'
                      }`}
                      style={{ animationDelay: `${i * 0.1}s` }}
                    />
                  ))}
                </div>
                <span className="text-sm font-bold text-white/90">
                  {product.rating?.toFixed(1)} ({product.reviews || 0} reviews)
                </span>
                {product.rating && product.rating >= 4.8 && (
                  <Badge className="bg-green-500 text-white border-0 shadow-lg font-black">
                    <Award className="w-3 h-3 mr-1" />
                    Top Rated
                  </Badge>
                )}
              </div>

              <Separator className="bg-white/10 my-6" />

              {/* Price - GOD LEVEL */}
              <div className="space-y-3 mb-6">
                <div className="flex items-baseline gap-3">
                  <p className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-rose-400 to-pink-400 drop-shadow-2xl">
                    {formatPrice(product.price)}
                  </p>
                  {product.price > 1000 && (
                    <Badge className="bg-green-500 text-white border-0 shadow-lg font-black px-3 py-1">
                      <Truck className="w-3 h-3 mr-1" />
                      Free Shipping
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-white/70 font-bold">Inclusive of all taxes</p>
              </div>

              {/* Stock Status - Premium */}
              <div className="flex items-center gap-2 mb-6">
                {product.in_stock ? (
                  <>
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="font-black text-green-300">
                      In Stock - Ready to Ship
                    </span>
                  </>
                ) : (
                  <span className="font-black text-red-400">Out of Stock</span>
                )}
              </div>

              {/* Quick Info - Glass Card */}
              <div className="bg-gradient-to-br from-blue-500/10 to-indigo-500/10 backdrop-blur-xl border border-white/10 rounded-2xl p-4 space-y-2 mb-6">
                <div className="flex items-center gap-2 text-sm text-white/90">
                  <Clock className="w-4 h-4 text-blue-400" />
                  <span className="font-bold"><span className="text-blue-300">Dispatch:</span> Within 2-3 business days</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-white/90">
                  <Package className="w-4 h-4 text-blue-400" />
                  <span className="font-bold"><span className="text-blue-300">Catalog:</span> {product.catalogNumber}</span>
                </div>
              </div>

              <Separator className="bg-white/10 my-6" />

              {/* Quantity Selector - Premium Glass */}
              <div className="space-y-3 mb-6">
                <label className="text-sm font-black text-white/90 uppercase tracking-wider">Quantity:</label>
                <div className="flex items-center gap-4">
                  <div className="flex items-center bg-white/10 backdrop-blur-xl border-2 border-white/20 rounded-2xl overflow-hidden shadow-xl">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-4 hover:bg-pink-500/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={quantity <= 1}
                    >
                      <Minus className="w-5 h-5 text-white" />
                    </button>
                    <span className="px-8 font-black text-2xl text-white">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-4 hover:bg-pink-500/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={product.stock_quantity ? quantity >= product.stock_quantity : false}
                    >
                      <Plus className="w-5 h-5 text-white" />
                    </button>
                  </div>
                  <span className="text-sm text-white/70 font-bold">
                    {product.stock_quantity && `(${product.stock_quantity} available)`}
                  </span>
                </div>
              </div>

            {/* Action Buttons - GOD-LEVEL Premium */}
            <div className="space-y-4 pt-4">
              <Button
                onClick={handleAddToCart}
                disabled={!product.in_stock}
                size="lg"
                className="w-full bg-gradient-to-r from-pink-600 via-rose-600 to-pink-600 hover:from-pink-500 hover:via-rose-500 hover:to-pink-500 text-white text-lg font-black py-5 rounded-2xl shadow-[0_0_40px_rgba(236,72,153,0.6)] hover:shadow-[0_0_60px_rgba(236,72,153,0.8)] transition-all duration-300 transform hover:scale-105 border-2 border-pink-400/30 uppercase tracking-wider"
              >
                {addedToCart ? (
                  <>
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Added to Cart!
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Add to Cart - {formatPrice(product.price * quantity)}
                  </>
                )}
              </Button>

              <div className="grid grid-cols-2 gap-4">
                <Button
                  size="lg"
                  className="bg-white/10 backdrop-blur-xl border-2 border-pink-400/50 text-white hover:bg-white/20 hover:border-pink-300 font-black py-5 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 text-base uppercase tracking-wide"
                  onClick={() => {
                    handleAddToCart();
                    navigate('/checkout');
                  }}
                >
                  Buy Now
                </Button>
                <Button
                  size="lg"
                  className="bg-white/10 backdrop-blur-xl border-2 border-white/30 text-white hover:bg-white/20 hover:border-white/50 font-black py-5 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: product.name,
                        text: `Check out ${product.name} - ${formatPrice(product.price)}`,
                        url: window.location.href
                      }).catch(() => {});
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

            {/* Guarantee - Premium Glass Card */}
            <Card className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-xl border-2 border-green-400/30 shadow-[0_0_30px_rgba(34,197,94,0.3)]">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="bg-green-500/20 p-3 rounded-xl border border-green-400/30">
                    <Shield className="w-7 h-7 text-green-300 flex-shrink-0" />
                  </div>
                  <div>
                    <h4 className="font-black text-xl text-white mb-2">Quality Guarantee</h4>
                    <p className="text-base text-white/90 font-semibold">
                      100% authentic handcrafted product. 7-day return policy if you're not completely satisfied.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Tabs Section - GOD-LEVEL Glass Container */}
        <Card className="shadow-[0_0_60px_rgba(236,72,153,0.3)] rounded-3xl bg-white/5 backdrop-blur-xl border-2 border-white/10">
          <CardContent className="p-0">
            {/* Tab Headers - Premium Glass Buttons */}
            <div className="flex border-b-2 border-white/10 bg-white/5 backdrop-blur-xl rounded-t-3xl">
              {[
                { id: 'description', label: 'Description' },
                { id: 'details', label: 'Specifications' },
                { id: 'reviews', label: 'Reviews' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-1 px-8 py-6 font-black text-lg uppercase tracking-wider transition-all ${
                    activeTab === tab.id
                      ? 'text-white border-b-4 border-pink-500 bg-gradient-to-t from-pink-500/20 to-transparent shadow-[0_4px_20px_rgba(236,72,153,0.4)]'
                      : 'text-white/60 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content - Dark Glass */}
            <div className="p-10 bg-white/5 backdrop-blur-xl rounded-b-3xl">
              {activeTab === 'description' && (
                <div className="prose max-w-none">
                  <p className="text-white text-lg leading-relaxed font-semibold">
                    {product.description}
                  </p>
                  {product.tags && product.tags.length > 0 && (
                    <div className="mt-8">
                      <h4 className="font-black text-white text-xl mb-4 uppercase tracking-wide">Tags:</h4>
                      <div className="flex flex-wrap gap-3">
                        {product.tags.map((tag, index) => (
                          <Badge key={index} className="bg-pink-500/20 border-2 border-pink-400/30 text-pink-200 font-bold text-base px-4 py-2">
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'details' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="font-black text-white text-xl mb-5 uppercase tracking-wide">Specifications</h4>
                    <dl className="space-y-4">
                      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4">
                        <dt className="text-sm font-black text-pink-300 uppercase tracking-wider mb-1">Size:</dt>
                        <dd className="text-white font-bold text-lg">{product.size || 'Standard'}</dd>
                      </div>
                      {product.materials && (
                        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4">
                          <dt className="text-sm font-black text-pink-300 uppercase tracking-wider mb-1">Materials:</dt>
                          <dd className="text-white font-bold text-lg">{product.materials.join(', ')}</dd>
                        </div>
                      )}
                      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4">
                        <dt className="text-sm font-black text-pink-300 uppercase tracking-wider mb-1">Stock:</dt>
                        <dd className="text-white font-bold text-lg">{product.stock_quantity} units available</dd>
                      </div>
                    </dl>
                  </div>
                  <div>
                    <h4 className="font-black text-white text-xl mb-5 uppercase tracking-wide">Care Instructions</h4>
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
                      <p className="text-white/90 font-semibold text-base leading-relaxed">{product.care_instructions}</p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="text-center py-12">
                  <div className="mb-8">
                    <div className="flex items-center justify-center gap-3 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-10 h-10 ${
                            i < Math.floor(product.rating || 4.5)
                              ? 'fill-amber-400 text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.8)]'
                              : 'text-white/20'
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-5xl font-black text-white mb-3 drop-shadow-[0_0_20px_rgba(236,72,153,0.6)]">
                      {product.rating?.toFixed(1)} out of 5
                    </p>
                    <p className="text-white/80 font-bold text-lg">Based on {product.reviews} reviews</p>
                  </div>
                  <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 max-w-md mx-auto">
                    <p className="text-white/70 font-semibold text-base">
                      Customer reviews coming soon! Be the first to review this product.
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
