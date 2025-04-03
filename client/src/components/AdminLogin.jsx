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
//       const res  = await axios.post("https://crmdemo.vimubds5.a2hosted.com/api/login", formData)
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
        "https://crmdemo.vimubds5.a2hosted.com/api/admin-login",
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
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 mx-3 bg-white rounded-lg shadow-lg">
      <button
            onClick={() => navigate(-1)}
            className="bg-blue-500 text-white px-3 py-1 max-sm:hidden rounded-lg hover:bg-blue-600 transition-colors "
          >
            Back
          </button>
          
        <h1 className="mb-6 text-2xl font-bold text-center">Admin Login</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <div className="relative mt-1">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                placeholder="Enter your password"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? (
                  <AiFillEye className="text-gray-500" />
                ) : (
                  <AiFillEyeInvisible className="text-gray-500" />
                )}
              </button>
            </div>
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 font-semibold text-white bg-blue-500 rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            disabled = {loading}
         >
             {loading ? 'Submiting...' : 'Submit'}
          </button>
          <p className="mt-4 text-sm text-center text-gray-600">
           
            <Link to="/admin-reset-password" className="text-blue-500 hover:text-green-600">Forgot Password?</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default AdminLogin;
