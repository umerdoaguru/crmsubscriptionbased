import React, { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import cogoToast from "cogo-toast";

const VisitCreationPopup = ({
  isOpen,
  onClose,
  fetchVisit,
  fetchLeads,
  leads,
}) => {
  const modalRef = useRef();
  const [loading, setLoading] = useState(false);
  const [visitLead, setVisitLead] = useState({
    project_name: "",
    lead_id: "",
    name: "",
    employeeId: "",
    employee_name: "",
    visit: "",
    visit_date: "",
  });

  const handleInputChangeVisit = (e) => {
    const { name, value } = e.target;
    setVisitLead((prevLead) => ({
      ...prevLead,
      [name]: value,
    }));
  };

  const saveVisit = async (e) => {
    e.preventDefault();
    if (!visitLead.visit) {
      cogoToast.error("Please select a visit type.");
      return;
    }
    if (!visitLead.visit_date) {
      cogoToast.error("Please select a visit date.");
      return;
    }

    console.log("Visit data:", visitLead);
    setLoading(true);
    try {
      // First API call: Create a visit
      const response = await axios.post(
        `https://crm-generalize.dentalguru.software/api/employe-visit`,
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
          `https://crm-generalize.dentalguru.software/api/updateVisitStatus/${leads[0].lead_id}`,
          { visit: visitLead.visit, visit_date: visitLead.visit_date }
        );

        if (updateResponse.status === 200) {
          console.log(
            "Visit status updated successfully:",
            updateResponse.data
          );
          cogoToast.success("Visit status updated successfully");
        } else {
          console.error("Error updating visit status:", updateResponse.data);
          cogoToast.error("Failed to update visit status.");
          return; // Exit if this step fails
        }

        // Third API call: Update lead status
        const updateLeadStatusResponse = await axios.put(
          `https://crm-generalize.dentalguru.software/api/updateOnlyLeadStatus/${leads[0].lead_id}`,
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

        fetchVisit();
        fetchLeads();
        setLoading(false);
        onClose();
      } else {
        console.error("Error creating visit:", response.data);
        cogoToast.error("Failed to create visit.");
        setLoading(false);
      }
    } catch (error) {
      console.error("Request failed:", error);
      setLoading(false);
      cogoToast.error("An error occurred while processing your request.");
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
              Add Site Visit
            </h2>

            {/* Form */}
            <form onSubmit={saveVisit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Project Name
                </label>
                <input
                  type="text"
                  name="project_name"
                  value={leads[0].project_name}
                  onChange={handleInputChangeVisit}
                  className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-cyan-500"
                  required
                />
              </div>

              {/* Lead Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Lead Number
                </label>
                <input
                  type="number"
                  name="lead_no"
                  value={leads[0].lead_no}
                  onChange={handleInputChangeVisit}
                  className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-cyan-500"
                  required
                />
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={leads[0].name}
                  onChange={handleInputChangeVisit}
                  className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-cyan-500"
                  required
                />
              </div>

              {/* Visit Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Visit
                </label>
                <select
                  name="visit"
                  value={visitLead.visit}
                  onChange={handleInputChangeVisit}
                  className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-cyan-500"
                  required
                >
                  <option value="">Select Visit Type</option>
                  <option value="fresh">Fresh</option>
                  <option value="re-visit">Re-Visit</option>
                  <option value="self">Self</option>
                  <option value="associative">Associative</option>
                </select>
              </div>

              {/* Visit Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Visit Date
                </label>
                <input
                  type="date"
                  name="visit_date"
                  value={visitLead.visit_date}
                  onChange={handleInputChangeVisit}
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

export default VisitCreationPopup;
