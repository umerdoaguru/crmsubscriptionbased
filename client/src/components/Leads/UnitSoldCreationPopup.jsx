import React, { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import cogoToast from "cogo-toast";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

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

const UnitSoldCreationPopup = ({
  isOpen,
  onClose,
  fetchUnitSoldEmployee,
  fetchUnitdata,
  fetchLeads,
  fetchMetaLeads,
  leads,
  unitdata,
}) => {
  const modalRef = useRef();
  const { type, id } = useParams();
  const EmpId = useSelector((state) => state.auth.user);
  const token = EmpId?.token;
  const userId = EmpId.user_id;
  const [loading, setLoading] = useState(false);
  const [unitsold, setUnitSold] = useState({
    esu_lead_id: leads[0]?.lead_id || leads[0]?.leadgen_id,
    esu_staff_id: leads[0]?.staff_id || leads[0]?.meta_assignedTo,
    esu_unit_id: leads[0]?.unit_id || leads[0]?.meta_unit_id,
    esu_project_id: leads[0]?.project_id || leads[0]?.meta_project_id,
    esu_sold_date: "",
    esu_notes: "",
    lead_status: "Sold",
    leadType: type,
  });

  console.log(leads);

  useEffect(() => {
    setUnitSold({
      ...unitsold,
      esu_lead_id: leads[0]?.lead_id || leads[0]?.leadgen_id,
      esu_staff_id: leads[0]?.staff_id || leads[0]?.meta_assignedTo,
      esu_unit_id: leads[0]?.unit_id || leads[0]?.meta_unit_id,
      esu_project_id: leads[0]?.project_id || leads[0]?.meta_project_id,
    });
  }, [leads]);

  console.log(unitsold);

  const handleInputChangeUnitSold = (e) => {
    const { name, value } = e.target;
    setUnitSold((prevLead) => ({
      ...prevLead,
      [name]: value,
    }));
  };

  const today = new Date().toISOString().split("T")[0];

  const saveUnitSold = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        `https://crm-generalize.dentalguru.software/api/unit-sold`,
        unitsold
      );
      cogoToast.success("UnitSold Save successfully");
      fetchUnitdata();
      fetchLeads();
      fetchMetaLeads();
      fetchUnitSoldEmployee();
      setLoading(false);
      onClose();
    } catch (error) {
      console.error("Request failed:", error);
      setLoading(false);
      cogoToast.error("Failed to Save Error.");
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
              Unit Sold Creation
            </h2>

            {/* Form */}
            <form onSubmit={saveUnitSold} className="space-y-4">
              {/* Project Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Project Name
                </label>
                <input
                  type="text"
                  name="project_name"
                  value={leads[0].project_name}
                  // onChange={handleInputChangeUnitSold}
                  disabled
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
                  value={
                    leads[0].name ||
                    getFieldValue(leads[0].question_fields_data, "full_name")
                  }
                  // onChange={handleInputChangeUnitSold}
                  disabled
                  className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              {/* Unit Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Unit Number
                </label>
                <input
                  type="text"
                  name="project_name"
                  value={leads[0].unit_number}
                  // onChange={handleInputChangeUnitSold}
                  disabled
                  className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              {/* Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Sold Date
                </label>
                <input
                  type="date"
                  name="esu_sold_date"
                  value={unitsold.esu_sold_date}
                  onChange={handleInputChangeUnitSold}
                  className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-cyan-500"
                  max={today}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Notes
                </label>
                <textarea
                  type="text"
                  name="esu_notes"
                  value={unitsold.esu_notes}
                  onChange={handleInputChangeUnitSold}
                  className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-cyan-500"
                  placeholder="Write notes here"
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

export default UnitSoldCreationPopup;
