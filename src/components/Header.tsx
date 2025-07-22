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
    <header className="bg-white/90 backdrop-blur-md shadow-lg border-b border-pink-200/50 sticky top-0 z-50 transition-all duration-300">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="text-2xl font-bold text-pink-600 hover:text-pink-700 transition-colors">Charmntreats</div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-slate-700 hover:text-pink-600 transition-colors">
              Home
            </Link>
            <div className="relative group">
              <button className="text-slate-700 hover:text-pink-600 transition-colors">
                Categories
              </button>
              <div className="absolute top-full left-0 mt-2 w-64 bg-white/95 backdrop-blur-md border border-pink-200/50 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                <div className="p-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => handleCategoryClick(category)}
                      className="block w-full text-left px-3 py-2 text-slate-700 hover:bg-pink-50 hover:text-pink-600 rounded-md transition-colors"
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <button
              className="text-slate-700 hover:text-pink-600 transition-colors"
              onClick={() => {
                window.location.href = '/products';
                setIsMenuOpen(false);
              }}
            >
              All Products
            </button>
            {/* <Link to="/vlog" className="text-slate-700 hover:text-amber-600 transition-colors">
              Gallery
            </Link> */}
            <Link to="/about" className="text-slate-700 hover:text-pink-600 transition-colors">
              About Us
            </Link>
            <Link to="/blog" className="text-slate-700 hover:text-pink-600 transition-colors">
              Blog
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
              className="relative text-slate-700 hover:text-pink-600 transition-colors"
              aria-label="Open shopping cart"
            >
              <ShoppingCart className="h-5 w-5" />
              {getTotalItems() > 0 && (
                <span className="absolute -top-2 -right-2 bg-pink-600 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center animate-pulse">
                  {getTotalItems()}
                </span>
              )}
            </Button>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-slate-200 py-4">
            <div className="flex flex-col space-y-3">
              <Link
                to="/"
                className="text-slate-700 hover:text-pink-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <div className="border-t border-slate-200 pt-3">
                <div className="text-sm font-medium text-slate-900 mb-2">Categories</div>
                <div className="grid grid-cols-2 gap-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => handleCategoryClick(category)}
                      className="text-left text-sm text-slate-600 hover:text-pink-600 transition-colors p-2"
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
              <button
                className="text-slate-700 hover:text-pink-600 transition-colors"
                onClick={() => {
                  window.location.href = '/products';
                  setIsMenuOpen(false);
                }}
              >
                All Products
              </button>
              {/* <Link
                to="/vlog"
                className="text-slate-700 hover:text-amber-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Gallery
              </Link> */}
              <Link
                to="/about"
                className="text-slate-700 hover:text-amber-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                About Us
              </Link>
              <Link
                to="/blog"
                className="text-slate-700 hover:text-amber-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Blog
              </Link>
              <div className="pt-3 border-t border-slate-200">
                <ProfileDropdown />
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
