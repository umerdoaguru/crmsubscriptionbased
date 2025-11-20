import React, { useState, useEffect } from "react";
import moment from "moment";
import cogoToast from "cogo-toast";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import ReactPaginate from "react-paginate";

const EmployeeLeadContent = ({ isSidebarOpen }) => {
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [leadSourceFilter, setLeadSourceFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [visitFilter, setVisitFilter] = useState("");
  const [dealFilter, setDealFilter] = useState("");
  const [soldunitFilter, setSoldUnitFilter] = useState("");
  const [leadStatusFilter, setLeadStatusFilter] = useState("");
  const [leadnotInterestedStatusFilter, setLeadnotInterestedStatusFilter] =
    useState("");
  const [meetingStatusFilter, setMeetingStatusFilter] = useState("");
  const [visitmonthFilter, setVisitMonthFilter] = useState("");
  const [monthFilter, setMonthFilter] = useState("");
  const [yearFilter, setYearFilter] = useState("");
  const [sortOrder, setSortOrder] = useState("desce");
  const [currentPage, setCurrentPage] = useState(0);
  const [leadsPerPage, setLeadsPerPage] = useState(10);
  const navigate = useNavigate();
  const EmpId = useSelector((state) => state.auth.user);
  const token = EmpId?.token;
  const uniqueYears = [
    ...new Set(leads.map((lead) => moment(lead.createdTime).format("YYYY"))),
  ];

  const monthOrder = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const uniqueMonth = [
    ...new Set(
      leads
        .filter(
          (lead) => moment(lead.createdTime).format("YYYY") === yearFilter
        )
        .map((lead) => moment(lead.createdTime).format("MMMM"))
    ),
  ].sort((a, b) => monthOrder.indexOf(a) - monthOrder.indexOf(b));

  const uniqueVisitMonth = [
    ...new Set(
      leads
        .filter(
          (lead) =>
            lead.visit !== "pending" &&
            lead.visit_date &&
            moment(lead.visit_date, moment.ISO_8601, true).isValid()
        )
        .map((lead) => moment(lead.visit_date).format("MMMM"))
    ),
  ].sort((a, b) => monthOrder.indexOf(a) - monthOrder.indexOf(b));

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const response = await axios.get(
        `https://crm-generalize.dentalguru.software/api/employe-leads/${EmpId.staff_id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = response.data;
      setLeads(data);
    } catch (error) {
      console.error("Error fetching leads:", error);
    }
  };

  const handleUpdate = async (lead) => {
    try {
      const response = await axios.put(
        `https://crm-generalize.dentalguru.software/api/updateOnlyLeadStatus/${lead.lead_id}`,
        { lead_status: "active lead" },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        cogoToast.success("Lead status updated successfully");
        navigate(`/employee-lead-single-data/general/${lead.lead_id}`);
      } else {
        cogoToast.error("Failed to update the lead status.");
      }
    } catch (error) {
      cogoToast.error("Failed to update the lead status.");
    }
  };

  const applyFilters = () => {
    let filtered = [...leads];

    // Sort by date
    filtered = filtered.sort((a, b) => {
      if (sortOrder === "desce") {
        return new Date(b.createdTime) - new Date(a.createdTime);
      } else {
        return new Date(a.createdTime) - new Date(b.createdTime);
      }
    });

    // Filter by search term
    if (searchTerm) {
      const trimmedSearchTerm = searchTerm.toLowerCase().trim();
      filtered = filtered.filter((lead) =>
        ["project_name", "name", "leadSource", "phone", "staff_name"].some(
          (key) => lead[key]?.toLowerCase().trim().includes(trimmedSearchTerm)
        )
      );
    }

    // Filter by date range
    if (filterDate) {
      filtered = filtered.filter((lead) => {
        const leadDate = moment(lead.createdTime).format("YYYY-MM-DD");
        return leadDate === filterDate;
      });
    }

    // Filter by lead source
    if (leadSourceFilter) {
      filtered = filtered.filter(
        (lead) => lead.leadSource === leadSourceFilter
      );
    }

    // Filter by status
    if (statusFilter) {
      filtered = filtered.filter((lead) => lead.status === statusFilter);
    }

    // Filter by deal
    if (dealFilter) {
      filtered = filtered.filter((lead) => lead.deal_status === dealFilter);
    }

    // Filter by lead status
    if (leadStatusFilter) {
      filtered = filtered.filter(
        (lead) => lead.lead_status === leadStatusFilter
      );
    }

    // Filter by not interested reason
    if (leadnotInterestedStatusFilter) {
      if (leadnotInterestedStatusFilter === "other") {
        filtered = filtered.filter(
          (lead) => !["price", "budget", "distance"].includes(lead.reason)
        );
      } else {
        filtered = filtered.filter(
          (lead) => lead.reason === leadnotInterestedStatusFilter
        );
      }
    }

    // Filter by visit
    if (visitFilter) {
      filtered = filtered.filter((lead) => lead.visit === visitFilter);
    }

    // Filter by meeting status
    if (meetingStatusFilter) {
      filtered = filtered.filter(
        (lead) => lead.meeting_status === meetingStatusFilter
      );
    }

    if (soldunitFilter) {
      filtered = filtered.filter((lead) => lead.unit_status === soldunitFilter);
    }

    if (monthFilter) {
      filtered = filtered.filter((lead) => {
        const leadMonth = moment(lead.createdTime).format("MMMM");
        return leadMonth === monthFilter;
      });
    }
    if (yearFilter) {
      filtered = filtered.filter((lead) => {
        const leadYear = moment(lead.createdTime).format("YYYY");
        return leadYear === yearFilter;
      });
    }

    if (visitmonthFilter) {
      filtered = filtered.filter((lead) => {
        const visitleadMonth = moment(lead.visit_date).format("MMMM");
        return visitleadMonth === visitmonthFilter;
      });
    }

    return filtered;
  };

  useEffect(() => {
    const filtered = applyFilters();
    setFilteredLeads(filtered);
    setCurrentPage(0);
  }, [
    searchTerm,
    filterDate,
    leads,
    leadSourceFilter,
    statusFilter,
    visitFilter,
    dealFilter,
    leadStatusFilter,
    leadnotInterestedStatusFilter,
    meetingStatusFilter,
    soldunitFilter,
    monthFilter,
    yearFilter,
    visitmonthFilter,
    sortOrder,
  ]);

  // Total Leads
  const totalLeads = applyFilters().length;

  // Total Closed Leads
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
    // window.location.reload();
    setSearchTerm("");
    setFilterDate("");
    setLeads([]);
    setLeadSourceFilter("");
    setStatusFilter("");
    setVisitFilter("");
    setDealFilter("");
    setLeadStatusFilter("");
    setLeadnotInterestedStatusFilter("");
    setMeetingStatusFilter("");
    setSoldUnitFilter("");
    setMonthFilter("");
    setYearFilter("");
    setVisitMonthFilter("");
    setSortOrder("desce");
  };

  return (
    <>
      <div className="flex mt-20">
        <div className="sm:w-full w-[90%] min-h-screen bg-[#F9FAFF] p-2">
          <div className="flex flex-col overflow-x-hidden">
            <div className="flex-grow p-2 sm:p-4 mt-0 lg:mt-2 sm:ml-0">
              <center className="text-2xl text-center font-medium">
                Assigned Employee Leads
              </center>
              <center className="mx-auto h-[3px] w-16 bg-cyan-600 my-3"></center>

              {/* Button to create a new lead */}

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 gap-y-3 mb-4">
                {/* Search */}
                <div className="col-span-12 sm:col-span-4">
                  <label className="block mb-1 text-sm font-semibold text-gray-700">
                    Search
                  </label>
                  <input
                    type="text"
                    placeholder="Name, Lead Source, Assigned To, Phone No"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`border rounded p-2 w-full focus:outline-none transition-colors duration-200 ${
                      searchTerm ? "bg-cyan-600 text-white" : "bg-white"
                    }`}
                  />
                </div>

                {/* Assigned Date */}
                <div className="col-span-12 sm:col-span-2">
                  <label className="block mb-1 text-sm font-semibold text-gray-700">
                    Filtered Assigned Date
                  </label>
                  <input
                    type="date"
                    value={filterDate}
                    onChange={(e) => setFilterDate(e.target.value)}
                    className={`border rounded p-2 w-full focus:outline-none transition-colors duration-200 ${
                      filterDate ? "bg-cyan-600 text-white" : "bg-white"
                    }`}
                  />
                </div>

                {/* Lead Source */}
                <div className="col-span-12 sm:col-span-2">
                  <label className="block mb-1 text-sm font-semibold text-gray-700">
                    Lead Source Filter
                  </label>
                  <select
                    value={leadSourceFilter}
                    onChange={(e) => setLeadSourceFilter(e.target.value)}
                    className={`border rounded p-2 w-full focus:outline-none transition-colors duration-200 ${
                      leadSourceFilter ? "bg-cyan-600 text-white" : "bg-white"
                    }`}
                  >
                    <option value="">Select Lead Source</option>
                    <option value="Facebook">Facebook</option>
                    <option value="One Realty Website">
                      One Realty Website
                    </option>
                    <option value="99 Acres">99 Acres</option>
                    <option value="Referrals">Referrals</option>
                    <option value="Cold Calling">Cold Calling</option>
                    <option value="Email Campaigns">Email Campaigns</option>
                    <option value="Networking Events">Networking Events</option>
                    <option value="Paid Advertising">Paid Advertising</option>
                    <option value="Content Marketing">Content Marketing</option>
                    <option value="SEO">Search Engine Optimization</option>
                    <option value="Trade Shows">Trade Shows</option>
                    <option value="Affiliate Marketing">
                      Affiliate Marketing
                    </option>
                    <option value="Direct Mail">Direct Mail</option>
                    <option value="Online Directories">
                      Online Directories
                    </option>
                  </select>
                </div>

                {/* Unit Sold */}
                <div className="col-span-12 sm:col-span-2">
                  <label className="block mb-1 text-sm font-semibold text-gray-700">
                    Unit Sold Filter
                  </label>
                  <select
                    value={soldunitFilter}
                    onChange={(e) => setSoldUnitFilter(e.target.value)}
                    className={`border rounded p-2 w-full focus:outline-none transition-colors duration-200 ${
                      soldunitFilter ? "bg-cyan-600 text-white" : "bg-white"
                    }`}
                  >
                    <option value="">All Deal</option>
                    <option value="sold">Sold</option>
                    <option value="available">Available</option>
                  </select>
                </div>

                {/* Reset Button */}
                <div className="col-span-12 sm:col-span-2 flex items-end">
                  <button
                    onClick={handleReset}
                    className="bg-cyan-600 text-white py-2 px-4 rounded hover:bg-cyan-700 transition-colors w-full sm:w-auto"
                  >
                    Reset
                  </button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-6 text-xl font-semibold my-3 mt-5">
                {/* Stats Section */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 w-full sm:w-auto">
                  {/* Total Lead Count */}
                  <h2 className="text-base sm:text-md text-gray-600">
                    Total Lead: {totalLeads}
                  </h2>

                  {/* Total Lead Visits */}
                  <h2 className="text-base sm:text-md text-gray-600">
                    Total Site Visit: {totalVisits}
                  </h2>

                  {/* Total Closed Leads */}
                  <h2 className="text-base sm:text-md text-gray-600">
                    Total Closed Lead: {totalClosedLeads}
                  </h2>
                </div>

                {/* Dropdown */}
                <div className="w-full sm:w-auto">
                  <select
                    onChange={handleLeadsPerPageChange}
                    className="border border-cyan-600 rounded text-md text-gray-600 p-2 w-full sm:w-48"
                  >
                    <option value={10}>Number of rows: 10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                    <option value="All">All</option>
                  </select>
                </div>
              </div>

              <div className={`w-auto overflow-x-auto`}>
                <table
                  className={`${
                    isSidebarOpen ? "w-[78rem]" : "w-[86rem]"
                  } overflow-x-auto`}
                >
                  <thead className="bg-gray-200">
                    <tr>
                      <th className="px-2 sm:px-4 py-2 text-xs sm:text-sm border-y-2 border-gray-300 text-left text-gray-700 whitespace-nowrap">
                        S.no
                      </th>
                      <th className="px-2 sm:px-4 py-2 text-xs sm:text-sm border-y-2 border-gray-300 text-left text-gray-700 whitespace-nowrap">
                        Project Name
                      </th>
                      <th className="px-2 sm:px-4 py-2 text-xs sm:text-sm border-y-2 border-gray-300 text-left text-gray-700 whitespace-nowrap">
                        Lead Id
                      </th>
                      <th className="px-2 sm:px-4 py-2 text-xs sm:text-sm border-y-2 border-gray-300 text-left text-gray-700 whitespace-nowrap">
                        Name
                      </th>
                      <th className="px-2 sm:px-4 py-2 text-xs sm:text-sm border-y-2 border-gray-300 text-left text-gray-700 whitespace-nowrap">
                        Phone
                      </th>
                      <th className="px-2 sm:px-4 py-2 text-xs sm:text-sm border-y-2 border-gray-300 text-left text-gray-700 whitespace-nowrap">
                        Lead Source
                      </th>
                      <th className="px-2 sm:px-4 py-2 text-xs sm:text-sm border-y-2 border-gray-300 text-left text-gray-700 whitespace-nowrap">
                        Assigned To
                      </th>
                      <th className="px-2 sm:px-4 py-2 text-xs sm:text-sm border-y-2 border-gray-300 text-left text-gray-700 whitespace-nowrap">
                        Lead Status
                      </th>
                      <th className="px-2 sm:px-4 py-2 text-xs sm:text-sm border-y-2 border-gray-300 text-left text-gray-700 whitespace-nowrap">
                        Unit Status
                      </th>

                      <th
                        className="px-2 sm:px-4 py-2 text-xs sm:text-sm border-y-2 border-gray-300 text-left text-gray-700 whitespace-nowrap cursor-pointer"
                        onClick={toggleSortOrder}
                      >
                        Assigned Date
                        <span className="text-cyan-900 mx-2">
                          {sortOrder === "desce" ? "▲" : "▼"}
                        </span>
                      </th>
                      <th className="px-2 sm:px-4 py-2 text-xs sm:text-sm border-y-2 border-gray-300 text-left text-gray-700 whitespace-nowrap">
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
                          <td className="px-2 sm:px-4 py-3 border-b border-gray-200 text-gray-600 font-semibold whitespace-normal break-words">
                            {leadsPerPage === Infinity
                              ? index + 1
                              : index + 1 + currentPage * leadsPerPage}
                          </td>
                          <td className="px-2 sm:px-4 py-3 border-b border-gray-200 text-gray-600 font-semibold whitespace-normal break-words text-wrap">
                            {lead.project_name}
                          </td>
                          <td className="px-2 sm:px-4 py-3 border-b border-gray-200 underline font-semibold text-cyan-600">
                            <Link
                              to={`/employee-lead-single-data/general/${lead.lead_id}`}
                            >
                              {lead.lead_id}
                            </Link>
                          </td>
                          <td className="px-2 sm:px-4 py-3 border-b border-gray-200 text-gray-600 font-semibold whitespace-normal break-words text-wrap">
                            {lead.name}
                          </td>
                          <td className="px-2 sm:px-4 py-3 border-b border-gray-200 text-gray-600 font-semibold whitespace-normal break-words">
                            <a
                              href={`tel:${lead.phone}`}
                              className="text-cyan-600 cursor-pointer"
                            >
                              {lead.phone}
                            </a>
                          </td>
                          <td className="px-2 sm:px-4 py-3 border-b border-gray-200 text-gray-600 font-semibold whitespace-normal break-words">
                            {lead.leadSource}
                          </td>
                          <td className="px-2 sm:px-4 py-3 border-b border-gray-200 text-gray-600 font-semibold whitespace-normal break-words">
                            {lead.staff_name}
                          </td>
                          <td className="px-2 sm:px-4 py-3 border-b border-gray-200 font-semibold text-gray-600">
                            {lead.lead_status}
                          </td>
                          <td className="px-2 sm:px-4 py-3 border-b border-gray-200 font-semibold text-gray-600">
                            {lead.unit_status}
                          </td>

                          <td className="px-2 sm:px-4 py-3 border-b border-gray-200 text-gray-600 font-semibold whitespace-normal break-words">
                            {moment(lead.createdTime)
                              .format("DD MMM YYYY")
                              .toUpperCase()}
                          </td>
                          <td className="px-2 sm:px-4 py-3 border-b border-gray-200 text-gray-600 font-semibold whitespace-normal break-words">
                            {lead.lead_status === "active lead" ||
                            lead.lead_status === "Calling Done" ||
                            lead.lead_status === "site visit done" ||
                            lead.lead_status === "interested" ||
                            lead.lead_status === "not-interested" ? (
                              <button
                                className="text-[green] font-semibold hover:text-cyan-700"
                                onClick={() => handleUpdate(lead)}
                              >
                                Started Work
                              </button>
                            ) : lead.lead_status === "pending" ? (
                              <button
                                className="text-cyan-600 font-semibold hover:text-cyan-700"
                                onClick={() => handleUpdate(lead)}
                              >
                                Not Start Work
                              </button>
                            ) : lead.lead_status === "completed" ||
                              lead.lead_status === "Sold" ? (
                              <button
                                className="text-gray-400 font-semibold cursor-not-allowed"
                                disabled
                              >
                                Work Completed
                              </button>
                            ) : null}
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

export default EmployeeLeadContent;
