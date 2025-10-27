import React, { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import cogoToast from "cogo-toast";
import { IoCloseSharp } from "react-icons/io5";
import { useSelector } from "react-redux";

const BulkLeadUploadPopup = ({ isOpen, onClose, fetchLeads }) => {
  const modalRef = useRef();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const EmpId = useSelector((state) => state.auth.user);
  const token = EmpId?.token;
  const lead_org_id = EmpId?.staff_org_id;

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
    onClose();
  };

  // File upload change handler
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

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
  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file) {
      cogoToast.warn("Please select an Excel file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("lead_org_id", lead_org_id);

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

      cogoToast.success(
        response.data.message || "Leads uploaded successfully!"
      );
      fetchLeads && fetchLeads();
      handleClose();
    } catch (error) {
      console.error("Error uploading file:", error);
      cogoToast.error(error.response?.data?.message || "File upload failed");
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
              <div>
                <label className="text-sm font-medium text-gray-600 block mb-2">
                  Select Excel File
                </label>
                <input
                  type="file"
                  accept=".xlsx, .xls"
                  onChange={handleFileChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 file:mr-3 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:bg-cyan-600 file:text-white hover:file:bg-cyan-700 focus:outline-none"
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

              {/* Buttons */}
              <div className="flex justify-end gap-3 pt-2">
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
