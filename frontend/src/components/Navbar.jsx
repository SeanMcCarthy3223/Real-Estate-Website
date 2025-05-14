import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  LogOut,
  Menu,
  X,
  Home,
  Building2,
  Info,
  Mail,
  Sparkles, // Assuming Sparkles was for AI Hub or similar
  Brain,    // Assuming Brain was for AI Hub
  Bot,      // Assuming Bot was for AI Hub
  User,     // Added User icon for Account
} from "lucide-react";
import logo from "../assets/home-regular-24.png"; // Assuming logo path is correct
import { useAuth } from "../context/AuthContext";
import PropTypes from "prop-types";

// Helper function to get initials
const getInitials = (name) => {
    if (!name) return "U";
  const names = name.split(" ");
  if (names.length === 1) return names[0][0].toUpperCase();
  return (names[0][0] + names[names.length - 1][0]).toUpperCase();
  };

const NavLinks = ({ currentPath }) => {
  const navLinksList = [
    { name: "Home", path: "/", icon: Home },
    { name: "Properties", path: "/properties", icon: Building2 },
    { name: "About Us", path: "/about", icon: Info },
    { name: "Contact", path: "/contact", icon: Mail },
  ];

  const [sparkleKey, setSparkleKey] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSparkleKey(prevKey => prevKey + 1);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {navLinksList.map(({ name, path, icon: Icon }) => {
        const isActive =
          path === "/" ? currentPath === path : currentPath.startsWith(path);
        return (
          <Link
            key={name}
            to={path}
            className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-colors
              ${
                isActive
                  ? "text-blue-600"
                  : "text-gray-700 hover:text-blue-600"
              }
            `}
          >
            <div className="flex items-center space-x-2">
              <Icon className={`w-4 h-4 ${isActive ? "text-blue-600" : "text-gray-500"}`} />
            <span>{name}</span>
            </div>
            {isActive && (
          <motion.div
                layoutId={`active-nav-link-desktop-${name}`}
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
            )}
          </Link>
        );
      })}
      <Link
            to="/ai-property-hub"
        className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-colors group
                ${
            currentPath.startsWith("/ai-property-hub")
              ? "text-blue-600"
              : "text-gray-700 hover:text-blue-600"
                }
              `}
            >
        <div className="flex items-center space-x-2">
          <motion.div
            key={sparkleKey}
            initial={{ scale: 0.8, opacity: 0.7 }}
            animate={{ scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 0.8, repeat: Infinity, repeatDelay: 1.2, ease: "easeInOut" }}
          >
            <Brain className={`w-4 h-4 ${currentPath.startsWith("/ai-property-hub") ? "text-blue-600" : "text-gray-500 group-hover:text-blue-500"}`} />
            </motion.div>
          <span>AI Property Hub</span>
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded-full animate-pulse">
            NEW
          </span>
          </div>
        {currentPath.startsWith("/ai-property-hub") && (
          <motion.div
            layoutId="active-nav-link-desktop-ai"
            className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        )}
      </Link>
    </>
  );
};

NavLinks.propTypes = {
  currentPath: PropTypes.string.isRequired,
};

const MobileNavLinks = ({ setMobileMenuOpen, isLoggedIn, user, handleLogout, currentPath }) => {
  const navLinksList = [
    { name: "Home", path: "/", icon: Home },
    { name: "Properties", path: "/properties", icon: Building2 },
    { name: "About Us", path: "/about", icon: Info },
    { name: "Contact", path: "/contact", icon: Mail },
  ];

  return (
    <div className="px-2 pt-2 pb-3 space-y-1">
      {navLinksList.map(({ name, path, icon: Icon }) => {
        const isActive =
          path === "/" ? currentPath === path : currentPath.startsWith(path);
        return (
          <motion.div key={name} whileTap={{ scale: 0.97 }}>
            <Link
              to={path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                ${
                  isActive
                    ? "bg-blue-50 text-blue-600 font-medium"
                    : "text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                }
              `}
              onClick={() => setMobileMenuOpen(false)}
            >
              <Icon className="w-5 h-5" />
              {name}
            </Link>
          </motion.div>
        );
      })}
      <motion.div whileTap={{ scale: 0.97 }}>
        <Link
          to="/ai-property-hub"
          className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors group
            ${
              currentPath.startsWith("/ai-property-hub")
                ? "bg-blue-50 text-blue-600 font-medium"
                : "text-gray-700 hover:bg-gray-50 hover:text-blue-600"
            }
          `}
          onClick={() => setMobileMenuOpen(false)}
        >
          <Bot className="w-5 h-5" />
          <div className="flex-1">
            AI Property Hub
            <span className="ml-2 inline-block bg-red-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full animate-pulse">NEW</span>
            <p className="text-xs text-gray-500 group-hover:text-blue-500 transition-colors">Smart property recommendations</p>
          </div>
        </Link>
      </motion.div>

      {/* Auth Section for Mobile */}
      <div className="pt-4 mt-2 border-t border-gray-100">
        {isLoggedIn ? (
          <div className="space-y-3 px-3">
            <div className="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center text-white font-medium text-sm shadow-sm">
                {getInitials(user?.name)}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  {user?.name}
                </p>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
              </div>
            </div>
            <motion.div whileTap={{ scale: 0.97 }}>
              <Link
                to="/account"
                onClick={() => setIsDropdownOpen(false)}
                className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
              >
                <User className="w-5 h-5" />
                <span className="font-medium">Account</span>
              </Link>
            </motion.div>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                handleLogout();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Sign out</span>
            </motion.button>
          </div>
        ) : (
          <div className="flex flex-col space-y-3 px-3">
            <motion.div whileTap={{ scale: 0.97 }}>
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center px-4 py-3 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all font-medium"
              >
                Sign in
              </Link>
            </motion.div>
            <motion.div whileTap={{ scale: 0.97 }}>
              <Link
                to="/signup"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all font-medium shadow-md shadow-blue-500/20"
              >
                Create account
              </Link>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

MobileNavLinks.propTypes = {
  setMobileMenuOpen: PropTypes.func.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  user: PropTypes.object,
  handleLogout: PropTypes.func.isRequired,
  currentPath: PropTypes.string.isRequired,
};

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef(null);
  const { isLoggedIn, user, logout } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
  };

  return (
    <motion.nav
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 shadow-md backdrop-blur-lg"
          : "bg-white/80 backdrop-blur-md border-b border-gray-200"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-3 group">
            <motion.div
              whileHover={{ rotate: [0, -10, 10, -10, 0] }}
              transition={{ duration: 0.5 }}
              className="p-2 rounded-lg"
            >
              <img src={logo} alt="BuildEstate logo" className="w-6 h-6" />
            </motion.div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent group-hover:from-indigo-600 group-hover:to-blue-600 transition-all duration-300">
              BuildEstate
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-1">
            <NavLinks currentPath={location.pathname} />
          </div>

          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <div className="relative hidden md:flex" ref={dropdownRef}>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={toggleDropdown}
                  className="flex items-center space-x-3 focus:outline-none"
                  aria-label="User menu"
                  aria-expanded={isDropdownOpen}
                >
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center text-white font-medium text-sm shadow-md hover:shadow-lg transition-shadow">
                      {getInitials(user?.name)}
                    </div>
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></div>
                  </div>
                  <motion.div
                    animate={{ rotate: isDropdownOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDown className="w-4 h-4 text-gray-600" />
                  </motion.div>
                </motion.button>
                <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-12 w-64 bg-white rounded-xl shadow-lg py-2 border border-gray-100 overflow-hidden"
                    >
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-900">
                          {user?.name}
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          {user?.email}
                        </p>
                      </div>
                      <Link
                        to="/account"
                        onClick={() => setIsDropdownOpen(false)}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 flex items-center space-x-2 transition-colors"
                      >
                        <User className="w-4 h-4" />
                        <span>Account</span>
                      </Link>
                      <motion.button
                        whileHover={{ x: 2 }} // Subtle hover effect
                        onClick={handleLogout}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 flex items-center space-x-2 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign out</span>
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                >
                  Sign in
                </Link>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to="/signup"
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg font-medium"
                  >
                    Get started
                  </Link>
                </motion.div>
              </div>
            )}
            {/* Mobile menu button - always visible for toggling */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={toggleMobileMenu}
              className="md:hidden rounded-lg p-2 hover:bg-gray-100 transition-colors focus:outline-none"
              aria-label="Toggle menu"
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 text-gray-700" />
              ) : (
                <Menu className="w-6 h-6 text-gray-700" />
              )}
            </motion.button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="md:hidden bg-white border-t border-gray-100 shadow-lg overflow-y-auto max-h-[calc(100vh-4rem)]"
          >
            <MobileNavLinks
              setMobileMenuOpen={setIsMobileMenuOpen}
              isLoggedIn={isLoggedIn}
              user={user}
              handleLogout={handleLogout}
              currentPath={location.pathname}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
