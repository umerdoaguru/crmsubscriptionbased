// import React, { useEffect, useState } from "react";

// import { Link } from "react-router-dom";
// import axios from "axios";
// import { SiMoneygram } from "react-icons/si";
// import { MdOutlineNextWeek } from "react-icons/md";
// import { GiFiles, GiMoneyStack } from "react-icons/gi";
// import { useSelector } from "react-redux";
// import LeadData from "./EmployeeDataExport/EmployeeLeadData";
// import QuotationData from "./EmployeeDataExport/EmployeeQuotationData";
// import InvoiceData from "./EmployeeDataExport/EmployeeInvoiceData"; // Add your invoice component here if it exists
// import MainHeader from "../MainHeader";
// import EmployeeSider from "./EmployeeSider";
// import EmployeeLeadData from "./EmployeeDataExport/EmployeeLeadData";
// import EmployeeQuotationData from "./EmployeeDataExport/EmployeeQuotationData";
// import EmployeeInvoiceData from "./EmployeeDataExport/EmployeeInvoiceData";

// // import Employees from '../components/DataExport/Employees';

// function DataExport() {
//   const [leads, setLeads] = useState([]);
//   // const [employee, setEmployee] = useState([]);
//   const [quotation, setQuotation] = useState([]);
//   const [invoice, setInvoice] = useState([]);
//   const [selectedComponent, setSelectedComponent] = useState("LeadData"); // Set 'LeadData' as default

//   const EmpId = useSelector((state) => state.auth.user.id);

//   useEffect(() => {
//     fetchLeads();
//     // fetchEmployee();
//     fetchQuotation();
//     fetchInvoice();
//   }, []);

//   const fetchLeads = async () => {
//     try {
//       const response = await axios.get(
//         `https://crmdemo.vimubds5.a2hosted.com/api/employe-leads/${EmpId}`
//       );
//       setLeads(response.data);
//     } catch (error) {
//       console.error("Error fetching leads:", error);
//     }
//   };

//   // const fetchEmployee = async () => {
//   //   try {
//   //     const response = await axios.get(`https://crmdemo.vimubds5.a2hosted.com/api/employee`);
//   //     setEmployee(response.data);
//   //   } catch (error) {
//   //     console.error("Error fetching employee data:", error);
//   //   }
//   // };

//   const fetchQuotation = async () => {
//     try {
//       const response = await axios.get(
//         `https://crmdemo.vimubds5.a2hosted.com/api/get-quotation-byEmploye/${EmpId}`
//       );
//       setQuotation(response.data);
//     } catch (error) {
//       console.error("Error fetching quotations:", error);
//     }
//   };

//   const fetchInvoice = async () => {
//     try {
//       const response = await axios.get(
//         `https://crmdemo.vimubds5.a2hosted.com/api/get-employee-invoice/${EmpId}`
//       );
//       setInvoice(response.data);
//     } catch (error) {
//       console.error("Error fetching invoices:", error);
//     }
//   };

//   const leadCount = leads.length;
//   // const employeeCount = employee.length;
//   const quotationCount = quotation.length;
//   const invoiceCount = invoice.length;

//   return (
//     <>
//       <MainHeader />
//       <EmployeeSider />
//       <div className="container mt-[5rem]">
//         <h1 className="text-2xl text-center mt-[2rem]">Employee Data Export</h1>
//         <div className="mx-auto h-[3px] w-16 bg-[#34495E] my-3"></div>

