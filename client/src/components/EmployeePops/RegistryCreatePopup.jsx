import React, { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import cogoToast from "cogo-toast";
import { useSelector } from "react-redux";

const RegistryCreatePopup = ({ isOpen, onClose, leads, booking }) => {
  const modalRef = useRef();
  const Emp = useSelector((state) => state.auth.user);
  console.log(Emp);

  const token = Emp?.token;
  const today = new Date().toISOString().split("T")[0];
  const [registry, setRegistry] = useState({
    registry_esu_id: booking[0]?.esu_id,
    registry_org_id: Emp?.staff_org_id,
    registry_lead_id: leads[0]?.lead_id || leads[0]?.leadgen_id,
    registry_amount: "",
    registry_date: today,
    registry_notes: "",
  });
  const [registryDoc, setRegistryDoc] = useState(null);

  console.log(leads);

  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setRegistry({
      ...registry,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    setRegistryDoc(e.target.files[0]);
  };

  const saveUnitSold = async (e) => {
    e.preventDefault();

    if (window.__UNIT_SOLD_SUBMITTING__) return;
    window.__UNIT_SOLD_SUBMITTING__ = true;

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("registry_esu_id", booking[0]?.esu_id);
      formData.append("registry_org_id", Emp?.staff_org_id);
      formData.append(
        "registry_lead_id",
        leads[0]?.lead_id || leads[0]?.leadgen_id
      );
      formData.append("registry_amount", registry.registry_amount);
      formData.append("registry_date", registry.registry_date);
      formData.append("registry_notes", registry.registry_notes);

      if (registryDoc) formData.append("registry_document_url", registryDoc);

      const soldRes = await axios.post(
        `https://crm-generalize.dentalguru.software/api/createRegistry`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      cogoToast.success("Registry saved successfully");
      onClose();
    } catch (err) {
      console.error(err);
      cogoToast.error("Failed to save data");
    } finally {
      setLoading(false);
      setTimeout(() => (window.__UNIT_SOLD_SUBMITTING__ = false), 800);
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
            className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-3xl mx-4 overflow-y-auto max-h-[90vh]"
            initial={{ scale: 0.9, opacity: 0, y: -30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 30 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-2xl font-bold mb-4 text-center text-cyan-700">
              Registry Creation
            </h2>

            <form onSubmit={saveUnitSold} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm">Registry Amount</label>
                  <input
                    type="text"
                    name="registry_amount"
                    placeholder="Enter register amount"
                    value={registry?.registry_amount}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>

                <div>
                  <label className="text-sm">Registry Date</label>
                  <input
                    type="date"
                    name="registry_date"
                    value={registry.registry_date}
                    onChange={handleChange}
                    max={today}
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium mb-1">
                    Registry Notes
                  </label>
                  <textarea
                    name="registry_notes"
                    value={registry.registry_notes}
                    onChange={handleChange}
                    placeholder="Add any notes"
                    className="w-full px-3 py-2 border rounded h-24 resize-none"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium mb-1">
                    Upload Registry Document
                  </label>
                  <input
                    type="file"
                    name="registry_document_url"
                    accept="application/pdf"
                    onChange={handleFileChange}
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
              </div>

              {/* ---------- BUTTONS ---------- */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  className="bg-gray-500 text-white px-4 py-2 rounded"
                  onClick={onClose}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className={`px-4 py-2 rounded text-white ${
                    loading ? "bg-gray-600" : "bg-cyan-600 hover:bg-cyan-700"
                  }`}
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

export default RegistryCreatePopup;
