import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import * as XLSX from "xlsx";
import ReactPaginate from "react-paginate";
import { useSelector } from "react-redux";
import getFieldValue from "../../../utils/getFieldValue";

function EmployeeMetaLeadData() {
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const leadsPerPage = 7;
  const EmpId = useSelector((state) => state.auth.user);
  const [selectedColumns, setSelectedColumns] = useState([
    "project_name",
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
    "visit",
    "visit_date",
    "d_closeDate",
    "createdTime",
    "actual_date",
  ]);
  const token = EmpId?.token;

  // Fetch leads from the API
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
      setLeads(response.data);
      setFilteredLeads(response.data);
    } catch (error) {
      console.error("Error fetching leads:", error);
    }
  };

  useEffect(() => {
    let filtered = leads;

    if (startDate && endDate) {
      const start = moment(startDate, "YYYY-MM-DD").startOf("day");
      const end = moment(endDate, "YYYY-MM-DD").endOf("day");

      filtered = filtered.filter((lead) => {
        // Prefer meta_updated_at if available
        const dateField = lead.meta_updated_at || lead.createdTime;
        if (!dateField) return false;

        const leadDate = moment(dateField);
        return leadDate.isBetween(start, end, null, "[]");
      });
    }

    setFilteredLeads(filtered);
    setCurrentPage(0);
  }, [startDate, endDate, leads]);

  const downloadExcel = () => {
    if (filteredLeads.length === 0) {
      alert("No data available for the selected date range.");
      return;
    }

    // Map API fields to readable column names
    const formattedLeads = filteredLeads.map((lead, index) => ({
      "S.No": index + 1,
      "Project Name": lead.project_name || "--",
      "Assigned To": lead.staff_name || "--",
      Name: getFieldValue(lead.question_fields_data, "full_name") || "--",
      Phone: getFieldValue(lead.question_fields_data, "phone_number") || "--",
      "Lead Status": lead.meta_lead_status || "--",
      "Assigned Date": moment(lead.meta_updated_at).isValid()
        ? moment(lead.meta_updated_at).format("DD MMM YYYY").toUpperCase()
        : "--",
    }));

    // Create a worksheet
    const worksheet = XLSX.utils.json_to_sheet(formattedLeads);

    // Adjust column widths for better readability
    const columnWidths = [
      { wch: 6 },
      { wch: 25 },
      { wch: 25 },
      { wch: 20 },
      { wch: 15 },
      { wch: 20 },
      { wch: 18 },
    ];
    worksheet["!cols"] = columnWidths;

    // Create a new workbook and append the worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Lead Report");

    // Generate file name
    const filename = `Lead Report ${
      startDate ? moment(startDate).format("DD-MM-YYYY") : "Start"
    } to ${endDate ? moment(endDate).format("DD-MM-YYYY") : "End"}.xlsx`;

    // Write file
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
      <div className="flex-grow md:p-4 mt-14 lg:mt-0 sm:ml-0">
        <center className="text-2xl text-center mt-8 font-medium">
          Leads Management
        </center>
        <center className="mx-auto h-[3px] w-16 bg-cyan-600 my-3"></center>

        {/* Date Filter */}
        <div className="flex space-x-1 mb-4 sm:flex-row flex-col">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border p-2"
          />
          <div className="p-2">
            <p>to</p>
          </div>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border p-2"
          />
          <div className=" max-sm:mt-2 md:mt-0 mx-2">
            <button
              onClick={downloadExcel}
              className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2  rounded "
            >
              Download Excel
            </button>
          </div>
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
                  Assigned To
                </th>
                <th className="px-6 py-3 border-b-2 border-gray-300">Name</th>
                <th className="px-6 py-3 border-b-2 border-gray-300">Phone</th>
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
                    colSpan="8"
                    className="px-6 py-4 border-b border-gray-200 text-gray-800 text-center"
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
                      {lead.project_name}
                    </td>

                    <td className="px-6 py-4 border-b border-gray-200 text-gray-800">
                      {lead.staff_name}
                    </td>
                    <td className="px-6 py-4 border-b border-gray-200 text-gray-800">
                      {getFieldValue(lead.question_fields_data, "full_name") ||
                        "--"}
                    </td>
                    <td className="px-6 py-4 border-b border-gray-200 text-gray-800">
                      {getFieldValue(
                        lead.question_fields_data,
                        "phone_number"
                      ) || "--"}
                    </td>

                    <td className="px-6 py-4 border-b border-gray-200 text-gray-800">
                      {lead.meta_lead_status}
                    </td>
                    <td className="px-6 py-4 border-b border-gray-200 text-gray-800">
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
    </>
  );
}

export default EmployeeMetaLeadData;
