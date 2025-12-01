import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../Pages/AuthContext';
import { useTheme } from './ThemeContext';
import { LogOut, Menu, X, ChevronDown, Sun, Moon, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme, language, changeLanguage } = useTheme();
  const { t, i18n } = useTranslation();

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false); // Close mobile menu after clicking
  };
  const navigate = useNavigate();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(prevState => !prevState);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMobileMenuOpen(false);
  };
  

  const handleLanguageChange = (newLang) => {
    changeLanguage(newLang);
    i18n.changeLanguage(newLang);
    setIsLanguageMenuOpen(false);
  };

  return (
    <nav className="fixed w-full top-0 left-0 z-50 bg-background/95 backdrop-blur-md border-b border-border shadow-sm dark:bg-gray-900/95 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 lg:h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              
              <div className='flex items-center justify-center gap-4'>
              <img src="/images/Untitled design (1).png" alt="Tasky.dev
" className='flex items-center justify-center w-12 h-12 rounded-lg' />

<span className='text-blue-700 text-2xl'>                 Tasky.dev             
</span>

              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            <Link
              to="/"
              className="text-foreground hover:text-primary px-3 py-2 text-sm font-medium transition-colors duration-200 dark:text-gray-300 dark:hover:text-white"
            >
              Home
            </Link>
            <button
              onClick={() => scrollToSection('features')}
              className="text-foreground hover:text-primary px-3 py-2 text-sm font-medium transition-colors duration-200 dark:text-gray-300 dark:hover:text-white"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection('about')}
              className="text-foreground hover:text-primary px-3 py-2 text-sm font-medium transition-colors duration-200 dark:text-gray-300 dark:hover:text-white"
            >
              About
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="text-muted-foreground hover:text-yellow-300 px-3 py-2 text-sm font-semibold transition-colors duration-300 dark:text-gray-400 dark:hover:text-yellow-300"
            >
              Contact
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 text-muted-foreground hover:text-yellow-300 rounded-lg hover:bg-yellow-900/30 transition-all duration-300 dark:text-gray-400 dark:hover:text-yellow-300 dark:hover:bg-yellow-900/30"
              title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>

            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setIsLanguageMenuOpen(!isLanguageMenuOpen)}
                className="flex items-center gap-2 p-2 text-muted-foreground hover:text-yellow-300 rounded-lg hover:bg-yellow-900/30 transition-all duration-300 dark:text-gray-400 dark:hover:text-yellow-300 dark:hover:bg-yellow-900/30"
                title="Change language"
              >
                <Globe size={20} />
                <span className="text-sm font-semibold">{language.toUpperCase()}</span>
                <ChevronDown size={16} className={`transition-transform duration-200 ${isLanguageMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {isLanguageMenuOpen && (
                <div className="absolute right-0 mt-2 w-32 bg-yellow-900/80 border border-yellow-600 rounded-lg shadow-lg py-1 z-50 dark:bg-yellow-900/80 dark:border-yellow-600">
                  <button
                    onClick={() => handleLanguageChange('en')}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-yellow-800 transition-colors duration-200 ${
                      language === 'en' ? 'text-yellow-400 bg-yellow-800' : 'text-yellow-300'
                    }`}
                  >
                    English
                  </button>
                  <button
                    onClick={() => handleLanguageChange('fr')}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-yellow-800 transition-colors duration-200 ${
                      language === 'fr' ? 'text-yellow-400 bg-yellow-800' : 'text-yellow-300'
                    }`}
                  >
                    Français
                  </button>
                </div>
              )}
            </div>

            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="text-foreground hover:text-yellow-300 px-3 py-2 text-sm font-semibold transition-colors duration-300 dark:text-gray-300 dark:hover:text-yellow-300"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-red-400 hover:text-red-300 hover:bg-red-900/70 rounded-lg transition-all duration-300 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/70"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-semibold text-yellow-300 hover:text-white hover:bg-yellow-600 rounded-lg transition-all duration-300 dark:text-yellow-300 dark:hover:text-white dark:hover:bg-yellow-600"
                >
                  Sign Up
                </Link>
                <Link
                  to="/login"
                  className="px-6 py-2 text-sm font-semibold text-yellow-300 bg-yellow-900 hover:bg-yellow-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 dark:text-yellow-300 dark:bg-yellow-900 dark:hover:bg-yellow-800"
                >
                  Sign In
                </Link>
              </>
            )}
          </div>

          {/* Mobile Controls */}
          <div className="lg:hidden flex items-center space-x-2">
            {/* Theme Toggle Mobile */}
            <button
              onClick={toggleTheme}
              className="p-2 text-muted-foreground hover:text-yellow-300 rounded-lg hover:bg-yellow-900/30 transition-all duration-300 dark:text-gray-400 dark:hover:text-yellow-300 dark:hover:bg-yellow-900/30"
              title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>

            {/* Language Selector Mobile */}
            <div className="relative">
              <button
                onClick={() => setIsLanguageMenuOpen(!isLanguageMenuOpen)}
                className="flex items-center gap-1 p-2 text-muted-foreground hover:text-yellow-300 rounded-lg hover:bg-yellow-900/30 transition-all duration-300 dark:text-gray-400 dark:hover:text-yellow-300 dark:hover:bg-yellow-900/30"
                title="Change language"
              >
                <Globe size={18} />
                <span className="text-xs font-semibold">{language.toUpperCase()}</span>
              </button>

              {isLanguageMenuOpen && (
                <div className="absolute right-0 mt-2 w-28 bg-yellow-900/80 border border-yellow-600 rounded-lg shadow-lg py-1 z-50 dark:bg-yellow-900/80 dark:border-yellow-600">
                  <button
                    onClick={() => handleLanguageChange('en')}
                    className={`w-full text-left px-3 py-2 text-sm hover:bg-yellow-800 transition-colors duration-200 ${
                      language === 'en' ? 'text-yellow-400 bg-yellow-800' : 'text-yellow-300'
                    }`}
                  >
                    EN
                  </button>
                  <button
                    onClick={() => handleLanguageChange('fr')}
                    className={`w-full text-left px-3 py-2 text-sm hover:bg-yellow-800 transition-colors duration-200 ${
                      language === 'fr' ? 'text-yellow-400 bg-yellow-800' : 'text-yellow-300'
                    }`}
                  >
                    FR
                  </button>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-muted-foreground hover:text-yellow-300 hover:bg-yellow-900/30 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-yellow-600 transition-colors duration-300 dark:text-gray-400 dark:hover:text-yellow-300 dark:hover:bg-yellow-900/30 dark:focus:ring-yellow-600"
              aria-expanded="false"
            >
              {isMobileMenuOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className={`lg:hidden ${isMobileMenuOpen ? 'block' : 'hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 bg-background border-t border-border shadow-lg dark:bg-gray-900 dark:border-gray-800">
          <Link
            to="/"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block px-3 py-2 text-base font-medium text-foreground hover:text-primary hover:bg-muted rounded-md transition-colors duration-200 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800"
          >
            Home
          </Link>
          <button
            onClick={() => scrollToSection('features')}
            className="block w-full text-left px-3 py-2 text-base font-medium text-foreground hover:text-primary hover:bg-muted rounded-md transition-colors duration-200 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800"
          >
            Features
          </button>
          <button
            onClick={() => scrollToSection('about')}
            className="block w-full text-left px-3 py-2 text-base font-medium text-foreground hover:text-primary hover:bg-muted rounded-md transition-colors duration-200 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800"
          >
            About
          </button>
          <button
            onClick={() => scrollToSection('contact')}
            className="block w-full text-left px-3 py-2 text-base font-medium text-foreground hover:text-primary hover:bg-muted rounded-md transition-colors duration-200 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800"
          >
            Contact
          </button>

          {isAuthenticated ? (
            <>
              <Link
                to="/dashboard"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-2 text-base font-medium text-foreground hover:text-primary hover:bg-muted rounded-md transition-colors duration-200 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800"
              >
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 w-full px-3 py-2 text-base font-medium text-red-400 hover:text-red-300 hover:bg-red-900/50 rounded-md transition-colors duration-200 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/50"
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link
                to="/register"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-2 text-base font-medium text-foreground hover:text-primary hover:bg-muted rounded-md transition-colors duration-200 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800"
              >
                Sign Up
              </Link>
              <Link
                to="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-2 text-base font-medium text-primary bg-muted hover:bg-muted/80 rounded-md shadow-md transition-all duration-200 text-center dark:text-white dark:bg-gray-700 dark:hover:bg-gray-600"
              >
                Sign In
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;