import { useEffect, useRef } from 'react';
import Lenis from 'lenis';

export const usePerformanceOptimization = () => {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Initialize Lenis smooth scroll (like automationcap.com)
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false,
    });

    lenisRef.current = lenis;

    // Animation frame loop for Lenis
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Hardware acceleration and performance optimizations
    const optimizePerformance = () => {
      // Enable smooth scrolling fallback
      document.documentElement.style.scrollBehavior = 'auto'; // Let Lenis handle it
      
      // Optimize existing images
      setTimeout(() => {
        const images = document.querySelectorAll('img');
        images.forEach((img) => {
          if (!img.loading) {
            img.loading = 'lazy';
          }
          if (!img.decoding) {
            img.decoding = 'async';
          }
          // Hardware acceleration for images
          img.style.transform = 'translateZ(0)';
          img.style.willChange = 'transform';
        });
      }, 100);

      // Optimize animations with Intersection Observer
      const animatedElements = document.querySelectorAll('[class*="animate-"]');
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              (entry.target as HTMLElement).style.willChange = 'transform, opacity';
            } else {
              (entry.target as HTMLElement).style.willChange = 'auto';
            }
          });
        },
        { rootMargin: '50px' }
      );

      animatedElements.forEach((el) => observer.observe(el));

      return () => observer.disconnect();
    };

    const cleanupObserver = optimizePerformance();

    // Cleanup
    return () => {
      lenis.destroy();
      cleanupObserver();
    };
  }, []);

  return lenisRef.current;
};

export default usePerformanceOptimization;