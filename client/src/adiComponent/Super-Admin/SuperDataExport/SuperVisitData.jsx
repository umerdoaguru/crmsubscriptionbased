import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import { useSelector } from "react-redux";
import ReactPaginate from "react-paginate";
import * as XLSX from "xlsx";
import styled from "styled-components";

const SuperVisitData = () => {
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const leadsPerPage = 6;
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
  const superadminuser = useSelector((state) => state.auth.user);
  const token = superadminuser.token;
  const userId = superadminuser.staff_id;

  // Fetch leads from the API
  useEffect(() => {
    fetchLeads();
    fetchEmployees();
  }, []);

  const fetchLeads = async () => {
    try {
      const { data } = await axios.get(
        `https://crm-generalize.dentalguru.software/api/leads-all-visits`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setLeads(data);
      setFilteredLeads(data);
    } catch (error) {
      console.error("Error fetching leads:", error);
    }
  };
  const fetchEmployees = async () => {
    try {
      const { data } = await axios.get(
        `https://crm-generalize.dentalguru.software/api/getAllEmployeeData/${superadminuser?.staff_org_id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setEmployees(data);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  useEffect(() => {
    let filtered = leads;

    if (startDate && endDate) {
      filtered = filtered.filter((lead) => {
        const visitDate = moment(lead.visit_date, "YYYY-MM-DD");
        return visitDate.isBetween(startDate, endDate, undefined, "[]");
      });
    }

    if (selectedEmployee) {
      filtered = filtered.filter(
        (lead) => lead.assignedTo === Number(selectedEmployee)
      );
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

    const completedLeads = filteredLeads.map((lead) => {
      const formattedLead = {};

      selectedColumns.forEach((col) => {
        const newKey = columnMapping[col] || col;

        if (
          ["actual_date", "createdTime", "visit_date", "d_closeDate"].includes(
            col
          )
        ) {
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

    const worksheet = XLSX.utils.json_to_sheet(completedLeads);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Report");

    const filename = ` Lead Report ${
      startDate ? moment(startDate).format("DD-MM-YYYY") : "Start"
    } to ${endDate ? moment(endDate).format("DD-MM-YYYY") : "End"}.xlsx`;

    XLSX.writeFile(workbook, filename);
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
    <Wrapper>
      <div className="container 2xl:w-[95%]">
        <div className="flex-grow  mt-14 lg:mt-0 sm:ml-0">
          <center className="text-2xl text-center mt-8 font-medium">
            Site Visits Data
          </center>
          <center className="mx-auto h-[3px] w-16 bg-[#34495E] my-3"></center>
          {/* Date Filter */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6 items-end">
            {/* Start Date */}
            <div className="flex flex-col w-full sm:w-auto">
              <label className="mb-1 text-sm font-semibold text-gray-700">
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="border rounded-lg px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            {/* End Date */}
            <div className="flex flex-col w-full sm:w-auto">
              <label className="mb-1 text-sm font-semibold text-gray-700">
                End Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="border rounded-lg px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            {/* Employee Filter */}
            <div className="flex flex-col w-full sm:w-auto">
              <label className="mb-1 text-sm font-semibold text-gray-700">
                Employee
              </label>
              <select
                value={selectedEmployee}
                onChange={(e) => setSelectedEmployee(e.target.value)}
                className="border rounded-lg px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
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
            <div className="w-full sm:w-auto">
              <button
                onClick={downloadExcel}
                className="bg-cyan-600 hover:bg-cyan-700 text-white font-medium px-6 py-2 rounded-lg shadow-md transition active:scale-95 w-full sm:w-auto"
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
                    Visit Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Visit Date
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
                  currentLeads.map((visit, index) => (
                    <tr
                      key={visit.id}
                      className={index % 2 === 0 ? "bg-gray-100" : ""}
                    >
                      <td className="px-6 py-4 border-b border-gray-200 text-gray-800">
                        {currentPage * leadsPerPage + index + 1}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        {visit.lead_id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {visit.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {visit.staff_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {visit.visit_type}
                      </td>
                      <td className="px-6 py-4 border-b border-gray-200 text-gray-800">
                        {visit.visit_date}
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
        </div>
      </div>
    </Wrapper>
  );
};

export default SuperVisitData;

const Wrapper = styled.div`
  /* Container class */
  .respo {
    @media screen and (max-width: 768px) {
      margin-top: 1rem;
    }
  }
`;
