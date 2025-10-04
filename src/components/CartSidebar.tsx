import React, { useEffect, useState } from 'react';
import { X, Plus, Minus, Trash2, ShoppingBag, Heart, Sparkles, Gift, ArrowRight, Shield, Truck, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/contexts/CartContext';
import { Separator } from '@/components/ui/separator';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartSidebar: React.FC<CartSidebarProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { cartItems, updateQuantity, removeFromCart, getTotalPrice, clearCart } = useCart();
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setAnimate(true);
    } else {
      document.body.style.overflow = 'unset';
      setAnimate(false);
    }

    return () => {
      document.body.style.overflow = 'unset';
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
    if (total > 2000) return total * 0.1; // 10% discount
    if (total > 1000) return total * 0.05; // 5% discount
    return 0;
  };

  const getShippingCost = () => {
    return getTotalPrice() >= 1500 ? 0 : 99;
  };

  const getFreeShippingProgress = () => {
    const total = getTotalPrice();
    if (total >= 1500) return 100;
    return (total / 1500) * 100;
  };

  const totalPrice = getTotalPrice();
  const savings = calculateSavings();
  const shipping = getShippingCost();
  const finalTotal = totalPrice + shipping - savings;
  const freeShippingProgress = getFreeShippingProgress();

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity duration-200 ${
          animate ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <div
        className={`fixed right-0 top-0 h-full w-full sm:w-[420px] bg-white shadow-xl z-50 transform transition-transform duration-250 ease-out flex flex-col ${
          animate ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-rose-600 to-pink-600 text-white">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-white/20 rounded-lg">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Cart</h2>
                <p className="text-xs text-rose-100">
                  {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-white/20 rounded-full transition-colors duration-150"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress */}
          {totalPrice < 1500 && totalPrice > 0 && (
            <div className="mt-3 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1">
                  <Truck className="w-3 h-3" />
                  Free Shipping
                </span>
                <span className="font-semibold">
                  {formatPrice(1500 - totalPrice)} away
                </span>
              </div>
              <div className="w-full bg-white/30 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-white h-full transition-all duration-300 rounded-full"
                  style={{ width: `${freeShippingProgress}%` }}
                />
              </div>
            </div>
          )}

          {totalPrice >= 1500 && totalPrice > 0 && (
            <div className="mt-3 flex items-center gap-1.5 text-xs bg-white/20 px-2.5 py-1.5 rounded-lg">
              <Gift className="w-3 h-3" />
              <span className="font-semibold">🎉 FREE shipping!</span>
            </div>
          )}
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto px-4 py-3">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-8">
              <div className="w-20 h-20 mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <ShoppingBag className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">Cart is empty</h3>
              <p className="text-sm text-gray-600 mb-4">Add handcrafted items!</p>
              <Button
                onClick={() => {
                  onClose();
                  navigate('/products');
                }}
                size="sm"
                className="bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700"
              >
                Start Shopping
                <ArrowRight className="w-3 h-3 ml-1" />
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="group bg-white border border-gray-100 rounded-lg p-3 hover:border-rose-200 hover:shadow-md transition-all duration-150"
                >
                  <div className="flex gap-3">
                    {/* Image */}
                    <div className="relative flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-lg"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/placeholder.svg';
                        }}
                      />
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="absolute -top-1.5 -right-1.5 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-150 hover:bg-red-600 hover:scale-105"
                      >
                        <Trash2 className="w-2.5 h-2.5" />
                      </button>
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-sm text-gray-900 line-clamp-2 mb-0.5 group-hover:text-rose-600 transition-colors duration-150">
                        {item.name}
                      </h4>
                      <p className="text-xs text-gray-500 mb-1.5">{item.category}</p>
                      
                      <div className="flex items-center justify-between">
                        {/* Quantity Controls */}
                        <div className="flex items-center border border-gray-200 rounded-md overflow-hidden">
                          <button
                            onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                            className="p-1 hover:bg-gray-100 transition-colors duration-150"
                          >
                            <Minus className="w-2.5 h-2.5" />
                          </button>
                          <span className="px-2.5 font-bold text-xs">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1 hover:bg-gray-100 transition-colors duration-150"
                          >
                            <Plus className="w-2.5 h-2.5" />
                          </button>
                        </div>

                        {/* Price */}
                        <p className="font-bold text-base bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer with Summary */}
        {cartItems.length > 0 && (
          <div className="border-t border-gray-100 bg-gray-50 p-4 space-y-3">
            {/* Price Breakdown */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Subtotal ({cartItems.length} items)</span>
                <span className="font-semibold">{formatPrice(totalPrice)}</span>
              </div>

              {savings > 0 && (
                <div className="flex justify-between text-xs text-green-600">
                  <span className="flex items-center gap-1">
                    <Sparkles className="w-2.5 h-2.5" />
                    Savings ({totalPrice > 2000 ? '10%' : '5%'})
                  </span>
                  <span className="font-semibold">-{formatPrice(savings)}</span>
                </div>
              )}

              <div className="flex justify-between text-xs text-gray-600">
                <span className="flex items-center gap-1">
                  <Truck className="w-2.5 h-2.5" />
                  Shipping
                </span>
                <span className={`font-semibold ${shipping === 0 ? 'text-green-600' : ''}`}>
                  {shipping === 0 ? 'FREE' : formatPrice(shipping)}
                </span>
              </div>
            </div>

            <Separator />

            {/* Total */}
            <div className="flex justify-between items-center">
              <span className="text-base font-bold text-gray-900">Total</span>
              <span className="text-xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
                {formatPrice(finalTotal)}
              </span>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-1.5 py-2">
              <div className="text-center p-1.5 bg-white rounded-md">
                <Shield className="w-3 h-3 text-green-600 mx-auto mb-0.5" />
                <p className="text-[10px] font-semibold text-gray-700">Secure</p>
              </div>
              <div className="text-center p-1.5 bg-white rounded-md">
                <Award className="w-3 h-3 text-amber-600 mx-auto mb-0.5" />
                <p className="text-[10px] font-semibold text-gray-700">Quality</p>
              </div>
              <div className="text-center p-1.5 bg-white rounded-md">
                <Heart className="w-3 h-3 text-rose-600 mx-auto mb-0.5" />
                <p className="text-[10px] font-semibold text-gray-700">Handmade</p>
              </div>
            </div>

            {/* Checkout Button */}
            <Button
              onClick={handleProceedToCheckout}
              className="w-full bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white font-bold py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-150 transform hover:scale-102"
            >
              Proceed to Checkout
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>

            {/* Continue Shopping */}
            <Button
              onClick={onClose}
              variant="outline"
              className="w-full border py-2.5 text-sm"
            >
              Continue Shopping
            </Button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartSidebar;
