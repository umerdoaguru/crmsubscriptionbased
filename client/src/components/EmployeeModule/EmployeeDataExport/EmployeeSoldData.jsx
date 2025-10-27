import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import { useSelector } from "react-redux";
import ReactPaginate from "react-paginate";
import * as XLSX from "xlsx";

const EmployeeSoldData = () => {
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const leadsPerPage = 7;
  const EmpId = useSelector((state) => state.auth.user);
  const token = EmpId?.token;
  const [selectedColumns, setSelectedColumns] = useState([
    "lead_id",
    "project_name",
    "name",
    "unit_no",
    "employee_name",
    "unit_status",
    "date",
  ]);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const response = await axios.get(
        `https://crm-generalize.dentalguru.software/api/unit-sold/${EmpId.staff_id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const fetchedLeads = response.data.data || response.data || [];
      setLeads(fetchedLeads);
      setFilteredLeads(fetchedLeads);
    } catch (error) {
      console.error("Error fetching leads:", error);
    }
  };

  useEffect(() => {
    let filtered = leads;

    if (startDate && endDate) {
      filtered = filtered.filter((lead) => {
        const visitDate = moment(lead.date, "YYYY-MM-DD");
        return visitDate.isBetween(startDate, endDate, undefined, "[]");
      });
    }

    setFilteredLeads(filtered);
  }, [startDate, endDate, leads]);

  const downloadExcel = () => {
    const completedLeads = currentLeads.map((lead) => ({ ...lead }));

    // Generate Excel file
    const worksheet = XLSX.utils.json_to_sheet(completedLeads);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sold Data Report");
    XLSX.writeFile(workbook, `Sold Data Report.xlsx`);
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
    <>
      <div className="flex-grow md:p-4 mt-14 lg:mt-0 sm:ml-0">
        <center className="text-2xl text-center mt-8 font-medium">
          Total Sold Units
        </center>
        <center className="mx-auto h-[3px] w-16 bg-cyan-600 my-3"></center>
        {/* Date Filter */}
        <div className="flex space-x-1 mb-4 sm:flex-row flex-col ">
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
          <div className="respo mx-2">
            <button
              onClick={downloadExcel}
              className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded"
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
                  Lead Id
                </th>
                <th className="px-6 py-3 border-b-2 border-gray-300">
                  Project Name
                </th>
                <th className="px-6 py-3 border-b-2 border-gray-300">
                  Customer Name
                </th>
                <th className="px-6 py-3 border-b-2 border-gray-300">
                  Unit Number
                </th>
                <th className="px-6 py-3 border-b-2 border-gray-300">
                  Employee Name
                </th>
                <th className="px-6 py-3 border-b-2 border-gray-300">
                  Unit Status
                </th>
                <th className="px-6 py-3 border-b-2 border-gray-300">Date</th>
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
                currentLeads.map((sold, index) => (
                  <tr
                    key={sold.id}
                    className={index % 2 === 0 ? "bg-gray-100" : ""}
                  >
                    <td className="px-6 py-4 border-b border-gray-200 text-gray-800">
                      {currentPage * leadsPerPage + index + 1}
                    </td>
                    <td className="px-6 py-4 border-b border-gray-200 text-gray-800">
                      {sold.lead_id}
                    </td>
                    <td className="px-6 py-4 border-b border-gray-200 text-gray-800">
                      {sold.project_name}
                    </td>
                    <td className="px-6 py-4 border-b border-gray-200 text-gray-800">
                      {sold.name}
                    </td>
                    <td className="px-6 py-4 border-b border-gray-200 text-gray-800">
                      {sold.unit_number}
                    </td>
                    <td className="px-6 py-4 border-b border-gray-200 text-gray-800">
                      {sold.staff_name}
                    </td>
                    <td className="px-6 py-4 border-b border-gray-200 text-gray-800">
                      {sold.unit_status}
                    </td>
                    <td className="px-6 py-4 border-b border-gray-200 text-gray-800">
                      {sold.esu_sold_date}
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
};

export default EmployeeSoldData;
