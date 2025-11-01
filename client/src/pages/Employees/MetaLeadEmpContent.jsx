import React, { useState, useEffect } from "react";
import moment from "moment";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import ReactPaginate from "react-paginate";
import getFieldValue from "../../utils/getFieldValue";

const MetaLeadEmpContent = ({ isSidebarOpen }) => {
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [soldunitFilter, setSoldUnitFilter] = useState("");
  const [sortOrder, setSortOrder] = useState("desce");
  const [currentPage, setCurrentPage] = useState(0);
  const [leadsPerPage, setLeadsPerPage] = useState(10);
  const navigate = useNavigate();
  const EmpId = useSelector((state) => state.auth.user);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const token = EmpId?.token;

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const { data } = await axios.get(
        `https://crm-generalize.dentalguru.software/api/getMetaLeadsByStaffId/${EmpId.staff_id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setLeads(data);
    } catch (error) {
      console.error("Error fetching leads:", error);
    }
  };

  const applyFilters = () => {
    let filtered = [...leads];

    filtered = filtered.sort((a, b) => {
      const dateA = new Date(a.meta_updated_at);
      const dateB = new Date(b.meta_updated_at);
      return sortOrder === "desce" ? dateB - dateA : dateA - dateB;
    });

    if (searchTerm) {
      const trimmedSearchTerm = searchTerm.toLowerCase().trim();
      filtered = filtered.filter((lead) => {
        const name = getFieldValue(
          lead.question_fields_data,
          "full_name"
        ).toLowerCase();
        const phone = getFieldValue(
          lead.question_fields_data,
          "phone_number"
        ).toLowerCase();
        const email = getFieldValue(
          lead.question_fields_data,
          "email"
        ).toLowerCase();
        const projectName = lead.project_name?.toLowerCase() || "";
        const staffName = lead.staff_name?.toLowerCase() || "";

        return (
          name.includes(trimmedSearchTerm) ||
          phone.includes(trimmedSearchTerm) ||
          email.includes(trimmedSearchTerm) ||
          projectName.includes(trimmedSearchTerm) ||
          staffName.includes(trimmedSearchTerm)
        );
      });
    }

    if (fromDate || toDate) {
      filtered = filtered.filter((lead) => {
        if (!lead.meta_updated_at) return false;

        const leadDate = moment(
          lead.meta_updated_at,
          "YYYY-MM-DD HH:mm:ss"
        ).startOf("day");
        const from = fromDate
          ? moment(fromDate, "YYYY-MM-DD").startOf("day")
          : null;
        const to = toDate ? moment(toDate, "YYYY-MM-DD").endOf("day") : null;

        if (from && to) {
          return leadDate.isBetween(from, to, null, "[]"); // inclusive
        } else if (from) {
          return leadDate.isSameOrAfter(from);
        } else if (to) {
          return leadDate.isSameOrBefore(to);
        }
        return true;
      });
    }

    if (soldunitFilter) {
      filtered = filtered.filter((lead) => lead.unit_status === soldunitFilter);
    }

    return filtered;
  };

  useEffect(() => {
    const filtered = applyFilters();
    setFilteredLeads(filtered);
    setCurrentPage(0);
  }, [searchTerm, fromDate, toDate, leads, soldunitFilter, sortOrder]);

  const totalLeads = applyFilters().length;

  const totalClosedLeads = applyFilters().filter(
    (lead) => lead.deal_status === "close"
  ).length;

  // Total Visits
  const totalVisits = applyFilters().filter((lead) =>
    ["fresh", "re-visit", "self", "associative"].includes(lead.visit)
  ).length;

  // Use filteredLeads for pagination
  const indexOfLastLead = (currentPage + 1) * leadsPerPage;
  const indexOfFirstLead = indexOfLastLead - leadsPerPage;
  const currentLeads =
    leadsPerPage === Infinity
      ? filteredLeads
      : filteredLeads.slice(indexOfFirstLead, indexOfLastLead);
  const pageCount = Math.ceil(filteredLeads.length / leadsPerPage);

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };
  const handleLeadsPerPageChange = (e) => {
    const value = e.target.value;
    setLeadsPerPage(value === "All" ? Infinity : parseInt(value, 10));
    setCurrentPage(0); // Reset to the first page
  };
  const toggleSortOrder = () => {
    setSortOrder((prevOrder) => (prevOrder === "desce" ? "asce" : "desce"));
  };

  const handleReset = () => {
    setSearchTerm("");
    setFromDate("");
    setToDate("");
    setSoldUnitFilter("");
    setSortOrder("desce");
  };

  return (
    <>
      <div className="flex mt-20">
        <div className="w-[90%] sm:w-full min-h-screen bg-[#F9FAFF] p-2">
          <div className="flex flex-col overflow-x-hidden">
            <div className="flex-grow p-2 sm:p-4 mt-0 lg:mt-2 sm:ml-0">
              <center className="text-2xl text-center font-medium">
                Assigned Meta Leads
              </center>
              <center className="mx-auto h-[3px] w-16 bg-cyan-600 my-3"></center>

              {/* Button to create a new lead */}

              <div className="grid grid-cols-12 gap-4 mb-4">
                <div className="col-span-12 sm:col-span-4">
                  <label htmlFor="">Search</label>
                  <input
                    type="text"
                    placeholder="Search by name, email and number....."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`border rounded p-2 w-full ${
                      searchTerm ? "bg-cyan-600 text-white" : "bg-white"
                    }`}
                  />
                </div>

                <div className="col-span-12 sm:col-span-2">
                  <label htmlFor="">From Date</label>
                  <input
                    type="date"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                    className={`border rounded p-2 w-full ${
                      fromDate ? "bg-cyan-600 text-white" : "bg-white"
                    }`}
                  />
                </div>

                <div className="col-span-12 sm:col-span-2">
                  <label htmlFor="">To Date</label>
                  <input
                    type="date"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                    className={`border rounded p-2 w-full ${
                      toDate ? "bg-cyan-600 text-white" : "bg-white"
                    }`}
                  />
                </div>

                <div className="col-span-12 sm:col-span-2">
                  <label htmlFor="">Unit Sold Filter</label>
                  <select
                    value={soldunitFilter}
                    onChange={(e) => setSoldUnitFilter(e.target.value)}
                    className={`border rounded p-2 w-full ${
                      soldunitFilter ? "bg-cyan-600 text-white" : "bg-white"
                    }`}
                  >
                    <option value="">All Deal</option>
                    <option value="sold">Sold</option>
                    <option value="available">Available</option>
                  </select>
                </div>

                <div className="col-span-12 sm:col-span-2 mt-4">
                  <button
                    onClick={handleReset}
                    className="bg-cyan-600 text-white py-2 px-2 rounded hover:bg-cyan-600 transition-colors"
                  >
                    Reset
                  </button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-xl font-semibold my-3 mt-5">
                {/* Total Lead Count */}
                <h2 className="text-md text-gray-600">
                  Total Lead: {totalLeads}
                </h2>

                {/* Total Lead Visits */}
                <h2 className="text-md text-gray-600">
                  Total Site Visit: {totalVisits}
                </h2>

                {/* Total Closed Leads */}
                <h2 className="text-md text-gray-600">
                  Total Closed Lead: {totalClosedLeads}
                </h2>
                <select
                  onChange={handleLeadsPerPageChange}
                  className="border border-cyan-600 rounded text-md text-gray-600 p-1 w-full sm:w-1/2 lg:w-1/4"
                >
                  <option value={10}>Number of rows: 10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                  <option value="All">All</option>
                </select>
              </div>

              <div className={`w-auto overflow-x-auto`}>
                <table
                  className={`${
                    isSidebarOpen ? "w-[78rem]" : "w-[86rem]"
                  } overflow-x-auto`}
                >
                  <thead className="bg-gray-200">
                    <tr>
                      <th className="px-2 sm:px-2 py-2 text-xs sm:text-sm border-y-2 border-gray-300 text-start text-gray-700 whitespace-nowrap">
                        S.no
                      </th>
                      <th className="px-2 sm:px-2 py-2 text-xs sm:text-sm border-y-2 border-gray-300 text-start text-gray-700 whitespace-nowrap">
                        Project Name
                      </th>

                      <th className="px-2 sm:px-2 py-2 text-xs sm:text-sm border-y-2 border-gray-300 text-start text-gray-700 whitespace-nowrap">
                        Name
                      </th>
                      <th className="px-2 sm:px-2 py-2 text-xs sm:text-sm border-y-2 border-gray-300 text-start text-gray-700 whitespace-nowrap">
                        Phone
                      </th>
                      <th className="px-2 sm:px-2 py-2 text-xs sm:text-sm border-y-2 border-gray-300 text-start text-gray-700 whitespace-nowrap">
                        Email
                      </th>
                      <th className="px-2 sm:px-2 py-2 text-xs sm:text-sm border-y-2 border-gray-300 text-start text-gray-700 whitespace-nowrap">
                        Assigned To
                      </th>
                      <th className="px-2 sm:px-2 py-2 text-xs sm:text-sm border-y-2 border-gray-300 text-start text-gray-700 whitespace-nowrap">
                        Lead Status
                      </th>
                      <th className="px-2 sm:px-2 py-2 text-xs sm:text-sm border-y-2 border-gray-300 text-start text-gray-700 whitespace-nowrap">
                        Unit Status
                      </th>

                      <th
                        className="px-2 sm:px-2 py-2 text-xs sm:text-sm border-y-2 border-gray-300 text-start text-gray-700 whitespace-nowrap cursor-pointer"
                        onClick={toggleSortOrder}
                      >
                        Assigned Date
                        <span className="text-cyan-900 mx-2">
                          {sortOrder === "desce" ? "▲" : "▼"}
                        </span>
                      </th>
                      <th className="px-2 sm:px-2 py-2 text-xs sm:text-sm border-y-2 border-gray-300 text-start text-gray-700 whitespace-nowrap">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {currentLeads.length > 0 ? (
                      currentLeads.map((lead, index) => (
                        <tr
                          key={lead.id}
                          className={`${index % 2 === 0 ? "bg-gray-100" : ""} `}
                        >
                          <td className="px-2 sm:px-2 py-3 border-b border-gray-200 text-gray-600 font-semibold whitespace-normal break-words">
                            {leadsPerPage === Infinity
                              ? index + 1
                              : index + 1 + currentPage * leadsPerPage}
                          </td>
                          <td className="px-2 sm:px-2 py-3 border-b border-gray-200 text-gray-600 font-semibold whitespace-normal break-words text-wrap">
                            {lead.project_name}
                          </td>
                          <td className="px-2 sm:px-2 py-3 border-b border-gray-200 text-gray-600 font-semibold whitespace-normal break-words text-wrap">
                            {getFieldValue(
                              lead.question_fields_data,
                              "full_name"
                            )}
                          </td>
                          <td className="px-2 sm:px-2 py-3 border-b border-gray-200 text-gray-600 font-semibold whitespace-normal break-words text-wrap">
                            {getFieldValue(
                              lead.question_fields_data,
                              "phone_number"
                            )}
                          </td>
                          <td className="px-2 sm:px-2 py-3 border-b border-gray-200 text-gray-600 font-semibold whitespace-normal break-words text-wrap">
                            {getFieldValue(lead.question_fields_data, "email")}
                          </td>

                          <td className="px-2 sm:px-2 py-3 border-b border-gray-200 text-gray-600 font-semibold whitespace-normal break-words">
                            {lead.staff_name}
                          </td>
                          <td className="px-2 sm:px-2 py-3 border-b border-gray-200 font-semibold text-gray-600">
                            {lead.meta_lead_status}
                          </td>
                          <td className="px-2 sm:px-2 py-3 border-b border-gray-200 font-semibold text-gray-600">
                            {lead.unit_status}
                          </td>

                          <td className="px-2 sm:px-2 py-3 border-b border-gray-200 text-gray-600 font-semibold whitespace-normal break-words">
                            {lead.meta_updated_at}
                          </td>
                          <td className="px-2 sm:px-2 py-3 border-b border-gray-200 text-gray-600 font-semibold whitespace-normal break-words">
                            <button
                              className="bg-sky-600 text-white p-2 rounded hover:bg-cyan-700"
                              onClick={() =>
                                navigate(
                                  `/employee-lead-single-data/meta/${lead.leadgen_id}`
                                )
                              }
                            >
                              View Details
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="20"
                          className="text-center py-4 text-gray-500"
                        >
                          No Data Available
                        </td>
                      </tr>
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
                  containerClassName={"pagination flex gap-2"}
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
        </div>
      </div>
    </>
  );
};

export default MetaLeadEmpContent;
