import React, { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import cogoToast from "cogo-toast";

const RemarkCreationPopup = ({
  isOpen,
  onClose,
  fetchRemark,
  fetchLeads,
  leads,
}) => {
  const modalRef = useRef();
  const [loading, setLoading] = useState(false);
  const [remark, setRemark] = useState({
    lead_id: "",
    name: "",
    employee_name: "",
    employeeId: "",
    remark_status: "",
    date: "",
  });

  const handleInputChangeRemark = (e) => {
    const { name, value } = e.target;
    setRemark((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const saveRemark = async (e) => {
    e.preventDefault();
    if (!remark.remark_status) {
      cogoToast.error("Please select a remark status.");
      return;
    }

    if (!remark.date) {
      cogoToast.error("Please select a date.");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(
        `https://crm-generalize.dentalguru.software/api/remarks`,
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

        fetchRemark();
        fetchLeads();
        setLoading(false);
        onClose();
      } else {
        setLoading(false);
        cogoToast.error("Failed to create remark and update lead.");
      }
    } catch (error) {
      console.error("Request failed:", error);
      setLoading(false);
      cogoToast.error("Failed to create remark and update lead.");
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
              Add Remark
            </h2>

            {/* Form */}
            <form onSubmit={saveRemark} className="space-y-4">
              {/* Project Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Project Name
                </label>
                <input
                  type="text"
                  name="project_name"
                  value={leads[0].project_name}
                  onChange={handleInputChangeRemark}
                  className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              {/* Lead ID */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Lead ID
                </label>
                <input
                  type="number"
                  name="lead_id"
                  value={leads[0].lead_id}
                  onChange={handleInputChangeRemark}
                  className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-cyan-500"
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
                  onChange={handleInputChangeRemark}
                  className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              {/* Remark Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Remark Status
                </label>
                <input
                  type="text"
                  name="remark_status"
                  value={remark.remark_status}
                  onChange={handleInputChangeRemark}
                  className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              {/* Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Date
                </label>
                <input
                  type="date"
                  name="date"
                  value={remark.date}
                  onChange={handleInputChangeRemark}
                  className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-cyan-500"
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

export default RemarkCreationPopup;
