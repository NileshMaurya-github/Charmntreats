import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, ShoppingCart } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import LazyImage from '@/components/ui/lazy-image';

// GOD-LEVEL Product Card with dark theme and premium effects
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
  const [isHovered, setIsHovered] = React.useState(false);

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

  const handleCardClick = () => {
    navigate(`/product/${product.id}`);
  };

  const isOutOfStock = !product.in_stock || (product.stock_quantity !== undefined && product.stock_quantity <= 0);

  // GOD-LEVEL ProductCard - Updated 2025-10-04
  return (
    <Card 
      className="group cursor-pointer bg-white/10 backdrop-blur-xl border-2 border-white/20 hover:border-pink-400/50 rounded-2xl hover:shadow-[0_0_40px_rgba(236,72,153,0.4)] transition-all duration-500 hover:-translate-y-2 overflow-hidden relative"
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* GOD-LEVEL Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      {/* Floating Sparkles on Hover */}
      {isHovered && (
        <>
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-pink-400 rounded-full animate-twinkle pointer-events-none z-20"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 1}s`
              }}
            ></div>
          ))}
        </>
      )}
      
      <div className="relative overflow-hidden rounded-t-2xl">
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"></div>
        <LazyImage
          src={product.images[0] || 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=60'}
          alt={product.name}
          className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-700 group-hover:rotate-1"
        />
        
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-20">
            <Badge variant="destructive" className="text-white font-black px-4 py-2 text-sm animate-pulse shadow-2xl border-2 border-white/20">
              Out of Stock
            </Badge>
          </div>
        )}
        
        {/* Premium Category Badge */}
        <div className="absolute top-3 left-3 z-15">
          <Badge className="bg-white/90 backdrop-blur-xl text-slate-700 border-0 shadow-xl hover:bg-white transition-all duration-300 font-black border-2 border-white/50">
            {product.category}
          </Badge>
        </div>
        
        {/* Premium Rating Badge */}
        {product.rating && (
          <div className="absolute top-3 right-3 bg-gradient-to-r from-amber-500 to-orange-500 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center gap-1.5 shadow-2xl shadow-amber-500/50 border-2 border-white/30 z-15">
            <Star className="h-3.5 w-3.5 text-white fill-white drop-shadow-[0_2px_5px_rgba(0,0,0,0.8)]" />
            <span className="text-sm font-black text-white drop-shadow-[0_2px_5px_rgba(0,0,0,0.8)]">{product.rating}</span>
          </div>
        )}
      </div>
      
      <CardContent className="p-6 relative z-10">
        <div className="space-y-4">
          {/* Premium Product Name */}
          <h3 className="font-black text-white text-lg leading-tight line-clamp-2 group-hover:text-pink-300 transition-colors duration-300 drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
            {product.name}
          </h3>
          
          {/* Premium Price Display */}
          <div className="flex items-center justify-between">
            <div className="text-3xl font-black bg-gradient-to-r from-pink-300 via-rose-400 to-pink-500 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(236,72,153,0.8)]">
              ₹{product.price.toLocaleString()}
            </div>
            
            {product.reviews && product.reviews > 0 && (
              <div className="text-sm text-white/70 font-bold">
                ({product.reviews} reviews)
              </div>
            )}
          </div>
          
          {/* Premium Low Stock Warning */}
          {product.stock_quantity !== undefined && product.stock_quantity > 0 && product.stock_quantity <= 5 && (
            <div className="text-sm text-orange-200 font-black bg-gradient-to-r from-orange-500/20 to-red-500/20 backdrop-blur-xl rounded-lg px-3 py-2 animate-pulse border border-orange-400/30 shadow-xl">
              ⚡ Only {product.stock_quantity} left!
            </div>
          )}
          
          {/* GOD-LEVEL Add to Cart Button */}
          <Button 
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`w-full h-12 font-black rounded-xl transition-all duration-300 border-2 ${
              isOutOfStock 
                ? 'bg-gray-600/50 cursor-not-allowed text-gray-400 border-gray-500/30' 
                : 'bg-gradient-to-r from-pink-500 via-rose-500 to-purple-500 hover:from-pink-600 hover:via-rose-600 hover:to-purple-600 text-white shadow-2xl shadow-pink-500/50 hover:shadow-pink-500/80 transform hover:scale-105 border-white/30 drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]'
            }`}
          >
            {isOutOfStock ? (
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                Out of Stock
              </span>
            ) : (
              <>
                <ShoppingCart className="h-4 w-4 mr-2 group-hover:animate-bounce" />
                Add to Cart
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
