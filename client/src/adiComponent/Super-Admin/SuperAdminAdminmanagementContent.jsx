import React, { useState, useEffect } from "react";
import axios from "axios";
import { BsPencilSquare, BsTrash, BsPlusCircle } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import cogoToast from "cogo-toast";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Modal from "../Modal";
import ReactPaginate from "react-paginate";
import { useSelector } from "react-redux";

function SuperAdminAdminmanagementContent() {
  const [admins, setAdmins] = useState([]);
  const superadminuser = useSelector((state) => state.auth.user);
  const token = superadminuser.token;
  const userId = superadminuser.id;
  const initialAdminState = {
    name: "",
    email: "",
    password: "",
    position: "",
    phone: "",
    user_id: userId,
  };
  const [newAdmin, setNewAdmin] = useState(initialAdminState);
  const [editingIndex, setEditingIndex] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 7;
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  // Fetch admins when component loads
  useEffect(() => {
    fetchAdmins();
  }, []);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleCancel = () => {
    setNewAdmin(initialAdminState);
    setShowForm(false);
    setValidationErrors({});
  };

  // Fetch all admins from the backend
  const fetchAdmins = async () => {
    try {
      const response = await axios.get(
        `https://crm-generalize.dentalguru.software/api/getAllAdmins/${userId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const admins = response.data.admins;
      setAdmins(admins || []);
      console.log("Admins fetched successfully", admins);
    } catch (error) {
      console.error("Error fetching admins:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "phone") {
      const numericValue = value.replace(/[^0-9]/g, "").slice(0, 10);
      setNewAdmin((prev) => ({ ...prev, [name]: numericValue }));
    } else {
      setNewAdmin((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleKeyPress = (e) => {
    if (e.target.name === "phone") {
      if (
        !/[0-9]/.test(e.key) &&
        !["Backspace", "ArrowLeft", "ArrowRight"].includes(e.key)
      ) {
        e.preventDefault();
      }
    }
  };

  const validateForm = async () => {
    const errors = {};

    if (!newAdmin.name) errors.name = "Name is required";
    if (!newAdmin.email) errors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(newAdmin.email))
      errors.email = "Email is invalid";

    if (!newAdmin.password) errors.password = "Password is required";
    if (!newAdmin.position) errors.position = "Position is required";
    if (!newAdmin.phone) errors.phone = "Phone number is required";
    else if (!/^\d{10}$/.test(newAdmin.phone))
      errors.phone = "Phone number must be 10 digits";

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Save or update admin
  const handleSaveAdmin = async (e) => {
    e.preventDefault();

    if (!(await validateForm())) {
      alert("Form validation failed.");
      return;
    }

    try {
      if (editingIndex !== null) {
        const adminToUpdate = admins[editingIndex];

        await axios.put(
          `https://crm-generalize.dentalguru.software/api/updateAdmin/${adminToUpdate.admin_id}`,
          newAdmin,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        cogoToast.success("Admin updated successfully!");
      } else {
        const response = await axios.post(
          "https://crm-generalize.dentalguru.software/api/addAdmin",
          newAdmin,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.success) {
          cogoToast.success(response.data.message);
        }
      }

      setNewAdmin(initialAdminState);
      await fetchAdmins();
      setShowForm(false);
    } catch (error) {
      console.error(
        "Error saving Admin:",
        error.response ? error.response.data : error.message
      );
      alert(
        "Error saving Admin: " +
          (error.response?.data?.message || error.message)
      );

      if (error.response && error.response.status === 400) {
        cogoToast.error(error.response.data.message);
      } else {
        cogoToast.error("Error saving Admin.");
      }
    }
  };

  const handleEditAdmin = (index) => {
    const adminToEdit = admins[index];

    setNewAdmin({
      name: adminToEdit.name || "",
      email: adminToEdit.email || "",
      password: adminToEdit.password || "",
      position: adminToEdit.position || "",
      phone: adminToEdit.phone || "",
    });
    setEditingIndex(index);
    setShowForm(true);
  };

  const handleDeleteAdmin = async (admin_id) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this admin?"
    );
    if (isConfirmed) {
      try {
        await axios.delete(
          `https://crm-generalize.dentalguru.software/api/deleteAdmin/${admin_id}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        fetchAdmins();
      } catch (error) {
        console.error("Error deleting admin:", error);
      }
    }
  };
  const pageCount = Math.ceil(admins.length / itemsPerPage);

  // Pagination logic
  const indexOfLastLead = (currentPage + 1) * itemsPerPage;
  const indexOfFirstLead = indexOfLastLead - itemsPerPage;
  const currentAdmins = admins.slice(indexOfFirstLead, indexOfLastLead);

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  return (
    <>
      <div className="flex mt-20">
        <div className="w-full min-h-screen bg-[#F9FAFF] p-2">
          <div className="flex flex-col lg:flex-row">
            {/* Main Content Area */}
            <div className="flex-grow p-4 mt-1">
              <center className="text-2xl text-center font-medium">
                Admin Management
              </center>
              <center className="mx-auto h-[3px] w-16 bg-cyan-600 my-3"></center>

              <div className="gap-4 mb-3">
                <button
                  onClick={() => {
                    setShowForm(true);
                    setEditingIndex(null);
                  }}
                  className="mt-4 px-6 py-2 bg-cyan-500 text-white rounded hover:bg-cyan-700 transition"
                >
                  <BsPlusCircle className="inline-block mr-2" /> Add Admin
                </button>
              </div>

              {/* Admins table */}
              <div className="overflow-x-auto rounded-lg shadow-md">
                <table className="min-w-full bg-white">
                  <thead>
                    <tr className="text-sm font-semibold text-left text-gray-600 uppercase bg-gray-200">
                      <th className="px-4 py-3 sm:px-6">Name</th>
                      <th className="px-4 py-3 sm:px-6">Email</th>
                      <th className="px-4 py-3 sm:px-6">Role</th>
                      <th className="px-4 py-3 sm:px-6">Phone</th>
                      <th className="px-4 py-3 sm:px-6">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentAdmins.length > 0 ? (
                      currentAdmins
                        .filter((admin) => admin && admin.name)
                        .map((admin, index) => (
                          <tr
                            key={admin.admin_id}
                            onClick={() =>
                              navigate(
                                `/super-admin-admin-employe/${admin.admin_id}`
                              )
                            }
                            className="border-b border-gray-200 hover:text-cyan-600"
                          >
                            <td className="px-4 py-4 sm:px-6">{admin.name}</td>
                            <td className="px-4 py-4 sm:px-6">{admin.email}</td>
                            <td className="px-4 py-4 sm:px-6">
                              {admin.position}
                            </td>
                            <td className="px-4 py-4 sm:px-6">{admin.phone}</td>
                            <td className="px-4 py-4 sm:px-6">
                              <div className="flex space-x-2 sm:space-x-4">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleEditAdmin(index);
                                  }}
                                  className="text-cyan-500 transition hover:text-cyan-600"
                                >
                                  <BsPencilSquare size={20} />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteAdmin(admin.admin_id);
                                  }}
                                  className="text-red-500 transition hover:text-red-600"
                                >
                                  <BsTrash size={20} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="py-4 text-center">
                          No admins found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <div className="mt-2 mb-2 flex justify-center">
                <ReactPaginate
                  previousLabel={"Previous"}
                  nextLabel={"Next"}
                  breakLabel={"..."}
                  pageCount={pageCount}
                  forcePage={currentPage}
                  marginPagesDisplayed={2}
                  pageRangeDisplayed={3}
                  onPageChange={handlePageClick}
                  containerClassName={"pagination"}
                  activeClassName={"active"}
                  pageClassName={"page-item"}
                  pageLinkClassName={"page-link"}
                  previousClassName={"page-item"}
                  nextClassName={"page-item"}
                  previousLinkClassName={"page-link"}
                  nextLinkClassName={"page-link"}
                  breakClassName={"page-item"}
                  breakLinkClassName={"page-link"}
                />
              </div>

              {/* Modal */}
              <Modal isOpen={showForm} onClose={() => setShowForm(false)}>
                <h3 className="mb-4 text-lg font-bold">
                  {editingIndex !== null ? "Edit Employee" : "Add Employee"}
                </h3>
                <form onSubmit={handleSaveAdmin}>
                  {/* Name */}
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={newAdmin.name}
                    onChange={handleInputChange}
                    placeholder="Enter name"
                    className={`block w-full px-4 py-2 mb-2 border rounded-lg ${
                      validationErrors.name
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  />
                  {validationErrors.name && (
                    <p className="text-red-500 text-sm">
                      {validationErrors.name}
                    </p>
                  )}

                  {/* Email */}
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={newAdmin.email}
                    onChange={handleInputChange}
                    placeholder="Enter email"
                    className={`block w-full px-4 py-2 mb-2 border rounded-lg ${
                      validationErrors.email
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  />
                  {validationErrors.email && (
                    <p className="text-red-500 text-sm">
                      {validationErrors.email}
                    </p>
                  )}

                  {/* Password */}
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={newAdmin.password}
                      onChange={handleInputChange}
                      placeholder="Enter password"
                      className={`block w-full px-4 py-2 mb-2 border rounded-lg ${
                        validationErrors.password
                          ? "border-red-500"
                          : "border-gray-300"
                      } pr-12`}
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-cyan-500 hover:text-cyan-700"
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                  {validationErrors.password && (
                    <p className="text-red-500 text-sm">
                      {validationErrors.password}
                    </p>
                  )}

                  {/* Position */}
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Position
                  </label>
                  <input
                    type="text"
                    name="position"
                    value={newAdmin.position}
                    onChange={handleInputChange}
                    placeholder="Enter position"
                    className={`block w-full px-4 py-2 mb-2 border rounded-lg ${
                      validationErrors.position
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  />
                  {validationErrors.position && (
                    <p className="text-red-500 text-sm">
                      {validationErrors.position}
                    </p>
                  )}

                  {/* Phone */}
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={newAdmin.phone}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                    placeholder="Enter phone number"
                    className={`block w-full px-4 py-2 mb-2 border rounded-lg ${
                      validationErrors.phone
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  />
                  {validationErrors.phone && (
                    <p className="text-red-500 text-sm">
                      {validationErrors.phone}
                    </p>
                  )}

                  {/* Buttons */}
                  <div className="flex justify-end mt-4 gap-3">
                    <button
                      onClick={handleCancel}
                      className="px-4 py-2 text-white bg-gray-500 rounded-lg hover:bg-gray-600"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveAdmin}
                      className="px-4 py-2 text-white bg-cyan-500 rounded-lg hover:bg-cyan-600"
                    >
                      {editingIndex !== null ? "Update" : "Add"}
                    </button>
                  </div>
                </form>
              </Modal>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default SuperAdminAdminmanagementContent;
