import React, { useState, useEffect } from "react";
import { FaEye, FaEyeSlash, FaEnvelope, FaLock, FaUser } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import Narbar from "../../Components/Narbar";
import Footer from "../../Components/Footer";
import GoogleAuth from "../../Components/GoogleAuth";
import { ArrowRight, Sparkles } from "lucide-react";
import { API_BASE_URL } from "../../lib/constants.js";
import { useTranslation } from "react-i18next";

const Registration = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    // Store the redirect URL for after registration (for supervisor links)
    if (location.pathname.includes('/supervisor/')) {
      localStorage.setItem('redirectAfterLogin', '/dashboard/supervisor');
    }
  }, [location]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/users/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      setLoading(false);

      const responseText = await response.text();
      console.log("Response Text:", responseText);

      if (response.ok) {
        const responseData = JSON.parse(responseText);
        toast.success(
          "Registration successful! Please check your email for verification instructions."
        );
        navigate("/verify-email");

      } else {
        let errorData = {};
        try {
          errorData = JSON.parse(responseText);
        } catch (error) {
          errorData = { message: "Unknown error occurred" };
        }
        console.log("Error Data:", errorData);
        toast.error(errorData.message || "Registration failed");
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error(
        "An error occurred during registration. Please try again later."
      );
      setLoading(false);
    }
  };

  return (
      <section className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="flex flex-col lg:flex-row items-center justify-center w-full max-w-7xl px-6 py-8 gap-12 lg:gap-24">
          {/* Centered Content */}
          <div className="w-full lg:w-1/2 bg-white rounded-2xl shadow-xl p-8 space-y-6 border border-gray-100">
            <h2 className="text-2xl font-bold text-center mb-6 text-black flex items-center justify-center gap-2">
              <Sparkles className="text-yellow-500" size={24} />
              {t("Create your account")}
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 text-black">
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-black mb-2 flex items-center gap-2"
                >
                  <FaUser className="text-blue-500" />
                  {t("Name")}
                </label>
                <input
                  {...register("username", {
                    required: "Username is required",
                  })}
                  type="text"
                  className="bg-gray-50 border border-gray-300 w-full p-3 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all duration-200 hover:border-gray-400 text-base"
                  placeholder="Username"
                />
                {errors.username && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <span className="text-red-500">⚠️</span>
                    {errors.username.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-black mb-2 flex items-center gap-2"
                >
                  <FaEnvelope className="text-blue-500" />
                  {t("Email")}
                </label>
                <input
                  {...register("email", {
                    required: "Email is required",
                    pattern: /^[^@]+@[^@]+\.[^@]+$/,
                  })}
                  type="email"
                  className="bg-gray-50 border border-gray-300 w-full p-3 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all duration-200 hover:border-gray-400 text-base"
                  placeholder="name@gmail.com"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <span className="text-red-500">⚠️</span>
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-black mb-2 flex items-center gap-2"
                  >
                    <FaLock className="text-blue-500" />
                    {t("Password")}
                  </label>
                </div>
                <div className="relative">
                  <input
                    {...register("password", {
                      required: "Password is required",
                    })}
                    type={passwordVisible ? "text" : "password"}
                    className="bg-gray-50 border border-gray-300 w-full p-3 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all duration-200 hover:border-gray-400 text-base"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setPasswordVisible(!passwordVisible)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-blue-500 transition-colors duration-200"
                  >
                    {passwordVisible ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>

                {errors.password && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <span className="text-red-500">⚠️</span>
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div className="mt-4">
                <button
                  type="submit"
                  className="w-full bg-gray-900 text-white p-3 rounded-lg hover:bg-gray-800 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed text-lg group"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Registering...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      {t("Register")}
                      <ArrowRight className="transition-transform duration-300 group-hover:translate-x-1" size={16} />
                    </div>
                  )}
                </button>
              </div>

              <div>
                <GoogleAuth />
              </div>

              <p className="text-sm text-center mt-4 text-gray-600">
                {t("Already have an account?")}{" "}
                <Link to="/login" className="text-gray-900 hover:text-gray-700 font-medium transition-colors duration-200 hover:underline">
                  {t("Login here")}
                </Link>
              </p>
            </form>
          </div>
        </div>
      </section>

   
  );
};

export default Registration;