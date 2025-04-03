import axios from "axios";
import cogoToast from "cogo-toast";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import img from '../images/crmimage.avif'


const SuperAdminResetPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtp, setShowOtp] = useState(true);
  const [showVerify, setShowVerify] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [loading , setLoading] = useState(false)

  const currentUser = useSelector((state) => state.auth.user);


  const sendOtp = async (e) => {
    e.preventDefault();
    try {
      setLoading(true)
      const response = await axios.post(
        "https://crmdemo.vimubds5.a2hosted.com/api/sendOtp-superadmin",
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
        setLoading(true)
      const response = await axios.post(
        "https://crmdemo.vimubds5.a2hosted.com/api/verifyOtp-superadmin",
        {
          email,
          otp,
        }
      );
      console.log(response);
      setShowOtp(false);
      setShowVerify(false);
      setShowReset(true);
      setLoading(false)
    } catch (error) {
      console.log(error);
      setLoading(false)
      cogoToast.error("Wrong OTP!");
    }
  };

  const changePassword = async (e) => {
    e.preventDefault();
    try {
      setLoading(true)
      const response = await axios.put(
        "https://crmdemo.vimubds5.a2hosted.com/api/resetPassword-superadmin",
        {
          email,
          password: newPassword,
        }
      );

      console.log(response);
      cogoToast.success("Password updated successfully");
      navigate("/");
      
      setLoading(false)

    } catch (error) {
      console.log(error);
      setLoading(false)
      cogoToast.error(error?.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
    <section className="vh-100 w-full">
      <div className="flex justify-center items-center h-full">
        <div className="w-full max-w-screen-lg p-4">
          <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
            <div className="p-8 flex flex-col md:flex-row">
              <div className="w-full md:w-1/2 lg:w-2/3 flex items-center mb-4 md:mb-0">
                <img
                  src={img}
                  className="w-full h-auto object-cover"
                  alt="Sample"
                />
              </div>
              <div className="w-full md:w-1/2 lg:w-1/3 flex flex-col justify-center">
                <p className="text-center text-xl md:text-2xl font-bold mb-8">
                Password Reset Super Admin
                </p>
            
          {showOtp && (
            <form className="sendOtp" onSubmit={sendOtp}>
              <div className="flex items-center mb-4">
                <i className="fas fa-envelope text-lg mr-3"></i>
                <div className="flex-grow">
                  <label className="block mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2 border rounded"
                    placeholder="Email"
                  />
                </div>
              </div>
              <div className="flex justify-center mx-3">
                <button type="submit" className="w-full bg-blue-600 text-white text-lg font-semibold py-2 rounded-lg hover:bg-blue-700 transition transform hover:scale-105 focus:outline-none flex items-center justify-center mb-5"    disabled = {loading}>
                {loading ? 'Sending OTP...' : 'Send OTP'}
                </button>
              </div>
            </form>
          )}
          {showVerify && (
            <form className="verify-otp" onSubmit={verifyOtpAdmin}>
              <div className="flex items-center mb-4">
                <i className="fas fa-envelope text-lg mr-3"></i>
                <div className="flex-grow">
                  <label className="block mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2 border rounded"
                    placeholder="Email"
                  />
                </div>
              </div>
              <div className="flex items-center mb-4">
                <i className="fas fa-lock text-lg mr-3"></i>
                <div className="flex-grow">
                  <label className="block mb-1">OTP</label>
                  <input
                    type="text"
                    name="otp"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full p-2 border rounded"
                    placeholder="OTP"
                  />
                </div>
              </div>
              <div className="flex justify-center mx-3">
                <button type="submit" className="w-full bg-blue-600 text-white text-lg font-semibold py-2 rounded-lg hover:bg-blue-700 transition transform hover:scale-105 focus:outline-none flex items-center justify-center mb-5"    disabled = {loading}>
                   {loading ? 'Verifying OTP...' : 'Verify OTP'}
                </button>
              </div>
            </form>
          )}
          {showReset && (
            <form className="reset" onSubmit={changePassword}>
              <div className="flex items-center mb-4">
                <i className="fas fa-lock text-lg mr-3"></i>
                <div className="flex-grow">
                  <label className="block mb-1">New Password</label>
                  <input
                    type="password"
                    name="newPassword"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full p-2 border rounded"
                    placeholder="New Password"
                  />
                </div>
              </div>
              <div className="flex justify-center mx-3">
                <button type="submit" className="w-full bg-blue-600 text-white text-lg font-semibold py-2 rounded-lg hover:bg-blue-700 transition transform hover:scale-105 focus:outline-none flex items-center justify-center mb-5"    disabled = {loading}>
                   {loading ? 'Resetting Password...' : 'Reset Password'}
                </button>
              </div>
            </form>
          )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
  );
};

export default SuperAdminResetPassword;
