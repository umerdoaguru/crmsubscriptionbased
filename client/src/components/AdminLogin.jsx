// import React from 'react'
// import styled from 'styled-components'
// import axios from 'axios';
// import cogoToast from 'cogo-toast';
// import  { useState } from "react";
// import { Link, useNavigate } from 'react-router-dom';
// import { useDispatch } from 'react-redux';
// import { loginUser } from '../store/UserSlice';

// import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';

// function Login() {
//   const [isScrolled, setIsScrolled] = useState(false);
//   const [formData , setFormData] = useState({});
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   const [showPassword, setShowPassword] = useState(false);

//   window.onscroll = () => {
//     setIsScrolled(window.pageYOffset === 0 ? false : true);
//     return () => (window.onscroll = null);
//   };
//   const handleChange = (e) =>{
//     setFormData({...formData,[e.target.name]: e.target.value})
//   }
//   const handleSumbit = async (e) =>{
//     console.log(formData);
//     e.preventDefault();
//     try{
//       const res  = await axios.post("http://localhost:9000/api/login", formData)
//       console.log(res)
//       if(res.data.success === true){
//         dispatch(loginUser(res.data.user));
//         cogoToast.success(`${res.data.message}`)
//         navigate("/dashboard");
//       }
//       else{
//         cogoToast.error(`${res.data.message}`)
//       }

//     }
//     catch(error){
//       console.log(error?.response?.data?.error)
//       cogoToast.error(`${error?.response?.data?.message}`)
//     }

//   }
//   const togglePasswordVisibility = () => {
//     setShowPassword(!showPassword);
//   };

//   return (
//     <Wrapper>

//  <div className="container mx-auto">
//   <div className="flex justify-center">
//     <div className="w-full max-w-lg border rounded-4 mb-2" id="size">
//       <div className="formcontent form1">
//         <form className="form-control border-none">
//           <h1 className="text-center text-2xl font-bold">Login</h1>

//           <div className="mb-3">
//             <label htmlFor="email" className="form-label block mb-1">
//               Email
//             </label>
//             <input
//               type="email"
//               placeholder="Enter your email"
//               name="email"
//               className="form-control block w-full p-2 border rounded"
//               onChange={handleChange}
//               required
//             />
//           </div>

//           <div className="mb-3">
//             <label htmlFor="password" className="form-label block mb-1">
//               Password
//             </label>
//             <div className="input-group flex items-center">
//               <input
//                 type={showPassword ? "text" : "password"}
//                 placeholder="Enter your password"
//                 name="password"
//                 className="form-control block w-full p-2 border rounded"
//                 onChange={handleChange}
//                 required
//               />
//               <button
//                 className="btn btn-outline-secondary border p-2"
//                 type="button"
//                 onClick={togglePasswordVisibility}
//               >
//                 {showPassword ? <AiFillEye /> : <AiFillEyeInvisible />}
//               </button>
//             </div>
//           </div>

//           <div className="flex justify-center">
//             <button
//               className="btn bg-green-500 text-white p-2 rounded hover:bg-green-600"
//               onClick={handleSumbit}
//             >
//               Submit
//             </button>
//           </div>

//           <p className="mb-2 mt-2 text-center">
//             Don't have an account? <br />
//             <p>Please Connect Our Team</p>
//             {/* <span>
//               <Link to="/register" className='text-blue-500 hover:underline'>Signup</Link>
//             </span> */}
//           </p>
//         </form>
//       </div>
//     </div>
//   </div>
// </div>

//     </Wrapper>
//   )
// }

// export default Login
// const Wrapper = styled.div`
//   .form1{
//   margin-bottom: 4rem;
//      margin-top: 3rem;

//   }
//   .container{
//     height:36rem;
//     margin-top: 3rem;
//   }
// label{
//   font-weight: 800;
//          text-decoration: none;
//          font-family: "Playpen Sans", cursive;
// }
// h3{
//   font-weight: 800;
//          text-decoration: none;
//          font-family: "Playpen Sans", cursive;
// }
// button{
//   font-weight: 800;
//          text-decoration: none;
//          font-family: "Playpen Sans", cursive;
// }
// .form-text{
//   font-weight: 800;
//          text-decoration: none;
//          font-family: "Playpen Sans", cursive;
// }
// #size{
//   margin-right: 12px;
//   margin-left: 10px;
//   width: 25%;
//   @media screen and (max-width: 768px) {
//     width: 75%;
//     margin-left: 50px;
//   }
//   @media screen and (min-width: 768px) and (max-width: 1020px) {
//     width: 50%;
//     margin-left: 170px;
//   }
// }
// `

import React, { useState } from "react";
import axios from "axios";
import cogoToast from "cogo-toast";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginUser } from "../store/UserSlice";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { FaUserShield, FaArrowLeft } from "react-icons/fa";
import { MdEmail, MdLock } from "react-icons/md";

function AdminLogin() {
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
      const res = await axios.post(
        "http://localhost:9000/api/admin-login",
        formData
      );
      if (res.data.success) {
        dispatch(loginUser(res.data.user));
        // cogoToast.success(res.data.message);
        navigate("/admin-dashboard");
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
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-cyan-900 to-teal-900 flex items-center justify-center p-4">
      {/* Background Animation */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
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
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-2xl mb-4 shadow-lg">
              <FaUserShield className="text-2xl text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Admin
            </h1>
            <p className="text-blue-200 text-sm">
              Access your management dashboard
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-white text-sm font-medium flex items-center gap-2">
                <MdEmail className="text-blue-300" />
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300"
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label htmlFor="password" className="text-white text-sm font-medium flex items-center gap-2">
                <MdLock className="text-blue-300" />
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 pr-12"
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
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-xl shadow-lg hover:from-blue-700 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-transparent transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
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
                to="/admin-reset-password" 
                className="text-blue-300 hover:text-white text-sm transition-colors duration-300 hover:underline"
              >
                Forgot your password?
              </Link>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-white/60 text-xs">
            Powered by{' '}
            <a 
              href="https://doaguru.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-300 hover:text-white transition-colors duration-300"
            >
              Doaguru Infosystems
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
