import React, { useState } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

const VideoShowcase = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  // Replace this with your actual video URL
  const videoUrl = "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&mute=1&controls=0&loop=1&playlist=dQw4w9WgXcQ";
  
  return (
    <section className="relative py-24 overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-pink-900">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-float-slow"></div>
        <div className="absolute bottom-20 right-20 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-3xl animate-float-medium"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-rose-500/10 rounded-full blur-3xl animate-float-fast"></div>
      </div>

      {/* Sparkle Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-twinkle"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header - GOD LEVEL */}
        <div className="text-center mb-16">
          <div className="relative inline-block mb-6">
            <div className="absolute -inset-4 bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 rounded-2xl blur-xl opacity-30 animate-pulse"></div>
            <div className="relative bg-white/10 backdrop-blur-xl px-8 py-3 rounded-2xl border-2 border-white/20">
              <div className="flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-pink-400 animate-spin-slow" />
                <span className="text-white/90 font-black text-sm tracking-wider uppercase">Experience The Magic</span>
                <Sparkles className="w-5 h-5 text-rose-400 animate-spin-slow" />
              </div>
            </div>
          </div>
          
          <h2 className="text-5xl md:text-7xl font-black mb-6 relative">
            <span className="absolute inset-0 text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-rose-200 to-pink-300 blur-sm">
              Watch Our Crafting Journey
            </span>
            <span className="absolute inset-0 text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-rose-300 to-pink-400 blur-xs">
              Watch Our Crafting Journey
            </span>
            <span className="relative text-transparent bg-clip-text bg-gradient-to-r from-white via-pink-100 to-white">
              Watch Our Crafting Journey
            </span>
          </h2>
          
          <p className="text-xl text-white/80 max-w-3xl mx-auto font-bold leading-relaxed">
            Discover the{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-rose-400 to-pink-400">
              artistry and passion
            </span>
            {' '}behind every handcrafted piece
          </p>
        </div>

        {/* Video Player - GOD LEVEL */}
        <div className="max-w-6xl mx-auto">
          <div className="group relative">
            {/* Outer Glow - Massive */}
            <div className="absolute -inset-8 bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 rounded-[3rem] blur-3xl opacity-30 group-hover:opacity-50 transition-all duration-700 animate-pulse"></div>
            
            {/* Video Container */}
            <div className="relative bg-white/10 backdrop-blur-xl border-4 border-white/20 hover:border-pink-400/50 transition-all duration-500 rounded-[3rem] overflow-hidden shadow-2xl group-hover:shadow-pink-500/25">
              {/* Shine Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20 pointer-events-none"></div>
              
              {/* Video Aspect Ratio Container */}
              <div className="relative aspect-video bg-black/40">
                {/* Placeholder or Thumbnail */}
                <div className="absolute inset-0 bg-gradient-to-br from-pink-900/30 via-purple-900/30 to-slate-900/30 flex items-center justify-center">
                  <div className="text-center">
                    <div className="relative mb-6">
                      <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full blur-2xl opacity-50 animate-pulse"></div>
                      <div className="relative bg-white/10 backdrop-blur-xl border-4 border-white/30 rounded-full w-32 h-32 mx-auto flex items-center justify-center group-hover:scale-110 transition-transform duration-500 cursor-pointer">
                        <Play className="w-16 h-16 text-white fill-white" />
                      </div>
                    </div>
                    <p className="text-white font-black text-2xl mb-2">Play Video</p>
                    <p className="text-white/60 font-bold">See how we create magic</p>
                  </div>
                </div>

                {/* Actual Video (uncomment when you have video URL) */}
                {/* <iframe
                  className="absolute inset-0 w-full h-full"
                  src={videoUrl}
                  title="Charmntreats Video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe> */}
              </div>

              {/* Video Controls Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Button
                      variant="outline"
                      size="sm"
                      className="!bg-white/20 hover:!bg-white/30 !text-white !border-white/30 backdrop-blur-xl"
                      onClick={() => setIsPlaying(!isPlaying)}
                    >
                      {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      className="!bg-white/20 hover:!bg-white/30 !text-white !border-white/30 backdrop-blur-xl"
                      onClick={() => setIsMuted(!isMuted)}
                    >
                      {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                    </Button>

                    <div className="text-white/90 text-sm font-bold hidden md:block">
                      Behind the Scenes: Handcrafted with Love
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    className="!bg-white/20 hover:!bg-white/30 !text-white !border-white/30 backdrop-blur-xl"
                  >
                    <Maximize2 className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Video Stats/Features Below */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
            {[
              { number: '1000+', label: 'Happy Customers', gradient: 'from-pink-500 to-rose-500' },
              { number: '500+', label: 'Products Crafted', gradient: 'from-purple-500 to-violet-500' },
              { number: '100%', label: 'Handmade Love', gradient: 'from-emerald-500 to-teal-500' },
              { number: '⭐ 4.9', label: 'Customer Rating', gradient: 'from-amber-500 to-yellow-500' }
            ].map((stat, index) => (
              <div key={index} className="group relative">
                <div className={`absolute -inset-1 bg-gradient-to-r ${stat.gradient} rounded-2xl blur-lg opacity-0 group-hover:opacity-40 transition-all duration-500`}></div>
                <div className="relative bg-white/10 backdrop-blur-xl border-2 border-white/20 hover:border-white/40 rounded-2xl p-6 transition-all duration-500 hover:scale-110 text-center">
                  <div className={`text-3xl md:text-4xl font-black mb-2 text-transparent bg-clip-text bg-gradient-to-r ${stat.gradient}`}>
                    {stat.number}
                  </div>
                  <div className="text-sm font-bold text-white/80">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default VideoShowcase;
