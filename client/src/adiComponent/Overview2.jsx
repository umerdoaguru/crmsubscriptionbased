import React, { useEffect, useState } from "react";
import LeadData from "../components/DataExport/LeadData";
import QuotationData from "../components/DataExport/QuotationData";
import InvoiceData from "../components/DataExport/InvoiceData"; // Add your invoice component here if it exists
import Employees from "../components/DataExport/Employees";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
// import MainHeader from '../components/MainHeader';
// import Sider from '../components/Sider';
import { SiMoneygram } from "react-icons/si";
import { MdOutlineNextWeek } from "react-icons/md";
import { AiOutlineProject } from "react-icons/ai";
import { GiFiles, GiMoneyStack  } from "react-icons/gi";
import { FaCheckCircle } from "react-icons/fa"; 
import { Link, useNavigate } from "react-router-dom";
import { logoutUser } from "../store/UserSlice";
import cogoToast from "cogo-toast";

const Overview2 = () => {
  // const [metrics, setMetrics] = useState([
  //     { title: 'Total Leads', value: 0, positive: true },
  //     { title: 'Total Invoices', value: 0, positive: false },
  //     { title: 'Total Quotation', value: 0, positive: true },
  //     { title: 'Total Employees', value: 0, positive: true },
  // ]);
  const [leads, setLeads] = useState([]);
  const [employee, setEmployee] = useState([]);
  const [selectedComponent, setSelectedComponent] = useState("LeadData"); // Set 'LeadData' as default
  const [visit , setVisit] = useState([]);
  const superadminuser = useSelector((state) => state.auth.user);
  const token = superadminuser.token;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [project , setProjects] = useState([]);
  const [employeesold, setemployeesold] = useState([]);


  const fetchLeads = async () => {
    try {
      const response = await axios.get("https://crmdemo.vimubds5.a2hosted.com/api/leads-super-admin",
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }});
      setLeads(response.data);
    } catch (error) {
   
      if (error?.response?.status === 401) {
        navigate("/main_page_crm");
        dispatch(logoutUser());
        cogoToast.error("Token is expired Please Login Again !!");
      }
    }
  };

  const fetchEmployee = async () => {
    try {
      const response = await axios.get(`https://crmdemo.vimubds5.a2hosted.com/api/employee-super-admin`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }});
      setEmployee(response.data);
    } catch (error) {
      console.error("Error fetching employee data:", error);
    }
  };

  const fetchVisit = async () => {
    try {
      const response = await axios.get(
        `https://crmdemo.vimubds5.a2hosted.com/api/employe-all-visit-super-admin`,
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

  const fetchProjects = async () => {
    try {
      const response = await axios.get(
        `https://crmdemo.vimubds5.a2hosted.com/api/super-admin-all-project`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }}
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
        `https://crmdemo.vimubds5.a2hosted.com/api/super-admin-unit-sold`,
        
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }}
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
    fetchEmployee();
  fetchVisit();
  employeesoldunit();
  }, []);

  const employeeCount = employee.length;
  const leadCount = leads.length;
  const closedCount = leads.filter(
    (lead) => lead.deal_status === "close"
  ).length;
  
  const soldunit = employeesold.length;

  const visitCount = leads.filter((lead) =>
    ["fresh", "re-visit", "self", "associative"].includes(lead.visit)
  ).length;

  const projectCount = project.length

  return (
    <>
      <div className="flex flex-wrap justify-around mt-5">

      <div className="w-full sm:w-1/2 lg:w-1/4 xl:w-1/6 my-3 p-0 sm-mx-0 mx-3 ">
          <Link to="/Super-admin-project">
            <div
              className="shadow-lg rounded-lg overflow-hidden cursor-pointer text-gray-600 border-1" // Change background color if active
              //   onClick={() => setSelectedComponent('LeadData')}  // Set selected component
            >
              <div className="p-4 flex flex-col items-center text-center">
                <div className=" text-3xl text-gray-700">
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
            <div
              className="shadow-lg rounded-lg overflow-hidden cursor-pointer text-gray-600 border-1" // Change background color if active
              //   onClick={() => setSelectedComponent('LeadData')}  // Set selected component
            >
              <div className="p-4 flex flex-col items-center text-center">
                <div className=" text-3xl text-gray-700">
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
                <div className=" text-3xl text-gray-700">
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

        {/* <div className="w-full sm:w-1/2 lg:w-1/4 xl:w-1/6 my-3 p-0 sm-mx-0 mx-3">
          <Link to="/super-admin-total-employee">
            <div
              className="shadow-lg rounded-lg overflow-hidden cursor-pointer text-gray-600" // Change background color if active
              //   onClick={() => setSelectedComponent('EmployeeData')}  // Set selected component
            >
              <div className="p-4 flex flex-col items-center text-center">
                <div className=" text-3xl text-gray-700">
                  <SiMoneygram />
                </div>
                <div className="mt-2">
                  <h5 className="text-gray-800 text-xl font-semibold ">
                    Total Employees{" "}
                  </h5>
                  <p className="text-gray-800 text-xl font-semibold ">
                    {employeeCount}
                  </p>
                </div>
              </div>
            </div>
          </Link>
        </div> */}

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
        </div>

        {/* Card for sold unit Data */}
                <div className="w-full sm:w-1/2 lg:w-1/4 xl:w-1/5 my-3 p-0 sm-mx-0 mx-3">
                  <Link to="/super-admin-Sold-Units">
                    <div
                      className={`shadow-lg rounded-lg overflow-hidden cursor-pointer ${
                        employeesold === "soldunit"
                          ? "bg-blue-500 text-white"
                          : ""
                      }`}
                      onClick={() => setSelectedComponent("soldunit")}
                    >
                      <div className="p-4 flex flex-col items-center text-center">
                        <div
                          className={`text-3xl ${
                            employeesold === "soldunit"
                              ? "text-white"
                              : "text-gray-700"
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

export default Overview2;
