import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import img from "../../images/lead_profile.png";
import MainHeader from "../../components/MainHeader";
import SuperAdminSider from "./SuperAdminSider";
import Super_view_remarks from "./Super_view_remaks";
import Super_view_followup from "./Super_view_followup";
import Super_view_visit from "./Super_view_visit";
import { useSelector } from "react-redux";
import Super_view_unit_sold from "./Super_view_unit_sold";

function Super_Single_Lead_Profile({id,closeModalLead }) {

  const navigate = useNavigate();
  const [leads, setLeads] = useState([]);
  const [visit, setVisit] = useState([]);
 
  const [visitCreated, setVisitCreated] = useState(false);
  const [followCreated, setFollowCreated] = useState(false);
  const [remarksCreated, setRemarksCreated] = useState(false);
  const [employeeunitsoldCreated, setemployeeunitsoldCreated] = useState(false);
  const [isModalOpenRemarks, setIsModalOpenRemarks] = useState(false);
  const [isModalOpenFollowUp, setIsModalOpenFollowUp] = useState(false);
  const [isModalOpenVisit, setIsModalOpenVisit] = useState(false);
  const [isModalOpenUnitSold, setIsModalOpenUnitSold] = useState(false);

  const superadminuser = useSelector((state) => state.auth.user);
  const token = superadminuser.token;

   
  const fetchLeads = async () => {
    try {
      const response = await axios.get(`https://crmdemo.vimubds5.a2hosted.com/api/leads-super-admin/${id}`,
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

     

    } catch (error) {
      console.error("Error fetching quotations:", error);
    }
  };
  
  const fetchFollowUp = async () => {
    try {
      const response = await axios.get(
        `https://crmdemo.vimubds5.a2hosted.com/api/employe-follow-up-super-admin/${id}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }}
      );
      console.log(response.data);
    
      // Ensure proper comparison with 'Created', trim any spaces and normalize the case
      setFollowCreated(response.data[0]);
    } catch (error) {
      console.error("Error fetching quotations:", error);
    }
  };
  const fetchRemark = async () => {
    try {
      const response = await axios.get(
        `https://crmdemo.vimubds5.a2hosted.com/api/remarks-super-admin/${id}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }}
      );
      console.log(response.data);
      setRemarksCreated(response.data[0]);
     
    } catch (error) {
      console.error("Error fetching remarks:", error);
    }
  };

  const fetchUnitSoldEmployee = async () => {
    try {
      const response = await axios.get(
        `https://crmdemo.vimubds5.a2hosted.com/api/super-admin-unit-sold-lead-id/${leads[0].lead_id}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }}
       
      );

    
      // Ensure proper comparison with 'Created', trim any spaces and normalize the case
      setemployeeunitsoldCreated(response.data[0]);
    } catch (error) {
      console.error("Error fetching quotations:", error);
    }
  };
  

  const handleBackClick = () => {
    navigate(-1); // -1 navigates to the previous page in history
  };
  const fetchVisit = async () => {
    try {
      const response = await axios.get(
        `https://crmdemo.vimubds5.a2hosted.com/api/employe-visit-super-admin/${id}`,
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
  const handleViewQuotation = (lead) => {
    console.log("Lead Object:", lead); // Log the lead object
    const name = lead.name;
    console.log("Lead Name:", name); // Log the name
    navigate(`/super_view_quotations/${lead.lead_id}`);


    
    // navigate("/View_quotations");
  };
  const handleViewVisit = () => {
    navigate(`/super_view_visit/${leads[0].lead_id}`);
  };


    const handleClickRemark = () => {
    
      setIsModalOpenRemarks(true);
    };
    const handleClickFollowUp = () => {
    
      setIsModalOpenFollowUp(true);
    };
    const handleClickVisit = () => {
    
      setIsModalOpenVisit(true);
    };
    const handleClickUnitSold = () => {
    
      setIsModalOpenUnitSold(true);
    };
    
    // Function to close the modal
    const closeModalRemark = () => {
      setIsModalOpenRemarks(false);
   
  };
    const closeModalFollowUp = () => {
      setIsModalOpenFollowUp(false);
      
  };
  
  const closeModalVisit = () => {
    setIsModalOpenVisit(false);

};
  const closeModalUnitSold = () => {
    setIsModalOpenUnitSold(false);

};
  useEffect(() => {
    fetchLeads();
fetchFollowUp();
    fetchVisit();
    fetchRemark();
  }, [id]);
  useEffect(() => {
    if (leads.length > 0) {
      fetchUnitSoldEmployee();
    }
}, [leads]); 

  return (
    <>
      
      <div className="relative  container px-2 mx-auto p-4">
      <button
          onClick={closeModalLead}
          className="absolute top-2 left-2 text-[black] hover:text-gray-700 text-[3rem]"
          title="Close"
        >
          ×
        </button>
        <h1 className="text-2xl text-center mt-[2rem]">Leads Profile</h1>
        <div className="mx-auto h-[3px] w-16 bg-[#34495E] my-3"></div>
        <div className="flex flex-wrap mb-4  mt-2">
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
                {/* <div>
                  <label className="text-info">Project</label>
                  <div className="p-2 bg-gray-100 rounded">
                    <p className="m-0">{lead.project_name}</p>
                  </div>
                </div> */}
                <div>
                  <label className="text-info">Lead Status</label>
                  <div className="p-2 bg-gray-100 rounded">
                    <p className="m-0">{lead.lead_status}</p>
                  </div>
                </div>

                <div>
                  <label className="text-info">Assigned Date</label>
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

        <div className="mt-2">
        <div className="">
              {/* Conditionally render the View Quotation button */}
              <div className="flex flex-wrap gap-2">
               
                {/* Conditionally render the View Quotation button */}
                {visitCreated ? (
                  <button
                    onClick={handleClickVisit}
                    className="bg-green-500 text-white px-4 py-2 w-full sm:w-auto   rounded"
                  >
                    View Visit
                  </button>
                ) : (
                  <p className="text-white bg-red-400 text-center px-4 py-2 rounded w-full sm:w-auto">
                    Visit not yet created
                  </p>
                )}
                {followCreated ? (
  <button
    onClick={handleClickFollowUp}
    className="bg-yellow-500 text-white px-4 py-2 w-full sm:w-auto rounded"
  >
    View Follow Up
  </button>
) : (
  <p className="text-white bg-red-400 text-center px-4 py-2 w-full sm:w-auto rounded">
    Follow Up not yet created
  </p>
)}
{remarksCreated ? (
      <button
        // onClick={handleViewRemark}
        onClick={handleClickRemark}
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
        onClick={handleClickUnitSold}
        className="bg-blue-500 text-white px-4 py-2 rounded w-full sm:w-auto"
      >
        View Unit Sold
      </button>
    ) : (
      <p className="text-white bg-red-400 text-center px-4 py-2 rounded w-full sm:w-auto ">
        Unit not yet sold
      </p>
    )}

              </div>
            </div>
        </div>

   
        <div className="overflow-x-auto mt-5">
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
    
      <th className="px-6 py-3 border-b-2 border-gray-300">Project</th>
      <th className="px-6 py-3 border-b-2 border-gray-300">Project Id</th>
      <th className="px-6 py-3 border-b-2 border-gray-300">Unit Type</th>

      <th className="px-6 py-3 border-b-2 border-gray-300">Unit Number</th>
      <th className="px-6 py-3 border-b-2 border-gray-300">Unit Status</th>
      <th className="px-6 py-3 border-b-2 border-gray-300">Visit</th>
      <th className="px-6 py-3 border-b-2 border-gray-300">Visit Date</th>
      <th className="px-6 py-3 border-b-2 border-gray-300">Close Date</th>
      <th className="px-6 py-3 border-b-2 border-gray-300">Assigned Date</th>
      <th className="px-6 py-3 border-b-2 border-gray-300">Actual Date</th>
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
  
  </tr>
))}

  </tbody>
</table>
          </div>
      
          {isModalOpenRemarks && (
       <div className=" fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 mx-2">
              <div className="w-75 bg-white p-6 rounded-lg shadow-lg max-h-[80vh] overflow-auto mx-4 my-5">
     
              <Super_view_remarks 
        id={leads[0].lead_id}
        closeModalRemark={closeModalRemark} 
     
      />
            
    </div>
  </div>
)}
          {isModalOpenFollowUp && (
       <div className=" fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 mx-2">
              <div className="w-75 bg-white p-6 rounded-lg shadow-lg max-h-[80vh] overflow-auto mx-4 my-5">
     
              <Super_view_followup
        id={leads[0].lead_id}
        closeModalFollowUp={closeModalFollowUp} 
     
      />
            
    </div>
  </div>
)}
          {isModalOpenVisit && (
       <div className=" fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 mx-2">
              <div className="w-75 bg-white p-6 rounded-lg shadow-lg max-h-[80vh] overflow-auto mx-4 my-5">
     
              <Super_view_visit
        id={leads[0].lead_id}
        closeModalVisit ={closeModalVisit} 
     
      />
            
    </div>
  </div>
)}
          {isModalOpenUnitSold && (
       <div className=" fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 mx-2">
              <div className="w-75 bg-white p-6 rounded-lg shadow-lg max-h-[80vh] overflow-auto mx-4 my-5">
     
              <Super_view_unit_sold
        id={leads[0].lead_id}
        closeModalUnitSold ={closeModalUnitSold} 
     
      />
            
    </div>
  </div>
)}
      </div>
    </>
  );
}

export default Super_Single_Lead_Profile;
