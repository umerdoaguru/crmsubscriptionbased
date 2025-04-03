import React, { useState } from "react";

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
import AdminOverviewDash from "./AdminOverviewDash";
import Projectshow from "../components/Project/projectshow";
import DealClosedGraph from './DealClosedGraph';

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  const getInvoiceData = () => {
    try {
      const response = axios.get("https://crmdemo.vimubds5.a2hosted.com/api/invoiceData");
    } catch (err) {}
  };

  return (
    <>
      <MainHeader />
      <Sider />
      <h1 className="text-2xl text-center mt-[5rem]">Admin Dashboard</h1>
      <div className="mx-auto h-[3px] w-16 bg-[#34495E] my-3"></div>
      <div className="flex min-h-screen overflow-hidden ">
        {/* Main Content */}
        <div className="flex-1 max-w-full 2xl:w-[93%] 2xl:ml-32 ">
          {/* Hamburger Menu Button for Mobile */}
          {/* <div className="p-4 lg:hidden">
                    <button onClick={toggleSidebar} className="text-2xl">
                        <FaBars />
                    </button>
                </div> */}

          {/* Adjust grid layout for different screen sizes */}
          <div>
            <AdminOverviewDash />
          </div>
          <div className="grid grid-cols-1 gap-2 mt-6 mx-7 md:grid-cols-2 lg:grid-cols-3">
            <LeadsGraph />
            <Invoice />

            <DealClosedGraph/>
          </div>
          <LeadsReport />
          {/* <ToDoList /> */}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
