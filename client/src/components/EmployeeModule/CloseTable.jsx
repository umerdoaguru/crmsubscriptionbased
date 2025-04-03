import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import moment from "moment";
import * as XLSX from "xlsx";
import MainHeader from "../MainHeader";
import EmployeeSider from "../EmployeeModule/EmployeeSider";
import Pagination from "../../adiComponent/comp/pagination";
import ReactPaginate from "react-paginate";
import { useNavigate } from "react-router-dom";

const CloseTable = () => {
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(0); // Current page state
  const [leadsPerPage, setLeadsPerPage] = useState(7); // Default leads per page
  const EmpId = useSelector((state) => state.auth.user);
  const token = EmpId?.token;
  const navigate = useNavigate();

  // Fetch leads from the API
  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const response = await axios.get(
        `https://crmdemo.vimubds5.a2hosted.com/api/employe-leads/${EmpId.id}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }}
      );
      // Filter out leads where deal_status is not "pending"
      const nonPendingLeads = response.data.filter(
        (lead) => lead.deal_status == "close"
      );

      setLeads(nonPendingLeads);
      setFilteredLeads(nonPendingLeads); // Initial data set for filtering
    } catch (error) {
      console.error("Error fetching leads:", error);
    }
  };

  // Automatically apply date filter when start or end date changes
  useEffect(() => {
    let filtered = leads;

    // Filter by search term
 // Filter by search term
 if (searchTerm) {
  const trimmedSearchTerm = searchTerm.toLowerCase().trim();
  filtered = filtered.filter((lead) =>
    ["project_name", "name", "leadSource", "phone","assignedTo"].some((key) =>
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
      <EmployeeSider />
      <div className="flex flex-col  2xl:ml-44"> 
          <div className="mt-[6rem] ">
          <button
            onClick={() => navigate(-1)}
            className="bg-blue-500 text-white px-3 py-1 max-sm:hidden rounded-lg hover:bg-blue-600 transition-colors"
          >
            Back
          </button>
        </div>
        <div className="flex-grow p-4 mt-2 lg:mt-2 sm:ml-0">
          <center className="text-2xl text-center  font-medium">
            Total Closed Deals
          </center>
          <center className="mx-auto h-[3px] w-16 bg-[#34495E] my-3"></center>
          <div className="flex justify-between mb-3" >
               
               <input
                 type="text"
                  placeholder="Project Name, Name,Lead Source,Assigned To,Phone No"
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

          <div className="overflow-x-auto mt-4">
            <table className="min-w-full bg-white border">
              <thead>
                <tr>
                  <th className="px-6 py-3 border-b-2 border-gray-300">S.no</th>
                  <th className="px-6 py-3 border-b-2 border-gray-300">
                    Project Name
                  </th>
                  <th className="px-6 py-3 border-b-2 border-gray-300">
                    Lead Id
                  </th>
                  <th className="px-6 py-3 border-b-2 border-gray-300">
                    Assigned To
                  </th>
                  <th className="px-6 py-3 border-b-2 border-gray-300">
                    Lead Name
                  </th>
              
                  <th className="px-6 py-3 border-b-2 border-gray-300">
                    Phone
                  </th>
                  <th className="px-6 py-3 border-b-2 border-gray-300">
                    Lead Source
                  </th>
                  <th className="px-6 py-3 border-b-2 border-gray-300">
                    Visit
                  </th>
                  
                  
                  <th className="px-6 py-3 border-b-2 border-gray-300">
                    FollowUp Status
                  </th>
                  <th className="px-6 py-3 border-b-2 border-gray-300">
                    Deal Status
                  </th>
                  <th className="px-6 py-3 border-b-2 border-gray-300">
                    Deal Close Date
                  </th>
                </tr>
              </thead>
              <tbody>
              {currentLeads.length > 0 ? (
                currentLeads
                  .filter((lead) => lead.deal_status === "close") // Filter out closed deals
                  .map((lead, index) => (
                    <tr
                      key={lead.id}
                      className={index % 2 === 0 ? "bg-gray-100" : ""}
                    >
                      <td className="px-6 py-4 border-b border-gray-200 text-gray-800">
                        {index + 1}{" "}
                        {/* Adjusted for pagination */}
                      </td>
                      <td className="px-6 py-4 border-b border-gray-200 text-gray-800">
                        {lead.project_name}
                      </td>
                      <td className="px-6 py-4 border-b border-gray-200 text-gray-800">
                        {lead.lead_id}
                      </td>
                      <td className="px-6 py-4 border-b border-gray-200 text-gray-800">
                        {lead.assignedTo}
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
                      <td className="px-6 py-4 border-b border-gray-200 text-gray-800">
                        {lead.visit}
                      </td>
                      
                      <td className="px-6 py-4 border-b border-gray-200 text-gray-800">
                        {lead.follow_up_status}
                      </td>
                      <td className="px-6 py-4 border-b border-gray-200 text-gray-800">
                        {lead.deal_status}
                      </td>
                      <td className="px-6 py-4 border-b border-gray-200 text-gray-800">
                        
                        {moment(lead.d_closeDate).format("DD MMM YYYY").toUpperCase()}
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
          <div className="mt-4 flex justify-center">
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

export default CloseTable;
