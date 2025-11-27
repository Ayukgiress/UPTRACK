import React, { useState, useEffect } from "react";
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
import { useTranslation } from "react-i18next";
import { useTheme } from "../../Components/ThemeContext";

const Login = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { setRefetchCurrentUser } = useAuth();
  const { t } = useTranslation();
  const { theme } = useTheme();

  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
  } = useForm({
    mode: "onChange",
  });

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
    <div className={`min-h-screen ${
      theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-gray-900"
    }`}>
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div
          className={`absolute top-20 left-10 w-96 h-96 ${
            theme === "dark" ? "bg-gray-700/30" : "bg-gray-200/30"
          } rounded-full blur-3xl animate-pulse`}
        ></div>
        <div
          className={`absolute bottom-20 right-10 w-80 h-80 ${
            theme === "dark" ? "bg-gray-600/20" : "bg-gray-300/20"
          } rounded-full blur-3xl animate-pulse delay-1000`}
        ></div>
        <div
          className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] ${
            theme === "dark" ? "bg-gray-700/20" : "bg-gray-100/20"
          } rounded-full blur-3xl`}
        ></div>
      </div>

      <div className="relative z-10 max-w-md mx-auto px-4 py-20">
        <div className="text-center mb-8">
         

          <h1
            className={`text-3xl sm:text-4xl font-bold mb-4 ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            {t("Sign In to Your Account")}
          </h1>

          <p
            className={`text-lg mb-12 ${
              theme === "dark" ? "text-gray-300" : "text-gray-600"
            }`}
          >
            {t("Log in to continue to your dashboard")}
          </p>
        </div>

        <div className={`rounded-2xl shadow-2xl p-8 border ${
          theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"
        }`}>
          <div className="text-center mb-8">
            <h2 className={`text-2xl font-bold flex items-center justify-center gap-2 ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}>
              <FaLock className="text-blue-500" />
              {t("Login")}
            </h2>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className={`block text-sm font-medium mb-2 flex items-center gap-2 ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  <FaEnvelope className="text-blue-500" />
                  {t("Email")}
                </label>
                <input
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Invalid email address",
                    },
                  })}
                  type="email"
                  className={`w-full p-3 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    theme === "dark"
                      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 hover:border-gray-500"
                      : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500 hover:border-gray-400"
                  } ${errors.email ? 'border-red-500' : ''}`}
                  placeholder="name@gmail.com"
                  onChange={async (e) => {
                    await trigger("email");
                  }}
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
                  {t("Password")}
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

              <div className="pt-2">
                <button
                  type="submit"
                  className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 group ${
                    theme === "dark"
                      ? "bg-blue-600 hover:bg-blue-700 text-white"
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                  }`}
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Logging in...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      {t("Log in")}
                      <ArrowRight className="transition-transform duration-300 group-hover:translate-x-1" size={16} />
                    </div>
                  )}
                </button>
              </div>

              <div>
              <GoogleAuth mode="login" />
              </div>

              <p className="text-sm text-center mt-4 text-gray-600">
                {t("Don't have an account?")}{" "}
                <Link to="/register" className="text-gray-900 hover:text-gray-700 font-medium transition-colors duration-200 hover:underline">
                  {t("Sign up here")}
                </Link>
              </p>
            </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
