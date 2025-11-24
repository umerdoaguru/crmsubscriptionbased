import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import img from "../../images/lead_profile.png";
import cogoToast from "cogo-toast";
import { useSelector } from "react-redux";
import VisitCreationPopup from "./VisitCreationPopup";
import FollowUpCreationPopUp from "./FollowUpCreationPopUp";
import RemarkCreationPopup from "./RemarkCreationPopup";
import UnitSoldCreationPopup from "./UnitSoldCreationPopup";
import UpdateLeadStatusPopup from "./UpdateLeadStatusPopup";
import getFieldValue from "../../utils/getFieldValue";
import LeadOverview from "./SingleLeadTabs/LeadOverview";
import BookingDetails from "./SingleLeadTabs/BookingDetails";
import RegistryDetails from "./SingleLeadTabs/RegistryDetails";
import UtilityCharges from "./SingleLeadTabs/UtilityCharges";
import AllReceipts from "./SingleLeadTabs/AllReceipts";
import Transactions from "./SingleLeadTabs/Transactions";
import VisitTab from "./SingleLeadTabs/VisitTab";
import FollowUpTab from "./SingleLeadTabs/FollowUpTab";
import RemarkTab from "./SingleLeadTabs/RemarkTab";
import SoldUnitView from "./SingleLeadTabs/SoldUnitView";
import BookingCreationPopup from "../EmployeePops/BookingCreationPopup";
import RegistryCreatePopup from "../EmployeePops/RegistryCreatePopup";

