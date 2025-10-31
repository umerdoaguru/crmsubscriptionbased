import React, { useState, useEffect } from "react";
import moment from "moment";
import { BsPencilSquare, BsTrash } from "react-icons/bs";
import axios from "axios";
import ReactPaginate from "react-paginate";
import cogoToast from "cogo-toast";
import Super_Single_Lead_Profile from "./Super_Single_Lead_Profile";
import { useSelector } from "react-redux";
import SuperAdminEditLeadPopup from "./SuperAdminEditLeadPopup";
import BulkLeadUploadPopup from "../../pages/superAdmin/popupWindows/BulkLeadUploadPopup";
import { FaDatabase } from "react-icons/fa6";

function SuperEmployeeLeadsContent({ isSidebarOpen }) {
  const superadminuser = useSelector((state) => state.auth.user);
  const token = superadminuser.token;
  const userId = superadminuser.staff_id;

  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [filterDate, setFilterDate] = useState("");
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
  const [leadStatusFilter, setLeadStatusFilter] = useState("");
  const [leadnotInterestedStatusFilter, setLeadnotInterestedStatusFilter] =
    useState("");
  const [meetingStatusFilter, setMeetingStatusFilter] = useState("");
  const [employees, setEmployees] = useState([]);
  const [employeeFilter, setEmployeeFilter] = useState("");
  const [soldunitFilter, setSoldUnitFilter] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [isModalOpenLeadProfile, setIsModalOpenLeadProfile] = useState(false);
  const [selectedLeadId, setSelectedLeadId] = useState(null);
  const [monthFilter, setMonthFilter] = useState("");
  const [sortOrder, setSortOrder] = useState("desce");
  const [isEditing, setIsEditing] = useState(false);
  const [selectedLead, setSelectedLead] = useState();
  const [showPopup, setShowPopup] = useState(false);
  const [projects, setProjects] = useState([]);
  const [projectunit, setProjectUnit] = useState([]);
  const [visitmonthFilter, setVisitMonthFilter] = useState("");
  const [yearFilter, setYearFilter] = useState("");
  const [showBulkModal, setShowBulkModal] = useState(false);

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
        `https://crm-generalize.dentalguru.software/api/getLeadsByOrg/${superadminuser?.staff_org_id}`,
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

  const fetchEmployees = async () => {
    try {
      const { data } = await axios.get(
        `https://crm-generalize.dentalguru.software/api/getEmployeeByOrg/${superadminuser?.staff_org_id}`,
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
        `https://crm-generalize.dentalguru.software/api/super-admin-all-project/${superadminuser?.staff_org_id}`,
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

  const handleInputChange = (e) => {
    setModalData({
      ...modalData,
      [e.target.name]: e.target.value,
    });
  };

  const updateAnswerRemark = async () => {
    try {
      const response = await axios.put(
        `https://crm-generalize.dentalguru.software/api/updateOnlyAnswerRemark`,
        modalData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        cogoToast.success("AnswerRemark updated successfully!");
        fetchLeads();
        closeModal();
      }
    } catch (error) {
      console.error("Error updating AnswerRemark:", error);
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

  const openModal = (data) => {
    setModalData(data);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalData(null);
  };

  // Function to open modal and set lead_id
  const handleRowClick = (leadId) => {
    setSelectedLeadId(leadId);
    setIsModalOpenLeadProfile(true);
  };

  // Function to close the modal
  const closeModalLead = () => {
    setIsModalOpenLeadProfile(false);
    setSelectedLeadId(null);
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

  console.log(leads);

  return (
    <>
      <div className="flex mt-20">
        <div className="w-[90%] sm:w-full min-h-screen bg-[#F9FAFF] p-2">
          <div className="container pt-4">
            <div className="main 2xl:w-[89%] ">
              <div>
                <h2 className="text-xl sm:text-2xl text-start my-2 font-semibold text-gray-600">
                  Leads Management
                </h2>
              </div>
              <div className="flex mb-4 gap-2">
                <button
                  className="bg-cyan-600 text-white mt-2 px-4 py-2 rounded hover:bg-cyan-700 font-medium"
                  onClick={handleCreateClick}
                >
                  Add Lead
                </button>
                <button
                  className="bg-green-600 text-white mt-2 px-4 py-2 rounded hover:bg-green-700 font-medium flex gap-2 items-center"
                  onClick={() => setShowBulkModal(true)}
                >
                  <FaDatabase /> Add Lead Bulk
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
                    className={`w-auto sm:w-full rounded-lg border px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 transition ${
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

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 rounded-lg my-1">
              {/* Stats */}
              <div className="flex flex-wrap gap-2 sm:gap-6 text-sm sm:text-lg font-semibold text-gray-700">
                <div className="px-4 py-2 bg-cyan-50 rounded-lg shadow-sm hover:shadow-md transition">
                  <span className="text-gray-900">Total Lead:</span>{" "}
                  {totalLeads}
                </div>
                <div className="px-4 py-2 bg-green-50 rounded-lg shadow-sm hover:shadow-md transition">
                  <span className="text-gray-900">Total Site Visit:</span>{" "}
                  {totalVisits}
                </div>
                <div className="px-4 py-2 bg-yellow-50 rounded-lg shadow-sm hover:shadow-md transition">
                  <span className="text-gray-900">Closed Leads:</span>{" "}
                  {totalClosedLeads}
                </div>
              </div>

              {/* Dropdown */}
              <div>
                <select
                  onChange={handleLeadsPerPageChange}
                  className="px-2 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition w-48"
                >
                  <option value={10}>Rows: 10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                  <option value="All">All</option>
                </select>
              </div>
            </div>

            <div
              className={`overflow-x-auto mt-2 ${
                isSidebarOpen ? "w-[78rem]" : "sm:w-[86rem]"
              }`}
            >
              <table className="tt min-w-full bg-white border whitespace-nowrap">
                <thead>
                  <tr>
                    <th className="px-4 py-2 sm:px-6 sm:py-3 text-xs sm:text-sm border-y-2 border-gray-300 text-left text-cyan-700">
                      S.no
                    </th>
                    <th className="px-4 py-2 sm:px-6 sm:py-3 text-xs sm:text-sm border-y-2 border-gray-300 text-left text-cyan-700">
                      Project Name
                    </th>
                    <th className="px-4 py-2 sm:px-6 sm:py-3 text-xs sm:text-sm border-y-2 border-gray-300 text-left text-cyan-700">
                      Lead Id
                    </th>
                    <th className="px-4 py-2 sm:px-6 sm:py-3 text-xs sm:text-sm border-y-2 border-gray-300 text-left text-cyan-700">
                      Name
                    </th>
                    <th className="px-4 py-2 sm:px-6 sm:py-3 text-xs sm:text-sm border-y-2 border-gray-300 text-left text-cyan-700">
                      Phone
                    </th>
                    <th className="px-4 py-2 sm:px-6 sm:py-3 text-xs sm:text-sm border-y-2 border-gray-300 text-left text-cyan-700">
                      Lead Source
                    </th>
                    <th className="px-4 py-2 sm:px-6 sm:py-3 text-xs sm:text-sm border-y-2 border-gray-300 text-left text-cyan-700">
                      Unit Type
                    </th>
                    <th className="px-4 py-2 sm:px-6 sm:py-3 text-xs sm:text-sm border-y-2 border-gray-300 text-left text-cyan-700">
                      Assigned To
                    </th>

                    <th className="px-4 py-2 sm:px-6 sm:py-3 text-xs sm:text-sm border-y-2 border-gray-300 text-left text-cyan-700">
                      Lead Status
                    </th>
                    <th className="px-4 py-2 sm:px-6 sm:py-3 text-xs sm:text-sm border-y-2 border-gray-300 text-left text-cyan-700">
                      Unit Status
                    </th>

                    <th
                      className="px-4 py-2 sm:px-6 sm:py-3 text-xs sm:text-sm border-y-2 border-gray-300 text-left text-cyan-700 cursor-pointer"
                      onClick={toggleSortOrder}
                    >
                      Assigned Date
                      <span className="text-cyan-600 mx-2">
                        {sortOrder === "desce" ? "▲" : "▼"}
                      </span>
                    </th>

                    <th className="px-4 py-2 sm:px-6 sm:py-3 text-xs sm:text-sm border-y-2 border-gray-300 text-left text-cyan-700">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentLeads.length > 0 ? (
                    currentLeads.map((lead, index) => (
                      <tr
                        key={index}
                        className={index % 2 === 0 ? "bg-gray-100" : ""}
                      >
                        <td className="px-6 py-4 border-b border-gray-200 text-gray-700 ">
                          {leadsPerPage === Infinity
                            ? index + 1
                            : index + 1 + currentPage * leadsPerPage}
                        </td>
                        <td className="px-6 py-4 border-b border-gray-200 text-gray-700 text-wrap font-semibold">
                          {lead.project_name}
                        </td>
                        <td
                          className="px-6 py-4 border-b border-gray-200 underline text-cyan-600 cursor-pointer font-semibold"
                          onClick={() => handleRowClick(lead)}
                        >
                          {lead.lead_id}
                        </td>
                        <td className="px-6 py-4 border-b border-gray-200 text-gray-700 text-wrap font-semibold">
                          {lead.name}
                        </td>
                        <td className="px-6 py-4 border-b border-gray-200 text-gray-700 font-semibold">
                          {lead.phone}
                        </td>
                        <td className="px-6 py-4 border-b border-gray-200 text-gray-700 font-semibold">
                          {lead.leadSource}
                        </td>
                        <td className="px-6 py-4 border-b border-gray-200 text-gray-700 font-semibold">
                          {lead.unit_type}
                        </td>
                        <td className="px-6 py-4 border-b border-gray-200 text-gray-700 font-semibold">
                          {lead.staff_name}
                        </td>
                        <td className="px-6 py-4 border-b border-gray-200 font-semibold">
                          {lead.lead_status}
                        </td>
                        <td className="px-6 py-4 border-b border-gray-200 font-semibold">
                          {lead.unit_status}
                        </td>

                        <td className="px-6 py-4 border-b border-gray-200 text-gray-700 font-semibold">
                          {lead.createdTime}
                        </td>
                        <td className="px-6 py-4 border-b border-gray-200 text-gray-700 font-semibold text-nowrap">
                          {lead.lead_status !== "Sold" ||
                          lead.unit_status ||
                          lead.unit_status !== "sold" ? (
                            <>
                              <button
                                className="text-cyan-600 hover:text-cyan-700"
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
                            </>
                          ) : (
                            <>
                              <button
                                className="text-gray-600"
                                disabled
                                // onClick={() => handleEditClick(lead)}
                              >
                                <BsPencilSquare size={20} />
                              </button>
                              <button
                                className="text-gray-600 mx-2"
                                disabled
                                // onClick={() =>
                                //   handleDeleteClick(lead.lead_id)
                                // }
                              >
                                <BsTrash size={20} />
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={15} className="py-4 text-center">
                        No data found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {isModalOpen && (
              <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
                <div className="bg-white p-6 rounded-lg shadow-lg w-[500px]">
                  <h2 className="text-xl mb-4 font-bold">Edit Visit</h2>
                  <form>
                    <div className="mb-4">
                      <label className="block text-gray-700">
                        Remark Status:
                      </label>
                      <input
                        type="text"
                        name="remark_status"
                        value={modalData.remark_status || ""}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded"
                        disabled
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-700">
                        Answer Remarks
                      </label>
                      <input
                        type="text"
                        name="answer_remark"
                        value={modalData.answer_remark || ""}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded"
                      />
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={updateAnswerRemark}
                        className="bg-cyan-600 text-white px-4 py-2 rounded hover:bg-cyan-700 mr-2"
                      >
                        Update
                      </button>
                      <button
                        type="button"
                        onClick={closeModal}
                        className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            <div className="mt-4 flex mb-4 justify-center 2xl:w-[89%]">
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
          {isModalOpenLeadProfile && selectedLeadId && (
            <div className=" fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-[1055]">
              <div className="w-75 bg-white p-6 rounded-lg shadow-lg max-h-[80vh] overflow-auto mx-4 my-5">
                <Super_Single_Lead_Profile
                  selectedLeadId={selectedLeadId}
                  closeModalLead={closeModalLead}
                  type={"general"}
                />
              </div>
            </div>
          )}
        </div>
      </div>
      <SuperAdminEditLeadPopup
        isOpen={showPopup}
        onClose={() => setShowPopup(false)}
        employees={employees}
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

      <BulkLeadUploadPopup
        isOpen={showBulkModal}
        onClose={() => setShowBulkModal(false)}
        fetchLeads={fetchLeads}
      />
    </>
  );
}

export default SuperEmployeeLeadsContent;
