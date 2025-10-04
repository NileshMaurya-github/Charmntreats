import React, { useEffect, useState } from 'react';
import { X, Plus, Minus, Trash2, ShoppingBag, Heart, Sparkles, Gift } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/contexts/CartContext';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartSidebar: React.FC<CartSidebarProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { cartItems, updateQuantity, removeFromCart, getTotalPrice, clearCart } = useCart();
  const [animate, setAnimate] = useState(false);

  // Prevent body scroll when cart is open
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('cart-open');
      setAnimate(true);
    } else {
      document.body.classList.remove('cart-open');
      setAnimate(false);
    }

    return () => {
      document.body.classList.remove('cart-open');
    };
  }, [isOpen]);

  const handleProceedToCheckout = () => {
    onClose();
    navigate('/checkout');
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const calculateSavings = () => {
    const total = getTotalPrice();
    if (total > 2000) return total * 0.1; // 10% discount for orders over ₹2000
    if (total > 1000) return total * 0.05; // 5% discount for orders over ₹1000
    return 0;
  };

  const getFreeShippingProgress = () => {
    const total = getTotalPrice();
    const freeShippingThreshold = 1500;
    return Math.min((total / freeShippingThreshold) * 100, 100);
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-all duration-500 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div className={`fixed right-0 top-0 h-full w-full max-w-md cart-sidebar z-50 transform transition-all duration-500 ease-out ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="flex flex-col h-full bg-white/95 backdrop-blur-lg border-l border-rose-200/50 shadow-2xl">
          
          {/* Floating Floral Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 right-10 w-20 h-20 bg-gradient-to-br from-pink-200/20 to-rose-300/20 rounded-full animate-float blur-xl"></div>
            <div className="absolute bottom-40 left-8 w-16 h-16 bg-gradient-to-br from-purple-200/15 to-pink-200/15 rounded-full animate-float blur-xl" style={{ animationDelay: '2s' }}></div>
            <Sparkles className="absolute top-32 left-6 w-4 h-4 text-pink-300/40 animate-pulse" style={{ animationDelay: '1s' }} />
            <Sparkles className="absolute bottom-60 right-8 w-3 h-3 text-rose-300/40 animate-pulse" style={{ animationDelay: '3s' }} />
          </div>

          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-rose-100 relative z-10">
            <div className="flex items-center gap-3">
              <div className="relative">
                <ShoppingBag className="w-6 h-6 text-rose-600" />
                {cartItems.length > 0 && (
                  <Badge className="absolute -top-2 -right-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs px-1.5 py-0.5 rounded-full animate-pulse">
                    {cartItems.length}
                  </Badge>
                )}
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Shopping Cart</h2>
                <p className="text-sm text-gray-500">
                  {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
                </p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 hover:bg-rose-50 rounded-full p-2"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Free Shipping Progress */}
          {getTotalPrice() < 1500 && (
            <div className="p-6 border-b border-rose-100 relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <Gift className="w-4 h-4 text-rose-600" />
                <span className="text-sm font-medium text-gray-700">
                  Free shipping on orders over ₹1,500
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                <div 
                  className="bg-gradient-to-r from-pink-500 to-rose-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${getFreeShippingProgress()}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500">
                Add {formatPrice(1500 - getTotalPrice())} more for free shipping!
              </p>
            </div>
          )}

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 relative z-10">
            {cartItems.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-pink-100 to-rose-100 rounded-full flex items-center justify-center">
                  <ShoppingBag className="w-10 h-10 text-rose-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Your cart is empty</h3>
                <p className="text-gray-500 mb-6">Discover our beautiful handcrafted products</p>
                <Button 
                  onClick={() => {
                    onClose();
                    navigate('/products');
                  }}
                  className="btn-floral-gradient hover-scale"
                >
                  Start Shopping
                </Button>
              </div>
            ) : (
              cartItems.map((item, index) => (
                <div 
                  key={item.id}
                  className={`cart-item group animate-fade-in-up`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex gap-4">
                    {/* Product Image */}
                    <div className="flex-shrink-0 w-20 h-20 bg-gray-100 rounded-lg overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 mb-1 line-clamp-2 text-sm">
                        {item.name}
                      </h3>
                      <p className="text-xs text-gray-500 mb-2">{item.category}</p>
                      
                      {/* Price and Quantity */}
                      <div className="flex items-center justify-between">
                        <div className="text-lg font-bold text-gray-900">
                          {formatPrice(item.price)}
                        </div>
                        
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.id, Math.max(0, item.quantity - 1))}
                            className="w-8 h-8 p-0 border-rose-200 hover:bg-rose-50 hover:border-rose-300"
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          
                          <span className="w-8 text-center text-sm font-medium">
                            {item.quantity}
                          </span>
                          
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-8 h-8 p-0 border-rose-200 hover:bg-rose-50 hover:border-rose-300"
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFromCart(item.id)}
                            className="w-8 h-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50 ml-2"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {cartItems.length > 0 && (
            <div className="border-t border-rose-100 p-6 space-y-4 relative z-10">
              {/* Savings Display */}
              {calculateSavings() > 0 && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium text-green-800">
                      You're saving {formatPrice(calculateSavings())}!
                    </span>
                  </div>
                </div>
              )}

              {/* Order Summary */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">{formatPrice(getTotalPrice())}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium text-green-600">
                    {getTotalPrice() >= 1500 ? 'FREE' : '₹99'}
                  </span>
                </div>
                
                {calculateSavings() > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Savings</span>
                    <span className="font-medium text-green-600">
                      -{formatPrice(calculateSavings())}
                    </span>
                  </div>
                )}
                
                <div className="border-t border-gray-200 pt-2">
                  <div className="flex justify-between">
                    <span className="text-lg font-bold text-gray-900">Total</span>
                    <span className="text-lg font-bold text-gray-900">
                      {formatPrice(getTotalPrice() - calculateSavings() + (getTotalPrice() >= 1500 ? 0 : 99))}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button 
                  onClick={handleProceedToCheckout}
                  className="w-full btn-floral-gradient hover-scale text-base py-3"
                >
                  Proceed to Checkout
                </Button>
                
                <div className="flex gap-2">
                  <Button 
                    variant="outline"
                    onClick={() => {
                      onClose();
                      navigate('/products');
                    }}
                    className="flex-1 border-rose-200 text-rose-600 hover:bg-rose-50"
                  >
                    Continue Shopping
                  </Button>
                  
                  <Button 
                    variant="ghost"
                    onClick={clearCart}
                    className="text-gray-500 hover:text-red-600 hover:bg-red-50"
                  >
                    Clear Cart
                  </Button>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="flex justify-center gap-4 pt-4 border-t border-rose-100">
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Secure Payment
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Easy Returns
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  24/7 Support
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CartSidebar;