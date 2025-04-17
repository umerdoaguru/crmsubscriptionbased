import React, { useState } from "react";
import Overview from "./Overview2";
import PaymentsGraph from "./QuotationGraph";
import DevicesGraph from "./LeadsGraph";
import LeadsReport from "./LeadsReport";
import ToDoList from "./Todo";
import Sider from "../components/Sider";
import { FaBars, FaTimes } from "react-icons/fa"; // Icons for hamburger and close
import MainHeader from "./../components/MainHeader";
import Invoice from "./Invoice";
import axios from "axios";
import LeadsGraph from "./LeadsGraph";
import QuotationGraph from "./QuotationGraph";
import SuperAdminSider from "./Super-Admin/SuperAdminSider";
import SuperHeader from "./Super-Admin/SuperHeader";
import DealGraph from "./DealClosedGraph";
import SuperLeadGraph from "./Super-Admin/SuperLeadGraph";
import SuperLeadAllVisitChart from "./Super-Admin/SuperLeadAllVisitChart";
import SuperDealClosedGraph from "./Super-Admin/SuperDealClosedGraph";
import SuperLeadsToday from "./Super-Admin/SuperLeadsToday";

const SuperDash = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  const getInvoiceData = () => {
    try {
      const response = axios.get("http://localhost:9000/api/invoiceData");
    } catch (err) {}
  };

  return (
    <>
      <MainHeader />
      <SuperAdminSider />
      {/* <SuperHeader /> */}

      <div className="">
        <h1 className="text-2xl text-center mt-[5rem] font-medium">
          Super Admin Dashboard
        </h1>
        <div className="mx-auto h-[3px] w-16 bg-[#34495E] my-3"></div>
        <div className="flex min-h-screen overflow-hidden ">
          <div className="flex-1 max-w-full 2xl:w-[93%] 2xl:ml-32 ">
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
    </>
  );
};

export default SuperDash;
