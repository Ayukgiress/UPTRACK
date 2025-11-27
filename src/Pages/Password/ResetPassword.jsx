import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { API_BASE_URL } from "../../lib/constants.js";

const PasswordResetRequest = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(`${API_BASE_URL}/users/reset-password-request`, { email });
      toast.success("Password reset email sent successfully.");
      setEmail(""); // clears input after success
    } catch (error) {
      toast.error("Failed to send password reset email. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-900 text-white px-4">
      <div className="w-full max-w-sm bg-gray-800/70 border border-gray-600 rounded-xl p-8 shadow-xl shadow-black/50 backdrop-blur-sm">

        <h2 className="text-3xl font-semibold text-center mb-6">
          Reset Password
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label className="text-lg text-gray-200">Email Address</label>
            <input
              type="email"
              value={email}
              placeholder="Enter your email"
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-11 w-full rounded-md bg-gray-200 text-gray-900 px-4 text-md outline-none 
                         focus:ring-2 focus:ring-blue-600 transition"
            />
          </div>

          <button
            type="submit"
            className="bg-blue-700 py-2 rounded-md text-lg font-medium hover:bg-blue-800
                       transition shadow-md hover:shadow-blue-900/50"
          >
            Send Reset Link
          </button>
        </form>
      </div>
    </div>
  );
};

export default PasswordResetRequest;
