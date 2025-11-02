import React, { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import cogoToast from "cogo-toast";
import { useSelector } from "react-redux";
import { IoCloseSharp } from "react-icons/io5";
import { useParams } from "react-router-dom";

const SuperUnitUpdatePopup = ({ isOpen, onClose, fetchUnits, selected }) => {
  const { id } = useParams();
  const modalRef = useRef();
  const EmpId = useSelector((state) => state.auth.user);
  const token = EmpId?.token;
  const userId = EmpId?.user_id;
  const orgId = EmpId?.staff_org_id;

  const [loading, setLoading] = useState(false);
  const [unitData, setUnitData] = useState({
    unit_org_id: selected?.unit_org_id,
    unit_project_id: selected?.unit_project_id,
    unit_number: "",
    unit_area: "",
    unit_type: "",
    custom_unit_type: "",
    base_price: "",
    unit_status: "",
  });

  useEffect(() => {
    setUnitData({
      unit_org_id: selected?.unit_org_id,
      unit_project_id: selected?.unit_project_id,
      unit_number: selected?.unit_number,
      unit_area: selected?.unit_area,
      unit_type: selected?.unit_type,
      custom_unit_type: selected?.custom_unit_type,
      base_price: selected?.base_price,
      unit_status: selected?.unit_status,
    });
  }, [selected]);

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUnitData({ ...unitData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.put(
        `https://crm-generalize.dentalguru.software/api/edit-unit/${selected?.unit_id}`,
        unitData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      cogoToast.success("Unit added successfully!");
      fetchUnits();
      setUnitData({
        unit_org_id: selected?.unit_org_id,
        unit_project_id: selected?.unit_project_id,
        unit_number: "",
        unit_area: "",
        unit_type: "",
        custom_unit_type: "",
        base_price: "",
        unit_status: "",
      });
      onClose();
    } catch (error) {
      cogoToast.error("Failed to add unit. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999] p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            ref={modalRef}
            initial={{ scale: 0.9, opacity: 0, y: -20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl mx-3 p-6 
                   max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-600 hover:text-red-500 transition"
            >
              <IoCloseSharp className="w-7 h-7" />
            </button>

            <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
              Update Unit Details
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Unit Number */}
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">
                    Unit Number
                  </label>
                  <input
                    type="text"
                    name="unit_number"
                    value={unitData.unit_number}
                    onChange={handleChange}
                    placeholder="e.g., 101"
                    className="p-3 border rounded-lg w-full"
                  />
                </div>
                {/* Unit Type */}
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">
                    Unit Type
                  </label>
                  <select
                    name="unit_type"
                    value={unitData.unit_type}
                    onChange={handleChange}
                    className="w-full p-3 border rounded-lg"
                  >
                    <option value="">Select Unit Type</option>
                    <option value="Flat">Flat</option>
                    <option value="Villa">Villa</option>
                    <option value="Plot">Plot</option>
                    <option value="Other">Other</option>
                  </select>
                  {unitData.unit_type === "Other" && (
                    <input
                      type="text"
                      name="custom_unit_type"
                      value={unitData.custom_unit_type}
                      onChange={handleChange}
                      placeholder="Enter custom unit type"
                      className="mt-2 w-full px-3 py-2 border rounded-lg"
                    />
                  )}
                </div>

                {/* Unit Size */}
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">
                    Unit Area (sqft)
                  </label>
                  <input
                    type="number"
                    name="unit_area"
                    value={unitData.unit_area}
                    onChange={handleChange}
                    placeholder="e.g., 500"
                    className="p-3 border rounded-lg w-full"
                    required
                    min={0}
                    onKeyDown={(e) => {
                      if (e.key === "-" || e.key === "Subtract") {
                        e.preventDefault();
                      }
                    }}
                  />
                </div>

                {/* Base Price */}
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">
                    Base Price
                  </label>
                  <input
                    type="number"
                    name="base_price"
                    value={unitData.base_price}
                    onChange={handleChange}
                    placeholder="Base Price"
                    className="p-3 border rounded-lg w-full"
                    required
                    min={0}
                    onKeyDown={(e) => {
                      if (e.key === "-" || e.key === "Subtract") {
                        e.preventDefault();
                      }
                    }}
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-1">
                    Unit Status
                  </label>
                  <select
                    name="unit_status"
                    value={unitData.unit_status}
                    onChange={handleChange}
                    className="w-full p-3 border rounded-lg"
                  >
                    <option value="Available">Available</option>
                    <option value="Sold">Sold</option>
                    <option value="Reserved">Reserved</option>
                  </select>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  disabled={loading}
                  className="w-full bg-cyan-600 text-white py-3 rounded-lg hover:bg-cyan-700 transition font-semibold shadow-md"
                >
                  {loading ? "Saving..." : "Add Unit"}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SuperUnitUpdatePopup;
