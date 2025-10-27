import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import cogoToast from "cogo-toast";
import { useSelector } from "react-redux";

const FinanceCompanyUpdatePopup = ({
  isOpen,
  onClose,
  fetchCompanies,
  selected,
}) => {
  const user = useSelector((state) => state.auth.user);
  const token = user.token;
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fc_org_id: user?.staff_org_id,
    fc_name: "",
    fc_contact_person: "",
    fc_contact_phone: "",
    interest_rate: 0,
  });

  const modalRef = useRef();

  useEffect(() => {
    setFormData({
      ...formData,
      fc_org_id: user?.staff_org_id,
      fc_name: selected?.fc_name,
      fc_contact_person: selected?.fc_contact_person,
      fc_contact_phone: selected?.fc_contact_phone,
      interest_rate: selected?.interest_rate,
    });
  }, [selected]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "fc_contact_phone") {
      const numericValue = value.replace(/\D/g, "");
      if (numericValue.length <= 10) {
        setFormData({ ...formData, [name]: numericValue });
      }
      return;
    }
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!formData.fc_org_id || !formData.fc_name) {
      cogoToast.error("Organization ID and Name are required");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.put(
        `https://crm-generalize.dentalguru.software/api/updateFinanceCompany/${selected?.finance_company_id}`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        cogoToast.success("Finance company added successfully!");
        fetchCompanies();
        onClose();
        setLoading(false);
      } else {
        cogoToast.error(res.data.message || "Failed to add company");
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
      cogoToast.error("Error while saving data");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      {/* Modal box */}
      <div
        ref={modalRef}
        className="bg-white rounded-2xl w-[90%] max-w-lg p-6 shadow-xl relative animate-fadeIn"
      >
        <h2 className="text-xl font-semibold mb-4 text-gray-800 text-center">
          Add Finance Company
        </h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-gray-600 mb-1">Company Name</label>
            <input
              type="text"
              name="fc_name"
              value={formData.fc_name}
              placeholder="Enter company name"
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-300 outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-gray-600 mb-1">Contact Person</label>
            <input
              type="text"
              name="fc_contact_person"
              value={formData.fc_contact_person}
              placeholder="Enter contact person's name"
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-300 outline-none"
            />
          </div>

          <div>
            <label className="block text-gray-600 mb-1">Contact Phone</label>
            <input
              type="text"
              name="fc_contact_phone"
              value={formData.fc_contact_phone}
              placeholder="Enter phone number"
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-300 outline-none"
            />
          </div>

          <div>
            <label className="block text-gray-600 mb-1">
              Interest Rate (%)
            </label>
            <input
              type="number"
              name="interest_rate"
              value={formData.interest_rate}
              onChange={handleChange}
              placeholder="Enter interest rate"
              className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-300 outline-none"
            />
          </div>

          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              {loading ? "Save...." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FinanceCompanyUpdatePopup;
