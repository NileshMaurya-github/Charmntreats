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
      <div className="min-h-screen bg-floral-gradient">
        <Header />
        
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-lg p-8 text-center">
              <Heart className="h-16 w-16 text-pink-300 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-slate-900 mb-2">Please Login</h2>
              <p className="text-slate-600 mb-6">
                You need to be logged in to view your wishlist.
              </p>
              <Link to="/auth">
                <Button className="bg-pink-600 hover:bg-pink-700 text-white">
                  Login to Continue
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-floral-gradient">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link to="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">My Wishlist</h1>
              <p className="text-slate-600">
                {getTotalItems() > 0 ? `${getTotalItems()} item${getTotalItems() > 1 ? 's' : ''} saved` : 'Save your favorite items for later'}
              </p>
            </div>
          </div>

          {/* Wishlist Items */}
          {wishlistItems.length > 0 ? (
            <div className="space-y-4">
              {wishlistItems.map((item) => (
                <Card key={item.id} className="bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-6">
                      {/* Product Image */}
                      <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Product Info */}
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-slate-900 mb-1">{item.name}</h3>
                        <p className="text-sm text-slate-600 mb-2">{item.category}</p>
                        <p className="text-lg font-bold text-pink-600">₹{item.price.toLocaleString()}</p>
                        <p className="text-xs text-slate-500">Added on {new Date(item.addedAt).toLocaleDateString()}</p>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col gap-2">
                        <Button
                          onClick={() => handleAddToCart(item)}
                          className="bg-pink-600 hover:bg-pink-700 text-white"
                          size="sm"
                        >
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          Add to Cart
                        </Button>
                        <Button
                          onClick={() => removeFromWishlist(item.id)}
                          variant="outline"
                          size="sm"
                          className="text-red-600 border-red-300 hover:bg-red-50"
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
            <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-lg p-8 text-center">
              <Heart className="h-16 w-16 text-pink-300 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-slate-900 mb-2">Your wishlist is empty</h2>
              <p className="text-slate-600 mb-6">
                Start adding items to your wishlist by clicking the heart icon on products you love!
              </p>
              <Link to="/products">
                <Button className="bg-pink-600 hover:bg-pink-700 text-white">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Browse Products
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