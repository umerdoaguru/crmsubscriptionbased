import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams, Link, useNavigate } from "react-router-dom";
import MainHeader from "../../components/MainHeader";
import SuperAdminSider from "./SuperAdminSider";
import ReactPaginate from "react-paginate";
import styled from "styled-components";

function EmployeeProfileContent() {
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
        `https://crm-generalize.dentalguru.software/api/employe-leads-super-admin/${employeeId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
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
          `https://crm-generalize.dentalguru.software/api/employeeProfile-super-admin/${employeeId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
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
      <div className="flex mt-20">
        <div className="w-full min-h-screen bg-[#F9FAFF] p-2">
          <div className="container px-5 ">
            <div className="mt-[2rem]">
              <button
                onClick={() => navigate(-1)}
                className="bg-blue-500 text-white px-3 py-1 max-sm:hidden rounded-lg hover:bg-blue-600 transition-colors"
              >
                Back
              </button>
            </div>
          </div>
          <div className="flex flex-col justify-center lg:flex-row px-5">
            <div className="flex-grow md:p-4 mt-4 lg:mt-0 sm:ml-0">
              <center className="text-2xl text-center mt-8 font-medium">
                Employee Profile
              </center>
              <center className="mx-auto h-[3px] w-16 bg-[#34495E] my-3"></center>
              <div className="flex flex-wrap justify-center mb-4">
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
                      <label className="text-info">User Id</label>
                      <div className="p-2 bg-gray-100 rounded">
                        <p className="m-0">{user.user_id}</p>
                      </div>
                    </div>

                    <div>
                      <label className="text-info">Created Date</label>
                      <div className="p-2 bg-gray-100 rounded">
                        <p className="m-0">
                          {moment(user.createdTime)
                            .format("DD MMM YYYY")
                            .toUpperCase()}
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
                              {moment(lead.createdTime)
                                .format("DD MMM YYYY")
                                .toUpperCase()}
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
        </div>
      </div>
    </>
  );
}

export default EmployeeProfileContent;
