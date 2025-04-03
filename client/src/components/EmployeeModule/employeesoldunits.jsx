import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import MainHeader from "./../MainHeader";
import EmployeeeSider from "./EmployeeSider";
import ReactPaginate from "react-paginate";
import moment from "moment";

const Employeesoldunit = () => {
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [leadsPerPage, setLeadsPerPage] = useState(7);

  const EmpId = useSelector((state) => state.auth.user);
  const token = EmpId?.token;
  const navigate = useNavigate();

  useEffect(() => {
    if (EmpId && token) {
      fetchEmployeeSoldUnits();
    }
  }, [EmpId, token]);

  const fetchEmployeeSoldUnits = async () => {
    try {
      const response = await axios.get(
        `https://crmdemo.vimubds5.a2hosted.com/api/unit-sold/${EmpId.id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setLeads(response.data);
      setFilteredLeads(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching leads:", error);
    }
  };

  useEffect(() => {
    let filtered = leads;
    if (searchTerm) {
      const trimmedSearchTerm = searchTerm.toLowerCase().trim();
      filtered = filtered.filter((lead) =>
        ["project_name", "name", "employee_name", "visit"].some((key) =>
          lead[key]?.toLowerCase().trim().includes(trimmedSearchTerm)
        )
      );
    }
    setFilteredLeads(filtered);
    setCurrentPage(0);
  }, [searchTerm, leads]);

  // Pagination logic
  const pageCount = Math.ceil(filteredLeads.length / leadsPerPage);
  const indexOfLastLead = (currentPage + 1) * leadsPerPage;
  const indexOfFirstLead = indexOfLastLead - leadsPerPage;
  const currentLeads =
    leadsPerPage === Infinity
      ? filteredLeads
      : filteredLeads.slice(indexOfFirstLead, indexOfLastLead);

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
    console.log("Current page:", data.selected);
  };

  const handleLeadsPerPageChange = (e) => {
    const value = e.target.value;
    setLeadsPerPage(value === "All" ? Infinity : parseInt(value, 10));
    setCurrentPage(0);
  };

  return (
    <>
      <MainHeader />
      <EmployeeeSider />
      <div className="mt-[6rem] 2xl:ml-40">
        <button
          onClick={() => navigate(-1)}
          className="bg-blue-500 text-white px-3 py-1 max-sm:hidden rounded-lg hover:bg-blue-600 transition-colors"
        >
          Back
        </button>
      </div>
      <div className="flex flex-col 2xl:ml-40">
        <div className="flex-grow p-4 sm:ml-0">
          <h2 className="text-2xl text-center mt-2 font-medium">
            Employee Sold Units
          </h2>
          <div className="mx-auto h-[3px] w-16 bg-[#34495E] my-3"></div>
            <div className="flex justify-between mb-3">
              <input
                type="text"
                placeholder="Project Name, Customer Name, Visit Type, Employee Name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border rounded-2xl p-2 w-1/4"
              />
              <select
                onChange={handleLeadsPerPageChange}
                className="border rounded-2xl p-2 w-1/4"
              >
                <option value={7}>Number of rows: 7</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value="All">All</option>
              </select>
            </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 border border-gray-300">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    S.no
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Lead Id
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Project Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Unit Number
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Employee Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Unit Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentLeads.length > 0 ? (
                  currentLeads.map((employeesoldunit, index) => (
                    <tr key={employeesoldunit.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {leadsPerPage === Infinity
                          ? index + 1
                          : index + 1 + currentPage * leadsPerPage}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {employeesoldunit.lead_id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {employeesoldunit.project_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {employeesoldunit.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {employeesoldunit.unit_no}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {employeesoldunit.employee_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {employeesoldunit.unit_status}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                  {moment(employeesoldunit.date).format("DD MMM YYYY").toUpperCase()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="py-4 text-center">
                      No data found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
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
};

export default Employeesoldunit;
