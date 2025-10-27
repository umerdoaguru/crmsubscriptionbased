import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import * as XLSX from "xlsx";
import ReactPaginate from "react-paginate";
import { useSelector } from "react-redux";
import getFieldValue from "../../../utils/getFieldValue";

function EmpMetaLeadReport() {
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [duration, setDuration] = useState("all");
  const [currentPage, setCurrentPage] = useState(0);
  const leadsPerPage = 10;
  const EmpId = useSelector((state) => state.auth.user);
  const token = EmpId?.token;

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const response = await axios.get(
        `https://crm-generalize.dentalguru.software/api/getMetaLeadsByStaffId/${EmpId.staff_id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = response.data || [];
      setLeads(data);
      setFilteredLeads(data);
    } catch (error) {
      console.error("Error fetching leads:", error);
    }
  };

  // ✅ Duration-based filter
  const filterByDuration = (leads, duration) => {
    const today = moment();
    return leads.filter((lead) => {
      const created = moment(lead.meta_updated_at);
      if (!created.isValid()) return false;

      switch (duration) {
        case "week":
          return created.isSame(today, "week");
        case "month":
          return created.isSame(today, "month");
        case "year":
          return created.isSame(today, "year");
        default:
          return true;
      }
    });
  };

  // ✅ Apply filter whenever duration changes
  useEffect(() => {
    const filtered = filterByDuration(leads, duration);
    setFilteredLeads(filtered);
    setCurrentPage(0);
  }, [duration, leads]);

  // ✅ Excel Download
  const downloadExcel = () => {
    const columnMapping = {
      project_name: "Project Name",
      staff_name: "Assigned To",
      meta_lead_status: "Lead Status",
      meta_updated_at: "Assigned Date",
    };

    const formattedData = filteredLeads.map((lead) => ({
      "Project Name": lead.project_name || "--",
      "Assigned To": lead.staff_name || "--",
      Name: getFieldValue(lead.question_fields_data, "full_name") || "--",
      Phone: getFieldValue(lead.question_fields_data, "phone_number") || "--",
      "Lead Status": lead.meta_lead_status || "--",
      "Assigned Date": moment(lead.meta_updated_at).isValid()
        ? moment(lead.meta_updated_at).format("DD MMM YYYY")
        : "--",
    }));

    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      `Lead_${duration}_Report`
    );
    XLSX.writeFile(workbook, `Lead_${duration}_Report.xlsx`);
  };

  // ✅ Pagination logic
  const pageCount = Math.ceil(filteredLeads.length / leadsPerPage);
  const currentLeads = filteredLeads.slice(
    currentPage * leadsPerPage,
    (currentPage + 1) * leadsPerPage
  );

  const handlePageClick = (data) => setCurrentPage(data.selected);

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row justify-end items-center gap-3 mb-4">
        <select
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
        >
          <option value="all">All</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="year">This Year</option>
        </select>
        <button
          onClick={downloadExcel}
          className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-md shadow-sm transition duration-200"
        >
          Download Excel
        </button>
      </div>

      {/* Leads Table */}
      <div className="overflow-x-auto bg-white shadow-md rounded-lg border border-gray-200">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
            <tr>
              <th className="px-4 py-3 text-left">S.No</th>
              <th className="px-4 py-3 text-left">Project Name</th>
              <th className="px-4 py-3 text-left">Assigned To</th>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Phone</th>
              <th className="px-4 py-3 text-left">Lead Status</th>
              <th className="px-4 py-3 text-left">Assigned Date</th>
            </tr>
          </thead>
          <tbody>
            {currentLeads.length === 0 ? (
              <tr>
                <td
                  colSpan="7"
                  className="text-center py-6 text-gray-500 italic"
                >
                  No leads found for the selected duration.
                </td>
              </tr>
            ) : (
              currentLeads.map((lead, index) => (
                <tr
                  key={index}
                  className={`${
                    index % 2 === 0 ? "bg-gray-50" : "bg-white"
                  } hover:bg-cyan-50 transition`}
                >
                  <td className="px-4 py-3">
                    {index + 1 + currentPage * leadsPerPage}
                  </td>
                  <td className="px-4 py-3">{lead.project_name || "--"}</td>
                  <td className="px-4 py-3">{lead.staff_name || "--"}</td>
                  <td className="px-4 py-3">
                    {getFieldValue(lead.question_fields_data, "full_name") ||
                      "--"}
                  </td>
                  <td className="px-4 py-3">
                    {getFieldValue(lead.question_fields_data, "phone_number") ||
                      "--"}
                  </td>
                  <td className="px-4 py-3">{lead.meta_lead_status || "--"}</td>
                  <td className="px-4 py-3">
                    {moment(lead.meta_updated_at).isValid()
                      ? moment(lead.meta_updated_at).format("DD MMM YYYY")
                      : "--"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ✅ Beautiful Pagination */}
      {pageCount > 1 && (
        <div className="flex justify-center mt-6">
          <ReactPaginate
            previousLabel={"← Prev"}
            nextLabel={"Next →"}
            breakLabel={"..."}
            pageCount={pageCount}
            onPageChange={handlePageClick}
            forcePage={currentPage}
            containerClassName="flex items-center gap-2"
            pageClassName="border border-gray-300 rounded-md"
            pageLinkClassName="px-3 py-1.5 block hover:bg-cyan-600 hover:text-white transition rounded-md"
            activeClassName="bg-cyan-600 text-white border-cyan-600"
            previousClassName="border border-gray-300 rounded-md"
            previousLinkClassName="px-3 py-1.5 block hover:bg-cyan-600 hover:text-white transition rounded-md"
            nextClassName="border border-gray-300 rounded-md"
            nextLinkClassName="px-3 py-1.5 block hover:bg-cyan-600 hover:text-white transition rounded-md"
            breakClassName="border border-gray-300 rounded-md"
            breakLinkClassName="px-3 py-1.5 block"
          />
        </div>
      )}
    </div>
  );
}

export default EmpMetaLeadReport;
