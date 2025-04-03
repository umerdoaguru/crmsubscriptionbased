import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaHistory, FaUserCircle } from "react-icons/fa";
import { RiSecurePaymentLine } from "react-icons/ri";
import { BsFileEarmarkPerson, BsHouse } from "react-icons/bs";
import { MdOutlineManageAccounts } from "react-icons/md";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";

const Sider = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const getSidebarClass = (path) => {
    return location.pathname === path ? "bg-blue-800 shadow-lg" : "";
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Hamburger Button - Hidden on large screens */}
      <button
        className="fixed top-16 md:top-20 left-4 z-50 text-black "
        onClick={toggleSidebar}
      >
        <AiOutlineMenu size={25} />
      </button>

      {/* Sidebar */}
      <div
        className={`fixed mt-16 md:mt-[70px] lg:mt-[60px] inset-y-0 bg-[#01060c] overflow-hidden 2xl:translate-x-0 transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out w-20 md:w-[150px] z-50`}
      >
        {/* Close (Cross) Button - Hidden on large screens */}
        <button
          className="absolute left-14 md:left-32 lg-left-32 text-gray-400 2xl:hidden" // Hidden on large screens (lg)
          onClick={toggleSidebar}
        >
          <AiOutlineClose size={25} />
        </button>

        <div className="flex flex-col items-center max-h-screen overflow-auto	p-4 xl:w-[10rem]	">
          <ul className="flex flex-col items-center space-y-4 w-full pb-16">
            <li
              className={`xl:w-full ${getSidebarClass("/admin-dashboard")}`}
            >
              <Link
                to="/admin-dashboard"
                className="flex flex-col items-center py-3"
              >
                <BsHouse className="text-white text-2xl md:text-3xl" />
                <h3 className="text-xs max-md:pt-3 lg:inline text-white md:text-base">
                  Dashboard
                </h3>
              </Link>
            </li>
            <hr className="w-full border-gray-400" />

            <li className={`xl:w-full ${getSidebarClass("/leads")}`}>
              <Link to="/leads" className="flex flex-col items-center py-3">
                <FaHistory className="text-white text-2xl md:text-3xl" />
                <h3 className="text-xs max-md:pt-3 lg:inline text-white md:text-base">
                  Leads
                </h3>
              </Link>
            </li>

            <hr className="w-full border-gray-400" />
              <li className={`xl:w-full ${getSidebarClass("/main-social-media-leads")}`}>
                <Link
                  to="/main-social-media-leads"
                  className="flex flex-col items-center py-3"
                >
                  <FaHistory className="text-white text-2xl md:text-3xl" />
                  <h3 className="text-xs text-center max-md:pt-3 lg:inline text-white md:text-base">
                    Social Media <br /> <span>Leads</span>
                  </h3>
                </Link>
              </li>

            <hr className="w-full border-gray-400" />

            <li className={`xl:w-full ${getSidebarClass("/admin-report")}`}>
              <Link to="/admin-report" className="flex flex-col items-center py-3">
                <RiSecurePaymentLine className="text-white text-2xl md:text-3xl" />
                <h3 className="text-xs max-md:pt-3 lg:inline text-white md:text-base">
                  Reports
                </h3>
              </Link>
            </li>

            <hr className="w-full border-gray-400" />

            <li className={`xl:w-full ${getSidebarClass("/data-export")}`}>
              <Link
                to="/data-export"
                className="flex flex-col items-center py-3"
              >
                <BsFileEarmarkPerson className="text-white text-2xl md:text-3xl" />
                <h3 className="text-xs max-md:pt-3 lg:inline text-white md:text-base">
                  Data Export
                </h3>
              </Link>
            </li>

            {/* <hr className="w-full border-gray-400" />

            <li className={`xl:w-full ${getSidebarClass("/quotation-section")}`}>
              <Link
                to="/quotation-section"
                className="flex flex-col items-center py-1"
              >
                <BsFileEarmarkPerson className="text-white text-2xl md:text-3xl" />
                <h3 className="text-xs text-center max-md:pt-3 lg:inline text-white md:text-base">
                  Quotation 
                </h3>
              </Link>
            </li> */}

                        <hr className="w-full border-gray-400" />
              <li className={`xl:w-full ${getSidebarClass("/Project-Dash")}`}>
              <Link to="/Project-Dash" className="flex flex-col items-center py-3">
                <RiSecurePaymentLine className="text-white text-2xl md:text-3xl" />
                <h3 className="text-xs max-md:pt-3 lg:inline text-white md:text-base">
                  Project
                </h3>
              </Link>
            </li>


            <hr className="w-full border-gray-400" />

            <li className={`xl:w-full ${getSidebarClass("/employee-management")}`}>
              <Link
                to="/employee-management"
                className="flex flex-col items-center py-3"
              >
                <MdOutlineManageAccounts className="text-white text-2xl md:text-3xl" />
                <h3 className="text-xs text-center max-md:pt-3 lg:inline text-white md:text-base">
                  Employees Management
                </h3>
              </Link>
            </li>
            <hr className="w-full border-gray-400" />
            <li className={`xl:w-full ${getSidebarClass("/admin-profile")}`}>
              <Link
                to="/admin-profile"
                className="flex flex-col items-center py-3"
              >
                <FaUserCircle className="text-white text-2xl md:text-3xl" />
                <h3 className="text-xs text-center max-md:pt-3 lg:inline text-white md:text-base">
                 Admin Profile
                </h3>
              </Link>
            </li>

         
          </ul>
        </div>
      </div>
    </>
  );
};

export default Sider;
