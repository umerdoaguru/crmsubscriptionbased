import React, { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import cogoToast from "cogo-toast";
import { useSelector } from "react-redux";
import { IoCloseSharp } from "react-icons/io5";
import { useParams } from "react-router-dom";

const SuperBulkUnitUploadPopup = ({ isOpen, onClose, fetchUnits }) => {
  const { id } = useParams(); 
  const modalRef = useRef();
  const EmpId = useSelector((state) => state.auth.user);
  const token = EmpId?.token;
  const orgId = EmpId?.staff_org_id;

  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);

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

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return cogoToast.error("Please select an Excel file first");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("unit_org_id", orgId);
    formData.append("unit_project_id", id);

    try {
      setLoading(true);
      await axios.post(
        "https://crm-generalize.dentalguru.software/api/addUnitsBulk",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      cogoToast.success("Units uploaded successfully!");
      setFile(null);
      fetchUnits();
      onClose();
    } catch (error) {
      console.error(error);
      cogoToast.error(
        error.response?.data?.message || "Failed to upload file. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

   const handleDownloadSample = () => {
    const sampleFileUrl =
      "https://crm-generalize.dentalguru.software/api/download-sample-bulk-unit";

    const link = document.createElement("a");
    link.href = sampleFileUrl;
    link.download = "sample-unit-upload.xlsx";
    link.click();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999] p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            ref={modalRef}
            initial={{ scale: 0.9, opacity: 0, y: -20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-3 p-6 relative"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-600 hover:text-red-500 transition"
            >
              <IoCloseSharp className="w-7 h-7" />
            </button>

            <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
              Bulk Upload Units
            </h2>

            <form onSubmit={handleUpload} className="space-y-6">
              {/* File Upload */}
              <div className="flex flex-col items-center border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-cyan-500 transition">
                <input
                  type="file"
                  accept=".xlsx, .xls"
                  onChange={handleFileChange}
                  className="hidden"
                  id="excelFileInput"
                />
                <label
                  htmlFor="excelFileInput"
                  className="cursor-pointer text-center"
                >
                  <p className="text-gray-600 mb-2">
                    {file ? (
                      <span className="font-semibold text-gray-800">
                        {file.name}
                      </span>
                    ) : (
                      "Click to select Excel file (.xlsx / .xls)"
                    )}
                  </p>
                  <p className="text-sm text-gray-400">
                    Ensure your sheet has columns: unit_number, unit_area, unit_type, base_price, etc.
                  </p>
                </label>
              </div>

               {/* Sample File Download */}
              <div className="flex justify-center">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={handleDownloadSample}
                  className="text-cyan-600 font-semibold hover:text-cyan-700 underline transition"
                >
                  Download Sample Excel File
                </motion.button>
              </div>

              {/* Upload Button */}
              <motion.button
                whileTap={{ scale: 0.95 }}
                type="submit"
                disabled={loading}
                className="w-full bg-cyan-600 text-white py-3 rounded-lg hover:bg-cyan-700 transition font-semibold shadow-md"
              >
                {loading ? "Uploading..." : "Upload Units"}
              </motion.button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SuperBulkUnitUploadPopup;
