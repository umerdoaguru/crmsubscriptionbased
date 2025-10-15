import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import cogoToast from "cogo-toast";
import { useSelector } from "react-redux";
import moment from "moment";

const OwnerPaymentSavePopup = ({
  isOpen,
  onClose,
  unitSoldData,
  fetchUnitSoldData,
}) => {
  const user = useSelector((state) => state.auth.user);
  const [formData, setFormData] = useState({
    op_sale_id: "",
    op_owner_id: "",
    op_org_id: user?.staff_org_id || "",
    op_amount: "",
    op_paid_date: "",
    op_reference_no: "",
    op_payment_method: "",
    op_remark: "",
  });

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
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requiredFields = [
      "op_sale_id",
      "op_owner_id",
      "op_org_id",
      "op_amount",
      "op_paid_date",
      "op_payment_method",
    ];

    const missingFields = requiredFields.filter((f) => !formData[f]);
    if (missingFields.length > 0) {
      cogoToast.error("Please fill all required fields");
      return;
    }

    try {
      const res = await axios.post(
        "https://crm-generalize.dentalguru.software/api/owner-payments/create",
        formData
      );

      if (res.data.success) {
        cogoToast.success("Owner payment added successfully!");
        fetchUnitSoldData();
        onClose();
      } else {
        cogoToast.error(res.data.message || "Failed to add payment");
      }
    } catch (error) {
      console.error(error);
      cogoToast.error("Error while saving data");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div
        ref={modalRef}
        className="bg-white rounded-2xl w-[90%] max-w-lg p-6 shadow-xl relative animate-fadeIn"
      >
        <h2 className="text-xl font-semibold mb-4 text-gray-800 text-center">
          Add Owner Payment
        </h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-gray-600 mb-1">Sale ID *</label>
            <input
              type="text"
              name="op_sale_id"
              value={formData.op_sale_id}
              onChange={handleChange}
              placeholder="Enter sale ID"
              className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-300 outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-gray-600 mb-1">Owner ID *</label>
            <input
              type="text"
              name="op_owner_id"
              value={formData.op_owner_id}
              onChange={handleChange}
              placeholder="Enter owner ID"
              className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-300 outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-gray-600 mb-1">Amount (₹) *</label>
            <input
              type="number"
              name="op_amount"
              value={formData.op_amount}
              onChange={handleChange}
              placeholder="Enter payment amount"
              className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-300 outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-gray-600 mb-1">Paid Date *</label>
            <input
              type="date"
              name="op_paid_date"
              value={formData.op_paid_date}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-300 outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-gray-600 mb-1">Payment Method *</label>
            <select
              name="op_payment_method"
              value={formData.op_payment_method}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-300 outline-none"
              required
            >
              <option value="">Select method</option>
              <option value="Cash">Cash</option>
              <option value="Cheque">Cheque</option>
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="UPI">UPI</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-600 mb-1">Reference No</label>
            <input
              type="text"
              name="op_reference_no"
              value={formData.op_reference_no}
              onChange={handleChange}
              placeholder="Enter reference number (if any)"
              className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-300 outline-none"
            />
          </div>

          <div>
            <label className="block text-gray-600 mb-1">Remark</label>
            <textarea
              name="op_remark"
              value={formData.op_remark}
              onChange={handleChange}
              placeholder="Enter remarks (optional)"
              className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-300 outline-none"
              rows={2}
            ></textarea>
          </div>

          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OwnerPaymentSavePopup;
