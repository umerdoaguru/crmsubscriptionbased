import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import cogoToast from "cogo-toast";
import { useSelector } from "react-redux";

const OwnerLoanAddPopup = ({
  isOpen,
  onClose,
  unitSoldData,
  fetchUnitSoldData,
}) => {
  const superadminuser = useSelector((state) => state.auth.user);
  const token = superadminuser.token;
  const user = useSelector((state) => state.auth.user);
  const [loading, setLoading] = useState(false);
  const [companies, setCompanies] = useState([]);
  const [formData, setFormData] = useState({
    loan_org_id: user?.staff_org_id || "",
    loan_owner_id: unitSoldData[0]?.esu_owner_id,
    loan_sale_id: unitSoldData[0]?.esu_id,
    loan_finance_company_id: "",
    loan_principal: "",
    loan_down_payment: "",
    loan_interest_rate: "",
    loan_tenure_months: "",
    loan_emi_amount: "",
    loan_start_date: "",
    loan_status: "",
    loan_ref: "",
  });

  const modalRef = useRef();

  const fetchCompanies = async () => {
    if (!user?.staff_org_id) return;

    try {
      const { data } = await axios.get(
        `https://crm-generalize.dentalguru.software/api/getFinanceCompanyByOrg/${user.staff_org_id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCompanies(data || []);
    } catch (error) {
      console.error("Error fetching companies:", error);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, [user?.staff_org_id]);

  useEffect(() => {
    setFormData({
      ...formData,
      loan_owner_id: unitSoldData[0]?.esu_owner_id,
      loan_sale_id: unitSoldData[0]?.esu_id,
    });
  }, [unitSoldData]);

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

  // Helper to calculate EMI
  const calculateEMI = (principal, flatRate, months) => {
    if (!principal || !flatRate || !months) return "";

    const total =
      Number(principal) + (Number(principal) * Number(flatRate)) / 100;
    const emi = total / months;

    return emi ? emi.toFixed(2) : "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "loan_principal") {
      const payableAmount = Number(unitSoldData[0]?.remaining_amount || 0);
      const enteredAmount = Number(value);

      if (enteredAmount > payableAmount) {
        cogoToast.warn("Amount cannot be greater than payable amount");
        return;
      }
    }

    if (name === "loan_finance_company_id") {
      const selectedCompany = companies.find(
        (item) => item.finance_company_id === Number(value)
      );

      setFormData((prev) => {
        const updated = {
          ...prev,
          loan_finance_company_id: value,
          loan_interest_rate:
            selectedCompany?.interest_rate || prev.loan_interest_rate || "",
        };

        // auto-update EMI if possible
        updated.loan_emi_amount = calculateEMI(
          updated.loan_principal,
          updated.loan_interest_rate,
          updated.loan_tenure_months
        );

        return updated;
      });
      return;
    }

    setFormData((prev) => {
      const updated = { ...prev, [name]: value };

      if (
        ["loan_principal", "loan_interest_rate", "loan_tenure_months"].includes(
          name
        )
      ) {
        updated.loan_emi_amount = calculateEMI(
          updated.loan_principal,
          updated.loan_interest_rate,
          updated.loan_tenure_months
        );
      }

      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(
        "https://crm-generalize.dentalguru.software/api/createOwnerLoan",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        cogoToast.success("Owner loan details added successfully!");
        fetchUnitSoldData();
        onClose();
        setLoading(false);
      } else {
        cogoToast.error(res.data.message || "Failed to add payment");
        setLoading(false);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      cogoToast.error("Error while saving data");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div
        ref={modalRef}
        className="bg-white rounded-2xl w-[90%] max-w-2xl h-[90vh] overflow-y-auto p-6 shadow-xl relative animate-fadeIn"
      >
        <h2 className="text-xl font-semibold mb-4 text-gray-800 text-center">
          Add Owner Loan Details
        </h2>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {/* Loan Principal Amount */}
          <div>
            <label className="block text-gray-700 mb-1 font-medium">
              Loan Principal (₹) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="loan_principal"
              value={formData.loan_principal}
              onChange={handleChange}
              placeholder="Enter loan principal amount"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              required
            />
            <small className="block text-green-600 mb-1">
              Payable Amount: ₹{unitSoldData[0]?.remaining_amount || 0}
            </small>
          </div>

          {/* Down Payment */}
          <div>
            <label className="block text-gray-700 mb-1 font-medium">
              Down Payment (₹)
            </label>
            <input
              type="number"
              name="loan_down_payment"
              value={formData.loan_down_payment}
              onChange={handleChange}
              placeholder="Enter down payment amount"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>

          {/* Finance Company */}
          <div>
            <label className="block text-gray-700 mb-1 font-medium">
              Finance Company ID
            </label>

            <select
              name="loan_finance_company_id"
              value={formData.loan_finance_company_id}
              onChange={handleChange}
              placeholder="Enter finance company ID"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            >
              <option value="">--selected--</option>
              {companies?.map((item) => (
                <>
                  <option value={item?.finance_company_id}>
                    {item?.fc_name}
                  </option>
                </>
              ))}
            </select>
          </div>

          {/* Interest Rate */}
          <div>
            <label className="block text-gray-700 mb-1 font-medium">
              Interest Rate (%)
            </label>
            <input
              type="number"
              step="0.01"
              name="loan_interest_rate"
              value={formData.loan_interest_rate}
              onChange={handleChange}
              placeholder="Enter interest rate (e.g., 8.5)"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>

          {/* Tenure Months */}
          <div>
            <label className="block text-gray-700 mb-1 font-medium">
              Tenure (Months)
            </label>
            <input
              type="number"
              name="loan_tenure_months"
              value={formData.loan_tenure_months}
              onChange={handleChange}
              placeholder="Enter loan tenure (in months)"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>

          {/* EMI Amount */}
          <div>
            <label className="block text-gray-700 mb-1 font-medium">
              EMI Amount (₹)
            </label>
            <input
              type="number"
              name="loan_emi_amount"
              value={formData.loan_emi_amount}
              onChange={handleChange}
              readOnly
              placeholder="Auto-calculated after entering details"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
            <small className="text-sky-700 text-sm">
              Auto-calculated EMI Amount
            </small>
          </div>

          {/* Loan Start Date */}
          <div>
            <label className="block text-gray-700 mb-1 font-medium">
              Loan Start Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="loan_start_date"
              value={formData.loan_start_date}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              required
            />
          </div>

          {/* Loan Status */}
          <div>
            <label className="block text-gray-700 mb-1 font-medium">
              Loan Status
            </label>
            <select
              name="loan_status"
              value={formData.loan_status}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            >
              <option value="">Select status</option>
              <option value="active">Active</option>
              <option value="closed">Closed</option>
              <option value="defaulted">Defaulted</option>
            </select>
          </div>

          {/* Loan Reference */}
          <div className="md:col-span-2">
            <label className="block text-gray-700 mb-1 font-medium">
              Reference / Note
            </label>
            <textarea
              name="loan_ref"
              value={formData.loan_ref}
              onChange={handleChange}
              placeholder="Enter reference or remark (optional)"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              rows={2}
            ></textarea>
          </div>

          {/* Buttons */}
          <div className="md:col-span-2 flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OwnerLoanAddPopup;
