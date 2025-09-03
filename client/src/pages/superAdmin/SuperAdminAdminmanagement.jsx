import { useState } from "react";
import React from "react";
import Sidebar from "../../utils/Sidebar";
import Topbar from "../../utils/Topbar";
import SuperReportsContent from "../../adiComponent/Super-Admin/SuperReportsContent";
import SuperDataExportContent from "../../adiComponent/Super-Admin/SuperDataExportContent";
import SuperAdminAdminmanagementContent from "../../adiComponent/Super-Admin/SuperAdminAdminmanagementContent";

const SuperAdminAdminmanagement = () => {
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

          <SuperAdminAdminmanagementContent />
        </div>
      </div>
    </div>
  );
};
export default SuperAdminAdminmanagement;