function EmployeeSingleLeadProfileContent({ isSidebarOpen }) {
  const { type, id } = useParams();

  const navigate = useNavigate();
  const [booking, setBooking] = useState([]);
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [visit, setVisit] = useState([]);
  const [unitdata, setUnitData] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [showPopupVisit, setShowPopupVisit] = useState(false);
  const [showPopupUnitSold, setShowPopupUnitSold] = useState(false);
  const [showPopupFollowUp, setShowPopupFollowUp] = useState(false);
  const [showPopupRemark, setShowPopupRemark] = useState(false);
  const [showBookPopup, setShowBookPopup] = useState(false);
  const [showRegistryPopup, setShowRegistryPopup] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [render, setRender] = useState(false);
  const [isOtherReason, setIsOtherReason] = useState(false);
  const EmpId = useSelector((state) => state.auth.user);
  const [activeTab, setActiveTab] = useState("overview");

  const token = EmpId?.token;
  const userId = EmpId.user_id;
  const [currentLead, setCurrentLead] = useState({
    lead_status: "",
    visit_date: "",
    visit: "",
    quotation_status: "",
    deal_status: "",
    meeting_status: "",
    booking_amount: "",
    payment_mode: "",
    registry: "",
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

  const [quotationCreated, setQuotationCreated] = useState(false);
  const [visitCreated, setVisitCreated] = useState(false);
  const [followCreated, setFollowCreated] = useState([]);
  const [employeeunitsoldCreated, setemployeeunitsoldCreated] = useState(false);
  const [remarkCreated, setRemarkCreated] = useState(false);

  useEffect(() => {
    fetchUnitdata();
    fetchUnitSoldEmployee();
  }, [leads[0]]);

  useEffect(() => {
    fetchVisit();
    fetchFollowUp();
    fetchRemark();
    if (type === "meta") {
      fetchMetaLeads();
    } else {
      fetchLeads();
    }
  }, [type, id]);

  const fetchLeads = async () => {
    try {
      const response = await axios.get(
        `https://crm-generalize.dentalguru.software/api/leads-employee/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setLeads(response.data);

      response.data.forEach((lead) => {
        console.log("Lead Quotation Status (raw):", lead.quotation);
      });

      const hasCreatedQuotation = response.data.some(
        (lead) =>
          lead.quotation && lead.quotation.trim().toLowerCase() === "created"
      );

      setQuotationCreated(hasCreatedQuotation);
    } catch (error) {
      console.error("Error fetching quotations:", error);
    }
  };

  const fetchMetaLeads = async () => {
    try {
      const { data } = await axios.get(
        `https://crm-generalize.dentalguru.software/api/getMetaLeadsByLeadId/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setLeads(data);
    } catch (error) {
      console.error("Error fetching quotations:", error);
    }
  };

  const fetchVisit = async () => {
    try {
      const { data } = await axios.get(
        `https://crm-generalize.dentalguru.software/api/employe-visit/${type}/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setVisit(data);
    } catch (error) {
      console.error("Error fetching quotations:", error);
    }
  };

  const fetchFollowUp = async () => {
    try {
      let apiUrl = "";

      if (type === "meta") {
        apiUrl = `https://crm-generalize.dentalguru.software/api/getEmployeeFollow_UpMeta/${id}`;
      } else {
        apiUrl = `https://crm-generalize.dentalguru.software/api/employe-follow-up/${id}`;
      }

      const { data } = await axios.get(apiUrl, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      setFollowCreated(data);
    } catch (error) {
      console.error("Error fetching follow up:", error);
    }
  };

  const fetchUnitSoldEmployee = async () => {
    try {
      let apiUrl = "";

      if (type === "meta") {
        apiUrl = `https://crm-generalize.dentalguru.software/api/getEmployeeUnitSoldByLeadIdMeta/${leads[0]?.leadgen_id}`;
      } else {
        apiUrl = `https://crm-generalize.dentalguru.software/api/unit-sold-lead-id/${leads[0]?.lead_id}`;
      }

      const response = await axios.get(apiUrl, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      setemployeeunitsoldCreated(response.data[0]);
    } catch (error) {
      console.error("Error fetching quotations:", error);
    }
  };

  const fetchRemark = async () => {
    try {
      let apiUrl = "";

      if (type === "meta") {
        apiUrl = `https://crm-generalize.dentalguru.software/api/getEmployeeRemarkMeta/${id}`;
      } else {
        apiUrl = `https://crm-generalize.dentalguru.software/api/remarks/${id}`;
      }

      const response = await axios.get(apiUrl, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      setRemarkCreated(response.data.length > 0);
    } catch (error) {
      console.error("Error fetching remarks:", error);
    }
  };

  const fetchUnitdata = async () => {
    try {
      const response = await axios.get(
        `https://crm-generalize.dentalguru.software/api/unit-data/${leads[0]?.unit_id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUnitData(response.data);
    } catch (error) {
      console.error("Error fetching Unit Data:", error);
    }
  };
  const handleBackClick = () => {
    navigate(-1);
  };

  const handleQuotation = async (lead) => {
    const name = lead.name;
    navigate(`/quotation-by-lead/${lead.lead_id}`, { state: { name } });
  };

  const handleViewQuotation = (lead) => {
    console.log("Lead Object:", lead);
    const name = lead.name;
    console.log("Lead Name:", name);
    navigate(`/View_quotations/${lead.lead_id}`);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentLead((prevState) => ({ ...prevState, [name]: value }));

    if (name === "reason") {
      setIsOtherReason(value === "other");
      if (value !== "other") {
        setCurrentLead((prevState) => ({ ...prevState, customReason: "" }));
      }
    }
  };

  const handleUpdate = (lead) => {
    setIsEditing(true);
    setCurrentLead(lead);
    console.log(lead);

    setShowPopup(true);
  };

  const handleViewVisit = () => {
    navigate(`/view_visit/${type}/${leads[0].lead_id || leads[0].leadgen_id}`);
    console.log(leads[0].lead_id);
  };
  const handleViewEmployeeUnitSold = () => {
    navigate(
      `/view_unit_sold/${type}/${leads[0].lead_id || leads[0].leadgen_id}`
    );
  };

  const handleViewFollowUp = () => {
    navigate(
      `/view_follow_up/${type}/${leads[0].lead_id || leads[0].leadgen_id}`
    );
  };

  const saveChanges = async () => {
    console.log(currentLead);

    const leadData = {
      ...currentLead,
      reason: isOtherReason
        ? currentLead.customReason || leads[0]?.reason
        : currentLead.reason,
    };
    try {
      if (currentLead.deal_status == "close") {
        if (currentLead.d_closeDate === "pending") {
          alert("Please update the deal close date as well");
          return;
        }
      }
      if (currentLead.lead_status == "not-interested") {
        if (
          currentLead.reason === "pending" ||
          currentLead.customReason === currentLead.reason
        ) {
          alert("Please update the reason as well");
          return;
        }
      }
      setLoading(true);
      const response = await axios.put(
        `https://crm-generalize.dentalguru.software/api/updateLeadStatus/${currentLead.lead_id}`,
        leadData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        cogoToast.success("Lead status updated successfully");
        setRender(!render);
        closePopup();
        fetchLeads();
        setLoading(false);
      } else {
        setLoading(false);
        cogoToast.error({ general: "Failed to update the lead status." });
      }
    } catch (error) {
      console.error("Request failed:", error);
      setLoading(false);
      cogoToast.error("Failed to update the lead status.");
    }
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  const totalVisit = visit.length;

  const remainingLeads = leads?.length > 1 ? leads.slice(1) : leads;

  console.log(leads);

  const fetchBookingData = async () => {
    try {
      const { data } = await axios.get(
        `https://crm-generalize.dentalguru.software/api/getBookingBYleadId/${id}`
      );
      setBooking(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchBookingData();
  }, []);

  console.log(booking);

  return (
    <>
      <div className="flex mt-20">
        <div
          className={`${
            isSidebarOpen ? "w-[80rem]" : "w-[88rem]"
          } min-h-screen bg-[#F9FAFF] p-2`}
        >
          <div className="flex flex-col">
            <div className="container sm:mt-1 px-2 mx-auto p-4">
              <div className="">
                <button
                  onClick={() => navigate(-1)}
                  className="bg-cyan-600 text-white px-3 py-1 max-sm:hidden rounded-lg hover:bg-cyan-600 transition-colors "
                >
                  Back
                </button>
              </div>
              <h2 className="text-2xl text-center mt-[2rem]">Leads Profile</h2>
              <div className="mx-auto h-[3px] w-16 bg-cyan-600 my-3"></div>
              <div className="flex-wrap mb-4 hidden sm:flex">
                <div className="w-full lg:w-1/3 hidden sm:block">
                  <img src={img} alt="doctor-profile" className=" rounded-lg" />
                </div>
                {remainingLeads?.map((lead, index) => (
                  <div className="w-full lg:w-2/3 ">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                      <div>
                        <label className="text-cyan-600 font-semibold">
                          Name
                        </label>
                        <div className="p-2 bg-gray-100 rounded">
                          <p className="m-0 break-words">
                            {lead.name ||
                              getFieldValue(
                                lead.question_fields_data,
                                "full_name"
                              )}
                          </p>
                        </div>
                      </div>

                      <div>
                        <label className="text-cyan-600 font-semibold">
                          Assigned To
                        </label>
                        <div className="p-2 bg-gray-100 rounded">
                          <p className="m-0">{lead.staff_name}</p>
                        </div>
                      </div>

                      <div>
                        <label className="text-cyan-600 font-semibold">
                          Mobile Number
                        </label>
                        <div className="p-2 bg-gray-100 rounded">
                          <p className="m-0">
                            {lead.phone ||
                              getFieldValue(
                                lead.question_fields_data,
                                "phone_number"
                              )}
                          </p>
                        </div>
                      </div>

                      <div>
                        <label className="text-cyan-600 font-semibold">
                          Lead Source
                        </label>
                        <div className="p-2 bg-gray-100 rounded">
                          <p className="m-0">{lead.leadSource || "Meta"}</p>
                        </div>
                      </div>
                      <div>
                        <label className="text-cyan-600 font-semibold">
                          Project Name
                        </label>
                        <div className="p-2 bg-gray-100 rounded">
                          <p className="m-0">{lead.project_name}</p>
                        </div>
                      </div>
                      <div>
                        <label className="text-cyan-600 font-semibold">
                          Lead Status
                        </label>
                        <div className="p-2 bg-gray-100 rounded">
                          <p className="m-0">
                            {lead.lead_status || lead?.meta_lead_status}
                          </p>
                        </div>
                      </div>

                      <div>
                        <label className="text-cyan-600 font-semibold">
                          {" "}
                          Date
                        </label>
                        <div className="p-2 bg-gray-100 rounded">
                          <p className="m-0">
                            {lead.createdTime || lead?.meta_updated_at}
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
                    onClick={() => setShowPopupVisit(true)}
                  >
                    + Add Visit
                  </button>
                  <button
                    className="bg-yellow-500 text-white px-4 py-2 rounded w-full sm:w-auto"
                    onClick={() => setShowPopupFollowUp(true)}
                  >
                    + Add Follow-Up
                  </button>
                  <button
                    className="bg-purple-500 text-white px-4 py-2 rounded w-full sm:w-auto"
                    onClick={() => setShowPopupRemark(true)}
                  >
                    + Add Remark
                  </button>

                  <button
                    className="bg-emerald-500 text-white px-4 py-2 rounded w-full sm:w-auto"
                    onClick={() => setShowBookPopup(true)}
                  >
                    + Add Booking
                  </button>
                  {booking?.length > 0 && (
                    <>
                      <button
                        className="bg-red-500 text-white px-4 py-2 rounded w-full sm:w-auto"
                        onClick={() => setShowRegistryPopup(true)}
                      >
                        + Add Registry
                      </button>
                      <button
                        className="bg-cyan-700 text-white px-4 py-2 rounded w-full sm:w-auto"
                        onClick={() => setShowPopupRemark(true)}
                      >
                        + Add Utility Charges
                      </button>
                      <button
                        className="bg-green-700 text-white px-4 py-2 rounded w-full sm:w-auto"
                        onClick={() => setShowPopupRemark(true)}
                      >
                        + Final Sale
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Modern Tabs */}
              <div className="flex flex-wrap gap-3 mt-6 bg-white p-3 rounded-xl shadow-sm border border-gray-200">
                {[
                  { key: "overview", label: "Lead Overview" },
                  { key: "booking", label: "Booking Details" },
                  { key: "registry", label: "Registry Details" },
                  { key: "utility", label: "Utility Charges" },
                  { key: "receipts", label: "All Receipts" },
                  { key: "transactions", label: "Transactions" },
                  { key: "visit", label: "Visit" },
                  { key: "followup", label: "Follow-Up" },
                  { key: "remark", label: "Remark" },
                  { key: "unitsold", label: "View Sold Details" },
                ].map((item) => (
                  <button
                    key={item.key}
                    onClick={() => setActiveTab(item.key)}
                    className={`
        px-4 py-2 rounded-lg font-medium transition-all
        ${
          activeTab === item.key
            ? "bg-cyan-600 text-white shadow-md"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
        }
      `}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="">
            {activeTab === "overview" && <LeadOverview leads={leads} />}
            {activeTab === "booking" && <BookingDetails />}
            {activeTab === "registry" && <RegistryDetails />}
            {activeTab === "utility" && <UtilityCharges />}
            {activeTab === "receipts" && <AllReceipts />}
            {activeTab === "transactions" && <Transactions />}
            {activeTab === "visit" && <VisitTab />}
            {activeTab === "followup" && <FollowUpTab />}
            {activeTab === "remark" && <RemarkTab />}
            {activeTab === "unitsold" && <SoldUnitView type={type} id={id} />}
          </div>
        </div>
      </div>

      <VisitCreationPopup
        isOpen={showPopupVisit}
        onClose={() => setShowPopupVisit(false)}
        leads={leads}
        visitLead={visitLead}
        fetchLeads={fetchLeads}
        fetchMetaLeads={fetchMetaLeads}
        fetchVisit={fetchVisit}
      />
      <FollowUpCreationPopUp
        isOpen={showPopupFollowUp}
        onClose={() => setShowPopupFollowUp(false)}
        leads={leads}
        visitLead={visitLead}
        fetchLeads={fetchLeads}
        fetchMetaLeads={fetchMetaLeads}
        fetchFollowUp={fetchFollowUp}
      />
      <RemarkCreationPopup
        isOpen={showPopupRemark}
        onClose={() => setShowPopupRemark(false)}
        leads={leads}
        visitLead={visitLead}
        fetchLeads={fetchLeads}
        fetchMetaLeads={fetchMetaLeads}
        fetchRemark={fetchRemark}
      />
      <UnitSoldCreationPopup
        isOpen={showPopupUnitSold}
        onClose={() => setShowPopupUnitSold(false)}
        leads={leads}
        fetchLeads={fetchLeads}
        fetchUnitdata={fetchUnitdata}
        fetchUnitSoldEmployee={fetchUnitSoldEmployee}
        fetchMetaLeads={fetchMetaLeads}
        unitdata={unitdata}
      />
      <BookingCreationPopup
        isOpen={showBookPopup}
        onClose={() => setShowBookPopup(false)}
        leads={leads}
        fetchLeads={fetchLeads}
        fetchUnitdata={fetchUnitdata}
        fetchUnitSoldEmployee={fetchUnitSoldEmployee}
        fetchMetaLeads={fetchMetaLeads}
        unitdata={unitdata}
      />
      <UpdateLeadStatusPopup
        isOpen={showPopup}
        onClose={() => setShowPopup(false)}
        leads={leads}
        fetchLeads={fetchLeads}
        fetchMetaLeads={fetchMetaLeads}
        fetchUnitdata={fetchUnitdata}
        fetchUnitSoldEmployee={fetchUnitSoldEmployee}
        unitdata={unitdata}
      />
      <RegistryCreatePopup
        isOpen={showRegistryPopup}
        onClose={() => setShowRegistryPopup(false)}
        leads={leads}
        booking={booking}
      />
    </>
  );
}

export default EmployeeSingleLeadProfileContent;
