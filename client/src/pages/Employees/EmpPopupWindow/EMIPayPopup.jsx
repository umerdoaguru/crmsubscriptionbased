import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import cogoToast from "cogo-toast";
import { useSelector } from "react-redux";

const EMIPayPopup = ({
  isOpen,
  onClose,
  selectedEMI,
  fetchLoanInstallments,
}) => {
  const superadminuser = useSelector((state) => state.auth.user);
  const token = superadminuser.token;
  const user = useSelector((state) => state.auth.user);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    inst_paid_amount: "",
    inst_paid_on: "",
    inst_paid_status: "",
  });

  console.log(selectedEMI);

  const modalRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      return updated;
    });
  };

  useEffect(() => {
    setFormData({
      ...formData,
      inst_paid_amount: selectedEMI?.inst_amount,
    });
  }, [selectedEMI]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.put(
        `https://crm-generalize.dentalguru.software/api/updateInstallments/${selectedEMI?.installment_id}`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        cogoToast.success("loan installment paid successfully!");
        fetchLoanInstallments();
        onClose();
        setLoading(false);
      } else {
        cogoToast.error(res.data.message || "Failed to pay EMI");
        setLoading(false);
      }
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
      cogoToast.error("Error while saving data");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div
        ref={modalRef}
        className="bg-white rounded-2xl w-[90%] max-w-2xl h-auto overflow-y-auto p-6 shadow-xl relative animate-fadeIn"
      >
        <h2 className="text-xl font-semibold mb-4 text-gray-800 text-center">
          Pay Loan Installments
        </h2>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {/* Loan Principal Amount */}
          <div>
            <label className="block text-gray-700 mb-1 font-medium">
              Paid Amount (₹) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="inst_paid_amount"
              value={formData.inst_paid_amount}
              onChange={handleChange}
              readOnly
              placeholder="Enter loan principal amount"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              required
            />
          </div>

          {/* Loan Start Date */}
          <div>
            <label className="block text-gray-700 mb-1 font-medium">
              Paid Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="inst_paid_on"
              value={formData.inst_paid_on}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              required
            />
          </div>

          {/* Loan Status */}
          <div>
            <label className="block text-gray-700 mb-1 font-medium">
              Status
            </label>
            <select
              name="inst_paid_status"
              value={formData.inst_paid_status}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            >
              <option value="">Select status</option>
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="partial">Partial</option>
              <option value="missed">Missed</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="md:col-span-2 flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              {loading ? "Paying..." : "Pay"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EMIPayPopup;
