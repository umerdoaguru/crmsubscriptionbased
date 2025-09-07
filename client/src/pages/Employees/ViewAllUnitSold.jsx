import { useState } from "react";
import React from "react";
import Sidebar from "../../utils/Sidebar";
import Topbar from "../../utils/Topbar";
import ViewAllRemarkContent from "../../components/Leads/ViewAllRemarkContent";
import ViewAllUnitSoldContent from "../../components/Leads/ViewAllUnitSoldContent";

const ViewAllUnitSold = () => {
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

          <ViewAllUnitSoldContent />
        </div>
      </div>
    </div>
  );
};
export default ViewAllUnitSold;
