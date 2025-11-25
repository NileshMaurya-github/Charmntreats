import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Menu, X, Search, Heart, Sparkles, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/hooks/useAuth';
import CartSidebar from './CartSidebar';
import ProfileDropdown from './ProfileDropdown';
import { PRODUCTS_DATABASE } from '@/services/productService';
import { ChevronDown } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const { getTotalItems } = useCart();
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  const getCategoryCount = (category: string) => {
    if (category === 'Others') return 0; // Or calculate if you have 'Others' category in DB
    return PRODUCTS_DATABASE.filter(p => p.category === category).length;
  };

  const handleCategoryClick = (category: string) => {
    window.location.href = `/products?category=${encodeURIComponent(category)}`;
    setIsMenuOpen(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
      setIsMenuOpen(false);
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'py-4' : 'py-6'
          }`}
      >
        <div className="container mx-auto px-4">
          <div
            className={`relative rounded-full border border-slate-200 backdrop-blur-2xl transition-all duration-500 ${scrolled
              ? 'bg-white/90 shadow-lg shadow-slate-200/50 px-6 py-3'
              : 'bg-white/70 px-8 py-5 shadow-2xl shadow-pink-100/50'
              }`}
          >
            {/* Glow Effect */}
            <div className={`absolute inset-0 rounded-full bg-gradient-to-r from-pink-100/50 via-purple-100/50 to-pink-100/50 blur-xl -z-10 transition-opacity duration-500 ${scrolled ? 'opacity-0' : 'opacity-100'}`}></div>

            <div className="flex items-center justify-between">
              {/* Logo */}
              <Link to="/" className="flex items-center gap-2 group">
                <div className="relative w-8 h-8 md:w-10 md:h-10 flex items-center justify-center bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl shadow-lg shadow-pink-200 group-hover:scale-110 transition-transform duration-300">
                  <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-white fill-white animate-pulse" />
                </div>
                <span className="text-xl md:text-2xl font-black tracking-tight text-slate-900 group-hover:text-pink-600 transition-colors">
                  Charmntreats
                </span>
              </Link>

              {/* Desktop Navigation */}
              <nav className="hidden lg:flex items-center gap-8">
                <Link to="/" className="text-sm font-bold text-slate-800 hover:text-pink-600 hover:bg-pink-50 px-4 py-2 rounded-full transition-all duration-300">
                  Home
                </Link>

                <div className="relative group">
                  <button className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold text-slate-800 bg-white border border-slate-200 hover:border-pink-300 hover:text-pink-600 hover:shadow-lg hover:shadow-pink-100 transition-all duration-300 group-hover:bg-pink-50">
                    Categories
                    <ChevronDown className="w-4 h-4 group-hover:rotate-180 transition-transform duration-300 text-pink-500" />
                  </button>

                  {/* Dropdown Menu */}
                  <div className="absolute top-full left-0 mt-4 w-[500px] bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-slate-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-4 group-hover:translate-y-0 overflow-hidden p-6 z-50">
                    <div className="grid grid-cols-2 gap-4">
                      {categories.map((category) => (
                        <button
                          key={category}
                          onClick={() => handleCategoryClick(category)}
                          className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-pink-50 group/item transition-all duration-200 border border-transparent hover:border-pink-100"
                        >
                          <span className="text-slate-700 font-bold group-hover/item:text-pink-600 transition-colors">
                            {category}
                          </span>
                          <span className="bg-slate-100 text-slate-600 text-xs font-bold px-2.5 py-1 rounded-full group-hover/item:bg-pink-200 group-hover/item:text-pink-700 transition-colors">
                            {getCategoryCount(category)}
                          </span>
                        </button>
                      ))}
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-100 text-center">
                      <Link to="/products" className="text-sm font-bold text-pink-600 hover:text-pink-700 hover:underline">
                        View All Products
                      </Link>
                    </div>
                  </div>
                </div>

                <Link to="/products" className="text-sm font-bold text-slate-800 hover:text-pink-600 hover:bg-pink-50 px-4 py-2 rounded-full transition-all duration-300">
                  Shop
                </Link>

                <Link to="/about" className="text-sm font-bold text-slate-800 hover:text-pink-600 hover:bg-pink-50 px-4 py-2 rounded-full transition-all duration-300">
                  About
                </Link>
              </nav>

              {/* Right Side Actions */}
              <div className="flex items-center gap-2 md:gap-4">
                {/* Search Bar - Desktop */}
                <form onSubmit={handleSearch} className="hidden md:block relative group">
                  <input
                    type="text"
                    placeholder="Search..."
                    className="w-40 focus:w-64 pl-10 pr-4 py-2 rounded-full border border-slate-200 focus:outline-none focus:border-pink-300 bg-slate-50 text-slate-900 placeholder:text-slate-500 transition-all duration-300 text-sm focus:bg-white focus:shadow-md"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 group-hover:text-pink-500 transition-colors w-4 h-4" />
                </form>

                <div className="flex items-center gap-1 md:gap-2">
                  {isAdmin && (
                    <Link to="/admin/dashboard" className="hidden md:block">
                      <Button variant="ghost" size="sm" className="text-slate-800 hover:text-pink-600 hover:bg-pink-50 font-bold rounded-full">
                        Admin
                      </Button>
                    </Link>
                  )}

                  <div className="hidden md:block">
                    <ProfileDropdown />
                  </div>

                  <Link to="/wishlist" className="hidden md:block">
                    <Button variant="ghost" size="icon" className="text-slate-800 hover:text-pink-600 hover:bg-pink-50 rounded-full transition-all duration-300 hover:scale-110">
                      <Heart className="h-5 w-5" />
                    </Button>
                  </Link>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsCartOpen(true)}
                    className="relative text-slate-800 hover:text-pink-600 hover:bg-pink-50 rounded-full transition-all duration-300 hover:scale-110 overflow-visible"
                  >
                    <ShoppingCart className="h-5 w-5" />
                    {getTotalItems() > 0 && (
                      <span className="absolute -top-1 -right-1 bg-gradient-to-r from-pink-500 to-purple-600 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white shadow-lg animate-pulse">
                        {getTotalItems()}
                      </span>
                    )}
                  </Button>

                  {/* Mobile Menu Button */}
                  <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="lg:hidden p-2 text-slate-800 hover:text-pink-600 transition-colors rounded-full hover:bg-pink-50"
                  >
                    {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-40 bg-white/95 backdrop-blur-3xl animate-fade-in pt-32 px-6">
            <div className="flex flex-col gap-6">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  placeholder="Search treasures..."
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 focus:outline-none focus:border-pink-300 bg-slate-50 text-slate-900 placeholder:text-slate-500 text-lg shadow-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-500 w-6 h-6" />
              </form>

              <div className="space-y-4">
                <Link
                  to="/"
                  className="block text-2xl font-bold text-slate-900 hover:text-pink-600 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </Link>
                <Link
                  to="/products"
                  className="block text-2xl font-bold text-slate-900 hover:text-pink-600 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Shop All
                </Link>
                <Link
                  to="/wishlist"
                  className="block text-2xl font-bold text-slate-900 hover:text-pink-600 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Wishlist
                </Link>
                <Link
                  to="/auth"
                  className="block text-2xl font-bold text-slate-900 hover:text-pink-600 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  My Account
                </Link>
              </div>

              <div className="pt-6 border-t border-slate-100">
                <div className="text-sm font-bold text-slate-600 uppercase tracking-wider mb-4">Categories</div>
                <div className="grid grid-cols-2 gap-3">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => handleCategoryClick(category)}
                      className="text-left px-4 py-3 rounded-xl bg-slate-50 text-slate-800 hover:bg-pink-50 hover:text-pink-600 transition-all font-medium text-sm"
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      </header>

      {/* Spacer for fixed header */}
      <div className="h-24 md:h-32"></div>
    </>
  );
};

export default Header;
