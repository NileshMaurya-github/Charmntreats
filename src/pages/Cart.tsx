import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, ShieldCheck, Truck } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Cart = () => {
  const navigate = useNavigate();
  const { cartItems, updateQuantity, removeFromCart, getTotalPrice, getTotalItems } = useCart();
  const { toast } = useToast();

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      toast({
        title: "Item Removed",
        description: "Item has been removed from your cart.",
      });
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleRemoveItem = (productId: string, productName: string) => {
    removeFromCart(productId);
    toast({
      title: "Item Removed",
      description: `${productName} has been removed from your cart.`,
    });
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900">
        <Header />
        <div className="container mx-auto px-4 py-20 flex flex-col items-center justify-center min-h-[60vh]">
          <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center mb-6 animate-pulse shadow-lg shadow-pink-100">
            <ShoppingBag className="h-16 w-16 text-pink-400" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 mb-4">Your Cart is Empty</h1>
          <p className="text-slate-900 mb-8 text-lg max-w-md text-center">
            Looks like you haven't added any treasures to your cart yet.
          </p>
          <Button
            onClick={() => navigate('/products')}
            className="bg-pink-600 hover:bg-pink-700 text-white font-bold text-lg px-8 py-6 rounded-xl shadow-lg shadow-pink-200"
          >
            Start Shopping
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header />

      <div className="container mx-auto px-4 py-12 pt-24">
        {/* Breadcrumb */}
        <div className="flex items-center gap-3 mb-8 animate-fade-in">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-slate-800 hover:text-pink-600 hover:bg-pink-50"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
          <span className="text-slate-800">•</span>
          <span className="text-pink-600 font-bold">Shopping Cart</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between mb-4 animate-slide-up">
              <h1 className="text-3xl font-black text-slate-900">
                Shopping Cart <span className="text-pink-600">({getTotalItems()} items)</span>
              </h1>
            </div>

            <div className="space-y-4">
              {cartItems.map((item, index) => (
                <div
                  key={item.id}
                  className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row gap-6 animate-slide-up hover:border-pink-300 hover:shadow-lg hover:shadow-pink-100 transition-all duration-300"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="w-full sm:w-32 h-32 flex-shrink-0 overflow-hidden rounded-xl border border-slate-200 group">
                    <img
                      src={item.images[0]}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-bold text-slate-900 mb-1 line-clamp-1 hover:text-pink-600 transition-colors cursor-pointer" onClick={() => navigate(`/product/${item.id}`)}>
                          {item.name}
                        </h3>
                        <p className="text-sm text-slate-900 mb-2">
                          {item.category} • <span className="font-mono text-xs bg-slate-100 px-2 py-0.5 rounded text-slate-900">{item.catalogNumber}</span>
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveItem(item.id, item.name)}
                        className="text-slate-800 hover:text-red-500 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-4 mt-4">
                      <div className="flex items-center bg-slate-50 rounded-lg border border-slate-200 p-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          className="h-8 w-8 p-0 hover:bg-white text-slate-900 shadow-sm"
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-10 text-center text-sm font-bold text-slate-900">
                          {item.quantity}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          className="h-8 w-8 p-0 hover:bg-white text-slate-900 shadow-sm"
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>

                      <div className="text-right">
                        <div className="font-black text-xl text-pink-600">
                          ₹{(item.price * item.quantity).toLocaleString()}
                        </div>
                        <div className="text-xs text-slate-900 font-medium">
                          ₹{item.price.toLocaleString()} each
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <div className="bg-white border border-slate-200 rounded-2xl p-6 sticky top-24 shadow-xl shadow-slate-200/50">
              <h2 className="text-xl font-black text-slate-900 mb-6 pb-4 border-b border-slate-100">Order Summary</h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-slate-900">
                  <span>Subtotal ({getTotalItems()} items)</span>
                  <span className="font-bold text-slate-900">₹{getTotalPrice().toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-900">
                  <span>Shipping</span>
                  <span className={`font-bold ${getTotalPrice() >= 500 ? 'text-green-600' : 'text-slate-900'}`}>
                    {getTotalPrice() >= 500 ? 'Free' : '₹50'}
                  </span>
                </div>

                {getTotalPrice() < 500 && (
                  <div className="text-xs text-amber-600 bg-amber-50 border border-amber-100 p-3 rounded-lg flex items-center gap-2">
                    <div className="w-1 h-1 bg-amber-500 rounded-full animate-pulse"></div>
                    Add ₹{(500 - getTotalPrice()).toLocaleString()} more for free shipping
                  </div>
                )}

                <div className="border-t border-slate-100 pt-4 mt-4">
                  <div className="flex justify-between items-end">
                    <span className="text-lg font-bold text-slate-900">Total</span>
                    <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-rose-600">
                      ₹{(getTotalPrice() + (getTotalPrice() >= 500 ? 0 : 50)).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-xs text-slate-900 mt-1 text-right">Including all taxes</p>
                </div>
              </div>

              <Button
                onClick={handleCheckout}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold h-14 text-lg shadow-lg shadow-slate-200 mb-4 rounded-xl"
              >
                Proceed to Checkout
              </Button>

              <Button
                variant="outline"
                onClick={() => navigate('/products')}
                className="w-full border-slate-200 hover:bg-slate-50 text-slate-900 font-bold h-12 rounded-xl"
              >
                Continue Shopping
              </Button>

              <div className="mt-6 space-y-3">
                <div className="flex items-center gap-3 text-xs text-slate-900">
                  <ShieldCheck className="w-4 h-4 text-green-500" />
                  <span>Secure checkout powered by SSL encryption</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-900">
                  <Truck className="w-4 h-4 text-blue-500" />
                  <span>Fast delivery within 3-5 business days</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Cart;
