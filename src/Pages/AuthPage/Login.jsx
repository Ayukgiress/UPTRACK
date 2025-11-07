import React, { useState, useEffect } from "react";
import Narbar from "../../Components/Narbar";
import Footer from "../../Components/Footer";
import { FaEye, FaEyeSlash, FaEnvelope, FaLock } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "../AuthContext";
import { Link } from "react-router-dom";
import GoogleAuth from "../../Components/GoogleAuth";
import ForgotPass from "../../Components/PasswordReset/ForgotPassword";
import { ArrowRight, Sparkles } from "lucide-react";
import { API_BASE_URL } from "../../lib/constants.js";

const Login = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { setRefetchCurrentUser } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    // Store the current URL for redirect after login (for supervisor links)
    if (location.pathname.includes('/supervisor/')) {
      localStorage.setItem('redirectAfterLogin', '/dashboard/supervisor');
    }
  }, [location]);

  const onSubmit = async (data) => {
    setLoading(true);
    console.log("Submitted data:", data);

    try {
      const response = await fetch(
        `${API_BASE_URL}/users/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      setLoading(false);

      if (response.ok) {
        const { accessToken, refreshToken } = await response.json();
        localStorage.setItem("token", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        setRefetchCurrentUser((prev) => !prev);
        toast.success("Login Successful");

        // Check if there's a redirect URL in localStorage (from supervisor link)
        const redirectUrl = localStorage.getItem('redirectAfterLogin');
        if (redirectUrl) {
          localStorage.removeItem('redirectAfterLogin');
          navigate(redirectUrl);
        } else {
          navigate("/dashboard");
        }
      } else {
        const errorData = await response.json();
        console.error("Login failed:", errorData);
        toast.error(errorData.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("An error occurred during login. Please try again later.");
      setLoading(false);
    }
  };

  return (
    <div>
      <section className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="flex flex-col lg:flex-row w-full max-w-7xl px-6 py-8 gap-12 lg:gap-24">
          <div className="flex flex-col justify-center items-start w-full lg:w-1/2">
            <Sparkles className="text-yellow-500 mb-4" size={48} />
            <h1 className="text-4xl font-bold text-center lg:text-left text-gray-900 mb-4">
              Welcome Back
            </h1>
            <p className="text-lg text-center lg:text-left text-gray-600 mb-8">
              Log in to continue to your dashboard
            </p>
          </div>

          <div className="w-full lg:w-1/2 bg-white rounded-2xl shadow-xl p-8 space-y-6 border border-gray-100">
            <h2 className="text-2xl font-bold text-center mb-6 3xl:text-4xl text-black flex items-center justify-center gap-2">
              <FaLock className="text-blue-500" />
              Login
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-900 mb-2 3xl:text-xl flex items-center gap-2"
                >
                  <FaEnvelope className="text-blue-500" />
                  Email
                </label>
                <input
                  {...register("email", { required: "Email is required" })}
                  type="email"
                  className="bg-gray-50 border border-gray-300 w-full p-3 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
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
                <div className="flex justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-900 mb-2 3xl:text-xl flex items-center gap-2"
                >
                  <FaLock className="text-blue-500" />
                  Password
                </label>
                <ForgotPass />
                </div>

                <div className="relative">
                  <input
                    {...register("password", {
                      required: "Password is required",
                    })}
                    type={passwordVisible ? "text" : "password"}
                    className="bg-gray-50 border border-gray-300 w-full p-3 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setPasswordVisible(!passwordVisible)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-blue-500 transition-colors duration-200 3xl:text-3xl"
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

              <div className="flex justify-center items-center">
                <button
                  type="submit"
                  className="flex h-[50px] w-full items-center justify-center bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed group"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Logging in...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      Log in
                      <ArrowRight className="transition-transform duration-300 group-hover:translate-x-1" size={16} />
                    </div>
                  )}
                </button>
              </div>

              <div>
                <GoogleAuth />
              </div>

              <p className="text-sm text-center mt-4 text-gray-600">
                Don't have an account?{" "}
                <Link to="/register" className="text-gray-900 hover:text-gray-700 font-medium transition-colors duration-200 hover:underline">
                  Sign up here
                </Link>
              </p>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Login;
