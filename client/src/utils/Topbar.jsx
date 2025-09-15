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
  console.log(user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [query, setQuery] = useState("");
  const [filteredPages, setFilteredPages] = useState([]);

  const role = user?.staff_role;
  const isLoggedIn = !!user;

  // Example: role can be "admin", "employee", or "superadmin"
  const isAdmin = role === "Admin";
  const isEmployee = role === "employee" || role === "Employee";
  const isSuperAdmin = role === "Super-Admin";

  const pages = [
    // Visible when logged in (generic dashboard by role)
    ...(isLoggedIn
      ? [
          {
            name: "Dashboard",
            path: isAdmin
              ? "/admin-dashboard"
              : isEmployee
              ? "/employees-dashboard"
              : isSuperAdmin
              ? "/super-admin-dashboard"
              : "/",
          },
        ]
      : []),

    // -------- ADMIN ROUTES --------
    ...(isAdmin
      ? [
          { name: "Leads", path: "/leads" },
          { name: "Social Media Leads", path: "/main-social-media-leads" },
          { name: "Import Data", path: "/admin-import-data" },
          { name: "Reports", path: "/admin-report" },
          { name: "Data Export", path: "/data-export" },
          { name: "Projects", path: "/admin-project" },
          { name: "Employee Management", path: "/employee-management" },
          { name: "Profile", path: "/admin-profile" },
          { name: "Total Leads", path: "/admin-total-leads" },
          { name: "Total Visits", path: "/admin-total-visit" },
          { name: "Closed Deals", path: "/admin-total-closed" },
          { name: "Sold Units", path: "/employee-sold-units" },
        ]
      : []),

    // -------- EMPLOYEE ROUTES --------
    ...(isEmployee
      ? [
          { name: "Leads", path: "/employee-leads" },
          { name: "Reports", path: "/employee-report" },
          { name: "Data Export", path: "/employee-data-export" },
          { name: "Profile", path: "/employee-profile" },
          { name: "Total Leads", path: "/employees-total-leads" },
          { name: "Visits", path: "/visit-data" },
          { name: "Closed Deals", path: "/close-data" },
          { name: "Sold Units", path: "/employee-sold" },
        ]
      : []),

    // -------- SUPERADMIN ROUTES --------
    ...(isSuperAdmin
      ? [
          { name: "Employee Leads", path: "/super-admin-employee-leads" },
          {
            name: "Social Media Leads",
            path: "/main-social-media-super-admin-leads",
          },
          { name: "Import Data", path: "/super-admin-import-data" },
          { name: "Reports", path: "/super-admin-reporting" },
          { name: "Data Export", path: "/super-admin-data-export" },
          { name: "Projects", path: "/Super-admin-project" },
          {
            name: "Employee Management",
            path: "/super-admin-employee-management",
          },
          { name: "Admin Management", path: "/super-admin-AdminManagement" },
          { name: "Profile", path: "/super-admin-profile" },
          { name: "Total Leads", path: "/super-admin-total-lead" },
          { name: "Total Visits", path: "/super-admin-total-visit" },
          { name: "Closed Deals", path: "/super-admin-close-data" },
          { name: "Sold Units", path: "/super-admin-Sold-Units" },
        ]
      : []),
  ];

  const pageTitle = location.pathname
    ?.split("/")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" / ");

  useEffect(() => {
    const timeout = setTimeout(() => {
      const lowerQuery = query.toLowerCase().trim();
      setFilteredPages(
        lowerQuery
          ? pages.filter((page) => page.name.toLowerCase().includes(lowerQuery))
          : []
      );
    }, 300); // Debounce input
    return () => clearTimeout(timeout);
  }, [query]);

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
    if (role === "superadmin") {
      navigate("/super-admin-profile");
    }

    if (role === "admin") {
      navigate("/admin-profile");
    }

    if (role === "employee") {
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
          <div className="flex items-center bg-gray-100 px-4 py-2 rounded-full text-gray-600 focus-within:ring-2 focus-within:ring-cyan-600 transition">
            <input
              type="text"
              placeholder="Search..."
              className="flex-1 bg-transparent focus:outline-none text-sm"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <FaSearch className="ml-2 text-cyan-600" />
          </div>
          {filteredPages.length > 0 && (
            <ul className="absolute mt-1 w-full bg-white border rounded-lg shadow z-50 overflow-hidden max-h-60 overflow-y-auto">
              {filteredPages.map((page, index) => (
                <li
                  key={index}
                  onClick={() => handleSelect(page.path)}
                  className="px-4 py-2 text-sm hover:bg-cyan-100 cursor-pointer transition"
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
            {getInitials(user?.staff_name)}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
