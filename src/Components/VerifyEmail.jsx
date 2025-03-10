import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
// import API_URL from '../Pages/Constants/Constants';

const VerifyEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [verificationStatus, setVerificationStatus] = useState('pending');

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) return;
  
      try {
        const response = await fetch(`https://ticks-api.onrender.com/users/verify-email/${token}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        });
  
        const data = await response.json();
  
        if (response.ok && data.success) {
          setVerificationStatus('success');
          toast.success("Email verified successfully! You can now log in.");
          setTimeout(() => navigate("/login"), 2000);
        } else {
          setVerificationStatus('error');
          toast.error(data.message || "Verification failed. Please try again.");
        }
      } catch (error) {
        console.error("Error verifying email:", error);
        setVerificationStatus('error');
        toast.error("An error occurred during email verification.");
      }
    };
  
    verifyEmail();
  }, [token, navigate]);
  

  return (
    <>
    <div className="flex flex-col justify-center items-center h-screen gap-4 bg-custom-first">
      {verificationStatus === 'pending' && (
        <>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          <h2 className="text-xl">Verifying your email...</h2>
        </>
      )}
      
      {verificationStatus === 'success' && (
        <>
          <div className="text-green-500 text-4xl">✓</div>
          <h2 className="text-xl text-green-600">Email verified successfully!</h2>
          <p className="text-gray-600">Redirecting to login...</p>
        </>
      )}
      
      {verificationStatus === 'error' && (
        <>
          <div className="text-red-500 text-4xl">✗</div>
          <h2 className="text-xl text-red-600">Verification failed</h2>
          <button 
            onClick={() => navigate("/login")}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Go to Login
          </button>
        </>
      )}
    </div>
    </>
  );
};

export default VerifyEmail;