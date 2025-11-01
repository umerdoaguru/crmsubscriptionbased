import React, { useState } from "react";
import EmployeeLeadsGraph from "./DashboardCompo/EmployeeLeadGraph";
import EmployeeOverview from "./DashboardCompo/EmployeDashboardOverview";
import EmployeeLeadsReport from "./DashboardCompo/EmployeeLeadsReport";
import EmployeeVisitGraph from "./DashboardCompo/EmployeeVisitGraph";
import EmployeeCloseGraph from "./DashboardCompo/EmployeeCloseGraph";
import EmployeeLeadsDash from "./DashboardCompo/EmployeeLeadsDash";

function EmployeeDashboardContent() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  return (
    <>
      <div className="flex mt-20">
        <div className="w-[93%] sm:w-full min-h-screen bg-[#F9FAFF] p-2">
          <h2 className="text-2xl text-center mt-0 sm:mt-[2rem]">
            Employee Dashboard
          </h2>
          <div className="mx-auto h-[3px] w-16 bg-cyan-600 my-3"></div>
          <div className="flex min-h-screen overflow-hidden">
            {/* Main Content */}
            <div className="flex-1 max-w-full">
              <div>
                <EmployeeOverview />
              </div>
              <div className="grid grid-cols-1 gap-2 mt-6 mx-2 sm:mx-8 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
                <EmployeeLeadsGraph />
                <EmployeeVisitGraph />
                <EmployeeCloseGraph />
              </div>
              <EmployeeLeadsDash />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default EmployeeDashboardContent;
