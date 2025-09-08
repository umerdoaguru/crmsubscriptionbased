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
  ].sort((a, b) => monthOrder.indexOf(a) - monthOrder.indexOf(b)); // Sort by monthOrder

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
  ].sort((a, b) => monthOrder.indexOf(a) - monthOrder.indexOf(b)); // Sort months in order

  // Fetch leads and employees from the API
  useEffect(() => {
    fetchEmployees();
    fetchProjects();
    fetchProjectsUnit();
  }, []);

  useEffect(() => {
    fetchLeads();
  }, [token]);

  const fetchLeads = async () => {
    try {
      const response = await axios.get(
        `https://crm-generalize.dentalguru.software/api/leads-data-user-id/${userId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setLeads(response.data);
      const data = response.data;
      const sources = data
        .map((lead) => lead.leadSource)
        .filter((source) => source);
      setDynamicLeadSources(Array.from(new Set(sources)));
      console.log(leads);
    } catch (error) {
      console.error("Error fetching leads:", error);
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await axios.get(
        `https://crm-generalize.dentalguru.software/api/employee/${userId}`,
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
  const fetchProjects = async () => {
    try {
      const { data } = await axios.get(
        `https://crm-generalize.dentalguru.software/api/all-project/${userId}`,
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
        setProjectUnit([]); // Reset if no project is selected
        return;
      }

      const response = await axios.get(
        `https://crm-generalize.dentalguru.software/api/project-unit/${main_project_id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.length > 0) {
        setProjectUnit(response.data); // Store fetched unit types
      } else {
        setProjectUnit([]); // Reset if no units found
      }
    } catch (error) {
      console.error("Error fetching units:", error);
      setProjectUnit([]); // Reset in case of error
    }
  };

  const handleCreateClick = () => {
    setIsEditing(false);
    setShowPopup(true);
  };

  const handleEditClick = (lead) => {
    console.log(lead);
    fetchProjectsUnit(lead.main_project_id);
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
          `https://crm-generalize.dentalguru.software/api/leads/${id}`
        );
        fetchLeads(); // Refresh the list after deletion
      } catch (error) {
        console.error("Error deleting lead:", error);
      }
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
        ["name", "leadSource", "phone", "assignedTo"].some((key) =>
          lead[key]?.toLowerCase().trim().includes(trimmedSearchTerm)
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

    // Filter by employee
    if (employeeFilter) {
      filtered = filtered.filter((lead) => lead.assignedTo === employeeFilter);
    }

    // Filter by month
    if (monthFilter) {
      filtered = filtered.filter((lead) => {
        const leadMonth = moment(lead.createdTime).format("MM");
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
    leadSourceFilter,
    statusFilter,
    filterDate,
    visitFilter,
    dealFilter,
    leadStatusFilter,
    leadnotInterestedStatusFilter,
    meetingStatusFilter,
    employeeFilter,
    monthFilter,
    yearFilter,
    soldunitFilter,
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

  const closePopup = () => {
    setShowPopup(false);
    setErrors({});
  };

  // Calculate total number of pages
  const pageCount = Math.ceil(filteredLeads.length / leadsPerPage);

  // Pagination logic
  const indexOfLastLead = (currentPage + 1) * leadsPerPage;
  const indexOfFirstLead = indexOfLastLead - leadsPerPage;
  const currentLeads =
    leadsPerPage === Infinity
      ? filteredLeads
      : filteredLeads.slice(indexOfFirstLead, indexOfLastLead);

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
    setLeadSourceFilter("");
    setStatusFilter("");
    setFilterDate("");
    setVisitFilter("");
    setDealFilter("");
    setLeadStatusFilter("");
    setLeadnotInterestedStatusFilter("");
    setMeetingStatusFilter("");
    setEmployeeFilter("");
    setMonthFilter("");
    setYearFilter("");
    setSoldUnitFilter("");
    setVisitMonthFilter("");
  };

  return (
    <>
      <div className="flex mt-20">
        <div className="w-full min-h-screen bg-[#F9FAFF] p-2">
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
              <div className="grid max-sm:grid-cols-2 sm:grid-cols-3  lg:grid-cols-5 gap-4 mb-4">
                <div>
                  <label htmlFor="">Search</label>
                  <input
                    type="text"
                    placeholder=" Name,Lead Source,Assigned To,Phone No"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`border rounded-2xl p-2 w-full ${
                      searchTerm ? "bg-cyan-500 text-white" : "bg-white"
                    }`}
                  />
                </div>
                <div>
                  <label htmlFor="">Filterd Date</label>
                  <input
                    type="date"
                    value={filterDate}
                    onChange={(e) => setFilterDate(e.target.value)}
                    className={`border rounded-2xl p-2 w-full ${
                      filterDate ? "bg-cyan-500 text-white" : "bg-white"
                    }`}
                  />
                </div>
                <div>
                  <label htmlFor="">Meeting Status</label>
                  <select
                    value={meetingStatusFilter}
                    onChange={(e) => setMeetingStatusFilter(e.target.value)}
                    className={`border rounded-2xl p-2 w-full ${
                      meetingStatusFilter
                        ? "bg-cyan-500 text-white"
                        : "bg-white"
                    }`}
                  >
                    <option value="">All Meeting Status</option>
                    <option value="pending">Pending</option>
                    <option value="done by director">Done By Director</option>
                    <option value="done by manager">Done By Manager</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="">Lead Source Filter</label>
                  <select
                    value={leadSourceFilter}
                    onChange={(e) => setLeadSourceFilter(e.target.value)}
                    className={`border rounded-2xl p-2 w-full ${
                      leadSourceFilter ? "bg-cyan-500 text-white" : "bg-white"
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

                <div>
                  <label htmlFor="">Deal Filter</label>
                  <select
                    value={dealFilter}
                    onChange={(e) => setDealFilter(e.target.value)}
                    className={`border rounded-2xl p-2 w-full ${
                      dealFilter ? "bg-cyan-500 text-white" : "bg-white"
                    }`}
                  >
                    <option value="">All Deal</option>
                    <option value="pending">Pending</option>
                    <option value="close">Closed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="">Lead Status</label>
                  <select
                    value={leadStatusFilter}
                    onChange={(e) => setLeadStatusFilter(e.target.value)}
                    className={`border rounded-2xl p-2 w-full ${
                      leadStatusFilter ? "bg-cyan-500 text-white" : "bg-white"
                    }`}
                  >
                    <option value="">All Lead Status</option>
                    <option value="pending">Pending</option>
                    <option value="active lead">Active Lead</option>
                    <option value="calling done">Calling Done</option>
                    <option value="site visit done">Site Visit Done</option>
                    <option value="interested">Interested</option>
                    <option value="not-interested">Not-Interested</option>

                    <option value="completed">Completed</option>
                  </select>
                </div>
                {leadStatusFilter === "not-interested" && (
                  <div>
                    <label htmlFor="">Not Interested</label>
                    <select
                      value={leadnotInterestedStatusFilter}
                      onChange={(e) =>
                        setLeadnotInterestedStatusFilter(e.target.value)
                      }
                      className={`border rounded-2xl p-2 w-full ${
                        leadnotInterestedStatusFilter
                          ? "bg-cyan-500 text-white"
                          : "bg-white"
                      }`}
                    >
                      <option value="">All Not Interested</option>
                      <option value="price">Price</option>
                      <option value="budget">Budget</option>
                      <option value="distance">Distance</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                )}

                <div>
                  <label htmlFor="" className=" fw-semibold text-cyan-600">
                    Visit Month Filter
                  </label>
                  <select
                    value={visitmonthFilter}
                    onChange={(e) => setVisitMonthFilter(e.target.value)}
                    className={`border rounded-2xl p-2 w-full ${
                      visitmonthFilter ? "bg-cyan-500 text-white" : "bg-white"
                    }`}
                  >
                    <option value="">All Months</option>
                    {uniqueVisitMonth.map((visitmonth) => (
                      <option key={visitmonth} value={visitmonth}>
                        {visitmonth}
                      </option>
                    ))}
                  </select>
                </div>

                {visitmonthFilter && (
                  <div>
                    <label htmlFor="">Visit Filter</label>
                    <select
                      value={visitFilter}
                      onChange={(e) => setVisitFilter(e.target.value)}
                      className={`border rounded-2xl p-2 w-full ${
                        visitFilter ? "bg-cyan-500 text-white" : "bg-white"
                      }`}
                    >
                      <option value="">All visit</option>
                      <option value="fresh">Fresh Visit</option>
                      <option value="re-visit">Re-Visit</option>
                      <option value="associative">Associative Visit</option>
                      <option value="self">Self Visit</option>
                    </select>
                  </div>
                )}

                <div>
                  <label htmlFor="yearFilter">Leads Year Filter</label>
                  <select
                    value={yearFilter}
                    onChange={(e) => setYearFilter(e.target.value)}
                    className={`border rounded-2xl p-2 w-full ${
                      yearFilter ? "bg-cyan-500 text-white" : "bg-white"
                    }`}
                  >
                    <option value="">All Years</option>
                    {uniqueYears.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>

                {yearFilter && (
                  <div>
                    <label htmlFor="yearFilter">Leads Month Filter</label>
                    <select
                      value={monthFilter}
                      onChange={(e) => setMonthFilter(e.target.value)}
                      className={`border rounded-2xl p-2 w-full ${
                        monthFilter ? "bg-cyan-500 text-white" : "bg-white"
                      }`}
                    >
                      <option value="">All Months</option>

                      {uniqueMonth.map((month) => (
                        <option key={month} value={month}>
                          {month}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div>
                  <label htmlFor="">Employee Filter</label>
                  <select
                    name="assignedTo"
                    value={employeeFilter}
                    onChange={(e) => setEmployeeFilter(e.target.value)}
                    className={`border rounded-2xl p-2 w-full ${
                      employeeFilter ? "bg-cyan-500 text-white" : "bg-white"
                    }`}
                  >
                    <option value="">Select Employee</option>
                    {employees.map((employee) => (
                      <option key={employee.employee_id} value={employee.name}>
                        {employee.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="">Unit Sold Filter</label>
                  <select
                    value={soldunitFilter}
                    onChange={(e) => setSoldUnitFilter(e.target.value)}
                    className={`border rounded-2xl p-2 w-full ${
                      soldunitFilter ? "bg-cyan-500 text-white" : "bg-white"
                    }`}
                  >
                    <option value="">All Deal</option>
                    <option value="sold">Sold</option>
                  </select>
                </div>

                <div>
                  <button
                    onClick={handleReset}
                    className="bg-cyan-500 text-white py-2 px-4 rounded hover:bg-cyan-600 transition-colors"
                  >
                    Reset Page
                  </button>
                </div>
              </div>
            </div>
            <div className="flex gap-10 text-xl font-semibold my-3 mt-5">
              {/* Total Lead Count */}
              <div>Total Lead: {totalLeads}</div>

              {/* Total Lead Visits */}
              <div>Total Site Visit: {totalVisits}</div>

              {/* Total Closed Leads */}
              <div>Total Closed Lead: {totalClosedLeads}</div>
              <select
                onChange={handleLeadsPerPageChange}
                className="border rounded-2xl w-1/4"
              >
                <option value={10}>Number of rows: 10</option>

                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value="All">All</option>
              </select>
            </div>

            <div
              className={`overflow-x-auto mt-4 ${
                isSidebarOpen ? "w-[78rem]" : "w-[86rem]"
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
                    <th className="px-4 py-2 sm:px-6 sm:py-3 text-xs sm:text-sm border-y-2 border-gray-300 text-left">
                      Visit
                    </th>
                    <th className="px-4 py-2 sm:px-6 sm:py-3 text-xs sm:text-sm border-y-2 border-gray-300 text-left">
                      Visit Date
                    </th>
                    <th className="px-4 py-2 sm:px-6 sm:py-3 text-xs sm:text-sm border-y-2 border-gray-300 text-left">
                      Reason
                    </th>
                    <th className="px-4 py-2 sm:px-6 sm:py-3 text-xs sm:text-sm border-y-2 border-gray-300 text-left">
                      Meeting Status
                    </th>

                    <th className="px-4 py-2 sm:px-6 sm:py-3 text-xs sm:text-sm border-y-2 border-gray-300 text-left">
                      Remark Status
                    </th>
                    <th className="px-4 py-2 sm:px-6 sm:py-3 text-xs sm:text-sm border-y-2 border-gray-300 text-left">
                      Answer Remark
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
                            {lead.assignedTo}
                          </td>
                          <td className="px-6 py-4 border-b border-gray-200 font-semibold">
                            {lead.lead_status}
                          </td>
                          <td className="px-6 py-4 border-b border-gray-200 font-semibold">
                            {lead.unit_status}
                          </td>
                          <td className="px-6 py-4 border-b border-gray-200 font-semibold">
                            {lead.visit}
                          </td>

                          <td className="px-6 py-4 border-b border-gray-200 text-gray-800 font-semibold text-nowrap">
                            {lead.visit_date === "pending"
                              ? "pending"
                              : moment(lead.visit_date)
                                  .format("DD MMM YYYY")
                                  .toUpperCase()}
                          </td>
                          <td className="px-6 py-4 border-b border-gray-200 font-semibold">
                            {lead.reason}
                          </td>

                          <td className="px-6 py-4 border-b border-gray-200 font-semibold">
                            {lead.meeting_status}
                          </td>

                          <td className="px-6 py-4 border-b border-gray-200 text-gray-800 font-semibold text-wrap">
                            {lead.remark_status}
                          </td>
                          <td className="px-6 py-4 border-b border-gray-200 text-gray-800 font-semibold  text-wrap">
                            {lead.answer_remark}
                          </td>
                          <td className="px-6 py-4 border-b border-gray-200 text-gray-800 font-semibold">
                            {moment(lead.createdTime)
                              .format("DD MMM YYYY")
                              .toUpperCase()}
                          </td>
                          <td className="px-6 py-4 border-b border-gray-200 text-gray-800 font-semibold text-nowrap">
                            <button
                              className="text-cyan-500 hover:text-cyan-700"
                              onClick={() => handleEditClick(lead)}
                            >
                              <BsPencilSquare size={20} />
                            </button>
                            <button
                              className="text-red-500 hover:text-red-700 mx-2"
                              onClick={() => handleDeleteClick(lead.lead_id)}
                            >
                              <BsTrash size={20} />
                            </button>
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
