
import React, { useEffect } from 'react';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import CategoryGrid from '@/components/CategoryGrid';
import FeaturedProducts from '@/components/FeaturedProducts';
import VideoShowcase from '@/components/VideoShowcase';
import Testimonials from '@/components/Testimonials';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import usePerformanceOptimization from '@/hooks/usePerformanceOptimization';

const Index = () => {
  usePerformanceOptimization();
  
  useEffect(() => {
    // Ensure page starts at top
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, []);
  
  return (
    <div className="min-h-screen relative page-ultra-smooth momentum-scroll">
      <Header />
      <HeroSection />
      <CategoryGrid />
      <FeaturedProducts />
      <VideoShowcase />
      <Testimonials />
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Index;
