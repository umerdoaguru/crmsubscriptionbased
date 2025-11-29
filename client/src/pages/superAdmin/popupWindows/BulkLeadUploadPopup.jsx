import React, { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import cogoToast from "cogo-toast";
import { IoCloseSharp } from "react-icons/io5";
import { useSelector } from "react-redux";

const BulkLeadUploadPopup = ({
  isOpen,
  onClose,
  fetchLeads,
  projects,
  employees,
}) => {
  const modalRef = useRef();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const EmpId = useSelector((state) => state.auth.user);
  const token = EmpId?.token;
  const lead_org_id = EmpId?.staff_org_id;
  const [projectUnit, setProjectUnit] = useState([]);
  const [main_project_id, setMainProjectId] = useState("");
  const [unit_id, setUnitId] = useState("");
  const [assignedTo, setAssignedTo] = useState("");

  const fetchUnits = async (projectId) => {
    if (!projectId) {
      setProjectUnit([]);
      return;
    }

    try {
      const res = await axios.get(
        `https://crm-generalize.dentalguru.software/api/super-admin-project-unit/${projectId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (Array.isArray(res.data)) {
        setProjectUnit(res.data);
      } else {
        setProjectUnit([]);
      }
    } catch (error) {
      console.log("Error fetching units:", error);
      setProjectUnit([]);
    }
  };

  useEffect(() => {
    if (main_project_id) {
      fetchUnits(main_project_id);
    }
  }, [main_project_id]);

  // Close popup when clicking outside or pressing ESC
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
    setFile(null);
    setAssignedTo("");
    setMainProjectId("");
    setUnitId("");
    onClose();
  };

  // File upload change handler
  // const handleFileChange = (e) => {
  //   setFile(e.target.files[0]);
  // };

  // ✅ Download sample Excel
  const handleDownloadSample = () => {
    const sampleUrl =
      "https://crm-generalize.dentalguru.software/api/download-sample-bulk-lead";
    const link = document.createElement("a");
    link.href = sampleUrl;
    link.download = "sample_leads_upload.xlsx";
    link.click();
  };

  // Submit handler
  // const handleUpload = async (e) => {
  //   e.preventDefault();

  //   if (!file) {
  //     cogoToast.warn("Please select an Excel file");
  //     return;
  //   }

  //   const formData = new FormData();
  //   formData.append("file", file);
  //   formData.append("lead_org_id", lead_org_id);

  //   try {
  //     setLoading(true);

  //     const response = await axios.post(
  //       "https://crm-generalize.dentalguru.software/api/bulk-upload-leads",
  //       formData,
  //       {
  //         headers: {
  //           "Content-Type": "multipart/form-data",
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );

  //     cogoToast.success(
  //       response.data.message || "Leads uploaded successfully!"
  //     );
  //     fetchLeads && fetchLeads();
  //     handleClose();
  //   } catch (error) {
  //     console.error("Error uploading file:", error);
  //     cogoToast.error(error.response?.data?.message || "File upload failed");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file) return cogoToast.warn("Please select an Excel file");
    if (!assignedTo) return cogoToast.warn("Please select Assigned To");
    if (!main_project_id) return cogoToast.warn("Please select Project");
    if (!unit_id) return cogoToast.warn("Please select Unit Type");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("lead_org_id", lead_org_id);
    formData.append("assignedTo", assignedTo);
    formData.append("main_project_id", main_project_id);
    formData.append("unit_id", unit_id);

    try {
      setLoading(true);

      const response = await axios.post(
        "https://crm-generalize.dentalguru.software/api/bulk-upload-leads",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      cogoToast.success(response.data.message);
      fetchLeads && fetchLeads();
      handleClose();
    } catch (error) {
      cogoToast.error(error.response?.data?.message || "Upload failed");
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
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-3 p-6"
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-cyan-700">
                Upload Excel File
              </h2>
              <button
                onClick={handleClose}
                className="text-gray-500 hover:text-red-500 transition"
              >
                <IoCloseSharp className="w-6 h-6" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleUpload} className="space-y-5">
              {/* Assigned To */}
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Assigned To
                </label>
                <select
                  value={assignedTo}
                  onChange={(e) => setAssignedTo(e.target.value)}
                  className="mt-1 w-full px-3 py-2 border rounded-lg border-gray-300"
                >
                  <option value="">Select Employee</option>
                  {employees.map((emp) => (
                    <option key={emp.staff_id} value={emp.staff_id}>
                      {emp.staff_name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Project Name */}
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Project Name
                </label>
                <select
                  value={main_project_id}
                  onChange={(e) => setMainProjectId(e.target.value)}
                  className="mt-1 w-full px-3 py-2 border rounded-lg border-gray-300"
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
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Unit Type
                </label>
                <select
                  value={unit_id}
                  onChange={(e) => setUnitId(e.target.value)}
                  className="mt-1 w-full px-3 py-2 border rounded-lg border-gray-300"
                >
                  <option value="">Select Unit Type</option>
                  {projectUnit.map((u) => (
                    <option key={u.unit_id} value={u.unit_id}>
                      {`${u.unit_number} - ${u.unit_type} - ₹${u.base_price}`}
                    </option>
                  ))}
                </select>
              </div>

              {/* File Upload */}
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Select Excel File
                </label>
                <input
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={(e) => setFile(e.target.files[0])}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>

              {/* Download Sample */}
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-600">
                  Need a format? Download a sample file:
                </p>
                <button
                  type="button"
                  onClick={handleDownloadSample}
                  className="text-cyan-600 text-sm font-semibold hover:underline"
                >
                  Download Sample
                </button>
              </div>

              {/* Upload */}
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 bg-gray-200 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-cyan-600 text-white rounded-lg"
                >
                  {loading ? "Uploading..." : "Upload"}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BulkLeadUploadPopup;
