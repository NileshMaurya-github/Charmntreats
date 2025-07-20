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
  // Fallback image if no images are available
  const fallbackImage = 'https://images.unsplash.com/photo-1582562124811-c09040d0a901?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80';
  
  // Use the first image or fallback
  const displayImage = images.length > 0 ? images[0] : fallbackImage;

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    target.src = fallbackImage;
  };

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Static Image */}
      <img
        src={displayImage}
        alt={categoryName}
        className="w-full h-full object-cover"
        onError={handleImageError}
        loading="lazy"
        decoding="async"
      />
      
      {/* Subtle gradient overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-60" />
    </div>
  );
};

export default StaticCategoryImage;