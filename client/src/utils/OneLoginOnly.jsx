import React, { useEffect, useState } from "react";
import axios from "axios";
import cogoToast from "cogo-toast";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginUser } from "../store/UserSlice";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { FaCrown, FaArrowLeft } from "react-icons/fa";
import { MdEmail, MdLock } from "react-icons/md";
import toast from "react-hot-toast";
// import GoogleOAuthButton from "./GoogleOAuthButton";

const OneLoginOnly = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [popupVisible, setPopupVisible] = useState(false);
  const [localhost, setLocalhost] = useState([]);
  const dispatch = useDispatch();

  const sendOtp = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        "https://crm-generalize.dentalguru.software/api/sendOtpOnlyOne",
        {
          email,
          subject: "CRMGuru OTP for Login!",
        }
      );
      console.log(response);
      cogoToast.success("OTP sent to your email");
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
      cogoToast.error(error?.response?.data?.message || "Something went wrong");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post(
        "https://crm-generalize.dentalguru.software/api/OneOnlylogin",
        { email, password }
      );
      setLoading(false);
      console.log(res.data);
      setLocalhost(res.data.user);
      if (res.data.success === true) {
        sendOtp();
        setPopupVisible(true);
      } else {
        console.log(res);
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message, "65");
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const closeUpdatePopup = () => {
    setPopupVisible(false);
  };

  const Popup = ({ email, onClose }) => {
    const [otp, setOtp] = useState("");
    console.log(email);

    const verifyOtpAdmin = async (e) => {
      e.preventDefault();
      setLoading(true);
      try {
        const response = await axios.post(
          "https://crm-generalize.dentalguru.software/api/verifyOtp-superadmin",
          {
            email,
            otp,
          }
        );
        console.log(response);
        dispatch(loginUser(localhost));
        setLoading(false);
        navigate("/dashboard");
        toast.success("OTP verified successfully");
        toast.success("Login successfully");
        // setVerification(true);
      } catch (error) {
        console.log(error);
        setLoading(false);
        toast.error("Wrong OTP!");
      }
    };

    useEffect(() => {
      console.log("Popup visible state updated:", popupVisible);
    }, [popupVisible]);

    return (
      <>
        <div className="fixed inset-0 bg-black/30 backdrop-blur-xs flex items-center justify-center z-50">
          <div className="bg-white p-5 rounded-lg shadow-lg">
            <form onSubmit={verifyOtpAdmin} className="flex flex-col space-y-4">
              <label htmlFor="otp" className="font-bold">
                Enter OTP
              </label>
              <input
                type="text"
                placeholder="Enter OTP"
                className="mb-3 rounded p-2 border border-gray-300 focus:outline-none focus:ring focus:border-blue-300"
                name="otp"
                value={otp}
                required
                onChange={(e) => setOtp(e.target.value)}
              />
              <div className="flex justify-start space-x-2">
                <button
                  type="submit"
                  disabled={loading}
                  className={`${
                    loading ? "bg-gray-600" : "bg-green-500 hover:bg-green-700"
                  } text-white py-2 px-4 rounded-xl`}
                >
                  {loading ? "Submit...." : "Submit"}
                </button>
                <button
                  type="button"
                  className="bg-red-500 text-white py-2 px-4 rounded-xl hover:bg-red-600"
                  onClick={onClose}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </>
    );
  };

  return (
    <>
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
              <h1 className="text-3xl font-bold text-white mb-2">CRMGuru</h1>
              <p className="text-purple-200 text-sm">
                Access your CRMGuru dashboard
              </p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="text-white text-sm font-medium flex items-center gap-2"
                >
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
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="text-white text-sm font-medium flex items-center gap-2"
                >
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
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-black/60 hover:text-black transition-colors duration-300"
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
                  "Sign In"
                )}
              </button>

              {/* Forgot Password */}
              <div className="text-center">
                <Link
                  to="/reset-password"
                  className="text-purple-300 hover:text-white text-sm transition-colors duration-300 hover:underline"
                >
                  Forgot your password?
                </Link>
              </div>
            </form>

            {/* <GoogleOAuthButton /> */}
          </div>

          {/* Footer */}
          <div className="text-center mt-6">
            <p className="text-white/60 text-xs">
              Powered by{" "}
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
      {popupVisible && <Popup email={email} onClose={closeUpdatePopup} />}
    </>
  );
};

export default OneLoginOnly;
