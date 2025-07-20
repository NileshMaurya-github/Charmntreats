import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ShoppingCart, Star, Heart, Truck, Shield } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Product } from '@/types/product';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toast } = useToast();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  // Helper function to check if product is actually in stock
  const isProductInStock = (product: Product | null): boolean => {
    if (!product) return false;
    // Check both in_stock flag and stock_quantity
    return product.in_stock && (product.stock_quantity === undefined || product.stock_quantity > 0);
  };

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      if (data) {
        const transformedProduct: Product = {
          id: data.id,
          name: data.name,
          description: data.description || '',
          price: data.price,
          category: data.category,
          images: data.images || ['https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80'],
          catalogNumber: data.catalog_number,
          in_stock: data.in_stock,
          stock_quantity: data.stock_quantity,
          featured: data.featured || false,
          rating: data.rating || undefined,
          reviews: data.reviews || undefined
        };
        setProduct(transformedProduct);
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      toast({
        title: "Error",
        description: "Failed to load product details. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!isProductInStock(product)) {
      toast({ title: 'Out of Stock', description: 'This product is currently out of stock.', variant: 'destructive' });
      return;
    }
    
    // Check if requested quantity is available
    if (product?.stock_quantity !== undefined && quantity > product.stock_quantity) {
      toast({ 
        title: 'Insufficient Stock', 
        description: `Only ${product.stock_quantity} items available.`, 
        variant: 'destructive' 
      });
      return;
    }
    
    addToCart({
      id: product!.id,
      name: product!.name,
      price: product!.price,
      image: product!.images[0] || '',
      images: product!.images,
      category: product!.category,
      catalogNumber: product!.catalogNumber
    });
    toast({ title: 'Added to Cart', description: `${product!.name} added to your cart.` });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading product details...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Product Not Found</h1>
            <p className="text-gray-600 mb-8">The product you're looking for doesn't exist or has been removed.</p>
            <Button onClick={() => navigate('/products')} className="btn-dark-pink">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Products
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/products')}
            className="flex items-center gap-2 text-slate-600 hover:text-black"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Products
          </Button>
          <span className="text-slate-400">•</span>
          <span className="text-slate-600">{product.category}</span>
          <span className="text-slate-400">•</span>
          <span className="text-black font-medium">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden rounded-lg bg-white shadow-lg">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-4 overflow-x-auto">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                      selectedImage === index ? 'border-black' : 'border-gray-200'
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
          <div className="space-y-6">
            <div>
              <Badge className="mb-2 bg-gray-100 text-black">{product.category}</Badge>
              <h1 className="text-3xl font-bold text-slate-800 mb-4">{product.name}</h1>
              
              {product.rating && (
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-5 w-5 ${
                          star <= product.rating! ? 'text-black fill-current' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-slate-600">
                    {product.rating} ({product.reviews} reviews)
                  </span>
                </div>
              )}
              
              <div className="text-3xl font-bold text-slate-800 mb-4">
                ₹{product.price.toLocaleString()}
              </div>
              
              <p className="text-slate-600 leading-relaxed mb-6">
                {product.description}
              </p>
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${isProductInStock(product) ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className={`font-medium ${isProductInStock(product) ? 'text-green-600' : 'text-red-600'}`}>
                {isProductInStock(product) ? 'In Stock' : 'Out of Stock'}
              </span>
              {product.stock_quantity !== undefined && (
                <span className="text-sm text-gray-500">
                  ({product.stock_quantity} available)
                </span>
              )}
            </div>

            {/* Quantity Selector */}
            {isProductInStock(product) && (
              <div className="flex items-center gap-4">
                <span className="text-slate-700 font-medium">Quantity:</span>
                <div className="flex items-center border rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 hover:bg-gray-100"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 border-x">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock_quantity || 999, quantity + 1))}
                    className="px-3 py-2 hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4">
              {isProductInStock(product) ? (
                <Button
                  onClick={handleAddToCart}
                  className="flex-1 btn-dark-pink"
                  size="lg"
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Add to Cart
                </Button>
              ) : (
                <Button
                  disabled
                  className="flex-1 bg-gray-400 cursor-not-allowed text-white"
                  size="lg"
                >
                  Out of Stock
                </Button>
              )}
              <Button variant="outline" size="lg">
                <Heart className="h-5 w-5" />
              </Button>
            </div>

            {/* Product Details */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-slate-800 mb-4">Product Details</h3>
                <div className="space-y-3">
                  <div>
                    <span className="font-semibold">Availability:</span>{' '}
                    <span className={isProductInStock(product) ? 'text-green-600' : 'text-red-600'}>
                      {isProductInStock(product) ? 'In Stock' : 'Out of Stock'}
                    </span>
                    {product.stock_quantity !== undefined && (
                      <span className="text-sm text-gray-500 ml-2">
                        ({product.stock_quantity} available)
                      </span>
                    )}
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Catalog Number:</span>
                    <span className="font-medium">#{product.catalogNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Category:</span>
                    <span className="font-medium">{product.category}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                <Truck className="h-8 w-8 text-black mx-auto mb-2" />
                <div className="text-sm font-medium text-slate-800">Free Shipping</div>
                <div className="text-xs text-slate-600">On orders above ₹599</div>
              </div>
              <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                <Shield className="h-8 w-8 text-black mx-auto mb-2" />
                <div className="text-sm font-medium text-slate-800">Secure Payment</div>
                <div className="text-xs text-slate-600">100% protected</div>
              </div>
              <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                <Shield className="h-8 w-8 text-black mx-auto mb-2" />
                <div className="text-sm font-medium text-slate-800">100% Authentic</div>
                <div className="text-xs text-slate-600">Genuine products</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default ProductDetailPage;
