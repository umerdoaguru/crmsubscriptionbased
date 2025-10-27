import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import * as XLSX from "xlsx";
import ReactPaginate from "react-paginate";
import { useSelector } from "react-redux";
import getFieldValue from "../../../utils/getFieldValue";

function SuperMetaLeadData() {
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const leadsPerPage = 6;

  const superadminuser = useSelector((state) => state.auth.user);
  const token = superadminuser?.token;

  // ✅ Fetch Leads
  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const response = await axios.get(
          `https://crm-generalize.dentalguru.software/api/getMetaLeadsByOrgId/${superadminuser?.staff_org_id}`,
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

    fetchLeads();
    fetchEmployees();
  }, [superadminuser?.staff_org_id, token]);

  // ✅ Filter Logic
  useEffect(() => {
    let filtered = leads;

    if (startDate && endDate) {
      filtered = filtered.filter((lead) => {
        const created = moment(lead.meta_updated_at, "YYYY-MM-DD");
        return created.isBetween(
          moment(startDate),
          moment(endDate),
          null,
          "[]"
        );
      });
    }

    // Filter by employee
    if (selectedEmployee) {
      filtered = filtered.filter(
        (lead) => String(lead.staff_id) === String(selectedEmployee)
      );
    }

    setFilteredLeads(filtered);
    setCurrentPage(0);
  }, [startDate, endDate, selectedEmployee, leads]);

  // ✅ Excel Download (filtered data)
  const downloadExcel = () => {
    if (filteredLeads.length === 0) {
      alert("No data available for the selected filters.");
      return;
    }

    const dataForExcel = filteredLeads.map((lead) => ({
      "Form Name": lead.meta_form_name || "--",
      "Assigned To": lead.staff_name || "--",
      Name: getFieldValue(lead.question_fields_data, "full_name") || "--",
      Phone: getFieldValue(lead.question_fields_data, "phone_number") || "--",
      "Lead Status": lead.meta_lead_status || "--",
      "Assigned Date": moment(lead.meta_updated_at).isValid()
        ? moment(lead.meta_updated_at).format("DD MMM YYYY")
        : "--",
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataForExcel);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Meta Lead Report");

    const filename = `Meta_Lead_Report_${moment().format(
      "DD-MM-YYYY_HH-mm"
    )}.xlsx`;

    XLSX.writeFile(workbook, filename);
  };

  // ✅ Pagination
  const pageCount = Math.ceil(filteredLeads.length / leadsPerPage);
  const currentLeads = filteredLeads.slice(
    currentPage * leadsPerPage,
    (currentPage + 1) * leadsPerPage
  );

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  return (
    <div className="container mx-auto w-[95%]">
      <h1 className="text-2xl text-center mt-6 font-semibold text-gray-700">
        Meta Leads Data
      </h1>
      <div className="mx-auto h-[3px] w-16 bg-cyan-700 my-3"></div>

      {/* ✅ Filters Section */}
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
            className="border rounded-lg px-3 py-2 text-sm shadow-sm focus:ring-2 focus:ring-cyan-500"
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
            className="border rounded-lg px-3 py-2 text-sm shadow-sm focus:ring-2 focus:ring-cyan-500"
          />
        </div>

        {/* Employee */}
        <div className="flex flex-col">
          <label className="mb-1 text-sm font-semibold text-gray-700">
            Employee
          </label>
          <select
            value={selectedEmployee}
            onChange={(e) => setSelectedEmployee(e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm shadow-sm focus:ring-2 focus:ring-cyan-500"
          >
            <option value="">Select Employee</option>
            {employees.map((emp) => (
              <option key={emp.staff_id} value={emp.staff_id}>
                {emp.staff_name}
              </option>
            ))}
          </select>
        </div>

        {/* Download */}
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

      {/* ✅ Table */}
      <div className="overflow-auto mt-4">
        <table className="min-w-full border bg-white rounded-lg shadow">
          <thead className="bg-gray-100 text-gray-700 text-sm uppercase">
            <tr>
              <th className="px-4 py-2 border">S.No</th>
              <th className="px-4 py-2 border">Form Name</th>
              <th className="px-4 py-2 border">Assigned To</th>
              <th className="px-4 py-2 border">Name</th>
              <th className="px-4 py-2 border">Phone</th>
              <th className="px-4 py-2 border">Lead Status</th>
              <th className="px-4 py-2 border">Assigned Date</th>
            </tr>
          </thead>
          <tbody>
            {currentLeads.length > 0 ? (
              currentLeads.map((lead, index) => (
                <tr
                  key={lead.id}
                  className={`text-start text-gray-800 ${
                    index % 2 === 0 ? "bg-gray-50" : ""
                  } hover:bg-cyan-50 transition`}
                >
                  <td className="px-4 py-2 border">
                    {index + 1 + currentPage * leadsPerPage}
                  </td>
                  <td className="px-4 py-2 border">{lead.meta_form_name}</td>
                  <td className="px-4 py-2 border">{lead.staff_name}</td>
                  <td className="px-4 py-2 border">
                    {getFieldValue(lead.question_fields_data, "full_name") ||
                      "--"}
                  </td>
                  <td className="px-4 py-2 border">
                    {getFieldValue(lead.question_fields_data, "phone_number") ||
                      "--"}
                  </td>
                  <td className="px-4 py-2 border">{lead.meta_lead_status}</td>
                  <td className="px-4 py-2 border">
                    {moment(lead.meta_updated_at).isValid()
                      ? moment(lead.meta_updated_at).format("DD MMM YYYY")
                      : "--"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="7"
                  className="text-center py-4 text-gray-500 border"
                >
                  No data found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ✅ Stylish Pagination */}
      <div className="flex justify-center mt-5">
        <ReactPaginate
          previousLabel="← Prev"
          nextLabel="Next →"
          breakLabel="..."
          pageCount={pageCount}
          marginPagesDisplayed={1}
          pageRangeDisplayed={3}
          onPageChange={handlePageClick}
          containerClassName="flex gap-2 text-sm"
          pageClassName="border rounded-md px-3 py-1 bg-white shadow hover:bg-cyan-100 cursor-pointer"
          activeClassName="bg-cyan-600 text-sky-700 font-semibold"
          previousClassName="border rounded-md px-3 py-1 bg-gray-100 hover:bg-cyan-100 cursor-pointer"
          nextClassName="border rounded-md px-3 py-1 bg-gray-100 hover:bg-cyan-100 cursor-pointer"
          breakClassName="px-3 py-1"
          forcePage={currentPage}
        />
      </div>
    </div>
  );
}

export default SuperMetaLeadData;
