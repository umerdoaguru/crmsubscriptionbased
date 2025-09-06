import { useState } from "react";
import React from "react";
import Sidebar from "../../utils/Sidebar";
import Topbar from "../../utils/Topbar";
import TotalEmpLeadContent from "../../components/EmployeeModule/EmployeeDashboardCards/AdminDashBoardCards/TotalEmpLeadContent";
import VisitTableContent from "../../components/EmployeeModule/VisitTableContent";

const EmployeeVisitTable = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div>
      <div className="flex min-h-screen w-full">
        {/* Sidebar */}
        <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

        {/* Main Content */}
        <div
          className={`main-content transition-all w-full duration-300 ${
            isSidebarOpen ? "ml-60" : "ml-28"
          }`}
        >
          <Topbar isSidebarOpen={isSidebarOpen} />
          <div className=""></div>

          <VisitTableContent />
        </div>
      </div>
    </div>
  );
};
export default EmployeeVisitTable;
