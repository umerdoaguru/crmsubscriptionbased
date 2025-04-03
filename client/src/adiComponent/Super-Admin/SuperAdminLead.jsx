import React, { useState, useEffect } from "react";
import axios from "axios";


import moment from "moment";
import { Link, useNavigate } from "react-router-dom";
import { BsPencilSquare, BsTrash } from "react-icons/bs";

import styled from "styled-components";
import ReactPaginate from "react-paginate";
import SuperAdminSider from './SuperAdminSider';
import MainHeader from '../../components/MainHeader';

function SuperAdminLead() {
  const navigate = useNavigate();
  const [leads, setLeads] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [currentLead, setCurrentLead] = useState({
    lead_no: "",
    assignedTo: "",
    employeeId: "",
    createdTime: "", 
    name: "",
    phone: "",
    leadSource: "",
    subject: "",
    status: "",
    visit: "",
    visit_date: "",
  });
  const [showPopup, setShowPopup] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({});
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  // Pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const [leadsPerPage] = useState(10);
  const [leadSourceFilter, setLeadSourceFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [visitFilter, setVisitFilter] = useState("");
  const [dealFilter, setDealFilter] = useState("");

  // Fetch leads and employees from the API
  useEffect(() => {
    fetchLeads();
    fetchEmployees();
  }, []);

  const fetchLeads = async () => {
    try {
      const response = await axios.get("https://crmdemo.vimubds5.a2hosted.com/api/leads");
      console.log(response.data);
      setLeads(response.data);
    } catch (error) {
      console.error("Error fetching leads:", error);
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await axios.get("https://crmdemo.vimubds5.a2hosted.com/api/employee");
      setEmployees(response.data);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  const validateForm = () => {
    let formErrors = {};
    let isValid = true;

    if (!currentLead.lead_no) {
      formErrors.lead_no = "Lead number is required";
      isValid = false;
    }

    if (!currentLead.assignedTo) {
      formErrors.assignedTo = "Assigned To field is required";
      isValid = false;
    }

    if (!currentLead.name) {
      formErrors.name = "Name is required";
      isValid = false;
    }

    if (!currentLead.phone) {
      formErrors.phone = "Phone number is required";
      isValid = false;
    } else if (!/^\d{10}$/.test(currentLead.phone)) {
      formErrors.phone = "Phone number must be 10 digits";
      isValid = false;
    }

    if (!currentLead.leadSource) {
      formErrors.leadSource = "Lead Source is required";
      isValid = false;
    }
    if (!currentLead.subject) {
      formErrors.subject = "Subject is required";
      isValid = false;
    }

    setErrors(formErrors);
    return isValid;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentLead((prevLead) => {
      const updatedLead = { ...prevLead, [name]: value };

      // If assignedTo changes, update employeeId accordingly
      if (name === "assignedTo") {
        const selectedEmployee = employees.find(
          (employee) => employee.name === value
        );
        if (selectedEmployee) {
          updatedLead.employeeId = selectedEmployee.employeeId;
        } else {
          updatedLead.employeeId = ""; // Reset employeeId if no match found
        }
      }

      return updatedLead;
    });
  };


  const handleEditClick = (lead) => {
    setCurrentLead({
      ...lead,
      createdTime: moment(lead.createdTime).format("YYYY-MM-DD"), // Format the createdTime
    });
    setShowPopup(true);
  };

  const saveChanges = async () => {
    if (validateForm()) {
        try {
          await axios.put(
            `https://crmdemo.vimubds5.a2hosted.com/api/leads/${currentLead.lead_id}`,
            currentLead
          );
          fetchLeads(); // Refresh the list
          closePopup();
        } catch (error) {
          console.error("Error updating lead:", error);
        } 
    }
  };

  const handleDeleteClick = async (id) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this data?"
    );
    if (isConfirmed) {
      try {
        await axios.delete(`https://crmdemo.vimubds5.a2hosted.com/api/leads/${id}`);
        fetchLeads(); // Refresh the list after deletion
      } catch (error) {
        console.error("Error deleting lead:", error);
      }
    }
  };
  useEffect(() => {
    let filtered = leads;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (lead) =>
          lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          lead.lead_no.toLowerCase().includes(searchTerm.toLowerCase()) ||
          lead.leadSource.toLowerCase().includes(searchTerm.toLowerCase())
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
    // Filter by status
    if (statusFilter) {
      filtered = filtered.filter((lead) => lead.status === statusFilter);
    }

    // Filter by visit
    if (visitFilter) {
      filtered = filtered.filter((visit) => visit.visit === visitFilter);
    }

    // Filter by Deak
    if (dealFilter) {
      filtered = filtered.filter((deal) => deal.deal_status === dealFilter);
    }

    setFilteredLeads(filtered);
  }, [searchTerm, startDate, endDate, leads, leadSourceFilter, statusFilter, visitFilter, dealFilter]);

  const closePopup = () => {
    setShowPopup(false);
    setErrors({});
  };

  // Use filteredLeads for pagination
  const indexOfLastLead = (currentPage + 1) * leadsPerPage;
  const indexOfFirstLead = indexOfLastLead - leadsPerPage;
  const currentLeads = filteredLeads.slice(indexOfFirstLead, indexOfLastLead);

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  

  return (
    <>
      <MainHeader />
      {/* <Sider /> */}
      <SuperAdminSider />
      <Wrapper>
        <div className="container 2xl:max-w-[1280px]">
          <div className="main">
            <h1 className="text-2xl text-center mt-[5rem] font-medium">
              Leads Management
            </h1>
            <div className="mx-auto h-[3px] w-16 bg-[#34495E] my-3"></div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-4 mb-4">
              <div>
                <label htmlFor="">Search</label>
                <input
                  type="text"
                  placeholder="Search by Name, Lead No, Lead Source"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border rounded-2xl p-2 w-full"
                />
              </div>
              <div>
                <label htmlFor="">Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="border  rounded-2xl p-2 w-full"
                />
              </div>

              <div>
                <label htmlFor="">End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="border   rounded-2xl p-2 w-full"
                />
              </div>
              <div>
                <label htmlFor="">Lead Source Filter</label>
                <select
                  value={leadSourceFilter}
                  onChange={(e) => setLeadSourceFilter(e.target.value)}
                  className="border rounded-2xl p-2 w-full"
                >
                  <option value="">All Lead Sources</option>
                  <option value="Facebook Campaign">Facebook Campaign</option>
                  <option value="One Realty Website">One Realty Website</option>
                  <option value="Trade Shows">Trade Shows</option>
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
                  <option value="Online Directories">Online Directories</option>
                </select>
              </div>

              <div>
                <label htmlFor="">Status Filter</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="border rounded-2xl p-2 w-full"
                >
                  <option value="">All Status</option>
                  {/* <option value="Facebook Campaign">visited</option>
                  <option value="One Realty Website">pending</option>
                  <option value="Trade Shows">confirm</option>
                  <option value="Cold Calling">Cold Calling</option> */}
                  <option default value="pending">Pending</option>
                  <option value="interested">Interested</option>
                  <option value="non interested">Non-Interested</option>
                </select>
              </div>
              <div>
                <label htmlFor="">Visit Filter</label>
                <select
                  value={visitFilter}
                  onChange={(e) => setVisitFilter(e.target.value)}
                  className="border rounded-2xl p-2 w-full"
                >
                  <option value="">All visit</option>
                  <option value="pending">Pending</option>
                  <option value="fresh visit">Fresh Visit</option>
                  <option value="repeated visit">Repeated Visit</option>
                </select>
              </div>
              <div>
                <label htmlFor="">Deal Filter</label>
                <select
                  value={dealFilter}
                  onChange={(e) => setDealFilter(e.target.value)}
                  className="border rounded-2xl p-2 w-full"
                >
                  <option value="">All Deal</option>
                  <option value="pending">Pending</option>
                  <option value="in progress">In Progress</option>
                  <option value="closed">Closed</option>
                  <option value="not closed">Not Closed</option>
                </select>
              </div>
            </div>
          </div>

          <div className="tt overflow-x-auto mt-4">
            <table className="min-w-full bg-white border">
              <thead>
                <tr>
                  <th className="px-6 py-3 border-b-2 border-gray-300 text-left leading-4 text-gray-600 tracking-wider">
                    S.no
                  </th>
                  <th className="px-6 py-3 border-b-2 border-gray-300 text-left leading-4 text-gray-600 tracking-wider">
                    Lead Number
                  </th>
                  <th className="px-6 py-3 border-b-2 border-gray-300 text-left leading-4 text-gray-600 tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 border-b-2 border-gray-300 text-left leading-4 text-gray-600 tracking-wider">
                    Phone
                  </th>
                  <th className="px-6 py-3 border-b-2 border-gray-300 text-left leading-4 text-gray-600 tracking-wider">
                    Lead Source
                  </th>
                  <th className="px-6 py-3 border-b-2 border-gray-300 text-left leading-4 text-gray-600 tracking-wider">
                    Assigned To
                  </th>
                  <th className="px-6 py-3 border-b-2 border-gray-300 text-left leading-4 text-gray-600 tracking-wider">
                    Project
                  </th>
                  <th className="px-6 py-3 border-b-2 border-gray-300 text-left leading-4 text-gray-600 tracking-wider">
                    Lead Status
                  </th>
                  <th className="px-6 py-3 border-b-2 border-gray-300 text-left leading-4 text-gray-600 tracking-wider">
                    Created Time
                  </th>
                  <th className="px-6 py-3 border-b-2 border-gray-300 text-left leading-4 text-gray-600 tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 border-b-2 border-gray-300 text-left leading-4 text-gray-600 tracking-wider">
                    Visit
                  </th>
                  <th className="px-6 py-3 border-b-2 border-gray-300 text-left leading-4 text-gray-600 tracking-wider">
                    Visit date
                  </th>
                  <th className="px-6 py-3 border-b-2 border-gray-300 text-left leading-4 text-gray-600 tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentLeads.map((lead, index) => (
                  <tr
                    key={lead.lead_id}
                    className={index % 2 === 0 ? "bg-gray-100" : ""}
                  >
                    <td className="px-6 py-4 border-b border-gray-200 text-gray-800">
                      {index + 1}
                    </td>
                    <Link to={`/super-admin-lead-single-data/${lead.lead_id}`}>
                      <td className="px-6 py-4 border-b border-gray-200 underline text-[blue]">
                        {lead.lead_no}
                      </td>
                    </Link>
                    <td className="px-6 py-4 border-b border-gray-200 text-gray-800">
                      {lead.name}
                    </td>
                    <td className="px-6 py-4 border-b border-gray-200 text-gray-800">
                      {lead.phone}
                    </td>
                    <td className="px-6 py-4 border-b border-gray-200 text-gray-800">
                      {lead.leadSource}
                    </td>
                    <td className="px-6 py-4 border-b border-gray-200 text-gray-800">
                      {lead.assignedTo}
                    </td>
                    <td className="px-6 py-4 border-b border-gray-200 text-gray-800">
                      {lead.subject}
                    </td>
                    {lead.lead_status === "pending" && (
                      <td className="px-6 py-4 border-b border-gray-200  font-semibold text-[red]">
                        {lead.lead_status}
                      </td>
                    )}
                    {lead.lead_status === "in progress" && (
                      <td className="px-6 py-4 border-b border-gray-200 font-semibold text-[orange]">
                        {lead.lead_status}
                      </td>
                    )}

                    {lead.lead_status === "completed" && (
                      <td className="px-6 py-4 border-b border-gray-200  font-semibold text-[green]">
                        {lead.lead_status}
                      </td>
                    )}

                    <td className="px-6 py-4 border-b border-gray-200 text-gray-800">
                      {moment(lead.createdTime).format("YYYY-MM-DD")}
                    </td>

                    <td className="px-6 py-4 border-b border-gray-200 text-gray-800">
                      {lead.status}
                    </td>

                    <td className="px-6 py-4 border-b border-gray-200 text-gray-800">
                      {lead.visit}
                    </td>
                    <td className="px-6 py-4 border-b border-gray-200 text-gray-800">
                      {lead.visit_date}
                    </td>
                    <td className="px-6 py-4 border-b border-gray-200 text-gray-800">
                      <button
                        className="text-blue-500 hover:text-blue-700"
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
                ))}
              </tbody>
            </table>
          </div>

          {showPopup && (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg w-[500px]">
                <h2 className="text-xl mb-4">
                  {/* {isEditing ? "Edit Lead" : "Add Lead"} */}
                  Edit Lead
                </h2>
                <div className="mb-4">
                  <label className="block text-gray-700">Lead Number</label>
                  <input
                    type="number"
                    name="lead_no"
                    value={currentLead.lead_no}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border ${
                      errors.lead_no ? "border-red-500" : "border-gray-300"
                    } rounded`}
                  />
                  {errors.lead_no && (
                    <span className="text-red-500">{errors.lead_no}</span>
                  )}
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Assigned To</label>
                  <select
                    name="assignedTo"
                    value={currentLead.assignedTo}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border ${
                      errors.assignedTo ? "border-red-500" : "border-gray-300"
                    } rounded`}
                  >
                    <option value="">Select Employee</option>
                    {employees.map((employee) => (
                      <option key={employee.employee_id} value={employee.name}>
                        {employee.name}
                      </option>
                    ))}
                  </select>
                  {errors.assignedTo && (
                    <span className="text-red-500">{errors.assignedTo}</span>
                  )}
                </div>

                {/* Hidden employeeId field */}
                <input
                  type="hidden"
                  id="employeeId"
                  name="employeeId"
                  value={currentLead.employeeId}
                />

                <div className="mb-4">
                  <label className="block text-gray-700">Date</label>
                  <input
                    type="date"
                    name="createdTime"
                    value={currentLead.createdTime}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-100"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={currentLead.name}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border ${
                      errors.name ? "border-red-500" : "border-gray-300"
                    } rounded`}
                  />
                  {errors.name && (
                    <span className="text-red-500">{errors.name}</span>
                  )}
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Phone</label>
                  <input
                    type="number"
                    name="phone"
                    value={currentLead.phone}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border ${
                      errors.phone ? "border-red-500" : "border-gray-300"
                    } rounded`}
                  />
                  {errors.phone && (
                    <span className="text-red-500">{errors.phone}</span>
                  )}
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Lead Source</label>
                  <select
                    name="leadSource"
                    id="leadSource"
                    value={currentLead.leadSource}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                  >
                    <option value="">Select Lead Source</option>
                    <option value="Website Inquiries">Website Inquiries</option>
                    <option value="Social Media">Social Media</option>
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
                  {errors.leadSource && (
                    <p className="text-red-500 text-xs">{errors.leadSource}</p>
                  )}
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Subject</label>
                  <input
                    type="text"
                    name="subject"
                    value={currentLead.subject}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border ${
                      errors.phone ? "border-red-500" : "border-gray-300"
                    } rounded`}
                  />
                  {errors.phone && (
                    <span className="text-red-500">{errors.phone}</span>
                  )}
                </div>

                <div className="flex justify-end">
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 mr-2"
                    onClick={saveChanges}
                  >
                    Save
                  </button>
                  <button
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700"
                    onClick={closePopup}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
          <div className="mt-4 flex justify-center">
            <ReactPaginate
              previousLabel={"Previous"}
              nextLabel={"Next"}
              breakLabel={"..."}
              pageCount={Math.ceil(leads.length / leadsPerPage)}
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
      </Wrapper>
    </>
  );
}

export default SuperAdminLead;

const Wrapper = styled.div`
  .tt {
    white-space: nowrap;
    @media screen and (min-width: 1500px) and (max-width: 1700px) {
      width: 89%;
      margin-left: 10rem;
      white-space: nowrap;
    }
  }
  .main {
    @media screen and (min-width: 1500px) and (max-width: 1700px) {
      margin-left: 10rem;
    }
  }
`;
