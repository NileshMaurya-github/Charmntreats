import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, ShoppingCart } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';

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

  return (
    <Card 
      className="group cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 shadow-md overflow-hidden"
      onClick={handleCardClick}
    >
      <div className="relative overflow-hidden">
        <img
          src={product.images[0] || 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=60'}
          alt={product.name}
          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300 ultra-fast-image"
          loading="lazy"
          decoding="async"
        />
        
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <Badge variant="destructive" className="text-white font-semibold">
              Out of Stock
            </Badge>
          </div>
        )}
        
        <div className="absolute top-2 left-2">
          <Badge variant="secondary" className="bg-gray-100 text-black">
            {product.category}
          </Badge>
        </div>
        
        {product.rating && (
          <div className="absolute top-2 right-2 bg-white/90 rounded-full px-2 py-1 flex items-center gap-1">
            <Star className="h-3 w-3 text-black fill-current" />
            <span className="text-xs font-medium text-black">{product.rating}</span>
          </div>
        )}
      </div>
      
      <CardContent className="p-4">
        <h3 className="font-semibold text-slate-800 mb-2 line-clamp-2 group-hover:text-black transition-colors">
          {product.name}
        </h3>
        
        <div className="flex items-center justify-between mb-3">
          <div className="text-2xl font-bold text-black">
            ₹{product.price.toLocaleString()}
          </div>
          
          {product.reviews && product.reviews > 0 && (
            <div className="text-sm text-slate-500">
              ({product.reviews} reviews)
            </div>
          )}
        </div>
        
        {product.stock_quantity !== undefined && product.stock_quantity > 0 && product.stock_quantity <= 5 && (
          <div className="text-xs text-black mb-2">
            Only {product.stock_quantity} left in stock!
          </div>
        )}
        
        <Button 
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className={`w-full ${isOutOfStock 
            ? 'bg-gray-400 cursor-not-allowed text-white' 
            : 'btn-dark-pink'
          } transition-colors`}
        >
          {isOutOfStock ? (
            'Out of Stock'
          ) : (
            <>
              <ShoppingCart className="h-4 w-4 mr-2" />
              Add to Cart
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
