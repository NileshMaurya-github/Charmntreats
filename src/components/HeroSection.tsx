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
  const [loading, setLoading] = useState(false); // No loading state

  useEffect(() => {
    // Skip database call completely for instant loading
    // fetchHomepageContent();
  }, []);

  const fetchHomepageContent = async () => {
    try {
      // Skip database call for faster loading - use default content
      setLoading(false);
      return;
      
      // Commented out for performance - uncomment if you need dynamic content
      /*
      const { data, error } = await supabase
        .from('homepage_content')
        .select('hero_title, hero_subtitle, hero_description, hero_image_url')
        .eq('is_active', true)
        .limit(1)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching homepage content:', error);
        return;
      }

      if (data) {
        setContent(data);
      }
      */
    } catch (error) {
      console.error('Error fetching homepage content:', error);
    } finally {
      setLoading(false);
    }
  };

  // Optimized default content for fast loading - Art & Craft focused
  const defaultContent = {
    hero_title: 'Handcrafted With Love',
    hero_subtitle: 'Artisan Crafts & Unique Creations',
    hero_description: 'Discover unique handmade treasures crafted by skilled artisans. From dream catchers to embroidery, each piece tells a story of creativity and passion.',
  };

  const displayContent = content || defaultContent;

  // Remove loading state completely

  return (
    <section className="relative min-h-[60vh] flex items-center bg-gradient-to-br from-slate-900 via-purple-900 to-pink-900 py-12 overflow-hidden">
      {/* Premium Animated Background with Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Gradient Orbs */}
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-gradient-to-br from-pink-500/30 via-rose-500/20 to-purple-500/30 rounded-full animate-float blur-3xl"></div>
        <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] bg-gradient-to-tr from-purple-500/25 via-pink-500/20 to-rose-500/25 rounded-full animate-float blur-3xl" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-20 right-20 w-64 h-64 bg-gradient-to-br from-rose-400/30 to-pink-500/40 rounded-full animate-pulse blur-2xl"></div>
        
        {/* Floating Particles */}
        <div className="absolute top-[20%] left-[15%] w-2 h-2 bg-pink-400 rounded-full animate-twinkle"></div>
        <div className="absolute top-[40%] right-[25%] w-3 h-3 bg-rose-400 rounded-full animate-twinkle" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-[30%] left-[30%] w-2 h-2 bg-purple-400 rounded-full animate-twinkle" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-[60%] right-[15%] w-2 h-2 bg-pink-300 rounded-full animate-twinkle" style={{ animationDelay: '3s' }}></div>
        <div className="absolute bottom-[20%] right-[40%] w-3 h-3 bg-rose-300 rounded-full animate-twinkle" style={{ animationDelay: '1.5s' }}></div>
        
        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px] opacity-30"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left Content */}
          <div className="space-y-6">
            <div className="space-y-6">
              {/* Premium Subtitle with Glass Effect - Craft Focused */}
              <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl shadow-pink-500/30 animate-fade-in-up hover:scale-105 transition-transform duration-300">
                <div className="relative">
                  <Star className="h-5 w-5 fill-pink-400 text-pink-400 animate-pulse" />
                  <div className="absolute inset-0 bg-pink-400 blur-lg opacity-50 animate-pulse"></div>
                </div>
                <span className="text-sm font-bold tracking-widest uppercase bg-gradient-to-r from-pink-200 via-rose-200 to-pink-100 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(244,114,182,0.5)]">
                  🎨 Artisan Crafts & Unique Creations 🎨
                </span>
                <div className="w-2 h-2 bg-pink-400 rounded-full animate-ping"></div>
              </div>
              
              {/* God-Level 3D Title - Craft Store Focus */}
              <h1 className="text-4xl lg:text-7xl font-black leading-tight animate-fade-in-up animate-delay-200">
                <span className="block mb-2 bg-gradient-to-r from-white via-pink-100 to-white bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:scale-105 transition-transform duration-300 inline-block" style={{ textShadow: '0 0 40px rgba(255,182,193,0.5), 0 0 80px rgba(236,72,153,0.3)' }}>
                  Handcrafted With
                </span>
                <span className="block relative inline-block group">
                  <span className="relative z-10 bg-gradient-to-r from-pink-300 via-rose-400 to-pink-500 bg-clip-text text-transparent animate-shimmer font-extrabold" style={{ textShadow: '0 0 60px rgba(236,72,153,0.8), 0 0 100px rgba(244,114,182,0.6), 0 0 140px rgba(251,207,232,0.4)' }}>
                    Love ❤️
                  </span>
                  {/* 3D Shadow Layers */}
                  <span className="absolute top-1 left-1 bg-gradient-to-r from-pink-600 via-rose-700 to-pink-800 bg-clip-text text-transparent opacity-30 blur-sm" aria-hidden="true">
                    Love ❤️
                  </span>
                  <span className="absolute top-2 left-2 bg-gradient-to-r from-pink-800 via-rose-900 to-pink-900 bg-clip-text text-transparent opacity-20 blur-md" aria-hidden="true">
                    Love ❤️
                  </span>
                  {/* Glow Effect */}
                  <div className="absolute -inset-4 bg-gradient-to-r from-pink-500/20 via-rose-500/30 to-pink-500/20 rounded-3xl blur-3xl group-hover:blur-2xl transition-all duration-500 -z-10"></div>
                </span>
              </h1>
              
              <p className="text-lg text-white leading-relaxed max-w-lg animate-fade-in-up animate-delay-400 font-medium drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
                {displayContent.hero_description}
              </p>
            </div>

            {/* Premium CTA Buttons - Craft Store Focus */}
            <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up animate-delay-600">
              <Link to="/products" className="group relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 rounded-2xl blur-lg opacity-75 group-hover:opacity-100 transition duration-300 animate-pulse"></div>
                <Button className="relative bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 hover:from-pink-600 hover:via-rose-600 hover:to-pink-700 text-white font-black text-base h-14 px-10 rounded-xl shadow-2xl shadow-pink-500/50 transform hover:scale-105 transition-all duration-300 hover-lift border-2 border-white/30">
                  <span className="relative z-10 drop-shadow-lg">🛍️ Explore Crafts</span>
                  <ArrowRight className="ml-3 h-5 w-5 transition-transform duration-300 group-hover:translate-x-2 drop-shadow-lg" />
                  {/* Shine Effect */}
                  <div className="absolute inset-0 rounded-xl overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700"></div>
                  </div>
                </Button>
              </Link>
              
              <Link to="/about" className="group relative">
                <Button variant="outline" className="relative bg-white/10 backdrop-blur-xl border-2 border-white/40 text-white hover:bg-white hover:text-pink-600 font-black text-base h-14 px-10 rounded-xl shadow-2xl shadow-white/20 transform hover:scale-105 transition-all duration-300 hover-lift">
                  <span className="drop-shadow-lg">✨ Our Story</span>
                  {/* Glow on Hover */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-white/20 to-pink-200/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-300 -z-10"></div>
                </Button>
              </Link>
            </div>

            {/* Premium Stats Cards - Craft Store Specific */}
            <div className="flex items-center gap-8 pt-6 animate-fade-in-up animate-delay-800">
              <div className="w-16 h-1 bg-gradient-to-r from-pink-400 via-rose-400 to-transparent rounded-full shadow-[0_0_20px_rgba(244,114,182,0.5)]"></div>
              <div className="flex gap-8">
                <div className="text-center group animate-scale-in animate-delay-100">
                  <div className="relative inline-block">
                    <div className="text-3xl font-black text-white drop-shadow-[0_0_20px_rgba(244,114,182,0.9)]" style={{ textShadow: '0 0 30px rgba(244,114,182,0.8), 0 2px 4px rgba(0,0,0,0.3)' }}>500+</div>
                    <div className="absolute inset-0 bg-gradient-to-br from-pink-400 to-rose-500 opacity-20 blur-xl group-hover:opacity-40 transition-opacity"></div>
                  </div>
                  <div className="text-xs text-white/90 font-bold mt-1 tracking-wide drop-shadow-lg">Artisan Products</div>
                </div>
                <div className="w-px h-12 bg-gradient-to-b from-transparent via-white/30 to-transparent"></div>
                <div className="text-center group animate-scale-in animate-delay-200">
                  <div className="relative inline-block">
                    <div className="text-3xl font-black text-white drop-shadow-[0_0_20px_rgba(244,114,182,0.9)]" style={{ textShadow: '0 0 30px rgba(244,114,182,0.8), 0 2px 4px rgba(0,0,0,0.3)' }}>100%</div>
                    <div className="absolute inset-0 bg-gradient-to-br from-pink-400 to-rose-500 opacity-20 blur-xl group-hover:opacity-40 transition-opacity"></div>
                  </div>
                  <div className="text-xs text-white/90 font-bold mt-1 tracking-wide drop-shadow-lg">Handmade</div>
                </div>
                <div className="w-px h-12 bg-gradient-to-b from-transparent via-white/30 to-transparent"></div>
                <div className="text-center group animate-scale-in animate-delay-300">
                  <div className="relative inline-block">
                    <div className="text-3xl font-black text-white drop-shadow-[0_0_20px_rgba(244,114,182,0.9)]" style={{ textShadow: '0 0 30px rgba(244,114,182,0.8), 0 2px 4px rgba(0,0,0,0.3)' }}>4.9★</div>
                    <div className="absolute inset-0 bg-gradient-to-br from-pink-400 to-rose-500 opacity-20 blur-xl group-hover:opacity-40 transition-opacity"></div>
                  </div>
                  <div className="text-xs text-white/90 font-bold mt-1 tracking-wide drop-shadow-lg">Craft Quality</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content - GOD-LEVEL Animated Craft Reels Showcase */}
          <div className="relative animate-slide-in-right animate-delay-400">
            {/* Vertical Reels Layout - Like Instagram Stories */}
            <div className="grid grid-cols-3 gap-3 h-[480px]">
              
              {/* Reel 1 - Candles (TOP ROW) */}
              <Link to="/products?category=Candles" className="relative group overflow-hidden rounded-2xl animate-float cursor-pointer">
                <div className="absolute inset-0 bg-gradient-to-b from-amber-500/30 via-orange-500/20 to-yellow-500/30 blur-xl opacity-75 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative h-full bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-2 border-2 border-white/20 shadow-2xl overflow-hidden hover:scale-105 transition-transform duration-500">
                  <img
                    src="https://images.unsplash.com/photo-1602874801006-94d9f7e8f0d0?w=400&q=85"
                    alt="Handmade Candles Collection"
                    className="w-full h-full object-cover rounded-xl"
                    loading="eager"
                  />
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-amber-900/90 via-amber-900/40 to-transparent rounded-xl"></div>
                  
                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <div className="text-3xl mb-2">🕯️</div>
                    <h3 className="font-black text-sm mb-1 drop-shadow-lg">Candles</h3>
                    <p className="text-xs opacity-90 font-semibold">Aromatic Handmade</p>
                    <div className="mt-2 inline-block bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold">
                      View Collection →
                    </div>
                  </div>

                  {/* Top Badge */}
                  <div className="absolute top-3 left-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-2 py-1 rounded-full text-[10px] font-black uppercase backdrop-blur-sm border border-white/30">
                    🔥 Popular
                  </div>

                  {/* Animated Border */}
                  <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-amber-400/50 transition-colors"></div>
                </div>
              </Link>

              {/* Reel 2 - Dream Catchers (TOP ROW - Featured) */}
              <Link to="/products?category=Dream Catcher" className="relative group overflow-hidden rounded-2xl animate-float row-span-1 cursor-pointer" style={{ animationDelay: '0.5s' }}>
                <div className="absolute inset-0 bg-gradient-to-b from-purple-500/40 via-pink-500/30 to-rose-500/40 blur-xl opacity-75 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative h-full bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-2 border-2 border-purple-400/30 shadow-2xl overflow-hidden hover:scale-105 transition-transform duration-500">
                  <img
                    src="https://images.unsplash.com/photo-1565688534245-05d6b5be184a?w=400&q=85"
                    alt="Dream Catchers Art"
                    className="w-full h-full object-cover rounded-xl"
                    loading="eager"
                  />
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-purple-900/90 via-purple-900/40 to-transparent rounded-xl"></div>
                  
                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <div className="text-3xl mb-2">🌙</div>
                    <h3 className="font-black text-base mb-1 drop-shadow-lg">Dream Catchers</h3>
                    <p className="text-xs opacity-90 font-semibold">Handwoven Magic</p>
                    <div className="mt-3 inline-block bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-1.5 rounded-full text-xs font-black shadow-lg">
                      ✨ Trending
                    </div>
                  </div>

                  {/* Top Badge */}
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-purple-600 px-2 py-1 rounded-full text-[10px] font-black uppercase shadow-lg">
                    ⭐ Featured
                  </div>

                  {/* Glow Effect */}
                  <div className="absolute inset-0 rounded-xl shadow-[inset_0_0_60px_rgba(168,85,247,0.3)] group-hover:shadow-[inset_0_0_80px_rgba(168,85,247,0.5)] transition-shadow"></div>
                </div>
              </Link>

              {/* Reel 3 - Lippan Arts (TOP ROW) */}
              <Link to="/products?category=Lippan Arts" className="relative group overflow-hidden rounded-2xl animate-float cursor-pointer" style={{ animationDelay: '1s' }}>
                <div className="absolute inset-0 bg-gradient-to-b from-orange-500/30 via-red-500/20 to-pink-500/30 blur-xl opacity-75 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative h-full bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-2 border-2 border-white/20 shadow-2xl overflow-hidden hover:scale-105 transition-transform duration-500">
                  <img
                    src="https://images.unsplash.com/photo-1618506469810-4aba7b9b0ab1?w=400&q=85"
                    alt="Lippan Mirror Art"
                    className="w-full h-full object-cover rounded-xl"
                    loading="lazy"
                  />
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-orange-900/90 via-orange-900/40 to-transparent rounded-xl"></div>
                  
                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <div className="text-3xl mb-2">🪞</div>
                    <h3 className="font-black text-sm mb-1 drop-shadow-lg">Lippan Arts</h3>
                    <p className="text-xs opacity-90 font-semibold">Mirror Craftsmanship</p>
                    <div className="mt-2 inline-block bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold">
                      Explore More →
                    </div>
                  </div>

                  {/* Top Badge */}
                  <div className="absolute top-3 left-3 bg-gradient-to-r from-orange-500 to-red-500 text-white px-2 py-1 rounded-full text-[10px] font-black uppercase backdrop-blur-sm border border-white/30">
                    � Artistic
                  </div>
                </div>
              </Link>

            </div>

            {/* Bottom Row - Smaller Reels */}
            <div className="grid grid-cols-4 gap-3 mt-3">
              
              {/* Mini Reel - Embroidery */}
              <Link to="/products?category=Embroidery" className="relative group overflow-hidden rounded-xl h-28 animate-float hover:scale-110 transition-transform duration-300 cursor-pointer" style={{ animationDelay: '1.5s' }}>
                <div className="relative h-full bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-xl p-1.5 border border-white/20 shadow-xl overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=300&q=85"
                    alt="Embroidery Work"
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-pink-900/80 via-transparent to-transparent rounded-lg flex items-end justify-center pb-2">
                    <span className="text-white text-xs font-black drop-shadow-lg">🧵 Embroidery</span>
                  </div>
                </div>
              </Link>

              {/* Mini Reel - Resin Art Work */}
              <Link to="/products?category=Resin Art Work" className="relative group overflow-hidden rounded-xl h-28 animate-float hover:scale-110 transition-transform duration-300 cursor-pointer" style={{ animationDelay: '2s' }}>
                <div className="relative h-full bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-xl p-1.5 border border-white/20 shadow-xl overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=300&q=85"
                    alt="Resin Artwork"
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-cyan-900/80 via-transparent to-transparent rounded-lg flex items-end justify-center pb-2">
                    <span className="text-white text-xs font-black drop-shadow-lg">💎 Resin Art</span>
                  </div>
                </div>
              </Link>

              {/* Mini Reel - Calligraphy */}
              <Link to="/products?category=Calligraphy" className="relative group overflow-hidden rounded-xl h-28 animate-float hover:scale-110 transition-transform duration-300 cursor-pointer" style={{ animationDelay: '2.5s' }}>
                <div className="relative h-full bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-xl p-1.5 border border-white/20 shadow-xl overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1455390582262-044cdead277a?w=300&q=85"
                    alt="Calligraphy Art"
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent rounded-lg flex items-end justify-center pb-2">
                    <span className="text-white text-xs font-black drop-shadow-lg">✍️ Calligraphy</span>
                  </div>
                </div>
              </Link>

              {/* Mini Reel - Hair Accessories */}
              <Link to="/products?category=Hair Accessories" className="relative group overflow-hidden rounded-xl h-28 animate-float hover:scale-110 transition-transform duration-300 cursor-pointer" style={{ animationDelay: '3s' }}>
                <div className="relative h-full bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-xl p-1.5 border border-white/20 shadow-xl overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=300&q=85"
                    alt="Handmade Hair Accessories"
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-pink-900/80 via-transparent to-transparent rounded-lg flex items-end justify-center pb-2">
                    <span className="text-white text-xs font-black drop-shadow-lg">💐 Hair</span>
                  </div>
                </div>
              </Link>

            </div>

            {/* Promotional Floating Badge */}
            <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 z-30">
              <div className="bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 text-white px-6 py-3 rounded-2xl shadow-2xl border-2 border-white/30 animate-bounce-slow hover:scale-110 transition-transform">
                <div className="flex items-center gap-3">
                  <div className="text-2xl animate-pulse">🎁</div>
                  <div>
                    <div className="text-sm font-black drop-shadow-lg">FREE SHIPPING</div>
                    <div className="text-xs font-bold opacity-90">On Orders ₹599+</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Store Badge - Top Left */}
            <div className="absolute -top-4 -left-4 bg-white/95 backdrop-blur-sm px-5 py-3 rounded-2xl shadow-2xl border-2 border-pink-300/50 z-30 hover:scale-105 transition-transform animate-float">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full flex items-center justify-center animate-pulse shadow-lg">
                  <span className="text-white font-bold text-lg">✓</span>
                </div>
                <div>
                  <div className="font-black text-xs bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">100% Handmade</div>
                  <div className="text-[10px] text-gray-700 font-bold">Premium Quality</div>
                </div>
              </div>
            </div>

            {/* Rating Badge - Top Right */}
            <div className="absolute -top-4 -right-4 bg-white/95 backdrop-blur-sm px-4 py-3 rounded-2xl shadow-2xl border-2 border-rose-300/50 z-30 hover:scale-105 transition-transform animate-float" style={{ animationDelay: '1s' }}>
              <div className="text-center">
                <div className="text-2xl mb-1">⭐</div>
                <div className="text-xl font-black bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">4.9</div>
                <div className="text-[10px] text-gray-700 font-bold">Rating</div>
              </div>
            </div>
            
            {/* Sparkle Effects */}
            <div className="absolute top-16 left-4 w-3 h-3 bg-pink-400 rounded-full animate-twinkle shadow-lg shadow-pink-400/50"></div>
            <div className="absolute bottom-32 right-8 w-2 h-2 bg-rose-400 rounded-full animate-twinkle shadow-lg shadow-rose-400/50" style={{ animationDelay: '1s' }}></div>
            <div className="absolute top-40 right-4 w-2.5 h-2.5 bg-purple-400 rounded-full animate-twinkle shadow-lg shadow-purple-400/50" style={{ animationDelay: '2s' }}></div>
            
            {/* Animated Background Glow */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] rounded-full -z-10" 
                 style={{background: 'radial-gradient(circle, rgba(236,72,153,0.2) 0%, rgba(248,187,217,0.3) 40%, transparent 70%)', animation: 'pulse 4s ease-in-out infinite'}}></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
