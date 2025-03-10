import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../Pages/AuthContext';
import { LogOut } from 'lucide-react';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(prevState => !prevState);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="flex justify-between items-center h-16 3xl:h-32 bg-white text-black shadow-sm fixed w-full top-0 left-0 z-10 px-4 xl:px-[12rem] sm:w-[]">
      <div>
        <img src="/images/Preview.png" alt="logo" className="w-20 h-14 rounded-md" />
      </div>

      <div className="block xl:hidden" onClick={toggleMobileMenu}>
        <button className="text-2xl focus:outline-none">
          {isMobileMenuOpen ? '✖️' : '☰'}
        </button>
      </div>

      <ul
        className={`${
          isMobileMenuOpen ? 'flex' : 'hidden'
        } absolute xl:static top-16 left-0 w-full xl:w-auto bg-white shadow-md xl:shadow-none xl:flex-row p-4 xl:p-0 sm:flex-col xl:flex gap-5 sm:gap-4 sm:text-center xl:text-left sm:items-center`}
      >
        <Link
          to="/"
          onClick={() => setIsMobileMenuOpen(false)}
          className="hover:text-gray-600 3xl:text-3xl"
        >
          <li>Home</li>
        </Link>

        {isAuthenticated ? (
          <>
            <Link
              to="/dashboard"
              onClick={() => setIsMobileMenuOpen(false)}
              className="hover:text-gray-600 3xl:text-3xl"
            >
              <li>Dashboard</li>
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 hover:text-red-600 3xl:text-3xl"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </>
        ) : (
          <>
            <Link
              to="/register"
              onClick={() => setIsMobileMenuOpen(false)}
              className="hover:text-gray-600 3xl:text-3xl"
            >
              <li>Register</li>
            </Link>
            <Link
              to="/login"
              onClick={() => setIsMobileMenuOpen(false)}
              className="hover:text-gray-600 3xl:text-3xl"
            >
              <li>Login</li>
            </Link>
          </>
        )}
      </ul>
    </div>
  );
};

export default Navbar;