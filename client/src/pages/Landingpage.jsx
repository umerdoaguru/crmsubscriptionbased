import React from "react";
import { Link } from "react-router-dom";

import { MdManageAccounts, MdPeople } from "react-icons/md";
import styled from "styled-components"; // Optional, you can remove if not using
import img from "../images/crmimage.avif";

const Landingpage = () => {
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
                    Please Select User
                  </p>
                  <div className="mx-4">
                    <Link to="/SuperAdmin-login">
                      <button className="w-full bg-blue-600 text-white text-lg font-semibold py-3 rounded-lg hover:bg-blue-700 transition transform hover:scale-105 focus:outline-none flex items-center justify-center mb-5">
                        {" "}
                        {/* Added margin bottom */}
                        <MdManageAccounts className="mr-2" />
                        Super Admin
                      </button>
                    </Link>

                    <Link to="/admin-login">
                      <button className="w-full bg-blue-600 text-white text-lg font-semibold py-3 rounded-lg hover:bg-blue-700 transition transform hover:scale-105 focus:outline-none flex items-center justify-center mb-5">
                        {" "}
                        {/* Added margin bottom */}
                        <MdManageAccounts className="mr-2" />
                        Admin
                      </button>
                    </Link>

                    <Link to="/employee-login">
                      <button className="w-full bg-blue-600 text-white text-lg font-semibold py-3 rounded-lg hover:bg-blue-700 transition transform hover:scale-105 focus:outline-none flex items-center justify-center">
                        <MdPeople className="mr-2" />
                        Employees
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landingpage;
