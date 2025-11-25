import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, ShoppingCart, Heart, Eye } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import LazyImage from '@/components/ui/lazy-image';

interface Product {
  id: string;
  name: string;
  price: number;
  images: string[];
  rating?: number;
  reviews?: number;
  category: string;
  in_stock: boolean;
  catalogNumber: string;
  stock_quantity?: number;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [isHovered, setIsHovered] = React.useState(false);

  const isInWishlistState = isInWishlist(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!product.in_stock || (product.stock_quantity !== undefined && product.stock_quantity <= 0)) {
      return;
    }

    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0] || 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
      images: product.images,
      category: product.category,
      catalogNumber: product.catalogNumber
    });
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isInWishlistState) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0] || 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
        category: product.category,
        catalogNumber: product.catalogNumber
      });
    }
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/product/${product.id}`);
  };

  const handleCardClick = () => {
    navigate(`/product/${product.id}`);
  };

  const isOutOfStock = !product.in_stock || (product.stock_quantity !== undefined && product.stock_quantity <= 0);

  return (
    <div className="h-full">
      <Card
        className="group h-full cursor-pointer bg-white border border-slate-200 hover:border-pink-300 rounded-2xl hover:shadow-xl hover:shadow-pink-100 transition-all duration-500 overflow-hidden relative flex flex-col"
        onClick={handleCardClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative overflow-hidden aspect-[4/5]">
          <LazyImage
            src={product.images[0] || 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=60'}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />

          {/* Overlay Actions */}
          <div className={`absolute inset-0 bg-black/20 backdrop-blur-[1px] transition-all duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'} flex items-center justify-center gap-4`}>
            <Button
              size="icon"
              variant="secondary"
              className="rounded-full w-12 h-12 bg-white hover:bg-pink-600 hover:text-white text-slate-700 border border-slate-200 shadow-lg transform translate-y-8 group-hover:translate-y-0 transition-all duration-300 hover:scale-110"
              onClick={handleQuickView}
            >
              <Eye className="h-5 w-5" />
            </Button>
            <Button
              size="icon"
              variant="secondary"
              className={`rounded-full w-12 h-12 bg-white hover:bg-pink-600 border border-slate-200 shadow-lg transform translate-y-8 group-hover:translate-y-0 transition-all duration-300 delay-75 hover:scale-110 ${isInWishlistState ? 'text-pink-600 hover:text-white' : 'text-slate-700 hover:text-white'}`}
              onClick={handleWishlistToggle}
            >
              <Heart className={`h-5 w-5 ${isInWishlistState ? 'fill-current' : ''}`} />
            </Button>
          </div>

          {isOutOfStock && (
            <div className="absolute top-3 right-3">
              <Badge variant="destructive" className="font-bold shadow-lg bg-red-500/90 backdrop-blur-md border border-red-400 text-white">
                Out of Stock
              </Badge>
            </div>
          )}

          {/* Category Badge */}
          <div className="absolute top-3 left-3">
            <Badge variant="secondary" className="bg-white/90 backdrop-blur-md text-xs font-bold text-slate-900 border border-slate-200 shadow-lg">
              {product.category}
            </Badge>
          </div>
        </div>

        <CardContent className="p-5 flex flex-col flex-grow bg-white">
          <div className="mb-3 flex items-start justify-between gap-2">
            <h3 className="font-bold text-slate-900 text-lg leading-tight line-clamp-2 group-hover:text-pink-600 transition-colors">
              {product.name}
            </h3>
            {product.rating && (
              <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg text-xs font-bold text-amber-500 border border-amber-100 shrink-0">
                <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                <span>{product.rating}</span>
              </div>
            )}
          </div>

          <div className="mt-auto space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-2xl font-black text-slate-900">
                ₹{product.price.toLocaleString()}
              </div>
              {product.stock_quantity !== undefined && product.stock_quantity > 0 && product.stock_quantity <= 5 && (
                <span className="text-xs text-orange-600 font-bold bg-orange-50 px-2.5 py-1 rounded-full border border-orange-100 animate-pulse">
                  Only {product.stock_quantity} left
                </span>
              )}
            </div>

            <Button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className={`w-full font-bold h-11 rounded-xl transition-all duration-300 ${isOutOfStock
                ? 'bg-slate-100 text-slate-400 border border-slate-200'
                : 'bg-slate-900 hover:bg-slate-800 text-white shadow-lg shadow-slate-200 hover:scale-[1.02]'
                }`}
            >
              {isOutOfStock ? (
                'Out of Stock'
              ) : (
                <>
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Add to Cart
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductCard;