//         <div className="flex flex-wrap justify-around mt-5">
//           <div className="w-full sm:w-1/2 lg:w-1/4 xl:w-1/5 my-3 p-0 sm-mx-0 mx-3 ">
//             <div
//               className={` shadow-lg rounded-lg overflow-hidden cursor-pointer ${
//                 selectedComponent === "LeadData" ? "bg-blue-500 text-white" : ""
//               }`} // Change background color if active
//               onClick={() => setSelectedComponent("LeadData")} // Set selected component
//             >
//               <div className="p-4 flex flex-col items-center text-center">
//                 <div
//                   className={`text-3xl ${
//                     selectedComponent === "LeadData"
//                       ? "text-white"
//                       : "text-gray-700"
//                   }`}
//                 >
//                   <GiFiles />
//                 </div>
//                 <div className="mt-2">
//                   <h5
//                     className={`text-xl font-semibold ${
//                       selectedComponent === "LeadData"
//                         ? "text-white"
//                         : "text-gray-800"
//                     }`}
//                   >
//                     Leads Data
//                   </h5>
//                   <p
//                     className={`${
//                       selectedComponent === "LeadData"
//                         ? "text-white"
//                         : "text-gray-600"
//                     }`}
//                   >
//                     {leadCount}
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="w-full sm:w-1/2 lg:w-1/4 xl:w-1/5 my-3 p-0 sm-mx-0 mx-3">
//             <div
//               className={` shadow-lg rounded-lg overflow-hidden cursor-pointer ${
//                 selectedComponent === "QuotationData"
//                   ? "bg-blue-500 text-white"
//                   : ""
//               }`} // Change background color if active
//               onClick={() => setSelectedComponent("QuotationData")} // Set selected component
//             >
//               <div className="p-4 flex flex-col items-center text-center">
//                 <div
//                   className={`text-3xl ${
//                     selectedComponent === "QuotationData"
//                       ? "text-white"
//                       : "text-gray-700"
//                   }`}
//                 >
//                   <MdOutlineNextWeek />
//                 </div>
//                 <div className="mt-2">
//                   <h5
//                     className={`text-xl font-semibold ${
//                       selectedComponent === "QuotationData"
//                         ? "text-white"
//                         : "text-gray-800"
//                     }`}
//                   >
//                     Quotation Data
//                   </h5>
//                   <p
//                     className={`${
//                       selectedComponent === "QuotationData"
//                         ? "text-white"
//                         : "text-gray-600"
//                     }`}
//                   >
//                     {quotationCount}
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="w-full sm:w-1/2 lg:w-1/4 xl:w-1/5 my-3 p-0 sm-mx-0 mx-3 ">
//             <div
//               className={` shadow-lg rounded-lg overflow-hidden cursor-pointer ${
//                 selectedComponent === "InvoiceData"
//                   ? "bg-blue-500 text-white"
//                   : ""
//               }`} // Change background color if active
//               onClick={() => setSelectedComponent("InvoiceData")} // Set selected component
//             >
//               <div className="p-4 flex flex-col items-center text-center">
//                 <div
//                   className={`text-3xl ${
//                     selectedComponent === "InvoiceData"
//                       ? "text-white"
//                       : "text-gray-700"
//                   }`}
//                 >
//                   <GiMoneyStack />
//                 </div>
//                 <div className="mt-2">
//                   <h5
//                     className={`text-xl font-semibold ${
//                       selectedComponent === "InvoiceData"
//                         ? "text-white"
//                         : "text-gray-800"
//                     }`}
//                   >
//                     Invoice Data
//                   </h5>
//                   <p
//                     className={`${
//                       selectedComponent === "InvoiceData"
//                         ? "text-white"
//                         : "text-gray-600"
//                     }`}
//                   >
//                     {invoiceCount}
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Conditionally render the selected component */}
//         <div className="w-full h-[calc(100vh-10rem)] overflow-y-auto">
//           {selectedComponent === "LeadData" && <EmployeeLeadData />}
//           {selectedComponent === "QuotationData" && <EmployeeQuotationData />}
//           {selectedComponent === "InvoiceData" && <EmployeeInvoiceData />}
//         </div>
//       </div>
//     </>
//   );
// }

// export default DataExport;

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { SiMoneygram } from "react-icons/si";
import { MdOutlineNextWeek } from "react-icons/md";
import { GiFiles, GiMoneyStack } from "react-icons/gi";
import { FaClipboardList, FaCheckCircle } from "react-icons/fa"; // Import icons for Visit and Closed Data
import { useSelector } from "react-redux";
import EmployeeLeadData from "./EmployeeDataExport/EmployeeLeadData";
import EmployeeQuotationData from "./EmployeeDataExport/EmployeeQuotationData";
import EmployeeInvoiceData from "./EmployeeDataExport/EmployeeInvoiceData";
import MainHeader from "../MainHeader";
import EmployeeSider from "./EmployeeSider";
import EmployeeVisitData from "./EmployeeDataExport/EmployeeVisitData";
import EmployeeCloseData from "./EmployeeDataExport/EmployeeCloseData";
import Employee_Single_Lead_Profile from "../Leads/Employee_Single_Lead_Profile";
import EmployeeSoldData from "./EmployeeDataExport/EmployeeSoldData";

