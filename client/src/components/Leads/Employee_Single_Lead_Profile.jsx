import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import img from "../../images/lead_profile.png";
import MainHeader from "../MainHeader";
import EmployeeeSider from "../EmployeeModule/EmployeeSider";
import Sider from "../Sider";
import cogoToast from "cogo-toast";
import UpdateLeadField from "../EmployeeModule/updateLeadField";
import { useSelector } from "react-redux";
function Employee_Single_Lead_Profile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [leads, setLeads] = useState([]);
  const [loading , setLoading] = useState(false)
  const [visit, setVisit] = useState([]);
  const [unitdata, setUnitData] = useState([]);
  const [unitemployeesolddata, setUnitEmployeeSoldData] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [showPopupVisit, setShowPopupVisit] = useState(false);
  const [showPopupUnitSold, setShowPopupUnitSold] = useState(false);
  const [showPopupFollowUp, setShowPopupFollowUp] = useState(false);
  const [showPopupRemark, setShowPopupRemark] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [render, setRender] = useState(false);
  const [isOtherReason, setIsOtherReason] = useState(false);
  
  const [currentLead, setCurrentLead] = useState({
    lead_status: "",
    visit_date: "",
    visit: "",
    quotation_status: "",
    // invoice_status: "",
    deal_status: "",
    meeting_status: "",
    booking_amount:"",
      payment_mode:"",
      registry:"",
    reason: "",
  


    follow_up_status: "",
  });

  const [visitLead, setVisitLead] = useState({
    project_name: "",
    lead_id: "",
    name: "",
    employeeId: "",
    employee_name: "",
    visit: "",
    visit_date: "", 

  });

  const [follow_up, setFollow_Up] = useState({
    
    lead_id: "",
    name: "",
    employeeId: "",
    employee_name: "",
    follow_up_type: "",
    follow_up_date: "", 
    report:""

  });


const [remark, setRemark] = useState({
  lead_id: "",
  name: "",
  employee_name: "",
  employeeId: "",
  remark_status: "",
  
  date: "",
});
const [unitsold, setUnitSold] = useState({
  lead_id: "",
  name: "",
  employee_name: "",
  employeeId: "",
  unit_no: "",
  unit_id:"",
  unit_status:"",
  main_project_id:"",
  date: "",
});

const EmpId = useSelector((state) => state.auth.user);

