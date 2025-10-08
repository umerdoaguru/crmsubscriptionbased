import React, { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import cogoToast from "cogo-toast";

const getFieldValue = (dataString, fieldName) => {
  try {
    const data = JSON.parse(dataString);
    const field = data.find((item) => item.name === fieldName);
    return field ? field.values[0] : "";
  } catch (error) {
    console.error("Invalid question_fields_data:", error);
    return "";
  }
};

const FollowUpCreationPopUp = ({
  isOpen,
  onClose,
  fetchFollowUp,
  fetchLeads,
  fetchMetaLeads,
  leads,
}) => {
  const modalRef = useRef();
  const [loading, setLoading] = useState(false);
  const [follow_up, setFollow_Up] = useState({
    fu_project_id: leads[0]?.project_id,
    fu_lead_id: leads[0]?.lead_id,
    fu_employeeId: leads[0]?.staff_id,
    follow_up_type: "",
    follow_up_date: "",
    follow_up_report: "",
  });

  console.log(leads);

  const handleInputChangeFollowUp = (e) => {
    const { name, value } = e.target;
    setFollow_Up((prevLead) => ({
      ...prevLead,
      [name]: value,
    }));
  };

  console.log(follow_up);

  useEffect(() => {
    setFollow_Up({
      ...follow_up,
      fu_project_id: leads[0]?.project_id || leads[0]?.meta_project_id,
      fu_lead_id: leads[0]?.lead_id || Number(leads[0]?.leadgen_id),
      fu_employeeId: leads[0]?.staff_id || leads[0]?.meta_assignedTo,
    });
  }, [leads]);

  const saveFollowUp = async (e) => {
    e.preventDefault();
    console.log(follow_up);
    if (!follow_up.follow_up_type) {
      cogoToast.error("Please select a follow up type.");
      return;
    }
    if (!follow_up.follow_up_date) {
      cogoToast.error("Please select a folllow up date.");
      return;
    }
    if (!follow_up.follow_up_report) {
      cogoToast.error("Please Enter a report.");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(
        `https://crm-generalize.dentalguru.software/api/employe-follow-up`,
        follow_up
      );

      console.log("Follow-up created successfully:", response.data);
      cogoToast.success("Follow-up created successfully");

      fetchFollowUp();
      fetchLeads();
      fetchMetaLeads();
      setLoading(false);
      onClose();
    } catch (error) {
      console.error("Request failed:", error);
      cogoToast.error("Failed to create follow-up.");
      setLoading(false);
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
            className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-lg mx-4"
            initial={{ scale: 0.9, opacity: 0, y: -30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 30 }}
            transition={{ duration: 0.3 }}
          >
            {/* Title */}
            <h2 className="text-2xl font-bold mb-4 text-center text-cyan-700">
              Add Follow Up
            </h2>

            {/* Form */}
            <form onSubmit={saveFollowUp} className="space-y-4">
              {/* Project Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Project Name
                </label>
                <input
                  type="text"
                  name="project_name"
                  value={leads[0].project_name}
                  disabled
                  className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Lead Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={
                    leads[0].name ||
                    getFieldValue(leads[0].question_fields_data, "full_name")
                  }
                  disabled
                  className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              {/* Follow Up Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Follow Up Type
                </label>
                <select
                  name="follow_up_type"
                  value={follow_up.follow_up_type}
                  onChange={handleInputChangeFollowUp}
                  className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-cyan-500"
                  required
                >
                  <option value="">Select Follow Type</option>
                  <option value="call">Call</option>
                  <option value="email">Email</option>
                  <option value="in-person">In Person</option>
                  <option value="whatsapp-chat">Whatsapp Chat</option>
                </select>
              </div>

              {/* Follow Up Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Follow Up Date
                </label>
                <input
                  type="date"
                  name="follow_up_date"
                  value={follow_up.follow_up_date}
                  onChange={handleInputChangeFollowUp}
                  className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-cyan-500"
                  required
                />
              </div>

              {/* Report */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Report
                </label>
                <textarea
                  type="text"
                  name="follow_up_report"
                  value={follow_up.follow_up_report}
                  onChange={handleInputChangeFollowUp}
                  className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-cyan-500"
                  required
                />
              </div>

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

export default FollowUpCreationPopUp;
