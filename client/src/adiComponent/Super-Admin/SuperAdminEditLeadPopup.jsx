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
  projectunit,
  projects,
  fetchProjectsUnit,
  fetchLeads,
  isEditing,
  selectedLead,
  setIsEditing,
}) => {
  const modalRef = useRef();
  const EmpId = useSelector((state) => state.auth.user);
  console.log(EmpId);

  const token = EmpId?.token;
  const userId = EmpId.staff_id;
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [customLeadSource, setCustomLeadSource] = useState("");
  const [currentLead, setCurrentLead] = useState({
    lead_org_id: EmpId?.staff_org_id,
    lead_no: "",
    assignedTo: 0,
    employeeId: "",
    employeephone: "",
    createdTime: "",
    name: "",
    phone: "",
    leadSource: "",
    project_name: "",
    main_project_id: "",
    unit_type: "",
    unit_id: "",
    address: "",
    actual_date: "",
    user_id: userId,
  });

  // Reset lead data when editing
  useEffect(() => {
    if (isEditing && selectedLead) {
      setCurrentLead({
        ...selectedLead,
        employeephone: "",
        user_id: userId,
      });
    } else {
      setCurrentLead({
        lead_org_id: EmpId?.staff_org_id,
        lead_no: "",
        assignedTo: 0,
        employeeId: "",
        employeephone: "",
        createdTime: "",
        name: "",
        phone: "",
        leadSource: "",
        project_name: "",
        main_project_id: "",
        unit_type: "",
        unit_id: "",
        address: "",
        actual_date: "",
        user_id: userId,
      });
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

      if (name === "createdTime") updated.actual_date = value;

      if (name === "assignedTo") {
        const emp = employees.find((e) => e.name === value);
        updated.employeeId = emp?.employeeId || "";
        updated.employeephone = emp?.phone || "";
      }

      if (name === "project_name") {
        const proj = projects.find((p) => p.project_name === value);
        updated.main_project_id = proj?.main_project_id || "";
        fetchProjectsUnit(proj?.main_project_id || "");
      }

      if (name === "unit_type") {
        const unit = projectunit.find((u) => u.unit_type === value);
        updated.unit_id = unit?.unit_id || "";
      }

      return updated;
    });
  };

  const handleCustomLeadSourceChange = (e) => {
    setCustomLeadSource(e.target.value);
  };

  // Form validation
  const validateForm = () => {
    let errs = {};
    if (!currentLead.assignedTo) errs.assignedTo = "Assigned To is required";
    if (!currentLead.name) errs.name = "Name is required";
    if (!currentLead.createdTime) errs.createdTime = "Date is required";
    if (!currentLead.phone) errs.phone = "Phone number is required";
    else if (!/^\d{10}$/.test(currentLead.phone))
      errs.phone = "Phone number must be 10 digits";
    if (!currentLead.leadSource) errs.leadSource = "Lead Source is required";
    if (!currentLead.project_name) errs.project_name = "Project is required";
    if (!currentLead.address) errs.address = "Address is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Save lead
  const saveChanges = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
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
          leadData
        );
        fetchLeads();
      } else {
        await axios.post(
          "https://crm-generalize.dentalguru.software/api/leads",
          leadData
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
            {/* Header with Close Button */}
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
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                )}
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
                {errors.assignedTo && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.assignedTo}
                  </p>
                )}
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
                {errors.createdTime && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.createdTime}
                  </p>
                )}
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
                {errors.phone && (
                  <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                )}
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
                {errors.leadSource && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.leadSource}
                  </p>
                )}
              </div>

              {/* Project */}
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Project Name
                </label>
                <select
                  name="project_name"
                  value={currentLead.project_name}
                  onChange={handleInputChange}
                  className={`mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-400 ${
                    errors.project_name ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="">Select Project</option>
                  {projects.map((proj) => (
                    <option
                      key={proj.main_project_id}
                      value={proj.project_name}
                    >
                      {proj.project_name}
                    </option>
                  ))}
                </select>
                {errors.project_name && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.project_name}
                  </p>
                )}
              </div>

              {/* Unit Type */}
              {currentLead.main_project_id && (
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Unit Type
                  </label>
                  <select
                    name="unit_type"
                    value={currentLead.unit_type}
                    onChange={handleInputChange}
                    className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-400"
                  >
                    <option value="">Select Unit Type</option>
                    {projectunit.map((u) => (
                      <option key={u.unit_id} value={u.unit_type}>
                        {u.unit_type}
                      </option>
                    ))}
                  </select>
                  {errors.unit_type && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.unit_type}
                    </p>
                  )}
                </div>
              )}

              {/* Address - full width */}
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
                {errors.address && (
                  <p className="text-red-500 text-xs mt-1">{errors.address}</p>
                )}
              </div>

              {/* Buttons - full width row */}
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
