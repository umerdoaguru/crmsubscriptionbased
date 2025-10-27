import React, { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import cogoToast from "cogo-toast";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

const VisitCreationPopup = ({
  isOpen,
  onClose,
  fetchVisit,
  fetchLeads,
  fetchMetaLeads,
  leads,
}) => {
  const superadminuser = useSelector((state) => state.auth.user);
  const token = superadminuser.token;
  const modalRef = useRef();
  const { type, id } = useParams();
  const [loading, setLoading] = useState(false);
  const user = useSelector((state) => state.auth.user);
  console.log(id);

  const [visitLead, setVisitLead] = useState({
    vis_staff_id: user?.staff_id,
    vis_lead_id: Number(id),
    visit_details: "",
    visit_type: "",
    visit_date: "",
    vis_status: "",
    lead_status: "Visit created",
    leadType: type,
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

    setLoading(true);
    try {
      // First API call: Create a visit
      const response = await axios.post(
        `https://crm-generalize.dentalguru.software/api/employe-visit`,
        visitLead,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201) {
        console.log("Visit created successfully:", response.data);
        cogoToast.success("Visit created successfully");

        fetchVisit();
        fetchLeads();
        fetchMetaLeads();
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

              {/* Visit Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Visit Type
                </label>
                <select
                  name="visit_type"
                  value={visitLead.visit_type}
                  onChange={handleInputChangeVisit}
                  className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-cyan-500"
                  required
                >
                  <option value="">Select Visit Type</option>
                  <option value="Fresh">Fresh</option>
                  <option value="Re-visit">Re-Visit</option>
                  <option value="Self">Self</option>
                  <option value="Associative">Associative</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* visit details */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Visit Details
                </label>
                <textarea
                  type="text"
                  name="visit_details"
                  value={visitLead.visit_details}
                  onChange={handleInputChangeVisit}
                  className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-cyan-500"
                  required
                />
              </div>

              {/* Visit Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Visit Status
                </label>
                <select
                  name="vis_status"
                  value={visitLead.vis_status}
                  onChange={handleInputChangeVisit}
                  className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-cyan-500"
                  required
                >
                  <option value="">Select Visit Status</option>
                  <option value="Pending">Pending</option>
                  <option value="Done">Done</option>
                  <option value="Cancelled">Cancelled</option>
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

export default VisitCreationPopup;
