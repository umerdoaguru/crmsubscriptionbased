import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import LeadReport from "../components/AdminReport/LeadReport";
import VisitReport from "../components/AdminReport/VisitReport";
import ClosedDealReport from "../components/AdminReport/ClosedDealReport";
import SoldUnitsReport from "../components/AdminReport/SoldUnitsReport";

const AdminReportContent = () => {
  const [leads, setLeads] = useState([]);
  const [visit, setVisit] = useState([]);

  const [employee, setEmployee] = useState([]);
  const [quotation, setQuotation] = useState([]);
  const [invoice, setInvoice] = useState([]);
  const [selectedComponent, setSelectedComponent] = useState("LeadData"); // Set 'LeadData' as default
  const adminuser = useSelector((state) => state.auth.user);
  const token = adminuser.token;
  const userId = adminuser.user_id;

  useEffect(() => {
    fetchLeads();
    fetchEmployee();
    fetchQuotation();
    fetchInvoice();
    fetchVisit();
    unitsolds();
  }, []);

  const fetchLeads = async () => {
    try {
      const response = await axios.get(
        `https://crm-generalize.dentalguru.software/api/leads-data-user-id/${userId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setLeads(response.data);
    } catch (error) {
      console.error("Error fetching leads:", error);
    }
  };

  const fetchEmployee = async () => {
    try {
      const response = await axios.get(
        `https://crm-generalize.dentalguru.software/api/employee`
      );
      setEmployee(response.data);
    } catch (error) {
      console.error("Error fetching employee data:", error);
    }
  };

  const fetchQuotation = async () => {
    try {
      const response = await axios.get(
        `https://crm-generalize.dentalguru.software/api/quotation-data`
      );
      setQuotation(response.data);
    } catch (error) {
      console.error("Error fetching quotations:", error);
    }
  };

  const fetchInvoice = async () => {
    try {
      const response = await axios.get(
        `https://crm-generalize.dentalguru.software/api/invoice-data`
      );
      setInvoice(response.data);
    } catch (error) {
      console.error("Error fetching invoices:", error);
    }
  };

  const fetchVisit = async () => {
    try {
      const response = await axios.get(
        `https://crm-generalize.dentalguru.software/api/employe-all-visit-admin`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data);
      setVisit(response.data);
    } catch (error) {
      console.error("Error fetching quotations:", error);
    }
  };

  const unitsolds = async () => {
    try {
      const response = await axios.get(
        `https://crm-generalize.dentalguru.software/api/admin-unit-sold`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data);
      setVisit(response.data);
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
      <div className="flex mt-20">
        <div className="w-full min-h-screen bg-[#F9FAFF] p-2">
          <div className="container">
            <h2 className="text-2xl text-center mt-[2rem] font-medium">
              Report
            </h2>
            <div className="mx-auto h-[3px] w-16 bg-cyan-600 my-3"></div>

            <div className="flex flex-wrap  mt-5">
              <div className=" my-3 p-0 sm-mx-0 mx-3 ">
                <div
                  className={` shadow-lg rounded-lg overflow-hidden cursor-pointer ${
                    selectedComponent === "LeadData"
                      ? "bg-cyan-600 text-white"
                      : ""
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
                    ></div>
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
                      ? "bg-cyan-600 text-white"
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
                    ></div>
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
                      ? "bg-cyan-600 text-white"
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
                    ></div>
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
                      ? "bg-cyan-600 text-white"
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
                    ></div>
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
              {selectedComponent === "LeadData" && <LeadReport />}

              {selectedComponent === "VisitData" && <VisitReport />}
              {selectedComponent === "ClosedData" && <ClosedDealReport />}
              {selectedComponent === "SoldUnits" && <SoldUnitsReport />}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminReportContent;
