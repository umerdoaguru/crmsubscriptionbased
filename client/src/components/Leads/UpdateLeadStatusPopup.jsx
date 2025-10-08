import React, { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import cogoToast from "cogo-toast";
import UpdateLeadField from "../EmployeeModule/updateLeadField";
import { useParams } from "react-router-dom";

const UpdateLeadStatusPopup = ({
  isOpen,
  onClose,
  fetchVisit,
  fetchLeads,
  leads,
  fetchMetaLeads,
}) => {
  const modalRef = useRef();
  const { type, id } = useParams();
  const [loading, setLoading] = useState(false);
  const [render, setRender] = useState(false);
  const [currentLead, setCurrentLead] = useState({
    lead_status: "",
  });

  console.log(leads);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentLead((prevState) => ({ ...prevState, [name]: value }));
  };

  const saveChanges = async (e) => {
    e.preventDefault();
    console.log(currentLead);

    try {
      setLoading(true);
      const response = await axios.put(
        `https://crm-generalize.dentalguru.software/api/updateOnlyLeadStatusEmployeeEnd/${leads[0]?.lead_id}`,
        currentLead
      );

      console.log("Updated successfully:", response.data);
      cogoToast.success("Lead status updated successfully");
      setRender(!render);
      fetchLeads();
      setLoading(false);
      onClose();
    } catch (error) {
      console.error("Request failed:", error);
      setLoading(false);
      cogoToast.error("Failed to update the lead status.");
    }
  };

  const saveMetaChanges = async (e) => {
    e.preventDefault();
    console.log(currentLead);

    try {
      setLoading(true);
      const response = await axios.put(
        `https://crm-generalize.dentalguru.software/api/updateOnlyMetaLeadStatusEmployeeEnd/${leads[0]?.meta_id}`,
        currentLead
      );

      console.log("Updated successfully:", response.data);
      cogoToast.success("Lead status updated successfully");
      setRender(!render);
      fetchMetaLeads();
      setLoading(false);
      onClose();
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
              Update Status
            </h2>

            {/* Dynamic Form Fields */}
            <form
              onSubmit={type === "meta" ? saveMetaChanges : saveChanges}
              className="space-y-4"
            >
              <div>
                <label htmlFor="">Lead Status</label>

                <select
                  name="lead_status"
                  value={currentLead?.lead_status}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded"
                >
                  <option value="">--select--</option>
                  <option value="Pending">Pending</option>
                  <option value="Close">Close</option>
                  <option value="Sold">Sold</option>
                  <option value="Ongoing">Ongoing</option>
                </select>
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

export default UpdateLeadStatusPopup;
