import { FaBell, FaSearch } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import logoTwo from "../assets/favicon_one.png";
import logoOne from "../assets/CRMGuruLogo.png";

import React from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

const Topbar = ({ isSidebarOpen }) => {
  const user = useSelector((state) => state.auth.user);
  console.log(user?.roles);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [query, setQuery] = useState("");
  const [branchData, setBranchData] = useState([]);
  const [filteredPages, setFilteredPages] = useState([]);

  const role = user?.roles;
  const isLoggedIn = !!user;
  // const isAdmin = role === "admin";

  // const pages = [
  //   // visible when logged in
  //   ...(isLoggedIn ? [{ name: "Dashboard", path: "/dashboard" }] : []),

  //   // admin-only
  //   ...(isAdmin
  //     ? [
  //         { name: "Students", path: "/admin-students" },
  //         { name: "Teachers", path: "/admin-teachers" },
  //         { name: "Classes", path: "/admin-classes" },
  //         { name: "Fees Management", path: "/admin-fees-management" },
  //         { name: "Reports", path: "/admin-reports" },
  //       ]
  //     : []),

  //   // any logged-in role
  //   ...(isLoggedIn
  //     ? [
  //         { name: "Attendance", path: "/admin-attendance" },
  //         { name: "Results", path: "/admin-results" },
  //         { name: "Exams", path: "/admin-exams" },
  //         { name: "Profile", path: "/profile" },
  //       ]
  //     : []),
  // ];

  // console.log(selectedBranch);

  const fetchBranchData = async () => {
    try {
      const { data } = await axios.get(
        `https://school-management.newdreamindia.com/api/v1/admin/getSchoolBranch`
      );
      setBranchData(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchBranchData();
  }, []);

  const pageTitle = location.pathname
    ?.split("/")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" / ");

  // useEffect(() => {
  //   const timeout = setTimeout(() => {
  //     const lowerQuery = query.toLowerCase().trim();
  //     setFilteredPages(
  //       lowerQuery
  //         ? pages.filter((page) => page.name.toLowerCase().includes(lowerQuery))
  //         : []
  //     );
  //   }, 300); // Debounce input
  //   return () => clearTimeout(timeout);
  // }, [query]);

  const handleSelect = (path) => {
    navigate(path);
    setQuery("");
    setFilteredPages([]);
  };

  const getInitials = (name) => {
    return name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const navigateToProfile = () => {
    if (role === "Super-Admin") {
      navigate("/super-admin-profile");
    }

    if (role === "Admin") {
      navigate("/admin-profile");
    }

    if (role === "Employee") {
      navigate("/employee-profile");
    }
  };

  return (
    <header
      className={`fixed top-0 right-0 z-50 flex justify-between items-center px-4 py-3 bg-white shadow-sm transition-all duration-300 ${
        isSidebarOpen ? "left-60" : "left-28"
      }`}
    >
      {/* Logo */}
      <div className="flex items-center gap-3">
        <img src={logoTwo} alt="Logo" className="h-12 w-14 object-contain" />
        <p className="text-xl font-bold text-cyan-600">
          CRMGuru <br />
          <span className="text-md font-bold text-gray-500">{pageTitle}</span>
        </p>
      </div>

      {/* Right Content */}
      <div className="flex items-center gap-6 relative">
        {/* Search */}

        <div className="relative w-64">
          <div className="flex items-center bg-gray-100 px-4 py-2 rounded-full text-gray-600 focus-within:ring-2 focus-within:ring-blue-500 transition">
            <input
              type="text"
              placeholder="Search..."
              className="flex-1 bg-transparent focus:outline-none text-sm"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <FaSearch className="ml-2" />
          </div>
          {filteredPages.length > 0 && (
            <ul className="absolute mt-1 w-full bg-white border rounded-lg shadow z-50 overflow-hidden max-h-60 overflow-y-auto">
              {filteredPages.map((page, index) => (
                <li
                  key={index}
                  onClick={() => handleSelect(page.path)}
                  className="px-4 py-2 text-sm hover:bg-blue-100 cursor-pointer transition"
                >
                  {page.name}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-2">
          {/* <img
            src="https://i.pravatar.cc/150?img=48"
            alt="User avatar"
            className="rounded-full w-10 h-10 object-cover"
          /> */}
          <button
            onClick={navigateToProfile}
            className="bg-cyan-600 text-white text-xl font-bold w-10 h-10 p-6 flex items-center justify-center rounded-full"
          >
            {getInitials(user?.user?.name)}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
