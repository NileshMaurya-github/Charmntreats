import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/hooks/useAuth';
import CartSidebar from './CartSidebar';
import ProfileDropdown from './ProfileDropdown';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { getTotalItems } = useCart();
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  const categories = [
    'Dream Catcher',
    'Embroidery',
    'Lippan Arts',
    'Resin Art Work',
    'Illustration',
    'Candles',
    'Calligraphy',
    'Hair Accessories',
    'Others'
  ];

  const handleCategoryClick = (category: string) => {
    // Force page refresh for category navigation
    window.location.href = `/products?category=${encodeURIComponent(category)}`;
    setIsMenuOpen(false);
  };



  return (
    <header className="relative bg-gradient-to-r from-white via-pink-50/30 to-white backdrop-blur-xl shadow-2xl border-b-2 border-pink-300/40 sticky top-0 z-50 transition-all duration-300 hover:shadow-pink-500/20">
      {/* Animated top highlight bar */}
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-pink-500 via-rose-500 to-pink-500 animate-shimmer" style={{ backgroundSize: '200% 100%' }}></div>
      
      {/* Glowing background effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-pink-100/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group relative">
            {/* Glow effect behind logo */}
            <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 via-rose-500/20 to-pink-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500 animate-pulse"></div>
            
            {/* Logo with sparkle */}
            <div className="relative">
              <div className="text-2xl font-bold bg-gradient-to-r from-pink-600 via-rose-500 to-pink-700 bg-clip-text text-transparent hover:from-pink-700 hover:via-rose-600 hover:to-pink-800 transition-all duration-300 transform group-hover:scale-110 animate-fade-in-down" style={{ backgroundSize: '200% 100%', animation: 'shimmer 3s infinite' }}>
                Charmntreats
              </div>
              {/* Sparkle effect */}
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-pink-400 rounded-full opacity-0 group-hover:opacity-100 animate-ping"></div>
              <div className="absolute -bottom-1 -left-1 w-1.5 h-1.5 bg-rose-400 rounded-full opacity-0 group-hover:opacity-100 animate-ping" style={{ animationDelay: '0.3s' }}></div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="relative text-slate-700 hover:text-pink-600 transition-all duration-300 font-semibold group animate-fade-in-down animate-delay-100">
              <span className="relative z-10 group-hover:drop-shadow-[0_0_8px_rgba(236,72,153,0.5)] transition-all duration-300">Home</span>
              {/* Animated underline */}
              <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-gradient-to-r from-pink-500 via-rose-500 to-pink-500 transform scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-300 rounded-full shadow-lg shadow-pink-500/50"></span>
              {/* Highlight glow */}
              <span className="absolute inset-0 bg-pink-100/30 blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></span>
            </Link>
            <div className="relative group">
              <button className="relative text-slate-700 hover:text-pink-600 transition-all duration-300 flex items-center font-semibold group animate-fade-in-down animate-delay-200">
                <span className="relative z-10 group-hover:drop-shadow-[0_0_8px_rgba(236,72,153,0.5)] transition-all duration-300">Categories</span>
                <svg className="ml-1 w-4 h-4 transform group-hover:rotate-180 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
                {/* Animated underline */}
                <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-gradient-to-r from-pink-500 via-rose-500 to-pink-500 transform scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-300 rounded-full shadow-lg shadow-pink-500/50"></span>
                {/* Highlight glow */}
                <span className="absolute inset-0 bg-pink-100/30 blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></span>
              </button>
              <div className="absolute top-full left-0 mt-3 w-80 bg-gradient-to-br from-slate-900/95 via-purple-900/95 to-pink-900/95 backdrop-blur-2xl rounded-2xl shadow-[0_0_40px_rgba(236,72,153,0.4)] border-2 border-pink-400/30 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-50 hover-lift">
                {/* Top highlight bar with animated gradient */}
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-pink-500 via-rose-500 to-pink-500 rounded-t-2xl animate-shimmer" style={{ backgroundSize: '200% 100%' }}></div>
                
                {/* Floating particles effect */}
                <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
                  <div className="absolute top-3 left-3 w-1.5 h-1.5 bg-pink-400 rounded-full opacity-50 animate-float-slow"></div>
                  <div className="absolute top-6 right-5 w-1 h-1 bg-rose-400 rounded-full opacity-30 animate-float-medium"></div>
                  <div className="absolute bottom-5 left-6 w-1 h-1 bg-purple-400 rounded-full opacity-40 animate-float-fast"></div>
                </div>

                <div className="p-4">
                  {/* Title */}
                  <h3 className="text-sm font-black text-transparent bg-gradient-to-r from-pink-300 via-rose-300 to-pink-300 bg-clip-text mb-3 uppercase tracking-wide drop-shadow-[0_0_8px_rgba(236,72,153,0.5)]">Explore Categories</h3>
                  
                  <div className="grid grid-cols-1 gap-2 max-h-[420px] overflow-y-auto custom-scrollbar">
                    {categories.map((category, index) => (
                      <button
                        key={category}
                        onClick={() => handleCategoryClick(category)}
                        className="relative text-left text-sm font-bold text-white hover:text-pink-200 transition-all duration-300 p-3 rounded-lg bg-gradient-to-r from-white/5 to-white/10 hover:from-pink-500/30 hover:to-rose-500/30 border border-white/10 hover:border-pink-400/60 hover:shadow-[0_0_20px_rgba(236,72,153,0.4)] transform hover:scale-[1.02] hover:translate-x-1 group/item animate-fade-in-up backdrop-blur-xl"
                        style={{ animationDelay: `${index * 0.04}s` }}
                      >
                        {/* Gradient overlay on hover */}
                        <div className="absolute inset-0 bg-gradient-to-r from-pink-500/0 via-rose-500/20 to-pink-500/0 opacity-0 group-hover/item:opacity-100 transition-opacity duration-300 rounded-lg"></div>
                        
                        <div className="relative z-10 flex items-center justify-between">
                          <span className="group-hover/item:drop-shadow-[0_0_6px_rgba(236,72,153,0.8)] transition-all duration-300 tracking-wide">{category}</span>
                          
                          {/* Arrow icon */}
                          <svg className="w-4 h-4 text-pink-400 opacity-0 group-hover/item:opacity-100 transform translate-x-0 group-hover/item:translate-x-0.5 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                        
                        {/* Sparkle on hover */}
                        <div className="absolute top-1.5 right-1.5 w-1 h-1 bg-pink-300 rounded-full opacity-0 group-hover/item:opacity-100 animate-ping"></div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <button
              className="relative text-slate-700 hover:text-pink-600 transition-all duration-300 font-semibold group animate-fade-in-down animate-delay-300"
              onClick={() => {
                window.location.href = '/products';
                setIsMenuOpen(false);
              }}
            >
              <span className="relative z-10 group-hover:drop-shadow-[0_0_8px_rgba(236,72,153,0.5)] transition-all duration-300">All Products</span>
              <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-gradient-to-r from-pink-500 via-rose-500 to-pink-500 transform scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-300 rounded-full shadow-lg shadow-pink-500/50"></span>
              <span className="absolute inset-0 bg-pink-100/30 blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></span>
            </button>
            {/* <Link to="/vlog" className="text-slate-700 hover:text-amber-600 transition-colors">
              Gallery
            </Link> */}
            <Link to="/about" className="relative text-slate-700 hover:text-pink-600 transition-all duration-300 font-semibold group animate-fade-in-down animate-delay-400">
              <span className="relative z-10 group-hover:drop-shadow-[0_0_8px_rgba(236,72,153,0.5)] transition-all duration-300">About Us</span>
              <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-gradient-to-r from-pink-500 via-rose-500 to-pink-500 transform scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-300 rounded-full shadow-lg shadow-pink-500/50"></span>
              <span className="absolute inset-0 bg-pink-100/30 blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></span>
            </Link>
            <Link to="/blog" className="relative text-slate-700 hover:text-pink-600 transition-all duration-300 font-semibold group animate-fade-in-down animate-delay-500">
              <span className="relative z-10 group-hover:drop-shadow-[0_0_8px_rgba(236,72,153,0.5)] transition-all duration-300">Blog</span>
              <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-gradient-to-r from-pink-500 via-rose-500 to-pink-500 transform scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-300 rounded-full shadow-lg shadow-pink-500/50"></span>
              <span className="absolute inset-0 bg-pink-100/30 blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></span>
            </Link>
          </nav>

          {/* Right side buttons */}
          <div className="flex items-center space-x-4">
            <ProfileDropdown />

            {/* Cart Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsCartOpen(true)}
              className="relative text-slate-700 hover:text-pink-600 transition-all duration-300 hover-scale group animate-fade-in-down animate-delay-600 hover:bg-pink-50/50 border border-transparent hover:border-pink-300/40"
              aria-label="Open shopping cart"
            >
              {/* Glow behind cart */}
              <div className="absolute inset-0 bg-pink-400/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
              <ShoppingCart className="h-5 w-5 relative z-10 group-hover:drop-shadow-[0_0_6px_rgba(236,72,153,0.6)] transition-all duration-300" />
              {getTotalItems() > 0 && (
                <span className="absolute -top-2 -right-2 bg-gradient-to-r from-pink-500 via-rose-500 to-pink-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center animate-pulse shadow-lg shadow-pink-500/50 border-2 border-white">
                  {getTotalItems()}
                </span>
              )}
            </Button>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden hover-scale group"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMenuOpen ? 
                <X className="h-5 w-5 group-hover:rotate-90 transition-transform duration-300" /> : 
                <Menu className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
              }
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t-2 border-pink-300/40 py-6 bg-gradient-to-b from-white via-pink-50/30 to-white backdrop-blur-xl animate-fade-in-down relative">
            {/* Top highlight */}
            <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-pink-500 via-rose-500 to-pink-500"></div>
            <div className="flex flex-col space-y-4">
              <Link
                to="/"
                className="relative text-slate-700 hover:text-pink-600 transition-all duration-300 font-semibold px-3 py-2 rounded-lg hover:bg-gradient-to-r hover:from-pink-100/60 hover:to-rose-100/60 animate-slide-in-left border border-transparent hover:border-pink-300/40 hover:shadow-md hover:shadow-pink-500/20 group"
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="group-hover:drop-shadow-[0_0_6px_rgba(236,72,153,0.4)]">Home</span>
                <div className="absolute top-1 right-2 w-1 h-1 bg-pink-400 rounded-full opacity-0 group-hover:opacity-100 animate-ping"></div>
              </Link>
              <div className="border-t-2 border-pink-300/30 pt-3 bg-gradient-to-b from-pink-50/50 to-transparent rounded-lg p-3">
                <div className="text-sm font-black text-transparent bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text mb-3 px-2 animate-slide-in-left animate-delay-100 uppercase tracking-wide drop-shadow-[0_0_6px_rgba(236,72,153,0.3)]">✨ Categories</div>
                <div className="grid grid-cols-1 gap-2">
                  {categories.map((category, index) => (
                    <button
                      key={category}
                      onClick={() => handleCategoryClick(category)}
                      className="relative text-left text-sm font-bold text-slate-800 hover:text-white transition-all duration-300 p-3 rounded-lg bg-gradient-to-r from-white/80 to-pink-50/80 hover:from-pink-500 hover:to-rose-500 border-2 border-pink-300/40 hover:border-pink-400 hover:shadow-[0_0_15px_rgba(236,72,153,0.4)] transform hover:scale-[1.02] hover:translate-x-1 animate-slide-in-left group backdrop-blur-sm"
                      style={{ animationDelay: `${(index + 2) * 0.06}s` }}
                    >
                      {/* Gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-r from-pink-500/0 via-rose-500/20 to-pink-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
                      
                      <div className="relative z-10 flex items-center justify-between">
                        <span className="group-hover:drop-shadow-[0_0_6px_rgba(255,255,255,0.8)] transition-all duration-300 tracking-wide">{category}</span>
                        
                        {/* Arrow icon */}
                        <svg className="w-4 h-4 text-pink-600 group-hover:text-white opacity-70 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-0.5 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                      
                      {/* Sparkle */}
                      <div className="absolute top-1.5 right-1.5 w-1 h-1 bg-pink-400 rounded-full opacity-0 group-hover:opacity-100 animate-ping"></div>
                    </button>
                  ))}
                </div>
              </div>
              <button
                className="relative text-slate-700 hover:text-pink-600 transition-all duration-300 font-semibold px-3 py-2 rounded-lg hover:bg-gradient-to-r hover:from-pink-100/60 hover:to-rose-100/60 animate-slide-in-left animate-delay-200 border border-transparent hover:border-pink-300/40 hover:shadow-md hover:shadow-pink-500/20 group"
                onClick={() => {
                  window.location.href = '/products';
                  setIsMenuOpen(false);
                }}
              >
                <span className="group-hover:drop-shadow-[0_0_6px_rgba(236,72,153,0.4)]">All Products</span>
                <div className="absolute top-1 right-2 w-1 h-1 bg-pink-400 rounded-full opacity-0 group-hover:opacity-100 animate-ping"></div>
              </button>
              <Link
                to="/about"
                className="relative text-slate-700 hover:text-pink-600 transition-all duration-300 font-semibold px-3 py-2 rounded-lg hover:bg-gradient-to-r hover:from-pink-100/60 hover:to-rose-100/60 animate-slide-in-left animate-delay-300 border border-transparent hover:border-pink-300/40 hover:shadow-md hover:shadow-pink-500/20 group"
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="group-hover:drop-shadow-[0_0_6px_rgba(236,72,153,0.4)]">About Us</span>
                <div className="absolute top-1 right-2 w-1 h-1 bg-pink-400 rounded-full opacity-0 group-hover:opacity-100 animate-ping"></div>
              </Link>
              <Link
                to="/blog"
                className="relative text-slate-700 hover:text-pink-600 transition-all duration-300 font-semibold px-3 py-2 rounded-lg hover:bg-gradient-to-r hover:from-pink-100/60 hover:to-rose-100/60 animate-slide-in-left animate-delay-400 border border-transparent hover:border-pink-300/40 hover:shadow-md hover:shadow-pink-500/20 group"
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="group-hover:drop-shadow-[0_0_6px_rgba(236,72,153,0.4)]">Blog</span>
                <div className="absolute top-1 right-2 w-1 h-1 bg-pink-400 rounded-full opacity-0 group-hover:opacity-100 animate-ping"></div>
              </Link>
              <div className="pt-4 border-t-2 border-pink-300/30">
                <div className="animate-slide-in-left animate-delay-500">
                  <ProfileDropdown />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </header>
  );
};

export default Header;
