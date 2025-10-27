import React, { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import cogoToast from "cogo-toast";
import { useSelector } from "react-redux";
import { IoCloseSharp } from "react-icons/io5";

const UpdateProfilePopup = ({
  isOpen,
  onClose,
  selected,
  fetchEmployeeData,
}) => {
  const modalRef = useRef();
  const EmpId = useSelector((state) => state.auth.user);
  const token = EmpId?.token;
  const userId = EmpId.staff_id;
  const [loading, setLoading] = useState(false);
  const [newEmployee, setNewEmployee] = useState({
    staff_role: "",
    staff_name: "",
    staff_email: "",
    staff_phone: "",
    staff_password: "",
    staff_status: "",
  });

  // Reset lead data when editing
  useEffect(() => {
    setNewEmployee({
      staff_role: selected?.staff_role,
      staff_name: selected?.staff_name,
      staff_email: selected?.staff_email,
      staff_phone: selected?.staff_phone,
      staff_password: "",
      staff_status: selected?.staff_status,
    });
  }, [selected]);

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
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "staff_phone") {
      const numericValue = value.replace(/[^0-9]/g, "").slice(0, 10);
      setNewEmployee((prev) => ({ ...prev, [name]: numericValue }));
    } else {
      setNewEmployee((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSaveEmployee = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.put(
        `https://crm-generalize.dentalguru.software/api/updateEmployeeDetails/${selected?.staff_id}`,
        newEmployee,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchEmployeeData();
      setLoading(false);
      onClose();
    } catch (error) {
      cogoToast.error(error.response.data.message);
      console.error(
        "Error saving employee:",
        error.response?.data,
        error?.message
      );
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
            className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl mx-3 p-6"
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-cyan-700">
                Update Profile
              </h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-red-500 transition"
              >
                <IoCloseSharp className="w-6 h-6" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveEmployee}>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Name */}
                <div className="flex flex-col">
                  <label
                    htmlFor="name"
                    className="block mb-1 text-sm font-medium"
                  >
                    Name
                  </label>
                  <input
                    required
                    type="text"
                    name="staff_name"
                    value={newEmployee.staff_name}
                    onChange={handleInputChange}
                    placeholder="Name"
                    className={`p-2 border rounded-lg`}
                  />
                </div>

                {/* Email */}
                <div className="flex flex-col">
                  <label
                    htmlFor="email"
                    className="block mb-1 text-sm font-medium"
                  >
                    Email
                  </label>
                  <input
                    required
                    type="email"
                    name="staff_email"
                    value={newEmployee.staff_email}
                    onChange={handleInputChange}
                    placeholder="Email"
                    className={`p-2 border rounded-lg`}
                  />
                </div>

                {/* Password */}
                {/* <div className="flex flex-col relative">
                  <label
                    htmlFor="password"
                    className="block mb-1 text-sm font-medium"
                  >
                    Password
                  </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="staff_password"
                    value={newEmployee.staff_password}
                    onChange={handleInputChange}
                    placeholder="Password"
                    className="p-2 border rounded-lg pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? (
                      <IoEyeOff size={20} />
                    ) : (
                      <IoEye size={20} />
                    )}
                  </button>
                </div> */}

                {/* Position */}
                {/* <div className="flex flex-col">
                  <label
                    htmlFor="position"
                    className="block mb-1 text-sm font-medium"
                  >
                    Employee Role
                  </label>

                  <select
                    required
                    name="staff_role"
                    value={newEmployee.staff_role}
                    onChange={handleInputChange}
                    className={`p-2 border rounded-lg `}
                  >
                    <option value="">--select--</option>
                    <option value="superadmin">Super Admin</option>
                    <option value="admin">Admin</option>
                    <option value="employee">Employee</option>
                  </select>
                </div> */}

                {/* Phone */}
                <div className="flex flex-col">
                  <label
                    htmlFor="phone"
                    className="block mb-1 text-sm font-medium"
                  >
                    Phone
                  </label>
                  <input
                    required
                    type="text"
                    name="staff_phone"
                    value={newEmployee.staff_phone}
                    onChange={handleInputChange}
                    placeholder="Phone"
                    className={`p-2 border rounded-lg `}
                  />
                </div>
                {/* Position */}
                {/* <div className="flex flex-col">
                  <label
                    htmlFor="position"
                    className="block mb-1 text-sm font-medium"
                  >
                    Employee Status
                  </label>

                  <select
                    required
                    name="staff_status"
                    value={newEmployee.staff_status}
                    onChange={handleInputChange}
                    className={`p-2 border rounded-lg `}
                  >
                    <option value="">--select--</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div> */}
              </div>

              {/* Footer Buttons */}
              <div className="flex justify-end mt-6 space-x-4">
                <button
                  type="button"
                  onClick={() => onClose()}
                  className="px-4 py-2 text-white bg-gray-500 rounded-lg hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 text-white bg-cyan-500 rounded-lg hover:bg-cyan-600"
                >
                  {loading ? "Loading...." : "Submit"}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default UpdateProfilePopup;
