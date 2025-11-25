import React, { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import cogoToast from "cogo-toast";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import getFieldValue from "../../utils/getFieldValue";

const FInalSalePopup = ({ isOpen, onClose, leads, booking }) => {
  const modalRef = useRef();
  const { type, id } = useParams();
  const Emp = useSelector((state) => state.auth.user);
  const token = Emp?.token;
  console.log(leads);
  console.log(booking);

  const today = new Date().toISOString().split("T")[0];

  const [unitsold, setUnitSold] = useState({
    esu_sale_price: "",
    esu_final_sold_date: "",
    esu_payment_method: "Cash",
  });

  useEffect(() => {
    setUnitSold((prev) => ({
      ...prev,
      esu_sale_price: booking[0]?.esu_sale_price,
    }));
  }, [booking]);

  const handleInputChangeUnitSold = (e) => {
    const { name, value } = e.target;

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
      await axios.put(
        `https://crm-generalize.dentalguru.software/api/updateSoldDetails/${booking[0]?.esu_id}/${id}/${type}`,
        unitsold,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      cogoToast.success("Unit Sold saved successfully");
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
              Final Sale Details
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
                    <label className="block text-sm">Payment Method</label>
                    <select
                      name="esu_payment_method"
                      value={unitsold.esu_payment_method}
                      onChange={handleInputChangeUnitSold}
                      className="w-full px-3 py-2 border rounded bg-white"
                    >
                      <option value="Cash">Cash</option>
                      <option value="Bank Transfer">Bank Transfer</option>
                      <option value="Cheque">Cheque</option>
                      <option value="UPI">UPI</option>
                      <option value="Online">Online</option>
                      <option value="EMI">EMI</option>
                      <option value="Credit/Debit Card">
                        Credit/Debit Card
                      </option>
                    </select>
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

export default FInalSalePopup;
