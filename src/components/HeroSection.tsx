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
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Skip database call for instant loading
    }, []);

    // Optimized default content for fast loading - Art & Craft focused
    const defaultContent = {
        hero_title: 'Handcrafted With Love',
        hero_subtitle: 'Artisan Crafts & Unique Creations',
        hero_description: 'Discover unique handmade treasures crafted by skilled artisans. From dream catchers to embroidery, each piece tells a story of creativity and passion.',
    };

    const displayContent = content || defaultContent;

    return (
        <section className="relative min-h-[60vh] flex items-center py-12 overflow-hidden bg-transparent">
            {/* Minimal Background Pattern */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>

                {/* Soft Gradient Blobs */}
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-pink-200/30 rounded-full blur-3xl animate-float-slow -z-10"></div>
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-200/30 rounded-full blur-3xl animate-float-medium -z-10"></div>
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                    {/* Left Content */}
                    <div className="space-y-6">
                        <div className="space-y-6">
                            {/* Premium Subtitle with Glass Effect - Craft Focused */}
                            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/80 backdrop-blur-md border border-pink-100 shadow-lg shadow-pink-100/50">
                                <div className="relative">
                                    <Star className="h-5 w-5 fill-pink-500 text-pink-500" />
                                </div>
                                <span className="text-sm font-bold tracking-widest uppercase bg-gradient-to-r from-pink-600 via-rose-600 to-pink-500 bg-clip-text text-transparent">
                                    🎨 Artisan Crafts & Unique Creations 🎨
                                </span>
                            </div>

                            {/* God-Level 3D Title - Craft Store Focus */}
                            <h1 className="text-4xl lg:text-7xl font-black leading-tight text-slate-900">
                                <span className="block mb-2 drop-shadow-sm">
                                    Handcrafted With
                                </span>
                                <span className="block relative inline-block group">
                                    <span className="relative z-10 bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 bg-clip-text text-transparent font-extrabold drop-shadow-sm">
                                        Love ❤️
                                    </span>
                                </span>
                            </h1>

                            <p className="text-lg text-slate-600 leading-relaxed max-w-lg font-medium">
                                {displayContent.hero_description}
                            </p>
                        </div>

                        {/* Premium CTA Buttons - Craft Store Focus */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link to="/products" className="group relative">
                                <Button className="relative bg-gradient-to-r from-pink-600 via-rose-500 to-purple-600 hover:from-pink-500 hover:via-rose-400 hover:to-purple-500 text-white font-black text-base h-14 px-10 rounded-xl shadow-xl shadow-pink-500/20 border-0 transition-all hover:scale-105">
                                    <span className="relative z-10">🛍️ Explore Crafts</span>
                                    <ArrowRight className="ml-3 h-5 w-5" />
                                </Button>
                            </Link>

                            <Link to="/about" className="group relative">
                                <Button variant="outline" className="relative bg-white border-2 border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-pink-600 hover:border-pink-200 font-black text-base h-14 px-10 rounded-xl shadow-lg shadow-slate-200/50 transition-all hover:scale-105">
                                    <span>✨ Our Story</span>
                                </Button>
                            </Link>
                        </div>

                        {/* Premium Stats Cards - Craft Store Specific */}
                        <div className="flex items-center gap-8 pt-6">
                            <div className="w-16 h-1 bg-gradient-to-r from-pink-500 via-rose-500 to-transparent rounded-full"></div>
                            <div className="flex gap-8">
                                <div className="text-center">
                                    <div className="text-3xl font-black text-slate-900">500+</div>
                                    <div className="text-xs text-slate-500 font-bold mt-1 tracking-wide">Artisan Products</div>
                                </div>
                                <div className="w-px h-12 bg-gradient-to-b from-transparent via-slate-300 to-transparent"></div>
                                <div className="text-center">
                                    <div className="text-3xl font-black text-slate-900">100%</div>
                                    <div className="text-xs text-slate-500 font-bold mt-1 tracking-wide">Handmade</div>
                                </div>
                                <div className="w-px h-12 bg-gradient-to-b from-transparent via-slate-300 to-transparent"></div>
                                <div className="text-center">
                                    <div className="text-3xl font-black text-slate-900">4.9★</div>
                                    <div className="text-xs text-slate-500 font-bold mt-1 tracking-wide">Craft Quality</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Content - GOD-LEVEL Animated Craft Reels Showcase */}
                    <div className="relative animate-slide-in-right animate-delay-400">
                        {/* Vertical Reels Layout - Like Instagram Stories */}
                        <div className="grid grid-cols-3 gap-3 h-[480px]">

                            {/* Reel 1 - Candles (TOP ROW) */}
                            <Link to="/products?category=Candles" className="relative group overflow-hidden rounded-2xl cursor-pointer hover:-translate-y-1 transition-transform duration-300">
                                <div className="relative h-full bg-white rounded-2xl p-2 border border-slate-200 shadow-xl overflow-hidden">
                                    <img
                                        src="https://images.unsplash.com/photo-1602874801006-94d9f7e8f0d0?w=400&q=85"
                                        alt="Handmade Candles Collection"
                                        className="w-full h-full object-cover rounded-xl"
                                        loading="eager"
                                        crossOrigin="anonymous"
                                    />
                                    {/* Gradient Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent rounded-xl"></div>

                                    {/* Content */}
                                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                                        <div className="text-2xl mb-1">🕯️</div>
                                        <h3 className="font-black text-sm mb-0.5 drop-shadow-md">Candles</h3>
                                        <p className="text-[10px] opacity-90 font-semibold">Aromatic</p>
                                    </div>

                                    {/* Top Badge */}
                                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-slate-900 px-2 py-1 rounded-full text-[10px] font-black uppercase shadow-sm">
                                        🔥 Popular
                                    </div>
                                </div>
                            </Link>

                            {/* Reel 2 - Dream Catchers (TOP ROW - Featured) */}
                            <Link to="/products?category=Dream Catcher" className="relative group overflow-hidden rounded-2xl row-span-1 cursor-pointer hover:-translate-y-1 transition-transform duration-300">
                                <div className="relative h-full bg-white rounded-2xl p-2 border-2 border-pink-200 shadow-2xl shadow-pink-200/50 overflow-hidden">
                                    <img
                                        src="https://images.unsplash.com/photo-1565688534245-05d6b5be184a?w=400&q=85"
                                        alt="Dream Catchers Art"
                                        className="w-full h-full object-cover rounded-xl"
                                        loading="eager"
                                        crossOrigin="anonymous"
                                    />
                                    {/* Gradient Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-purple-900/60 via-transparent to-transparent rounded-xl"></div>

                                    {/* Content */}
                                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                                        <div className="text-2xl mb-1">🌙</div>
                                        <h3 className="font-black text-base mb-0.5 drop-shadow-md">Dream Catchers</h3>
                                        <p className="text-[10px] opacity-90 font-semibold">Handwoven</p>
                                    </div>

                                    {/* Top Badge */}
                                    <div className="absolute top-3 right-3 bg-pink-500 text-white px-2 py-1 rounded-full text-[10px] font-black uppercase shadow-lg">
                                        ⭐ Featured
                                    </div>
                                </div>
                            </Link>

                            {/* Reel 3 - Lippan Arts (TOP ROW) */}
                            <Link to="/products?category=Lippan Arts" className="relative group overflow-hidden rounded-2xl cursor-pointer hover:-translate-y-1 transition-transform duration-300">
                                <div className="relative h-full bg-white rounded-2xl p-2 border border-slate-200 shadow-xl overflow-hidden">
                                    <img
                                        src="https://images.unsplash.com/photo-1618506469810-4aba7b9b0ab1?w=400&q=85"
                                        alt="Lippan Mirror Art"
                                        className="w-full h-full object-cover rounded-xl"
                                        loading="eager"
                                        crossOrigin="anonymous"
                                    />
                                    {/* Gradient Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent rounded-xl"></div>

                                    {/* Content */}
                                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                                        <div className="text-2xl mb-1">🪠</div>
                                        <h3 className="font-black text-sm mb-0.5 drop-shadow-md">Lippan Arts</h3>
                                        <p className="text-[10px] opacity-90 font-semibold">Mirror Work</p>
                                    </div>
                                </div>
                            </Link>

                        </div>

                        {/* Bottom Row - Smaller Reels */}
                        <div className="grid grid-cols-4 gap-3 mt-3">

                            {/* Mini Reel - Embroidery */}
                            <Link to="/products?category=Embroidery" className="relative group overflow-hidden rounded-xl h-28 cursor-pointer hover:-translate-y-1 transition-transform duration-300">
                                <div className="relative h-full bg-white rounded-xl p-1.5 border border-slate-200 shadow-lg overflow-hidden">
                                    <img
                                        src="https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=300&q=85"
                                        alt="Resin Art Work"
                                        className="w-full h-full object-cover rounded-xl"
                                        loading="eager"
                                        crossOrigin="anonymous"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent rounded-lg flex items-end justify-center pb-2">
                                        <span className="text-white text-[10px] font-black drop-shadow-lg">🧵 Embroidery</span>
                                    </div>
                                </div>
                            </Link>

                            {/* Mini Reel - Resin Art Work */}
                            <Link to="/products?category=Resin Art Work" className="relative group overflow-hidden rounded-xl h-28 cursor-pointer hover:-translate-y-1 transition-transform duration-300">
                                <div className="relative h-full bg-white rounded-xl p-1.5 border border-slate-200 shadow-lg overflow-hidden">
                                    <img
                                        src="https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=300&q=85"
                                        alt="Resin Artwork"
                                        className="w-full h-full object-cover rounded-lg"
                                        loading="eager"
                                        crossOrigin="anonymous"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent rounded-lg flex items-end justify-center pb-2">
                                        <span className="text-white text-[10px] font-black drop-shadow-lg">💎 Resin Art</span>
                                    </div>
                                </div>
                            </Link>

                            {/* Mini Reel - Calligraphy */}
                            <Link to="/products?category=Calligraphy" className="relative group overflow-hidden rounded-xl h-28 cursor-pointer hover:-translate-y-1 transition-transform duration-300">
                                <div className="relative h-full bg-white rounded-xl p-1.5 border border-slate-200 shadow-lg overflow-hidden">
                                    <img
                                        src="https://images.unsplash.com/photo-1455390582262-044cdead277a?w=300&q=85"
                                        alt="Calligraphy Art"
                                        className="w-full h-full object-cover rounded-xl"
                                        loading="eager"
                                        crossOrigin="anonymous"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent rounded-lg flex items-end justify-center pb-2">
                                        <span className="text-white text-[10px] font-black drop-shadow-lg">✍️ Calligraphy</span>
                                    </div>
                                </div>
                            </Link>

                            {/* Mini Reel - Hair Accessories */}
                            <Link to="/products?category=Hair Accessories" className="relative group overflow-hidden rounded-xl h-28 cursor-pointer hover:-translate-y-1 transition-transform duration-300">
                                <div className="relative h-full bg-white rounded-xl p-1.5 border border-slate-200 shadow-lg overflow-hidden">
                                    <img
                                        src="https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=300&q=85"
                                        alt="Hair Accessories"
                                        className="w-full h-full object-cover rounded-xl"
                                        loading="eager"
                                        crossOrigin="anonymous"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent rounded-lg flex items-end justify-center pb-2">
                                        <span className="text-white text-[10px] font-black drop-shadow-lg">💐 Hair</span>
                                    </div>
                                </div>
                            </Link>

                        </div>

                        {/* Promotional Floating Badge */}
                        <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 z-30">
                            <div className="bg-white text-slate-900 px-6 py-3 rounded-2xl shadow-2xl border border-pink-100 animate-bounce-slow hover:scale-110 transition-transform">
                                <div className="flex items-center gap-3">
                                    <div className="text-2xl animate-pulse">🎁</div>
                                    <div>
                                        <div className="text-sm font-black text-pink-600">FREE SHIPPING</div>
                                        <div className="text-xs font-bold text-slate-500">On Orders ₹599+</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Store Badge - Top Left */}
                        <div className="absolute -top-4 -left-4 bg-white px-5 py-3 rounded-2xl shadow-xl border border-slate-100 z-30 hover:scale-105 transition-transform animate-float">
                            <div className="flex items-center gap-2">
                                <div className="w-10 h-10 bg-pink-50 rounded-full flex items-center justify-center text-pink-500">
                                    <span className="font-bold text-lg">✓</span>
                                </div>
                                <div>
                                    <div className="font-black text-xs text-slate-900">100% Handmade</div>
                                    <div className="text-[10px] text-slate-500 font-bold">Premium Quality</div>
                                </div>
                            </div>
                        </div>

                        {/* Rating Badge - Top Right */}
                        <div className="absolute -top-4 -right-4 bg-white px-4 py-3 rounded-2xl shadow-xl border border-slate-100 z-30 hover:scale-105 transition-transform animate-float" style={{ animationDelay: '1s' }}>
                            <div className="text-center">
                                <div className="text-2xl mb-1">⭐</div>
                                <div className="text-xl font-black text-slate-900">4.9</div>
                                <div className="text-[10px] text-slate-500 font-bold">Rating</div>
                            </div>
                        </div>

                        {/* Sparkle Effects */}
                        <div className="absolute top-16 left-4 w-3 h-3 bg-pink-400 rounded-full animate-twinkle shadow-lg shadow-pink-400/50"></div>
                        <div className="absolute bottom-32 right-8 w-2 h-2 bg-purple-400 rounded-full animate-twinkle shadow-lg shadow-purple-400/50" style={{ animationDelay: '1s' }}></div>
                        <div className="absolute top-40 right-4 w-2.5 h-2.5 bg-rose-400 rounded-full animate-twinkle shadow-lg shadow-rose-400/50" style={{ animationDelay: '2s' }}></div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
