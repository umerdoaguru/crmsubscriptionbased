import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { MdOutlineNextWeek } from "react-icons/md";
import { AiOutlineProject } from "react-icons/ai";
import { GiFiles, GiMoneyStack } from "react-icons/gi";
import { FaCheckCircle } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { logoutUser } from "../store/UserSlice";
import cogoToast from "cogo-toast";

const Overview2 = () => {
  const [leads, setLeads] = useState([]);
  const [employee, setEmployee] = useState([]);
  const [selectedComponent, setSelectedComponent] = useState("LeadData");
  const [visit, setVisit] = useState([]);
  const superadminuser = useSelector((state) => state.auth.user);
  const token = superadminuser.token;
  const userId = superadminuser.staff_id;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [project, setProjects] = useState([]);
  const [employeesold, setemployeesold] = useState([]);

  const fetchLeads = async () => {
    try {
      const response = await axios.get(
        `https://crm-generalize.dentalguru.software/api/getLeadsByOrg/${superadminuser?.staff_org_id}`,
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
        navigate("/");
        dispatch(logoutUser());
        cogoToast.error("Token is expired Please Login Again !!");
      }
    }
  };

  console.log(leads);

  const fetchVisit = async () => {
    try {
      const response = await axios.get(
        `https://crm-generalize.dentalguru.software/api/leads-all-visits/${superadminuser?.staff_org_id}`,
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

  console.log("visit data", visit);

  const fetchProjects = async () => {
    try {
      const response = await axios.get(
        `https://crm-generalize.dentalguru.software/api/super-admin-all-project/${superadminuser?.staff_org_id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data);
      setProjects(response.data);
    } catch (error) {
      console.error("Error fetching quotations:", error);
    }
  };

  const employeesoldunit = async () => {
    try {
      const response = await axios.get(
        `https://crm-generalize.dentalguru.software/api/getAllUnitSoldByOrg/${superadminuser?.staff_org_id}`,

        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data);
      setemployeesold(response.data);
    } catch (error) {
      console.error("Error fetching quotations:", error);
    }
  };

  useEffect(() => {
    fetchProjects();
    fetchLeads();
    fetchVisit();
    employeesoldunit();
  }, []);

  const leadCount = leads.length;

  console.log(leads);

  const soldunit = employeesold.length;

  const visitCount = visit?.length;

  const projectCount = project.length;

  const closedCount = leads.filter(
    (lead) => lead.unit_status === "sold"
  ).length;

  console.log(closedCount);

  return (
    <>
      <div className="flex flex-wrap justify-around">
        <div className="w-full sm:w-1/2 lg:w-1/4 xl:w-1/6 my-3 p-0 sm-mx-0 mx-3 ">
          <Link to="/Super-admin-project">
            <div className="shadow-lg rounded-lg overflow-hidden cursor-pointer text-gray-600 border-1">
              <div className="p-4 flex flex-col items-center text-center">
                <div className=" text-3xl text-cyan-600">
                  <AiOutlineProject />
                </div>
                <div className="mt-2">
                  <h5 className="text-gray-800 text-xl font-semibold ">
                    Total Projects{" "}
                  </h5>
                  <p className="text-gray-800 text-xl font-semibold ">
                    {projectCount}
                  </p>
                </div>
              </div>
            </div>
          </Link>
        </div>

        <div className="w-full sm:w-1/2 lg:w-1/4 xl:w-1/6 my-3 p-0 sm-mx-0 mx-3 ">
          <Link to="/super-admin-total-lead">
            <div className="shadow-lg rounded-lg overflow-hidden cursor-pointer text-gray-600 border-1">
              <div className="p-4 flex flex-col items-center text-center">
                <div className=" text-3xl text-cyan-600">
                  <GiFiles />
                </div>
                <div className="mt-2">
                  <h5 className="text-gray-800 text-xl font-semibold ">
                    Total Leads{" "}
                  </h5>
                  <p className="text-gray-800 text-xl font-semibold ">
                    {leadCount}
                  </p>
                </div>
              </div>
            </div>
          </Link>
        </div>

        <div className="w-full sm:w-1/2 lg:w-1/4 xl:w-1/6 my-3 p-0 sm-mx-0 mx-3">
          <Link to="/super-admin-total-visit">
            <div className="shadow-lg rounded-lg overflow-hidden cursor-pointer text-gray-600">
              <div className="p-4 flex flex-col items-center text-center">
                <div className=" text-3xl text-cyan-600">
                  <MdOutlineNextWeek />
                </div>
                <div className="mt-2">
                  <h5 className="text-gray-800 text-xl font-semibold ">
                    Total Site Visit
                  </h5>
                  <p className="text-gray-800 text-xl font-semibold ">
                    {visitCount}
                  </p>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Card for Closed Data */}
        <div className="w-full sm:w-1/2 lg:w-1/4 xl:w-1/6 my-3 p-0 sm-mx-0 mx-3">
          <Link to="/super-admin-close-data">
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
                        : "text-gray-600 font-bold"
                    }`}
                  >
                    {closedCount}
                  </p>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Card for sold unit Data */}
        <div className="w-full sm:w-1/2 lg:w-1/4 xl:w-1/5 my-3 p-0 sm-mx-0 mx-3">
          <Link to="/super-admin-Sold-Units">
            <div
              className={`shadow-lg rounded-lg overflow-hidden cursor-pointer ${
                employeesold === "soldunit" ? "bg-blue-500 text-white" : ""
              }`}
              onClick={() => setSelectedComponent("soldunit")}
            >
              <div className="p-4 flex flex-col items-center text-center">
                <div
                  className={`text-3xl ${
                    employeesold === "soldunit" ? "text-white" : "text-cyan-600"
                  }`}
                >
                  <FaCheckCircle />
                </div>
                <div className="mt-2">
                  <h5
                    className={`text-xl font-semibold ${
                      employeesold === "soldunit"
                        ? "text-white"
                        : "text-gray-800"
                    }`}
                  >
                    Employee Sold Units
                  </h5>
                  <p
                    className={`${
                      employeesold === "soldunit"
                        ? "text-white"
                        : "text-gray-600 font-bold"
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

export default Overview2;
