import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { GiFiles, GiMoneyStack } from "react-icons/gi";
import { Link, useNavigate } from "react-router-dom";
import { FaClipboardList, FaCheckCircle } from "react-icons/fa";
import { logoutUser } from "../../../store/UserSlice";
import cogoToast from "cogo-toast";
import { FaMeta } from "react-icons/fa6";

const EmployeeOverview = () => {
  const [leads, setLeads] = useState([]);
  const [metaLeads, setMetaLeads] = useState([]);
  const [quotation, setQuotation] = useState([]);
  const [invoice, setInvoice] = useState([]);
  const [selectedComponent, setSelectedComponent] = useState("LeadData");
  const [visit, setVisit] = useState([]);
  const [employeesold, setemployeesold] = useState([]);
  const EmpId = useSelector((state) => state.auth.user);

  const token = EmpId?.token;

  const navigate = useNavigate();
  const dispatch = useDispatch();

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
      setLeads(response.data);
    } catch (error) {
      if (error?.response?.status === 401) {
        navigate("/main_page_crm");
        dispatch(logoutUser());
        cogoToast.error("Token is expired Please Login Again !!");
      }
    }
  };

  const fetchMetaLeads = async () => {
    try {
      const { data } = await axios.get(
        `https://crm-generalize.dentalguru.software/api/getMetaLeadsByStaffId/${EmpId.staff_id}`,
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

  const fetchVisit = async () => {
    try {
      const { data } = await axios.get(
        `https://crm-generalize.dentalguru.software/api/leads-visits/${EmpId.staff_id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setVisit(data);
    } catch (error) {
      console.error("Error fetching quotations:", error);
    }
  };

  const employeesoldunit = async () => {
    try {
      const { data } = await axios.get(
        `https://crm-generalize.dentalguru.software/api/unit-sold/${EmpId.staff_id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setemployeesold(data);
    } catch (error) {
      console.error("Error fetching quotations:", error);
    }
  };

  useEffect(() => {
    fetchLeads();
    fetchVisit();
    fetchMetaLeads();
    employeesoldunit();
  }, []);

  const leadCount = leads.length;
  const soldunit = employeesold.length;

  const closedCount = leads.filter(
    (lead) => lead.unit_status === "sold"
  ).length;

  const visitCount = visit?.length;

  return (
    <>
      <div className="flex flex-wrap justify-around mt-2">
        <div className="w-full sm:w-1/2 lg:w-1/4 xl:w-1/5 my-3 p-0 sm-mx-0 mx-3  ">
          <Link to="/employees-total-leads">
            <div className="shadow-lg rounded-lg overflow-hidden cursor-pointer text-gray-600 border-1">
              <div className="p-4 flex flex-col items-center text-center">
                <div className=" text-3xl text-cyan-600">
                  <GiFiles />
                </div>
                <div className="mt-2">
                  <h5 className="text-gray-800 text-xl font-semibold ">
                    Total Assign Leads{" "}
                  </h5>
                  <p className="text-gray-800 text-xl font-semibold ">
                    {leadCount}
                  </p>
                </div>
              </div>
            </div>
          </Link>
        </div>

        <div className="w-full sm:w-1/2 lg:w-1/4 xl:w-1/5 my-3 p-0 sm-mx-0 mx-3  ">
          <Link to="/meta-leads-employee">
            <div className="shadow-lg rounded-lg overflow-hidden cursor-pointer text-gray-600 border-1">
              <div className="p-4 flex flex-col items-center text-center">
                <div className=" text-3xl text-cyan-600">
                  <FaMeta />
                </div>
                <div className="mt-2">
                  <h5 className="text-gray-800 text-xl font-semibold ">
                    Total Meta Leads{" "}
                  </h5>
                  <p className="text-gray-800 text-xl font-semibold ">
                    {metaLeads?.length}
                  </p>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Card for Visit Data */}
        <div className="w-full sm:w-1/2 lg:w-1/4 xl:w-1/5 my-3 p-0 sm-mx-0 mx-3">
          <Link to="/visit-data">
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
                      : "text-cyan-600"
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
                    Total Site Visit
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
          </Link>
        </div>

        {/* Card for Closed Data */}
        {/* <div className="w-full sm:w-1/2 lg:w-1/4 xl:w-1/5 my-3 p-0 sm-mx-0 mx-3">
          <Link to="/close-data">
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
                      : "text-cyan-600"
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
                    Total Closed Deal
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
          </Link>
        </div> */}

        {/* Card for sold unit Data */}
        <div className="w-full sm:w-1/2 lg:w-1/4 xl:w-1/5 my-3 p-0 sm-mx-0 mx-3">
          <Link to="/employee-sold">
            <div
              className={`shadow-lg rounded-lg overflow-hidden cursor-pointer ${
                employeesold === "solddata" ? "bg-cyan-600 text-white" : ""
              }`}
              onClick={() => setSelectedComponent("solddata")}
            >
              <div className="p-4 flex flex-col items-center text-center">
                <div
                  className={`text-3xl ${
                    employeesold === "solddata" ? "text-white" : "text-cyan-600"
                  }`}
                >
                  <FaClipboardList />
                </div>
                <div className="mt-2">
                  <h5
                    className={`text-xl font-semibold ${
                      employeesold === "solddata"
                        ? "text-white"
                        : "text-gray-800"
                    }`}
                  >
                    Employee Sold Units
                  </h5>
                  <p
                    className={`${
                      employeesold === "solddata"
                        ? "text-white"
                        : "text-gray-600"
                    }`}
                  >
                    {soldunit}
                  </p>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </>
  );
};

export default EmployeeOverview;
