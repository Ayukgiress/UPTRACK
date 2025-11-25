import React, { useState, useEffect } from 'react';
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Pages/AuthContext';
import { toast } from 'sonner';
import { API_BASE_URL } from '../lib/constants.js';

const GoogleAuth = ({ mode = 'login' }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleGoogleLogin = () => {
    setLoading(true);
    try {
      // Redirect to local backend Google OAuth endpoint
      window.location.href = `${API_BASE_URL}/users/auth/google`;
    } catch (error) {
      console.error(`${mode} with Google failed:`, error);
      setLoading(false);
      toast.error('Something went wrong. Please try again.');
    }
  };

  // Reset loading when component unmounts or mode changes
  React.useEffect(() => {
    return () => {
      setLoading(false);
    };
  }, [mode]);

  return (
    <div className="flex items-center justify-center flex-col w-full">
      <button
        onClick={handleGoogleLogin}
        className="w-full h-11 3xl:h-24 3xl:text-4xl rounded-md text-white flex items-center justify-center bg-black transition-colors hover:bg-gray-800"
        disabled={loading}
      >
        {loading ? (
          <div className="w-6 h-6 border-4 border-t-4 border-white rounded-full animate-spin" />
        ) : (
          <FcGoogle className="m-2 h-7 w-10 3xl:h-24" />
        )}
        {loading ? 'Loading...' : (mode === 'login' ? 'Login with Google' : 'Sign up with Google')}
      </button>
    </div>
  );
};

export default GoogleAuth;
