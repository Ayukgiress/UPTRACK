import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { API_BASE_URL } from '../lib/constants.js';
import Narbar from './Narbar';
import Footer from './Footer';
import { CheckCircle, XCircle, Loader2, Mail, ArrowRight } from 'lucide-react';
import { useTheme } from './ThemeContext';
import { useTranslation } from 'react-i18next';

const VerifyEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [verificationStatus, setVerificationStatus] = useState('pending');
  const [errorMessage, setErrorMessage] = useState('');
  const { theme } = useTheme();
  const { t } = useTranslation();

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setVerificationStatus('error');
        setErrorMessage('Invalid verification token. Please check your email link.');
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/users/verify-email/${token}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        const data = await response.json();

        if (response.ok && data.success) {
          setVerificationStatus('success');
          toast.success("Email verified successfully! You can now log in.");
          // Check if there's a redirect URL in localStorage (from supervisor link)
          const redirectUrl = localStorage.getItem('redirectAfterLogin');
          setTimeout(() => {
            if (redirectUrl) {
              localStorage.removeItem('redirectAfterLogin');
              navigate(redirectUrl);
            } else {
              navigate("/login");
            }
          }, 3000);
        } else {
          setVerificationStatus('error');
          let message = data.message || "Verification failed. Please try again.";

          // Handle specific error cases
          if (response.status === 400) {
            message = "Invalid or expired verification token. Please request a new verification email.";
          } else if (response.status === 404) {
            message = "Verification endpoint not found. Please contact support.";
          } else if (response.status >= 500) {
            message = "Server error occurred. Please try again later.";
          }

          setErrorMessage(message);
          toast.error(message);
        }
      } catch (error) {
        console.error("Error verifying email:", error);
        setVerificationStatus('error');
        const message = "Network error occurred during email verification. Please check your connection and try again.";
        setErrorMessage(message);
        toast.error(message);
      }
    };

    verifyEmail();
  }, [token, navigate]);

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      <Narbar />

      {/* Hero Section */}
      <section className={`relative min-h-screen flex items-center overflow-hidden ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}`}>
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className={`absolute top-20 left-10 w-96 h-96 ${theme === 'dark' ? 'bg-gray-700/30' : 'bg-gray-200/30'} rounded-full blur-3xl animate-pulse`}></div>
          <div className={`absolute bottom-20 right-10 w-80 h-80 ${theme === 'dark' ? 'bg-gray-600/20' : 'bg-gray-300/20'} rounded-full blur-3xl animate-pulse delay-1000`}></div>
          <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] ${theme === 'dark' ? 'bg-gray-700/20' : 'bg-gray-100/20'} rounded-full blur-3xl`}></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            {/* Badge */}
            <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium mb-8 ${
              theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
            }`}>
              <Mail className={`w-4 h-4 mr-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`} />
              {t("Email Verification")}
            </div>

            {/* Main Content */}
            <div className="max-w-2xl mx-auto">
              {verificationStatus === 'pending' && (
                <div className={`rounded-2xl shadow-2xl p-12 border ${
                  theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
                }`}>
                  <div className="flex flex-col items-center gap-6">
                    <div className={`w-20 h-20 rounded-full flex items-center justify-center shadow-lg ${
                      theme === 'dark' ? 'bg-gray-700' : 'bg-gray-800'
                    }`}>
                      <Loader2 className="w-10 h-10 text-white animate-spin" />
                    </div>
                    <div>
                      <h1 className={`text-3xl md:text-4xl font-bold mb-4 ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        {t("Verifying Your Email")}
                      </h1>
                      <p className={`text-lg ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                      }`}>
                        {t("Please wait while we verify your email address...")}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {verificationStatus === 'success' && (
                <div className={`rounded-2xl shadow-2xl p-12 border ${
                  theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
                }`}>
                  <div className="flex flex-col items-center gap-6">
                    <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                      <CheckCircle className="w-10 h-10 text-white" />
                    </div>
                    <div>
                      <h1 className={`text-3xl md:text-4xl font-bold mb-4 ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        {t("Email Verified Successfully!")}
                      </h1>
                      <p className={`text-lg mb-6 ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                      }`}>
                        {t("Your email has been verified. You can now access all features of Tasky.Dev.")}
                      </p>
                      <p className={`text-sm ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        {t("Redirecting to login in a few seconds...")}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {verificationStatus === 'error' && (
                <div className={`rounded-2xl shadow-2xl p-12 border ${
                  theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
                }`}>
                  <div className="flex flex-col items-center gap-6">
                    <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center shadow-lg">
                      <XCircle className="w-10 h-10 text-white" />
                    </div>
                    <div>
                      <h1 className={`text-3xl md:text-4xl font-bold mb-4 ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        {t("Verification Failed")}
                      </h1>
                      <p className={`text-lg mb-6 ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                      }`}>
                        {errorMessage}
                      </p>
                      <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                          onClick={() => window.location.reload()}
                          className={`group px-6 py-3 font-semibold rounded-full transition-all duration-300 flex items-center justify-center gap-2 ${
                            theme === 'dark' ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-800 text-white hover:bg-gray-900'
                          }`}
                        >
                          {t("Try Again")}
                        </button>
                        <button
                          onClick={() => navigate("/register")}
                          className={`group px-6 py-3 border-2 font-semibold rounded-full transition-all duration-300 flex items-center justify-center gap-2 ${
                            theme === 'dark' ? 'border-gray-600 text-gray-300 hover:border-gray-500 hover:text-gray-200' : 'border-gray-300 text-gray-700 hover:border-gray-900 hover:text-gray-900'
                          }`}
                        >
                          {t("Request New Link")}
                          <ArrowRight className="transition-transform duration-300 group-hover:translate-x-1" size={16} />
                        </button>
                        <button
                          onClick={() => navigate("/login")}
                          className={`group px-6 py-3 border-2 font-semibold rounded-full transition-all duration-300 flex items-center justify-center gap-2 ${
                            theme === 'dark' ? 'border-gray-600 text-gray-300 hover:border-gray-500 hover:text-gray-200' : 'border-gray-300 text-gray-700 hover:border-gray-900 hover:text-gray-900'
                          }`}
                        >
                          {t("Go to Login")}
                          <ArrowRight className="transition-transform duration-300 group-hover:translate-x-1" size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default VerifyEmail;
