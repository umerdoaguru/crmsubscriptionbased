import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import { Link, useNavigate } from "react-router-dom";
import { BsPencilSquare, BsTrash } from "react-icons/bs";
import ReactPaginate from "react-paginate";
import { useSelector } from "react-redux";
import AdminEditLeadPopup from "../components/AdminEditLeadPopup";

function AdminLeadsContent({ isSidebarOpen }) {
  const navigate = useNavigate();
  const [leads, setLeads] = useState([]);
  const adminuser = useSelector((state) => state.auth.user);
  const token = adminuser.token;
  const userId = adminuser.user_id;
  const [employees, setEmployees] = useState([]);

  const [filterDate, setFilterDate] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({});
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  // Pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const [leadsPerPage, setLeadsPerPage] = useState(10);
  const [leadSourceFilter, setLeadSourceFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [visitFilter, setVisitFilter] = useState("");
  const [dealFilter, setDealFilter] = useState("");
  const [soldunitFilter, setSoldUnitFilter] = useState("");
  const [employeeFilter, setEmployeeFilter] = useState("");
  const [visit, setVisit] = useState([]);
  const [loading, setLoading] = useState(false);
  const [leadStatusFilter, setLeadStatusFilter] = useState("");
  const [leadnotInterestedStatusFilter, setLeadnotInterestedStatusFilter] =
    useState("");
  const [meetingStatusFilter, setMeetingStatusFilter] = useState("");
  const [monthFilter, setMonthFilter] = useState("");
  const [sortOrder, setSortOrder] = useState("desce");
  const [projects, setProjects] = useState([]);
  const [projectunit, setProjectUnit] = useState([]);
  const [selectedLead, setSelectedLead] = useState();
  const [visitmonthFilter, setVisitMonthFilter] = useState("");
  const [yearFilter, setYearFilter] = useState("");

  // Fetch leads from the API
  useEffect(() => {
    fetchEmployees();
    fetchProjects();
    fetchProjectsUnit();
  }, []);

  useEffect(() => {
    fetchLeads();
  }, [token]);

  console.log(projects);

  const fetchLeads = async () => {
    try {
      const response = await axios.get(
        `https://crm-generalize.dentalguru.software/api/getLeadsByOrg/${adminuser?.staff_org_id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = response.data;
      const sources = data
        .map((lead) => lead.leadSource)
        .filter((source) => source);
      setDynamicLeadSources(Array.from(new Set(sources)));
      setLeads(data);
    } catch (error) {
      console.error("Error fetching leads:", error);
    }
  };

  console.log(leads);

  const fetchEmployees = async () => {
    try {
      const { data } = await axios.get(
        `https://crm-generalize.dentalguru.software/api/getEmployeeByOrg/${adminuser?.staff_org_id}`,
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

  const fetchProjects = async () => {
    try {
      const { data } = await axios.get(
        `https://crm-generalize.dentalguru.software/api/super-admin-all-project/${adminuser?.staff_org_id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setProjects(data);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  const fetchProjectsUnit = async (main_project_id) => {
    try {
      if (!main_project_id) {
        setProjectUnit([]);
        return;
      }

      const response = await axios.get(
        `https://crm-generalize.dentalguru.software/api/super-admin-project-unit/${main_project_id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.length > 0) {
        setProjectUnit(response.data);
      } else {
        setProjectUnit([]);
      }
    } catch (error) {
      console.error("Error fetching units:", error);
      setProjectUnit([]);
    }
  };

  const applyFilters = () => {
    let filtered = [...leads];

    // Filter by search term
    if (searchTerm) {
      const trimmedSearchTerm = searchTerm.toLowerCase().trim();
      filtered = filtered.filter((lead) =>
        ["staff_name", "leadSource", "phone", "name"].some((key) =>
          lead[key]?.toLowerCase().trim().includes(trimmedSearchTerm)
        )
      );
    }

    // Filter by date range
    if (startDate && endDate) {
      filtered = filtered.filter((lead) => {
        const leadDate = moment(lead.createdTime).format("YYYY-MM-DD");
        return leadDate >= startDate && leadDate <= endDate;
      });
    }

    // Filter by lead source
    if (leadSourceFilter) {
      filtered = filtered.filter(
        (lead) => lead.leadSource === leadSourceFilter
      );
    }

    // Filter by employee
    if (employeeFilter) {
      filtered = filtered.filter(
        (lead) => lead.assignedTo === Number(employeeFilter)
      );
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
  }, [
    searchTerm,
    startDate,
    endDate,
    leads,
    filterDate,
    leadSourceFilter,
    statusFilter,
    visitFilter,
    dealFilter,
    leadStatusFilter,
    leadnotInterestedStatusFilter,
    meetingStatusFilter,
    employeeFilter,
    monthFilter,
    sortOrder,
    yearFilter,
    visitmonthFilter,
    soldunitFilter,
  ]);

  // Total Leads
  const totalLeads = applyFilters().length;

  // Total Closed Leads
  const totalClosedLeads = applyFilters().filter(
    (lead) => lead.deal_status === "close"
  ).length;

  const totalVisits = applyFilters().filter((lead) =>
    ["fresh", "re-visit", "self", "associative"].includes(lead.visit)
  ).length;

  const indexOfLastLead = (currentPage + 1) * leadsPerPage;
  const indexOfFirstLead = indexOfLastLead - leadsPerPage;

  const currentLeads =
    leadsPerPage === Infinity
      ? filteredLeads
      : filteredLeads.slice(indexOfFirstLead, indexOfLastLead);

  const pageCount = Math.ceil(filteredLeads.length / leadsPerPage);

  const handleCreateClick = () => {
    setIsEditing(false);
    setShowPopup(true);
  };

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  const handleLeadsPerPageChange = (e) => {
    const value = e.target.value;
    setLeadsPerPage(value === "All" ? Infinity : parseInt(value, 10));
    setCurrentPage(0); // Reset to the first page
  };

  // Toggle sort order
  const toggleSortOrder = () => {
    setSortOrder((prevOrder) => (prevOrder === "desce" ? "asce" : "desce"));
  };

  const handleEditClick = (lead) => {
    setSelectedLead(lead);
    setIsEditing(true);
    setShowPopup(true);
  };

  const handleDeleteClick = async (id) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this data?"
    );
    if (isConfirmed) {
      try {
        await axios.delete(
          `https://crm-generalize.dentalguru.software/api/leads/${id}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        fetchLeads();
      } catch (error) {
        console.error("Error deleting lead:", error);
      }
    }
  };

  const hardCodedLeadSources = [
    "Referrals",
    "Cold Calling",
    "Email Campaigns",
    "Networking Events",
    "Paid Advertising",
    "Content Marketing",
    "SEO",
    "Trade Shows",
    "Affiliate Marketing",
    "Direct Mail",
    "Online Directories",
    "others",
  ];

  const [dynamicLeadSources, setDynamicLeadSources] = useState([]);

  const combinedLeadSources = [
    ...new Set([...hardCodedLeadSources, ...dynamicLeadSources]),
  ];

  const handleReset = () => {
    // window.location.reload();
    setSearchTerm("");
    setStartDate("");
    setEndDate("");
    setFilterDate("");
    setLeadSourceFilter("");
    setStatusFilter("");
    setVisitFilter("");
    setDealFilter("");
    setLeadStatusFilter("");
    setLeadnotInterestedStatusFilter("");
    setMeetingStatusFilter("");
    setEmployeeFilter("");
    setMonthFilter("");
    setYearFilter("");
    setVisitMonthFilter("");
    setSoldUnitFilter("");
  };

  return (
    <>
      <div className="flex mt-20">
        <div className="sm:w-full w-[90%] min-h-screen bg-[#F9FAFF] p-2">
          <div className="container">
            <div className="main">
              <h2 className="text-2xl text-center mt-[2rem] font-medium">
                Leads Management
              </h2>
              <div className="mx-auto h-[3px] w-16 bg-cyan-600 my-3"></div>

              {/* Button to create a new lead */}
              <div className="mb-4">
                <button
                  className="bg-cyan-500 text-white px-4 py-2 rounded hover:bg-cyan-700 font-medium"
                  onClick={handleCreateClick}
                >
                  Add Lead
                </button>
              </div>

              <div className="grid max-sm:grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
                {/* Search */}
                <div className="flex flex-col col-span-2">
                  <label className="mb-1 text-sm font-semibold text-gray-700">
                    Search
                  </label>
                  <input
                    type="text"
                    placeholder="Search By Name, Lead Source, Assigned To, Phone No..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`w-full rounded-lg border px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 transition ${
                      searchTerm
                        ? "bg-cyan-600 text-white placeholder-white"
                        : "bg-white"
                    }`}
                  />
                </div>

                {/* Filtered Date */}
                <div className="flex flex-col">
                  <label className="mb-1 text-sm font-semibold text-gray-700">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className={`w-full rounded-lg border px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 transition ${
                      startDate ? "bg-cyan-600 text-white" : "bg-white"
                    }`}
                  />
                </div>
                <div className="flex flex-col">
                  <label className="mb-1 text-sm font-semibold text-gray-700">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className={`w-full rounded-lg border px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 transition ${
                      endDate ? "bg-cyan-600 text-white" : "bg-white"
                    }`}
                  />
                </div>

                {/* Lead Source */}
                <div className="flex flex-col">
                  <label className="mb-1 text-sm font-semibold text-gray-700">
                    Lead Source
                  </label>
                  <select
                    value={leadSourceFilter}
                    onChange={(e) => setLeadSourceFilter(e.target.value)}
                    className={`w-full rounded-lg border px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 transition ${
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
                    <option value="SEO">SEO</option>
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

                {/* Employee Filter */}
                <div className="flex flex-col">
                  <label className="mb-1 text-sm font-semibold text-gray-700">
                    Employee
                  </label>
                  <select
                    value={employeeFilter}
                    onChange={(e) => setEmployeeFilter(e.target.value)}
                    className={`w-full rounded-lg border px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 transition ${
                      employeeFilter ? "bg-cyan-600 text-white" : "bg-white"
                    }`}
                  >
                    <option value="">Select Employee</option>
                    {employees.map((emp) => (
                      <option key={emp.staff_id} value={emp.staff_id}>
                        {emp.staff_name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Unit Sold Filter */}
                <div className="flex flex-col">
                  <label className="mb-1 text-sm font-semibold text-gray-700">
                    Unit Sold
                  </label>
                  <select
                    value={soldunitFilter}
                    onChange={(e) => setSoldUnitFilter(e.target.value)}
                    className={`w-full rounded-lg border px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 transition ${
                      soldunitFilter ? "bg-cyan-600 text-white" : "bg-white"
                    }`}
                  >
                    <option value="">All Deal</option>
                    <option value="sold">Sold</option>
                  </select>
                </div>

                {/* Reset Button */}
                <div className="flex flex-col justify-end">
                  <button
                    onClick={handleReset}
                    className="w-full rounded-lg bg-cyan-600 px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-cyan-700 active:scale-95 transition"
                  >
                    Reset Filters
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-3 sm:gap-10 text-base sm:text-xl font-semibold my-3 mt-5">
              {/* Total Lead Count */}
              <div className="w-full sm:w-auto text-gray-700 text-sm sm:text-xl">
                Total Lead: {totalLeads}
              </div>

              {/* Total Lead Visits */}
              <div className="w-full sm:w-auto text-gray-700 text-sm sm:text-xl">
                Total Site Visit: {totalVisits}
              </div>

              {/* Total Closed Leads */}
              <div className="w-full sm:w-auto text-gray-700 text-sm sm:text-xl">
                Total Closed Lead: {totalClosedLeads}
              </div>

              {/* Rows per page dropdown */}
              <div className="w-full sm:w-auto text-sm sm:text-xl">
                <select
                  onChange={handleLeadsPerPageChange}
                  className="border rounded-2xl w-full p-2"
                >
                  <option value={10}>Number of rows: 10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                  <option value="All">All</option>
                </select>
              </div>
            </div>

            <div
              className={`overflow-x-auto mt-4 ${
                isSidebarOpen ? "w-[78rem]" : "sm:w-[86rem] w-auto"
              } `}
            >
              <table className="min-w-full bg-white border">
                <thead>
                  <tr className="text-nowrap">
                    <th className="px-4 py-2 sm:px-6 sm:py-3 text-xs sm:text-sm border-y-2 border-gray-300 text-left">
                      S.no
                    </th>
                    <th className="px-4 py-2 sm:px-6 sm:py-3 text-xs sm:text-sm border-y-2 border-gray-300 text-left">
                      Project Name
                    </th>
                    <th className="px-4 py-2 sm:px-6 sm:py-3 text-xs sm:text-sm border-y-2 border-gray-300 text-left">
                      Lead Id
                    </th>
                    <th className="px-4 py-2 sm:px-6 sm:py-3 text-xs sm:text-sm border-y-2 border-gray-300 text-left">
                      Name
                    </th>
                    <th className="px-4 py-2 sm:px-6 sm:py-3 text-xs sm:text-sm border-y-2 border-gray-300 text-left">
                      Phone
                    </th>
                    <th className="px-4 py-2 sm:px-6 sm:py-3 text-xs sm:text-sm border-y-2 border-gray-300 text-left">
                      Lead Source
                    </th>
                    <th className="px-4 py-2 sm:px-6 sm:py-3 text-xs sm:text-sm border-y-2 border-gray-300 text-left">
                      Unit Type
                    </th>
                    <th className="px-4 py-2 sm:px-6 sm:py-3 text-xs sm:text-sm border-y-2 border-gray-300 text-left">
                      Assigned To
                    </th>
                    <th className="px-4 py-2 sm:px-6 sm:py-3 text-xs sm:text-sm border-y-2 border-gray-300 text-left">
                      Lead Status
                    </th>
                    <th className="px-4 py-2 sm:px-6 sm:py-3 text-xs sm:text-sm border-y-2 border-gray-300 text-left">
                      Unit Status
                    </th>

                    <th
                      className="px-4 py-2 sm:px-6 sm:py-3 text-xs sm:text-sm border-y-2 border-gray-300 text-left cursor-pointer"
                      onClick={toggleSortOrder}
                    >
                      Assigned Date
                      <span className="text-cyan-900 mx-2">
                        {sortOrder === "desce" ? "▲" : "▼"}
                      </span>
                    </th>
                    <th className="px-4 py-2 sm:px-6 sm:py-3 text-xs sm:text-sm border-y-2 border-gray-300 text-left">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentLeads.length === 0 ? (
                    <tr>
                      <td
                        colSpan="15"
                        className="px-6 py-4 border-b border-gray-200 text-center text-gray-500"
                      >
                        No data found
                      </td>
                    </tr>
                  ) : (
                    currentLeads.map((lead, index) => {
                      console.log(lead, "fdfsdfsdfsdfds");

                      return (
                        <tr
                          key={index}
                          className={index % 2 === 0 ? "bg-gray-100" : ""}
                        >
                          <td className="px-6 py-4 border-b border-gray-200 text-gray-800 font-semibold">
                            {leadsPerPage === Infinity
                              ? index + 1
                              : index + 1 + currentPage * leadsPerPage}
                          </td>
                          <td className="px-6 py-4 border-b border-gray-200 text-gray-800 font-semibold text-wrap">
                            {lead.project_name}
                          </td>
                          <td className="px-6 py-4 border-b border-gray-200 underline text-cyan-600 font-semibold">
                            <Link to={`/lead-single-data/${lead.lead_id}`}>
                              {lead.lead_id}
                            </Link>
                          </td>
                          <td className="px-6 py-4 border-b border-gray-200 text-gray-800 font-semibold text-wrap">
                            {lead.name}
                          </td>
                          <td className="px-6 py-4 border-b border-gray-200 text-gray-800 font-semibold">
                            {lead.phone}
                          </td>
                          <td className="px-6 py-4 border-b border-gray-200 text-gray-800 font-semibold">
                            {lead.leadSource}
                          </td>
                          <td className="px-6 py-4 border-b border-gray-200 font-semibold">
                            {lead.unit_type}
                          </td>
                          <td className="px-6 py-4 border-b border-gray-200 text-gray-800 font-semibold">
                            {lead.staff_name}
                          </td>
                          <td className="px-6 py-4 border-b border-gray-200 font-semibold">
                            {lead.lead_status}
                          </td>
                          <td className="px-6 py-4 border-b border-gray-200 font-semibold">
                            {lead.unit_status}
                          </td>
                          <td className="px-6 py-4 border-b border-gray-200 text-gray-800 font-semibold">
                            {lead.createdTime}
                          </td>
                          <td className="px-6 py-4 border-b border-gray-200 text-gray-800 font-semibold text-nowrap">
                            {lead.unit_status === "sold" ||
                            lead.lead_status === "Sold" ? (
                              <>
                                <button
                                  className="text-gray-500"
                                  disabled
                                  // onClick={() => handleEditClick(lead)}
                                >
                                  <BsPencilSquare size={20} />
                                </button>
                                <button
                                  className="text-gray-500 mx-2"
                                  disabled
                                  // onClick={() =>
                                  //   handleDeleteClick(lead.lead_id)
                                  // }
                                >
                                  <BsTrash size={20} />
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  className="text-cyan-500 hover:text-cyan-700"
                                  onClick={() => handleEditClick(lead)}
                                >
                                  <BsPencilSquare size={20} />
                                </button>
                                <button
                                  className="text-red-500 hover:text-red-700 mx-2"
                                  onClick={() =>
                                    handleDeleteClick(lead.lead_id)
                                  }
                                >
                                  <BsTrash size={20} />
                                </button>
                              </>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
            <div className="2xl:w-[89%] mt-4 mb-3 flex justify-center">
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
      </div>
      <AdminEditLeadPopup
        isOpen={showPopup}
        onClose={() => setShowPopup(false)}
        employees={employees}
        errors={errors}
        combinedLeadSources={combinedLeadSources}
        projectunit={projectunit}
        projects={projects}
        fetchProjectsUnit={fetchProjectsUnit}
        fetchLeads={fetchLeads}
        isEditing={isEditing}
        currentLeads={currentLeads}
        selectedLead={selectedLead}
        setIsEditing={setIsEditing}
      />
    </>
  );
}

export default AdminLeadsContent;
