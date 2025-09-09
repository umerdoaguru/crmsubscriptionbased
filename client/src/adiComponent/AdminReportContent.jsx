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
  const [selectedComponent, setSelectedComponent] = useState("LeadData");

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
      setVisit(response.data);
    } catch (error) {
      console.error("Error fetching visits:", error);
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
      setVisit(response.data);
    } catch (error) {
      console.error("Error fetching sold units:", error);
    }
  };

  return (
    <>
      <div className="flex mt-20">
        <div className="w-full min-h-screen bg-[#F9FAFF] p-2">
          <div className="container">
            {/* Title */}
            <h2 className="text-3xl text-center mt-6 font-semibold tracking-wide text-gray-800">
              Report
            </h2>
            <div className="mx-auto h-[3px] w-20 bg-cyan-600 my-4 rounded-full"></div>

            {/* Card Section */}
            <div className="flex flex-wrap justify-center gap-6 mt-4">
              {/* Leads */}
              <div
                className={`transition-all duration-300 transform hover:scale-105 shadow-md rounded-2xl cursor-pointer w-40 sm:w-48 ${
                  selectedComponent === "LeadData"
                    ? "bg-cyan-600 text-white shadow-lg shadow-cyan-300/50"
                    : "bg-white text-gray-800 hover:bg-gray-100"
                }`}
                onClick={() => setSelectedComponent("LeadData")}
              >
                <div className="p-6 flex flex-col items-center text-center">
                  <div
                    className={`text-4xl mb-2 ${
                      selectedComponent === "LeadData"
                        ? "text-white"
                        : "text-cyan-600"
                    }`}
                  >
                    📊
                  </div>
                  <p className="text-lg font-semibold">Leads</p>
                </div>
              </div>

              {/* Site Visit */}
              <div
                className={`transition-all duration-300 transform hover:scale-105 shadow-md rounded-2xl cursor-pointer w-40 sm:w-48 ${
                  selectedComponent === "VisitData"
                    ? "bg-cyan-600 text-white shadow-lg shadow-cyan-300/50"
                    : "bg-white text-gray-800 hover:bg-gray-100"
                }`}
                onClick={() => setSelectedComponent("VisitData")}
              >
                <div className="p-6 flex flex-col items-center text-center">
                  <div
                    className={`text-4xl mb-2 ${
                      selectedComponent === "VisitData"
                        ? "text-white"
                        : "text-cyan-600"
                    }`}
                  >
                    🏡
                  </div>
                  <h5 className="text-lg font-semibold">Site Visit</h5>
                </div>
              </div>

              {/* Closed Deal */}
              <div
                className={`transition-all duration-300 transform hover:scale-105 shadow-md rounded-2xl cursor-pointer w-40 sm:w-48 ${
                  selectedComponent === "ClosedData"
                    ? "bg-cyan-600 text-white shadow-lg shadow-cyan-300/50"
                    : "bg-white text-gray-800 hover:bg-gray-100"
                }`}
                onClick={() => setSelectedComponent("ClosedData")}
              >
                <div className="p-6 flex flex-col items-center text-center">
                  <div
                    className={`text-4xl mb-2 ${
                      selectedComponent === "ClosedData"
                        ? "text-white"
                        : "text-cyan-600"
                    }`}
                  >
                    🤝
                  </div>
                  <h5 className="text-lg font-semibold">Closed Deal</h5>
                </div>
              </div>

              {/* Sold Units */}
              <div
                className={`transition-all duration-300 transform hover:scale-105 shadow-md rounded-2xl cursor-pointer w-40 sm:w-48 ${
                  selectedComponent === "SoldUnits"
                    ? "bg-cyan-600 text-white shadow-lg shadow-cyan-300/50"
                    : "bg-white text-gray-800 hover:bg-gray-100"
                }`}
                onClick={() => setSelectedComponent("SoldUnits")}
              >
                <div className="p-6 flex flex-col items-center text-center">
                  <div
                    className={`text-4xl mb-2 ${
                      selectedComponent === "SoldUnits"
                        ? "text-white"
                        : "text-cyan-600"
                    }`}
                  >
                    🏢
                  </div>
                  <h5 className="text-lg font-semibold">Sold Units</h5>
                </div>
              </div>
            </div>

            {/* Render Selected Component */}
            <div className="w-full h-[calc(100vh-12rem)] overflow-y-auto mt-6 bg-white shadow-inner rounded-xl p-4">
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
