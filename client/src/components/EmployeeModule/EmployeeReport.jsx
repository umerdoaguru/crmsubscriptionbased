import React, { useState, useEffect } from "react";
import { BsDownload, BsFilter } from "react-icons/bs";
import * as XLSX from "xlsx";

import axios from "axios";


import MainHeader from "../MainHeader";
import EmployeeSider from "./EmployeeSider";
import { useSelector } from "react-redux";
import moment from "moment";
import EmpLeadReport from "./EmployeeReport/EmpLeadReport";
import EmpVisitReport from "./EmployeeReport/EmpVisitReport";
import EmpClosedDealReport from "./EmployeeReport/EmpClosedDealReport";
import EmployeeSoldUnits from "./EmployeeReport/EmployeeSoldUnits";


const EmployeeReport = () => 
  {
   
    const [selectedComponent, setSelectedComponent] = useState("LeadData"); // Set 'LeadData' as default
  
   
  

  
    return (
      <>
        <MainHeader />
        <EmployeeSider />
        <div className="container 2xl:w-[93%] 2xl:ml-32  ">
          <h1 className="text-2xl text-center mt-[5rem] font-medium">
           Report
          </h1>
          <div className="mx-auto h-[3px] w-16 bg-[#34495E] my-3"></div>
  
          <div className="flex flex-wrap  mt-5">
            <div className=" my-3 p-0 sm-mx-0 mx-3 ">
              <div
                className={` shadow-lg rounded-lg overflow-hidden cursor-pointer ${
                  selectedComponent === "LeadData" ? "bg-blue-500 text-white" : ""
                }`} // Change background color if active
                onClick={() => setSelectedComponent("LeadData")} // Set selected component
              >
                <div className="p-2 flex flex-col items-center text-center">
                  <div
                    className={`text-3xl ${
                      selectedComponent === "LeadData"
                        ? "text-white"
                        : "text-gray-700"
                    }`}
                  >
                  
                  </div>
                  <div className="">
                    <p
                      className={` text-xl font-semibold ${
                        selectedComponent === "LeadData"
                          ? "text-white"
                          : "text-gray-800"
                      }`}
                    >
                      Leads
                    </p>
                  
                  </div>
                </div>
              </div>
            </div>
  
     
  
          {/* Card for Visit Data */}
          <div className=" my-3 p-0 sm-mx-0 mx-3">
              <div
                className={`shadow-lg rounded-lg overflow-hidden cursor-pointer ${
                  selectedComponent === "VisitData"
                    ? "bg-blue-500 text-white"
                    : ""
                }`}
                onClick={() => setSelectedComponent("VisitData")}
              >
                <div className="p-2 flex flex-col items-center text-center">
                  <div
                    className={`text-3xl ${
                      selectedComponent === "VisitData"
                        ? "text-white"
                        : "text-gray-700"
                    }`}
                  >
                  
                  </div>
                  <div className="">
                    <h5
                      className={`text-xl font-semibold ${
                        selectedComponent === "VisitData"
                          ? "text-white"
                          : "text-gray-800"
                      }`}
                    >
                     Site Visit 
                    </h5>
                   
                  </div>
                </div>
              </div>
            </div>
  
            {/* Card for Closed Data */}
            <div className=" my-3 p-0 sm-mx-0 mx-3">
              <div
                className={`shadow-lg rounded-lg overflow-hidden cursor-pointer ${
                  selectedComponent === "ClosedData"
                    ? "bg-blue-500 text-white"
                    : ""
                }`}
                onClick={() => setSelectedComponent("ClosedData")}
              >
                <div className="p-2 flex flex-col items-center text-center">
                  <div
                    className={`text-3xl ${
                      selectedComponent === "ClosedData"
                        ? "text-white"
                        : "text-gray-700"
                    }`}
                  >
                
                  </div>
                  <div className="">
                    <h5
                      className={`text-xl font-semibold ${
                        selectedComponent === "ClosedData"
                          ? "text-white"
                          : "text-gray-800"
                      }`}
                    >
                      Closed Deal
                    </h5>
                   
                  </div>
                </div>
              </div>
            </div>

            {/* Card for Sold Unit Data */}
            <div className=" my-3 p-0 sm-mx-0 mx-3">
              <div
                className={`shadow-lg rounded-lg overflow-hidden cursor-pointer ${
                  selectedComponent === "SoldUnits"
                    ? "bg-blue-500 text-white"
                    : ""
                }`}
                onClick={() => setSelectedComponent("SoldUnits")}
              >
                <div className="p-2 flex flex-col items-center text-center">
                  <div
                    className={`text-3xl ${
                      selectedComponent === "SoldUnits"
                        ? "text-white"
                        : "text-gray-700"
                    }`}
                  >
                
                  </div>
                  <div className="">
                    <h5
                      className={`text-xl font-semibold ${
                        selectedComponent === "SoldUnits"
                          ? "text-white"
                          : "text-gray-800"
                      }`}
                    >
                      Sold Units
                    </h5>
                   
                  </div>
                </div>
              </div>
            </div>
            
          </div>
  
          {/* Conditionally render the selected component */}
          <div className="w-full h-[calc(100vh-10rem)] overflow-y-auto">
            {selectedComponent === "LeadData" && <EmpLeadReport/> }
          
            {selectedComponent === "VisitData" && <EmpVisitReport/> }
            {selectedComponent === "ClosedData" && <EmpClosedDealReport/> }
            {selectedComponent === "SoldUnits" && <EmployeeSoldUnits/> }
          </div>
        </div>
      </>
    );
  }
export default EmployeeReport;
