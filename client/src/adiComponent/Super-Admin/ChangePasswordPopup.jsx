import React, { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import cogoToast from "cogo-toast";
import { useSelector } from "react-redux";
import { IoCloseSharp, IoEye, IoEyeOff } from "react-icons/io5";

const ChangePasswordPopup = ({ isOpen, onClose, selected }) => {
  const modalRef = useRef();
  const EmpId = useSelector((state) => state.auth.user);
  const token = EmpId?.token;

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwords, setPasswords] = useState({
    existing_password: "",
    new_password: "",
    confirm_password: "",
  });

  // Close on outside click or escape
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPasswords((prev) => ({ ...prev, [name]: value }));
  };

  const handleSavePassword = async (e) => {
    e.preventDefault();

    if (
      !passwords.existing_password ||
      !passwords.new_password ||
      !passwords.confirm_password
    ) {
      return cogoToast.error("All fields are required");
    }

    if (passwords.new_password !== passwords.confirm_password) {
      return cogoToast.error("New password and Confirm password do not match");
    }

    setLoading(true);
    try {
      await axios.put(
        `https://crm-generalize.dentalguru.software/api/updateEmployeeDetails/${selected?.staff_id}`,
        {
          staff_password: passwords.new_password,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      cogoToast.success("Password updated successfully!");
      setLoading(false);
      onClose();
    } catch (error) {
      cogoToast.error(
        error.response?.data?.message || "Error updating password"
      );
      console.error("Error updating password:", error);
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            ref={modalRef}
            initial={{ scale: 0.9, opacity: 0, y: -20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ duration: 0.25 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-3 p-6"
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-cyan-700">
                Update Password
              </h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-red-500 transition"
              >
                <IoCloseSharp className="w-6 h-6" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSavePassword} className="space-y-5">
              {/* Existing Password */}
              <div className="flex flex-col">
                <label className="block mb-1 text-sm font-medium">
                  Existing Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="existing_password"
                    value={passwords.existing_password}
                    onChange={handleChange}
                    placeholder="Enter existing password"
                    className="p-2 border rounded-lg w-full"
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-2 text-gray-500"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <IoEyeOff /> : <IoEye />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div className="flex flex-col">
                <label className="block mb-1 text-sm font-medium">
                  New Password
                </label>
                <input
                  type="password"
                  name="new_password"
                  value={passwords.new_password}
                  onChange={handleChange}
                  placeholder="Enter new password"
                  className="p-2 border rounded-lg w-full"
                  required
                />
              </div>

              {/* Confirm Password */}
              <div className="flex flex-col">
                <label className="block mb-1 text-sm font-medium">
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirm_password"
                  value={passwords.confirm_password}
                  onChange={handleChange}
                  placeholder="Confirm new password"
                  className="p-2 border rounded-lg w-full"
                  required
                />
              </div>

              {/* Footer Buttons */}
              <div className="flex justify-end mt-6 space-x-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-white bg-gray-500 rounded-lg hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 text-white bg-cyan-500 rounded-lg hover:bg-cyan-600"
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

export default ChangePasswordPopup;
