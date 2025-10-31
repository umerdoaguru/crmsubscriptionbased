import React, { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import cogoToast from "cogo-toast";
import { useSelector } from "react-redux";
import { IoCloseSharp } from "react-icons/io5";

const SuperAdminEditLeadPopup = ({
  isOpen,
  onClose,
  employees,
  combinedLeadSources,
  projects,
  fetchLeads,
  isEditing,
  selectedLead,
  setIsEditing,
}) => {
  const modalRef = useRef();
  const EmpId = useSelector((state) => state.auth.user);
  const token = EmpId?.token;
  const userId = EmpId?.staff_id;
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [customLeadSource, setCustomLeadSource] = useState("");
  const [projectUnit, setProjectUnit] = useState([]);
  const [currentLead, setCurrentLead] = useState({
    lead_org_id: EmpId?.staff_org_id,
    lead_no: "",
    assignedTo: "",
    employeeId: "",
    employeephone: "",
    createdTime: "",
    name: "",
    phone: "",
    lead_email: "",
    leadSource: "",
    main_project_id: "",
    unit_type: "",
    unit_id: "",
    address: "",
    actual_date: "",
    user_id: userId,
  });

  // fetch units for selected project
  const fetchProjectsUnit = async (projectId) => {
    if (!projectId) {
      setProjectUnit([]);
      return;
    }
    try {
      const response = await axios.get(
        `https://crm-generalize.dentalguru.software/api/super-admin-project-unit/${projectId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (Array.isArray(response.data) && response.data.length > 0) {
        setProjectUnit(response.data);
      } else {
        setProjectUnit([]);
      }
    } catch (error) {
      console.error("Error fetching units:", error);
      setProjectUnit([]);
    }
  };

  useEffect(() => {
    if (isEditing && selectedLead) {
      setCurrentLead({
        ...selectedLead,
        employeephone: "",
        user_id: userId,
      });

      if (selectedLead.main_project_id) {
        fetchProjectsUnit(selectedLead.main_project_id);
      }
    } else {
      setCurrentLead({
        lead_org_id: EmpId?.staff_org_id,
        lead_no: "",
        assignedTo: "",
        createdTime: "",
        name: "",
        phone: "",
        lead_email: "",
        leadSource: "",
        main_project_id: "",
        unit_type: "",
        unit_id: 0,
        address: "",
        actual_date: "",
      });
      setProjectUnit([]);
    }
  }, [selectedLead, isEditing]);

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
    setIsEditing(false);
    onClose();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setCurrentLead((prevLead) => {
      let updated = { ...prevLead };

      if (name === "phone") {
        const onlyNumbers = value.replace(/\D/g, "");
        if (onlyNumbers.length <= 10) {
          updated[name] = onlyNumbers;
        }
        return updated;
      }

      updated = { ...updated, [name]: value };

      if (name === "main_project_id") {
        updated.main_project_id = value;
        updated.unit_type = "";
        updated.unit_id = "";
        fetchProjectsUnit(value);
      }

      if (name === "unit_type") {
        const unit = projectUnit.find((u) => u.unit_type === value);
        updated.unit_id = unit?.unit_id || "";
      }

      return updated;
    });
  };

  const handleCustomLeadSourceChange = (e) => {
    setCustomLeadSource(e.target.value);
  };

  // Save lead
  const saveChanges = async (e) => {
    e.preventDefault();

    const leadData = {
      ...currentLead,
      leadSource:
        currentLead.leadSource === "Other"
          ? customLeadSource
          : currentLead.leadSource,
      assignedBy: "Admin",
    };

    try {
      setLoading(true);
      if (isEditing) {
        await axios.put(
          `https://crm-generalize.dentalguru.software/api/leads/${selectedLead?.lead_id}`,
          leadData,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        fetchLeads();
      } else {
        await axios.post(
          "https://crm-generalize.dentalguru.software/api/leads",
          leadData,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }
      setIsEditing(false);
      fetchLeads();
      onClose();
    } catch (err) {
      console.error(err);
      cogoToast.error("Failed to save lead");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 overflow-y-auto"
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
                {isEditing ? "Edit Lead" : "Add Lead"}
              </h2>
              <button
                onClick={handleClose}
                className="text-gray-500 hover:text-red-500 transition"
              >
                <IoCloseSharp className="w-6 h-6" />
              </button>
            </div>

            <form
              onSubmit={saveChanges}
              className="grid grid-cols-1 md:grid-cols-2 gap-3"
            >
              {/* Name */}
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="Write name"
                  value={currentLead.name}
                  onChange={handleInputChange}
                  className={`mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-400 ${
                    errors.name ? "border-red-500" : "border-gray-300"
                  }`}
                />
              </div>

              {/* Assigned To */}
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Assigned To
                </label>
                <select
                  name="assignedTo"
                  value={currentLead.assignedTo}
                  onChange={handleInputChange}
                  className={`mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-400 ${
                    errors.assignedTo ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="">Select Employee</option>
                  {employees.map((emp) => (
                    <option key={emp.staff_id} value={emp.staff_id}>
                      {emp.staff_name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date */}
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Assign Date
                </label>
                <input
                  type="date"
                  name="createdTime"
                  value={currentLead.createdTime}
                  onChange={handleInputChange}
                  className="mt-1 w-full px-3 py-2 border rounded-lg bg-gray-100 focus:outline-none"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Phone
                </label>
                <input
                  type="text"
                  name="phone"
                  value={currentLead.phone}
                  placeholder="Enter mobile number"
                  onChange={handleInputChange}
                  className={`mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-400 ${
                    errors.phone ? "border-red-500" : "border-gray-300"
                  }`}
                />
              </div>

              {/* Email */}
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Email
                </label>
                <input
                  type="text"
                  name="lead_email"
                  value={currentLead.lead_email}
                  placeholder="Enter email"
                  onChange={handleInputChange}
                  className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-400"
                />
              </div>

              {/* Lead Source */}
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Lead Source
                </label>
                <select
                  name="leadSource"
                  value={currentLead.leadSource}
                  onChange={handleInputChange}
                  className="mt-1 w-full p-2 border rounded-lg focus:ring-2 focus:ring-cyan-400"
                >
                  <option value="">Select Lead Source</option>
                  {combinedLeadSources.map((src) => (
                    <option key={src} value={src}>
                      {src}
                    </option>
                  ))}
                  <option value="Other">Other</option>
                </select>
                {currentLead.leadSource === "Other" && (
                  <input
                    type="text"
                    value={customLeadSource}
                    onChange={handleCustomLeadSourceChange}
                    placeholder="Enter custom source"
                    className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                )}
              </div>

              {/* Project */}
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Project Name
                </label>
                <select
                  name="main_project_id"
                  value={currentLead.main_project_id}
                  onChange={handleInputChange}
                  className={`mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-400 ${
                    errors.main_project_id
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                >
                  <option value="">Select Project</option>
                  {projects.map((proj) => (
                    <option key={proj.project_id} value={proj.project_id}>
                      {proj.project_name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Unit Type */}
              {currentLead.main_project_id && (
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Unit Type
                  </label>
                  <select
                    name="unit_id"
                    value={currentLead.unit_id}
                    onChange={handleInputChange}
                    className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-400"
                  >
                    <option value="">Select Unit Type</option>
                    {projectUnit.map((u) => (
                      <option key={u.unit_id} value={u.unit_id}>
                        {`${u.unit_number} - ${u.unit_type} - ${u.base_price}`}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Address */}
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-gray-600">
                  Address
                </label>
                <textarea
                  type="text"
                  name="address"
                  placeholder="Enter address"
                  value={currentLead.address}
                  onChange={handleInputChange}
                  className={`mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-400 ${
                    errors.address ? "border-red-500" : "border-gray-300"
                  }`}
                />
              </div>

              {/* Buttons */}
              <div className="md:col-span-2 flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-cyan-600 text-white rounded-lg shadow hover:bg-cyan-700 transition"
                >
                  {loading ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SuperAdminEditLeadPopup;
