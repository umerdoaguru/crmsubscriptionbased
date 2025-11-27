import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import cogoToast from "cogo-toast";
import { useSelector } from "react-redux";

const OwnerPaymentSavePopup = ({
  isOpen,
  onClose,
  unitSoldData,
  fetchUnitSoldData,
  fetchOwnerPayments,
  selectedOwnPay,
}) => {
  const superadminuser = useSelector((state) => state.auth.user);
  const token = superadminuser.token;
  const user = useSelector((state) => state.auth.user);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    op_sale_id: unitSoldData[0]?.esu_id,
    op_owner_id: unitSoldData[0]?.esu_owner_id,
    op_org_id: user?.staff_org_id || "",
    op_amount: "",
    op_paid_date: "",
    op_reference_no: "",
    op_payment_method: "",
    op_remark: "",
    op_remaining_amount: "",
  });

  console.log(unitSoldData);
  console.log(selectedOwnPay);

  const modalRef = useRef();

  useEffect(() => {
    setFormData({
      ...formData,
      op_sale_id: unitSoldData[0]?.esu_id,
      op_owner_id: unitSoldData[0]?.esu_owner_id,
      op_remaining_amount:
        (selectedOwnPay && selectedOwnPay?.op_remaining_amount) ||
        unitSoldData[0]?.esu_sale_price,
    });
  }, [unitSoldData, selectedOwnPay]);

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
    let updatedValue = value;

    if (name === "op_amount") {
      const payableAmount = Number(
        selectedOwnPay?.op_remaining_amount ||
          unitSoldData[0]?.esu_sale_price ||
          0
      );
      const enteredAmount = Number(value);

      if (enteredAmount > payableAmount) {
        cogoToast.warn("Amount cannot be greater than payable amount");
        return;
      }

      const remainingAmount = payableAmount - enteredAmount;

      setFormData({
        ...formData,
        op_amount: enteredAmount,
        op_remaining_amount: remainingAmount,
      });

      return;
    }

    setFormData({ ...formData, [name]: updatedValue });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
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
        "https://crm-generalize.dentalguru.software/api/createOwnerPayments",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        cogoToast.success("Owner payment added successfully!");
        fetchUnitSoldData();
        fetchOwnerPayments();
        onClose();
        setLoading(false);
      } else {
        cogoToast.error(res.data.message || "Failed to add payment");
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
        className="bg-white rounded-2xl w-[90%] max-w-2xl h-[90vh] overflow-y-auto p-6 shadow-xl relative animate-fadeIn"
      >
        <h2 className="text-xl font-semibold mb-4 text-gray-800 text-center">
          Add Final Sale Payment
        </h2>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {/* Amount */}
          <div>
            <label className="block text-gray-700 mb-1 font-medium">
              Amount (₹) <span className="text-red-500">*</span>
            </label>

            <input
              type="number"
              name="op_amount"
              value={formData.op_amount}
              onChange={handleChange}
              placeholder="Enter payment amount"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              required
            />
            <small className="block text-green-600 mb-1">
              Payable Amount: ₹
              {selectedOwnPay?.op_remaining_amount ||
                unitSoldData[0]?.esu_sale_price ||
                0}
            </small>
          </div>

          {/* Paid Date */}
          <div>
            <label className="block text-gray-700 mb-1 font-medium">
              Paid Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="op_paid_date"
              value={formData.op_paid_date}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              required
            />
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-gray-700 mb-1 font-medium">
              Payment Method <span className="text-red-500">*</span>
            </label>
            <select
              name="op_payment_method"
              value={formData.op_payment_method}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              required
            >
              <option value="">Select method</option>
              <option value="Cash">Cash</option>
              <option value="Cheque">Cheque</option>
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="UPI">UPI</option>
            </select>
          </div>

          {/* Reference No */}
          <div>
            <label className="block text-gray-700 mb-1 font-medium">
              Reference No
            </label>
            <input
              type="text"
              name="op_reference_no"
              value={formData.op_reference_no}
              onChange={handleChange}
              placeholder="Enter reference number (if any)"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>

          {/* Remark */}
          <div className="md:col-span-2">
            <label className="block text-gray-700 mb-1 font-medium">
              Remark
            </label>
            <textarea
              name="op_remark"
              value={formData.op_remark}
              onChange={handleChange}
              placeholder="Enter remarks (optional)"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              rows={2}
            ></textarea>
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
              {loading ? "Save....." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OwnerPaymentSavePopup;
