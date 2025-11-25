import React, { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import cogoToast from "cogo-toast";
import { useSelector } from "react-redux";

const UpdateUtilityPopup = ({
  isOpen,
  onClose,
  fetchUtilityBills,
  selected,
}) => {
  const modalRef = useRef();
  const Emp = useSelector((state) => state.auth.user);
  const token = Emp?.token;
  const [loading, setLoading] = useState(false);
  const today = new Date().toISOString().split("T")[0];
  const [utility, setUtility] = useState({
    utility_type: "",
    utility_amount: "",
    utility_date: "",
    description: "",
  });

  useEffect(() => {
    setUtility({
      ...utility,
      utility_type: selected?.utility_type,
      utility_amount: selected?.utility_amount,
      utility_date: selected?.utility_date,
      description: selected?.description,
    });
  }, [selected]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUtility((prev) => ({ ...prev, [name]: value }));
  };

  console.log(utility);

  const updateUtility = async (e) => {
    e.preventDefault();

    if (window.__UNIT_SOLD_SUBMITTING__) return;
    window.__UNIT_SOLD_SUBMITTING__ = true;

    setLoading(true);

    try {
      const res = await axios.put(
        `https://crm-generalize.dentalguru.software/api/updateUtilityCharges/${selected?.utility_id}`,
        utility,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      cogoToast.success("Utility record updated successfully");
      fetchUtilityBills();
      onClose();
    } catch (err) {
      console.error(err);
      cogoToast.error("Failed to save data");
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
              Update Utility Bill
            </h2>

            <form onSubmit={updateUtility} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm">Utility Type</label>
                  <select
                    value={utility?.utility_type}
                    name="utility_type"
                    className="w-full px-3 py-2 border rounded"
                    onChange={handleChange}
                  >
                    <option value="">--select--</option>
                    <option value="Electricity">Electricity</option>
                    <option value="Water">Water</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="NOC">NOC</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm">Utility Amount</label>
                  <input
                    type="text"
                    name="utility_amount"
                    value={utility?.utility_amount}
                    placeholder="Enter Utility Amount"
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>

                <div>
                  <label className="text-sm">Utility Date</label>
                  <input
                    type="date"
                    name="utility_date"
                    value={utility.utility_date}
                    onChange={handleChange}
                    max={today}
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
                <div className="sm:col-span-3">
                  <label className="block text-sm font-medium mb-1">
                    Utility Description
                  </label>
                  <textarea
                    name="description"
                    value={utility.description}
                    onChange={handleChange}
                    placeholder="Add description..."
                    className="w-full px-3 py-2 border rounded"
                    rows={4}
                  />
                </div>
              </div>

              {/* ---------- BUTTONS ---------- */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  className="bg-gray-500 text-white px-4 py-2 rounded"
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

export default UpdateUtilityPopup;
