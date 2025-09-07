import React, { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import cogoToast from "cogo-toast";
import UpdateLeadField from "../EmployeeModule/updateLeadField";

const UpdateLeadStatusPopup = ({
  isOpen,
  onClose,
  fetchVisit,
  fetchLeads,
  leads,
}) => {
  const modalRef = useRef();
  const [loading, setLoading] = useState(false);
  const [isOtherReason, setIsOtherReason] = useState(false);
  const [render, setRender] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
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

  const saveChanges = async (e) => {
    e.preventDefault();
    console.log(currentLead);

    const leadData = {
      ...currentLead,
      reason: isOtherReason
        ? currentLead.customReason || leads[0]?.reason
        : currentLead.reason, // Use the default value if untouched
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
      // Send updated data to the backend using Axios
      const response = await axios.put(
        `https://crm-generalize.dentalguru.software/api/updateLeadStatus/${currentLead.lead_id}`,
        leadData
      );

      if (response.status === 200) {
        console.log("Updated successfully:", response.data);
        cogoToast.success("Lead status updated successfully");
        setRender(!render);
        fetchLeads();
        setLoading(false);
        onClose();
      } else {
        console.error("Error updating:", response.data);
        setLoading(false);
        cogoToast.error({ general: "Failed to update the lead status." });
      }
    } catch (error) {
      console.error("Request failed:", error);
      setLoading(false);
      cogoToast.error("Failed to update the lead status.");
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            ref={modalRef}
            className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto"
            initial={{ scale: 0.9, opacity: 0, y: -30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 30 }}
            transition={{ duration: 0.3 }}
          >
            {/* Title */}
            <h2 className="text-2xl font-bold mb-4 text-center text-cyan-700">
              {isEditing ? "Update Status" : "Add Site Visit"}
            </h2>

            {/* Dynamic Form Fields */}
            <form onSubmit={saveChanges} className="space-y-4">
              {fieldConfig.map((field) => (
                <div key={field.name}>
                  <UpdateLeadField
                    field={field}
                    value={currentLead[field.name]}
                    onChange={handleInputChange}
                  />

                  {/* Conditionally Render "Other" Input */}
                  {field.name === "reason" && isOtherReason && (
                    <div className="mt-2">
                      <label className="block text-gray-700">
                        Specify Other Reason
                      </label>
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

              {/* Buttons */}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700"
                  onClick={onClose}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className={`px-4 py-2 rounded text-white ${
                    loading ? "bg-gray-600" : "bg-cyan-600 hover:bg-cyan-700"
                  }`}
                >
                  {loading ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default UpdateLeadStatusPopup;
