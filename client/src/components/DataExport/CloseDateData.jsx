import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import { useSelector } from "react-redux";
import ReactPaginate from "react-paginate";
import * as XLSX from "xlsx";
import styled from "styled-components";

const CloseData = () => {
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const leadsPerPage = 6; // Default leads per page
  const EmpId = useSelector((state) => state.auth.user.id);
  const [employees, setEmployees] = useState([]);
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

  // Fetch leads from the API
  useEffect(() => {
    fetchLeads();
    fetchEmployees();
  }, []);
  const adminuser = useSelector((state) => state.auth.user);
  const token = adminuser.token;

  const fetchLeads = async () => {
    try {
      const response = await axios.get(
        `https://crmdemo.vimubds5.a2hosted.com/api/leads`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }}
      );
      // Filter out leads where deal status is "pending"
      const nonPendingLeads = response.data.filter(
        (lead) => lead.deal_status == "close"
      );

      setLeads(nonPendingLeads);
      setFilteredLeads(nonPendingLeads); // Initial data set for filtering
    } catch (error) {
      console.error("Error fetching leads:", error);
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await axios.get("https://crmdemo.vimubds5.a2hosted.com/api/employee",
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }});
      setEmployees(response.data);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };


  useEffect(() => {
    let filtered = leads;
  
    // Filter by date range
    if (startDate && endDate) {
      filtered = filtered.filter((lead) => {
        const closeDate = moment(lead.d_closeDate, "YYYY-MM-DD", true); // Strict date parsing
        return closeDate.isValid() && closeDate.isBetween(startDate, endDate, undefined, "[]");
      });
    }
  
    // Filter by selected employee
    if (selectedEmployee) {
      filtered = filtered.filter((lead) => lead.assignedTo === selectedEmployee);
    }
  
    setFilteredLeads(filtered);
  }, [startDate, endDate, selectedEmployee, leads]);
  
  const downloadExcel = () => {
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
  
    // Filter and format data for the Excel report
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
  
    // Ensure we handle empty reports gracefully
    if (completedLeads.length === 0) {
      alert("No data available for the selected date range.");
      return;
    }
  
    // Generate the Excel workbook
    const worksheet = XLSX.utils.json_to_sheet(completedLeads);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Report");
  
    // Generate a valid filename
    const filename = `Closed Lead Report ${
      startDate ? moment(startDate).format("DD-MM-YYYY") : "Start"
    } to ${
      endDate ? moment(endDate).format("DD-MM-YYYY") : "End"
    }.xlsx`;
  
    // Download the Excel file
    XLSX.writeFile(workbook, filename);
  };
  

  const pageCount = Math.ceil(filteredLeads.length / leadsPerPage);

  // Pagination logic
  const indexOfLastLead = (currentPage + 1) * leadsPerPage;
  const indexOfFirstLead = indexOfLastLead - leadsPerPage;
  const currentLeads = filteredLeads.slice(indexOfFirstLead, indexOfLastLead);
  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  return (
    <Wrapper>
      <div className="container 2xl:w-[95%]">
      <div className="flex-grow mt-14 lg:mt-0 sm:ml-0">
        <center className="text-2xl text-center mt-8 font-medium">
          Closed Deal Data
        </center>
        <center className="mx-auto h-[3px] w-16 bg-[#34495E] my-3"></center>

        {/* Date Filter */}
        <div className="flex  mb-4 sm:flex-row flex-col gap-2">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border p-1"
          />
          <div className="p-1">
            <p>to</p>
          </div>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border p-1"
          />
            <div className="">
            <select
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(e.target.value)}
              className="border p-1"
            >
              <option value="">Select Employee</option>
              {employees.map((employee) => (
                <option key={employee.id} value={employee.name}>
                  {employee.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="respo  ">
            <button
              onClick={downloadExcel}
              className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded "
            >
              Download Excel
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto mt-4">
          <table className="min-w-full bg-white border">
            <thead>
              <tr>
                <th className="px-6 py-3 border-b-2 border-gray-300">S.no</th>
                <th className="px-6 py-3 border-b-2 border-gray-300">
                  Lead Number
                </th>
                <th className="px-6 py-3 border-b-2 border-gray-300">
                  Assigned To
                </th>
                <th className="px-6 py-3 border-b-2 border-gray-300">
                  Lead Name
                </th>
               
                <th className="px-6 py-3 border-b-2 border-gray-300">Phone</th>
                <th className="px-6 py-3 border-b-2 border-gray-300">
                  Lead Source
                </th>
             
             
              
                <th className="px-6 py-3 border-b-2 border-gray-300">
                  Deal Status
                </th>
                <th className="px-6 py-3 border-b-2 border-gray-300">
                  Closed Deal Date
                </th>
              </tr>
            </thead>
            <tbody>
              {currentLeads.length === 0 ? (
                <tr>
                  <td
                    colSpan="11"
                    className="px-6 py-4 border-b border-gray-200 text-center text-gray-500"
                  >
                    No data found
                  </td>
                </tr>
              ) : (
                currentLeads.map((lead, index) => (
                  <tr
                    key={lead.id}
                    className={index % 2 === 0 ? "bg-gray-100" : ""}
                  >
                    <td className="px-6 py-4 border-b border-gray-200 text-gray-800">
                      {index + 1 + currentPage * leadsPerPage}
                    </td>
                    <td className="px-6 py-4 border-b border-gray-200 text-gray-800">
                      {lead.lead_no}
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
                      {lead.deal_status}
                    </td>
                    <td className="px-6 py-4 border-b border-gray-200 text-gray-800">
               
                      {moment(lead.d_closeDate).format("DD MMM YYYY").toUpperCase()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
       
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
      </div></div>
    </Wrapper>
  );
};

export default CloseData;

const Wrapper = styled.div`
  .respo {
    @media screen and (max-width: 768px) {
      margin-top: 1rem;
    }
  }
  

`;