function DataExport() {
  const [leads, setLeads] = useState([]);
  const [quotation, setQuotation] = useState([]);
  const [invoice, setInvoice] = useState([]);

  const [closedData, setClosedData] = useState([]); // State for Closed Data
  const [selectedComponent, setSelectedComponent] = useState("LeadData"); // Set 'LeadData' as default


  const [visit, setVisit] = useState([]);
  const EmpId = useSelector((state) => state.auth.user);
  const token = EmpId?.token;

  const fetchLeads = async () => {
    try {
      const response = await axios.get(
        `https://crmdemo.vimubds5.a2hosted.com/api/employe-leads/${EmpId.id}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }}
      );
      console.log("setLeads", response.data);
      setLeads(response.data);
    } catch (error) {
      console.error("Error fetching leads:", error);
    }
  };

  const fetchQuotation = async () => {
    try {
      const response = await axios.get(
        `https://crmdemo.vimubds5.a2hosted.com/api/get-quotation-byEmploye/${EmpId.id}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }}
      );
      setQuotation(response.data);
    } catch (error) {
      console.error("Error fetching quotations:", error);
    }
  };

  const fetchInvoice = async () => {
    try {
      const response = await axios.get(
        `https://crmdemo.vimubds5.a2hosted.com/api/get-employee-invoice/${EmpId.id}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }}
      );
      setInvoice(response.data);
    } catch (error) {
      console.error("Error fetching invoices:", error);
    }
  };

  const fetchVisit = async () => {
    try {
      const response = await axios.get(
        `https://crmdemo.vimubds5.a2hosted.com/api/employebyid-visit/${EmpId.id}`,
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

  const visitCount = leads.filter((lead) =>
    ["fresh", "re-visit", "self", "associative"].includes(lead.visit)
  ).length;


  const closedCount = leads.filter(
    (lead) => lead.deal_status === "close"
  ).length;

  const soldUnits = leads.filter(   
    (lead) => lead.unit_status === "sold"
  ).length;

  useEffect(() => {
    fetchLeads();
    fetchQuotation();
    fetchInvoice();
    fetchVisit();

  }, []);
  return (
    <>
      <MainHeader />
      <EmployeeSider />
      {/* <div className="container mt-[5rem]"> */}
      <div className="flex-grow p-4 2xl:ml-40">
        <center className="text-2xl text-center mt-8 font-medium">
          Employee Data Export
        </center>
        <center className="mx-auto h-[3px] w-16 bg-[#34495E] my-3"></center>

        <div className="flex flex-wrap justify-around mt-5">
          
          <div className="w-full sm:w-1/2 lg:w-1/4 xl:w-1/5 my-3 p-0 sm-mx-0 mx-3 ">
            <div
              className={`shadow-lg rounded-lg overflow-hidden cursor-pointer ${
                selectedComponent === "LeadData" ? "bg-blue-500 text-white" : ""
              }`}
              onClick={() => setSelectedComponent("LeadData")}
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
          
          {/* Card for Sold Data */}
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
        <div className="w-full mb-20">
          {/* {selectedComponent === "ProjectName" && <Employee_Single_Lead_Profile />} */}
          {selectedComponent === "LeadData" && <EmployeeLeadData />}
          {selectedComponent === "QuotationData" && <EmployeeQuotationData />}
          {selectedComponent === "InvoiceData" && <EmployeeInvoiceData />}
          {selectedComponent === "VisitData" && <EmployeeVisitData />}
          {/* Replace with your actual Visit Data component */}
          {selectedComponent === "ClosedData" && <EmployeeCloseData />}
          {selectedComponent === "SoldData" && <EmployeeSoldData/>}

          {/* Replace with your actual Closed Data component */}
        </div>
      </div>
    </>
  );
}

export default DataExport;
