import React, { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import cogoToast from "cogo-toast";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import getFieldValue from "../../utils/getFieldValue";

const UpdateBookingModal = ({
  isOpen,
  onClose,
  selected,
  fetchBookingData,
}) => {
  const modalRef = useRef();
  const { type } = useParams();
  const Emp = useSelector((state) => state.auth.user);
  const token = Emp?.token;
  console.log(selected);

  const [booking, setBooking] = useState({
    booking_amount: "",
    booking_date: "",
    booking_notes: "",
  });

  useEffect(() => {
    setBooking({
      ...booking,
      booking_amount: selected?.booking_amount,
      booking_date: selected?.booking_date,
      booking_notes: selected?.booking_notes,
    });
  }, [selected]);

  const handleInputChangeBooking = (e) => {
    const { name, value } = e.target;
    setBooking((prev) => ({ ...prev, [name]: value }));
  };

  const [loading, setLoading] = useState(false);

  const saveUnitSold = async (e) => {
    e.preventDefault();

    if (window.__UNIT_SOLD_SUBMITTING__) return;
    window.__UNIT_SOLD_SUBMITTING__ = true;

    setLoading(true);

    try {
      const soldRes = await axios.put(
        `https://crm-generalize.dentalguru.software/api/updateBooking/${selected?.booking_id}`,
        booking,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      cogoToast.success("booking details updated successfully");
      fetchBookingData();
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
              Unit Booking Update
            </h2>

            <form onSubmit={saveUnitSold} className="space-y-4">
              {/* ---------- BOOKING DETAILS ---------- */}
              <div className="pt-4 border-t">
                <h3 className="text-lg font-semibold mb-2">Booking Details</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Booking Amount
                    </label>
                    <input
                      type="number"
                      name="booking_amount"
                      value={booking.booking_amount}
                      onChange={handleInputChangeBooking}
                      placeholder="Enter Booking Amount"
                      className="w-full px-3 py-2 border rounded"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Booking Date
                    </label>
                    <input
                      type="date"
                      name="booking_date"
                      value={booking.booking_date}
                      onChange={handleInputChangeBooking}
                      className="w-full px-3 py-2 border rounded"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium mb-1">
                      Booking Notes
                    </label>
                    <input
                      type="text"
                      name="booking_notes"
                      value={booking.booking_notes}
                      onChange={handleInputChangeBooking}
                      placeholder="Add any notes"
                      className="w-full px-3 py-2 border rounded"
                    />
                  </div>
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

export default UpdateBookingModal;
