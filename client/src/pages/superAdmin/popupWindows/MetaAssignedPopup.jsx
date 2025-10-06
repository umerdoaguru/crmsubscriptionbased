import React, { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import cogoToast from "cogo-toast";
import { useSelector } from "react-redux";

const MetaAssignedPopup = ({ isOpen, onClose, lead, fetchAllMetaLeads }) => {
  const modalRef = useRef();
  const user = useSelector((state) => state.auth.user);
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState([]);
  const [units, setUnits] = useState([]);
  const [staff, setStaff] = useState([]);
  const [inputField, setInputField] = useState({
    meta_assignedTo: "",
    meta_assignedBy: user?.staff_id,
    meta_project_id: "",
    meta_unit_id: "",
    meta_lead_status: "",
  });

  console.log(lead);

  const fetchAllStaff = async () => {
    try {
      const { data } = await axios.get(
        `https://crm-generalize.dentalguru.software/api/getEmployeeByOrg/${user?.staff_org_id}`,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      setStaff(data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchAllProjects = async () => {
    try {
      const { data } = await axios.get(
        `https://crm-generalize.dentalguru.software/api/all-project/${user?.staff_org_id}`,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      setProjects(data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchAllUnitsByProject = async () => {
    try {
      const { data } = await axios.get(
        `https://crm-generalize.dentalguru.software/api/getAllUnitsByProjectId/${inputField?.meta_project_id}`
      );
      setUnits(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAllProjects();
    fetchAllStaff();
  }, []);

  console.log(units);

  useEffect(() => {
    fetchAllUnitsByProject();
  }, [inputField?.meta_project_id]);

  // console.log(projects);

  useEffect(() => {
    setInputField({
      meta_assignedTo: lead?.meta_assignedTo,
      meta_assignedBy: lead?.meta_assignedBy,
      meta_project_id: lead?.meta_project_id,
      meta_unit_id: lead?.meta_unit_id,
      meta_lead_status: lead?.meta_lead_status,
    });
  }, [lead]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputField({
      ...inputField,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.put(
        `https://crm-generalize.dentalguru.software/api/updateAndAssignedMetaLeads/${lead?.meta_id}`,
        inputField
      );
      cogoToast.success("Meta Lead details updated successfully");
      setLoading(false);
      onClose();
      fetchAllMetaLeads();
    } catch (error) {
      console.log(error);
      cogoToast.error("Failed to update Meta Lead details");
      setLoading(false);
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
            className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-4xl mx-2 h-[95%] overflow-y-auto"
            initial={{ scale: 0.9, opacity: 0, y: -30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 30 }}
            transition={{ duration: 0.3 }}
          >
            {/* Title */}
            <h2 className="text-xl font-semibold mb-6">
              Edit Organization Details
            </h2>

            {/* Form */}
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Meta Assigned To */}
                <div>
                  <label className="block text-gray-700 mb-1">
                    Assigned To
                  </label>
                  <select
                    name="meta_assignedTo"
                    value={inputField.meta_assignedTo}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                  >
                    <option value="">--select--</option>
                    {staff?.map((staff) => (
                      <>
                        <option value={staff?.staff_id}>
                          {staff?.staff_name}
                        </option>
                      </>
                    ))}
                  </select>
                </div>

                {/* Meta Project ID */}
                <div>
                  <label className="block text-gray-700 mb-1">Project</label>
                  <select
                    name="meta_project_id"
                    value={inputField.meta_project_id}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                  >
                    <option value="">--select--</option>
                    {projects?.map((project) => (
                      <>
                        <option value={project?.project_id}>
                          {project?.project_name}
                        </option>
                      </>
                    ))}
                  </select>
                </div>

                {/* Meta Unit ID */}
                <div>
                  <label className="block text-gray-700 mb-1">Unit</label>

                  <select
                    name="meta_unit_id"
                    value={inputField.meta_unit_id}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                  >
                    <option value="">--select--</option>
                    {units?.map((unit) => (
                      <>
                        <option value={unit?.unit_id}>
                          {unit?.unit_number} - {unit?.unit_type}
                        </option>
                      </>
                    ))}
                  </select>
                </div>

                {/* Meta Lead Status */}
                <div>
                  <label className="block text-gray-700 mb-1">
                    Lead Status
                  </label>
                  <select
                    name="meta_lead_status"
                    value={inputField.meta_lead_status}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded bg-white"
                  >
                    <option value="">Select Status</option>
                    <option value="Pending">Pending</option>
                    <option value="Close">Close</option>
                    <option value="Sold">Sold</option>
                    <option value="Ongoing">Ongoing</option>
                  </select>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex justify-end mt-6">
                <button
                  className="bg-cyan-500 text-white px-4 py-2 rounded hover:bg-cyan-700 mr-2"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save"}
                </button>
                <button
                  type="button"
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700"
                  onClick={onClose}
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

export default MetaAssignedPopup;
