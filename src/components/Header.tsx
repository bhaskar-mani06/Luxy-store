import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, Search, Menu, X, ChevronDown, User, LogOut } from 'lucide-react';
import CategoryDropdown from './CategoryDropdown';
import SearchBar from './SearchBar';
import { categories } from '../data/categories';
import { supabase, adminSupabase } from '../lib/supabase';
import { toast } from 'react-hot-toast';
import { useCart } from '../context/CartContext';

const Header: React.FC = () => {
  const { totalItems, isLoading, clearCart } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setShowCategoryDropdown(false);
    setIsSearchOpen(false);
  }, [location]);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        
        if (session?.user) {
          setUser(session.user);
          setIsLoggedIn(true);
        } else {
          setUser(null);
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error('Error checking session:', error);
        setUser(null);
        setIsLoggedIn(false);
      }
    };

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event);
      
      if (event === 'SIGNED_IN') {
        setUser(session?.user || null);
        setIsLoggedIn(true);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setIsLoggedIn(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    try {
      // Force sign out from both Supabase clients
      await Promise.all([
        supabase.auth.signOut({ scope: 'global' }),
        adminSupabase.auth.signOut({ scope: 'global' })
      ]);
      
      // Clear all local storage except cart items
      for (let key of Object.keys(localStorage)) {
        if ((key.startsWith('sb-') || key.includes('supabase') || key.includes('luxy-store')) && !key.includes('cart')) {
          localStorage.removeItem(key);
        }
      }
      
      // Reset all states
      setUser(null);
      setIsLoggedIn(false);
      setShowUserDropdown(false);
      
      // Clear session cookies if any
      document.cookie.split(";").forEach((c) => {
        document.cookie = c
          .replace(/^ +/, "")
          .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
      });
      
      // Show success message
      toast.success('Logged out successfully');
      
      // Force reload and redirect to home
      window.location.href = '/';
    } catch (error: any) {
      console.error('Logout error:', error);
      
      // Even if there's an error, clear everything except cart
      setUser(null);
      setIsLoggedIn(false);
      setShowUserDropdown(false);
      
      // Clear all storage except cart items
      for (let key of Object.keys(localStorage)) {
        if ((key.startsWith('sb-') || key.includes('supabase') || key.includes('luxy-store')) && !key.includes('cart')) {
          localStorage.removeItem(key);
        }
      }
      
      // Force reload and redirect
      window.location.href = '/';
    }
  };

  const handleCategoryClick = () => {
    setShowCategoryDropdown(!showCategoryDropdown);
  };

  const handleUserClick = () => {
    setShowUserDropdown(!showUserDropdown);
  };

  const handleClickOutside = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (!target.closest('.category-dropdown') && !target.closest('.category-link')) {
      setShowCategoryDropdown(false);
    }
    if (!target.closest('.user-dropdown') && !target.closest('.user-link')) {
      setShowUserDropdown(false);
    }
  };

  return (
    <header
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-md'
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold text-gold-500 hover:text-gold-600 transition-colors">
              Luxy Store
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="nav-link">
              Home
            </Link>
            <div className="relative category-link">
              <button
                onClick={handleCategoryClick}
                className="nav-link flex items-center"
              >
                Categories
                <ChevronDown className="ml-1 w-4 h-4" />
              </button>
              {showCategoryDropdown && <div className="category-dropdown"><CategoryDropdown /></div>}
            </div>
            <Link to="/products" className="nav-link">
              All Products
            </Link>
            <Link to="/about" className="nav-link">
              About
            </Link>
            <Link to="/contact" className="nav-link">
              Contact
            </Link>
          </nav>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-6">
            <SearchBar />
            <Link to="/cart" className="relative">
              <ShoppingCart className="h-6 w-6 text-gray-600 hover:text-gray-900" />
              {isLoading ? (
                <div className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-gray-200 animate-pulse" />
              ) : totalItems > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 flex items-center justify-center text-xs text-white">
                  {totalItems}
                </span>
              )}
            </Link>
            <div className="relative">
              <button
                onClick={handleUserClick}
                className="nav-link"
                aria-label="User menu"
              >
                <User className="w-5 h-5" />
              </button>
              {showUserDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-2 z-50 user-dropdown">
                  {isLoggedIn ? (
                    <>
                      <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                        <div className="text-sm font-medium text-gold-600">
                          Hello, {user?.user_metadata?.name || 'User'}
                        </div>
                      </div>
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        Profile
                      </Link>
                      <Link
                        to="/orders"
                        className="block px-4 py-2 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        Orders
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <Link
                      to="/auth"
                      className="block px-4 py-2 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Login / Register
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden nav-link"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4">
            <nav className="flex flex-col space-y-4">
              <Link
                to="/"
                className="nav-link"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <div className="relative">
                <button
                  onClick={handleCategoryClick}
                  className="nav-link flex items-center w-full justify-between"
                >
                  Categories
                  <ChevronDown className="w-4 h-4" />
                </button>
                {showCategoryDropdown && (
                  <div className="pl-4 mt-2">
                    <CategoryDropdown />
                  </div>
                )}
              </div>
              <Link
                to="/products"
                className="nav-link"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                All Products
              </Link>
              <Link
                to="/about"
                className="nav-link"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About
              </Link>
              <Link
                to="/contact"
                className="nav-link"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Contact
              </Link>
            </nav>
          </div>
        )}

        {/* Search Bar */}
        {isSearchOpen && <SearchBar onClose={() => setIsSearchOpen(false)} />}
      </div>
    </header>
  );
};

export default Header;