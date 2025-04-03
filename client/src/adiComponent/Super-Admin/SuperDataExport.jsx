import React, { useEffect, useState } from "react";



import { Link } from "react-router-dom";
import axios from "axios";
import { SiMoneygram } from "react-icons/si";
import { MdOutlineNextWeek } from "react-icons/md";
import { GiFiles, GiMoneyStack } from "react-icons/gi";
import { useSelector } from "react-redux";


import Employees from "./../../components/DataExport/Employees";
import { FaCheckCircle, FaClipboardList } from "react-icons/fa";


import SuperAdminSider from "./SuperAdminSider";
import MainHeader from './../../components/MainHeader';

import SuperLeadData from "./SuperDataExport/SuperLeadData";
import SuperEmployees from "./SuperDataExport/SuperEmployees";
import SuperVisitData from "./SuperDataExport/SuperVisitData";
import SuperCloseData from "./SuperDataExport/SuperCloseDateData";
import SuperSoldnit from "./SuperDataExport/SuperSolddUnit";

function SuperDataExport() {
  const [leads, setLeads] = useState([]);
  const [visit, setVisit] = useState([]);
  const [employeesold, setemployeesold] = useState([]);
  const [employee, setEmployee] = useState([]);
  const [quotation, setQuotation] = useState([]);
  const [invoice, setInvoice] = useState([]);
  const [selectedComponent, setSelectedComponent] = useState("LeadData"); // Set 'LeadData' as default

  const superadminuser = useSelector((state) => state.auth.user);
  const token = superadminuser.token;

  useEffect(() => {
    fetchLeads();
    fetchEmployee();
    fetchQuotation();
    fetchInvoice();
    fetchVisit();
    employeesoldunit();
  }, []);

  const fetchLeads = async () => {
    try {
      const response = await axios.get("https://crmdemo.vimubds5.a2hosted.com/api/leads-super-admin",
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }});
      setLeads(response.data);
    } catch (error) {
      console.error("Error fetching leads:", error);
    }
  };


  const fetchEmployee = async () => {
    try {
      const response = await axios.get(`https://crmdemo.vimubds5.a2hosted.com/api/employee-super-admin`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }});
      setEmployee(response.data);
    } catch (error) {
      console.error("Error fetching employee data:", error);
    }
  };

  const fetchQuotation = async () => {
    try {
      const response = await axios.get(
        `https://crmdemo.vimubds5.a2hosted.com/api/quotation-data`
      );
      setQuotation(response.data);
    } catch (error) {
      console.error("Error fetching quotations:", error);
    }
  };

  const fetchInvoice = async () => {
    try {
      const response = await axios.get(
        `https://crmdemo.vimubds5.a2hosted.com/api/invoice-data`
      );
      setInvoice(response.data);
    } catch (error) {
      console.error("Error fetching invoices:", error);
    }
  };
  const employeesoldunit = async () => {
    try {
      const response = await axios.get(
        `https://crmdemo.vimubds5.a2hosted.com/api/super-admin-unit-sold`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }}
      );
      console.log(response.data);
      setemployeesold(response.data);
    
    } catch (error) {
      console.error("Error fetching quotations:", error);
    }
  };
  const fetchVisit = async () => {
    try {
      const response = await axios.get(
       `https://crmdemo.vimubds5.a2hosted.com/api/employe-all-visit-super-admin`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }}
      );
      console.log(response.data);
      setVisit(response.data);
      // Ensure proper comparison with 'Created', trim any spaces and normalize the case
    
    } catch (error) {
      console.error("Error fetching quotations:", error);
    }
  };
  const leadCount = leads.filter(
    (lead) => lead.lead_status === "completed"
  ).length; 
  const employeeCount = employee.length;
 

  const visitCount = leads.filter((lead) =>
    ["fresh", "re-visit", "self", "associative"].includes(lead.visit)
  ).length;


  const closedCount = leads.filter(
    (lead) => lead.deal_status === "close"
  ).length; // Get count for Closed Data

  const soldUnits = employeesold.length;
  return (
    <>
      <MainHeader />
      <SuperAdminSider />
      <div className="container 2xl:w-[93%] 2xl:ml-32">
        <h1 className="text-2xl text-center mt-[5rem] font-medium">
          Data Export
        </h1>
        <div className="mx-auto h-[3px] w-16 bg-[#34495E] my-3"></div>

        <div className="flex flex-wrap justify-around mt-5">
          <div className="w-full sm:w-1/2 lg:w-1/4 xl:w-1/5 my-3 p-0 sm-mx-0 mx-3 ">
            <div
              className={` shadow-lg rounded-lg overflow-hidden cursor-pointer ${
                selectedComponent === "LeadData" ? "bg-blue-500 text-white" : ""
              }`} // Change background color if active
              onClick={() => setSelectedComponent("LeadData")} // Set selected component
            >
              <div className="p-4 flex flex-col items-center text-center">
                <div
                  className={`text-3xl ${
                    selectedComponent === "LeadData"
                      ? "text-white"
                      : "text-gray-700"
                  }`}
                >
                  <GiFiles />
                </div>
                <div className="mt-2">
                  <h5
                    className={`text-xl font-semibold ${
                      selectedComponent === "LeadData"
                        ? "text-white"
                        : "text-gray-800"
                    }`}
                  >
                    Leads Data
                  </h5>
                  <p
                    className={`${
                      selectedComponent === "LeadData"
                        ? "text-white"
                        : "text-gray-600"
                    }`}
                  >
                    {leadCount}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* <div className="w-full sm:w-1/2 lg:w-1/4 xl:w-1/5 my-3 p-0 sm-mx-0 mx-3">
            <div
              className={` shadow-lg rounded-lg overflow-hidden cursor-pointer ${
                selectedComponent === "EmployeeData"
                  ? "bg-blue-500 text-white"
                  : ""
              }`} // Change background color if active
              onClick={() => setSelectedComponent("EmployeeData")} // Set selected component
            >
              <div className="p-4 flex flex-col items-center text-center">
                <div
                  className={`text-3xl ${
                    selectedComponent === "EmployeeData"
                      ? "text-white"
                      : "text-gray-700"
                  }`}
                >
                  <SiMoneygram />
                </div>
                <div className="mt-2">
                  <h5
                    className={`text-xl font-semibold ${
                      selectedComponent === "EmployeeData"
                        ? "text-white"
                        : "text-gray-800"
                    }`}
                  >
                    Employees Data
                  </h5>
                  <p
                    className={`${
                      selectedComponent === "EmployeeData"
                        ? "text-white"
                        : "text-gray-600"
                    }`}
                  >
                    {employeeCount}
                  </p>
                </div>
              </div>
            </div>
          </div> */}

        {/* Card for Visit Data */}
        <div className="w-full sm:w-1/2 lg:w-1/4 xl:w-1/5 my-3 p-0 sm-mx-0 mx-3">
            <div
              className={`shadow-lg rounded-lg overflow-hidden cursor-pointer ${
                selectedComponent === "VisitData"
                  ? "bg-blue-500 text-white"
                  : ""
              }`}
              onClick={() => setSelectedComponent("VisitData")}
            >
              <div className="p-4 flex flex-col items-center text-center">
                <div
                  className={`text-3xl ${
                    selectedComponent === "VisitData"
                      ? "text-white"
                      : "text-gray-700"
                  }`}
                >
                  <FaClipboardList />
                </div>
                <div className="mt-2">
                  <h5
                    className={`text-xl font-semibold ${
                      selectedComponent === "VisitData"
                        ? "text-white"
                        : "text-gray-800"
                    }`}
                  >
                    Site Visits Data
                  </h5>
                  <p
                    className={`${
                      selectedComponent === "VisitData"
                        ? "text-white"
                        : "text-gray-600"
                    }`}
                  >
                    {visitCount}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Card for Closed Data */}
          <div className="w-full sm:w-1/2 lg:w-1/4 xl:w-1/5 my-3 p-0 sm-mx-0 mx-3">
            <div
              className={`shadow-lg rounded-lg overflow-hidden cursor-pointer ${
                selectedComponent === "ClosedData"
                  ? "bg-blue-500 text-white"
                  : ""
              }`}
              onClick={() => setSelectedComponent("ClosedData")}
            >
              <div className="p-4 flex flex-col items-center text-center">
                <div
                  className={`text-3xl ${
                    selectedComponent === "ClosedData"
                      ? "text-white"
                      : "text-gray-700"
                  }`}
                >
                  <FaCheckCircle />
                </div>
                <div className="mt-2">
                  <h5
                    className={`text-xl font-semibold ${
                      selectedComponent === "ClosedData"
                        ? "text-white"
                        : "text-gray-800"
                    }`}
                  >
                    Closed Deal Data
                  </h5>
                  <p
                    className={`${
                      selectedComponent === "ClosedData"
                        ? "text-white"
                        : "text-gray-600"
                    }`}
                  >
                    {closedCount}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full sm:w-1/2 lg:w-1/4 xl:w-1/5 my-3 p-0 sm-mx-0 mx-3">
            <div
              className={`shadow-lg rounded-lg overflow-hidden cursor-pointer ${
                selectedComponent === "SoldData"
                  ? "bg-blue-500 text-white"
                  : ""
              }`}
              onClick={() => setSelectedComponent("SoldData")}
            >
              <div className="p-4 flex flex-col items-center text-center">
                <div
                  className={`text-3xl ${
                    selectedComponent === "SoldData"
                      ? "text-white"
                      : "text-gray-700"
                  }`}
                >
                  <FaCheckCircle />
                </div>
                <div className="mt-2">
                  <h5
                    className={`text-xl font-semibold ${
                      selectedComponent === "SoldData"
                        ? "text-white"
                        : "text-gray-800"
                    }`}
                  >
                    Unit Sold Data
                  </h5>
                  <p
                    className={`${
                      selectedComponent === "SoldData"
                        ? "text-white"
                        : "text-gray-600"
                    }`}
                  >
                    {soldUnits}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
        </div>

        {/* Conditionally render the selected component */}
        <div className=" h-[calc(100vh-10rem)]  overflow-y-auto ">
          {selectedComponent === "LeadData" && <SuperLeadData />}
          {/* {selectedComponent === "EmployeeData" && <SuperEmployees />} */}
          {selectedComponent === "VisitData" && <SuperVisitData />}
          {selectedComponent === "ClosedData" && <SuperCloseData />}
          {selectedComponent === "SoldData" && <SuperSoldnit/>}
        </div>
      </div>
    </>
  );
}

export default SuperDataExport;