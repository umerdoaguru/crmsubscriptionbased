import React, { useState, useEffect } from "react";

import axios from "axios";
import moment from "moment";
import { useSelector } from "react-redux";
import ReactPaginate from "react-paginate";
import * as XLSX from "xlsx";



const EmpVisitReport = () => {
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const leadsPerPage = 6; // Default leads per page

 
  const [duration, setDuration] = useState("all"); // Default is "all"
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [selectedColumns, setSelectedColumns] = useState([
    "lead_no",
    "assignedTo",
    "name",
    "phone",
    "leadSource",
    "remark_status",
    "answer_remark",
    "meeting_status",
    "assignedBy",
    "lead_status",
    "address",
    "booking_amount",
    "deal_status",
    "employeeId",
    "follow_up_status",
    "payment_mode",
    "reason",
    "registry",
    "project_name",
    "visit",
    "visit_date",
    "d_closeDate",
    "createdTime",
    "actual_date",
    
  ]);
  const EmpId = useSelector((state) => state.auth.user);

  const token = EmpId?.token;


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
      // Filter out leads where visit is "Pending"
      const nonPendingLeads = response.data.filter((lead) =>
        ["fresh", "re-visit", "self", "associative"].includes(lead.visit)
      );
      setLeads(nonPendingLeads);
      setFilteredLeads(nonPendingLeads); // Initial data set for filtering
    } catch (error) {
      console.error("Error fetching leads:", error);
    }
  };
 

  const filterByDuration = (leads, duration) => {
    const today = moment();

    switch (duration) {
      case "week":
        return leads.filter((lead) =>
          moment(lead.visit_date).isSame(today, "week")
        );
      case "month":
        return leads.filter((lead) =>
          moment(lead.visit_date).isSame(today, "month")
        );
      case "year":
        return leads.filter((lead) =>
          moment(lead.visit_date).isSame(today, "year")
        );
      case "all":
      default:
        return leads;
    }
  };



  // Automatically apply date filter when start or end date changes

  useEffect(() => {
    let filtered = leads;

    

    // Filter by selected employee
    
    filtered = filterByDuration(filtered, duration);

    setFilteredLeads(filtered);
  }, [ selectedEmployee,duration, leads]);

  const downloadExcel = () => {
    // Map to rename keys for export
    const columnMapping = {
      lead_no: "Lead Number",
      assignedTo: "Assigned To",
      name: "Name",
      phone: "Phone",
      leadSource: "Lead Source",
      remark_status: "Remark Status",
      answer_remark: "Answer Remark",
      meeting_status: "Meeting Status",
      assignedBy: "Assigned By",
      lead_status: "Lead Status",
      address: "Address",
      booking_amount: "Booking Amount",
      deal_status: "Deal Status",
      employeeId: "Employee ID",
      follow_up_status: "Follow-up Status",
      payment_mode: "Payment Mode",
      reason: "Reason",
      registry: "Registry",
      project_name: "Project",
      visit: "Visit",
      visit_date: "Visit Date",
      d_closeDate: "Close Date",
      createdTime: "Assigned Date",
      actual_date: "Actual Date",
    };
  
    const completedLeads = filteredLeads.map((lead) => {
      const formattedLead = {};
    
      selectedColumns.forEach((col) => {
        const newKey = columnMapping[col] || col;
    
        if (["actual_date", "createdTime", "visit_date", "d_closeDate"].includes(col)) {
          // Check if date exists and is valid
          formattedLead[newKey] =
            lead[col] && moment(lead[col], moment.ISO_8601, true).isValid()
              ? moment(lead[col]).format("DD MMM YYYY").toUpperCase()
              : "pending"; // If invalid or missing, set as "PENDING"
        } else {
          formattedLead[newKey] = lead[col]; // Assign other fields normally
        }
      });
  
      
       
        

  
        return formattedLead;
      });
  
    // Generate Excel file
    const worksheet = XLSX.utils.json_to_sheet(completedLeads);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Visit Report");
    XLSX.writeFile(workbook, `Visit of ${duration} Report.xlsx`);
  };

  // Pagination logic
  const pageCount = Math.ceil(filteredLeads.length / leadsPerPage);

  // Pagination logic
  const indexOfLastLead = (currentPage + 1) * leadsPerPage;
  const indexOfFirstLead = indexOfLastLead - leadsPerPage;
  const currentLeads = filteredLeads.slice(indexOfFirstLead, indexOfLastLead);

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  return (
    <>
      <div className="container 2xl:w-[95%]">
      <div className="flex-grow  mt-14 lg:mt-0 sm:ml-0">
       
       
        {/* Date Filter */}
        <div className="flex mb-4 sm:flex-row justify-end flex-col gap-2">
   
            <div>
              <select
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="border p-2 rounded"
              >
                <option value="all">All</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="year">This Year</option>
              </select>
            </div>
            <button
              onClick={downloadExcel}
              className="bg-blue-500 text-white font-medium px-4 py-2 rounded hover:bg-blue-700"
            >
              Download Excel
            </button>
          </div>

        {/* Table */}
        <div className="overflow-x-auto mt-4">
          <table className="min-w-full bg-white border">
            <thead>
            <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      S.no
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
            <tbody>
  {currentLeads.length === 0 ? (
    <tr>
      <td colSpan="11" className="px-6 py-4 border-b border-gray-200 text-center text-gray-500">
        No data found
      </td>
    </tr>
  ) : (
    currentLeads.map((visit, index) => (
      <tr
        key={visit.id}
        className={index % 2 === 0 ? "bg-gray-100" : ""}
      >
        <td className="px-6 py-4 border-b border-gray-200 text-gray-800">
          {currentPage * leadsPerPage + index + 1}
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
  )}
</tbody>

          </table>
        </div>
        <div className="mt-3 mb-2 flex justify-center">
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
      </div></div>
    </>
  );
};

export default EmpVisitReport;


