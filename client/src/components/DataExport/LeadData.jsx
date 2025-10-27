import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import * as XLSX from "xlsx";
import ReactPaginate from "react-paginate";
import { useSelector } from "react-redux";

function LeadData() {
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const leadsPerPage = 6;
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
  const userId = superadminuser.staff_id;

  useEffect(() => {
    fetchLeads();
    fetchEmployees();
  }, []);

  const fetchLeads = async () => {
    try {
      const response = await axios.get(
        `https://crm-generalize.dentalguru.software/api/getLeadsByOrg/${superadminuser?.staff_org_id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setLeads(response.data);
      setFilteredLeads(response.data);
      console.log(leads);
    } catch (error) {
      console.error("Error fetching leads:", error);
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await axios.get(
        `https://crm-generalize.dentalguru.software/api/getAllEmployeeData/${superadminuser?.staff_org_id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setEmployees(response.data);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  useEffect(() => {
    let filtered = leads;

    if (startDate && endDate) {
      filtered = filtered.filter((lead) => {
        const createdTime = moment(lead.createdTime, "YYYY-MM-DD");
        return createdTime.isBetween(startDate, endDate, undefined, "[]");
      });
    }

    if (selectedEmployee) {
      filtered = filtered.filter(
        (lead) => lead.assignedTo === Number(selectedEmployee)
      );
    }

    setFilteredLeads(filtered);
    setCurrentPage(0);
  }, [startDate, endDate, selectedEmployee, leads]);

  const downloadExcel = () => {
    const columnMapping = {
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

        if (
          ["actual_date", "createdTime", "visit_date", "d_closeDate"].includes(
            col
          )
        ) {
          // Check if date exists and is valid
          formattedLead[newKey] =
            lead[col] && moment(lead[col], moment.ISO_8601, true).isValid()
              ? moment(lead[col]).format("DD MMM YYYY").toUpperCase()
              : "pending";
        } else {
          formattedLead[newKey] = lead[col];
        }
      });

      return formattedLead;
    });

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
    } to ${endDate ? moment(endDate).format("DD-MM-YYYY") : "End"}.xlsx`;

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
    console.log("change current page ", data.selected);
  };
  return (
    <>
      <div className="container 2xl:w-[95%] ">
        <h1 className="text-2xl text-center mt-[2rem] font-medium">
          Leads Data
        </h1>
        <div className="mx-auto h-[3px] w-16 bg-[#34495E] my-3"></div>

        {/* Date Filter */}
        <div className="flex flex-col sm:flex-row flex-wrap items-end gap-4 mb-4">
          {/* Start Date */}
          <div className="flex flex-col">
            <label className="mb-1 text-sm font-semibold text-gray-700">
              Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border rounded-lg px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          {/* End Date */}
          <div className="flex flex-col">
            <label className="mb-1 text-sm font-semibold text-gray-700">
              End Date
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border rounded-lg px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          {/* Employee Filter */}
          <div className="flex flex-col">
            <label className="mb-1 text-sm font-semibold text-gray-700">
              Employee
            </label>
            <select
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(e.target.value)}
              className="border rounded-lg px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              <option value="">Select Employee</option>
              {employees.map((employee) => (
                <option key={employee.staff_id} value={employee.staff_id}>
                  {employee.staff_name}
                </option>
              ))}
            </select>
          </div>

          {/* Download Button */}
          <div className="flex flex-col">
            <label className="mb-1 text-sm font-semibold text-gray-700 invisible">
              Download
            </label>
            <button
              onClick={downloadExcel}
              className="bg-cyan-600 text-white font-medium px-5 py-2 rounded-lg shadow-md hover:bg-cyan-700 active:scale-95 transition"
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
                {/* <th className="px-6 py-3 border-b-2 border-gray-300">
                  Lead Number
                </th> */}
                <th className="px-6 py-3 border-b-2 border-gray-300">
                  Assigned To
                </th>
                <th className="px-6 py-3 border-b-2 border-gray-300">Name</th>
                <th className="px-6 py-3 border-b-2 border-gray-300">Phone</th>
                <th className="px-6 py-3 border-b-2 border-gray-300">
                  Lead Source
                </th>
                <th className="px-6 py-3 border-b-2 border-gray-300">
                  Lead Status
                </th>
                <th className="px-6 py-3 border-b-2 border-gray-300">
                  Assigned Date
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
                    {/* <td className="px-6 py-4 border-b border-gray-200 text-gray-800">
                      {lead.lead_no}
                    </td> */}
                    <td className="px-6 py-4 border-b border-gray-200 text-gray-800">
                      {lead.staff_name}
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
                      {moment(lead.createdTime)
                        .format("DD MMM YYYY")
                        .toUpperCase()}
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

export default LeadData;
