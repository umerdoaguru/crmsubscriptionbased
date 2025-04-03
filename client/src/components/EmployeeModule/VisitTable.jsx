import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import { useSelector } from "react-redux";
import * as XLSX from "xlsx";
import styled from "styled-components";
import MainHeader from "./../MainHeader";
import EmployeeeSider from "./EmployeeSider";
import ReactPaginate from "react-paginate";


const VisitTable = () => {
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(0); // Current page for pagination
  const [leadsPerPage, setLeadsPerPage] = useState(7); // Default leads per page
  const EmpId = useSelector((state) => state.auth.user);
  const token = EmpId?.token;
  const navigate = useNavigate();
  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const response = await axios.get(`https://crmdemo.vimubds5.a2hosted.com/api/employe-leads/${EmpId.id}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }});
        const nonPendingLeads = response.data.filter((lead) =>
          ["fresh", "re-visit", "self", "associative"].includes(lead.visit)
        );
      setLeads(nonPendingLeads);
      setFilteredLeads(nonPendingLeads); // Initial data set for filtering
    } catch (error) {
      console.error("Error fetching leads:", error);
    }
  };
  useEffect(() => {
    let filtered = leads;

    // Filter by search term
    if (searchTerm) {
      const trimmedSearchTerm = searchTerm.toLowerCase().trim();
      filtered = filtered.filter((lead) =>
        ["project_name", "name", "employee_name", "visit"].some((key) =>
          lead[key]?.toLowerCase().trim().includes(trimmedSearchTerm)
        )
      );
    }

    // Update the filtered leads and reset to the first page
    setFilteredLeads(filtered);
    setCurrentPage(0); // Reset to the first page when the search term changes
  }, [searchTerm, leads]);

  // Pagination logic
  const pageCount = Math.ceil(filteredLeads.length / leadsPerPage);
  const indexOfLastLead = (currentPage + 1) * leadsPerPage;
  const indexOfFirstLead = indexOfLastLead - leadsPerPage;
  // const currentLeads = filteredLeads.slice(indexOfFirstLead, indexOfLastLead);
  const currentLeads =
  leadsPerPage === Infinity ? filteredLeads : filteredLeads.slice(indexOfFirstLead, indexOfLastLead);


 
  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
    console.log("change current page ", data.selected);
  };

  const handleLeadsPerPageChange = (e) => {
    const value = e.target.value;
    setLeadsPerPage(value === "All" ? Infinity : parseInt(value, 10));
    setCurrentPage(0); // Reset to the first page
  };
  return (
    <>
      <MainHeader />
      <EmployeeeSider />
      <div className="mt-[6rem] 2xl:ml-40 ">
          <button
            onClick={() => navigate(-1)}
            className="bg-blue-500 text-white px-3 py-1 max-sm:hidden rounded-lg hover:bg-blue-600 transition-colors"
          >
            Back
          </button>
        </div>
      <div className="flex flex-col 2xl:ml-40 ">
        <div className="flex-grow p-4 m  sm:ml-0">
          <center className="text-2xl text-center mt-2 font-medium">
            Total Visits
          </center>
          <center className="mx-auto h-[3px] w-16 bg-[#34495E] my-3"></center>
          <div className="flex justify-between mb-3" >
               
               <input
                 type="text"
                 placeholder="PRoject Name, Name,Visit Type,Assigned To"
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
                 className="border rounded-2xl p-2 w-25"
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
                     Project Name 
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                     Lead Id 
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                     Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Assigned To
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Visit 
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Visit Date
                    </th>
                   
                
                  </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentLeads.length > 0 ? (
                  currentLeads.map((visit, index) => (
                    <tr key={visit.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                    {leadsPerPage === Infinity ? index + 1 : index + 1 + currentPage * leadsPerPage}

                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {visit.project_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {visit.lead_id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {visit.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                     {visit.assignedTo}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                     {visit.visit}
                    </td>
                    <td className="px-6 py-4 border-b border-gray-200 text-gray-800">
                     {visit.visit_date === "pending"
                       ? "pending"
                       : moment(visit.visit_date).format("DD MMM YYYY").toUpperCase()}
                   </td>
                  </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={11} className="py-4 text-center">
                      No data found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="text-center">
            
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
      </div>
    </>
  );
};

export default VisitTable;

const Wrapper = styled.div`
  // You can add styled-components styles here
`;
