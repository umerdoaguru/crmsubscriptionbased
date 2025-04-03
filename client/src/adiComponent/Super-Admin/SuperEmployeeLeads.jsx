import React, { useState, useEffect } from "react";
import moment from "moment";

import { Link, useNavigate, useParams } from "react-router-dom";
import { BsPencilSquare, BsTrash } from "react-icons/bs";
import axios from "axios";
import ReactPaginate from "react-paginate";
import styled from "styled-components";
import MainHeader from "./../../components/MainHeader";
import SuperAdminSider from "./SuperAdminSider";
import cogoToast from "cogo-toast";
import Super_Single_Lead_Profile from "./Super_Single_Lead_Profile";
import { useSelector } from "react-redux";

function SuperEmployeeLeads() {  
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
  const [leadnotInterestedStatusFilter, setLeadnotInterestedStatusFilter] = useState("");
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
  const [activeDropdown, setActiveDropdown] = useState("");

  

 const [currentLead, setCurrentLead] = useState({
    lead_no: "",
    assignedTo: "",
    employeeId: "",
    employeephone: "",
    createdTime: "", // Added here
    name: "",
    phone: "",
    leadSource: "",
    project_name: "",
    address: "",
    actual_date: "",
  });

  const [showPopup, setShowPopup] = useState(false);
  const [loading , setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [customLeadSource, setCustomLeadSource] = useState("");
  const superadminuser = useSelector((state) => state.auth.user);
  const token = superadminuser.token;
  const [projects, setProjects] = useState([]);
  const [projectunit, setProjectUnit] = useState([]);
  const [visitmonthFilter, setVisitMonthFilter] = useState("");
  const [yearFilter, setYearFilter] = useState("");

 
const uniqueYears = [
    ...new Set(leads.map((lead) => moment(lead.createdTime).format("YYYY")))
  ];

  const monthOrder = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ]
  const uniqueMonth = [
    ...new Set(
      leads
        .filter((lead) => moment(lead.createdTime).format("YYYY") === yearFilter)
        .map((lead) => moment(lead.createdTime).format("MMMM"))
    ),
  ].sort((a, b) => monthOrder.indexOf(a) - monthOrder.indexOf(b)); // Sort by monthOrder

  const uniqueVisitMonth = [
    ...new Set(
      leads
        .filter(
          (lead) =>
           
            lead.visit !== "pending" && 
            lead.visit_date && moment(lead.visit_date, moment.ISO_8601, true).isValid() 
        )
        .map((lead) => moment(lead.visit_date).format("MMMM"))
    ),
  ].sort((a, b) => monthOrder.indexOf(a) - monthOrder.indexOf(b)); // Sort months in order

  const navigate = useNavigate();

  const { id } = useParams();

  // Fetch leads from the API
  useEffect(() => {
    
    fetchEmployees();
    // fetchVisit();
    fetchProjects();
    fetchProjectsUnit();
  }, []);

  useEffect(()=>{
    fetchLeads();
  }, [token])

  const fetchLeads = async () => {
    try {
      const response = await axios.get(

            "https://crmdemo.vimubds5.a2hosted.com/api/leads-super-admin",
            {
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }}
      );
      const data = response.data;
      const sources = data.map(lead => lead.leadSource).filter(source => source);
      setDynamicLeadSources(Array.from(new Set(sources)));
      setLeads(data);
    } catch (error) {
      console.error("Error fetching leads:", error);
    }
  };
 
  const fetchEmployees = async () => {
    try {
      const response = await axios.get("https://crmdemo.vimubds5.a2hosted.com/api/employee-super-admin",
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }});
      setEmployees(response.data);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  const fetchProjects = async () => {
    try {
      const { data } = await axios.get("https://crmdemo.vimubds5.a2hosted.com/api/super-admin-all-project",
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }} );
      setProjects(data);
    } catch (error) {
      console.error("Error fetching projects:", error);
     
    }
  };

  const fetchProjectsUnit = async (main_project_id) => {
    try {
        if (!main_project_id) {
            setProjectUnit([]);  // Reset if no project is selected
            return;
        }

        const response = await axios.get(`https://crmdemo.vimubds5.a2hosted.com/api/super-admin-project-unit/${main_project_id}`,
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
          }});

        if (response.data.length > 0) {
            setProjectUnit(response.data);  // Store fetched unit types
        } else {
            setProjectUnit([]);  // Reset if no units found
        }

    } catch (error) {
        console.error("Error fetching units:", error);
        setProjectUnit([]);  // Reset in case of error
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
      const response = await axios.put(`https://crmdemo.vimubds5.a2hosted.com/api/updateOnlyAnswerRemark`, modalData);
      if (response.status === 200) {
        cogoToast.success("AnswerRemark updated successfully!");
       fetchLeads();
        closeModal(); // Close the modal
      }
    } catch (error) {
      console.error("Error updating AnswerRemark:", error);
    }
  };

  

  const handleSearch = (value) =>{
    if(value === ' '){
      return;
    }
    setSearchTerm(value);
  }

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
        ["name", "leadSource", "phone","assignedTo"].some((key) =>
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
      filtered = filtered.filter((lead) => lead.leadSource === leadSourceFilter);
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
      filtered = filtered.filter((lead) => lead.lead_status === leadStatusFilter);
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
    if (soldunitFilter) {
      filtered = filtered.filter(
        (lead) => lead.unit_status === soldunitFilter    
      );
    }
        // Filter by date range
         if (filterDate) {
          filtered = filtered.filter((lead) => {
            const leadDate = moment(lead.createdTime).format("YYYY-MM-DD");
            return leadDate === filterDate
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
  const totalClosedLeads = applyFilters().filter((lead) => lead.deal_status === "close").length;
  
  // Total Visits
  const totalVisits = applyFilters().filter((lead) =>
    ["fresh", "re-visit", "self", "associative"].includes(lead.visit)
  ).length;
  
 
  
  


  // Use filteredLeads for pagination
  const indexOfLastLead = (currentPage + 1) * leadsPerPage;
  const indexOfFirstLead = indexOfLastLead - leadsPerPage;


  // const currentLeads = filteredLeads.slice(indexOfFirstLead, indexOfLastLead);
  const currentLeads = leadsPerPage === Infinity ? filteredLeads : filteredLeads.slice(indexOfFirstLead, indexOfLastLead);

const pageCount = Math.ceil(filteredLeads.length / leadsPerPage);

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
  if (!currentLead.createdTime) {
    formErrors.createdTime = "Date is required";
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
  if (!currentLead.project_name) {
    formErrors.project_name = "project is required";
    isValid = false;
  }
  if (!currentLead.address) {
    formErrors.address = "Address is required";
    isValid = false;
  }

  setErrors(formErrors);
  return isValid;
};

const handleInputChangelead = (e) => {
  const { name, value } = e.target;
  setCurrentLead((prevLead) => {
    const updatedLead = { ...prevLead, [name]: value };

    // If createdTime changes, update actual_date accordingly
    if (name === "createdTime") {
      updatedLead.actual_date = value; // Copy createdTime to actual_date
    }

    // If assignedTo changes, update employeeId and employeephone accordingly
    if (name === "assignedTo") {
      const selectedEmployee = employees.find(
        (employee) => employee.name === value
      );
      if (selectedEmployee) {
        updatedLead.employeeId = selectedEmployee.employeeId;
        updatedLead.employeephone = selectedEmployee.phone; // Store employee's phone number in employeephone
      } else {
        updatedLead.employeeId = ""; // Reset if no match
        updatedLead.employeephone = ""; // Reset employeephone if no match
      }
    }

     // If project_name changes, find and set project_id
     if (name === "project_name") {
      const selectedProject = projects.find(
          (project) => project.project_name === value
      );

      if (selectedProject) {
          updatedLead.main_project_id = selectedProject.main_project_id;
          fetchProjectsUnit(selectedProject.main_project_id);  // Call API to fetch units

      } else {
          updatedLead.main_project_id = ""; // Reset if no match
          fetchProjectsUnit("");  
      }
  }

   // If unit_type changes, update unit_id accordingly
   if (name === "unit_type") {
    const selectedUnit = projectunit.find(
        (unit) => unit.unit_type === value
    );

    if (selectedUnit) {
        updatedLead.unit_id = selectedUnit.unit_id;
    } else {
        updatedLead.unit_id = ""; // Reset if no match
    }
}

    return updatedLead;
  });
};

const handleCreateClick = () => {
  setIsEditing(false);
  setCurrentLead({
    lead_no: "",
    assignedTo: "",
    employeeId: "",
    employeephone: "",
    name: "",
    phone: "",
    leadSource: "",
    createdTime: "",
    project_name: "",
    address: "",
    actual_date: "",
  });
  setShowPopup(true);
};

const handleCustomLeadSourceChange = (e) => {
  setCustomLeadSource(e.target.value);
};



const saveChanges = async () => {
  if (validateForm()) {
    // Use custom lead source if "Other" is selected
    const leadData = {
      ...currentLead,
      leadSource:
        currentLead.leadSource === "Other"
          ? customLeadSource
          : currentLead.leadSource,
           assignedBy: "Admin"
    };

    try {
      setLoading(true)
      if (isEditing) {
        // Update existing lead
        await axios.put(
          `https://crmdemo.vimubds5.a2hosted.com/api/leads/${currentLead.lead_id}`,
          leadData
        );
        
        fetchLeads(); // Refresh the list
        closePopup();
      }
      else {
        // Create new lead
        await axios.post("https://crmdemo.vimubds5.a2hosted.com/api/leads", leadData);

        // Construct WhatsApp message link with encoded parameters
        const whatsappLink = `https://wa.me/${currentLead.employeephone}?text=Hi%20${currentLead.assignedTo},%20you%20have%20been%20assigned%20a%20new%20lead%20with%20the%20following%20details:%0A%0A1)%20Lead%20No.%20${currentLead.lead_no}%0A2)%20Name:%20${currentLead.name}%0A3)%20Phone%20Number:%20${currentLead.phone}%0A4)%20Lead%20Source:%20${currentLead.leadSource}%0A5)%20Address:%20${currentLead.address}%0A6)%20Project Name:%20${currentLead.project_name}%0A%0APlease%20check%20your%20dashboard%20for%20details.`;

        // Open WhatsApp link in a new tab
        window.open(whatsappLink, "_blank");
        fetchLeads(); // Refresh the list
        closePopup();
      }
      setLoading(false)
    } catch (error) {
      setLoading(false)
      console.error("Error saving lead:", error);
    }
  }
};

const closePopup = () => {
  setShowPopup(false);
  setErrors({});
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
      console.log(lead);
      fetchProjectsUnit(lead.main_project_id)
      setIsEditing(true);
      setCurrentLead({
        ...lead,
        createdTime: moment(lead.createdTime).format("YYYY-MM-DD"), // Format the createdTime
        actual_date: moment(lead.createdTime).format("YYYY-MM-DD"), // Format the createdTime
      });
      setShowPopup(true);
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
      "Online Directories"
    ];

    const [dynamicLeadSources, setDynamicLeadSources] = useState([]);

    const combinedLeadSources = [
      ...new Set([...hardCodedLeadSources, ...dynamicLeadSources])
    ];

    const handleReset = () => {
      window.location.reload();
    };

  return (
    <>
      <MainHeader />
      <SuperAdminSider />
      <Wrapper>
        <div className="container mt-28 2xl:ml-40">
          <div className="main 2xl:w-[89%] ">
            <div>
              <button
                onClick={() => navigate(-1)}
                className="bg-blue-500 text-white px-3 py-1 max-sm:hidden rounded-lg hover:bg-blue-600 transition-colors max-2xl:ml-[4rem]"
              >
                Back
              </button>
              <h1 className="text-xl sm:text-2xl text-center">
                Leads Management{" "}
              </h1>
            </div>
            <div className="mb-4">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 font-medium"
                onClick={handleCreateClick}
              >
                Add Lead
              </button>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-5 mb-4"></div>

            {/* Button to create a new lead */}
            <div className="grid max-sm:grid-cols-2 sm:grid-cols-3  lg:grid-cols-5 gap-4 mb-4">
            <div>
                <label htmlFor="">Search</label>
                <input
                  type="text"
                    placeholder=" Name,Lead Source,Assigned To,Phone No"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`border rounded-2xl p-2 w-full ${
                    searchTerm ? "bg-blue-500 text-white" : "bg-white"
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
                    filterDate ? "bg-blue-500 text-white" : "bg-white"
                   }`}
                />
              </div>
             


           <div>
                <label htmlFor="">Meeting Status</label>
                <select
                  value={meetingStatusFilter}
                  onChange={(e) => setMeetingStatusFilter(e.target.value)}
                  className={`border rounded-2xl p-2 w-full ${
                   meetingStatusFilter ? "bg-blue-500 text-white" : "bg-white"
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
                    leadSourceFilter ? "bg-blue-500 text-white" : "bg-white"
                  }`}
                >
                   <option value="">Select Lead Source</option>
                     <option value="Facebook">Facebook</option>
                    <option value="One Realty Website">
                      One Realty Website
                    </option>
                    <option value="99 Acres">
                    99 Acres
                    </option>
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
                    dealFilter ? "bg-blue-500 text-white" : "bg-white"
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
                    leadStatusFilter ? "bg-blue-500 text-white" : "bg-white"
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
    onChange={(e) => setLeadnotInterestedStatusFilter(e.target.value)}
    className={`border rounded-2xl p-2 w-full ${
      leadnotInterestedStatusFilter ? "bg-blue-500 text-white" : "bg-white"
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
  <label htmlFor="" className=" fw-semibold text-[blue]">Visit Month Filter</label>
  <select
    value={visitmonthFilter}
    onChange={(e) => setVisitMonthFilter(e.target.value)}
    className={`border rounded-2xl p-2 w-full ${
     visitmonthFilter ? "bg-blue-500 text-white" : "bg-white"
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
                    visitFilter ? "bg-blue-500 text-white" : "bg-white"
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
        yearFilter ? "bg-blue-500 text-white" : "bg-white"
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
            monthFilter ? "bg-blue-500 text-white" : "bg-white"
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
                   employeeFilter ? "bg-blue-500 text-white" : "bg-white"
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
                    soldunitFilter ? "bg-blue-500 text-white" : "bg-white"
                  }`}
                >
                  <option value="">All Deal</option>
                  <option value="sold">Sold</option>
               
                </select>
              </div>

              <div><button
      onClick={handleReset}
      className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
    >
      Reset Page
    </button></div>
         
            
            </div>
        
          </div>
         

          <div className="flex gap-10 text-xl font-semibold my-3 mt-5">
  {/* Total Lead Count */}
  <div>
    Total Lead:{" "}
    {
     totalLeads
    }
  </div>

  {/* Total Lead Visits */}
  <div>
    Total Site Visit:{" "}
    {
      totalVisits
    }
  </div>

  {/* Total Closed Leads */}
  <div>
    Total Closed Lead:{" "}
    {
     totalClosedLeads
    }
  </div>
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

          <div className="overflow-x-auto mt-2 2xl:w-[89%]">
        

            <table className="tt min-w-full bg-white border whitespace-nowrap">
              <thead>
                <tr>
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
  <span className="text-blue-900 mx-2">{sortOrder === "desce" ? "▲" : "▼" }</span>
</th>

<th className="px-4 py-2 sm:px-6 sm:py-3 text-xs sm:text-sm border-y-2 border-gray-300 text-left">
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
        <td className="px-6 py-4 border-b border-gray-200 text-gray-800 ">
        {leadsPerPage === Infinity ? index + 1 : index + 1 + currentPage * leadsPerPage}
        </td>
        <td className="px-6 py-4 border-b border-gray-200 text-gray-800 text-wrap font-semibold">
          {lead.project_name}
        </td>
        <td
  className="px-6 py-4 border-b border-gray-200 underline text-[blue] cursor-pointer font-semibold"
  onClick={() => handleRowClick(lead.lead_id)}
>
  {lead.lead_id}
</td>
        <td className="px-6 py-4 border-b border-gray-200 text-gray-800 text-wrap font-semibold">
          {lead.name}
        </td>
        <td className="px-6 py-4 border-b border-gray-200 text-gray-800 font-semibold">
          {lead.phone}
        </td>
        <td className="px-6 py-4 border-b border-gray-200 text-gray-800 font-semibold">
          {lead.leadSource}
        </td>
        <td className="px-6 py-4 border-b border-gray-200 text-gray-800 font-semibold">
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
          <td className="px-6 py-4 border-b border-gray-200 text-gray-800 font-semibold">
                                                      {lead.visit_date === "pending"
                                                        ? "pending"
                                                        : moment(lead.visit_date).format("DD MMM YYYY").toUpperCase()}
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
        <td className="px-6 text-[blue] underline cursor-pointer text-wrap font-semibold"  onClick={() => openModal(lead)}>
          {lead.answer_remark}
          
                         
        </td>
        <td className="px-6 py-4 border-b border-gray-200 text-gray-800 font-semibold">
          {moment(lead.createdTime).format("DD MMM YYYY").toUpperCase()}
        </td>
        <td className="px-6 py-4 border-b border-gray-200 text-gray-800 font-semibold text-nowrap">
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
          <label className="block text-gray-700">Remark Status:</label>
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
          <label className="block text-gray-700">Answer Remarks</label>
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
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 mr-2"
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

          {showPopup && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
              <div className="w-full max-w-md p-6 mx-2 bg-white rounded-lg shadow-lg h-[95%] overflow-y-auto">
                <h2 className="text-xl mb-4">
                  {"Add Lead"}
                </h2>
                <div className="mb-4">
                  <label className="block text-gray-700">Lead Number</label>
                  <input
                    type="number"
                    name="lead_no"
                    value={currentLead.lead_no}
                    onChange={handleInputChangelead}
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
                    onChange={handleInputChangelead}
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
                  <label className="block text-gray-700">Assign Date</label>
                  <input
                    type="date"
                    name="createdTime"
                    value={currentLead.createdTime}
                    onChange={handleInputChangelead}
                    className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-100"
                  />
                  {errors.createdTime && (
                    <span className="text-red-500">{errors.createdTime}</span>
                  )}
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={currentLead.name}
                    onChange={handleInputChangelead}
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
                    type="text"
                    name="phone"
                    value={currentLead.phone}
                    onChange={handleInputChangelead}
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
  value={currentLead.leadSource}
  onChange={handleInputChangelead}
  className="w-full p-2 border rounded"
>
  <option value="">Select Lead Source</option>
  {combinedLeadSources.map(source => (
    <option key={source} value={source}>
      {source}
    </option>
  ))}
  <option value="Other">Other</option>
</select>
{currentLead.leadSource === "Other" && (
  <input
    type="text"
    value={customLeadSource}
    onChange={handleCustomLeadSourceChange}
    placeholder="Enter custom lead source"
    className="mt-2 w-full px-3 py-2 border border-gray-300 rounded"
  />
)}
                  
                  {errors.leadSource && (
                    <p className="text-red-500 text-xs">{errors.leadSource}</p>
                  )}
                </div>

                

                <div className="mb-4">
                  <label className="block text-gray-700">Project Name</label>
                  <select
                    name="project_name"
                    value={currentLead.project_name}
                    onChange={handleInputChangelead}
                    className={`w-full px-3 py-2 border ${
                      errors.project_name ? "border-red-500" : "border-gray-300"
                    } rounded`}
                  >
                    <option value="">Select Project Name </option>
                    {projects.map((project) => (
                      <option key={project.project_id} value={project.project_name}>
                        {project.project_name}
                      </option>
                    ))}
                  </select>
                  {errors.project_name && (
                    <span className="text-red-500">{errors.project_name}</span>
                  )}
                </div>
                {currentLead.main_project_id && (
    projectunit.length > 0  ? (
        <div className="mb-4">
            <label className="block text-gray-700">Unit Type</label>
            <select
                name="unit_type"
                id="unit_type"
                value={currentLead.unit_type}
                onChange={handleInputChangelead}
                className={`w-full px-3 py-2 border ${
                    errors.unit_type ? "border-red-500" : "border-gray-300"
                } rounded`}
            >
                <option value="">Select Unit Type</option>
                {projectunit.map((unit) => (
                    <option key={unit.unit_id} value={unit.unit_type}>
                        {unit.unit_type}
                    </option>
                ))}
            </select>
            {errors.unit_type && (
                <span className="text-red-500">{errors.unit_type}</span>
            )}
        </div>
    ) : (
        <p className="text-red-500 text-sm">Unit not set for this project.</p>
    )
)}

{/* Hidden unit_id field */}
<input
                  type="hidden"
                  id="unit_id"
                  name="unit_id"
                  value={currentLead.unit_id}
                />



                <div className="mb-4">
                  <label className="block text-gray-700">Address</label>
                  <input
                    type="text"
                    name="address"
                    value={currentLead.address}
                    onChange={handleInputChangelead}
                    className={`w-full px-3 py-2 border ${
                      errors.address ? "border-red-500" : "border-gray-300"
                    } rounded`}
                  />
                  {errors.address && (
                    <span className="text-red-500">{errors.address}</span>
                  )}
                </div>

                <div className="flex justify-end">
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 mr-2"
                    onClick={saveChanges} disabled = {loading}
                  >
                       {loading ? 'Save...' : 'Save'}
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


        </div>
{isModalOpenLeadProfile && selectedLeadId && (
       <div className=" fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-[1055]">
              <div className="w-75 bg-white p-6 rounded-lg shadow-lg max-h-[80vh] overflow-auto mx-4 my-5">
     
              <Super_Single_Lead_Profile id={selectedLeadId} closeModalLead={closeModalLead} />
            
    </div>
  </div>
)}
      </Wrapper>
    </>
  );
}

export default SuperEmployeeLeads;

const Wrapper = styled.div`

`;
