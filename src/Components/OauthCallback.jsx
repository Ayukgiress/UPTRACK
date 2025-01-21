import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../Pages/AuthContext';
import { toast } from 'sonner';

const OauthCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setRefetchCurrentUser } = useAuth();

  useEffect(() => {
    console.log('OauthCallback mounted, search params:', window.location.search);
    const handleCallback = async () => {
      try {
        const urlParams = new URLSearchParams(location.search);
        const token = urlParams.get('token');
        const error = urlParams.get('error');

        if (error) {
          console.error('Authentication error:', error);
          toast.error(`Authentication failed: ${error}`);
          navigate('/login');
          return;
        }

        if (!token) {
          console.error('No token received');
          toast.error('Authentication failed: No token received');
          navigate('/login');
          return;
        }

        localStorage.setItem('token', token);
        
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
      <p className="mt-4 text-gray-600">Completing login...</p>
    </div>
  );
};

export default OauthCallback;