import { useEffect, useRef } from 'react';
import Lenis from 'lenis';

export const usePerformanceOptimization = () => {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Disabled for performance - use native browser scrolling
    document.documentElement.style.scrollBehavior = 'auto';
    
    return () => {};
  }, []);

  return lenisRef.current;
};

export default usePerformanceOptimization;