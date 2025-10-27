import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import cogoToast from "cogo-toast";
import { motion } from "framer-motion";

const SuperAdminImportDataContent = () => {
  const superadminuser = useSelector((state) => state.auth.user);
  const token = superadminuser.token;
  const userId = superadminuser.staff_id;
  const [file, setFile] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [projects, setProjects] = useState([]);
  const [projectUnits, setProjectUnits] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [selectedUnitType, setSelectedUnitType] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [selectedProjectName, setSelectedProjectName] = useState("");
  const [selectedUnitId, setSelectedUnitId] = useState("");
  const [selectedEmployeeName, setSelectedEmployeeName] = useState("");
  const [assignedDate, setAssignedDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [fileKey, setFileKey] = useState(Date.now());

  useEffect(() => {
    fetchEmployees();
    fetchProjects();
  }, []);

  const fetchEmployees = async () => {
    try {
      const { data } = await axios.get(
        `https://crm-generalize.dentalguru.software/api/getAllEmployeeData/${superadminuser?.staff_org_id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEmployees(data);
    } catch (err) {
      console.error("Error fetching employees:", err);
    }
  };

  const fetchProjects = async () => {
    try {
      const { data } = await axios.get(
        `https://crm-generalize.dentalguru.software/api/super-admin-all-project/${userId}/${superadminuser?.staff_org_id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProjects(data);
    } catch (err) {
      console.error("Error fetching projects:", err);
    }
  };

  const fetchProjectUnits = async (projectId) => {
    try {
      const res = await axios.get(
        `https://crm-generalize.dentalguru.software/api/super-admin-project-unit/${projectId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProjectUnits(res.data);
    } catch (err) {
      console.error("Error fetching project units:", err);
    }
  };

  const handleProjectChange = (e) => {
    const projectId = Number(e.target.value);
    const proj = projects.find((p) => Number(p.main_project_id) === projectId);
    setSelectedProjectId(projectId);
    setSelectedProjectName(proj?.project_name || "");
    setSelectedUnitType("");
    setSelectedUnitId("");
    fetchProjectUnits(projectId);
  };

  const handleUnitChange = (e) => {
    const unitType = e.target.value;
    const unit = projectUnits.find((u) => u.unit_type === unitType);
    setSelectedUnitType(unitType);
    setSelectedUnitId(unit?.unit_id || "");
  };

  const handleEmployeeChange = (e) => {
    const selectedId = e.target.value;
    const emp = employees.find(
      (emp) => Number(emp.staff_id) === Number(selectedId)
    );
    setSelectedEmployee(selectedId);
    setSelectedEmployeeName(emp?.staff_name || "");
  };

  const handleSubmit = async () => {
    if (
      !file ||
      !selectedEmployee ||
      !selectedProjectId ||
      !selectedUnitType ||
      !assignedDate
    ) {
      cogoToast.warn("Please fill all fields and upload a file.");
      setFileKey(Date.now()); // force reset input
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("lead_org_id", superadminuser?.staff_org_id);
    formData.append("user_id", userId);
    formData.append("employeeId", selectedEmployee);
    formData.append("assignedTo", selectedEmployee);
    formData.append("main_project_id", selectedProjectId);
    formData.append("project_name", selectedProjectName);
    formData.append("unit_type", selectedUnitType);
    formData.append("unit_id", selectedUnitId);
    formData.append("assignedBy", "SuperAdmin");
    formData.append("assigned_date", assignedDate);

    try {
      setLoading(true);
      const res = await axios.post(
        "https://crm-generalize.dentalguru.software/api/import-leads",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      cogoToast.success(res.data.message || "Leads imported successfully");

      // Reset form
      setFile(null);
      setFileKey(Date.now());
      setSelectedEmployee("");
      setSelectedEmployeeName("");
      setSelectedProjectId("");
      setSelectedProjectName("");
      setSelectedUnitType("");
      setSelectedUnitId("");
      setProjectUnits([]);
      setAssignedDate("");
    } catch (err) {
      console.error("Upload failed:", err);
      cogoToast.error(err.response?.data?.error || "Failed to import leads.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex mt-20">
      <div className="w-full min-h-screen bg-gradient-to-br from-white via-white to-indigo-50 p-4">
        <motion.div
          className="bg-white/80 backdrop-blur-lg shadow-2xl rounded-3xl p-8 w-full max-w-3xl mx-auto border border-gray-100"
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          whileHover={{ scale: 1.01 }}
        >
          <motion.h2
            className="text-4xl font-extrabold text-cyan-700 tracking-tight mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Import Data
          </motion.h2>

          {/* File Upload */}
          <motion.div
            className="mb-6 text-left"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <label className="block text-gray-700 font-semibold mb-2">
              Upload File (.xlsx, .csv)
            </label>
            <input
              type="file"
              accept=".xlsx,.csv"
              onChange={(e) => setFile(e.target.files[0])}
              className="border-2 border-dashed border-cyan-400 rounded-2xl px-4 py-3 w-full focus:ring-2 focus:ring-cyan-500 transition cursor-pointer hover:border-cyan-600 hover:bg-cyan-50"
              key={fileKey}
            />
            <a
              href="/sample_leads_file.xlsx"
              download
              className="inline-block mt-3 text-cyan-600 font-semibold hover:text-cyan-800 transition"
            >
              Download Sample Excel File
            </a>
          </motion.div>

          {/* Employee */}
          <motion.div
            className="mb-6 text-left"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <label className="block text-gray-700 font-semibold mb-2">
              Select Employee
            </label>
            <select
              value={selectedEmployee}
              onChange={handleEmployeeChange}
              className="border rounded-xl px-4 py-3 w-full focus:ring-2 focus:ring-cyan-500 transition hover:bg-cyan-50"
            >
              <option value="">Select</option>
              {employees.map((emp) => (
                <option key={emp.staff_id} value={emp.staff_id}>
                  {emp.staff_name}
                </option>
              ))}
            </select>
          </motion.div>

          {/* Project */}
          <motion.div
            className="mb-6 text-left"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <label className="block text-gray-700 font-semibold mb-2">
              Select Project
            </label>
            <select
              value={selectedProjectId}
              onChange={handleProjectChange}
              className="border rounded-xl px-4 py-3 w-full focus:ring-2 focus:ring-cyan-500 transition hover:bg-cyan-50"
            >
              <option value="">Select</option>
              {projects.map((proj) => (
                <option key={proj.main_project_id} value={proj.main_project_id}>
                  {proj.project_name}
                </option>
              ))}
            </select>
          </motion.div>

          {/* Unit Type */}
          {projectUnits.length > 0 && (
            <motion.div
              className="mb-6 text-left"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <label className="block text-gray-700 font-semibold mb-2">
                Select Unit Type
              </label>
              <select
                value={selectedUnitType}
                onChange={handleUnitChange}
                className="border rounded-xl px-4 py-3 w-full focus:ring-2 focus:ring-cyan-500 transition hover:bg-cyan-50"
              >
                <option value="">Select</option>
                {projectUnits.map((unit) => (
                  <option key={unit.unit_id} value={unit.unit_type}>
                    {unit.unit_type}
                  </option>
                ))}
              </select>
            </motion.div>
          )}

          {/* Assigned Date */}
          <motion.div
            className="mb-6 text-left"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
          >
            <label className="block text-gray-700 font-semibold mb-2">
              Assigned Date
            </label>
            <input
              type="date"
              value={assignedDate}
              onChange={(e) => setAssignedDate(e.target.value)}
              className="border rounded-xl px-4 py-3 w-full focus:ring-2 focus:ring-cyan-500 transition hover:bg-cyan-50"
            />
          </motion.div>

          {/* Submit */}
          <motion.button
            className={`bg-gradient-to-r from-cyan-500 to-cyan-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg w-full transition-all 
              ${
                loading
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:from-cyan-600 hover:to-cyan-800"
              }`}
            onClick={handleSubmit}
            disabled={loading}
            whileHover={!loading ? { scale: 1.02 } : {}}
            whileTap={!loading ? { scale: 0.95 } : {}}
          >
            {loading ? "Uploading..." : "Import Leads"}
          </motion.button>

          {/* Success/Fail Message */}
          {message && (
            <motion.p
              className="mt-4 text-green-600 font-semibold"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              {message}
            </motion.p>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default SuperAdminImportDataContent;
