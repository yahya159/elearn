import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/slices/authSlice';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <nav className="glass-effect fixed w-full top-0 z-50 border-b border-white/20">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <span className="text-3xl transform group-hover:rotate-12 transition-transform duration-300">🎓</span>
            <span className="text-2xl font-bold gradient-text group-hover:scale-105 transition-transform duration-300">
              E-Learning
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/courses" className="btn-secondary">
              Courses
            </Link>

            {user ? (
              <>
                <Link to="/dashboard" className="btn-secondary">
                  Dashboard
                </Link>

                {/* Profile Dropdown */}
                <div className="relative group">
                  <button className="btn-secondary flex items-center space-x-2">
                    <span className="text-lg">👤</span>
                    <span>{user.name}</span>
                    <span className="transform group-hover:rotate-180 transition-transform duration-300">▼</span>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 glass-effect rounded-xl shadow-xl hidden group-hover:block transform transition-all duration-300 origin-top">
                    <Link to="/profile" className="block px-4 py-3 text-sm text-gray-700 hover:bg-purple-50 rounded-t-xl transition-colors duration-300">
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 rounded-b-xl transition-colors duration-300"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-secondary">
                  Login
                </Link>
                <Link to="/register" className="btn-primary">
                  Get Started
                </Link>
                <Link to="/admin" className="btn-secondary">
                  Admin Login
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-2xl focus:outline-none hover:scale-110 transition-transform"
          >
            {isMenuOpen ? '✕' : '☰'}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 glass-effect rounded-xl shadow-xl animate-slide-down">
            <div className="px-4 py-2 space-y-2">
              <Link to="/courses" className="block px-4 py-2 rounded-lg hover:bg-white/10 transition-colors">
                Courses
              </Link>
              {user ? (
                <>
                  <Link to="/dashboard" className="block px-4 py-2 rounded-lg hover:bg-white/10 transition-colors">
                    Dashboard
                  </Link>
                  <Link to="/profile" className="block px-4 py-2 rounded-lg hover:bg-white/10 transition-colors">
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="block px-4 py-2 rounded-lg hover:bg-white/10 transition-colors">
                    Login
                  </Link>
                  <Link to="/register" className="block px-4 py-2 rounded-lg hover:bg-white/10 transition-colors">
                    Get Started
                  </Link>
                  <Link to="/admin" className="block px-4 py-2 rounded-lg hover:bg-white/10 transition-colors">
                    Admin Login
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
