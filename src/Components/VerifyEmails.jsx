import React from 'react';
import Narbar from './Narbar';
import Footer from './Footer';
import { Mail, Clock, CheckCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTheme } from './ThemeContext';
import { useTranslation } from 'react-i18next';

const VerifyEmails = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();

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
              <div className={`rounded-2xl shadow-2xl p-12 border ${
                theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
              }`}>
                <div className="flex flex-col items-center gap-6">
                  <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                    <CheckCircle className="w-10 h-10 text-white" />
                  </div>
                  <div>
                    <h1 className={`text-3xl md:text-4xl font-bold mb-4 ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      {t("Check Your Email")}
                    </h1>
                    <p className={`text-lg mb-6 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      {t("We've sent a verification link to your email address. Please check your inbox and click the link to verify your account.")}
                    </p>

                    {/* Info Box */}
                    <div className={`border rounded-lg p-4 mb-6 ${
                      theme === 'dark' ? 'bg-blue-900/20 border-blue-700 text-blue-300' : 'bg-blue-50 border-blue-200 text-blue-800'
                    }`}>
                      <div className="flex items-center gap-3">
                        <Clock className="w-5 h-5 flex-shrink-0" />
                        <div className="text-left">
                          <p className="font-medium">{t("Link expires in 1 hour")}</p>
                          <p className={`text-sm ${
                            theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                          }`}>{t("Make sure to verify your email before the link expires.")}</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <p className={`${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                      }`}>
                        {t("Didn't receive the email? Check your spam folder or try resending.")}
                      </p>

                      <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to="/login">
                          <button className={`group px-6 py-3 font-semibold rounded-full transition-all duration-300 flex items-center justify-center gap-2 ${
                            theme === 'dark' ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-800 text-white hover:bg-gray-900'
                          }`}>
                            {t("Go to Login")}
                            <ArrowRight className="transition-transform duration-300 group-hover:translate-x-1" size={16} />
                          </button>
                        </Link>
                        <button
                          onClick={() => window.location.reload()}
                          className={`px-6 py-3 border-2 font-semibold rounded-full transition-all duration-300 ${
                            theme === 'dark' ? 'border-gray-600 text-gray-300 hover:border-gray-500 hover:text-gray-200' : 'border-gray-300 text-gray-700 hover:border-gray-900 hover:text-gray-900'
                          }`}
                        >
                          {t("Resend Email")}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default VerifyEmails;
