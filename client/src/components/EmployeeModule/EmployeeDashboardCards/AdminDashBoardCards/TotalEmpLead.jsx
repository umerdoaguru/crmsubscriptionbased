import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import EmployeeSider from "./../../EmployeeSider";
import MainHeader from "../../../MainHeader";
import Pagination from "../../../../adiComponent/comp/pagination";
import ReactPaginate from "react-paginate";

function TotalEmpLead() {
  const EmpId = useSelector((state) => state.auth.user);
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [leadsPerPage, setLeadsPerPage] = useState(7); // Default leads per page
  const navigate = useNavigate();

  
  const token = EmpId?.token;
  console.log(token);
  

  useEffect(() => {
    fetchLeads();

    // Cleanup function to avoid memory leaks
    return () => {
      setLeads([]);
    };
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
      setLeads(response.data);
    } catch (error) {
      console.error("Error fetching leads:", error);
    }
  };

  const handleBackClick = () => {
    navigate(-1); // Go back to the previous page
  };
  useEffect(() => {
    let filtered = leads;

 // Filter by search term
 if (searchTerm) {
  const trimmedSearchTerm = searchTerm.toLowerCase().trim();
  filtered = filtered.filter((lead) =>
    ["project_name","name", "leadSource", "phone","assignedTo"].some((key) =>
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
      <div className="flex flex-col 2xl:ml-44 ">
      <div className="mt-[6rem] ">
          <button
            onClick={() => navigate(-1)}
            className="bg-blue-500 text-white px-3 mx-1 py-1 max-sm:hidden rounded-lg hover:bg-blue-600 transition-colors"
          >
            Back
          </button>
        </div>
        <div className="flex-grow p-4 mt-2 lg:mt-5 sm:ml-0">
          <center className="text-2xl text-center  font-medium">
            Total Assign Leads
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
            <table className="container bg-white border">
              <thead>
                <tr>
                  <th className="px-6 py-3 border-b-2 border-gray-300 text-left leading-4 text-gray-600 tracking-wider">
                    S.no
                  </th>
                  <th className="px-6 py-3 border-b-2 border-gray-300 text-left leading-4 text-gray-600 tracking-wider">
                    Project Name
                  </th>
                  <th className="px-6 py-3 border-b-2 border-gray-300 text-left leading-4 text-gray-600 tracking-wider">
                    Lead Id
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
                  <th className="px-6 py-3 border-b-2 border-gray-300 text-left leading-4 text-gray-600 tracking-wider">
                    Assigned To
                  </th>
                
                  <th className="px-6 py-3 border-b-2 border-gray-300 text-left leading-4 text-gray-600 tracking-wider">
                    Lead Status
                  </th>
                  <th className="px-6 py-3 border-b-2 border-gray-300 text-left leading-4 text-gray-600 tracking-wider">
                    Assigned Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentLeads.map((lead, index) => (
                  <tr
                    key={lead.lead_id}
                    className={index % 2 === 0 ? "bg-gray-100" : ""}
                  >
                    <td className="px-6 py-4 border-b border-gray-200 text-gray-800">
                    {leadsPerPage === Infinity ? index + 1 : index + 1 + currentPage * leadsPerPage}

                    </td>
                    <td className="px-6 py-4 border-b border-gray-200 text-gray-800">
                     
                        {lead.project_name}
                      
                    </td>
                    <td className="px-6 py-4 border-b border-gray-200 text-gray-800">
                     
                        {lead.lead_id}
                      
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
                      {lead.assignedTo}
                    </td>
                    
                    <td className="px-6 py-4 border-b border-gray-200 text-gray-800">
                      {lead.lead_status}
                    </td>
                    <td className="px-6 py-4 border-b border-gray-200 text-gray-800">
                   
                      {moment(lead.createdTime).format("DD MMM YYYY").toUpperCase()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="mt-4 mb-3 flex justify-center">
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
    </>
  );
}

export default TotalEmpLead;
