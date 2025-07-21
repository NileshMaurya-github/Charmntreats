import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Package, MapPin, Heart, Truck, LogOut, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

const ProfileDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user, signOut, isAdmin } = useAuth();
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
    setIsOpen(false);
  };

  const handleMenuClick = () => {
    setIsOpen(false);
  };

  if (!user) {
    return (
      <Link to="/auth">
        <Button variant="outline" size="sm">
          <User className="h-4 w-4 mr-2" />
          Login
        </Button>
      </Link>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="bg-pink-100 text-pink-700 border-pink-300 hover:bg-pink-200 transition-colors"
      >
        <User className="h-4 w-4 mr-2" />
        Profile
        <ChevronDown className={`h-4 w-4 ml-1 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white/95 backdrop-blur-md border border-pink-200/50 rounded-lg shadow-xl z-50">
          <div className="p-2">
            {/* User Info */}
            <div className="px-3 py-2 border-b border-pink-100 mb-2">
              <p className="text-sm font-medium text-slate-900">
                {isAdmin ? 'Admin' : 'Welcome'}
              </p>
              <p className="text-xs text-slate-600 truncate">{user.email}</p>
            </div>

            {/* Admin Panel (only for admin users) */}
            {isAdmin && (
              <Link to="/admin" onClick={handleMenuClick}>
                <div className="flex items-center px-3 py-2 text-sm text-slate-700 hover:bg-pink-50 hover:text-pink-600 rounded-md transition-colors cursor-pointer">
                  <User className="h-4 w-4 mr-3" />
                  Admin Panel
                </div>
              </Link>
            )}

            {/* My Orders */}
            <Link to="/order-history" onClick={handleMenuClick}>
              <div className="flex items-center px-3 py-2 text-sm text-slate-700 hover:bg-pink-50 hover:text-pink-600 rounded-md transition-colors cursor-pointer">
                <Package className="h-4 w-4 mr-3" />
                My Orders
              </div>
            </Link>

            {/* My Address */}
            <Link to="/profile/address" onClick={handleMenuClick}>
              <div className="flex items-center px-3 py-2 text-sm text-slate-700 hover:bg-pink-50 hover:text-pink-600 rounded-md transition-colors cursor-pointer">
                <MapPin className="h-4 w-4 mr-3" />
                My Address
              </div>
            </Link>

            {/* Wishlist */}
            <Link to="/wishlist" onClick={handleMenuClick}>
              <div className="flex items-center px-3 py-2 text-sm text-slate-700 hover:bg-pink-50 hover:text-pink-600 rounded-md transition-colors cursor-pointer">
                <Heart className="h-4 w-4 mr-3" />
                Wishlist
              </div>
            </Link>

            {/* Track Order */}
            <Link to="/track-order" onClick={handleMenuClick}>
              <div className="flex items-center px-3 py-2 text-sm text-slate-700 hover:bg-pink-50 hover:text-pink-600 rounded-md transition-colors cursor-pointer">
                <Truck className="h-4 w-4 mr-3" />
                Track Order
              </div>
            </Link>

            {/* Divider */}
            <div className="border-t border-pink-100 my-2"></div>

            {/* Logout */}
            <button
              onClick={handleSignOut}
              className="flex items-center w-full px-3 py-2 text-sm text-slate-700 hover:bg-pink-50 hover:text-pink-600 rounded-md transition-colors"
            >
              <LogOut className="h-4 w-4 mr-3" />
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;