import React, { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import cogoToast from "cogo-toast";
import { useSelector } from "react-redux";

const GenLeadAssignedPopup = ({
  isOpen,
  onClose,
  lead,
  fetchLeads,
  selectedLeads,
}) => {
  const modalRef = useRef();
  const user = useSelector((state) => state.auth.user);
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState([]);
  const [units, setUnits] = useState([]);
  const [staff, setStaff] = useState([]);

  const [inputField, setInputField] = useState({
    assignedTo: "",
    main_project_id: "",
    unit_id: "",
  });

  console.log("leads", lead);
  console.log("selectedLeads", selectedLeads);

  const fetchAllStaff = async () => {
    try {
      const { data } = await axios.get(
        `https://crm-generalize.dentalguru.software/api/getEmployeeByOrg/${user?.staff_org_id}`,
        {
          headers: { Authorization: `Bearer ${user?.token}` },
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
          headers: { Authorization: `Bearer ${user?.token}` },
        }
      );
      setProjects(data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchAllUnitsByProject = async () => {
    if (!inputField?.main_project_id) return;
    try {
      const { data } = await axios.get(
        `https://crm-generalize.dentalguru.software/api/getAllUnitsByProjectId/${inputField?.main_project_id}`,
        {
          headers: { Authorization: `Bearer ${user?.token}` },
        }
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

  useEffect(() => {
    fetchAllUnitsByProject();
  }, [inputField?.main_project_id]);

  useEffect(() => {
    if (selectedLeads && selectedLeads.length > 0) {
      setInputField({
        assignedTo: "",
        main_project_id: "",
        unit_id: "",
      });
    } else {
      setInputField({
        assignedTo: "",
        main_project_id: "",
        unit_id: "",
      });
    }
  }, [selectedLeads]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputField({ ...inputField, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (selectedLeads && selectedLeads.length > 0) {
        const updateRequests = selectedLeads?.map((item) =>
          axios.put(
            `https://crm-generalize.dentalguru.software/api/updateLeadAssignment/${item}`,
            inputField,
            {
              headers: { Authorization: `Bearer ${user?.token}` },
            }
          )
        );

        await Promise.all(updateRequests);
        cogoToast.success(
          `${selectedLeads?.length} leads assigned successfully`
        );
        fetchLeads();
      } else {
        cogoToast.warn("No leads selected for bulk update");
      }

      onClose();
    } catch (error) {
      console.log(error);
      cogoToast.error("Failed to update Meta Lead details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) onClose();
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
            className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-4xl mx-2 h-auto overflow-y-auto"
            initial={{ scale: 0.9, opacity: 0, y: -30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 30 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-xl font-semibold mb-6">
              {selectedLeads && selectedLeads?.length > 0
                ? `Assign ${selectedLeads?.length} Selected Leads`
                : "Edit Lead Details"}
            </h2>

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-1">
                    Assigned To
                  </label>
                  <select
                    name="assignedTo"
                    value={inputField.assignedTo}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                    required
                  >
                    <option value="">--select--</option>
                    {staff?.map((s) => (
                      <option key={s?.staff_id} value={s?.staff_id}>
                        {s?.staff_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 mb-1">Project</label>
                  <select
                    name="main_project_id"
                    value={inputField.main_project_id}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                  >
                    <option value="">--select--</option>
                    {projects?.map((p) => (
                      <option key={p?.project_id} value={p?.project_id}>
                        {p?.project_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 mb-1">Unit</label>
                  <select
                    name="unit_id"
                    value={inputField.unit_id}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                  >
                    <option value="">--select--</option>
                    {units?.map((u) => (
                      <option key={u?.unit_id} value={u?.unit_id}>
                        {u?.unit_number} - {u?.unit_type}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <button
                  className="bg-cyan-500 text-white px-4 py-2 rounded hover:bg-cyan-700 mr-2"
                  type="submit"
                  disabled={loading}
                >
                  {loading
                    ? "Saving..."
                    : selectedLeads && selectedLeads.length > 0
                    ? "Assign All Selected"
                    : "Save"}
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

export default GenLeadAssignedPopup;
