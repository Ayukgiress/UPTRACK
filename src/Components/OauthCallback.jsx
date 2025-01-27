import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../Pages/AuthContext';
import { toast } from 'sonner';

const OauthCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setRefetchCurrentUser } = useAuth();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const urlParams = new URLSearchParams(location.search);
        const token = urlParams.get('token');
        const error = urlParams.get('error');

        if (error) {
          console.error('Authentication error:', decodeURIComponent(error));
          toast.error(`Authentication failed: ${decodeURIComponent(error)}`);
          navigate('/login');
          return;
        }

        if (!token) {
          console.error('No token received');
          toast.error('Authentication failed: No token received');
          navigate('/login');
          return;
        }

        localStorage.setItem('token', decodeURIComponent(token));
        
        setRefetchCurrentUser(prev => !prev);
        
        toast.success('Successfully logged in!');
        navigate('/dashboard');
      } catch (error) {
        console.error('Callback handling error:', error);
        toast.error('An error occurred during login');
        navigate('/login');
      }
    };

    handleCallback();
  }, [location, navigate, setRefetchCurrentUser]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );
};

export default OauthCallback;