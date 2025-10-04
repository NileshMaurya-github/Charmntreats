
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, Truck, Heart, Users, Award, Globe, Star, CheckCircle, ArrowRight } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LazyImage from '@/components/ui/lazy-image';

const AboutUs = () => {
  const [scrollY, setScrollY] = useState(0);
  const [activeTimeline, setActiveTimeline] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const timelineEvents = [
    { year: '2020', title: 'The Beginning', description: 'Founded with a vision to preserve traditional crafts' },
    { year: '2021', title: 'Growing Community', description: 'Partnered with 50+ skilled artisans' },
    { year: '2022', title: 'Quality Excellence', description: 'Achieved 99% customer satisfaction rate' },
    { year: '2023', title: 'Global Reach', description: 'Expanded to serve customers worldwide' },
    { year: '2024', title: 'Future Vision', description: 'Leading the handcraft revolution digitally' }
  ];

  const teamMembers = [
    { name: 'Priya Sharma', role: 'Founder & CEO', image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80' },
    { name: 'Rajesh Kumar', role: 'Master Craftsman', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80' },
    { name: 'Anita Patel', role: 'Design Director', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80' },
    { name: 'Vikram Singh', role: 'Quality Manager', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-pink-900 overflow-hidden relative">
      <Header />
      
      {/* GOD-LEVEL Parallax Background with Floating Particles */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Gradient Orbs */}
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-gradient-to-br from-pink-500/30 via-rose-500/20 to-purple-500/30 rounded-full animate-float blur-3xl"></div>
        <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] bg-gradient-to-tr from-purple-500/25 via-pink-500/20 to-rose-500/25 rounded-full animate-float blur-3xl" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-20 right-20 w-64 h-64 bg-gradient-to-br from-rose-400/30 to-pink-500/40 rounded-full animate-pulse blur-2xl"></div>
        
        {/* Floating Particles */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-pink-400 rounded-full animate-twinkle"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              opacity: Math.random() * 0.5 + 0.3
            }}
          ></div>
        ))}
        
        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px] opacity-30"></div>
      </div>
      
      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* GOD-LEVEL Hero Section */}
        <div className="text-center mb-20 animate-fade-in">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-pink-400 to-purple-400 opacity-20 blur-3xl animate-pulse"></div>
            
            {/* Premium Subtitle Badge */}
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl shadow-pink-500/30 mb-6 animate-fade-in-up">
              <Star className="h-5 w-5 fill-pink-400 text-pink-400 animate-pulse" />
              <span className="text-sm font-bold tracking-widest uppercase bg-gradient-to-r from-pink-200 via-rose-200 to-pink-100 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(244,114,182,0.5)]">
                ✨ Our Story ✨
              </span>
              <div className="w-2 h-2 bg-pink-400 rounded-full animate-ping"></div>
            </div>
            
            {/* 3D Title Effect */}
            <h1 className="text-5xl lg:text-7xl font-black leading-tight mb-6">
              <span className="block mb-2 bg-gradient-to-r from-white via-pink-100 to-white bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(255,255,255,0.3)]" style={{ textShadow: '0 0 40px rgba(255,182,193,0.5), 0 0 80px rgba(236,72,153,0.3)' }}>
                About
              </span>
              <span className="block relative inline-block group">
                <span className="relative z-10 bg-gradient-to-r from-pink-300 via-rose-400 to-pink-500 bg-clip-text text-transparent animate-shimmer font-extrabold" style={{ textShadow: '0 0 60px rgba(236,72,153,0.8), 0 0 100px rgba(244,114,182,0.6)' }}>
                  Charmntreats
                </span>
                {/* 3D Shadow Layers */}
                <span className="absolute top-1 left-1 bg-gradient-to-r from-pink-600 via-rose-700 to-pink-800 bg-clip-text text-transparent opacity-30 blur-sm" aria-hidden="true">
                  Charmntreats
                </span>
                <span className="absolute top-2 left-2 bg-gradient-to-r from-pink-800 via-rose-900 to-pink-900 bg-clip-text text-transparent opacity-20 blur-md" aria-hidden="true">
                  Charmntreats
                </span>
                <div className="absolute -inset-4 bg-gradient-to-r from-pink-500/20 via-rose-500/30 to-pink-500/20 rounded-3xl blur-3xl -z-10"></div>
              </span>
            </h1>
            
            <p className="text-xl text-white/90 max-w-4xl mx-auto leading-relaxed font-medium drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)] animate-fade-in-up">
              Discover our story, values, and commitment to bringing you the finest handcrafted treasures that celebrate artisan excellence
            </p>
          </div>
          
          {/* Premium Glass Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 animate-fade-in animate-delay-600">
            <div className="group p-6 bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border-2 border-white/20 hover:border-pink-400/50 transition-all duration-500 hover:scale-105 hover:shadow-[0_0_40px_rgba(236,72,153,0.4)]">
              <div className="text-4xl font-black bg-gradient-to-r from-pink-300 to-rose-400 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(236,72,153,0.8)]">1000+</div>
              <div className="text-sm text-white/80 font-bold mt-2">Happy Customers</div>
            </div>
            <div className="group p-6 bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border-2 border-white/20 hover:border-purple-400/50 transition-all duration-500 hover:scale-105 hover:shadow-[0_0_40px_rgba(168,85,247,0.4)]">
              <div className="text-4xl font-black bg-gradient-to-r from-purple-300 to-pink-400 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(168,85,247,0.8)]">50+</div>
              <div className="text-sm text-white/80 font-bold mt-2">Skilled Artisans</div>
            </div>
            <div className="group p-6 bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border-2 border-white/20 hover:border-pink-400/50 transition-all duration-500 hover:scale-105 hover:shadow-[0_0_40px_rgba(236,72,153,0.4)]">
              <div className="text-4xl font-black bg-gradient-to-r from-pink-300 to-rose-400 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(236,72,153,0.8)]">99%</div>
              <div className="text-sm text-white/80 font-bold mt-2">Satisfaction Rate</div>
            </div>
            <div className="group p-6 bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border-2 border-white/20 hover:border-purple-400/50 transition-all duration-500 hover:scale-105 hover:shadow-[0_0_40px_rgba(168,85,247,0.4)]">
              <div className="text-4xl font-black bg-gradient-to-r from-purple-300 to-pink-400 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(168,85,247,0.8)]">4+</div>
              <div className="text-sm text-white/80 font-bold mt-2">Years Strong</div>
            </div>
          </div>
        </div>

        {/* Premium Interactive Story Timeline */}
        <div className="mb-20 animate-fade-in animate-delay-800">
          <h2 className="text-5xl font-black text-center mb-12">
            <span className="bg-gradient-to-r from-pink-300 via-rose-400 to-pink-500 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(236,72,153,0.8)]" style={{ textShadow: '0 0 40px rgba(236,72,153,0.6), 0 0 60px rgba(244,114,182,0.4)' }}>
              Our Journey
            </span>
          </h2>
          
          <div className="relative max-w-6xl mx-auto px-8">
            {/* Premium Timeline Line with Glow */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-pink-400 via-rose-500 to-purple-500 rounded-full shadow-[0_0_20px_rgba(236,72,153,0.6)]"></div>
            
            {/* GOD-LEVEL Timeline Events */}
            <div className="space-y-12">
              {timelineEvents.map((event, index) => (
                <div 
                  key={index}
                  className={`relative flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'} animate-slide-${index % 2 === 0 ? 'left' : 'right'} animate-delay-${(index + 2) * 200}`}
                  onMouseEnter={() => setActiveTimeline(index)}
                >
                  {/* Premium Timeline Dot with Glow */}
                  <div className={`absolute left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full z-10 transition-all duration-500 ${
                    activeTimeline === index 
                      ? 'bg-gradient-to-r from-pink-500 via-rose-500 to-purple-500 scale-150 shadow-[0_0_30px_rgba(236,72,153,0.8)] border-4 border-white/30' 
                      : 'bg-gradient-to-br from-pink-400 to-purple-400 border-4 border-white/50 shadow-[0_0_15px_rgba(236,72,153,0.5)]'
                  }`}></div>
                  
                  {/* Premium Content Card */}
                  <div className={`w-5/12 ${index % 2 === 0 ? 'pr-8' : 'pl-8'}`}>
                    <div className={`group p-6 bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl hover:shadow-[0_0_40px_rgba(236,72,153,0.4)] transition-all duration-500 ${
                      activeTimeline === index ? 'scale-105 shadow-[0_0_50px_rgba(236,72,153,0.6)]' : ''
                    } border-2 border-white/20 hover:border-pink-400/50`}>
                      <div className="flex items-center mb-3">
                        <div className="text-3xl font-black bg-gradient-to-r from-pink-300 to-purple-400 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(236,72,153,0.8)]">
                          {event.year}
                        </div>
                        <ArrowRight className="ml-2 h-5 w-5 text-pink-300 group-hover:text-pink-400 group-hover:translate-x-1 transition-all duration-300 drop-shadow-[0_0_10px_rgba(236,72,153,0.8)]" />
                      </div>
                      <h3 className="text-2xl font-black text-white mb-3 group-hover:text-pink-300 transition-colors duration-300 drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
                        {event.title}
                      </h3>
                      <p className="text-white/80 font-medium leading-relaxed group-hover:text-white transition-colors duration-300">
                        {event.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* GOD-LEVEL Our Story Section */}
        <div className="mb-20 animate-fade-in animate-delay-1000">
          <div className="relative bg-white/5 backdrop-blur-xl rounded-3xl p-12 shadow-2xl border-2 border-white/20 hover:border-pink-400/50 transition-all duration-500">
            <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 to-purple-500/10 rounded-3xl"></div>
            
            {/* Floating Sparkles */}
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-pink-400 rounded-full animate-twinkle"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`
                }}
              ></div>
            ))}
            
            <h2 className="text-5xl font-black text-center mb-12 relative z-10">
              <span className="bg-gradient-to-r from-pink-300 via-rose-400 to-purple-400 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(236,72,153,0.8)]" style={{ textShadow: '0 0 40px rgba(236,72,153,0.6)' }}>
                Our Story
              </span>
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
              <div className="space-y-6 animate-slide-left">
                <p className="text-lg text-white/90 leading-relaxed font-medium drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
                  Founded with a passion for preserving traditional crafts, Charmntreats brings together skilled artisans and craft enthusiasts to create unique, handmade treasures. Our journey began with a simple belief: that handcrafted items carry a soul that mass-produced goods cannot replicate.
                </p>
                <p className="text-lg text-white/90 leading-relaxed font-medium drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
                  Every piece in our collection is carefully crafted by talented artisans who have mastered their craft through years of dedication. We work directly with creators to ensure fair compensation and sustainable practices.
                </p>
                <p className="text-lg text-white/90 leading-relaxed font-medium drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
                  From dream catchers that protect your sleep to intricate embroidery that tells stories, each item is a testament to human creativity and skill.
                </p>
                
                {/* Premium Features */}
                <div className="space-y-4 pt-4">
                  <div className="flex items-center space-x-4 group">
                    <CheckCircle className="h-7 w-7 text-green-400 drop-shadow-[0_0_10px_rgba(34,197,94,0.8)] group-hover:scale-110 transition-transform duration-300" />
                    <span className="text-white font-bold group-hover:text-green-300 transition-colors duration-300">100% Handcrafted</span>
                  </div>
                  <div className="flex items-center space-x-4 group">
                    <CheckCircle className="h-7 w-7 text-green-400 drop-shadow-[0_0_10px_rgba(34,197,94,0.8)] group-hover:scale-110 transition-transform duration-300" />
                    <span className="text-white font-bold group-hover:text-green-300 transition-colors duration-300">Fair Trade Practices</span>
                  </div>
                  <div className="flex items-center space-x-4 group">
                    <CheckCircle className="h-7 w-7 text-green-400 drop-shadow-[0_0_10px_rgba(34,197,94,0.8)] group-hover:scale-110 transition-transform duration-300" />
                    <span className="text-white font-bold group-hover:text-green-300 transition-colors duration-300">Sustainable Materials</span>
                  </div>
                </div>
              </div>
              
              <div className="animate-slide-right">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-500 rounded-3xl blur-2xl opacity-40 group-hover:opacity-60 transition-opacity duration-500 animate-pulse"></div>
                  <div className="absolute -inset-1 bg-gradient-to-r from-pink-400 to-purple-400 rounded-3xl opacity-30 blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                  <LazyImage
                    src="https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"
                    alt="Artisan at work"
                    className="relative w-full h-80 object-cover rounded-3xl shadow-2xl group-hover:scale-105 transition-transform duration-700 border-2 border-white/20"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* GOD-LEVEL Our Values */}
        <div className="mb-20 animate-fade-in animate-delay-1400">
          <h2 className="text-5xl font-black text-center mb-12">
            <span className="bg-gradient-to-r from-pink-300 via-rose-400 to-purple-400 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(236,72,153,0.8)]" style={{ textShadow: '0 0 40px rgba(236,72,153,0.6)' }}>
              Our Values
            </span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="group text-center p-8 bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl hover:shadow-[0_0_40px_rgba(34,197,94,0.4)] transition-all duration-500 border-2 border-white/20 hover:border-green-400/50 hover:scale-105 animate-slide-up animate-delay-200">
              <div className="relative mb-6">
                <Shield className="h-16 w-16 text-green-400 mx-auto group-hover:scale-110 transition-transform duration-300 drop-shadow-[0_0_20px_rgba(34,197,94,0.8)]" />
                <div className="absolute inset-0 bg-green-400/30 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></div>
              </div>
              <h3 className="text-xl font-black text-white mb-3 group-hover:text-green-300 transition-colors duration-300 drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">Quality Assured</h3>
              <p className="text-white/80 font-medium group-hover:text-white transition-colors duration-300">Every item undergoes strict quality checks to ensure perfection</p>
            </div>
            
            <div className="group text-center p-8 bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl hover:shadow-[0_0_40px_rgba(239,68,68,0.4)] transition-all duration-500 border-2 border-white/20 hover:border-red-400/50 hover:scale-105 animate-slide-up animate-delay-400">
              <div className="relative mb-6">
                <Heart className="h-16 w-16 text-red-400 mx-auto group-hover:scale-110 transition-transform duration-300 drop-shadow-[0_0_20px_rgba(239,68,68,0.8)] fill-red-400" />
                <div className="absolute inset-0 bg-red-400/30 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></div>
              </div>
              <h3 className="text-xl font-black text-white mb-3 group-hover:text-red-300 transition-colors duration-300 drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">Handmade with Love</h3>
              <p className="text-white/80 font-medium group-hover:text-white transition-colors duration-300">Each piece is crafted with care and attention to detail</p>
            </div>
            
            <div className="group text-center p-8 bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl hover:shadow-[0_0_40px_rgba(59,130,246,0.4)] transition-all duration-500 border-2 border-white/20 hover:border-blue-400/50 hover:scale-105 animate-slide-up animate-delay-600">
              <div className="relative mb-6">
                <Truck className="h-16 w-16 text-blue-400 mx-auto group-hover:scale-110 transition-transform duration-300 drop-shadow-[0_0_20px_rgba(59,130,246,0.8)]" />
                <div className="absolute inset-0 bg-blue-400/30 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></div>
              </div>
              <h3 className="text-xl font-black text-white mb-3 group-hover:text-blue-300 transition-colors duration-300 drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">Fast Delivery</h3>
              <p className="text-white/80 font-medium group-hover:text-white transition-colors duration-300">Quick and secure shipping to your doorstep</p>
            </div>
            
            <div className="group text-center p-8 bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl hover:shadow-[0_0_40px_rgba(168,85,247,0.4)] transition-all duration-500 border-2 border-white/20 hover:border-purple-400/50 hover:scale-105 animate-slide-up animate-delay-800">
              <div className="relative mb-6">
                <Award className="h-16 w-16 text-purple-400 mx-auto group-hover:scale-110 transition-transform duration-300 drop-shadow-[0_0_20px_rgba(168,85,247,0.8)]" />
                <div className="absolute inset-0 bg-purple-400/30 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></div>
              </div>
              <h3 className="text-xl font-black text-white mb-3 group-hover:text-purple-300 transition-colors duration-300 drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">100% Authentic</h3>
              <p className="text-white/80 font-medium group-hover:text-white transition-colors duration-300">Genuine handcrafted products guaranteed</p>
            </div>
          </div>
        </div>

        {/* GOD-LEVEL Product Promise Section */}
        <div className="max-w-6xl mx-auto mb-20 animate-fade-in animate-delay-1600">
          <div className="relative bg-white/5 backdrop-blur-xl rounded-3xl p-12 shadow-2xl border-2 border-white/20">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-3xl"></div>
            
            {/* Floating Sparkles */}
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-blue-400 rounded-full animate-twinkle"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`
                }}
              ></div>
            ))}
            
            <h3 className="text-5xl font-black text-center mb-12 relative z-10">
              <span className="bg-gradient-to-r from-blue-300 via-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(59,130,246,0.8)]" style={{ textShadow: '0 0 40px rgba(59,130,246,0.6)' }}>
                Our Product Promise
              </span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
              <div className="group p-6 bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl hover:shadow-[0_0_40px_rgba(34,197,94,0.4)] transition-all duration-500 border-2 border-white/20 hover:border-green-400/50 hover:scale-105 animate-slide-up animate-delay-200">
                <div className="flex items-center mb-4">
                  <CheckCircle className="h-8 w-8 text-green-400 mr-3 drop-shadow-[0_0_10px_rgba(34,197,94,0.8)] group-hover:scale-110 transition-transform duration-300" />
                  <strong className="text-lg text-white font-black group-hover:text-green-300 transition-colors duration-300">100% Authentic</strong>
                </div>
                <p className="text-white/80 font-medium group-hover:text-white transition-colors duration-300">Every product is genuinely handcrafted with love and care.</p>
              </div>
              
              <div className="group p-6 bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl hover:shadow-[0_0_40px_rgba(34,197,94,0.4)] transition-all duration-500 border-2 border-white/20 hover:border-green-400/50 hover:scale-105 animate-slide-up animate-delay-400">
                <div className="flex items-center mb-4">
                  <CheckCircle className="h-8 w-8 text-green-400 mr-3 drop-shadow-[0_0_10px_rgba(34,197,94,0.8)] group-hover:scale-110 transition-transform duration-300" />
                  <strong className="text-lg text-white font-black group-hover:text-green-300 transition-colors duration-300">Handmade Nature</strong>
                </div>
                <p className="text-white/80 font-medium group-hover:text-white transition-colors duration-300">Slight variations in color, texture, and design are natural characteristics.</p>
              </div>
              
              <div className="group p-6 bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl hover:shadow-[0_0_40px_rgba(168,85,247,0.4)] transition-all duration-500 border-2 border-white/20 hover:border-purple-400/50 hover:scale-105 animate-slide-up animate-delay-600">
                <div className="flex items-center mb-4">
                  <CheckCircle className="h-8 w-8 text-purple-400 mr-3 drop-shadow-[0_0_10px_rgba(168,85,247,0.8)] group-hover:scale-110 transition-transform duration-300" />
                  <strong className="text-lg text-white font-black group-hover:text-purple-300 transition-colors duration-300">Quality Materials</strong>
                </div>
                <p className="text-white/80 font-medium group-hover:text-white transition-colors duration-300">We use only high-quality, sustainable materials in our products.</p>
              </div>
              
              <div className="group p-6 bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl hover:shadow-[0_0_40px_rgba(249,115,22,0.4)] transition-all duration-500 border-2 border-white/20 hover:border-orange-400/50 hover:scale-105 animate-slide-up animate-delay-800">
                <div className="flex items-center mb-4">
                  <CheckCircle className="h-8 w-8 text-orange-400 mr-3 drop-shadow-[0_0_10px_rgba(249,115,22,0.8)] group-hover:scale-110 transition-transform duration-300" />
                  <strong className="text-lg text-white font-black group-hover:text-orange-300 transition-colors duration-300">Care Instructions</strong>
                </div>
                <p className="text-white/80 font-medium group-hover:text-white transition-colors duration-300">Each product comes with detailed care instructions.</p>
              </div>
              
              <div className="group p-6 bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl hover:shadow-[0_0_40px_rgba(239,68,68,0.4)] transition-all duration-500 border-2 border-white/20 hover:border-red-400/50 hover:scale-105 animate-slide-up animate-delay-1000">
                <div className="flex items-center mb-4">
                  <CheckCircle className="h-8 w-8 text-red-400 mr-3 drop-shadow-[0_0_10px_rgba(239,68,68,0.8)] group-hover:scale-110 transition-transform duration-300" />
                  <strong className="text-lg text-white font-black group-hover:text-red-300 transition-colors duration-300">Quality Guarantee</strong>
                </div>
                <p className="text-white/80 font-medium group-hover:text-white transition-colors duration-300">We stand behind the quality of our products.</p>
              </div>
              
              <div className="group p-6 bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl hover:shadow-[0_0_40px_rgba(236,72,153,0.4)] transition-all duration-500 border-2 border-white/20 hover:border-pink-400/50 hover:scale-105 animate-slide-up animate-delay-1200">
                <div className="flex items-center mb-4">
                  <CheckCircle className="h-8 w-8 text-pink-400 mr-3 drop-shadow-[0_0_10px_rgba(236,72,153,0.8)] group-hover:scale-110 transition-transform duration-300" />
                  <strong className="text-lg text-white font-black group-hover:text-pink-300 transition-colors duration-300">Custom Orders</strong>
                </div>
                <p className="text-white/80 font-medium group-hover:text-white transition-colors duration-300">Some items can be customized - contact us for details.</p>
              </div>
            </div>
          </div>
        </div>

        {/* GOD-LEVEL Contact Information */}
        <div className="animate-fade-in animate-delay-1800">
          <div className="relative bg-white/5 backdrop-blur-xl rounded-3xl p-12 text-center shadow-2xl border-2 border-white/20 hover:border-pink-400/50 transition-all duration-500">
            <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 to-purple-500/10 rounded-3xl"></div>
            
            {/* Floating Sparkles */}
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-pink-400 rounded-full animate-twinkle"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`
                }}
              ></div>
            ))}
            
            <div className="relative z-10">
              <h3 className="text-5xl font-black mb-6">
                <span className="bg-gradient-to-r from-pink-300 via-rose-400 to-purple-400 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(236,72,153,0.8)]" style={{ textShadow: '0 0 40px rgba(236,72,153,0.6)' }}>
                  Get in Touch
                </span>
              </h3>
              <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto font-medium drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
                Have questions about our products or policies? We're here to help you discover the perfect handcrafted treasure!
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="group p-8 bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl hover:shadow-[0_0_40px_rgba(236,72,153,0.4)] transition-all duration-500 border-2 border-white/20 hover:border-pink-400/50 hover:scale-105 animate-slide-up animate-delay-200">
                  <div className="mb-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-pink-500 via-rose-500 to-purple-500 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300 shadow-[0_0_30px_rgba(236,72,153,0.6)]">
                      <span className="text-3xl drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">📞</span>
                    </div>
                  </div>
                  <strong className="text-lg text-white font-black group-hover:text-pink-300 transition-colors duration-300 drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">Phone</strong>
                  <p className="text-pink-300 font-bold mt-2 group-hover:text-purple-300 transition-colors duration-300 drop-shadow-[0_2px_10px_rgba(236,72,153,0.8)]">
                    +917355451081
                  </p>
                  <p className="text-sm text-white/60 mt-1 font-medium">Available 9 AM - 8 PM</p>
                </div>
                
                <div className="group p-8 bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl hover:shadow-[0_0_40px_rgba(168,85,247,0.4)] transition-all duration-500 border-2 border-white/20 hover:border-purple-400/50 hover:scale-105 animate-slide-up animate-delay-400">
                  <div className="mb-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300 shadow-[0_0_30px_rgba(168,85,247,0.6)]">
                      <span className="text-3xl drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">✉️</span>
                    </div>
                  </div>
                  <strong className="text-lg text-white font-black group-hover:text-purple-300 transition-colors duration-300 drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">Email</strong>
                  <p className="text-purple-300 font-bold mt-2 group-hover:text-pink-300 transition-colors duration-300 drop-shadow-[0_2px_10px_rgba(168,85,247,0.8)]">
                    charmntreats@gmail.com
                  </p>
                  <p className="text-sm text-white/60 mt-1 font-medium">We reply within 24 hours</p>
                </div>
                
                <div className="group p-8 bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl hover:shadow-[0_0_40px_rgba(236,72,153,0.4)] transition-all duration-500 border-2 border-white/20 hover:border-pink-400/50 hover:scale-105 animate-slide-up animate-delay-600">
                  <div className="mb-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-pink-500 via-rose-500 to-purple-500 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300 shadow-[0_0_30px_rgba(236,72,153,0.6)]">
                      <span className="text-3xl drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">📍</span>
                    </div>
                  </div>
                  <strong className="text-lg text-white font-black group-hover:text-pink-300 transition-colors duration-300 drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">Location</strong>
                  <p className="text-pink-300 font-bold mt-2 group-hover:text-purple-300 transition-colors duration-300 drop-shadow-[0_2px_10px_rgba(236,72,153,0.8)]">
                    Bengaluru, Karnataka, India
                  </p>
                  <p className="text-sm text-white/60 mt-1 font-medium">Serving customers worldwide</p>
                </div>
              </div>

              {/* Premium CTA Buttons */}
              <div className="mt-12 flex justify-center space-x-6">
                <div className="group flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-pink-500 via-rose-500 to-purple-500 text-white rounded-full hover:scale-110 transition-all duration-300 cursor-pointer shadow-2xl shadow-pink-500/50 hover:shadow-pink-500/80 border-2 border-white/30">
                  <Users className="h-6 w-6 drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]" />
                  <span className="font-black drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">Join Our Community</span>
                </div>
                <div className="group flex items-center space-x-2 px-8 py-4 bg-white/10 backdrop-blur-xl border-2 border-pink-400/50 text-pink-300 rounded-full hover:bg-pink-500/20 hover:scale-110 hover:shadow-[0_0_40px_rgba(236,72,153,0.4)] transition-all duration-300 cursor-pointer">
                  <Globe className="h-6 w-6 drop-shadow-[0_2px_10px_rgba(236,72,153,0.8)]" />
                  <span className="font-black drop-shadow-[0_2px_10px_rgba(236,72,153,0.8)]">Follow Us</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default AboutUs;
