import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import * as XLSX from "xlsx";
import ReactPaginate from "react-paginate";
import { useSelector } from "react-redux";

function LeadReport() {
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [duration, setDuration] = useState("all");
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
  const [currentPage, setCurrentPage] = useState(0);
  const leadsPerPage = 6;
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

  // Filter by duration
  const filterByDuration = (leads, duration) => {
    const today = moment();

    switch (duration) {
      case "week":
        return leads.filter((lead) =>
          moment(lead.createdTime).isSame(today, "week")
        );
      case "month":
        return leads.filter((lead) =>
          moment(lead.createdTime).isSame(today, "month")
        );
      case "year":
        return leads.filter((lead) =>
          moment(lead.createdTime).isSame(today, "year")
        );
      case "all":
      default:
        return leads;
    }
  };

  useEffect(() => {
    let filtered = leads;

    if (selectedEmployee) {
      filtered = filtered.filter((lead) => {
        console.log(lead.assignedTo, selectedEmployee);
        return lead.assignedTo === Number(selectedEmployee);
      });
    }

    filtered = filterByDuration(filtered, duration);
    setFilteredLeads(filtered);
    setCurrentPage(0);
  }, [selectedEmployee, duration, leads]);

  // Excel download function
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
      quotation: "Quotation",
      quotation_status: "Quotation Status",
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
    const worksheet = XLSX.utils.json_to_sheet(completedLeads);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      `Lead of ${duration} Report`
    );
    XLSX.writeFile(workbook, `Lead of ${duration} Report.xlsx`);
  };

  // Pagination logic
  const pageCount = Math.ceil(filteredLeads.length / leadsPerPage);
  const indexOfLastLead = (currentPage + 1) * leadsPerPage;
  const indexOfFirstLead = indexOfLastLead - leadsPerPage;
  const currentLeads = filteredLeads.slice(indexOfFirstLead, indexOfLastLead);

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  console.log(currentLeads);

  return (
    <>
      <div className="container 2xl:w-[95%] ">
        {/* Filters */}
        <div className="flex mb-4 sm:flex-row justify-end flex-col gap-2">
          <div>
            <select
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(e.target.value)}
              className="border p-2 rounded"
            >
              <option value="">Select Employee</option>
              {employees.map((employee) => (
                <option key={employee.staff_id} value={employee.staff_id}>
                  {employee.staff_name}
                </option>
              ))}
            </select>
          </div>
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
            className="bg-cyan-500 text-white font-medium px-4 py-2 rounded hover:bg-cyan-700"
          >
            Download Excel
          </button>
        </div>

        {/* Leads Table */}
        <div className="overflow-auto mt-4">
          <table className="min-w-full bg-white border">
            <thead>
              <tr>
                <th className="px-6 py-3 border-b-2 border-gray-300">S.no</th>
                {/* <th className="px-6 py-3 border-b-2 border-gray-300">
                  Lead Number
                </th> */}
                <th className="px-6 py-3 border-b-2 border-gray-300">Name</th>
                <th className="px-6 py-3 border-b-2 border-gray-300">
                  Assigned To
                </th>

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
                      {lead.name}
                    </td>
                    <td className="px-6 py-4 border-b border-gray-200 text-gray-800">
                      {lead.staff_name}
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
    </>
  );
}

export default LeadReport;
