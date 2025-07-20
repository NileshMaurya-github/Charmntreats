import React from 'react';

interface StaticCategoryImageProps {
  images: string[];
  categoryName: string;
  className?: string;
}

const StaticCategoryImage: React.FC<StaticCategoryImageProps> = ({ 
  images, 
  categoryName, 
  className = "" 
}) => {
  // Category-specific fallback images for better representation
  const categoryFallbacks: Record<string, string> = {
    'Dream Catcher': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
    'Embroidery': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
    'Lippan Arts': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
    'Resin Art Work': 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
    'Illustration': 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
    'Candles': 'https://images.unsplash.com/photo-1602874801006-e26d3d17d0a5?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
    'Calligraphy': 'https://images.unsplash.com/photo-1455390582262-044cdead277a?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
    'Hair Accessories': 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
    'Others': 'https://images.unsplash.com/photo-1582562124811-c09040d0a901?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80'
  };
  
  // Use actual product image or category-specific fallback
  const displayImage = images.length > 0 ? images[0] : (categoryFallbacks[categoryName] || categoryFallbacks['Others']);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    target.src = categoryFallbacks[categoryName] || categoryFallbacks['Others'];
  };

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Instant loading image without blur effects */}
      <img
        src={displayImage}
        alt={categoryName}
        className="w-full h-full object-cover transition-none"
        onError={handleImageError}
        loading="eager"
        decoding="sync"
        style={{ filter: 'none', backdropFilter: 'none' }}
      />
      
      {/* Subtle gradient overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
    </div>
  );
};

export default StaticCategoryImage;