const token = EmpId?.token;

  const [quotationCreated, setQuotationCreated] = useState(false);
  const [visitCreated, setVisitCreated] = useState(false);
  const [followCreated, setFollowCreated] = useState(false);
  const [employeeunitsoldCreated, setemployeeunitsoldCreated] = useState(false);
  const [remarkCreated, setRemarkCreated] = useState(false);
 
  // const leads = [{ /* lead data */ }];

  const fieldConfig = [
    {
      name: "lead_status",
      label: "Lead Status",
      type: "select",
      options: [
        { value: "", label: "Select Lead Status" },
        { value: "pending", label: "Pending" },
        { value: "active lead", label: "Active lead" },
       
        { value: "calling done", label: "Calling Done" },
        { value: "site visit done", label: "Site Visit Done" },
        { value: "interested", label: "Interested" },
        { value: "not-interested", label: "Not-Interested" },
        { value: "completed", label: "Completed" },
      ],
    },

    {
      name: "deal_status",
      label: "Deal Status",
      type: "select",
      options: [
        { value: "", label: "Select Deal Status" },
        { value: "pending", label: "Pending" },
        { value: "close", label: "Close" },
        { value: "cancelled", label: "Cancelled" },
      
      ],
    },
    {
      name: "meeting_status",
      label: "Meeting_Status",
      type: "select",
      options: [
        { value: "", label: "Select Deal Status" },
        { value: "pending", label: "Pending" },
        { value: "done by manager", label: "Done By Manager" },
        { value: "done by director", label: "Done By Director" },
     
      
      ],
    },
    {
      name: "d_closeDate",
      label: "Deal Close Date",
      type: "date", // Changed to "date" for consistency
    },


      {
        name: "reason",
        label: "Reason",
        type: "select",
        options: [
          { value: "", label: "Select Reason" },
          { value: "pending", label: "Pending" },
          { value: "price", label: "Price" },
          { value: "budget", label: "Budget" },
          { value: "distance", label: "Distance" },
          { value: "other", label: "Other" }, // Add "Other" option
        ],
      },
    
   

    {
      name: "follow_up_status",
      label: "Follow Up Status",
      type: "select",
      options: [
        { value: "", label: "Select Follow Up Status" },
        { value: "pending", label: "Pending" },
        { value: "in progress", label: "In Progress" },
        { value: "done", label: "Done" },
      ],
    },
   
    {
      name: "booking_amount",
      label: "Booking Amount",
      type: "text", 
    },
  
   
      {
        name: "payment_mode",
        label: "Payment Mode",
        type: "select",
        options: [
          { value: "", label: "Select Payment Mode" },
          { value: "pending", label: "Pending" },
          { value: "credit-card", label: "Credit Card" },
          { value: "debit-card", label: "Debit Card" },
          { value: "net-banking", label: "Net Banking" },
          { value: "upi", label: "UPI" },
          { value: "cash", label: "Cash" },
        ],
      },
   
      {
        name: "registry",
        label: "Registry",
        type: "select",
        options: [
          { value: "", label: "Select Payment Mode" },
          { value: "pending", label: "Pending" },
          { value: "in progress", label: "In Progress" },
          { value: "done", label: "Done" },
         
        ],
      },
  ];

  
  useEffect(() => {
    fetchLeads();
    fetchVisit();
    fetchFollowUp();
    fetchRemark();
   
  }, [id]);
  useEffect(() => {
    fetchUnitdata();
    fetchUnitSoldEmployee();
   
  }, [leads[0]]);


  const fetchLeads = async () => {
    try {
      const response = await axios.get(`https://crmdemo.vimubds5.a2hosted.com/api/leads-employee/${id}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }});
      console.log(response.data);
      setLeads(response.data);

      // Debugging: Log the exact value of the quotation field
      response.data.forEach((lead) => {
        console.log("Lead Quotation Status (raw):", lead.quotation);
      });

      // Ensure proper comparison with 'Created', trim any spaces and normalize the case
      const hasCreatedQuotation = response.data.some(
        (lead) =>
          lead.quotation && lead.quotation.trim().toLowerCase() === "created"
      );

      console.log(
        "Has created quotation (normalized check)?",
        hasCreatedQuotation
      ); // Debugging
      setQuotationCreated(hasCreatedQuotation);
    } catch (error) {
      console.error("Error fetching quotations:", error);
    }
  };






  const fetchVisit = async () => {
    try {
      const response = await axios.get(
        `https://crmdemo.vimubds5.a2hosted.com/api/employe-visit/${id}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }}
      );
      console.log(response.data);
      setVisit(response.data);
      // Ensure proper comparison with 'Created', trim any spaces and normalize the case
      const hasCreatedvisit = response.data.some(
        (lead) =>
          (lead.visit && lead.visit.trim().toLowerCase() === "fresh") ||
          "repeated"
      );
      setVisitCreated(hasCreatedvisit);
    } catch (error) {
      console.error("Error fetching quotations:", error);
    }
  };

  const fetchFollowUp = async () => {
    try {
      const response = await axios.get(
        `https://crmdemo.vimubds5.a2hosted.com/api/employe-follow-up/${id}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }}
      );

      setFollow_Up(response.data);
      // Ensure proper comparison with 'Created', trim any spaces and normalize the case
      setFollowCreated(response.data[0]);
    } catch (error) {
      console.error("Error fetching quotations:", error);
    }
  };
  const fetchUnitSoldEmployee = async () => {
    try {
      const response = await axios.get(
        `https://crmdemo.vimubds5.a2hosted.com/api/unit-sold-lead-id/${leads[0].lead_id}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }}
       
      );

      setUnitEmployeeSoldData(response.data);
      // Ensure proper comparison with 'Created', trim any spaces and normalize the case
      setemployeeunitsoldCreated(response.data[0]);
    } catch (error) {
      console.error("Error fetching quotations:", error);
    }
  };
  
  const fetchRemark = async () => {
    try {
      const response = await axios.get(
        `https://crmdemo.vimubds5.a2hosted.com/api/remarks/${id}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }}
      );
      console.log(response.data);
      setRemark(response.data[0]);
      setRemarkCreated(response.data.length > 0); // Check if remarks exist
    } catch (error) {
      console.error("Error fetching remarks:", error);
    }
  };
  
  const fetchUnitdata = async () => {
    
    try {
      const response = await axios.get(`https://crmdemo.vimubds5.a2hosted.com/api/unit-data/${leads[0].unit_id}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }});
      setUnitData(response.data);
      console.log(unitdata);
      
    } catch (error) {
      console.error("Error fetching Unit Data:", error);
    }
  };
  const handleBackClick = () => {
    navigate(-1); // -1 navigates to the previous page in history
  };

  const handleQuotation = async (lead) => {
    const name = lead.name;
    navigate(`/quotation-by-lead/${lead.lead_id}`, { state: { name } });
  };

  const handleViewQuotation = (lead) => {
    console.log("Lead Object:", lead); // Log the lead object
    const name = lead.name;
    console.log("Lead Name:", name); // Log the name
    navigate(`/View_quotations/${lead.lead_id}`);
    // navigate("/View_quotations");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentLead((prevState) => ({ ...prevState, [name]: value }));
  
    if (name === "reason") {
      // Check if "Other" is selected
      setIsOtherReason(value === "other");
      if (value !== "other") {
        setCurrentLead((prevState) => ({ ...prevState, customReason: "" })); // Clear custom reason if not "Other"
      }
    }
  };

  const handleInputChangeVisit = (e) => {
    const { name, value } = e.target;
    setVisitLead((prevLead) => ({
      ...prevLead,
      [name]: value,
    }));
  };
  const handleInputChangeUnitSold = (e) => {
    const { name, value } = e.target;
    setUnitSold((prevLead) => ({
      ...prevLead,
      [name]: value,
    }));
  };

  const handleInputChangeFollowUp = (e) => {
    const { name, value } = e.target;
    setFollow_Up((prevLead) => ({
      ...prevLead,
      [name]: value,
    }));
  };

  const handleInputChangeRemark = (e) => {
    const { name, value } = e.target;
    setRemark((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  
  const handleUpdate = (lead) => {
    setIsEditing(true);
    setCurrentLead(lead);
    console.log(lead);
    
    setShowPopup(true);
  };

  const handleCreateClick = () => {
    setVisitLead({
      project_name: "",
      lead_id: "",
      name: "",
      employeeId: "",
      employee_name: "",
      visit: "",
      visit_date: "",
    });
    setShowPopupVisit(true);
  };

  const handleCreateClickFollowUp = () => {
    setFollow_Up({
      lead_id: "",
      name: "",
      employeeId: "",
      employee_name: "",
      follow_up_type: "",
      follow_up_date: "", 
      report:""

    });
    setShowPopupFollowUp(true);
  };

  const handleCreateClickRemark = () => {
    setRemark({
      lead_id: "",
      name: "",
      employee_name: "",
      employeeId: "",
      remark_status: "",
      
      date: "",
    }); // Reset remark state
    setShowPopupRemark(true); // Open the popup for creating a remark
  };
  const handleCreateClickUnit = () => {

  
    setRemark({
      lead_id: "",
      name: "",
      employee_name: "",
      employeeId: "",
      unit_no: "",
      unit_id:"",
      unit_status:"",
      main_project_id:"",
      date: "",
    }); // Reset remark state
    fetchUnitdata()
    setShowPopupUnitSold(true); // Open the popup for creating a remark

  };
  
  const handleViewVisit = () => {
    navigate(`/view_visit/${leads[0].lead_id}`);
    console.log(leads[0].lead_id);
    
  };
  const handleViewEmployeeUnitSold = () => {
    navigate(`/view_unit_sold/${leads[0].lead_id}`);
    console.log(leads[0].employeeId);
    
  };

  const handleViewFollowUp = () => {
    navigate(`/view_follow_up/${leads[0].lead_id}`);
  };
  
  const handleViewRemark = () => {
    navigate(`/view_remark/${leads[0].lead_id}`);
  };

  const saveChanges = async () => {
    console.log(currentLead);
   

   
    
    const leadData = {
      ...currentLead,
      reason: isOtherReason  ? currentLead.customReason || leads[0]?.reason 
      : currentLead.reason // Use the default value if untouched
    };
    try {
      if (currentLead.deal_status == 'close') {
        if (currentLead.d_closeDate === "pending") {
          alert("Please update the deal close date as well");
          return;
        }
      }
      if (currentLead.lead_status == 'not-interested') {
        if (currentLead.reason === "pending" || currentLead.customReason === currentLead.reason) {
          alert("Please update the reason as well");
          return;
        }
      }
      setLoading(true)
      // Send updated data to the backend using Axios
      const response = await axios.put(
        `https://crmdemo.vimubds5.a2hosted.com/api/updateLeadStatus/${currentLead.lead_id}`,
        leadData
      );

      if (response.status === 200) {
        console.log("Updated successfully:", response.data);
        cogoToast.success("Lead status updated successfully");
        setRender(!render);
        closePopup(); // Close the popup on success
        fetchLeads();
        setLoading(false)
      } else {
        console.error("Error updating:", response.data);
        setLoading(false)
        cogoToast.error({ general: "Failed to update the lead status." });
      }
    } catch (error) {
      console.error("Request failed:", error);
      setLoading(false)
      cogoToast.error("Failed to update the lead status.");
    }
  };
  
  const saveVisit = async () => {
    // Validate required fields
    if (!visitLead.visit) {
      cogoToast.error("Please select a visit type.");
      return;
    }
    if (!visitLead.visit_date) {
      cogoToast.error("Please select a visit date.");
      return;
    }
  
    console.log("Visit data:", visitLead);
    setLoading(true)
    try {
      // First API call: Create a visit
      const response = await axios.post(
        `https://crmdemo.vimubds5.a2hosted.com/api/employe-visit`,
        {
          project_name: leads[0].project_name,
          lead_id: leads[0].lead_id,
          name: leads[0].name,
          employeeId: leads[0].employeeId,
          employee_name: leads[0].assignedTo,
          visit: visitLead.visit,
          visit_date: visitLead.visit_date,
        }
      );
  
      if (response.status === 201) {
        console.log("Visit created successfully:", response.data);
        cogoToast.success("Visit created successfully");
  
        // Second API call: Update visit status
        const updateResponse = await axios.put(
          `https://crmdemo.vimubds5.a2hosted.com/api/updateVisitStatus/${leads[0].lead_id}`,
          { visit: visitLead.visit,visit_date:visitLead.visit_date  }
        );
  
        if (updateResponse.status === 200) {
          console.log("Visit status updated successfully:", updateResponse.data);
          cogoToast.success("Visit status updated successfully");
        } else {
          console.error("Error updating visit status:", updateResponse.data);
          cogoToast.error("Failed to update visit status.");
          return; // Exit if this step fails
        }
  
        // Third API call: Update lead status
        const updateLeadStatusResponse = await axios.put(
          `https://crmdemo.vimubds5.a2hosted.com/api/updateOnlyLeadStatus/${leads[0].lead_id}`,
          { lead_status: "site visit done" }
        );
  
        if (updateLeadStatusResponse.status === 200) {
          console.log(
            "Lead status updated successfully:",
            updateLeadStatusResponse.data
          );
          cogoToast.success("Lead status updated successfully");
        } else {
          console.error(
            "Error updating lead status:",
            updateLeadStatusResponse.data
          );
          cogoToast.error("Failed to update lead status.");
          return; // Exit if this step fails
        }
  
        // Close popup and refresh data after all calls are successful
        closePopupVisit();
        fetchVisit();
        fetchLeads();
        setLoading(false)
      } else {
        console.error("Error creating visit:", response.data);
        cogoToast.error("Failed to create visit.");
        setLoading(false)
      }
    } catch (error) {
      console.error("Request failed:", error);
      setLoading(false)
      cogoToast.error("An error occurred while processing your request.");
    }
  };
  
  // Validate required fields
  // if (!follow_up.follow_up_type) {
  //   cogoToast.error("Please select a follow up type.");
  //   return;
  // }
  // if (!follow_up.follow_up_date) {
  //   cogoToast.error("Please select a follow up date.");
  //   return;
  // }
 
  const saveFollowUp = async () => {
    console.log(follow_up);
    if (!follow_up.follow_up_type) {
      cogoToast.error("Please select a follow up type.");
      return;
    }
    if (!follow_up.follow_up_date) {
      cogoToast.error("Please select a folllow up date.");
      return;
    }
    if (!follow_up.report) {
      cogoToast.error("Please Enter a report.");
      return;
    }
    setLoading(true)
    try {
      // Send updated data to the backend using Axios
      const response = await axios.post(
        `https://crmdemo.vimubds5.a2hosted.com/api/employe-follow-up`,
        {
          project_name: leads[0].project_name,
          lead_id: leads[0].lead_id,
          name: leads[0].name,
          employeeId: leads[0].employeeId,
          employee_name: leads[0].assignedTo,
          follow_up_type: follow_up.follow_up_type,
          follow_up_date: follow_up.follow_up_date,
          report: follow_up.report
        }
      );
  
      if (response.status === 201) {
        console.log("Follow-up created successfully:", response.data);
        cogoToast.success("Follow-up created successfully");
  
        // Update the Follow Up status after saving the Follow Up
        const putResponse = await axios.put(
          `https://crmdemo.vimubds5.a2hosted.com/api/updateOnlyFollowUpStatus/${leads[0].lead_id}`,
          { follow_up_status: "in progress" }
        );
  
        if (putResponse.status === 200) {
          console.log("Status updated successfully:", putResponse.data);
        } else {
          console.error("Error updating status:", putResponse.data);
          cogoToast.error("Failed to update the lead status.");
        }
  
        // Close the popup on success
        closePopupFollowUp();
        fetchFollowUp();
        fetchLeads();
        setLoading(false)
      } else {
        console.error("Error creating follow-up:", response.data);
        cogoToast.error("Failed to create follow-up.");
        setLoading(false)

      }
    } catch (error) {
      console.error("Request failed:", error);
      cogoToast.error("Failed to create follow-up.");
      setLoading(false)
    }
  };
  
  const saveRemark = async () => {
    if (!remark.remark_status) {
      cogoToast.error("Please select a remark status.");
      return;
    }
  
    if (!remark.date) {
      cogoToast.error("Please select a date.");
      return;
    }
    setLoading(true)
    try {

        const response = await axios.post(`https://crmdemo.vimubds5.a2hosted.com/api/remarks`,
        {
          project_name: leads[0].project_name,
          lead_id: leads[0].lead_id,
          name: leads[0].name,
          employee_name: leads[0].assignedTo,
          employeeId: leads[0].employeeId,
          remark_status: remark.remark_status,
          date: remark.date,
        }
      );
  
      if (response.status === 200) {
        cogoToast.success("Remark created and lead updated successfully");
        closePopupRemark();
        fetchRemark();
        fetchLeads();
        setLoading(false)
      } else {
        setLoading(false)
        cogoToast.error("Failed to create remark and update lead.");
      }
    } catch (error) {
      console.error("Request failed:", error);
      setLoading(false)
      cogoToast.error("Failed to create remark and update lead.");
    }
  };
  const saveUnitSold = async () => {
    if (!unitsold.unit_status) {
      cogoToast.error("Please select a unitsold status.");
      return;
    }
  
    if (!unitsold.date) {
      cogoToast.error("Please select a date.");
      return;
    }
    setLoading(true)
    try {

        const response = await axios.post(`https://crmdemo.vimubds5.a2hosted.com/api/unit-sold`,
        {
          project_name: leads[0].project_name,
          main_project_id: leads[0].main_project_id,
          lead_id: leads[0].lead_id,
          name: leads[0].name,
          employee_name: leads[0].assignedTo,
          employeeId: leads[0].employeeId,
          unit_id: leads[0].unit_id,
          unit_no: unitsold.unit_no,
          unit_status: unitsold.unit_status,
          date: unitsold.date,
        }
      );
  
      if (response.status === 201) {

        const putResponse = await axios.put(
          `https://crmdemo.vimubds5.a2hosted.com/api/unit-data/${unitsold.unit_no}`,
          { unit_status: unitsold.unit_status }
        );
  
        if (putResponse.status === 200) {
          console.log("Unit Status updated successfully:", putResponse.data);
        } else {
          console.error("Error updating Unit Status:", putResponse.data);
          setLoading(false)
          cogoToast.error("Failed to update the lead Unit Status.");
        }
        const putResponseUnit = await axios.put(
          `https://crmdemo.vimubds5.a2hosted.com/api/updateOnlyUnitStatus/${leads[0].lead_id}`,
          { unit_number: unitsold.unit_no,unit_status: unitsold.unit_status }
        );
  
        if (putResponseUnit.status === 200) {
          console.log("Unit of Lead Status updated successfully:", putResponseUnit.data);
        } else {
          console.error("Error updating Unit Status:", putResponseUnit.data);
          setLoading(false)
          cogoToast.error("Failed to update the lead Unit Status.");
        }


        cogoToast.success("UnitSold Save successfully");
        closePopupUnitSold();
        fetchUnitdata();
        fetchLeads();
        fetchUnitSoldEmployee();
        setLoading(false)
      } 
    } catch (error) {
      console.error("Request failed:", error);
      setLoading(false)
      cogoToast.error("Failed to Save Error.");
    }
  };
  
  const closePopup = () => {
    setShowPopup(false);
  };

  const closePopupVisit = () => {
    setShowPopupVisit(false);
  };
  const closePopupUnitSold = () => {
    setShowPopupUnitSold(false);
  };

  const closePopupFollowUp = () => {
    setShowPopupFollowUp(false);
  };

  const closePopupRemark = () => {
    setShowPopupRemark(false); 
   
  };
  // console.log(leads[0].project_name);
  
  const totalVisit = visit.length;
console.log(totalVisit);

// This is for not select future date
const today = new Date().toISOString().split('T')[0];

  return (
    <>
      <MainHeader />
      <EmployeeeSider />
      <div className="flex flex-col 2xl:ml-44 mt-2">
     
        <div className="container mt-5 px-2 mx-auto p-4">
          <div className="mt-5">
          <button
                onClick={() => navigate(-1)}
                className="bg-blue-500 text-white px-3 py-1 max-sm:hidden rounded-lg hover:bg-blue-600 transition-colors max-2xl:ml-[4rem]"
              >
                Back
              </button></div>
          <h1 className="text-2xl text-center mt-[2rem]">Leads Profile</h1>
          <div className="mx-auto h-[3px] w-16 bg-[#34495E] my-3"></div>
          <div className="flex flex-wrap mb-4">
            <div className="w-full lg:w-1/3">
              <img src={img} alt="doctor-profile" className=" rounded-lg" />
            </div>
            {leads.map((lead, index) => (
              <div className="w-full lg:w-2/3 ">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="text-info">Lead Number</label>
                    <div className="p-2 bg-gray-100 rounded">
                      <p className="m-0">{lead.lead_no}</p>
                    </div>
                  </div>

                  <div>
                    <label className="text-info">Name</label>
                    <div className="p-2 bg-gray-100 rounded">
                      <p className="m-0 break-words">{lead.name}</p>
                    </div>
                  </div>

                  <div>
                    <label className="text-info">Assigned To</label>
                    <div className="p-2 bg-gray-100 rounded">
                      <p className="m-0">{lead.assignedTo}</p>
                    </div>
                  </div>

                  <div>
                    <label className="text-info">Mobile Number</label>
                    <div className="p-2 bg-gray-100 rounded">
                      <p className="m-0">{lead.phone}</p>
                    </div>
                  </div>

                  <div>
                    <label className="text-info">Lead Source</label>
                    <div className="p-2 bg-gray-100 rounded">
                      <p className="m-0">{lead.leadSource}</p>
                    </div>
                  </div>
                  <div>
                    <label className="text-info">Project Name</label>
                    <div className="p-2 bg-gray-100 rounded">
                      <p className="m-0">{lead.project_name}</p>
                    </div>
                  </div>
                  <div>
                    <label className="text-info">Lead Status</label>
                    <div className="p-2 bg-gray-100 rounded">
                      <p className="m-0">{lead.lead_status}</p>
                    </div>
                  </div>

                  <div>
                    <label className="text-info"> Date</label>
                    <div className="p-2 bg-gray-100 rounded">
                      <p className="m-0">
                     
                        {moment(lead.createdTime).format("DD MMM YYYY").toUpperCase()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap justify-between gap-4 p-4">
  {/* Left Section for Creation Buttons */}
  <div className="flex flex-wrap gap-2">

    <button
      className="bg-orange-500 text-white px-4 py-2 rounded w-full sm:w-auto"
      onClick={handleCreateClick}
    >
      Visit Creation
    </button>
    <button
      className="bg-yellow-500 text-white px-4 py-2 rounded w-full sm:w-auto"
      onClick={handleCreateClickFollowUp}
    >
      Follow Up Creation
    </button>
    <button
      className="bg-purple-500 text-white px-4 py-2 rounded w-full sm:w-auto"
      onClick={handleCreateClickRemark}
    >
      Remark Creation
    </button>
    <button
      className="bg-blue-500 text-white px-4 py-2 rounded w-full sm:w-auto"
      onClick={handleCreateClickUnit}
    >
      Unit Sold Creation
    </button>

       
  </div>

  {/* Right Section for View Buttons */}
  <div className="flex flex-wrap gap-2">
    {/* Quotation */}
    
    {/* Visit */}

    {visitCreated ? (
      <button
        onClick={handleViewVisit}
        className="bg-green-500 text-white px-4 py-2 rounded w-full sm:w-auto"
      >
        View Visit
      </button>
    ) : (
      <p className="text-white bg-red-400 text-center px-4 py-2 rounded w-full sm:w-auto">
        Visit not yet created
      </p>
    )}

    {/* Follow Up */}
    {followCreated ? (
      <button
        onClick={handleViewFollowUp}
        className="bg-yellow-500 text-white px-4 py-2 rounded w-full sm:w-auto"
      >
        View Follow Up
      </button>
    ) : (
      <p className="text-white bg-red-400 text-center px-4 py-2 rounded w-full sm:w-auto">
        Follow Up not yet created
      </p>
    )}

    {/* Remark */}
    {remarkCreated ? (
      <button
        onClick={handleViewRemark}
        className="bg-purple-500 text-white px-4 py-2 rounded w-full sm:w-auto"
      >
        View Remark
      </button>
    ) : (
      <p className="text-white bg-red-400 text-center px-4 py-2 rounded w-full sm:w-auto">
        Remark not yet created
      </p>
    )}

    {employeeunitsoldCreated ? (
      <button
        onClick={handleViewEmployeeUnitSold}
        className="bg-blue-500 text-white px-4 py-2 rounded w-full sm:w-auto"
      >
        View Unit Sold
      </button>
    ) : (
      <p className="text-white bg-red-400 text-center px-4 py-2 rounded w-full sm:w-auto">
        Unit not yet sold
      </p>
    )}

  </div>
</div>


          <div className="overflow-x-auto mt-1">
          <table className="min-w-full whitespace-nowrap bg-white border">
  <thead>
    <tr>
      <th className="px-6 py-3 border-b-2 border-gray-300">Lead Number</th>
      <th className="px-6 py-3 border-b-2 border-gray-300">Assigned To</th>
      <th className="px-6 py-3 border-b-2 border-gray-300">Name</th>
      <th className="px-6 py-3 border-b-2 border-gray-300">Phone</th>
      <th className="px-6 py-3 border-b-2 border-gray-300">Lead Source</th>
      <th className="px-6 py-3 border-b-2 border-gray-300">Remark Status</th>
      <th className="px-6 py-3 border-b-2 border-gray-300">Answer Remark</th>
      <th className="px-6 py-3 border-b-2 border-gray-300">Meeting Status</th>
      <th className="px-6 py-3 border-b-2 border-gray-300">Assigned By</th>
      <th className="px-6 py-3 border-b-2 border-gray-300">Lead Status</th>
      <th className="px-6 py-3 border-b-2 border-gray-300">Address</th>
      <th className="px-6 py-3 border-b-2 border-gray-300">Booking Amount</th>
      <th className="px-6 py-3 border-b-2 border-gray-300">Deal Status</th>
      <th className="px-6 py-3 border-b-2 border-gray-300">Employee ID</th>
      <th className="px-6 py-3 border-b-2 border-gray-300">Follow-Up Status</th>
      <th className="px-6 py-3 border-b-2 border-gray-300">Payment Mode</th>

      <th className="px-6 py-3 border-b-2 border-gray-300">Reason</th>
      <th className="px-6 py-3 border-b-2 border-gray-300">Registry</th>
    
      <th className="px-6 py-3 border-b-2 border-gray-300">Project Name</th>
      <th className="px-6 py-3 border-b-2 border-gray-300">Project Id</th>
      <th className="px-6 py-3 border-b-2 border-gray-300">Unit Type</th>

      <th className="px-6 py-3 border-b-2 border-gray-300">Unit Number</th>
      <th className="px-6 py-3 border-b-2 border-gray-300">Unit Status</th>
      <th className="px-6 py-3 border-b-2 border-gray-300">Visit</th>
      <th className="px-6 py-3 border-b-2 border-gray-300">Visit Date</th>
      <th className="px-6 py-3 border-b-2 border-gray-300">Close Date</th>
      <th className="px-6 py-3 border-b-2 border-gray-300">Assigned Date</th>
      <th className="px-6 py-3 border-b-2 border-gray-300">Actual Date</th>
      <th className="px-6 py-3 border-b-2 border-gray-300">Action</th>
    </tr>
  </thead>
  <tbody>
  {leads.map((lead, index) => (
  <tr key={lead.id} className={index % 2 === 0 ? "bg-gray-100" : ""}>
    <td className="px-6 py-4 border-b border-gray-200 text-gray-800">{lead.lead_no}</td>
    <td className="px-6 py-4 border-b border-gray-200 text-gray-800">{lead.assignedTo}</td>
    <td className="px-6 py-4 border-b border-gray-200 text-gray-800">{lead.name}</td>
    <td className="px-6 py-4 border-b border-gray-200 text-gray-800">{lead.phone}</td>
    <td className="px-6 py-4 border-b border-gray-200 text-gray-800">{lead.leadSource}</td>
    <td className="px-6 py-4 border-b border-gray-200 text-gray-800">{lead.remark_status}</td>
    <td className="px-6 py-4 border-b border-gray-200 text-gray-800">{lead.answer_remark}</td>
    <td className="px-6 py-4 border-b border-gray-200 text-gray-800">{lead.meeting_status}</td>
    <td className="px-6 py-4 border-b border-gray-200 text-gray-800">{lead.assignedBy}</td>
    <td className="px-6 py-4 border-b border-gray-200 text-gray-800">{lead.lead_status}</td>
    <td className="px-6 py-4 border-b border-gray-200 text-gray-800">{lead.address}</td>
    <td className="px-6 py-4 border-b border-gray-200 text-gray-800">{lead.booking_amount}</td>
    <td className="px-6 py-4 border-b border-gray-200 text-gray-800">{lead.deal_status}</td>
    <td className="px-6 py-4 border-b border-gray-200 text-gray-800">{lead.employeeId}</td>
    <td className="px-6 py-4 border-b border-gray-200 text-gray-800">{lead.follow_up_status}</td>
    <td className="px-6 py-4 border-b border-gray-200 text-gray-800">{lead.payment_mode}</td>

    <td className="px-6 py-4 border-b border-gray-200 text-gray-800">{lead.reason}</td>
    <td className="px-6 py-4 border-b border-gray-200 text-gray-800">{lead.registry}</td>

    <td className="px-6 py-4 border-b border-gray-200 text-gray-800">{lead.project_name}</td>
    <td className="px-6 py-4 border-b border-gray-200 text-gray-800">{lead.main_project_id}</td>
    <td className="px-6 py-4 border-b border-gray-200 text-gray-800">{lead.unit_type}</td>

    <td className="px-6 py-4 border-b border-gray-200 text-gray-800">{lead.unit_number}</td>
    <td className="px-6 py-4 border-b border-gray-200 text-gray-800">{lead.unit_status}</td>
    <td className="px-6 py-4 border-b border-gray-200 text-gray-800">{lead.visit}</td>
    <td className="px-6 py-4 border-b border-gray-200 text-gray-800 ">
                                             {lead.visit_date === "pending"
                                               ? "pending"
                                               : moment(lead.visit_date).format("DD MMM YYYY").toUpperCase()}
                                           </td>
    <td className="px-6 py-4 border-b border-gray-200 font-semibold text-gray-800">
      {lead.d_closeDate === "pending"
        ? "pending"
        : moment(lead.d_closeDate).format("DD MMM YYYY").toUpperCase()}
    </td>
    <td className="px-6 py-4 border-b border-gray-200 text-gray-800">
      {lead.createdTime
        ? moment(lead.createdTime).format("DD MMM YYYY").toUpperCase()
        : "N/A"}
    </td>
    <td className="px-6 py-4 border-b border-gray-200 text-gray-800">
      {lead.actual_date
        ? moment(lead.actual_date).format("DD MMM YYYY").toUpperCase()
        : "N/A"}
    </td>
    <td className="px-6 py-4 border-b border-gray-200">
      <button
        className="text-blue-500 hover:text-blue-700"
        onClick={() => handleUpdate(lead)}
      >
        Update
      </button>
    </td>
  </tr>
))}

  </tbody>
</table>

          </div>

          {showPopup && (
            <div className=" fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
              <div className="w-75 bg-white p-6 rounded-lg shadow-lg max-h-[80vh] overflow-auto mx-4 my-5">
                <h2 className="text-xl font-semibold mb-4">
                  {isEditing ? "Update Status" : ""}
                </h2>

                {/* Render Form Fields */}
                
                  {fieldConfig.map((field) => (
                    <div key={field.name}>
                      <UpdateLeadField
                        field={field}
                        value={currentLead[field.name]}
                        onChange={handleInputChange}
                      />
                  
                      {/* Conditionally Render Text Input for "Other" */}
                      {field.name === "reason" && isOtherReason && (
                        <div className="mt-2">
                          <label className="block text-gray-700">Specify Other Reason</label>
                          <input
                            type="text"
                            name="customReason"
      value={currentLead.customReason}
      onChange={(e) => handleInputChange(e)}
                            className="w-full px-3 py-2 border rounded"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                  
                  
        
                {/* Save and Cancel Buttons */}
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

          {showPopupVisit && (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg w-[500px]">
                <h2 className="text-xl mb-4">{"Add Site Visit"}</h2>
                <div className="mb-4">
                  <label className="block text-gray-700">Project Name</label>
                  <input
                    type="text"
                    name="project_name"
                    value={leads[0].project_name}
                    onChange={handleInputChangeVisit}
                    className={`w-full px-3 py-2 border  rounded`}
                  />
                </div>
              
                <div className="mb-4">
                  <label className="block text-gray-700">Lead Number</label>
                  <input
                    type="number"
                    name="lead_no"
                    value={leads[0].lead_no}
                    onChange={handleInputChangeVisit}
                    className={`w-full px-3 py-2 border  rounded`}
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={leads[0].name}
                    onChange={handleInputChangeVisit}
                    className={`w-full px-3 py-2 border  rounded`}
                  />
                </div>
            
                <div className="mb-4">
                  <label className="block text-gray-700">Visit</label>
                  <select
                    name="visit"
                    value={visitLead.visit}
                    onChange={handleInputChangeVisit}
                    className="border rounded-2xl p-2 w-full"
                  >
                    <option value="">Select Visit Type</option>
                    <option value="fresh">Fresh</option>
                    <option value="re-visit">Re-Visit</option>
                    <option value="self">Self</option>
                    <option value="associative">Associative</option>
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700">Visit Date</label>
                  <input
                    type="date"
                    name="visit_date"
                    value={visitLead.visit_date}
                    onChange={handleInputChangeVisit}
                    className={`w-full px-3 py-2 border  rounded`}
                  />
                </div>

               

                <div className="flex justify-end">
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 mr-2"
                    onClick={saveVisit} disabled = {loading}
                  >
                    {loading ? 'Save...' : 'Save'}
                  </button>
                  <button
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700"
                    onClick={closePopupVisit}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
          {showPopupUnitSold && (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg w-[500px]">
                <h2 className="text-xl mb-4">{"Unit Sold Creation"}</h2>
                <div className="mb-4">
                  <label className="block text-gray-700">Project Name</label>
                  <input
                    type="text"
                    name="project_name"
                    value={leads[0].project_name}
                    onChange={handleInputChangeUnitSold}
                    className={`w-full px-3 py-2 border  rounded`}
                  />
                </div>
              
                <div className="mb-4">
                  <label className="block text-gray-700">Lead Number</label>
                  <input
                    type="number"
                    name="lead_no"
                    value={leads[0].lead_no}
                    onChange={handleInputChangeUnitSold}
                    className={`w-full px-3 py-2 border  rounded`}
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={leads[0].name}
                    onChange={handleInputChangeUnitSold}
                    className={`w-full px-3 py-2 border  rounded`}
                  />
                </div>
            
            
<div className="mb-4">
    <label className="block text-gray-700">Unit Number</label>
    <select
        name="unit_no"
        value={unitsold.unit_no}
        onChange={handleInputChangeUnitSold}
        className="border rounded-2xl p-2 w-full"
    >
        <option value="">Select Unit Number</option>
        {unitdata.map((unit) => (
            <option
                key={unit.id}
                value={unit.unit_number}
                disabled={unit.status === "sold"} // Disable sold units
            >
                {unit.status === "sold" ? `Sold ${unit.unit_number}` : `Unit ${unit.unit_number} (Available)`}
            </option>
        ))}
    </select>
</div>


            <div className="mb-4">
                  <label className="block text-gray-700">Unit Status</label>
                  <select
                    name="unit_status"
                    value={unitsold.unit_status}
                    onChange={handleInputChangeUnitSold}
                    className="border rounded-2xl p-2 w-full"
                  >
                    <option value="">Select Unit Status Type</option>
                
                    <option value="sold">Sold</option>
                   
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700">Date</label>
                  <input
                    type="date"
                    name="date"
                    value={unitsold.date}
                    onChange={handleInputChangeUnitSold}
                    className={`w-full px-3 py-2 border  rounded`}
                    max={today}
                  />
                </div>

               

                <div className="flex justify-end">
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 mr-2"
                    onClick={saveUnitSold}
                  >
                    {loading ? 'Save...' : 'Save'}
                  </button>
                  <button
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700"
                    onClick={closePopupUnitSold}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {showPopupFollowUp && (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg w-[500px]">
                <h2 className="text-xl mb-4">{"Add Follow Up"}</h2>
                <div className="mb-4">
                  <label className="block text-gray-700">Project Name</label>
                  <input
                    type="text"
                    name="project_name"
                    value={leads[0].project_name}
                    onChange={handleInputChangeFollowUp}
                    className={`w-full px-3 py-2 border  rounded`}
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Lead Number</label>
                  <input
                    type="number"
                    name="lead_no"
                    value={leads[0].lead_no}
                    onChange={handleInputChangeFollowUp}
                    className={`w-full px-3 py-2 border  rounded`}
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={leads[0].name}
                    onChange={handleInputChangeFollowUp}
                    className={`w-full px-3 py-2 border  rounded`}
                  />
                </div>
            
                <div className="mb-4">
                  <label className="block text-gray-700">Follow Up Type</label>
                  <select
                    name="follow_up_type"
                    value={follow_up.follow_up_type}
                    onChange={handleInputChangeFollowUp}
                    className="border rounded-2xl p-2 w-full"
                  >
                    <option value="">Select Follow Type</option>
                    <option value="call">Call</option>
                    <option value="email">Email</option>
                    <option value="in-person">In Person</option>
                    <option value="whatsapp-chat">Whatsapp Chat</option>
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700">Follow Up Date</label>
                  <input
                    type="date"
                    name="follow_up_date"
                    value={follow_up.follow_up_date}
                    onChange={handleInputChangeFollowUp}
                    className={`w-full px-3 py-2 border  rounded`}
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Report</label>
                  <input
                    type="text"
                    name="report"
                    value={follow_up.report}
                    onChange={handleInputChangeFollowUp}
                    className={`w-full px-3 py-2 border  rounded`}
                  />
                </div>

               

                <div className="flex justify-end">
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 mr-2"
                    onClick={saveFollowUp} disabled = {loading}
                  >
                    {loading ? 'Save...' : 'Save'}
                  </button>
                  <button
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700"
                    onClick={closePopupFollowUp}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

{showPopupRemark && (
  <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
    <div className="bg-white p-6 rounded-lg shadow-lg w-[500px]">
      <h2 className="text-xl mb-4">{"Add Remark"}</h2>
       
      <div className="mb-4">
        <label className="block text-gray-700">Project Name</label>
        <input
          type="text"
          name="project_name"
          value={leads[0].project_name}
          onChange={handleInputChangeRemark}
          className={`w-full px-3 py-2 border  rounded`}
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Lead ID</label>
        <input
          type="number"
          name="lead_id"
          value={leads[0].lead_id}
          onChange={handleInputChangeRemark}
          className={`w-full px-3 py-2 border  rounded`}
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700">Name</label>
        <input
          type="text"
          name="name"
          value={leads[0].name}
          onChange={handleInputChangeRemark}
          className={`w-full px-3 py-2 border  rounded`}
        />
      </div>

     

      <div className="mb-4">
        <label className="block text-gray-700">Remark Status</label>
        <input
        type="text"
          name="remark_status"
          value={remark.remark_status}
          onChange={handleInputChangeRemark}
          className={`w-full px-3 py-2 border  rounded`}
        />
         
      </div>

      

      <div className="mb-4">
        <label className="block text-gray-700">Date</label>
        <input
          type="date"
          name="date"
          value={remark.date}
          onChange={handleInputChangeRemark}
          className={`w-full px-3 py-2 border  rounded`}
        />
      </div>

      <div className="flex justify-end">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 mr-2"
          onClick={saveRemark} disabled = {loading}
        >
          {loading ? 'Save...' : 'Save'}
        </button>
        <button
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700"
          onClick={closePopupRemark}
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}

        </div>
      </div>
    </>
  );
}

export default Employee_Single_Lead_Profile;
