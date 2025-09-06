import React, { useState } from "react";
import Overview from "./Overview2";
import axios from "axios";
import SuperLeadGraph from "./Super-Admin/SuperLeadGraph";
import SuperLeadAllVisitChart from "./Super-Admin/SuperLeadAllVisitChart";
import SuperDealClosedGraph from "./Super-Admin/SuperDealClosedGraph";
import SuperLeadsToday from "./Super-Admin/SuperLeadsToday";

const SuperDashContent = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  const getInvoiceData = () => {
    try {
      const response = axios.get(
        "https://crm-generalize.dentalguru.software/api/invoiceData"
      );
    } catch (err) {}
  };

  return (
    <>
      <div className="flex mt-20">
        <div className="w-full min-h-screen bg-[#F9FAFF] p-2">
          <div className="">
            <div>
              <h2 className="text-2xl font-bold text-gray-600 mt-2">
                Super Admin Dashboard
              </h2>
            </div>

            <div className="flex min-h-screen overflow-hidden ">
              <div className="flex-1 max-w-full">
                <div>
                  <Overview />
                </div>
                <div className="grid grid-cols-1 gap-2 mx-7 mt-6 md:grid-cols-2 lg:grid-cols-3">
                  <SuperLeadGraph />
                  <SuperLeadAllVisitChart />
                  <SuperDealClosedGraph />
                </div>

                <SuperLeadsToday />
                {/* <ToDoList /> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SuperDashContent;
