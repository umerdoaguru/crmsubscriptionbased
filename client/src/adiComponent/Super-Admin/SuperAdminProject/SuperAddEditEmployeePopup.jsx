import React, { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import cogoToast from "cogo-toast";
import { useSelector } from "react-redux";
import { IoCloseSharp } from "react-icons/io5";

const SuperAddEditEmployeePopup = ({
  isOpen,
  onClose,
  editingIndex,
  setEditingIndex,
  fetchEmployees,
}) => {
  const modalRef = useRef();
  const EmpId = useSelector((state) => state.auth.user);
  const token = EmpId?.token;
  const userId = EmpId.user_id;
  const [loading, setLoading] = useState(false);
  const [customLeadSource, setCustomLeadSource] = useState("");
  const [newEmployee, setNewEmployee] = useState({
    name: "",
    email: "",
    password: "",
    position: "",
    phone: "",
    user_id: userId,
  });

  console.log(editingIndex);

  // Reset lead data when editing
  useEffect(() => {
    if (editingIndex !== null) {
      setNewEmployee({
        name: editingIndex?.name,
        email: editingIndex?.email,
        password: editingIndex?.password,
        position: editingIndex?.position,
        phone: editingIndex?.phone,
        user_id: userId,
      });
    } else {
      setNewEmployee({
        name: "",
        email: "",
        password: "",
        position: "",
        phone: "",
        user_id: userId,
      });
    }
  }, [editingIndex]);

  // Close when clicking outside or pressing ESC
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        handleClose();
      }
    };
    const handleEscape = (e) => {
      if (e.key === "Escape") handleClose();
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const handleClose = () => {
    setEditingIndex(null);
    onClose();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "phone") {
      const numericValue = value.replace(/[^0-9]/g, "").slice(0, 10);
      setNewEmployee((prev) => ({ ...prev, [name]: numericValue }));
    } else {
      setNewEmployee((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleCustomLeadSourceChange = (e) => {
    setCustomLeadSource(e.target.value);
  };

  const handleSaveEmployee = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let response;
      if (editingIndex !== null) {
        response = await axios.put(
          `https://crm-generalize.dentalguru.software/api/updateEmployee/${editingIndex?.employeeId}`,
          newEmployee
        );
        setLoading(false);
        cogoToast.success("Employee data updated successfully");
      } else {
        // Add new employee
        response = await axios.post(
          "https://crm-generalize.dentalguru.software/api/addEmployee",
          newEmployee
        );
        setLoading(false);
        cogoToast.success("Employee data saved successfully");
      }

      // cogoToast.success(response.data.message);

      setNewEmployee({
        name: "",
        email: "",
        password: "",
        position: "",
        phone: "",
      });

      fetchEmployees();
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
                {editingIndex !== null ? "Edit Employee" : "Add Employee"}
              </h2>
              <button
                onClick={handleClose}
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
                    name="name"
                    value={newEmployee.name}
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
                    name="email"
                    value={newEmployee.email}
                    onChange={handleInputChange}
                    placeholder="Email"
                    className={`p-2 border rounded-lg`}
                  />
                </div>

                {/* Password */}
                <div className="flex flex-col">
                  <label
                    htmlFor="password"
                    className="block mb-1 text-sm font-medium"
                  >
                    Password
                  </label>
                  <input
                    required
                    type="text"
                    name="password"
                    value={newEmployee.password}
                    onChange={handleInputChange}
                    placeholder="Password"
                    className={`p-2 border rounded-lg`}
                  />
                </div>

                {/* Position */}
                <div className="flex flex-col">
                  <label
                    htmlFor="position"
                    className="block mb-1 text-sm font-medium"
                  >
                    Position
                  </label>
                  <input
                    required
                    type="text"
                    name="position"
                    value={newEmployee.position}
                    onChange={handleInputChange}
                    placeholder="Position"
                    className={`p-2 border rounded-lg `}
                  />
                </div>

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
                    name="phone"
                    value={newEmployee.phone}
                    onChange={handleInputChange}
                    placeholder="Phone"
                    className={`p-2 border rounded-lg `}
                  />
                </div>
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
                  {loading
                    ? "Loading...."
                    : editingIndex !== null
                    ? "Update"
                    : "Add"}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SuperAddEditEmployeePopup;
