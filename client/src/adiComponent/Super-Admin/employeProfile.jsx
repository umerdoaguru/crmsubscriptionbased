import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams, Link, useNavigate } from "react-router-dom";
import MainHeader from "./../../components/MainHeader";
import SuperAdminSider from "./SuperAdminSider";
import ReactPaginate from "react-paginate";
import styled from "styled-components";


const mockEmployeeData = {
  employeeId: 1,
  name: "John Doe",
  email: "john.doe@example.com",
  phone: "9876543210",
  position: "Software Engineer",
  designation: "Developer",
  createdTime: "2024-09-01 12:00:00",
  signature: "john-sign.png",
  photo: "john-profile.png",
};

function EmployeeProfile() {
  const [user, setUser] = useState([]); // Initialize state for employee data
  const { employeeId } = useParams();
  const [leads, setLeads] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
const itemsPerPage = 7; 
const navigate = useNavigate();

const superadminuser = useSelector((state) => state.auth.user);
const token = superadminuser.token;


  const fetchLeads = async () => {
    try {
      const response = await axios.get(
        `https://crmdemo.vimubds5.a2hosted.com/api/employe-leads-super-admin/${employeeId}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }}
      );
      const data = response.data;
      setLeads(data);
    } catch (error) {
      console.error("Error fetching leads:", error);
    }
  };
  
  const pageCount = Math.ceil(leads.length / itemsPerPage);

  // Pagination logic
  const indexOfLastLead = (currentPage + 1) * itemsPerPage;
  const indexOfFirstLead = indexOfLastLead - itemsPerPage;
  const currentLeads = leads.slice(indexOfFirstLead, indexOfLastLead);
  
  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
    console.log("change current page ", data.selected);
  };

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const response = await axios.get(
          `https://crmdemo.vimubds5.a2hosted.com/api/employeeProfile-super-admin/${employeeId}`,
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
          }}
        ); // Fetch employee data
        setUser(response.data[0]); // Set employee data to state
        console.log(response.data); // Debug: log employee data
      } catch (error) {
        console.error("Error fetching employee data:", error);
      }
    };

    fetchEmployee();
    fetchLeads();
  }, [employeeId]);

  

  return (
    <>
      <MainHeader />
      <SuperAdminSider />
      <div className="container px-5 ">
      <div className="mt-[5rem] 2xl:ml-32 ">
          <button
            onClick={() => navigate(-1)}
            className="bg-blue-500 text-white px-3 py-1 max-sm:hidden rounded-lg hover:bg-blue-600 transition-colors"
          >
            Back
          </button>
        </div>
      </div>
      <div className="flex flex-col justify-center lg:flex-row px-5">
        <div className="flex-grow md:p-4 mt-14 lg:mt-0 sm:ml-0">
          <center className="text-2xl text-center mt-8 font-medium">
            Employee Profile
          </center>
          <center className="mx-auto h-[3px] w-16 bg-[#34495E] my-3"></center>
          <div className="flex flex-wrap justify-center mb-4">
            {/* <div className="w-full lg:w-1/3">
            <img
              src={user.photo ? `path_to_images/${user.photo}` : img} // Use employee photo if available
              alt="employee-profile"
              className="rounded-lg"
            />
          </div> */}
            <div className="w-full md:w-2/3 md:mx-0 mx-3">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div>
                  <label className="text-info">Employee ID</label>
                  <div className="p-2 bg-gray-100 rounded">
                    <p className="m-0">{user.employeeId}</p>
                  </div>
                </div>

                <div>
                  <label className="text-info">Name</label>
                  <div className="p-2 bg-gray-100 rounded">
                    <p className="m-0">{user.name}</p>
                  </div>
                </div>

                <div>
                  <label className="text-info">Email</label>
                  <div className="p-2 bg-gray-100 rounded">
                    <p className="m-0">{user.email}</p>
                  </div>
                </div>

                <div>
                  <label className="text-info">Phone</label>
                  <div className="p-2 bg-gray-100 rounded">
                    <p className="m-0">{user.phone}</p>
                  </div>
                </div>

                <div>
                  <label className="text-info">Created Date</label>
                  <div className="p-2 bg-gray-100 rounded">
                    <p className="m-0">
              
                      {moment(user.createdTime).format("DD MMM YYYY").toUpperCase()}
                    </p>
                  </div>
                </div>
              </div>
<div className="overflow-auto">
              <table className="min-w-full   bg-white border mt-4">
                <thead>
                  <tr>
                    <th className="px-6 py-3 border-b-2 border-gray-300 text-left leading-4 text-gray-600 tracking-wider">
                      S.no
                    </th>
                    <th className="px-6 py-3 border-b-2 border-gray-300 text-left leading-4 text-gray-600 tracking-wider">
                      Lead Number
                    </th>
                    <th className="px-6 py-3 border-b-2 border-gray-300 text-left leading-4 text-gray-600 tracking-wider">
                      Assigned To
                    </th>
                    <th className="px-6 py-3 border-b-2 border-gray-300 text-left leading-4 text-gray-600 tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 border-b-2 border-gray-300 text-left leading-4 text-gray-600 tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 border-b-2 border-gray-300 text-left leading-4 text-gray-600 tracking-wider">
                      Phone
                    </th>
                    <th className="px-6 py-3 border-b-2 border-gray-300 text-left leading-4 text-gray-600 tracking-wider">
                      Lead Source
                    </th>
                  </tr>
                </thead>
                <tbody>
                {currentLeads.map((lead, index) => (
                    <tr
                      key={lead.id}
                      className={index % 2 === 0 ? "bg-gray-100" : ""}
                    >
                      <td className="px-6 py-4 border-b border-gray-200 text-gray-800">
                      {index + 1 + currentPage * itemsPerPage}
                      </td>
                      <Link
                        to={`/super-admin-lead-single-data/${lead.lead_id}`}
                      >
                        <td className="px-6 py-4 border-b border-gray-200  underline text-[blue]">
                          {lead.lead_no}
                        </td>
                      </Link>
                      <td className="px-6 py-4 border-b border-gray-200 text-gray-800">
                        {lead.assignedTo}
                      </td>
                      <td className="px-6 py-4 border-b border-gray-200 text-gray-800">
                        {moment(lead.createdTime).format("DD MMM YYYY").toUpperCase()}
                      </td>
                      <td className="px-6 py-4 border-b border-gray-200 text-gray-800">
                        {lead.name}
                      </td>
                      <td className="px-6 py-4 border-b border-gray-200 text-gray-800">
                        {lead.phone}
                      </td>
                      <td className="px-6 py-4 border-b border-gray-200 text-gray-800">
                        {lead.leadSource}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-2 mb-2 flex justify-center">
        <ReactPaginate
          previousLabel={"Previous"}
          nextLabel={"Next"}
          breakLabel={"..."}
          pageCount={pageCount}
forcePage={currentPage}
          marginPagesDisplayed={2}
          pageRangeDisplayed={3}
          onPageChange={handlePageClick}
          containerClassName={"pagination"}
          activeClassName={"active"}
          pageClassName={"page-item"}
          pageLinkClassName={"page-link"}
          previousClassName={"page-item"}
          nextClassName={"page-item"}
          previousLinkClassName={"page-link"}
          nextLinkClassName={"page-link"}
          breakClassName={"page-item"}
          breakLinkClassName={"page-link"}
        />
</div>
    </>
  );
};

export default EmployeeProfile;
const PaginationWrapper = styled.div`
padding-bottom: 2rem;
.pagination-container {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.5rem; // Reduced gap for better spacing
    margin-top: 1.5rem;
  }

  .pagination-page {
    background-color: #ffffff;
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transition: background-color 0.3s, transform 0.2s;
  }

  .pagination-link {
    padding: 0.5rem 1rem; // Increased padding for better click area
    font-size: 0.875rem;
    color: #3b82f6;
    text-decoration: none;
    transition: color 0.3s;

    &:hover {
      color: #2563eb;
    }
  }

  .pagination-previous,
  .pagination-next,
  .pagination-break {
    background-color: #ffffff;
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transition: background-color 0.3s, transform 0.2s;
  }

  .pagination-link-previous,
  .pagination-link-next,
  .pagination-break-link {
    padding: 0.5rem 1rem; // Increased padding for consistency
    font-size: 0.875rem;
    color: #374151;
    transition: background-color 0.3s;

    &:hover {
      background-color: #f3f4f6; // Light gray on hover
      transform: translateY(-1px); // Subtle lift effect
    }
  }

  .pagination-active {
    background-color: #1e50ff;
    color: white;
    border: 1px solid #374151;
    border-radius: 0.375rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }

  .pagination-active .pagination-link {
    color: white !important; // Ensure link inside active page is white
  }
`;