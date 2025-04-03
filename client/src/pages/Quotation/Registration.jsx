import React, { useState } from "react";
import styled from "styled-components";
// import { Link,useNavigate } from "react-router-dom";
import axios from "axios";
import cogoToast from "cogo-toast";
import { Link, useNavigate } from "react-router-dom";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

const Registration = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({});
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post(
        "https://crmdemo.vimubds5.a2hosted.com/api/register",
        formData
      );
      setLoading(false);
      console.log(res);
      if (res.data.success === true) {
        cogoToast.success(`${res.data.message}`);
        navigate("/");
      }
      setError(false);
    } catch (error) {
      setLoading(false);
      setError(true);
      console.log(error.response);
      cogoToast.error(`${error.response.data.error}`);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <Container>
        <div className="container">
          <div className="row">
            <div className="col-lg-4"></div>
            <div className="col-lg-4 border rounded-4 mb-2 " id="size">
              <div className="formcontent form1">
                <form
                  className="form-control"
                  onSubmit={handleSubmit}
                  style={{ border: "none" }}
                >
                  <h1 className="text-center">Register</h1>
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label">
                      Fullname
                    </label>
                    <input
                      type="text"
                      placeholder="Enter your fullname"
                      name="name"
                      className="form-control"
                      onChange={handleChange}
                      required
                    />
                  </div>
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
                  {/*           
              <div className="mb-3">
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  name="password"
                  className="form-control"
                  onChange={handleChange}
                  required
                />
              </div> */}

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
                    <button disabled={loading} className="btn btn-success">
                      {loading ? "Loading..." : "Submit"}
                    </button>
                  </div>
                  <p>
                    Allready have an account?{" "}
                    <span>
                      <Link to="/" className="">
                        Login
                      </Link>
                    </span>
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
};

export default Registration;
const Container = styled.div`
  /* background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 1) 0%,
    rgba(0, 0, 0, 1) 0%,
    rgba(255, 255, 255, 1) 100%
  ); */

  .boxContainer {
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;

    .formcontent {
      /* background-color: #0dcaf0; */
      padding: 1rem 2rem;
      border-radius: 1rem;
      height: auto;
      /* box-shadow: 1px 2px 34px #38c7e4; */
      h1 {
        text-align: center;
        font-family: monospace;
        margin: 1rem 0;
        color: #08494c;
      }
      .form-label {
        margin-bottom: 0rem !important;
      }
    }
  }

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
