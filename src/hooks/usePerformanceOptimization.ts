import { useEffect } from 'react';
import performanceMonitor from '@/utils/performanceMonitor';

export const usePerformanceOptimization = () => {
  useEffect(() => {
    // Initialize performance optimizations
    const initializeOptimizations = () => {
      // Optimize for high refresh rate displays
      performanceMonitor.optimizeForHighRefreshRate();
      
      // Enable smooth scrolling
      performanceMonitor.optimizeScrolling();
      
      // Preload critical images (add your critical image URLs here)
      const criticalImages = [
        // Add URLs of critical images that should load immediately
      ];
      performanceMonitor.preloadCriticalImages(criticalImages);
      
      // Optimize existing images
      const images = document.querySelectorAll('img');
      images.forEach((img) => {
        if (!img.loading) {
          img.loading = 'lazy';
        }
        if (!img.decoding) {
          img.decoding = 'async';
        }
      });
    };

    // Reduce layout shifts with intersection observer
    const reduceLayoutShifts = () => {
      const observer = performanceMonitor.createLazyObserver((entry) => {
        if (entry.isIntersecting) {
          const element = entry.target as HTMLElement;
          element.style.contentVisibility = 'visible';
          performanceMonitor.enableGPUAcceleration(element);
        }
      });

      document.querySelectorAll('.performance-hint').forEach((el) => {
        observer.observe(el);
      });
    };

    // Initialize all optimizations
    initializeOptimizations();
    reduceLayoutShifts();

    // Log performance metrics in development
    if (process.env.NODE_ENV === 'development') {
      setTimeout(() => {
        const metrics = performanceMonitor.getPerformanceMetrics();
        console.log('Performance Metrics:', metrics);
      }, 2000);
    }

    // Cleanup
    return () => {
      // Cleanup observers and optimizations if needed
    };
  }, []);
};

export default usePerformanceOptimization;