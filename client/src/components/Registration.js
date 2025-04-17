// import React, { useState } from "react";
// import styled from "styled-components";
// // import { Link,useNavigate } from "react-router-dom";
// import axios from 'axios';
// import cogoToast from 'cogo-toast';
// import { Link, useNavigate } from "react-router-dom";
// import { AiFillEye,AiFillEyeInvisible  } from "react-icons/ai";

// const Registration = () => {
//   const navigate = useNavigate()

//   const [formData,setFormData] = useState({});
//   const [error,setError] = useState(false);
//   const [loading,setLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);

//   const handleChange = (e) =>{
//     setFormData({...formData,[e.target.name] : e.target.value})
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try{
//       setLoading(true);
//       const res = await axios.post("http://localhost:9000/api/register" , formData)
//       setLoading(false)
//       console.log(res)
//       if(res.data.success === true){
//         cogoToast.success(`${res.data.message}`)
//         navigate("/");
//       }
//       setError(false)
//     }
//     catch(error){
//       setLoading(false)
//       setError(true)
//       console.log(error.response)
//       cogoToast.error(`${error.response.data.error}`)

//     }

//   }

//   const togglePasswordVisibility = () => {
//     setShowPassword(!showPassword);
//   };

//   return (
//     <>

//       <Container>
//       <div className="container mx-auto">
//   <div className="flex justify-center">
//     <div className="w-full max-w-lg border rounded-lg mb-2" id="size">
//       <div className="formcontent form1">
//         <form className="form-control" onSubmit={handleSubmit} style={{border:"none"}}>
//           <h1 className="text-center text-2xl font-bold">Register</h1>

//           <div className="mb-3">
//             <label htmlFor="name" className="form-label block mb-1">
//               Fullname
//             </label>
//             <input
//               type="text"
//               placeholder="Enter your fullname"
//               name="name"
//               className="form-control block w-full p-2 border rounded"
//               onChange={handleChange}
//               required
//             />
//           </div>

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
//               disabled={loading}
//               className={`btn p-2 rounded ${loading ? "bg-gray-500" : "bg-green-500 text-white hover:bg-green-600"}`}
//             >
//               {loading ? "Loading..." : "Submit"}
//             </button>
//           </div>

//           <p className="mt-2">
//             Already have an account?{" "}
//             <span>
//               <Link to="/" className="text-blue-500 hover:underline">Login</Link>
//             </span>
//           </p>
//         </form>
//       </div>
//     </div>
//   </div>
// </div>

// </Container>

//     </>
//   );
// };

// export default Registration;
// const Container = styled.div`
//   /* background: linear-gradient(
//     180deg,
//     rgba(255, 255, 255, 1) 0%,
//     rgba(0, 0, 0, 1) 0%,
//     rgba(255, 255, 255, 1) 100%
//   ); */

//   .boxContainer {
//     height: 100vh;
//     display: flex;
//     justify-content: center;
//     align-items: center;

//     .formcontent {
//       /* background-color: #0dcaf0; */
//       padding: 1rem 2rem;
//       border-radius: 1rem;
//       height: auto;
//       /* box-shadow: 1px 2px 34px #38c7e4; */
//       h1 {
//         text-align: center;
//         font-family: monospace;
//         margin: 1rem 0;
//         color: #08494c;
//       }
//       .form-label {
//         margin-bottom: 0rem !important;
//       }
//     }
//   }

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

// `;

import React, { useState } from "react";
import axios from "axios";
import cogoToast from "cogo-toast";
import { Link, useNavigate } from "react-router-dom";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

const Registration = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      cogoToast.error("Passwords do not match");
      return;
    }
    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:9000/api/register",
        formData
      );
      setLoading(false);
      if (res.data.success) {
        cogoToast.success(res.data.message);
        navigate("/main_page_crm");
      } else {
        cogoToast.error(res.data.message);
      }
    } catch (error) {
      setLoading(false);
      cogoToast.error(error?.response?.data?.error || "An error occurred");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <h1 className="mb-6 text-2xl font-bold text-center text-gray-700">
          Register
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Fullname
            </label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Enter your fullname"
              className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              onChange={handleChange}
              required
            />
          </div>
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
          <div className="mb-4">
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
                className="absolute inset-y-0 right-0 flex items-center pr-3"
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
          <div className="mb-6">
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700"
            >
              Confirm Password
            </label>
            <div className="relative mt-1">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Confirm your password"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center pr-3"
                onClick={toggleConfirmPasswordVisibility}
              >
                {showConfirmPassword ? (
                  <AiFillEye className="text-gray-500" />
                ) : (
                  <AiFillEyeInvisible className="text-gray-500" />
                )}
              </button>
            </div>
          </div>
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Role
            </label>
            <input
              type="text"
              id="role"
              name="role"
              value="super-admin"
              placeholder="Role"
              className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              onChange={handleChange}
              required
            />
          </div>
          <button
            type="submit"
            className={`w-full px-4 py-2 font-semibold text-white bg-blue-500 rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Loading..." : "Register"}
          </button>
          <p className="mt-4 text-sm text-center text-gray-600">
            Already have an account?{" "}
            <Link to="/" className="text-blue-500 hover:text-blue-600">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Registration;
