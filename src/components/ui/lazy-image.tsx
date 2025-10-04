import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholder?: string;
  onLoad?: () => void;
  onError?: () => void;
}

const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  className,
  placeholder = 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
  onLoad,
  onError
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '50px' }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  return (
    <div className={cn("relative overflow-hidden bg-gradient-to-br from-pink-50 to-rose-50", className)}>
      {/* Skeleton loader */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-pink-100/50 via-rose-100/80 to-pink-100/50 bg-[length:200%_100%]" />
      )}
      
      {/* Actual image */}
      <img
        ref={imgRef}
        src={isInView ? (hasError ? placeholder : src) : undefined}
        alt={alt}
        className={cn(
          "w-full h-full object-cover transition-all duration-700",
          isLoaded ? "opacity-100 scale-100" : "opacity-0 scale-105",
          className
        )}
        onLoad={handleLoad}
        onError={handleError}
        loading="lazy"
        decoding="async"
      />
      
      {/* Loading indicator */}
      {isInView && !isLoaded && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-pink-200 border-t-pink-500 rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
};

export default LazyImage;