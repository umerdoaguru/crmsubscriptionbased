import React, { useState } from "react";
import LeadsReport from "./LeadsReport";
import Invoice from "./Invoice";
import LeadsGraph from "./LeadsGraph";
import AdminOverviewDash from "./AdminOverviewDash";
import DealClosedGraph from "./DealClosedGraph";
import LeadVisitChart from "./AdminComp/LeadVisitChart";

const AdminDashboardContent = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      <div className="flex mt-20">
        <div className="w-full min-h-screen bg-[#F9FAFF] p-2">
          <h2 className="text-2xl text-center mt-[2rem]">Admin Dashboard</h2>
          <div className="mx-auto h-[3px] w-16 bg-cyan-600 my-1"></div>
          <div className="flex min-h-screen overflow-hidden ">
            {/* Main Content */}
            <div className="flex-1 max-w-full">
              <div>
                <AdminOverviewDash />
              </div>
              <div className="grid grid-cols-1 gap-2 mt-6 mx-7 md:grid-cols-2 lg:grid-cols-3">
                <LeadsGraph />
                <LeadVisitChart />
                <DealClosedGraph />
              </div>
              <LeadsReport />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboardContent;
