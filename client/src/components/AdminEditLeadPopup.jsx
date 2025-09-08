import React, { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import cogoToast from "cogo-toast";
import { useSelector } from "react-redux";

const AdminEditLeadPopup = ({
  isOpen,
  onClose,
  employees,
  combinedLeadSources,
  projectunit,
  projects,
  fetchProjectsUnit,
  fetchLeads,
  isEditing,
  currentLeads,
  selectedLead,
  setIsEditing,
}) => {
  const modalRef = useRef();
  const EmpId = useSelector((state) => state.auth.user);
  const token = EmpId?.token;
  const userId = EmpId.user_id;
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [customLeadSource, setCustomLeadSource] = useState("");
  const [currentLead, setCurrentLead] = useState({
    lead_no: "",
    assignedTo: "",
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

  console.log(selectedLead);
  console.log("isEditing", isEditing);

  useEffect(() => {
    isEditing
      ? setCurrentLead({
          lead_no: selectedLead?.lead_no,
          assignedTo: selectedLead?.assignedTo,
          employeeId: selectedLead?.employeeId,
          employeephone: "",
          createdTime: selectedLead?.createdTime,
          name: selectedLead?.name,
          phone: selectedLead?.phone,
          leadSource: selectedLead?.leadSource,
          project_name: selectedLead?.project_name,
          main_project_id: selectedLead?.main_project_id,
          unit_type: selectedLead?.unit_type,
          unit_id: selectedLead?.unit_id,
          address: selectedLead?.address,
          actual_date: selectedLead?.actual_date,
          user_id: userId,
        })
      : setCurrentLead({
          lead_no: "",
          assignedTo: "",
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
  }, [selectedLead, isEditing]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setCurrentLead((prevLead) => {
      const updatedLead = { ...prevLead, [name]: value };

      if (name === "createdTime") {
        updatedLead.actual_date = value;
      }

      if (name === "assignedTo") {
        const selectedEmployee = employees.find(
          (employee) => employee.name === value
        );
        if (selectedEmployee) {
          updatedLead.employeeId = selectedEmployee.employeeId;
          updatedLead.employeephone = selectedEmployee.phone;
        } else {
          updatedLead.employeeId = "";
          updatedLead.employeephone = "";
        }
      }

      if (name === "project_name") {
        const selectedProject = projects.find(
          (project) => project.project_name === value
        );

        if (selectedProject) {
          updatedLead.main_project_id = selectedProject.main_project_id;
          fetchProjectsUnit(selectedProject.main_project_id);
        } else {
          updatedLead.main_project_id = "";
          fetchProjectsUnit("");
        }
      }

      if (name === "unit_type") {
        const selectedUnit = projectunit.find(
          (unit) => unit.unit_type === value
        );

        if (selectedUnit) {
          updatedLead.unit_id = selectedUnit.unit_id;
        } else {
          updatedLead.unit_id = "";
        }
      }

      return updatedLead;
    });
  };

  const validateForm = () => {
    let formErrors = {};
    let isValid = true;

    if (!currentLead.lead_no) {
      formErrors.lead_no = "Lead number is required";
      isValid = false;
    }

    if (!currentLead.assignedTo) {
      formErrors.assignedTo = "Assigned To field is required";
      isValid = false;
    }

    if (!currentLead.name) {
      formErrors.name = "Name is required";
      isValid = false;
    }
    if (!currentLead.createdTime) {
      formErrors.createdTime = "Date is required";
      isValid = false;
    }

    if (!currentLead.phone) {
      formErrors.phone = "Phone number is required";
      isValid = false;
    } else if (!/^\d{10}$/.test(currentLead.phone)) {
      formErrors.phone = "Phone number must be 10 digits";
      isValid = false;
    }

    if (!currentLead.leadSource) {
      formErrors.leadSource = "Lead Source is required";
      isValid = false;
    }
    if (!currentLead.project_name) {
      formErrors.project_name = "project is required";
      isValid = false;
    }
    if (!currentLead.address) {
      formErrors.address = "Address is required";
      isValid = false;
    }

    setErrors(formErrors);
    return isValid;
  };

  const handleCustomLeadSourceChange = (e) => {
    setCustomLeadSource(e.target.value);
  };

  const saveChanges = async (e) => {
    e.preventDefault();
    if (validateForm()) {
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
          // Update existing lead
          await axios.put(
            `https://crm-generalize.dentalguru.software/api/leads/${selectedLead?.lead_id}`,
            leadData
          );

          fetchLeads();
          setIsEditing(false);
          onClose();
        } else {
          // Create new lead
          await axios.post(
            "https://crm-generalize.dentalguru.software/api/leads",
            leadData
          );

          // Construct WhatsApp message link with encoded parameters
          const whatsappLink = `https://wa.me/${currentLead.employeephone}?text=Hi%20${currentLead.assignedTo},%20you%20have%20been%20assigned%20a%20new%20lead%20with%20the%20following%20details:%0A%0A1)%20Lead%20No.%20${currentLead.lead_no}%0A2)%20Name:%20${currentLead.name}%0A3)%20Phone%20Number:%20${currentLead.phone}%0A4)%20Lead%20Source:%20${currentLead.leadSource}%0A5)%20Address:%20${currentLead.address}%0A6)%20Project Name:%20${currentLead.project_name}%0A%0APlease%20check%20your%20dashboard%20for%20details.`;

          // Open WhatsApp link in a new tab
          window.open(whatsappLink, "_blank");
          setIsEditing(false);
          fetchLeads(); // Refresh the list
          onClose();
        }
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error("Error saving lead:", error);
      }
    }
  };

  const handleClose = () => {
    setIsEditing(false);
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
            className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md mx-2 h-[95%] overflow-y-auto"
            initial={{ scale: 0.9, opacity: 0, y: -30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 30 }}
            transition={{ duration: 0.3 }}
          >
            {/* Title */}
            <h2 className="text-xl mb-4">
              {isEditing ? "Edit Lead" : "Add Lead"}
            </h2>

            {/* Form */}
            <form onSubmit={saveChanges}>
              {/* Lead Number */}
              <div className="mb-4">
                <label className="block text-gray-700">Lead Number</label>
                <input
                  type="number"
                  name="lead_no"
                  value={currentLead.lead_no}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border ${
                    errors.lead_no ? "border-red-500" : "border-gray-300"
                  } rounded`}
                />
                {errors.lead_no && (
                  <span className="text-red-500">{errors.lead_no}</span>
                )}
              </div>

              {/* Assigned To */}
              <div className="mb-4">
                <label className="block text-gray-700">Assigned To</label>
                <select
                  name="assignedTo"
                  value={currentLead.assignedTo}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border ${
                    errors.assignedTo ? "border-red-500" : "border-gray-300"
                  } rounded`}
                >
                  <option value="">Select Employee</option>
                  {employees.map((employee) => (
                    <option key={employee.employee_id} value={employee.name}>
                      {employee.name}
                    </option>
                  ))}
                </select>
                {errors.assignedTo && (
                  <span className="text-red-500">{errors.assignedTo}</span>
                )}
              </div>

              {/* Hidden employeeId */}
              <input
                type="hidden"
                id="employeeId"
                name="employeeId"
                value={currentLead.employeeId}
              />

              {/* Assign Date */}
              <div className="mb-4">
                <label className="block text-gray-700">Assign Date</label>
                <input
                  type="date"
                  name="createdTime"
                  value={currentLead.createdTime}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-100"
                />
                {errors.createdTime && (
                  <span className="text-red-500">{errors.createdTime}</span>
                )}
              </div>

              {/* Name */}
              <div className="mb-4">
                <label className="block text-gray-700">Name</label>
                <input
                  type="text"
                  name="name"
                  value={currentLead.name}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border ${
                    errors.name ? "border-red-500" : "border-gray-300"
                  } rounded`}
                />
                {errors.name && (
                  <span className="text-red-500">{errors.name}</span>
                )}
              </div>

              {/* Phone */}
              <div className="mb-4">
                <label className="block text-gray-700">Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={currentLead.phone}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border ${
                    errors.phone ? "border-red-500" : "border-gray-300"
                  } rounded`}
                />
                {errors.phone && (
                  <span className="text-red-500">{errors.phone}</span>
                )}
              </div>

              {/* Lead Source */}
              <div className="mb-4">
                <label className="block text-gray-700">Lead Source</label>
                <select
                  name="leadSource"
                  value={currentLead.leadSource}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                >
                  <option value="">Select Lead Source</option>
                  {combinedLeadSources.map((source) => (
                    <option key={source} value={source}>
                      {source}
                    </option>
                  ))}
                  <option value="Other">Other</option>
                </select>
                {currentLead.leadSource === "Other" && (
                  <input
                    type="text"
                    value={customLeadSource}
                    onChange={handleCustomLeadSourceChange}
                    placeholder="Enter custom lead source"
                    className="mt-2 w-full px-3 py-2 border border-gray-300 rounded"
                  />
                )}
                {errors.leadSource && (
                  <p className="text-red-500 text-xs">{errors.leadSource}</p>
                )}
              </div>

              {/* Project Name */}
              <div className="mb-4">
                <label className="block text-gray-700">Project Name</label>
                <select
                  name="project_name"
                  id="project_name"
                  value={currentLead.project_name}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border ${
                    errors.project_name ? "border-red-500" : "border-gray-300"
                  } rounded`}
                >
                  <option value="">Select Project Name</option>
                  {projects.map((project) => (
                    <option
                      key={project.main_project_id}
                      value={project.project_name}
                    >
                      {project.project_name}
                    </option>
                  ))}
                </select>
                {errors.project_name && (
                  <span className="text-red-500">{errors.project_name}</span>
                )}
              </div>

              {/* Unit Type (conditional) */}
              {currentLead.main_project_id &&
                (projectunit.length > 0 ? (
                  <div className="mb-4">
                    <label className="block text-gray-700">Unit Type</label>
                    <select
                      name="unit_type"
                      id="unit_type"
                      value={currentLead.unit_type}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border ${
                        errors.unit_type ? "border-red-500" : "border-gray-300"
                      } rounded`}
                    >
                      <option value="">Select Unit Type</option>
                      {projectunit.map((unit) => (
                        <option key={unit.unit_id} value={unit.unit_type}>
                          {unit.unit_type}
                        </option>
                      ))}
                    </select>
                    {errors.unit_type && (
                      <span className="text-red-500">{errors.unit_type}</span>
                    )}
                  </div>
                ) : (
                  <p className="text-red-500 text-sm">
                    Unit not set for this project.
                  </p>
                ))}

              {/* Hidden unit_id */}
              <input
                type="hidden"
                id="unit_id"
                name="unit_id"
                value={currentLead.unit_id}
              />

              {/* Address */}
              <div className="mb-4">
                <label className="block text-gray-700">Address</label>
                <input
                  type="text"
                  name="address"
                  value={currentLead.address}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border ${
                    errors.address ? "border-red-500" : "border-gray-300"
                  } rounded`}
                />
                {errors.address && (
                  <span className="text-red-500">{errors.address}</span>
                )}
              </div>

              {/* Buttons */}
              <div className="flex justify-end">
                <button
                  className="bg-cyan-500 text-white px-4 py-2 rounded hover:bg-cyan-700 mr-2"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? "Save..." : "Save"}
                </button>
                <button
                  type="button"
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700"
                  onClick={handleClose}
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AdminEditLeadPopup;
