import React, { useState } from "react";
import axios from "axios";
import cogoToast from "cogo-toast";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginUser } from "../store/UserSlice";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { FaCrown, FaArrowLeft } from "react-icons/fa";
import { MdEmail, MdLock } from "react-icons/md";
import GoogleOAuthButton from "./GoogleOAuthButton";

function SuperAdminLogin() {
  const [formData, setFormData] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading , setLoading] = useState(false)
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true)
      const res = await axios.post("https://crm-generalize.dentalguru.software/api/login", formData);
      if (res.data.success) {
        dispatch(loginUser(res.data.user));
        cogoToast.success(res.data.message);
        console.log("asdfghjksadfghjklsdfghjkl");

        navigate("/super-admin-dashboard");
      } else {
        cogoToast.error(res.data.message);
      }
      setLoading(false)
    } catch (error) {
      setLoading(false)
      cogoToast.error(error?.response?.data?.message || "An error occurred");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4">
      {/* Background Animation */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute -top-16 left-0 flex items-center gap-2 text-white/80 hover:text-white transition-colors duration-300 group"
        >
          <FaArrowLeft className="text-sm group-hover:-translate-x-1 transition-transform duration-300" />
          <span className="text-sm font-medium">Back to Home</span>
        </button>

        {/* Login Card */}
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl mb-4 shadow-lg">
              <FaCrown className="text-2xl text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Super Admin
            </h1>
            <p className="text-purple-200 text-sm">
              Access your administrative dashboard
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-white text-sm font-medium flex items-center gap-2">
                <MdEmail className="text-purple-300" />
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300"
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label htmlFor="password" className="text-white text-sm font-medium flex items-center gap-2">
                <MdLock className="text-purple-300" />
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300 pr-12"
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white transition-colors duration-300"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? (
                    <AiFillEye className="text-xl" />
                  ) : (
                    <AiFillEyeInvisible className="text-xl" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl shadow-lg hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-transparent transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Signing In...</span>
                </div>
              ) : (
                'Sign In'
              )}
            </button>

            {/* Forgot Password */}
            <div className="text-center">
              <Link 
                to="/superadmin-reset-password" 
                className="text-purple-300 hover:text-white text-sm transition-colors duration-300 hover:underline"
              >
                Forgot your password?
              </Link>
            </div>
          </form>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 h-px bg-white/20"></div>
            <span className="px-4 text-white/60 text-sm">or</span>
            <div className="flex-1 h-px bg-white/20"></div>
          </div>

          {/* Google OAuth Section */}
          <GoogleOAuthButton />
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-white/60 text-xs">
            Powered by{' '}
            <a 
              href="https://doaguru.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-purple-300 hover:text-white transition-colors duration-300"
            >
              Doaguru Infosystems
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SuperAdminLogin;
