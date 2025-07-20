
import React, { useEffect } from 'react';
import { X, Plus, Minus, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartSidebar: React.FC<CartSidebarProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { cartItems, updateQuantity, removeFromCart, getTotalPrice, clearCart } = useCart();

  // Prevent body scroll when cart is open
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('cart-open');
    } else {
      document.body.classList.remove('cart-open');
    }

    return () => {
      document.body.classList.remove('cart-open');
    };
  }, [isOpen]);

  const handleProceedToCheckout = () => {
    onClose(); // Close the sidebar
    navigate('/checkout'); // Navigate to checkout page
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div className={`fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="flex flex-col h-full bg-white">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
            <h2 className="text-lg font-semibold text-gray-800">Shopping Cart ({cartItems.length})</h2>
            <Button variant="ghost" size="sm" onClick={onClose} className="hover:bg-gray-100">
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50" style={{ paddingBottom: cartItems.length > 0 ? '200px' : '0' }}>
            {cartItems.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5-6M20 13v6a2 2 0 01-2 2H6a2 2 0 01-2-2v-6" />
                  </svg>
                </div>
                <p className="text-gray-500 mb-4">Your cart is empty</p>
                <Button onClick={onClose} className="bg-pink-600 hover:bg-pink-700 text-white">
                  Continue Shopping
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                    {/* Product Image and Basic Info */}
                    <div className="flex gap-3 mb-3">
                      <div className="w-20 h-20 flex-shrink-0">
                        <img
                          src={item.images[0]}
                          alt={item.name}
                          className="w-full h-full object-cover rounded-md border"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm text-gray-800 leading-tight mb-1">
                          {item.name}
                        </h3>
                        <p className="text-pink-600 font-bold text-base">₹{item.price.toLocaleString()}</p>
                        <p className="text-xs text-gray-500 mt-1">#{item.catalogNumber}</p>
                        <p className="text-xs text-gray-600 mt-1">{item.category}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFromCart(item.id)}
                        className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50 flex-shrink-0"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    {/* Quantity Controls and Subtotal */}
                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">Qty:</span>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="h-8 w-8 p-0 border-gray-300"
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="text-sm font-semibold w-10 text-center bg-gray-50 py-1.5 rounded border">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="h-8 w-8 p-0 border-gray-300"
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-600">Subtotal:</div>
                        <div className="font-bold text-gray-900">₹{(item.price * item.quantity).toLocaleString()}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {cartItems.length > 0 && (
            <div className="border-t border-gray-200 p-4 bg-white space-y-4">
              {/* Free Shipping Notice */}
              {getTotalPrice() >= 599 ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-green-700 font-medium">Free Shipping on ₹599+</span>
                  </div>
                </div>
              ) : (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                  <div className="text-sm text-orange-700">
                    Add ₹{(599 - getTotalPrice()).toLocaleString()} more for free shipping
                  </div>
                </div>
              )}
              
              <div className="flex justify-between items-center py-2">
                <span className="font-semibold text-gray-800">Total:</span>
                <span className="font-bold text-xl text-gray-900">₹{getTotalPrice().toLocaleString()}</span>
              </div>
              
              <div className="space-y-2">
                <Button 
                  onClick={handleProceedToCheckout}
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-3"
                >
                  Proceed to Checkout
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full border-gray-300 text-gray-700 hover:bg-gray-50"
                  onClick={clearCart}
                >
                  Clear Cart
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CartSidebar;
