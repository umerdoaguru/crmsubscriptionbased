import { NavLink, useLocation, useNavigate } from "react-router-dom";
import React from "react";
import { FaMoneyCheck } from "react-icons/fa";
import { AiOutlineLogout } from "react-icons/ai";
import { GiHamburgerMenu, GiTeacher } from "react-icons/gi";
import { MdDashboard } from "react-icons/md";
import { SiGoogleclassroom } from "react-icons/si";
import { TbHexagon3D, TbReport } from "react-icons/tb";
import { PiStudentBold } from "react-icons/pi";
import { HiDocumentReport } from "react-icons/hi";
import { TiSocialInstagramCircular } from "react-icons/ti";
import { GrProjects, GrTableAdd } from "react-icons/gr";
import { LuImport } from "react-icons/lu";
import { BiExport } from "react-icons/bi";
import { ImProfile } from "react-icons/im";
// import { clearUser } from "../redux/admin/adminSlice";
import { useDispatch, useSelector } from "react-redux";
import { IoIosPeople } from "react-icons/io";
import { RiAdminFill } from "react-icons/ri";
import { logoutUser } from "../store/UserSlice";
import logoTwo from "../assets/favicon_one.png";
import logoOne from "../assets/CRMGuruLogo.png";

const Sidebar = ({ isSidebarOpen, toggleSidebar }) => {
  const user = useSelector((state) => state.auth.user);
  console.log(user?.roles);
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const menuItems = [
    ...(user?.roles === "Super-Admin"
      ? [
          {
            name: "Dashboard",
            path: "/super-admin-dashboard",
            icon: <MdDashboard />,
          },

          {
            name: "Leads",
            path: "/super-admin-employee-leads",
            icon: <GrTableAdd />,
          },
          {
            name: "Social Media Leads",
            path: "/main-social-media-super-admin-leads",
            icon: <TiSocialInstagramCircular />,
          },
          {
            name: "Import Data",
            path: "/super-admin-import-data",
            icon: <LuImport />,
          },
          {
            name: "Reports",
            path: "/super-admin-reporting",
            icon: <TbReport />,
          },
          {
            name: "Data Export",
            path: "/super-admin-data-export",
            icon: <BiExport />,
          },
          {
            name: "Project",
            path: "/super-admin-project-dash",
            icon: <GrProjects />,
          },
          {
            name: "Employees Management",
            path: "/super-admin-employee-management",
            icon: <IoIosPeople />,
          },
          {
            name: "Admin Management",
            path: "/super-admin-AdminManagement",
            icon: <RiAdminFill />,
          },
        ]
      : []),

    ...(user?.roles === "Admin"
      ? [
          {
            name: "Dashboard",
            path: "/admin-dashboard",
            icon: <MdDashboard />,
          },

          {
            name: "Leads",
            path: "/leads",
            icon: <GrTableAdd />,
          },
          {
            name: "Social Media Leads",
            path: "/main-social-media-leads",
            icon: <TiSocialInstagramCircular />,
          },
          {
            name: "Import Data",
            path: "/admin-import-data",
            icon: <LuImport />,
          },
          {
            name: "Reports",
            path: "/admin-report",
            icon: <TbReport />,
          },

          {
            name: "Data Export",
            path: "/data-export",
            icon: <BiExport />,
          },

          {
            name: "Project",
            path: "/Project-Dash",
            icon: <GrProjects />,
          },
          {
            name: "Employees Management",
            path: "/employee-management",
            icon: <RiAdminFill />,
          },
        ]
      : []),

    ...(user?.roles === "Employee"
      ? [
          {
            name: "Dashboard",
            path: "/employees-dashboard",
            icon: <MdDashboard />,
          },

          {
            name: "Assigned Leads",
            path: "/employee-leads",
            icon: <GrTableAdd />,
          },
          {
            name: "Reports",
            path: "/employee-report",
            icon: <TbReport />,
          },
          {
            name: "Data Export",
            path: "/employee-data-export",
            icon: <BiExport />,
          },
        ]
      : []),
  ];

  const logoutHandler = () => {
    const isConfirmed = window.confirm("Are you sure you want to Logout?");
    if (isConfirmed) {
      dispatch(logoutUser());
      navigate("/");
    }
  };

  return (
    <div
      className={`${
        isSidebarOpen ? "w-60" : "w-28"
      } h-screen fixed p-2 flex flex-col bg-white`}
    >
      {/* Top Logo and Hamburger */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-md font-bold text-cyan-600">
          {isSidebarOpen ? (
            // user?.roles === "admin" ? (
            //   "Admin Dashboard"
            // ) : (
            //   "CRMGuru"
            // )
            <>
              <img src={logoOne} alt="logo" srcset="" className="h-10 w-36" />
            </>
          ) : (
            <>
              <img src={logoTwo} alt="logo" srcset="" className="h-12 w-12" />
            </>
          )}
        </h1>
        <button
          onClick={toggleSidebar}
          className="p-2 text-gray-400 hover:text-gray-600 focus:outline-none"
        >
          <GiHamburgerMenu />
        </button>
      </div>

      {/* Scrollable Menu */}
      <div className="flex-1 overflow-y-auto flex flex-col gap-4 thin-scrollbar">
        <nav className="flex flex-col gap-2">
          {menuItems.map((item, idx) => (
            <NavLink
              to={item.path}
              key={idx}
              className={({ isActive }) =>
                `flex items-center ${
                  isSidebarOpen ? "justify-start gap-2 px-4" : "justify-center"
                } py-2 rounded-md font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-[#EEF0FF] text-cyan-600 rounded-xl"
                    : "text-gray-700 hover:text-cyan-800"
                }`
              }
              title={item.name}
            >
              {item.icon}
              {isSidebarOpen && <span className="text-sm">{item.name}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Logout Button */}
        <button
          className={`mt-auto bg-cyan-600 text-white py-2 rounded flex items-center ${
            isSidebarOpen ? "justify-start gap-2 px-4" : "justify-center"
          }`}
          onClick={logoutHandler}
        >
          <AiOutlineLogout />
          {isSidebarOpen && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
