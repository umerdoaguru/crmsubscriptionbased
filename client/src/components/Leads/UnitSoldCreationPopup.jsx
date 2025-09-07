import React, { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import cogoToast from "cogo-toast";
import { useSelector } from "react-redux";

const UnitSoldCreationPopup = ({
  isOpen,
  onClose,
  fetchUnitSoldEmployee,
  fetchUnitdata,
  fetchLeads,
  leads,
  unitdata,
}) => {
  const modalRef = useRef();
  const EmpId = useSelector((state) => state.auth.user);
  const token = EmpId?.token;
  const userId = EmpId.user_id;
  const [loading, setLoading] = useState(false);
  const [unitsold, setUnitSold] = useState({
    lead_id: "",
    name: "",
    employee_name: "",
    employeeId: "",
    unit_no: "",
    unit_id: "",
    unit_status: "",
    main_project_id: "",
    date: "",
  });

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
    if (!unitsold.unit_status) {
      cogoToast.error("Please select a unitsold status.");
      return;
    }

    if (!unitsold.date) {
      cogoToast.error("Please select a date.");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(
        `https://crm-generalize.dentalguru.software/api/unit-sold`,
        {
          project_name: leads[0].project_name,
          main_project_id: leads[0].main_project_id,
          lead_id: leads[0].lead_id,
          name: leads[0].name,
          employee_name: leads[0].assignedTo,
          employeeId: leads[0].employeeId,
          unit_id: leads[0].unit_id,
          unit_no: unitsold.unit_no,
          unit_status: unitsold.unit_status,
          date: unitsold.date,
          user_id: userId,
        }
      );

      if (response.status === 201) {
        const putResponse = await axios.put(
          `https://crm-generalize.dentalguru.software/api/unit-data/${unitsold.unit_no}`,
          { unit_status: unitsold.unit_status }
        );

        if (putResponse.status === 200) {
          console.log("Unit Status updated successfully:", putResponse.data);
        } else {
          console.error("Error updating Unit Status:", putResponse.data);
          setLoading(false);
          cogoToast.error("Failed to update the lead Unit Status.");
        }
        const putResponseUnit = await axios.put(
          `https://crm-generalize.dentalguru.software/api/updateOnlyUnitStatus/${leads[0].lead_id}`,
          { unit_number: unitsold.unit_no, unit_status: unitsold.unit_status }
        );

        if (putResponseUnit.status === 200) {
          console.log(
            "Unit of Lead Status updated successfully:",
            putResponseUnit.data
          );
        } else {
          console.error("Error updating Unit Status:", putResponseUnit.data);
          setLoading(false);
          cogoToast.error("Failed to update the lead Unit Status.");
        }

        cogoToast.success("UnitSold Save successfully");

        fetchUnitdata();
        fetchLeads();
        fetchUnitSoldEmployee();
        setLoading(false);
        onClose();
      }
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
                  onChange={handleInputChangeUnitSold}
                  className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-cyan-500"
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
                  onChange={handleInputChangeUnitSold}
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
                  onChange={handleInputChangeUnitSold}
                  className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              {/* Unit Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Unit Number
                </label>
                <select
                  name="unit_no"
                  value={unitsold.unit_no}
                  onChange={handleInputChangeUnitSold}
                  className="border rounded-2xl p-2 w-full"
                >
                  <option value="">Select Unit Number</option>
                  {unitdata.map((unit) => (
                    <option
                      key={unit.id}
                      value={unit.unit_number}
                      disabled={unit.status === "sold"} // Disable sold units
                    >
                      {unit.status === "sold"
                        ? `Sold ${unit.unit_number}`
                        : `Unit ${unit.unit_number} (Available)`}
                    </option>
                  ))}
                </select>
              </div>

              {/* Unit Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Unit Status
                </label>
                <select
                  name="unit_status"
                  value={unitsold.unit_status}
                  onChange={handleInputChangeUnitSold}
                  className="border rounded-2xl p-2 w-full"
                >
                  <option value="">Select Unit Status Type</option>
                  <option value="sold">Sold</option>
                </select>
              </div>

              {/* Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Date
                </label>
                <input
                  type="date"
                  name="date"
                  value={unitsold.date}
                  onChange={handleInputChangeUnitSold}
                  className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-cyan-500"
                  max={today}
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
