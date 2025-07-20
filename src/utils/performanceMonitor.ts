// Performance monitoring utilities for 120fps optimization

export const measurePerformance = (name: string, fn: () => void) => {
  const start = performance.now();
  fn();
  const end = performance.now();
  console.log(`${name} took ${end - start} milliseconds`);
};

export const optimizeForHighRefreshRate = () => {
  // Detect high refresh rate displays
  const isHighRefreshRate = window.screen && (window.screen as any).refreshRate > 60;
  
  if (isHighRefreshRate) {
    document.documentElement.style.setProperty('--animation-duration', '0.008s');
    document.documentElement.style.setProperty('--transition-duration', '0.1s');
  }
};

export const enableGPUAcceleration = (element: HTMLElement) => {
  element.style.willChange = 'transform, opacity';
  element.style.transform = 'translateZ(0)';
  element.style.backfaceVisibility = 'hidden';
};

export const disableGPUAcceleration = (element: HTMLElement) => {
  element.style.willChange = 'auto';
  element.style.transform = '';
  element.style.backfaceVisibility = '';
};

export const optimizeScrolling = () => {
  // Enable smooth scrolling with momentum
  document.documentElement.style.scrollBehavior = 'smooth';
  document.body.style.overflowScrolling = 'touch';
  
  // Prevent scroll bounce on iOS
  document.body.style.overscrollBehavior = 'none';
};

export const preloadCriticalImages = (urls: string[]) => {
  urls.forEach(url => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = url;
    document.head.appendChild(link);
  });
};

export const debounce = (func: Function, wait: number) => {
  let timeout: NodeJS.Timeout;
  return function executedFunction(...args: any[]) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

export const throttle = (func: Function, limit: number) => {
  let inThrottle: boolean;
  return function(this: any, ...args: any[]) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Intersection Observer for lazy loading
export const createLazyObserver = (callback: (entry: IntersectionObserverEntry) => void) => {
  return new IntersectionObserver(
    (entries) => {
      entries.forEach(callback);
    },
    {
      threshold: 0.1,
      rootMargin: '50px'
    }
  );
};

// Performance metrics
export const getPerformanceMetrics = () => {
  const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
  
  return {
    domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
    loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
    firstPaint: performance.getEntriesByName('first-paint')[0]?.startTime || 0,
    firstContentfulPaint: performance.getEntriesByName('first-contentful-paint')[0]?.startTime || 0,
    largestContentfulPaint: performance.getEntriesByName('largest-contentful-paint')[0]?.startTime || 0
  };
};

export default {
  measurePerformance,
  optimizeForHighRefreshRate,
  enableGPUAcceleration,
  disableGPUAcceleration,
  optimizeScrolling,
  preloadCriticalImages,
  debounce,
  throttle,
  createLazyObserver,
  getPerformanceMetrics
};