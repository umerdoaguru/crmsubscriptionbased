import React, { useEffect, useState } from "react";
import axios from "axios";
import { GiFiles, GiMoneyStack } from "react-icons/gi";
import { useSelector } from "react-redux";
import LeadData from "../components/DataExport/LeadData";
import { FaCheckCircle, FaClipboardList } from "react-icons/fa";
import VisitData from "../components/DataExport/VisitData";
import CloseData from "../components/DataExport/CloseDateData";
import EmployeeSoldDataDetails from "../components/DataExport/EmployeeSoldDataDetails";
import MetaLeadData from "../components/DataExport/MetaLeadData";
import { FaMeta } from "react-icons/fa6";
import { SiGoogleads } from "react-icons/si";

const DataExportContent = () => {
  const [leads, setLeads] = useState([]);
  const [metaLeads, setMetaLeads] = useState([]);
  const [visit, setVisit] = useState([]);
  const [employeesold, setemployeesold] = useState([]);
  const [selectedComponent, setSelectedComponent] = useState("LeadData");
  const superadminuser = useSelector((state) => state.auth.user);
  const [employee, setEmployee] = useState([]);
  const token = superadminuser.token;
  const userId = superadminuser.staff_id;

  useEffect(() => {
    fetchLeads();
    fetchEmployee();
    fetchVisit();
    employeesoldunit();
    fetchMetaLeads();
  }, []);

  const fetchMetaLeads = async () => {
    try {
      const { data } = await axios.get(
        `https://crm-generalize.dentalguru.software/api/getMetaLeadsByOrgId/${superadminuser?.staff_org_id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMetaLeads(data);
    } catch (error) {
      console.error("Error fetching leads:", error);
    }
  };

  const fetchLeads = async () => {
    try {
      const { data } = await axios.get(
        `https://crm-generalize.dentalguru.software/api/getLeadsByOrg/${superadminuser?.staff_org_id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setLeads(data);
    } catch (error) {
      console.error("Error fetching leads:", error);
    }
  };

  const fetchEmployee = async () => {
    try {
      const response = await axios.get(
        `https://crm-generalize.dentalguru.software/api/employee-super-admin/${userId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setEmployee(response.data);
    } catch (error) {
      console.error("Error fetching employee data:", error);
    }
  };

  const employeesoldunit = async () => {
    try {
      const { data } = await axios.get(
        `https://crm-generalize.dentalguru.software/api/getAllUnitSoldByOrg/${superadminuser?.staff_org_id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(data);
      setemployeesold(data);
    } catch (error) {
      console.error("Error fetching quotations:", error);
    }
  };
  const fetchVisit = async () => {
    try {
      const { data } = await axios.get(
        `https://crm-generalize.dentalguru.software/api/leads-all-visits/${superadminuser?.staff_org_id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(data);
      setVisit(data);
    } catch (error) {
      console.error("Error fetching quotations:", error);
    }
  };

  const closedCount = leads.filter(
    (lead) => lead.unit_status === "sold"
  ).length;

  const soldUnits = employeesold.length;

  return (
    <>
      <div className="flex mt-20">
        <div className="w-full min-h-screen bg-[#F9FAFF] p-2">
          <div className="container">
            <h2 className="text-2xl text-center mt-[2rem] font-medium">
              Data Export
            </h2>
            <div className="mx-auto h-[3px] w-16 bg-cyan-600 my-3"></div>

            <div className="flex flex-wrap justify-around mt-5">
              <div className="w-full sm:w-1/2 lg:w-1/4 xl:w-1/5 my-3 p-0 sm-mx-0 mx-3 ">
                <div
                  className={` shadow-lg rounded-lg overflow-hidden cursor-pointer ${
                    selectedComponent === "LeadData"
                      ? "bg-cyan-500 text-white"
                      : ""
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
                      <SiGoogleads />
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

              {/* Card for Closed Data */}
              <div className="w-full sm:w-1/2 lg:w-1/4 xl:w-1/5 my-3 p-0 sm-mx-0 mx-3">
                <div
                  className={`shadow-lg rounded-lg overflow-hidden cursor-pointer ${
                    selectedComponent === "metaLeadData"
                      ? "bg-cyan-500 text-white"
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
                        Meta Lead Data
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
                      ? "bg-cyan-500 text-white"
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
                        Site Visit Data
                      </h5>
                      <p
                        className={`${
                          selectedComponent === "VisitData"
                            ? "text-white"
                            : "text-gray-600"
                        }`}
                      >
                        {visit?.length}
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
                      ? "bg-cyan-500 text-white"
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
            <div className="w-full h-[calc(100vh-10rem)] overflow-y-auto">
              {selectedComponent === "LeadData" && <LeadData />}
              {selectedComponent === "VisitData" && <VisitData />}
              {selectedComponent === "metaLeadData" && <MetaLeadData />}
              {selectedComponent === "SoldData" && <EmployeeSoldDataDetails />}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DataExportContent;
