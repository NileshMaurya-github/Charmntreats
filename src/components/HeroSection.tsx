import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Star, Eye } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface HomepageContent {
  id: string;
  hero_title: string;
  hero_subtitle: string;
  hero_description: string;
  hero_image_url: string;
}

const HeroSection = () => {
  const [content, setContent] = useState<HomepageContent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHomepageContent();
  }, []);

  const fetchHomepageContent = async () => {
    try {
      const { data, error } = await supabase
        .from('homepage_content')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching homepage content:', error);
        return;
      }

      if (data) {
        setContent(data);
      }
    } catch (error) {
      console.error('Error fetching homepage content:', error);
    } finally {
      setLoading(false);
    }
  };

  // Default content fallback
  const defaultContent = {
    hero_title: 'Discover Handcrafted Treasures',
    hero_subtitle: 'Handcrafted with Love',
    hero_description: 'Explore our collection of unique, artisan-made crafts that bring warmth and character to your home. Each piece tells a story of tradition, skill, and passion.',
    hero_image_url: 'https://images.unsplash.com/photo-1582562124811-c09040d0a901?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80'
  };

  const displayContent = content || defaultContent;

  if (loading) {
    return (
      <section className="relative min-h-[40vh] flex items-center bg-floral-gradient">
        <div className="container mx-auto compact-container">
          <div className="flex justify-center items-center h-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-primary"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative min-h-[45vh] flex items-center bg-floral-gradient py-6 overflow-hidden performance-hint">
      <div className="container mx-auto compact-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center grid-optimized">
          {/* Left Content */}
          <div className="space-y-4 ultra-smooth layout-stable">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-pink-primary hero-badge-animate">
                <Star className="h-4 w-4 fill-current animate-pulse" />
                <span className="text-sm font-medium">Charms Created With Love</span>
              </div>
              
              <h1 className="text-3xl lg:text-4xl font-bold text-black-primary leading-tight hero-title-animate">
                Discover Handcrafted
                <span className="block heading-floral hero-title-gradient">
                  Treasures
                </span>
              </h1>
              
              <p className="text-base text-gray-700 leading-relaxed font-medium hero-description-animate">
                {displayContent.hero_description}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 hero-buttons-animate">
              <Link to="/products">
                <Button size="default" className="btn-floral h-10 px-6 premium-button-hover">
                  Shop Now
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Button>
              </Link>
              
              <Link to="/about">
                <Button variant="outline" size="default" className="border-pink-primary text-pink-primary hover:bg-pink-50 h-10 px-6 floral-hover premium-outline-hover">
                  About Us
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="flex gap-6 pt-4 hero-stats-animate">
              <div className="floral-divider"></div>
              <div className="flex gap-6">
                <div className="stat-item-animate">
                  <div className="text-xl font-bold text-pink-primary counter-animate">500+</div>
                  <div className="text-xs text-gray-600 font-medium">Happy Customers</div>
                </div>
                <div className="stat-item-animate">
                  <div className="text-xl font-bold text-pink-primary counter-animate">1000+</div>
                  <div className="text-xs text-gray-600 font-medium">Products Sold</div>
                </div>
                <div className="stat-item-animate">
                  <div className="text-xl font-bold text-pink-primary counter-animate">4.9★</div>
                  <div className="text-xs text-gray-600 font-medium">Customer Rating</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content - Hero Image */}
          <div className="relative hero-image-animate">
            <div className="relative z-10 premium-image-container">
              <img
                src={displayContent.hero_image_url}
                alt="Handcrafted products"
                className="w-full h-[300px] object-cover rounded-2xl shadow-2xl premium-image-hover"
                onError={(e) => {
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1582562124811-c09040d0a901?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80';
                }}
              />
            </div>
            
            {/* Floating cards */}
            <div className="absolute -bottom-3 -left-3 card-floral p-2 rounded-xl z-20 floral-hover floating-card-left">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-pink-100 rounded-full flex items-center justify-center pulse-glow">
                  <span className="text-pink-primary font-bold text-xs">✓</span>
                </div>
                <div>
                  <div className="font-semibold text-black-primary text-xs">100% Handmade</div>
                  <div className="text-xs text-gray-600">Quality Assured</div>
                </div>
              </div>
            </div>
            
            <div className="absolute -top-3 -right-3 card-floral p-2 rounded-xl z-20 floral-hover floating-card-right">
              <div className="text-center">
                <div className="text-lg font-bold text-pink-primary">Free</div>
                <div className="text-xs text-gray-600">Shipping on ₹599+</div>
              </div>
            </div>
            
            {/* Background decoration with floral gradient */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] rounded-full -z-10 premium-bg-glow" 
                 style={{background: 'radial-gradient(circle, rgba(255, 105, 180, 0.08) 0%, rgba(248, 187, 217, 0.15) 50%, transparent 100%)'}}></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
