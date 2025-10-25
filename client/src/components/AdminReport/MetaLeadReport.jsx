import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import * as XLSX from "xlsx";
import ReactPaginate from "react-paginate";
import { useSelector } from "react-redux";
import getFieldValue from "../../utils/getFieldValue";

function MetaLeadReport() {
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [duration, setDuration] = useState("all");
  const [currentPage, setCurrentPage] = useState(0);
  const leadsPerPage = 6;

  const superadminuser = useSelector((state) => state.auth.user);
  const token = superadminuser.token;

  // Fetch data
  useEffect(() => {
    fetchLeads();
    fetchEmployees();
  }, []);

  const fetchLeads = async () => {
    try {
      const { data } = await axios.get(
        `https://crm-generalize.dentalguru.software/api/getMetaLeadsByOrgId/${superadminuser?.staff_org_id}`,
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

  // Duration filter helper
  const filterByDuration = (leads, duration) => {
    const today = moment();
    return leads.filter((lead) => {
      const created = moment(lead.meta_created_at || lead.meta_updated_at);
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

  // Apply filters
  useEffect(() => {
    let filtered = leads;

    if (selectedEmployee) {
      filtered = filtered.filter(
        (lead) =>
          String(lead.staff_id) === String(selectedEmployee) ||
          String(lead.assignedTo) === String(selectedEmployee)
      );
    }

    filtered = filterByDuration(filtered, duration);
    setFilteredLeads(filtered);
    setCurrentPage(0);
  }, [selectedEmployee, duration, leads]);

  // Excel download
  const downloadExcel = () => {
    const formattedData = filteredLeads.map((lead, index) => ({
      "S.No": index + 1,
      "Form Name": lead.meta_form_name || "--",
      "Full Name":
        getFieldValue(lead.question_fields_data, "full_name") || "--",
      Phone: getFieldValue(lead.question_fields_data, "phone_number") || "--",
      "Assigned To": lead.staff_name || "--",
      "Lead Status": lead.meta_lead_status || "--",
      "Assigned Date": lead.meta_updated_at
        ? moment(lead.meta_updated_at).format("DD MMM YYYY")
        : "--",
    }));

    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Meta Leads Report");
    XLSX.writeFile(workbook, `MetaLeads_${duration}_Report.xlsx`);
  };

  // Pagination
  const pageCount = Math.ceil(filteredLeads.length / leadsPerPage);
  const indexOfLastLead = (currentPage + 1) * leadsPerPage;
  const indexOfFirstLead = indexOfLastLead - leadsPerPage;
  const currentLeads = filteredLeads.slice(indexOfFirstLead, indexOfLastLead);

  const handlePageClick = (data) => setCurrentPage(data.selected);

  return (
    <div className="container 2xl:w-[95%]">
      {/* Filters */}
      <div className="flex mb-4 sm:flex-row justify-end flex-col gap-2">
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
              <th className="px-6 py-3 border-b-2 border-gray-300">S.No</th>
              <th className="px-6 py-3 border-b-2 border-gray-300">
                Form Name
              </th>
              <th className="px-6 py-3 border-b-2 border-gray-300">Name</th>
              <th className="px-6 py-3 border-b-2 border-gray-300">
                Assigned To
              </th>
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
                  colSpan="7"
                  className="px-6 py-4 border-b border-gray-200 text-center text-gray-500"
                >
                  No data found
                </td>
              </tr>
            ) : (
              currentLeads.map((lead, index) => (
                <tr
                  key={lead.meta_lead_id || index}
                  className={index % 2 === 0 ? "bg-gray-100" : ""}
                >
                  <td className="px-6 py-4 border-b border-gray-200">
                    {index + 1 + currentPage * leadsPerPage}
                  </td>
                  <td className="px-6 py-4 border-b border-gray-200">
                    {lead.meta_form_name || "--"}
                  </td>
                  <td className="px-6 py-4 border-b border-gray-200">
                    {getFieldValue(lead.question_fields_data, "full_name") ||
                      "--"}
                  </td>
                  <td className="px-6 py-4 border-b border-gray-200">
                    {lead.staff_name || "--"}
                  </td>
                  <td className="px-6 py-4 border-b border-gray-200">
                    {getFieldValue(lead.question_fields_data, "phone_number") ||
                      "--"}
                  </td>
                  <td className="px-6 py-4 border-b border-gray-200">
                    {lead.meta_lead_status || "--"}
                  </td>
                  <td className="px-6 py-4 border-b border-gray-200">
                    {lead.meta_updated_at
                      ? moment(lead.meta_updated_at).format("DD MMM YYYY")
                      : "--"}
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
  );
}

export default MetaLeadReport;
