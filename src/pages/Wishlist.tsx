import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ArrowLeft, ShoppingCart, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useWishlist } from '@/contexts/WishlistContext';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/hooks/useAuth';

const Wishlist = () => {
  const { wishlistItems, removeFromWishlist, getTotalItems } = useWishlist();
  const { addToCart } = useCart();
  const { user } = useAuth();

  const handleAddToCart = (item: any) => {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      images: [item.image],
      category: item.category,
      catalogNumber: item.catalogNumber
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900">
        <Header />

        <div className="container mx-auto px-4 py-20 flex flex-col items-center justify-center min-h-[60vh]">
          <div className="w-32 h-32 bg-pink-50 rounded-full flex items-center justify-center mb-6 animate-pulse border border-pink-100">
            <Heart className="h-16 w-16 text-pink-500" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 mb-4">Please Login</h1>
          <p className="text-slate-800 mb-8 text-lg max-w-md text-center">
            You need to be logged in to view your wishlist and save your favorite treasures.
          </p>
          <Link to="/auth">
            <Button className="bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white font-bold h-12 px-8 rounded-xl shadow-lg shadow-pink-200 hover:shadow-pink-300 transition-all hover:scale-105">
              Login to Continue
            </Button>
          </Link>
        </div>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-pink-100">
      <Header />

      <div className="container mx-auto px-4 py-12 pt-24">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-10 animate-fade-in">
            <div>
              <h1 className="text-4xl font-black text-slate-900 mb-2">My Wishlist</h1>
              <p className="text-slate-800 text-lg">
                {getTotalItems() > 0 ? `${getTotalItems()} item${getTotalItems() > 1 ? 's' : ''} saved` : 'Save your favorite items for later'}
              </p>
            </div>
            <Link to="/">
              <Button variant="ghost" className="text-slate-800 hover:text-pink-600 hover:bg-pink-50">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>

          {/* Wishlist Items */}
          {wishlistItems.length > 0 ? (
            <div className="grid grid-cols-1 gap-6">
              {wishlistItems.map((item, index) => (
                <Card key={item.id} className="bg-white border border-slate-200 hover:border-pink-300 hover:shadow-lg hover:shadow-pink-100 transition-all duration-300 animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                  <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row items-center gap-6">
                      {/* Product Image */}
                      <div className="w-full sm:w-32 h-32 rounded-xl overflow-hidden border border-slate-200 flex-shrink-0 group">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 text-center sm:text-left">
                        <h3 className="text-xl font-bold text-slate-900 mb-2 hover:text-pink-600 transition-colors cursor-pointer">
                          <Link to={`/product/${item.id}`}>{item.name}</Link>
                        </h3>
                        <p className="text-sm text-slate-800 mb-3 bg-slate-100 inline-block px-3 py-1 rounded-full border border-slate-200">{item.category}</p>
                        <p className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-rose-600">₹{item.price.toLocaleString()}</p>
                        <p className="text-xs text-slate-700 mt-2">Added on {new Date(item.addedAt).toLocaleDateString()}</p>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col gap-3 w-full sm:w-auto">
                        <Button
                          onClick={() => handleAddToCart(item)}
                          className="bg-slate-900 hover:bg-slate-800 text-white font-bold w-full sm:w-auto shadow-lg shadow-slate-200"
                        >
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          Add to Cart
                        </Button>
                        <Button
                          onClick={() => removeFromWishlist(item.id)}
                          variant="outline"
                          className="border-slate-200 text-slate-800 hover:text-red-600 hover:bg-red-50 hover:border-red-200 w-full sm:w-auto"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Remove
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            /* Empty Wishlist State */
            <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center animate-fade-in shadow-sm">
              <div className="w-24 h-24 bg-pink-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-pink-100">
                <Heart className="h-12 w-12 text-pink-300" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Your wishlist is empty</h2>
              <p className="text-slate-800 mb-8 max-w-md mx-auto text-lg">
                Start adding items to your wishlist by clicking the heart icon on products you love!
              </p>
              <Link to="/products">
                <Button className="bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white font-bold h-12 px-8 rounded-xl shadow-lg shadow-pink-200 hover:shadow-pink-300 transition-all hover:scale-105">
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Browse Treasures
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Wishlist;