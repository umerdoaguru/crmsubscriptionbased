import React, { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import cogoToast from "cogo-toast";
import { useSelector } from "react-redux";

const UpdatePayStatPop = ({
  isOpen,
  onClose,
  selected,
  fetchTransactionData,
}) => {
  const modalRef = useRef();
  const Emp = useSelector((state) => state.auth.user);
  const token = Emp?.token;
  console.log(selected?.esu_id);
  console.log(Emp);

  const today = new Date().toISOString().split("T")[0];
  const [loading, setLoading] = useState(false);

  const [payment, setPayment] = useState({
    pt_org_id: Emp?.staff_org_id,
    txn_id: "",
    pt_esu_id: "",
    pt_amount: "",
    pt_type: "",
    pt_method: "",
    txn_date: "",
    pt_notes: "",
  });

  useEffect(() => {
    setPayment((prev) => ({
      ...prev,
      pt_org_id: Emp?.staff_org_id,
      txn_id: selected?.txn_id,
      pt_esu_id: selected?.pt_esu_id,
      pt_amount: selected?.pt_amount,
      pt_type: selected?.pt_type,
      pt_method: selected?.pt_method,
      txn_date: selected?.txn_date,
      pt_notes: selected?.pt_notes,
    }));
  }, [selected]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPayment((prev) => ({ ...prev, [name]: value }));
  };

  const savePayment = async (e) => {
    e.preventDefault();

    if (window.__PAYMENT_SUBMITTING__) return;
    window.__PAYMENT_SUBMITTING__ = true;

    setLoading(true);

    try {
      const res = await axios.put(
        `https://crm-generalize.dentalguru.software/api/updatePaymentRecord/${selected?.pt_id}`,
        payment,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      cogoToast.success("Payment details update successfully!");
      fetchTransactionData();
      onClose();
    } catch (err) {
      console.error(err);
      cogoToast.error("Failed to save payment");
    } finally {
      setLoading(false);
      setTimeout(() => (window.__PAYMENT_SUBMITTING__ = false), 800);
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
              Update Payment Transaction
            </h2>

            <form onSubmit={savePayment} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* txn_id */}
                <div>
                  <label className="text-sm">Transaction ID</label>
                  <input
                    type="text"
                    name="txn_id"
                    value={payment.txn_id}
                    onChange={handleChange}
                    placeholder="Enter Transaction ID"
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>

                {/* pt_amount */}
                <div>
                  <label className="text-sm">Amount</label>
                  <input
                    type="text"
                    name="pt_amount"
                    value={payment.pt_amount}
                    onChange={handleChange}
                    placeholder="Enter Amount"
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>

                {/* txn_date */}
                <div>
                  <label className="text-sm">Transaction Date</label>
                  <input
                    type="date"
                    name="txn_date"
                    value={payment.txn_date}
                    onChange={handleChange}
                    max={today}
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>

                {/* pt_type */}
                <div>
                  <label className="text-sm">Payment Type</label>
                  <input
                    type="text"
                    name="pt_type"
                    value={payment.pt_type}
                    readOnly
                    className="w-full px-3 py-2 border rounded bg-gray-100 cursor-not-allowed"
                  />
                </div>

                {/* pt_method */}
                <div>
                  <label className="text-sm">Payment Method</label>
                  <select
                    name="pt_method"
                    value={payment.pt_method}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded"
                  >
                    <option value="">--select--</option>
                    <option value="cash">Cash</option>
                    <option value="bank">Bank</option>
                    <option value="upi">UPI</option>
                    <option value="cheque">Cheque</option>
                  </select>
                </div>

                {/* receipt_url */}
                {/* <div>
                  <label className="text-sm">Receipt URL</label>
                  <input
                    type="text"
                    name="receipt_url"
                    value={payment.receipt_url}
                    onChange={handleChange}
                    placeholder="Add receipt link"
                    className="w-full px-3 py-2 border rounded"
                  />
                </div> */}

                {/* Notes */}
                <div className="sm:col-span-3">
                  <label className="text-sm font-medium">Notes</label>
                  <textarea
                    name="pt_notes"
                    value={payment.pt_notes}
                    onChange={handleChange}
                    placeholder="Add notes..."
                    className="w-full px-3 py-2 border rounded"
                    rows={3}
                  />
                </div>
              </div>

              {/* BUTTONS */}
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
                  {loading ? "Saving..." : "Save Payment"}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default UpdatePayStatPop;
