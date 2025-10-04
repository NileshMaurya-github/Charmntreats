import React from 'react';

const AnimatedBackground = () => {
  // Generate particle positions
  const particles = Array.from({ length: 60 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    delay: `${Math.random() * 8}s`,
    duration: `${15 + Math.random() * 25}s`,
    size: Math.random() * 6 + 2,
  }));

  const floatingShapes = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    delay: `${Math.random() * 5}s`,
    duration: `${20 + Math.random() * 20}s`,
    size: Math.random() * 100 + 50,
  }));

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-gradient-to-br from-pink-50 via-white to-rose-50">
      {/* Large Gradient Orbs - Video-like background movement */}
      <div className="absolute top-[5%] left-[10%] w-[400px] h-[400px] rounded-full bg-gradient-to-br from-pink-300/30 to-rose-400/20 blur-3xl animate-float-slow"></div>
      <div className="absolute top-[40%] right-[5%] w-[500px] h-[500px] rounded-full bg-gradient-to-br from-rose-300/25 to-pink-400/15 blur-3xl animate-float-medium" style={{animationDelay: '2s'}}></div>
      <div className="absolute bottom-[5%] left-[35%] w-[450px] h-[450px] rounded-full bg-gradient-to-br from-pink-400/20 to-rose-300/25 blur-3xl animate-float-fast" style={{animationDelay: '4s'}}></div>
      
      {/* Medium Gradient Orbs */}
      <div className="absolute top-[15%] right-[20%] w-[250px] h-[250px] rounded-full bg-gradient-to-r from-pink-400/20 via-rose-300/15 to-pink-200/10 animate-pulse-slow blur-2xl"></div>
      <div className="absolute bottom-[25%] left-[15%] w-[300px] h-[300px] rounded-full bg-gradient-to-l from-rose-400/15 via-pink-300/20 to-rose-200/10 animate-pulse-slow blur-2xl" style={{animationDelay: '3s'}}></div>
      <div className="absolute top-[50%] left-[50%] w-[200px] h-[200px] rounded-full bg-gradient-to-tr from-pink-300/25 to-rose-300/15 blur-2xl animate-float-medium" style={{animationDelay: '1.5s'}}></div>
      
      {/* Animated Particles - Floating dots throughout */}
      <div className="absolute inset-0">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute rounded-full bg-gradient-to-br from-pink-400/40 to-rose-400/30 animate-particle-float"
            style={{
              left: particle.left,
              top: particle.top,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              animationDelay: particle.delay,
              animationDuration: particle.duration,
            }}
          />
        ))}
      </div>

      {/* Floating Geometric Shapes */}
      {floatingShapes.map((shape) => (
        <div
          key={shape.id}
          className="absolute opacity-10 animate-geometric-float"
          style={{
            left: shape.left,
            top: shape.top,
            width: `${shape.size}px`,
            height: `${shape.size}px`,
            animationDelay: shape.delay,
            animationDuration: shape.duration,
          }}
        >
          {shape.id % 4 === 0 ? (
            <div className="w-full h-full rounded-full border-2 border-pink-400/50 animate-spin-very-slow"></div>
          ) : shape.id % 4 === 1 ? (
            <div className="w-full h-full rotate-45 border-2 border-rose-400/50"></div>
          ) : shape.id % 4 === 2 ? (
            <svg width="100%" height="100%" viewBox="0 0 100 100">
              <polygon points="50,10 90,90 10,90" fill="none" stroke="#ec4899" strokeWidth="2" opacity="0.5"/>
            </svg>
          ) : (
            <svg width="100%" height="100%" viewBox="0 0 100 100">
              <path d="M50,10 L90,50 L50,90 L10,50 Z" fill="none" stroke="#f472b6" strokeWidth="2" opacity="0.5"/>
            </svg>
          )}
        </div>
      ))}

      {/* Craft-Themed SVG Elements - Scattered throughout */}
      {/* Dream Catchers */}
      <div className="absolute top-[8%] left-[5%] animate-float-slow opacity-25">
        <svg width="80" height="80" viewBox="0 0 100 100" className="animate-spin-slow">
          <circle cx="50" cy="50" r="30" fill="none" stroke="#ec4899" strokeWidth="2" opacity="0.6"/>
          <circle cx="50" cy="50" r="20" fill="none" stroke="#be185d" strokeWidth="1.5" opacity="0.4"/>
          <line x1="50" y1="20" x2="50" y2="80" stroke="#db2777" strokeWidth="1" opacity="0.5"/>
          <line x1="20" y1="50" x2="80" y2="50" stroke="#db2777" strokeWidth="1" opacity="0.5"/>
          <circle cx="50" cy="90" r="3" fill="#ec4899" opacity="0.7"/>
          <circle cx="45" cy="95" r="2" fill="#be185d" opacity="0.6"/>
          <circle cx="55" cy="95" r="2" fill="#be185d" opacity="0.6"/>
        </svg>
      </div>

      <div className="absolute top-[65%] right-[8%] animate-float-medium opacity-20" style={{animationDelay: '3s'}}>
        <svg width="70" height="70" viewBox="0 0 100 100" className="animate-spin-very-slow">
          <circle cx="50" cy="50" r="25" fill="none" stroke="#ec4899" strokeWidth="2" opacity="0.6"/>
          <circle cx="50" cy="50" r="15" fill="none" stroke="#be185d" strokeWidth="1.5" opacity="0.4"/>
          <line x1="50" y1="25" x2="50" y2="75" stroke="#db2777" strokeWidth="1" opacity="0.5"/>
        </svg>
      </div>

      {/* Flower Patterns */}
      <div className="absolute top-[18%] right-[12%] animate-float-fast opacity-22" style={{animationDelay: '1s'}}>
        <svg width="65" height="65" viewBox="0 0 100 100" className="animate-pulse-slow">
          <circle cx="50" cy="50" r="8" fill="#f472b6" opacity="0.8"/>
          <circle cx="50" cy="30" r="12" fill="#ec4899" opacity="0.6"/>
          <circle cx="70" cy="50" r="12" fill="#db2777" opacity="0.6"/>
          <circle cx="50" cy="70" r="12" fill="#ec4899" opacity="0.6"/>
          <circle cx="30" cy="50" r="12" fill="#db2777" opacity="0.6"/>
          <circle cx="35" cy="35" r="10" fill="#f472b6" opacity="0.5"/>
          <circle cx="65" cy="35" r="10" fill="#f472b6" opacity="0.5"/>
          <circle cx="65" cy="65" r="10" fill="#f472b6" opacity="0.5"/>
          <circle cx="35" cy="65" r="10" fill="#f472b6" opacity="0.5"/>
        </svg>
      </div>

      <div className="absolute bottom-[35%] left-[12%] animate-float-slow opacity-20" style={{animationDelay: '2.5s'}}>
        <svg width="55" height="55" viewBox="0 0 100 100" className="animate-pulse-slow">
          <circle cx="50" cy="50" r="6" fill="#f472b6" opacity="0.8"/>
          <circle cx="50" cy="25" r="10" fill="#ec4899" opacity="0.6"/>
          <circle cx="75" cy="50" r="10" fill="#db2777" opacity="0.6"/>
          <circle cx="50" cy="75" r="10" fill="#ec4899" opacity="0.6"/>
          <circle cx="25" cy="50" r="10" fill="#db2777" opacity="0.6"/>
        </svg>
      </div>

      {/* Embroidery Thread Waves */}
      <div className="absolute bottom-[18%] left-[20%] animate-float-medium opacity-18" style={{animationDelay: '0.5s'}}>
        <svg width="100" height="80" viewBox="0 0 100 100" className="animate-wiggle">
          <path d="M10,50 Q30,20 50,50 T90,50" fill="none" stroke="#ec4899" strokeWidth="3" opacity="0.7"/>
          <path d="M10,60 Q30,30 50,60 T90,60" fill="none" stroke="#db2777" strokeWidth="2.5" opacity="0.6"/>
          <path d="M10,70 Q30,40 50,70 T90,70" fill="none" stroke="#f472b6" strokeWidth="2" opacity="0.5"/>
          <circle cx="10" cy="50" r="3" fill="#ec4899"/>
          <circle cx="50" cy="50" r="3" fill="#db2777"/>
          <circle cx="90" cy="50" r="3" fill="#f472b6"/>
        </svg>
      </div>

      <div className="absolute top-[42%] left-[68%] animate-float-fast opacity-16" style={{animationDelay: '3.5s'}}>
        <svg width="90" height="70" viewBox="0 0 100 100" className="animate-wiggle">
          <path d="M15,50 Q35,25 50,50 T85,50" fill="none" stroke="#ec4899" strokeWidth="2.5" opacity="0.7"/>
          <path d="M15,60 Q35,35 50,60 T85,60" fill="none" stroke="#db2777" strokeWidth="2" opacity="0.6"/>
          <circle cx="15" cy="50" r="3" fill="#ec4899"/>
          <circle cx="50" cy="50" r="3" fill="#db2777"/>
          <circle cx="85" cy="50" r="3" fill="#f472b6"/>
        </svg>
      </div>

      {/* Candle Flames */}
      <div className="absolute top-[52%] right-[18%] animate-float-slow opacity-25" style={{animationDelay: '1.5s'}}>
        <svg width="50" height="70" viewBox="0 0 50 70" className="animate-flicker">
          <ellipse cx="25" cy="60" rx="8" ry="3" fill="#ec4899" opacity="0.5"/>
          <rect x="20" y="30" width="10" height="30" fill="#f472b6" opacity="0.6" rx="2"/>
          <path d="M25,10 Q20,20 25,30 Q30,20 25,10" fill="#fbbf24" opacity="0.8"/>
          <path d="M25,12 Q22,18 25,25 Q28,18 25,12" fill="#fef3c7" opacity="0.9"/>
        </svg>
      </div>

      <div className="absolute bottom-[45%] left-[25%] animate-float-medium opacity-20" style={{animationDelay: '4s'}}>
        <svg width="45" height="65" viewBox="0 0 50 70" className="animate-flicker">
          <ellipse cx="25" cy="60" rx="7" ry="3" fill="#ec4899" opacity="0.5"/>
          <rect x="20" y="35" width="10" height="25" fill="#f472b6" opacity="0.6" rx="2"/>
          <path d="M25,15 Q21,23 25,35 Q29,23 25,15" fill="#fbbf24" opacity="0.8"/>
        </svg>
      </div>

      {/* Resin Art Drops */}
      <div className="absolute top-[35%] left-[30%] animate-float-fast opacity-22" style={{animationDelay: '2s'}}>
        <svg width="75" height="75" viewBox="0 0 100 100">
          <circle cx="30" cy="30" r="15" fill="url(#gradient1)" opacity="0.7" className="animate-blob"/>
          <circle cx="70" cy="40" r="12" fill="url(#gradient2)" opacity="0.6" className="animate-blob" style={{animationDelay: '1s'}}/>
          <circle cx="50" cy="70" r="18" fill="url(#gradient3)" opacity="0.8" className="animate-blob" style={{animationDelay: '2s'}}/>
          <defs>
            <radialGradient id="gradient1">
              <stop offset="0%" stopColor="#ec4899" stopOpacity="0.8"/>
              <stop offset="100%" stopColor="#db2777" stopOpacity="0.3"/>
            </radialGradient>
            <radialGradient id="gradient2">
              <stop offset="0%" stopColor="#f472b6" stopOpacity="0.8"/>
              <stop offset="100%" stopColor="#ec4899" stopOpacity="0.3"/>
            </radialGradient>
            <radialGradient id="gradient3">
              <stop offset="0%" stopColor="#db2777" stopOpacity="0.8"/>
              <stop offset="100%" stopColor="#be185d" stopOpacity="0.3"/>
            </radialGradient>
          </defs>
        </svg>
      </div>

      <div className="absolute bottom-[28%] right-[25%] animate-float-slow opacity-18" style={{animationDelay: '1.2s'}}>
        <svg width="65" height="65" viewBox="0 0 100 100">
          <circle cx="40" cy="35" r="14" fill="url(#gradient4)" opacity="0.7" className="animate-blob"/>
          <circle cx="65" cy="50" r="11" fill="url(#gradient5)" opacity="0.6" className="animate-blob" style={{animationDelay: '1.5s'}}/>
          <circle cx="45" cy="70" r="16" fill="url(#gradient6)" opacity="0.8" className="animate-blob" style={{animationDelay: '2.5s'}}/>
          <defs>
            <radialGradient id="gradient4">
              <stop offset="0%" stopColor="#ec4899" stopOpacity="0.8"/>
              <stop offset="100%" stopColor="#db2777" stopOpacity="0.3"/>
            </radialGradient>
            <radialGradient id="gradient5">
              <stop offset="0%" stopColor="#f472b6" stopOpacity="0.8"/>
              <stop offset="100%" stopColor="#ec4899" stopOpacity="0.3"/>
            </radialGradient>
            <radialGradient id="gradient6">
              <stop offset="0%" stopColor="#db2777" stopOpacity="0.8"/>
              <stop offset="100%" stopColor="#be185d" stopOpacity="0.3"/>
            </radialGradient>
          </defs>
        </svg>
      </div>

      {/* Mirror Work (Lippan Art) Sparkles */}
      <div className="absolute bottom-[40%] left-[8%] animate-float-medium opacity-23" style={{animationDelay: '3s'}}>
        <svg width="70" height="70" viewBox="0 0 100 100" className="animate-sparkle">
          <circle cx="50" cy="50" r="25" fill="none" stroke="#ec4899" strokeWidth="2" opacity="0.5"/>
          <circle cx="50" cy="50" r="8" fill="#fbbf24" opacity="0.8"/>
          <circle cx="30" cy="30" r="5" fill="#fef3c7" opacity="0.9" className="animate-ping-slow"/>
          <circle cx="70" cy="30" r="5" fill="#fef3c7" opacity="0.9" className="animate-ping-slow" style={{animationDelay: '0.5s'}}/>
          <circle cx="70" cy="70" r="5" fill="#fef3c7" opacity="0.9" className="animate-ping-slow" style={{animationDelay: '1s'}}/>
          <circle cx="30" cy="70" r="5" fill="#fef3c7" opacity="0.9" className="animate-ping-slow" style={{animationDelay: '1.5s'}}/>
        </svg>
      </div>

      <div className="absolute top-[28%] left-[45%] animate-float-fast opacity-20" style={{animationDelay: '0.8s'}}>
        <svg width="60" height="60" viewBox="0 0 100 100" className="animate-sparkle">
          <circle cx="50" cy="50" r="20" fill="none" stroke="#ec4899" strokeWidth="2" opacity="0.5"/>
          <circle cx="50" cy="50" r="6" fill="#fbbf24" opacity="0.8"/>
          <circle cx="35" cy="35" r="4" fill="#fef3c7" opacity="0.9" className="animate-ping-slow"/>
          <circle cx="65" cy="35" r="4" fill="#fef3c7" opacity="0.9" className="animate-ping-slow" style={{animationDelay: '0.3s'}}/>
          <circle cx="65" cy="65" r="4" fill="#fef3c7" opacity="0.9" className="animate-ping-slow" style={{animationDelay: '0.6s'}}/>
          <circle cx="35" cy="65" r="4" fill="#fef3c7" opacity="0.9" className="animate-ping-slow" style={{animationDelay: '0.9s'}}/>
        </svg>
      </div>

      {/* Calligraphy Swirls */}
      <div className="absolute top-[25%] right-[6%] animate-float-slow opacity-18" style={{animationDelay: '2.2s'}}>
        <svg width="95" height="95" viewBox="0 0 100 100" className="animate-draw">
          <path d="M10,50 Q25,10 50,30 T90,50 Q75,70 50,60 T10,50" 
                fill="none" 
                stroke="#db2777" 
                strokeWidth="2.5" 
                opacity="0.7"
                strokeLinecap="round"
                className="animate-dash"/>
        </svg>
      </div>

      <div className="absolute bottom-[52%] left-[38%] animate-float-medium opacity-16" style={{animationDelay: '1.8s'}}>
        <svg width="85" height="85" viewBox="0 0 100 100" className="animate-draw">
          <path d="M15,50 Q30,20 50,40 T85,50 Q70,75 50,65 T15,50" 
                fill="none" 
                stroke="#db2777" 
                strokeWidth="2" 
                opacity="0.7"
                strokeLinecap="round"/>
        </svg>
      </div>

      {/* Hair Accessories */}
      <div className="absolute bottom-[22%] right-[15%] animate-float-fast opacity-19" style={{animationDelay: '2.8s'}}>
        <svg width="65" height="45" viewBox="0 0 100 60" className="animate-bounce-slow">
          <rect x="10" y="10" width="80" height="15" rx="7" fill="#ec4899" opacity="0.6"/>
          <rect x="15" y="15" width="70" height="8" rx="4" fill="#f472b6" opacity="0.7"/>
          <circle cx="25" cy="19" r="4" fill="#fef3c7" opacity="0.8"/>
          <circle cx="50" cy="19" r="4" fill="#fef3c7" opacity="0.8"/>
          <circle cx="75" cy="19" r="4" fill="#fef3c7" opacity="0.8"/>
        </svg>
      </div>

      <div className="absolute top-[72%] left-[55%] animate-float-medium opacity-17" style={{animationDelay: '3.5s'}}>
        <svg width="55" height="38" viewBox="0 0 100 60" className="animate-bounce-slow">
          <rect x="15" y="15" width="70" height="12" rx="6" fill="#ec4899" opacity="0.6"/>
          <circle cx="30" cy="21" r="3" fill="#fef3c7" opacity="0.8"/>
          <circle cx="50" cy="21" r="3" fill="#fef3c7" opacity="0.8"/>
          <circle cx="70" cy="21" r="3" fill="#fef3c7" opacity="0.8"/>
        </svg>
      </div>

      {/* Illustration Pencil Strokes */}
      <div className="absolute top-[68%] left-[35%] animate-float-slow opacity-15" style={{animationDelay: '0.3s'}}>
        <svg width="85" height="65" viewBox="0 0 100 80" className="animate-slide">
          <line x1="10" y1="20" x2="90" y2="20" stroke="#ec4899" strokeWidth="2" opacity="0.6" strokeDasharray="5,5"/>
          <line x1="10" y1="40" x2="80" y2="40" stroke="#db2777" strokeWidth="2.5" opacity="0.7"/>
          <line x1="10" y1="60" x2="70" y2="60" stroke="#f472b6" strokeWidth="2" opacity="0.5"/>
        </svg>
      </div>

      <div className="absolute bottom-[58%] right-[32%] animate-float-fast opacity-14" style={{animationDelay: '4.2s'}}>
        <svg width="75" height="55" viewBox="0 0 100 80" className="animate-slide">
          <line x1="15" y1="25" x2="85" y2="25" stroke="#ec4899" strokeWidth="2" opacity="0.6"/>
          <line x1="15" y1="45" x2="75" y2="45" stroke="#db2777" strokeWidth="2.5" opacity="0.7"/>
          <line x1="15" y1="65" x2="65" y2="65" stroke="#f472b6" strokeWidth="2" opacity="0.5"/>
        </svg>
      </div>

      {/* Sparkle Stars Throughout */}
      <div className="absolute top-[12%] left-[25%] animate-twinkle opacity-35">
        <svg width="18" height="18" viewBox="0 0 20 20">
          <path d="M10,0 L11,9 L20,10 L11,11 L10,20 L9,11 L0,10 L9,9 Z" fill="#fbbf24" opacity="0.8"/>
        </svg>
      </div>

      <div className="absolute top-[45%] left-[58%] animate-twinkle opacity-35" style={{animationDelay: '1.2s'}}>
        <svg width="16" height="16" viewBox="0 0 20 20">
          <path d="M10,0 L11,9 L20,10 L11,11 L10,20 L9,11 L0,10 L9,9 Z" fill="#fef3c7" opacity="0.9"/>
        </svg>
      </div>

      <div className="absolute top-[58%] left-[15%] animate-twinkle opacity-35" style={{animationDelay: '2.5s'}}>
        <svg width="17" height="17" viewBox="0 0 20 20">
          <path d="M10,0 L11,9 L20,10 L11,11 L10,20 L9,11 L0,10 L9,9 Z" fill="#fbbf24" opacity="0.8"/>
        </svg>
      </div>

      <div className="absolute bottom-[38%] right-[28%] animate-twinkle opacity-35" style={{animationDelay: '3.2s'}}>
        <svg width="15" height="15" viewBox="0 0 20 20">
          <path d="M10,0 L11,9 L20,10 L11,11 L10,20 L9,11 L0,10 L9,9 Z" fill="#fef3c7" opacity="0.9"/>
        </svg>
      </div>

      <div className="absolute top-[22%] right-[42%] animate-twinkle opacity-35" style={{animationDelay: '0.5s'}}>
        <svg width="16" height="16" viewBox="0 0 20 20">
          <path d="M10,0 L11,9 L20,10 L11,11 L10,20 L9,11 L0,10 L9,9 Z" fill="#fbbf24" opacity="0.8"/>
        </svg>
      </div>

      <div className="absolute bottom-[15%] left-[62%] animate-twinkle opacity-35" style={{animationDelay: '1.8s'}}>
        <svg width="14" height="14" viewBox="0 0 20 20">
          <path d="M10,0 L11,9 L20,10 L11,11 L10,20 L9,11 L0,10 L9,9 Z" fill="#fef3c7" opacity="0.9"/>
        </svg>
      </div>

      <div className="absolute top-[82%] right-[18%] animate-twinkle opacity-35" style={{animationDelay: '2.8s'}}>
        <svg width="16" height="16" viewBox="0 0 20 20">
          <path d="M10,0 L11,9 L20,10 L11,11 L10,20 L9,11 L0,10 L9,9 Z" fill="#fbbf24" opacity="0.8"/>
        </svg>
      </div>

      <div className="absolute bottom-[68%] left-[48%] animate-twinkle opacity-35" style={{animationDelay: '3.8s'}}>
        <svg width="15" height="15" viewBox="0 0 20 20">
          <path d="M10,0 L11,9 L20,10 L11,11 L10,20 L9,11 L0,10 L9,9 Z" fill="#fef3c7" opacity="0.9"/>
        </svg>
      </div>

      {/* Gradient Overlay for Depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/10 to-white/30 pointer-events-none"></div>
    </div>
  );
};

export default AnimatedBackground;
