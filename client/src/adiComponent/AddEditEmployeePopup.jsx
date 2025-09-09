import React, { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import cogoToast from "cogo-toast";
import { useSelector } from "react-redux";

const AddEditEmployeePopup = ({
  isOpen,
  onClose,
  fetchEmployees,
  editingIndex,
  setEditingIndex,
}) => {
  const modalRef = useRef();
  const EmpId = useSelector((state) => state.auth.user);
  const token = EmpId?.token;
  const userId = EmpId.user_id;
  const [loading, setLoading] = useState(false);
  const [newEmployee, setNewEmployee] = useState({
    name: "",
    email: "",
    password: "",
    position: "",
    phone: "",
    user_id: userId,
  });

  console.log(editingIndex);

  useEffect(() => {
    editingIndex
      ? setNewEmployee({
          name: editingIndex?.name,
          email: editingIndex?.email,
          password: editingIndex?.password,
          position: editingIndex?.position,
          phone: editingIndex?.phone,
          user_id: userId,
        })
      : setNewEmployee({
          name: "",
          email: "",
          password: "",
          position: "",
          phone: "",
          user_id: userId,
        });
  }, [editingIndex]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "phone") {
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
      if (editingIndex !== null) {
        await axios.put(
          `https://crm-generalize.dentalguru.software/api/updateEmployee/${editingIndex?.employeeId}`,
          newEmployee
        );
        cogoToast.success("Data updated successfully");
        setLoading(false);
      } else {
        // Add new employee
        await axios.post(
          "https://crm-generalize.dentalguru.software/api/addEmployee",
          newEmployee
        );
        cogoToast.success("Data added successfully");
        setLoading(false);
      }
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
      console.error(
        "Error saving employee:",
        error.response?.data || error.message
      );
      setLoading(false);
    }
  };

  const handleClose = () => {
    // setIsEditing(false);
    onClose();
  };

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
            className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md mx-2 max-h-[95%] overflow-y-auto"
            initial={{ scale: 0.9, opacity: 0, y: -30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 30 }}
            transition={{ duration: 0.3 }}
          >
            {/* Title */}
            <h3 className="mb-4 text-lg font-bold">
              {editingIndex !== null ? "Edit Employee" : "Add Employee"}
            </h3>

            {/* Form */}
            <form onSubmit={handleSaveEmployee}>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Name */}
                <div>
                  <label
                    htmlFor="name"
                    className="block mb-1 text-sm font-medium"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={newEmployee.name}
                    onChange={handleInputChange}
                    placeholder="Name"
                    className={`p-2 border rounded-lg w-full`}
                  />
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="block mb-1 text-sm font-medium"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={newEmployee.email}
                    onChange={handleInputChange}
                    placeholder="Email"
                    className={`p-2 border rounded-lg w-full `}
                  />
                </div>

                {/* Password */}
                <div>
                  <label
                    htmlFor="password"
                    className="block mb-1 text-sm font-medium"
                  >
                    Password
                  </label>
                  <input
                    type="text"
                    name="password"
                    value={newEmployee.password}
                    onChange={handleInputChange}
                    placeholder="Password"
                    className={`p-2 border rounded-lg w-full`}
                  />
                </div>

                {/* Position */}
                <div>
                  <label
                    htmlFor="position"
                    className="block mb-1 text-sm font-medium"
                  >
                    Position
                  </label>
                  <input
                    type="text"
                    name="position"
                    value={newEmployee.position}
                    onChange={handleInputChange}
                    placeholder="Position"
                    className={`p-2 border rounded-lg w-full`}
                  />
                </div>

                {/* Phone */}
                <div className="md:col-span-2">
                  <label
                    htmlFor="phone"
                    className="block mb-1 text-sm font-medium"
                  >
                    Phone
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={newEmployee.phone}
                    onChange={handleInputChange}
                    placeholder="Phone"
                    className={`p-2 border rounded-lg w-full`}
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="flex justify-end mt-6 space-x-4">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 text-white bg-gray-500 rounded-lg hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 text-white bg-cyan-600 rounded-lg hover:bg-cyan-700"
                >
                  {loading
                    ? "loading....."
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

export default AddEditEmployeePopup;
