import React, { useState, useEffect } from "react";
import axios from "axios";
import { BsPencilSquare, BsTrash, BsPlusCircle } from "react-icons/bs";
import Sider from "../components/Sider";
import Modal from "../adiComponent/Modal";
import { useNavigate } from "react-router-dom";
import MainHeader from "../components/MainHeader";

const Overview = () => {
  const [companies, setCompanies] = useState([]);
  const [newCompany, setNewCompany] = useState({
    name: "",
    contact: "",
    bankDetails: "",
    email_id: "",
    bankname: "",
    ifsc_code: "",
    acc_no: "",
    type: "",
    zip_code: "",
    location: "",
    district: "",
    signature: null,
    logo: null,
  });
  const [editingIndex, setEditingIndex] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const response = await axios.get(
        "http://localhost:9000/api/getOrganization"
      );
      const { organizations } = response.data;
      setCompanies(organizations);
    } catch (error) {
      console.error("Error fetching companies:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // Allow only numeric values and limit to 10 characters for specific fields
    const numericFields = ["contact", "zip_code", "acc_no"];
    const numericValue = numericFields.includes(name)
      ? value.replace(/[^0-9]/g, "").slice(0, 10)
      : value;
    setNewCompany((prev) => ({ ...prev, [name]: numericValue }));
  };

  const handleKeyPress = (e) => {
    // Allow only numeric keys and control keys (e.g., backspace, arrow keys)
    if (
      !/[0-9]/.test(e.key) &&
      !["Backspace", "ArrowLeft", "ArrowRight"].includes(e.key)
    ) {
      e.preventDefault();
    }
  };

  const handleFileInput = (e, field) => {
    setNewCompany((prev) => ({ ...prev, [field]: e.target.files[0] }));
  };

  const validateForm = () => {
    const newErrors = {};

    // Validate fields
    if (!newCompany.name) newErrors.name = "Company Name is required";
    if (!newCompany.contact) newErrors.contact = "Contact No is required";
    else if (!/^\d{10}$/.test(newCompany.contact))
      newErrors.contact = "Contact No must be a 10-digit number";
    if (!newCompany.bankDetails)
      newErrors.bankDetails = "Bank Details are required";
    if (!newCompany.email_id) newErrors.email_id = "Email ID is required";
    if (!newCompany.bankname) newErrors.bankname = "Bank Name is required";
    if (!newCompany.ifsc_code) newErrors.ifsc_code = "IFSC Code is required";
    if (!newCompany.acc_no) newErrors.acc_no = "Account Number is required";
    if (!newCompany.type) newErrors.type = "Type is required";
    if (!newCompany.zip_code) newErrors.zip_code = "Zip Code is required";
    if (!newCompany.location) newErrors.location = "Location is required";
    if (!newCompany.district) newErrors.district = "District is required";
    if (!newCompany.signature) newErrors.signature = "Signature is required";
    if (!newCompany.logo) newErrors.logo = "Logo is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveCompany = async () => {
    if (!validateForm()) return; // Prevent submission if validation fails

    try {
      const formData = new FormData();
      formData.append("name", newCompany.name);
      formData.append("contact", newCompany.contact);
      formData.append("bankDetails", JSON.stringify(newCompany.bankDetails));
      formData.append("email_id", newCompany.email_id);
      formData.append("bankname", newCompany.bankname);
      formData.append("ifsc_code", newCompany.ifsc_code);
      formData.append("acc_no", newCompany.acc_no);
      formData.append("type", newCompany.type);
      formData.append("zip_code", newCompany.zip_code);
      formData.append("location", newCompany.location);
      formData.append("district", newCompany.district);

      if (newCompany.signature)
        formData.append("signature", newCompany.signature);
      if (newCompany.logo) formData.append("logo", newCompany.logo);

      if (editingIndex !== null) {
        const companyId = companies[editingIndex].companyId;
        await axios.put(
          `http://localhost:9000/api/updateOrganization/${companyId}`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        const updatedCompanies = [...companies];
        updatedCompanies[editingIndex] = { ...newCompany, companyId };
        setCompanies(updatedCompanies);
        setEditingIndex(null);
      } else {
        await axios.post(
          "http://localhost:9000/api/addOrganization",
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        setCompanies((prev) => [
          ...prev,
          { ...newCompany, companyId: Date.now() },
        ]);
      }

      setNewCompany({
        name: "",
        contact: "",
        bankDetails: "",
        email_id: "",
        bankname: "",
        ifsc_code: "",
        acc_no: "",
        type: "",
        zip_code: "",
        location: "",
        district: "",
        signature: null,
        logo: null,
      });
      setShowForm(false);
      setErrors({});
      fetchCompanies();
    } catch (error) {
      console.error(
        "Error saving company:",
        error.response?.data || error.message
      );
    }
  };

  const handleCancel = () => {
    setNewCompany({
      name: "",
      contact: "",
      bankDetails: "",
      email_id: "",
      bankname: "",
      ifsc_code: "",
      acc_no: "",
      type: "",
      zip_code: "",
      location: "",
      district: "",
      signature: null,
      logo: null,
    });
    setEditingIndex(null);
    setShowForm(false);
    setErrors({});
  };

  const handleEditCompany = (index) => {
    const companyToEdit = companies[index];
    setNewCompany({
      name: companyToEdit.name,
      contact: companyToEdit.contact,
      bankDetails: companyToEdit.bankDetails,
      email_id: companyToEdit.email_id,
      bankname: companyToEdit.bankname,
      ifsc_code: companyToEdit.ifsc_code,
      acc_no: companyToEdit.acc_no,
      type: companyToEdit.type,
      zip_code: companyToEdit.zip_code,
      location: companyToEdit.location,
      district: companyToEdit.district,
      signature: null, // File inputs won't be prefilled
      logo: null, // File inputs won't be prefilled
    });
    setEditingIndex(index);
    setShowForm(true);
  };

  const handleDeleteCompany = async (companyId) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this organization?"
    );
    if (isConfirmed) {
      try {
        await axios.delete(
          `http://localhost:9000/api/deleteOrganization/${companyId}`
        );
        setCompanies(
          companies.filter((company) => company.companyId !== companyId)
        );
      } catch (error) {
        console.error("Error deleting company:", error);
      }
    }
  };

  const handleViewCompany = (companyId) => {
    navigate(`/singleOrganization/${companyId}`);
  };

  return (
    <>
      <MainHeader />
      <Sider />

      <div className="flex min-h-screen">
        <main className="flex-1 p-6 ml-0 lg:p-8 lg:ml-64 xl:ml-80">
          <div className="flex flex-col items-start justify-between mb-8 lg:flex-row lg:items-center">
            <h2 className="mb-4 text-2xl font-bold text-gray-800 lg:mb-0">
              Organization Management
            </h2>
            <button
              onClick={() => {
                setShowForm(true);
                setEditingIndex(null);
              }}
              className="flex items-center px-4 py-2 text-white transition duration-200 bg-blue-500 rounded-lg shadow-lg hover:bg-blue-600"
            >
              <BsPlusCircle className="mr-2" /> Add Organization
            </button>
          </div>

          <div className="overflow-x-auto rounded-lg shadow-md">
            <table className="min-w-full bg-white">
              <thead>
                <tr className="text-sm font-semibold text-left text-gray-600 uppercase bg-gray-200">
                  <th className="px-4 py-3 sm:px-6">Name</th>
                  <th className="px-4 py-3 sm:px-6">Contact No</th>
                  <th className="px-4 py-3 sm:px-6">Bank Details</th>
                  <th className="px-4 py-3 sm:px-6">Signature</th>
                  <th className="px-4 py-3 sm:px-6">Logo</th>
                  <th className="px-4 py-3 sm:px-6">Actions</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(companies) &&
                  companies.map((company, index) => (
                    <tr
                      key={index}
                      className="border-b border-gray-200 hover:bg-gray-100"
                      onClick={() => handleViewCompany(company.companyId)}
                    >
                      <td className="px-4 py-4 sm:px-6">{company.name}</td>
                      <td className="px-4 py-4 sm:px-6">{company.contact}</td>
                      <td className="px-4 py-4 sm:px-6">
                        {company.bankDetails}
                      </td>
                      <td className="px-4 py-4 sm:px-6">
                        {company.signature ? (
                          <img
                            src={`${company.signature}`}
                            alt="Signature"
                            className="w-12 h-12"
                          />
                        ) : (
                          "No Signature"
                        )}
                      </td>
                      <td className="px-4 py-4 sm:px-6">
                        {company.logo ? (
                          <img
                            src={`${company.logo}`}
                            alt="Company Logo"
                            className="object-cover w-12 h-12"
                          />
                        ) : (
                          "No Logo"
                        )}
                      </td>
                      <td className="px-4 py-4 sm:px-6">
                        <div className="flex space-x-2 sm:space-x-4">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditCompany(index);
                            }}
                            className="text-blue-500 transition duration-200 hover:text-blue-600"
                          >
                            <BsPencilSquare size={20} />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteCompany(company.companyId);
                            }}
                            className="text-red-500 transition duration-200 hover:text-red-600"
                          >
                            <BsTrash size={20} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          <Modal isOpen={showForm} onClose={handleCancel}>
            <h3 className="mb-4 text-lg font-bold">
              {editingIndex !== null ? "Edit Organization" : "Add Organization"}
            </h3>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <input
                type="text"
                name="name"
                value={newCompany.name}
                onChange={handleInputChange}
                placeholder="Company Name"
                className={`p-2 border rounded-lg ${
                  errors.name ? "border-red-500" : ""
                }`}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name}</p>
              )}
              <input
                type="tel"
                name="contact"
                value={newCompany.contact}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                placeholder="Contact No"
                maxLength="10"
                className={`p-2 border rounded-lg ${
                  errors.contact ? "border-red-500" : ""
                }`}
              />
              {errors.contact && (
                <p className="text-sm text-red-500">{errors.contact}</p>
              )}
              <textarea
                name="bankDetails"
                value={newCompany.bankDetails}
                onChange={handleInputChange}
                placeholder="Bank Details"
                className={`p-2 border rounded-lg ${
                  errors.bankDetails ? "border-red-500" : ""
                }`}
              />
              {errors.bankDetails && (
                <p className="text-sm text-red-500">{errors.bankDetails}</p>
              )}
              <input
                type="text"
                name="email_id"
                value={newCompany.email_id}
                onChange={handleInputChange}
                placeholder="Email ID"
                className={`p-2 border rounded-lg ${
                  errors.email_id ? "border-red-500" : ""
                }`}
              />
              {errors.email_id && (
                <p className="text-sm text-red-500">{errors.email_id}</p>
              )}
              <input
                type="text"
                name="bankname"
                value={newCompany.bankname}
                onChange={handleInputChange}
                placeholder="Bank Name"
                className={`p-2 border rounded-lg ${
                  errors.bankname ? "border-red-500" : ""
                }`}
              />
              {errors.bankname && (
                <p className="text-sm text-red-500">{errors.bankname}</p>
              )}
              <input
                type="text"
                name="ifsc_code"
                value={newCompany.ifsc_code}
                onChange={handleInputChange}
                placeholder="IFSC Code"
                className={`p-2 border rounded-lg ${
                  errors.ifsc_code ? "border-red-500" : ""
                }`}
              />
              {errors.ifsc_code && (
                <p className="text-sm text-red-500">{errors.ifsc_code}</p>
              )}
              <input
                type="text"
                name="acc_no"
                value={newCompany.acc_no}
                onChange={handleInputChange}
                placeholder="Account Number"
                className={`p-2 border rounded-lg ${
                  errors.acc_no ? "border-red-500" : ""
                }`}
              />
              {errors.acc_no && (
                <p className="text-sm text-red-500">{errors.acc_no}</p>
              )}
              <input
                type="text"
                name="type"
                value={newCompany.type}
                onChange={handleInputChange}
                placeholder="Type"
                className={`p-2 border rounded-lg ${
                  errors.type ? "border-red-500" : ""
                }`}
              />
              {errors.type && (
                <p className="text-sm text-red-500">{errors.type}</p>
              )}
              <input
                type="text"
                name="zip_code"
                value={newCompany.zip_code}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                placeholder="Zip Code"
                maxLength="10"
                className={`p-2 border rounded-lg ${
                  errors.zip_code ? "border-red-500" : ""
                }`}
              />
              {errors.zip_code && (
                <p className="text-sm text-red-500">{errors.zip_code}</p>
              )}
              <input
                type="text"
                name="location"
                value={newCompany.location}
                onChange={handleInputChange}
                placeholder="Location"
                className={`p-2 border rounded-lg ${
                  errors.location ? "border-red-500" : ""
                }`}
              />
              {errors.location && (
                <p className="text-sm text-red-500">{errors.location}</p>
              )}
              <input
                type="text"
                name="district"
                value={newCompany.district}
                onChange={handleInputChange}
                placeholder="District"
                className={`p-2 border rounded-lg ${
                  errors.district ? "border-red-500" : ""
                }`}
              />
              {errors.district && (
                <p className="text-sm text-red-500">{errors.district}</p>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileInput(e, "signature")}
                className={`p-2 border rounded-lg ${
                  errors.signature ? "border-red-500" : ""
                }`}
              />
              {errors.signature && (
                <p className="text-sm text-red-500">{errors.signature}</p>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileInput(e, "logo")}
                className={`p-2 border rounded-lg ${
                  errors.logo ? "border-red-500" : ""
                }`}
              />
              {errors.logo && (
                <p className="text-sm text-red-500">{errors.logo}</p>
              )}
            </div>
            <div className="flex justify-end mt-4 space-x-4">
              <button
                onClick={handleCancel}
                className="px-4 py-2 text-gray-500 transition duration-200 border border-gray-300 rounded-lg hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveCompany}
                className="px-4 py-2 text-white transition duration-200 bg-blue-500 rounded-lg hover:bg-blue-600"
              >
                Save
              </button>
            </div>
          </Modal>
        </main>
      </div>
    </>
  );
};

export default Overview;
