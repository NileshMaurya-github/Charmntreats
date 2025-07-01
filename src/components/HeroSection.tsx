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
      <section className="relative min-h-[40vh] flex items-center bg-gradient-to-br from-amber-50 via-white to-slate-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center h-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative min-h-[45vh] flex items-center bg-gradient-to-br from-amber-50 via-white to-slate-50 py-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
          {/* Left Content */}
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-amber-600">
                <Star className="h-4 w-4 fill-current" />
                <span className="text-sm font-medium">{displayContent.hero_subtitle}</span>
              </div>
              
              <h1 className="text-3xl lg:text-4xl font-bold text-slate-800 leading-tight">
                {displayContent.hero_title.split(' ').slice(0, 1).join(' ')}
                <span className="block text-amber-600">
                  {displayContent.hero_title.split(' ').slice(1).join(' ')}
                </span>
              </h1>
              
              <p className="text-base text-slate-600 leading-relaxed">
                {displayContent.hero_description}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link to="/products">
                <Button size="default" className="bg-amber-600 hover:bg-amber-700 text-white h-10 px-6">
                  Shop Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              
              <Link to="/about">
                <Button variant="outline" size="default" className="border-amber-600 text-amber-600 hover:bg-amber-50 h-10 px-6">
                  About Us
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="flex gap-6 pt-4 border-t border-slate-200">
              <div>
                <div className="text-xl font-bold text-slate-800">500+</div>
                <div className="text-xs text-slate-600">Happy Customers</div>
              </div>
              <div>
                <div className="text-xl font-bold text-slate-800">1000+</div>
                <div className="text-xs text-slate-600">Products Sold</div>
              </div>
              <div>
                <div className="text-xl font-bold text-slate-800">4.9★</div>
                <div className="text-xs text-slate-600">Customer Rating</div>
              </div>
            </div>
          </div>

          {/* Right Content - Hero Image */}
          <div className="relative">
            <div className="relative z-10">
              <img
                src={displayContent.hero_image_url}
                alt="Handcrafted products"
                className="w-full h-[300px] object-cover rounded-2xl shadow-2xl"
                onError={(e) => {
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1582562124811-c09040d0a901?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80';
                }}
              />
            </div>
            
            {/* Floating cards */}
            <div className="absolute -bottom-3 -left-3 bg-white p-2 rounded-xl shadow-lg z-20">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center">
                  <span className="text-amber-600 font-bold text-xs">✓</span>
                </div>
                <div>
                  <div className="font-semibold text-slate-800 text-xs">100% Handmade</div>
                  <div className="text-xs text-slate-600">Quality Assured</div>
                </div>
              </div>
            </div>
            
            <div className="absolute -top-3 -right-3 bg-white p-2 rounded-xl shadow-lg z-20">
              <div className="text-center">
                <div className="text-lg font-bold text-amber-600">Free</div>
                <div className="text-xs text-slate-600">Shipping on ₹599+</div>
              </div>
            </div>
            
            {/* Background decoration */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-br from-amber-100/20 to-transparent rounded-full -z-10"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
