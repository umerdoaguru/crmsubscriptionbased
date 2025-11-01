import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { GiFiles, GiMoneyStack } from "react-icons/gi";
import { FaClipboardList, FaCheckCircle } from "react-icons/fa"; // Import icons for Visit and Closed Data
import { useSelector } from "react-redux";
import EmployeeLeadData from "./EmployeeDataExport/EmployeeLeadData";
import EmployeeQuotationData from "./EmployeeDataExport/EmployeeQuotationData";
import EmployeeInvoiceData from "./EmployeeDataExport/EmployeeInvoiceData";
import EmployeeVisitData from "./EmployeeDataExport/EmployeeVisitData";
import EmployeeCloseData from "./EmployeeDataExport/EmployeeCloseData";
import EmployeeSoldData from "./EmployeeDataExport/EmployeeSoldData";
import EmployeeMetaLeadData from "./EmployeeDataExport/EmployeeMetaLeadData";
import { FaMeta } from "react-icons/fa6";

function EmployeeDataExportContent() {
  const [leads, setLeads] = useState([]);
  const [selectedComponent, setSelectedComponent] = useState("LeadData");
  const [visit, setVisit] = useState([]);
  const [metaLeads, setMetaLeads] = useState([]);
  const EmpId = useSelector((state) => state.auth.user);
  const token = EmpId?.token;

  const fetchLeads = async () => {
    try {
      const response = await axios.get(
        `https://crm-generalize.dentalguru.software/api/employe-leads/${EmpId.staff_id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("setLeads", response.data);
      setLeads(response.data);
    } catch (error) {
      console.error("Error fetching leads:", error);
    }
  };

  const fetchMetaLeads = async () => {
    try {
      const response = await axios.get(
        `https://crm-generalize.dentalguru.software/api/getMetaLeadsByStaffId/${EmpId.staff_id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMetaLeads(response.data);
    } catch (error) {
      console.error("Error fetching leads:", error);
    }
  };

  const fetchVisit = async () => {
    try {
      const response = await axios.get(
        `https://crm-generalize.dentalguru.software/api/leads-visits/${EmpId.staff_id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setVisit(response.data);
    } catch (error) {
      console.error("Error fetching quotations:", error);
    }
  };

  const visitCount = visit?.length;

  const closedCount = leads.filter(
    (lead) => lead.unit_status === "sold"
  ).length;

  const soldUnits = leads.filter((lead) => lead.unit_status === "sold").length;

  useEffect(() => {
    fetchLeads();
    fetchVisit();
    fetchMetaLeads();
  }, []);

  return (
    <>
      <div className="flex sm:mt-20 mt-16">
        <div className="w-full min-h-screen bg-[#F9FAFF] p-2">
          <div className="flex-grow p-4">
            <center className="text-2xl text-center mt-0 sm:mt-2 font-medium">
              Employee Data Export
            </center>
            <center className="mx-auto h-[3px] w-16 bg-cyan-600 my-3"></center>

            <div className="flex flex-wrap justify-around mt-5">
              <div className="w-full sm:w-1/2 lg:w-1/4 xl:w-1/5 my-3 p-0 sm-mx-0 mx-3 ">
                <div
                  className={`shadow-lg rounded-lg overflow-hidden cursor-pointer ${
                    selectedComponent === "LeadData"
                      ? "bg-cyan-600 text-white"
                      : ""
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
                        {leads?.length}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="w-full sm:w-1/2 lg:w-1/4 xl:w-1/5 my-3 p-0 sm-mx-0 mx-3 ">
                <div
                  className={`shadow-lg rounded-lg overflow-hidden cursor-pointer ${
                    selectedComponent === "metaLeadData"
                      ? "bg-cyan-600 text-white"
                      : ""
                  }`}
                  onClick={() => setSelectedComponent("metaLeadData")}
                >
                  <div className="p-4 flex flex-col items-center text-center">
                    <div
                      className={`text-3xl ${
                        selectedComponent === "metaLeadData"
                          ? "text-white"
                          : "text-gray-700"
                      }`}
                    >
                      <FaMeta />
                    </div>
                    <div className="mt-2">
                      <h5
                        className={`text-xl font-semibold ${
                          selectedComponent === "metaLeadData"
                            ? "text-white"
                            : "text-gray-800"
                        }`}
                      >
                        Meta Leads Data
                      </h5>
                      <p
                        className={`${
                          selectedComponent === "metaLeadData"
                            ? "text-white"
                            : "text-gray-600"
                        }`}
                      >
                        {metaLeads?.length}
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
                      ? "bg-cyan-600 text-white"
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
              {/* <div className="w-full sm:w-1/2 lg:w-1/4 xl:w-1/5 my-3 p-0 sm-mx-0 mx-3">
                <div
                  className={`shadow-lg rounded-lg overflow-hidden cursor-pointer ${
                    selectedComponent === "ClosedData"
                      ? "bg-cyan-600 text-white"
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
              </div> */}

              {/* Card for Sold Data */}
              <div className="w-full sm:w-1/2 lg:w-1/4 xl:w-1/5 my-3 p-0 sm-mx-0 mx-3">
                <div
                  className={`shadow-lg rounded-lg overflow-hidden cursor-pointer ${
                    selectedComponent === "SoldData"
                      ? "bg-cyan-600 text-white"
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
              {selectedComponent === "LeadData" && <EmployeeLeadData />}
              {selectedComponent === "metaLeadData" && <EmployeeMetaLeadData />}
              {selectedComponent === "QuotationData" && (
                <EmployeeQuotationData />
              )}
              {selectedComponent === "InvoiceData" && <EmployeeInvoiceData />}
              {selectedComponent === "VisitData" && <EmployeeVisitData />}
              {selectedComponent === "ClosedData" && <EmployeeCloseData />}
              {selectedComponent === "SoldData" && <EmployeeSoldData />}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default EmployeeDataExportContent;
