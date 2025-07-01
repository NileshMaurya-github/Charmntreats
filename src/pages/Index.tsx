
import React from 'react';
import { CartProvider } from '@/contexts/CartContext';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import CategoryGrid from '@/components/CategoryGrid';
import FeaturedProducts from '@/components/FeaturedProducts';
import Testimonials from '@/components/Testimonials';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';

const Index = () => {
  return (
    <CartProvider>
      <div className="min-h-screen bg-white">
        <Header />
        <HeroSection />
        <CategoryGrid />
        <FeaturedProducts />
        <Testimonials />
        <Footer />
        <WhatsAppButton />
      </div>
    </CartProvider>
  );
};

export default Index;
