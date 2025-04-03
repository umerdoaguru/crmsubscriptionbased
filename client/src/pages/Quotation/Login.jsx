import React from "react";
import styled from "styled-components";
import axios from "axios";
import cogoToast from "cogo-toast";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginUser } from "../store/UserSlice";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

function Login() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);

  window.onscroll = () => {
    setIsScrolled(window.pageYOffset === 0 ? false : true);
    return () => (window.onscroll = null);
  };
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSumbit = async (e) => {
    console.log(formData);
    e.preventDefault();
    try {
      const res = await axios.post("https://crmdemo.vimubds5.a2hosted.com/api/login", formData);
      console.log(res);
      if (res.data.success === true) {
        dispatch(loginUser(res.data.user));
        cogoToast.success(`${res.data.message}`);
        navigate("/create-company-profile");
      } else {
        cogoToast.error(`${res.data.message}`);
      }
    } catch (error) {
      console.log(error.response.data.error);
      cogoToast.error(`${error.response.data.message}`);
    }
  };
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Wrapper>
      <div className="container">
        <div className="row">
          <div className="col-lg-4"></div>
          <div className="col-lg-4 border rounded-4 mb-2 " id="size">
            <div className="formcontent form1">
              <form className="form-control" style={{ border: "none" }}>
                <h1 className="text-center">Login</h1>

                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    name="email"
                    className="form-control"
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    Password
                  </label>
                  <div className="input-group">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      name="password"
                      className="form-control"
                      onChange={handleChange}
                      required
                    />
                    <button
                      className="btn btn-outline-secondary border"
                      type="button"
                      onClick={togglePasswordVisibility}
                    >
                      {showPassword ? <AiFillEye /> : <AiFillEyeInvisible />}
                    </button>
                  </div>
                </div>
                <div className="d-flex justify-content-center">
                  <button className="btn btn-success" onClick={handleSumbit}>
                    Submit
                  </button>
                </div>
                <p className="mb-2 mt-2">
                  Don't have an account? <p>Please Connect Doaguru Team </p>
                  {/* <span>
                  <Link to="/register" className=''>Signup</Link>
                </span> */}
                </p>
              </form>
            </div>
          </div>
          <div className="col-lg-4"></div>
        </div>
      </div>
    </Wrapper>
  );
}

export default Login;
const Wrapper = styled.div`
  .form1 {
    margin-bottom: 4rem;
    margin-top: 3rem;
  }
  .container {
    height: 45rem;
    margin-top: 9rem;
  }
  label {
    font-weight: 800;
    text-decoration: none;
    font-family: "Playpen Sans", cursive;
  }
  h3 {
    font-weight: 800;
    text-decoration: none;
    font-family: "Playpen Sans", cursive;
  }
  button {
    font-weight: 800;
    text-decoration: none;
    font-family: "Playpen Sans", cursive;
  }
  .form-text {
    font-weight: 800;
    text-decoration: none;
    font-family: "Playpen Sans", cursive;
  }
  #size {
    margin-right: 12px;
    margin-left: 10px;
    width: 25%;
    @media screen and (max-width: 768px) {
      width: 75%;
      margin-left: 50px;
    }
    @media screen and (min-width: 768px) and (max-width: 1020px) {
      width: 50%;
      margin-left: 170px;
    }
  }
`;
