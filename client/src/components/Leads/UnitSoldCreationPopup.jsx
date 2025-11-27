import React, { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import cogoToast from "cogo-toast";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import getFieldValue from "../../utils/getFieldValue";

const UnitSoldCreationPopup = ({
  isOpen,
  onClose,
  fetchUnitSoldEmployee,
  fetchUnitdata,
  fetchLeads,
  fetchMetaLeads,
  leads,
}) => {
  const modalRef = useRef();
  const { type } = useParams();
  const Emp = useSelector((state) => state.auth.user);
  const token = Emp?.token;
  const owner_org_id = Emp?.staff_org_id;

  const today = new Date().toISOString().split("T")[0];

  const [unitsold, setUnitSold] = useState({
    esu_lead_id: leads[0]?.lead_id || leads[0]?.leadgen_id,
    esu_staff_id: leads[0]?.staff_id || leads[0]?.meta_assignedTo,
    esu_unit_id: leads[0]?.unit_id || leads[0]?.meta_unit_id,
    esu_project_id: leads[0]?.project_id || leads[0]?.meta_project_id,

    esu_sale_price: "",
    esu_status: "sold",
    esu_final_sold_date: "",

    leadType: type,
    owner_org_id: owner_org_id,
    owner_name: "",
    owner_email: "",
    owner_phone: "",
    owner_address: "",
  });

  useEffect(() => {
    setUnitSold((prev) => ({
      ...prev,
      esu_lead_id: leads[0]?.lead_id || leads[0]?.leadgen_id,
      esu_staff_id: leads[0]?.staff_id || leads[0]?.meta_assignedTo,
      esu_unit_id: leads[0]?.unit_id || leads[0]?.meta_unit_id,
      esu_project_id: leads[0]?.project_id || leads[0]?.meta_project_id,
      owner_org_id,
    }));
  }, [leads]);

  const handleInputChangeUnitSold = (e) => {
    const { name, value } = e.target;

    if (name === "owner_phone") {
      const numericValue = value.replace(/\D/g, "");
      if (numericValue.length <= 10) {
        setUnitSold((prev) => ({ ...prev, [name]: numericValue }));
      }
      return;
    }

    setUnitSold((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const [loading, setLoading] = useState(false);

  const saveUnitSold = async (e) => {
    e.preventDefault();

    if (window.__UNIT_SOLD_SUBMITTING__) return;
    window.__UNIT_SOLD_SUBMITTING__ = true;

    setLoading(true);

    try {
      if (
        !unitsold.owner_name ||
        !unitsold.owner_phone ||
        !unitsold.owner_email
      ) {
        cogoToast.warn("Please fill all required owner details");
        return;
      }

      if (unitsold.owner_phone.length !== 10) {
        cogoToast.warn("Mobile number must be 10 digits");
        return;
      }

      // ✅ Clean payload aligned with backend
      const payload = {
        esu_lead_id: unitsold.esu_lead_id,
        esu_staff_id: unitsold.esu_staff_id,
        esu_unit_id: unitsold.esu_unit_id,
        esu_project_id: unitsold.esu_project_id,

        esu_sale_price: unitsold.esu_sale_price,
        esu_status: unitsold.esu_status,
        esu_final_sold_date: unitsold.esu_final_sold_date,
        esu_payment_method: unitsold.esu_payment_method,

        owner_org_id: unitsold.owner_org_id,
        owner_name: unitsold.owner_name,
        owner_email: unitsold.owner_email,
        owner_phone: unitsold.owner_phone,
        owner_address: unitsold.owner_address,
      };

      await axios.post(
        `https://crm-generalize.dentalguru.software/api/unit-sold`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      cogoToast.success("Unit Sold saved successfully");
      fetchUnitdata();
      fetchLeads();
      fetchMetaLeads();
      fetchUnitSoldEmployee();
      onClose();
    } catch (error) {
      console.error("Request failed:", error);
      cogoToast.error("Failed to save Unit Sold data");
    } finally {
      setLoading(false);
      setTimeout(() => (window.__UNIT_SOLD_SUBMITTING__ = false), 800);
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
            className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-3xl mx-4 overflow-y-auto max-h-[90vh]"
            initial={{ scale: 0.9, opacity: 0, y: -30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 30 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-2xl font-bold mb-4 text-center text-cyan-700">
              Unit Sold Creation
            </h2>

            <form onSubmit={saveUnitSold} className="space-y-4">
              {/* Basic Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm">Project Name</label>
                  <input
                    type="text"
                    value={leads[0]?.project_name || ""}
                    disabled
                    className="w-full px-3 py-2 border rounded bg-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm">Lead Name</label>
                  <input
                    type="text"
                    value={
                      leads[0]?.name ||
                      getFieldValue(leads[0]?.question_fields_data, "full_name")
                    }
                    disabled
                    className="w-full px-3 py-2 border rounded bg-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm">Unit Number</label>
                  <input
                    type="text"
                    value={leads[0]?.unit_number || ""}
                    disabled
                    className="w-full px-3 py-2 border rounded bg-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm">Final Sold Date</label>
                  <input
                    type="date"
                    name="esu_final_sold_date"
                    value={unitsold.esu_final_sold_date}
                    onChange={handleInputChangeUnitSold}
                    max={today}
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
              </div>

              {/* Financial Details */}
              <div className="pt-4 border-t">
                <h3 className="text-lg font-semibold mb-2">Sale Details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm">Final Sale Price</label>
                    <input
                      type="number"
                      name="esu_sale_price"
                      value={unitsold.esu_sale_price}
                      onChange={handleInputChangeUnitSold}
                      placeholder="Enter Sale Price"
                      className="w-full px-3 py-2 border rounded"
                    />
                  </div>

                  <div>
                    <label className="block text-sm">Sale Status</label>
                    <select
                      name="esu_status"
                      value={unitsold.esu_status}
                      onChange={handleInputChangeUnitSold}
                      className="w-full px-3 py-2 border rounded bg-white"
                    >
                      <option value="booked">Booked</option>
                      <option value="registry_done">Registry Done</option>
                      <option value="sold">Sold</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Owner Details */}
              <div className="pt-4 border-t">
                <h3 className="text-lg font-semibold mb-2">Owner Details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm">Owner Name</label>
                    <input
                      type="text"
                      name="owner_name"
                      value={unitsold.owner_name}
                      onChange={handleInputChangeUnitSold}
                      placeholder="Enter Owner Name"
                      className="w-full px-3 py-2 border rounded"
                    />
                  </div>

                  <div>
                    <label className="block text-sm">Owner Email</label>
                    <input
                      type="email"
                      name="owner_email"
                      value={unitsold.owner_email}
                      onChange={handleInputChangeUnitSold}
                      placeholder="Enter Owner Email"
                      className="w-full px-3 py-2 border rounded"
                    />
                  </div>

                  <div>
                    <label className="block text-sm">Owner Phone</label>
                    <input
                      type="text"
                      name="owner_phone"
                      value={unitsold.owner_phone}
                      onChange={handleInputChangeUnitSold}
                      placeholder="Enter 10-digit Phone Number"
                      className="w-full px-3 py-2 border rounded"
                    />
                  </div>

                  <div>
                    <label className="block text-sm">Owner Address</label>
                    <input
                      type="text"
                      name="owner_address"
                      value={unitsold.owner_address}
                      onChange={handleInputChangeUnitSold}
                      placeholder="Enter Owner Address"
                      className="w-full px-3 py-2 border rounded"
                    />
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t">
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
