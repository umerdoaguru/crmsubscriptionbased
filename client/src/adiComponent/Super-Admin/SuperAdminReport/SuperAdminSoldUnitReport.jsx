import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import * as XLSX from "xlsx";
import ReactPaginate from "react-paginate";

function SoldAdminSoldUnitReport() {
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [duration, setDuration] = useState("all"); // Default duration filter
  const [selectedColumns, setSelectedColumns] = useState([
    "lead_id",
    "project_name",
    "name",
    "unit_no",
    "employee_name",
    "unit_status",
    "date",
  ]);
  const [currentPage, setCurrentPage] = useState(0);
  const leadsPerPage = 6;

  // Fetch leads from the API without appending an ID
  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const response = await axios.get("https://crmdemo.vimubds5.a2hosted.com/api/unit-sold", {
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log("Fetched Leads:", response.data);
      const fetchedLeads = response.data.data || response.data || [];
      setLeads(fetchedLeads);
      setFilteredLeads(fetchedLeads);
    } catch (error) {
      console.error("Error fetching leads:", error);
    }
  };

  // Filter leads by duration
  const filterByDuration = (leads, duration) => {
    const today = moment();
    switch (duration) {
      case "week":
        return leads.filter((lead) => moment(lead.date).isSame(today, "week"));
      case "month":
        return leads.filter((lead) => moment(lead.date).isSame(today, "month"));
      case "year":
        return leads.filter((lead) => moment(lead.date).isSame(today, "year"));
      case "all":
      default:
        return leads;
    }
  };

  useEffect(() => {
    const filtered = filterByDuration(leads, duration);
    setFilteredLeads(filtered);
    setCurrentPage(0);
  }, [duration, leads]);

  // Excel download function
  const downloadExcel = () => {
    const columnMapping = {
      lead_id: "lead id",
      project_name: "Project Name",
      name: "Customer Name",
      unit_no: "Unit Id",
      employee_name: "Employee Name",
      unit_status: "Unit Status",
      date: "Date",
    };

    const completedLeads = filteredLeads.map((lead) => {
      const formattedLead = {};
      selectedColumns.forEach((col) => {
        const newKey = columnMapping[col] || col;
        if (["actual_date", "createdTime", "visit_date", "date"].includes(col)) {
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
    XLSX.utils.book_append_sheet(workbook, worksheet, `Lead of ${duration} Report`);
    XLSX.writeFile(workbook, `Lead of ${duration} Report.xlsx`);
  };

  // Pagination logic
  const pageCount = Math.ceil((filteredLeads || []).length / leadsPerPage);
  const indexOfLastLead = (currentPage + 1) * leadsPerPage;
  const indexOfFirstLead = indexOfLastLead - leadsPerPage;
  const currentLeads = (filteredLeads || []).slice(indexOfFirstLead, indexOfLastLead);

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  return (
    <div className="container 2xl:w-[95%]">
      {/* Filters */}
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

      {/* Leads Table */}
      <div className="overflow-auto mt-4">
        <table className="min-w-full bg-white border">
          <thead>
            <tr>
              <th className="px-6 py-3 border-b-2 border-gray-300">S.no</th>
              <th className="px-6 py-3 border-b-2 border-gray-300">Lead Id</th>
              <th className="px-6 py-3 border-b-2 border-gray-300">Project Name</th>
              <th className="px-6 py-3 border-b-2 border-gray-300">Customer Name</th>
              <th className="px-6 py-3 border-b-2 border-gray-300">Unit Number</th>
              <th className="px-6 py-3 border-b-2 border-gray-300">Employee Name</th>
              <th className="px-6 py-3 border-b-2 border-gray-300">Unit Status</th>
              <th className="px-6 py-3 border-b-2 border-gray-300">Date</th>
            </tr>
          </thead>
          <tbody>
            {currentLeads.length === 0 ? (
              <tr>
                <td
                  colSpan="10"
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
                    {lead.lead_id}
                  </td>
                  <td className="px-6 py-4 border-b border-gray-200 text-gray-800">
                    {lead.project_name}
                  </td>
                  <td className="px-6 py-4 border-b border-gray-200 text-gray-800">
                    {lead.name}
                  </td>
                  <td className="px-6 py-4 border-b border-gray-200 text-gray-800">
                    {lead.unit_no}
                  </td>
                  <td className="px-6 py-4 border-b border-gray-200 text-gray-800">
                    {lead.employee_name}
                  </td>
                  <td className="px-6 py-4 border-b border-gray-200 text-gray-800">
                    {lead.unit_status}
                  </td>
                  <td className="px-6 py-4 border-b border-gray-200 text-gray-800">
                    {moment(lead.date).format("DD MMM YYYY").toUpperCase()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pageCount > 1 && (
        <div className="mt-4">
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
            previousClassName={"prev"}
            nextClassName={"next"}
          />
        </div>
      )}
    </div>
  );
}

export default SoldAdminSoldUnitReport;
