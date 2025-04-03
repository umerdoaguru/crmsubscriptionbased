import React, { useState, useEffect } from "react";
import { BsDownload, BsFilter } from "react-icons/bs";
import * as XLSX from "xlsx";

import axios from "axios";

import moment from "moment";
import SuperAdminSider from "./SuperAdminSider";
import MainHeader from "./../../components/MainHeader";
import Pagination from "../comp/pagination";
import cogoToast from "cogo-toast";
import LeadReport from "../../components/AdminReport/LeadReport";
import VisitReport from "../../components/AdminReport/VisitReport";
import ClosedDealReport from "../../components/AdminReport/ClosedDealReport";
import { useSelector } from "react-redux";
import SuperLeadReport from "./SuperAdminReport/SuperLeadReport";
import SuperVisitReport from "./SuperAdminReport/SuperVisitReport";
import SuperClosedDealReport from "./SuperAdminReport/SuperClosedDealReport";
import SoldAdminSoldUnitReport from "./SuperAdminReport/SuperAdminSoldUnitReport";
const d_fileds = {
  // quotation: {
  //   heading: ["Id", "Quotation Name", "Employee Name", "Date"],
  //   columns: [
  //     "quotation_id",
  //     "quotation_name",
  //     "employee_name",
  //     "created_date",
  //   ],
  //   quotation: [],
  // },
  // invoice: {
  //   heading: [
  //     "id ",
  //     "Invoice Name",
  //     "Employee Name",
  //     "Amount",
  //     "Payment Mode",
  //     "Date",
  //   ],
  //   columns: [
  //     "invoice_id",
  //     "invoice_name",
  //     "employee_name",
  //     "offer_price",
  //     "payment_mode",
  //     "created_date",
  //   ],
  //   invoice: [],
  // },

  leads: {
    heading: [
      "Lead No.",
      "Assigned To",
      "Lead Name",
      "subject",
      "Phone Number",
      "Date",
      "Lead Status",
      "Lead Source",
      "Quotation Status",
      "Deal Status",
      "FollowUp Status",
    ],
    columns: [
      "lead_no",
      "assignedTo",
      "name",
      "subject",
      "phone",
      "createdTime",
      "lead_status",
      "leadSource",
      "quotation_status",
      "deal_status",
      "follow_up_status",
    ],
    leads: [],
  },
  visit: {
    heading: [
      "S.no.",
      "Lead Id.",
      "Name",
      "Employee Name",

      "visit",
      "visit date",
      "report",
    ],
    columns: [
      "id",
      "lead_id",

      "name",
      "employee_name",

      "visit_date",
      "visit",
      "report",
    ],
    visit: [],
  },
  closed: {
    heading: [
      "Lead No.",
      "Assigned To",
      "Lead Name",
      "subject",
      "Phone Number",
      // "Date",
      "Lead Source",
      "visit date",
      "visit",
      // "Quotation Status",
      // "Invoice Status",
      "Deal Status",
      "Deal Close Date",
      "FollowUp Status",
    ],
    columns: [
      "lead_no",
      "assignedTo",
      "name",
      "subject",
      "phone",
      // "createdTime",
      "leadSource",
      "visit_date",
      "visit",
      // "quotation_status",
      // "invoice_status",
      "deal_status",
      "d_closeDate",
      "follow_up_status",
    ],
    closed: [],
  },
};

const SuperReports = () =>
  {
    const [leads, setLeads] = useState([]);
    const [visit, setVisit] = useState([]);
  
    const [employee, setEmployee] = useState([]);
    const [quotation, setQuotation] = useState([]);
    const [invoice, setInvoice] = useState([]);
    const [selectedComponent, setSelectedComponent] = useState("LeadData"); // Set 'LeadData' as default
  
    const UserId = useSelector((state) => state.auth.user.id);
  
    useEffect(() => {
      fetchLeads();
      fetchEmployee();
      fetchQuotation();
      fetchInvoice();
      fetchVisit();
    }, []);
  
    const fetchLeads = async () => {
      try {
        const response = await axios.get("https://crmdemo.vimubds5.a2hosted.com/api/leads");
        setLeads(response.data);
      } catch (error) {
        console.error("Error fetching leads:", error);
      }
    };
  
    const fetchEmployee = async () => {
      try {
        const response = await axios.get(`https://crmdemo.vimubds5.a2hosted.com/api/employee`);
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
    const fetchVisit = async () => {
      try {
        const response = await axios.get(
          `https://crmdemo.vimubds5.a2hosted.com/api/employe-all-visit`
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
   
  
    const visitCount = visit.length;
  
  
    const closedCount = leads.filter(
      (lead) => lead.deal_status === "close"
    ).length; // Get count for Closed Data
  
    return (
      <>
        <MainHeader />
        <SuperAdminSider />
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

            {/* Card for sold Unit Data */}
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
            {selectedComponent === "LeadData" && <SuperLeadReport/> }
          
            {selectedComponent === "VisitData" && <SuperVisitReport/> }
            {selectedComponent === "ClosedData" && <SuperClosedDealReport/> }
            {selectedComponent === "SoldUnits" && <SoldAdminSoldUnitReport/> }
          </div>
        </div>
      </>
    );
  }

export default SuperReports;
