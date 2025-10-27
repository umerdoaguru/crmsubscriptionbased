import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { MdOutlineNextWeek } from "react-icons/md";
import { AiOutlineProject } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";
import { logoutUser } from "../store/UserSlice";
import cogoToast from "cogo-toast";
import { SiGoogleads } from "react-icons/si";
import { FaMeta } from "react-icons/fa6";

const AdminOverviewDash = () => {
  const [leads, setLeads] = useState([]);
  const [employee, setEmployee] = useState([]);
  const [selectedComponent, setSelectedComponent] = useState("LeadData");
  const [project, setProjects] = useState([]);
  const [employeesold, setemployeesold] = useState([]);
  const [metaLeads, setMetaLeads] = useState([]);
  const EmpId = useSelector((state) => state.auth.user);
  const adminuser = useSelector((state) => state.auth.user);
  const token = adminuser.token;
  const userId = adminuser.user_id;
  const [visit, setVisit] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const fetchLeads = async () => {
    try {
      const response = await axios.get(
        `https://crm-generalize.dentalguru.software/api/getLeadsByOrg/${adminuser?.staff_org_id}`,
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

  const fetchAllMetaLeads = async () => {
    try {
      // setLoading(true);
      const { data } = await axios.get(
        `https://crm-generalize.dentalguru.software/api/getMetaLeadsByOrgId/${adminuser.staff_org_id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMetaLeads(data);
    } catch (error) {
      console.log(error);
    } finally {
      // setLoading(false);
    }
  };

  const fetchVisit = async () => {
    try {
      const response = await axios.get(
        `https://crm-generalize.dentalguru.software/api/leads-all-visits/${adminuser?.staff_org_id}`,
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

  const fetchEmployee = async () => {
    try {
      const response = await axios.get(
        `https://crm-generalize.dentalguru.software/api/employee`,
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

  const fetchProjects = async () => {
    try {
      const response = await axios.get(
        `https://crm-generalize.dentalguru.software/api/super-admin-all-project/${adminuser?.staff_org_id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setProjects(response.data);
    } catch (error) {
      console.error("Error fetching quotations:", error);
    }
  };

  const employeesoldunit = async () => {
    try {
      const response = await axios.get(
        `https://crm-generalize.dentalguru.software/api/getAllUnitSoldByOrg/${adminuser?.staff_org_id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setemployeesold(response.data);
    } catch (error) {
      console.error("Error fetching quotations:", error);
    }
  };

  useEffect(() => {
    fetchProjects();
    fetchLeads();
    fetchEmployee();
    fetchVisit();
    employeesoldunit();
    fetchAllMetaLeads();
  }, []);

  const employeeCount = employee.length;
  const leadCount = leads.length;

  const closedCount = leads.filter(
    (lead) => lead.unit_status === "sold"
  ).length;

  const projectCount = project.length;
  const soldunit = employeesold.length;

  return (
    <>
      <div className="flex flex-wrap justify-around mt-2">
        {/* All Project data */}
        <div className="w-full sm:w-1/2 lg:w-1/4 xl:w-1/6 my-3 p-0 sm-mx-0 mx-3 ">
          <Link to="/admin-project">
            <div className="shadow-lg rounded-lg overflow-hidden cursor-pointer text-gray-600 border-1">
              <div className="p-4 flex flex-col items-center text-center">
                <div className=" text-3xl text-cyan-600">
                  <AiOutlineProject />
                </div>
                <div className="mt-2">
                  <h5 className="text-gray-800 text-xl font-semibold ">
                    Total Projects
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
          <Link to="/admin-total-leads">
            <div className="shadow-lg rounded-lg overflow-hidden cursor-pointer text-gray-600 border-1">
              <div className="p-4 flex flex-col items-center text-center">
                <div className=" text-3xl text-cyan-600">
                  <SiGoogleads />
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
          <Link to="/admin-total-visit">
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
                    {visit?.length}
                  </p>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Card for Closed Data */}
        <div className="w-full sm:w-1/2 lg:w-1/4 xl:w-1/6 my-3 p-0 sm-mx-0 mx-3">
          <Link to="/main-social-media-leads">
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
                  <FaMeta />
                </div>
                <div className="mt-2">
                  <h5
                    className={`text-xl font-semibold ${
                      selectedComponent === "ClosedData"
                        ? "text-white"
                        : "text-gray-800"
                    }`}
                  >
                    Total Meta Leads
                  </h5>
                  <p
                    className={`${
                      selectedComponent === "ClosedData"
                        ? "text-white"
                        : "text-gray-600 font-bold"
                    }`}
                  >
                    {metaLeads?.length}
                  </p>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Card for sold unit Data */}
        <div className="w-full sm:w-1/2 lg:w-1/4 xl:w-1/5 my-3 p-0 sm-mx-0 mx-3">
          <Link to="/employee-sold-units">
            <div
              className={`shadow-lg rounded-lg overflow-hidden cursor-pointer ${
                employeesold === "solddata" ? "bg-cyan-500 text-white" : ""
              }`}
              onClick={() => setSelectedComponent("solddata")}
            >
              <div className="p-4 flex flex-col items-center text-center">
                <div
                  className={`text-3xl ${
                    employeesold === "solddata" ? "text-white" : "text-cyan-600"
                  }`}
                >
                  <FaCheckCircle />
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

export default AdminOverviewDash;
