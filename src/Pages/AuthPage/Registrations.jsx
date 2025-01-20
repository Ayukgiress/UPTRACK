import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Narbar from "../../Components/Narbar";
import Footer from "../../Components/Footer";

const Registration = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/users/register`, {
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
    <>
    <Narbar/>
      <section className="bg-custom-first min-h-screen flex items-center justify-center bg-custom-gradient">
        <div className="flex flex-col lg:flex-row w-full max-w-7xl 3xl:max-w-[120rem] px-6 py-8 gap-12 lg:gap-24">
          <div className="flex flex-col justify-between items-start w-full lg:w-1/2">
            <div className="flex items-start justify-start text-3xl text-black">
              <img
                src='/images/checklist_10552402.png'
                alt="logo"
                className="h-10 w-20 md:h-36 md:w-40 rounded-md shadow-sm shadow-button-c xl:w-[39rem] xl:h-[36rem] 2xl:h-[30rem] 3xl:h-[47rem] 3xl:w-[45rem]"
              />
            </div>
          </div>

          {/* Right Content */}
          <div className="w-full lg:w-1/2 bg-custom-second rounded-lg shadow-md p-6 space-y-4 sm:p-8 3xl:h-[49rem] 3xl:w-[75rem] 3xl:p-16 bg-white ">
            <h2 className="text-2xl font-bold text-center mb-6 text-black 3xl:text-4xl">
              Create your account
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 text-black">
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-black mb-2 3xl:text-xl"
                >
                  Username
                </label>
                <input
                  {...register("username", {
                    required: "Username is required",
                  })}
                  type="text"
                  className="bg-white border border-gray-300 w-full p-2.5 rounded-lg 3xl:h-24 3xl:w-[50rem] 3xl:text-3xl"
                  placeholder="Username"
                />
                {errors.username && (
                  <p className="text-red-500 text-sm">
                    {errors.username.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-black mb-2 3xl:text-xl"
                >
                  Your email
                </label>
                <input
                  {...register("email", {
                    required: "Email is required",
                    pattern: /^[^@]+@[^@]+\.[^@]+$/,
                  })}
                  type="email"
                  className="bg-white border border-gray-300 w-full p-2.5 rounded-lg 3xl:h-24 3xl:w-[50rem] 3xl:text-3xl"
                  placeholder="name@cgmail.com"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email.message}</p>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-black mb-2 3xl:text-xl"
                  >
                    Password
                  </label>
                </div>
                <div className="relative">
                  <input
                    {...register("password", {
                      required: "Password is required",
                    })}
                    type={passwordVisible ? "text" : "password"}
                    className="bg-white border border-gray-300 w-full p-2.5 rounded-lg 3xl:h-24 3xl:w-[50rem] 3xl:text-3xl"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setPasswordVisible(!passwordVisible)}
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 text-gray-600 3xl:text-3xl"
                  >
                    {passwordVisible ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>

                {errors.password && (
                  <p className="text-red-500 text-sm">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div className="mt-4">
                <button
                  type="submit"
                  className="w-full bg-blue-800 text-white p-2.5 rounded-lg text-2xl 3xl:text-4xl"
                  disabled={loading}
                >
                  {loading ? "Registering..." : "Sign up"}
                </button>
              </div>

              <p className="text-sm text-center mt-4 text-black 3xl:text-3xl">
                Already have an account?{" "}
                <Link to="/login" className="text-primary-600">
                  Login here
                </Link>
              </p>
            </form>
          </div>
        </div>
      </section>
      <div className="bg-white h-3 w-full"></div>
      <Footer />
    </>
  );
};

export default Registration;