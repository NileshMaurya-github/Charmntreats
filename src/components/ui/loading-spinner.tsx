import React from 'react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  text?: string;
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
  xl: 'w-12 h-12'
};

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  className,
  text 
}) => {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-3", className)}>
      <div className={cn(
        "animate-spin rounded-full border-2 border-transparent bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-border",
        sizeClasses[size]
      )}>
        <div className={cn(
          "rounded-full bg-white border-2 border-transparent",
          sizeClasses[size]
        )}></div>
      </div>
      {text && (
        <p className="text-sm font-medium text-slate-600 animate-pulse">{text}</p>
      )}
    </div>
  );
};

// Page-level loading component
export const PageLoader: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-white via-pink-50/30 to-rose-50/20 flex items-center justify-center z-50">
      <div className="text-center animate-fade-in-up">
        <div className="w-16 h-16 mx-auto mb-6 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 rounded-full animate-ping opacity-20"></div>
          <div className="relative w-16 h-16 bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 rounded-full animate-spin">
            <div className="absolute inset-2 bg-white rounded-full"></div>
            <div className="absolute inset-4 bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 rounded-full"></div>
          </div>
        </div>
        <h2 className="text-xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent mb-2">
          Charmntreats
        </h2>
        <p className="text-slate-600 animate-pulse">Loading your handcrafted experience...</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;