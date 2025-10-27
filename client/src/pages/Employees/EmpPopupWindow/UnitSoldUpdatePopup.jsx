import React, { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import cogoToast from "cogo-toast";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

const UnitSoldUpdatePopup = ({
  isOpen,
  onClose,
  selectedUnit,
  fetchUnitSoldData,
  leads,
}) => {
  const modalRef = useRef();
  const { type } = useParams();
  const user = useSelector((state) => state.auth.user);
  const token = user?.token;
  const [loading, setLoading] = useState(false);
  const [unitsold, setUnitSold] = useState({
    esu_lead_id: "",
    esu_staff_id: "",
    esu_unit_id: "",
    esu_project_id: "",
    esu_sold_date: "",
    esu_notes: "",
    esu_sale_price: "",
    esu_token_amount: "",
    esu_token_paid_status: "",
    esu_booking_date: "",
    esu_final_date: "",
    registry_name: "",
    registry_date: "",
    esu_payment_method: "",
    remaining_amount: "",
  });

  // 🟢 Pre-fill form with edit data if provided
  useEffect(() => {
    if (selectedUnit) {
      setUnitSold({
        esu_lead_id: selectedUnit?.esu_lead_id || "",
        esu_staff_id: selectedUnit?.esu_staff_id || "",
        esu_unit_id: selectedUnit?.esu_unit_id || "",
        esu_project_id: selectedUnit?.esu_project_id || "",
        esu_sold_date: selectedUnit?.esu_sold_date || "",
        esu_notes: selectedUnit?.esu_notes || "",
        esu_sale_price: selectedUnit?.esu_sale_price || "",
        esu_token_amount: selectedUnit?.esu_token_amount || "",
        esu_token_paid_status: selectedUnit?.esu_token_paid_status || "",
        esu_booking_date: selectedUnit?.esu_booking_date || "",
        esu_final_date: selectedUnit?.esu_final_date || "",
        registry_name: selectedUnit?.registry_name || "",
        registry_date: selectedUnit?.registry_date || "",
        esu_payment_method: selectedUnit?.esu_payment_method || "",
        remaining_amount: selectedUnit?.remaining_amount || "",
      });
    }
  }, [selectedUnit]);

  const handleInputChangeUnitSold = (e) => {
    const { name, value } = e.target;
    setUnitSold((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const today = new Date().toISOString().split("T")[0];

  // 🟢 Update API handler
  const updateUnitSold = async (e) => {
    e.preventDefault();
    if (!selectedUnit?.esu_id) {
      cogoToast.error("Missing esu_id for update");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.put(
        `https://crm-generalize.dentalguru.software/api/updateEmployeeUnitSoldUpdate/${selectedUnit.esu_id}`,
        unitsold,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      cogoToast.success("Unit Sold updated successfully!");
      fetchUnitSoldData();
      onClose();
    } catch (error) {
      console.error("Update failed:", error);
      cogoToast.error(
        error.response?.data?.message || "Failed to update Unit Sold data"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) onClose();
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
              Update Unit Sold
            </h2>

            <form onSubmit={updateUnitSold} className="space-y-4">
              {/* Sold Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sold Date
                  </label>
                  <input
                    type="date"
                    name="esu_sold_date"
                    value={unitsold.esu_sold_date || ""}
                    onChange={handleInputChangeUnitSold}
                    max={today}
                    className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sale Price
                  </label>
                  <input
                    type="number"
                    name="esu_sale_price"
                    value={unitsold.esu_sale_price || ""}
                    onChange={handleInputChangeUnitSold}
                    placeholder="Enter Sale Price"
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
                    value={unitsold.esu_token_amount || ""}
                    onChange={handleInputChangeUnitSold}
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Token Paid Status
                  </label>
                  <select
                    name="esu_token_paid_status"
                    value={unitsold.esu_token_paid_status || ""}
                    onChange={handleInputChangeUnitSold}
                    className="w-full px-3 py-2 border rounded bg-white"
                  >
                    <option value="">Select Status</option>
                    <option value="paid">Paid</option>
                    <option value="unpaid">Unpaid</option>
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
                    <option value="Credit/Debit Card">Credit/Debit Card</option>
                    <option value="EMI">EMI</option>
                  </select>
                </div>
              </div>

              {/* Booking, Registry, Notes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t pt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Booking Date
                  </label>
                  <input
                    type="date"
                    name="esu_booking_date"
                    value={unitsold.esu_booking_date || ""}
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
                    value={unitsold.esu_final_date || ""}
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
                    name="registry_name"
                    value={unitsold.registry_name || ""}
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
                    name="registry_date"
                    value={unitsold.registry_date || ""}
                    onChange={handleInputChangeUnitSold}
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
              </div>

              {/* Notes */}
              <div className="pt-4 border-t">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  name="esu_notes"
                  value={unitsold.esu_notes || ""}
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
                  {loading ? "Updating..." : "Update"}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default UnitSoldUpdatePopup;
