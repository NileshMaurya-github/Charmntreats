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
  Eye,
  MessageCircle
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

  useEffect(() => {
    if (id) {
      const foundProduct = ProductService.getProductById(id);
      setProduct(foundProduct);
      if (!foundProduct) {
        navigate('/products');
      }
    }
  }, [id, navigate]);

  if (!product) {
    return (
      <div className="min-h-screen bg-floral-gradient flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-pink-200 to-rose-200 rounded-full flex items-center justify-center animate-pulse">
            <Package className="w-8 h-8 text-rose-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Product Not Found</h2>
          <p className="text-gray-600 mb-6">The product you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => navigate('/products')} className="btn-floral">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Products
          </Button>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
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
    setQuantity(1);
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: product.name,
        text: product.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      // You could add a toast notification here
    }
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
        <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <Star key="half" className="w-5 h-5 fill-yellow-400/50 text-yellow-400" />
      );
    }

    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(
        <Star key={`empty-${i}`} className="w-5 h-5 text-gray-300" />
      );
    }

    return stars;
  };

  return (
    <div className="min-h-screen bg-floral-gradient">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-8 animate-fade-in-down">
          <button onClick={() => navigate('/')} className="hover:text-rose-600 transition-colors">
            Home
          </button>
          <ChevronRight className="w-4 h-4" />
          <button onClick={() => navigate('/products')} className="hover:text-rose-600 transition-colors">
            Products
          </button>
          <ChevronRight className="w-4 h-4" />
          <button onClick={() => navigate(`/products?category=${encodeURIComponent(product.category)}`)} className="hover:text-rose-600 transition-colors">
            {product.category}
          </button>
          <ChevronRight className="w-4 h-4" />
          <span className="text-rose-600 font-medium">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Product Images */}
          <div className="space-y-4 animate-fade-in-left">
            {/* Main Image */}
            <div className="aspect-square bg-white rounded-2xl overflow-hidden shadow-lg">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover hover-scale cursor-zoom-in"
              />
            </div>
            
            {/* Thumbnail Images */}
            {product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === index 
                        ? 'border-rose-500 shadow-lg' 
                        : 'border-gray-200 hover:border-rose-300'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6 animate-fade-in-right">
            {/* Category and Badge */}
            <div className="flex items-center justify-between">
              <Badge variant="secondary" className="bg-rose-100 text-rose-700 hover:bg-rose-200">
                {product.category}
              </Badge>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsFavorite(!isFavorite)}
                  className="text-gray-400 hover:text-red-500"
                >
                  <Heart className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleShare}
                  className="text-gray-400 hover:text-blue-500"
                >
                  <Share2 className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Product Name */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
              {product.name}
            </h1>

            {/* Rating and Reviews */}
            {product.rating && (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  {renderStars(product.rating)}
                </div>
                <span className="text-sm text-gray-600">
                  {product.rating} ({product.reviews} reviews)
                </span>
              </div>
            )}

            {/* Price */}
            <div className="text-3xl font-bold text-gray-900">
              {formatPrice(product.price)}
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-2">
              {product.in_stock ? (
                <>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-green-700 font-medium">
                    In Stock {product.stock_quantity && `(${product.stock_quantity} available)`}
                  </span>
                </>
              ) : (
                <>
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-red-700 font-medium">Out of Stock</span>
                </>
              )}
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center gap-4">
              <span className="font-medium text-gray-700">Quantity:</span>
              <div className="flex items-center border border-gray-300 rounded-lg">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 hover:bg-gray-100"
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="px-4 py-2 font-medium min-w-[3rem] text-center">
                  {quantity}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-2 hover:bg-gray-100"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <Button
              onClick={handleAddToCart}
              disabled={!product.in_stock}
              className="w-full btn-floral-gradient text-lg py-3 hover-scale"
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              Add to Cart - {formatPrice(product.price * quantity)}
            </Button>

            {/* Features */}
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="flex items-center gap-3 p-3 bg-white/50 rounded-lg">
                <Truck className="w-5 h-5 text-rose-600" />
                <span className="text-sm text-gray-700">Free Shipping</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white/50 rounded-lg">
                <Shield className="w-5 h-5 text-rose-600" />
                <span className="text-sm text-gray-700">Secure Payment</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white/50 rounded-lg">
                <RotateCcw className="w-5 h-5 text-rose-600" />
                <span className="text-sm text-gray-700">Easy Returns</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white/50 rounded-lg">
                <MessageCircle className="w-5 h-5 text-rose-600" />
                <span className="text-sm text-gray-700">24/7 Support</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <Card className="card-floral animate-fade-in-up">
          <CardContent className="p-0">
            {/* Tab Headers */}
            <div className="flex border-b border-gray-200">
              {[
                { key: 'description', label: 'Description' },
                { key: 'details', label: 'Details' },
                { key: 'reviews', label: 'Reviews' }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`px-6 py-4 font-medium transition-colors ${
                    activeTab === tab.key
                      ? 'text-rose-600 border-b-2 border-rose-600'
                      : 'text-gray-600 hover:text-rose-600'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {activeTab === 'description' && (
                <div className="space-y-4">
                  <p className="text-gray-700 leading-relaxed text-lg">
                    {product.description}
                  </p>
                  {product.materials && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Materials:</h4>
                      <ul className="list-disc list-inside text-gray-700 space-y-1">
                        {product.materials.map((material, index) => (
                          <li key={index}>{material}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'details' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">SKU:</span>
                      <span className="text-gray-900">{product.catalogNumber}</span>
                    </div>
                    {product.size && (
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-600">Size:</span>
                        <span className="text-gray-900">{product.size}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">Category:</span>
                      <span className="text-gray-900">{product.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">Stock:</span>
                      <span className="text-gray-900">{product.stock_quantity} units</span>
                    </div>
                  </div>
                  {product.care_instructions && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Care Instructions:</h4>
                      <p className="text-gray-700">{product.care_instructions}</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="text-center py-8">
                  <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">No Reviews Yet</h3>
                  <p className="text-gray-600 mb-4">Be the first to review this product!</p>
                  <Button className="btn-floral">Write a Review</Button>
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