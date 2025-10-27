import React, { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import cogoToast from "cogo-toast";
import { useSelector } from "react-redux";

const UpdateOrgModal = ({ isOpen, onClose, getOrgDataById, selected }) => {
  const modalRef = useRef();
  const user = useSelector((state) => state.auth.user);
  const [loading, setLoading] = useState(false);
  const [inputField, setInputField] = useState({
    company_name: "",
    company_name_account_name: "",
    company_name_account_ifsc: "",
    company_name_account_number: "",
    bank: "",
    company_address: "",
    moblie_no: "",
    gst_no: "",
    pan_no: "",
    email_id: "",
    website_url: "",
    org_page_id: "",
    org_page_access_token: "",
  });

  console.log(selected);

  useEffect(() => {
    setInputField({
      company_name: selected?.company_name || "",
      company_name_account_name: selected?.company_name_account_name || "",
      company_name_account_ifsc: selected?.company_name_account_ifsc || "",
      company_name_account_number: selected?.company_name_account_number || "",
      bank: selected?.bank || "",
      company_address: selected?.company_address || "",
      moblie_no: selected?.moblie_no || "",
      gst_no: selected?.gst_no || "",
      pan_no: selected?.pan_no || "",
      email_id: selected?.email_id || "",
      website_url: selected?.website_url || "",
      org_page_id: selected?.org_page_id || "",
      org_page_access_token: selected?.org_page_access_token || "",
    });
  }, [selected]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "moblie_no") {
      const numericValue = value.replace(/\D/g, "");

      if (numericValue.length <= 10) {
        setInputField({
          ...inputField,
          [name]: numericValue,
        });
      }
      return;
    }

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
        `https://crm-generalize.dentalguru.software/api/updateOrgDetails/${user?.staff_org_id}`,
        inputField,
        {
          headers: { Authorization: `Bearer ${user?.token}` },
        }
      );
      cogoToast.success("Organization details updated successfully");
      setLoading(false);
      onClose();
      getOrgDataById();
    } catch (error) {
      console.log(error);
      cogoToast.error("Failed to update organization details");
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
                {/* Company Name */}
                <div>
                  <label className="block text-gray-700 mb-1">
                    Company Name
                  </label>
                  <input
                    type="text"
                    name="company_name"
                    value={inputField.company_name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                  />
                </div>

                {/* Account Holder Name */}
                <div>
                  <label className="block text-gray-700 mb-1">
                    Account Holder Name
                  </label>
                  <input
                    type="text"
                    name="company_name_account_name"
                    value={inputField.company_name_account_name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                  />
                </div>

                {/* IFSC */}
                <div>
                  <label className="block text-gray-700 mb-1">IFSC Code</label>
                  <input
                    type="text"
                    name="company_name_account_ifsc"
                    value={inputField.company_name_account_ifsc}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded uppercase"
                  />
                </div>

                {/* Account Number */}
                <div>
                  <label className="block text-gray-700 mb-1">
                    Account Number
                  </label>
                  <input
                    type="text"
                    name="company_name_account_number"
                    value={inputField.company_name_account_number}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                  />
                </div>

                {/* Bank Name */}
                <div>
                  <label className="block text-gray-700 mb-1">Bank Name</label>
                  <input
                    type="text"
                    name="bank"
                    value={inputField.bank}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                  />
                </div>

                {/* Company Address */}
                <div>
                  <label className="block text-gray-700 mb-1">
                    Company Address
                  </label>
                  <input
                    type="text"
                    name="company_address"
                    value={inputField.company_address}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                  />
                </div>

                {/* Mobile Number */}
                <div>
                  <label className="block text-gray-700 mb-1">
                    Mobile Number
                  </label>
                  <input
                    type="text"
                    name="moblie_no"
                    value={inputField.moblie_no}
                    onChange={handleChange}
                    maxLength={10}
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                  />
                </div>

                {/* GST Number */}
                <div>
                  <label className="block text-gray-700 mb-1">GST Number</label>
                  <input
                    type="text"
                    name="gst_no"
                    value={inputField.gst_no}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded uppercase"
                  />
                </div>

                {/* PAN Number */}
                <div>
                  <label className="block text-gray-700 mb-1">PAN Number</label>
                  <input
                    type="text"
                    name="pan_no"
                    value={inputField.pan_no}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded uppercase"
                  />
                </div>

                {/* Email ID */}
                <div>
                  <label className="block text-gray-700 mb-1">Email ID</label>
                  <input
                    type="email"
                    name="email_id"
                    value={inputField.email_id}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                  />
                </div>

                {/* Website URL */}
                <div>
                  <label className="block text-gray-700 mb-1">
                    Website URL
                  </label>
                  <input
                    type="text"
                    name="website_url"
                    value={inputField.website_url}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                  />
                </div>

                {/* Org Page ID */}
                <div>
                  <label className="block text-gray-700 mb-1">
                    Org Page ID
                  </label>
                  <input
                    type="text"
                    name="org_page_id"
                    value={inputField.org_page_id}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                  />
                </div>

                {/* Org Page Access Token */}
                <div className="md:col-span-2">
                  <label className="block text-gray-700 mb-1">
                    Org Page Access Token
                  </label>
                  <input
                    type="text"
                    name="org_page_access_token"
                    value={inputField.org_page_access_token}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                  />
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

export default UpdateOrgModal;
