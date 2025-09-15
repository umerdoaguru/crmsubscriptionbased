import axios from "axios";
import cogoToast from "cogo-toast";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import img from "../images/crmimage.avif";

const ResetPasswordOnly = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtp, setShowOtp] = useState(true);
  const [showVerify, setShowVerify] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [loading, setLoading] = useState(false);

  const currentUser = useSelector((state) => state.auth.user);

  const sendOtp = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.post(
        "https://crm-generalize.dentalguru.software/api/sendOtpOnlyOne",
        {
          email,
        }
      );
      console.log(response);
      cogoToast.success("OTP sent to your email");
      setShowOtp(false);
      setShowVerify(true);
      setShowReset(false);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
      cogoToast.error(error?.response?.data?.message || "Something went wrong");
    }
  };

  const verifyOtpAdmin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.post(
        "https://crm-generalize.dentalguru.software/api/verifyOtp-superadmin",
        {
          email,
          otp,
        }
      );
      console.log(response);
      setShowOtp(false);
      setShowVerify(false);
      setShowReset(true);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
      cogoToast.error("Wrong OTP!");
    }
  };

  const changePassword = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.put(
        "https://crm-generalize.dentalguru.software/api/resetPasswordOnlyOne",
        {
          email,
          password: newPassword,
        }
      );

      console.log(response);
      cogoToast.success("Password updated successfully");
      navigate("/");

      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
      cogoToast.error(error?.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#4c1d95] via-[#312e81] to-[#7e22ce]">
        <section className="vh-100 w-full">
          <div className="flex justify-center items-center h-full">
            <div className="w-full max-w-screen-lg p-6">
              <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-xl border border-gray-200 overflow-hidden">
                <div className="p-10 flex flex-col md:flex-row gap-8">
                  {/* Left Side Image */}
                  <div className="hidden md:flex w-full md:w-1/2 lg:w-2/3 items-center">
                    <img
                      src={img}
                      className="w-full h-auto object-cover rounded-lg"
                      alt="CRM Illustration"
                    />
                  </div>

                  {/* Right Side Form */}
                  <div className="w-full md:w-1/2 lg:w-1/3 flex flex-col justify-center">
                    <h2 className="text-center text-2xl md:text-3xl font-bold text-gray-800 mb-8">
                      Reset Password
                    </h2>

                    {/* Send OTP */}
                    {showOtp && (
                      <form onSubmit={sendOtp} className="space-y-6">
                        <div>
                          <label className="block mb-2 text-sm font-medium text-gray-700">
                            Email Address
                          </label>
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-800"
                            placeholder="Enter your email"
                          />
                        </div>
                        <button
                          type="submit"
                          className="w-full py-3 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition"
                          disabled={loading}
                        >
                          {loading ? "Sending OTP..." : "Send OTP"}
                        </button>
                      </form>
                    )}

                    {/* Verify OTP */}
                    {showVerify && (
                      <form onSubmit={verifyOtpAdmin} className="space-y-6">
                        <div>
                          <label className="block mb-2 text-sm font-medium text-gray-700">
                            Email Address
                          </label>
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-800"
                            placeholder="Enter your email"
                          />
                        </div>
                        <div>
                          <label className="block mb-2 text-sm font-medium text-gray-700">
                            OTP
                          </label>
                          <input
                            type="text"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-800"
                            placeholder="Enter OTP"
                          />
                        </div>
                        <button
                          type="submit"
                          className="w-full py-3 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition"
                          disabled={loading}
                        >
                          {loading ? "Verifying OTP..." : "Verify OTP"}
                        </button>
                      </form>
                    )}

                    {/* Reset Password */}
                    {showReset && (
                      <form onSubmit={changePassword} className="space-y-6">
                        <div>
                          <label className="block mb-2 text-sm font-medium text-gray-700">
                            New Password
                          </label>
                          <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-800"
                            placeholder="Enter new password"
                          />
                        </div>
                        <button
                          type="submit"
                          className="w-full py-3 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition"
                          disabled={loading}
                        >
                          {loading ? "Resetting..." : "Reset Password"}
                        </button>
                      </form>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default ResetPasswordOnly;
