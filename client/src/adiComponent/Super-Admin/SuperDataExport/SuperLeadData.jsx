import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import * as XLSX from "xlsx";
import ReactPaginate from "react-paginate"; // Import react-paginate
// import Sider from "../Sider";


import { useSelector } from "react-redux";
import Header from './../../../pages/Quotation/Header';

function SuperLeadData() {
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState("");

  const [currentPage, setCurrentPage] = useState(0);
  const leadsPerPage = 6; // Default leads per page

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

  const superadminuser = useSelector((state) => state.auth.user);
  const token = superadminuser.token;

  // Fetch leads and employees from the API
  useEffect(() => {
    fetchLeads();
    fetchEmployees();
  }, []);

  const fetchLeads = async () => {
    try {
      const response = await axios.get("https://crmdemo.vimubds5.a2hosted.com/api/leads-super-admin",
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }});
      setLeads(response.data);
      setFilteredLeads(response.data); // Initial data set for filtering
      console.log(leads);
      
    } catch (error) {
      console.error("Error fetching leads:", error);
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await axios.get("https://crmdemo.vimubds5.a2hosted.com/api/employee-super-admin",
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


  // Add a filter for completed leads within the useEffect for filtering
useEffect(() => {
  let filtered = leads;

  // Filter by date range if specified
  if (startDate && endDate) {
    filtered = filtered.filter((lead) => {
      const createdTime = moment(lead.createdTime, "YYYY-MM-DD");
      return createdTime.isBetween(startDate, endDate, undefined, "[]");
    });
  }

  // Filter by selected employee if specified
  if (selectedEmployee) {
    filtered = filtered.filter((lead) => lead.assignedTo === selectedEmployee);
  }

  // Filter by lead_status 'completed'
  filtered = filtered.filter((lead) => lead.lead_status === "completed");

  setFilteredLeads(filtered);
  setCurrentPage(0); // Reset to first page on filter change
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
  const filename = ` Lead Report ${
    startDate ? moment(startDate).format("DD-MM-YYYY") : "Start"
  } to ${
    endDate ? moment(endDate).format("DD-MM-YYYY") : "End"
  }.xlsx`;

  // Download the Excel file
  XLSX.writeFile(workbook, filename);
};




  // Pagination logic
  // Calculate total number of pages
  const pageCount = Math.ceil(filteredLeads.length / leadsPerPage);

  // Pagination logic
  const indexOfLastLead = (currentPage + 1) * leadsPerPage;
  const indexOfFirstLead = indexOfLastLead - leadsPerPage;
  const currentLeads = filteredLeads.slice(indexOfFirstLead, indexOfLastLead);
  
  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
    console.log("change current page ", data.selected);
  };
  return (
    <>
      <Header />
      {/* <Sider /> */}
      <div className="container 2xl:w-[95%] ">
        <h1 className="text-2xl text-center mt-[2rem] font-medium">
          Leads Data
        </h1>
        <div className="mx-auto h-[3px] w-16 bg-[#34495E] my-3"></div>

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

          {/* Employee Filter */}
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

          {/* Download Button */}
          <div className="respo ">
            <button
              onClick={downloadExcel}
              className="bg-blue-500 text-white font-medium px-4 py-2 rounded hover:bg-blue-700"
            >
              Download Excel
            </button>
          </div>
        </div>

        <div className=" overflow-auto  mt-4">
          <table className="min-w-full  bg-white border">
            <thead>
              <tr>
                <th className="px-6 py-3 border-b-2 border-gray-300">S.no</th>
                <th className="px-6 py-3 border-b-2 border-gray-300">Lead Number</th>
                <th className="px-6 py-3 border-b-2 border-gray-300">Assigned To</th>
                <th className="px-6 py-3 border-b-2 border-gray-300">Name</th>
                <th className="px-6 py-3 border-b-2 border-gray-300">Phone</th>
                <th className="px-6 py-3 border-b-2 border-gray-300">Lead Source</th>
                <th className="px-6 py-3 border-b-2 border-gray-300">Lead Status</th>
                <th className="px-6 py-3 border-b-2 border-gray-300">Assigned Date</th>
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
      <tr key={lead.id} className={index % 2 === 0 ? "bg-gray-100" : ""}>
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
          {lead.lead_status}
        </td>
        <td className="px-6 py-4 border-b border-gray-200 text-gray-800">
        {moment(lead.createdTime).format("DD MMM YYYY").toUpperCase()}
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
      </div>
    </>
  );
}

export default SuperLeadData;


  