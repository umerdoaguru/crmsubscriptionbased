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
  unitdata,
}) => {
  const modalRef = useRef();
  const { type } = useParams();
  const Emp = useSelector((state) => state.auth.user);
  const token = Emp?.token;
  const owner_org_id = Emp?.staff_org_id;

  console.log(leads);

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
    esu_sale_price: "",
    esu_token_amount: "",
    esu_token_amount_status: "",
    esu_booking_date: "",
    esu_final_date: "",
    esu_registery_name: "",
    esu_registery_date: "",
    esu_payment_method: "",
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
      const numericValue = value.replace(/\D/g, ""); // allow only digits
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

  const today = new Date().toISOString().split("T")[0];

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

      const response = await axios.post(
        `https://crm-generalize.dentalguru.software/api/unit-sold`,
        unitsold,
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Project Name
                  </label>
                  <input
                    type="text"
                    value={leads[0]?.project_name || ""}
                    disabled
                    className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Lead Name
                  </label>
                  <input
                    type="text"
                    value={
                      leads[0]?.name ||
                      getFieldValue(leads[0]?.question_fields_data, "full_name")
                    }
                    disabled
                    className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Unit Number
                  </label>
                  <input
                    type="text"
                    value={leads[0]?.unit_number || ""}
                    disabled
                    className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sold Date
                  </label>
                  <input
                    type="date"
                    name="esu_sold_date"
                    value={unitsold.esu_sold_date}
                    onChange={handleInputChangeUnitSold}
                    max={today}
                    className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
              </div>

              {/* Financial Details */}
              <div className="pt-4 border-t">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Sale Details
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Sale Price
                    </label>
                    <input
                      type="number"
                      name="esu_sale_price"
                      placeholder="Enter Sale Price"
                      value={unitsold.esu_sale_price}
                      onChange={handleInputChangeUnitSold}
                      className="w-full px-3 py-2 border rounded"
                    />
                    <small className="text-green-700">
                      Base Price - ₹{leads[0]?.base_price}
                    </small>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Token Amount
                    </label>
                    <input
                      type="number"
                      name="esu_token_amount"
                      placeholder="Enter Token Amount"
                      value={unitsold.esu_token_amount}
                      onChange={handleInputChangeUnitSold}
                      className="w-full px-3 py-2 border rounded"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Token Amount Status
                    </label>
                    <select
                      name="esu_token_amount_status"
                      value={unitsold.esu_token_amount_status}
                      onChange={handleInputChangeUnitSold}
                      className="w-full px-3 py-2 border rounded bg-white focus:ring-2 focus:ring-cyan-500"
                    >
                      <option value="">Select Status</option>
                      <option value="paid">paid</option>
                      <option value="unpaid">unpaid</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Payment Method
                    </label>
                    <select
                      name="esu_payment_method"
                      value={unitsold.esu_payment_method}
                      onChange={handleInputChangeUnitSold}
                      className="w-full px-3 py-2 border rounded bg-white focus:ring-2 focus:ring-cyan-500"
                    >
                      <option value="">Select Payment Method</option>
                      <option value="Cash">Cash</option>
                      <option value="Cheque">Cheque</option>
                      <option value="Bank Transfer">Bank Transfer</option>
                      <option value="Online">Online Payment</option>
                      <option value="UPI">UPI</option>
                      <option value="Credit/Debit Card">
                        Credit/Debit Card
                      </option>
                      <option value="EMI">EMI</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Booking and Registry */}
              <div className="pt-4 border-t">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Booking & Registry
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Booking Date
                    </label>
                    <input
                      type="date"
                      name="esu_booking_date"
                      value={unitsold.esu_booking_date}
                      onChange={handleInputChangeUnitSold}
                      className="w-full px-3 py-2 border rounded"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Final Date
                    </label>
                    <input
                      type="date"
                      name="esu_final_date"
                      value={unitsold.esu_final_date}
                      onChange={handleInputChangeUnitSold}
                      className="w-full px-3 py-2 border rounded"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Registry Name
                    </label>
                    <input
                      type="text"
                      name="esu_registery_name"
                      placeholder="Enter Registry Name"
                      value={unitsold.esu_registery_name}
                      onChange={handleInputChangeUnitSold}
                      className="w-full px-3 py-2 border rounded"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Registry Date
                    </label>
                    <input
                      type="date"
                      name="esu_registery_date"
                      value={unitsold.esu_registery_date}
                      onChange={handleInputChangeUnitSold}
                      className="w-full px-3 py-2 border rounded"
                    />
                  </div>
                </div>
              </div>

              {/* Owner Details */}
              <div className="pt-4 border-t">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Owner Details
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Owner Name
                    </label>
                    <input
                      type="text"
                      name="owner_name"
                      placeholder="Enter Owner Name"
                      value={unitsold.owner_name}
                      onChange={handleInputChangeUnitSold}
                      className="w-full px-3 py-2 border rounded"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Owner Email
                    </label>
                    <input
                      type="email"
                      name="owner_email"
                      placeholder="Enter Owner Email"
                      value={unitsold.owner_email}
                      onChange={handleInputChangeUnitSold}
                      className="w-full px-3 py-2 border rounded"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Owner Phone
                    </label>
                    <input
                      type="text"
                      name="owner_phone"
                      placeholder="Enter 10-digit Phone Number"
                      value={unitsold.owner_phone}
                      onChange={handleInputChangeUnitSold}
                      className="w-full px-3 py-2 border rounded"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Owner Address
                    </label>
                    <input
                      type="text"
                      name="owner_address"
                      placeholder="Enter Owner Address"
                      value={unitsold.owner_address}
                      onChange={handleInputChangeUnitSold}
                      className="w-full px-3 py-2 border rounded"
                    />
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div className="pt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  name="esu_notes"
                  value={unitsold.esu_notes}
                  onChange={handleInputChangeUnitSold}
                  placeholder="Write notes here"
                  className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-cyan-500"
                />
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
