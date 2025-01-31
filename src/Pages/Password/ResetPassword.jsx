import { useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';

const PasswordResetRequest = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`https://ticks-api.onrender.com/users/reset-password-request`, { email });
      
      toast.success("Password reset email sent successfully.");
    } catch (error) {
      toast.error("Failed to send password reset email. Please try again.");
    }
  };

  return (
    <div className="h-screen bg-green w-full bg-custom-background flex items-center justify-center">
      <form onSubmit={handleSubmit} className="flex items-center justify-center flex-col gap-4">
        <div className="flex items-center justify-center flex-col">
          <label className="text-2xl text-black item-start justify-start">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="h-9 rounded-md outline-none p-4 w-96 text-xl text-black"
          />
        </div>
        <button type="submit" className="bg-blue-700 w-96 h-9 rounded-md">
          Reset Password
        </button>
      </form>
    </div>
  );
};

export default PasswordResetRequest;