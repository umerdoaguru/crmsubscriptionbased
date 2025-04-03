import React, { useState, useEffect } from "react";
import axios from "axios";



import { BsPencilSquare, BsTrash, BsPlusCircle } from "react-icons/bs";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import cogoToast from "cogo-toast"; // Import CogoToast
import { FaEye, FaEyeSlash } from "react-icons/fa";

import SuperAdminSider from './SuperAdminSider';
import MainHeader from './../../components/MainHeader';
import Modal from './../Modal';
import ReactPaginate from "react-paginate";
import { useSelector } from "react-redux";

function Super_Admin_Adminmanagement() {
  const [admins, setAdmins] = useState([]);
  const initialAdminState = {
    name: "",
    email: "",
    password: "",
    position: "",
    phone: "",
  };
  const [newAdmin, setNewAdmin] = useState(initialAdminState);
  const [editingIndex, setEditingIndex] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 7; 
  const navigate = useNavigate(); // Initialize useNavigate
  const [showPassword, setShowPassword] = useState(false); // State to manage password visibility
  const superadminuser = useSelector((state) => state.auth.user);
  const token = superadminuser.token;
  // Fetch admins when component loads
  useEffect(() => {
    fetchAdmins();
  }, []);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleCancel = () => {
    setNewAdmin(initialAdminState); // Reset the form state
    setShowForm(false); // Close the modal
    setValidationErrors({})
  };


  // Fetch all admins from the backend
  const fetchAdmins = async () => {
    try {
      const response = await axios.get(
        "https://crmdemo.vimubds5.a2hosted.com/api/getAllAdmins",
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }}
      );
      const admins = response.data.admins;
      setAdmins(admins || []);
      console.log("Admins fetched successfully", admins);
    } catch (error) {
      console.error("Error fetching admins:", error);
    }
  };

  // const isEmailTaken = async (email) => {
  //   if (!email) {
  //     console.error("No email provided for validation");
  //     return false; // Return false if no email is passed
  //   }

  //   try {
  //     const response = await axios.get(
  //       "https://crmdemo.vimubds5.a2hosted.com/api/admins/checkEmail",
  //       {
  //         params: { email },
  //       }
  //     );
  //     return response.data.exists; // Assuming response has 'exists' field
  //   } catch (error) {
  //     console.error(
  //       "Error checking email:",
  //       error.response ? error.response.data : error.message
  //     );
  //     return false; // If the request fails, assume the email is not taken
  //   }
  // };

  // Handle input changes for the new admin

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
    // else if (await isEmailTaken(newAdmin.email))
    //   errors.email = "Email is already taken";
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
    console.log("Form submission started.");

    if (!(await validateForm())) {
      alert("Form validation failed.");
      console.log("Form validation failed.");
      return;
    }

    try {
      if (editingIndex !== null) {
        const adminToUpdate = admins[editingIndex];
        console.log("Updating admin:", adminToUpdate);
        console.log("Admin ID to update:", adminToUpdate.admin_id);
        console.log("Data to be sent for update:", newAdmin);

        // Check for the specific fields
        console.log("Phone to update:", newAdmin);
        // console.log("Password to update:", newAdmin.password);

        await axios.put(
          `https://crmdemo.vimubds5.a2hosted.com/api/updateAdmin/${adminToUpdate.admin_id}`,
          newAdmin
        );

        cogoToast.success("Admin updated successfully!");

        console.log("Admin updated successfully!");
      } else {
        console.log("Adding new admin:", newAdmin);

        const response = await axios.post(
          "https://crmdemo.vimubds5.a2hosted.com/api/addAdmin",
          newAdmin
        );

        if (response.data.success) {
          cogoToast.success(response.data.message);
         
          console.log("Admin added successfully:", response.data.message);
        }
      }

      setNewAdmin(initialAdminState);
      console.log("Form inputs cleared.");
      await fetchAdmins(); // Refresh admin list
      console.log("Fetched updated list of admins.");
      setShowForm(false); // Close modal
      console.log("Modal closed after saving admin.");
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
        console.log("Error response 400:", error.response.data.message);
      } else {
        cogoToast.error("Error saving Admin.");
        console.log("General error saving Admin.");
      }
    }
  };

  // Handle edit admin
  const handleEditAdmin = (index) => {
    console.log("Editing admin at index:", index);
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
    console.log("Form populated with admin details for editing:", adminToEdit);
  };

  const handleDeleteAdmin = async (admin_id) => {
    console.log("Admin ID:", admin_id);
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this admin?"
    );
    if (isConfirmed) {
      try {
        await axios.delete(`https://crmdemo.vimubds5.a2hosted.com/api/deleteAdmin/${admin_id}`);
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
    console.log("change current page ", data.selected);
  };
  

  return (
    <>
      <MainHeader />
      <SuperAdminSider />

      <div className="flex flex-col lg:flex-row">
        {/* Main Content Area */}
        <div className="flex-grow p-4 mt-14 2xl:ml-40">
          <center className="text-2xl text-center mt-8 font-medium">
            Admin Management
          </center>
          <center className="mx-auto h-[3px] w-16 bg-[#34495E] my-3"></center>

          <div className="gap-4 mb-3">
            <button
              onClick={() => {
                setShowForm(true);
                setEditingIndex(null);
              }}
              className="mt-4 px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition"
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
                        onClick={() => navigate(`/super-admin-admin-employe/${admin.admin_id}`)}
                        className="border-b border-gray-200 hover:bg-gray-100"
                       
                      >
                        <td className="px-4 py-4 sm:px-6">{admin.name}</td>
                        <td className="px-4 py-4 sm:px-6">{admin.email}</td>
                        <td className="px-4 py-4 sm:px-6">{admin.position}</td>
                        <td className="px-4 py-4 sm:px-6">{admin.phone}</td>
                        <td className="px-4 py-4 sm:px-6">
                          <div className="flex space-x-2 sm:space-x-4">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditAdmin(index);
                              }}
                              className="text-blue-500 transition hover:text-blue-600"
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
            <form
              onSubmit={handleSaveAdmin}
            >
              <input
                type="text"
                name="name"
                value={newAdmin.name}
                onChange={handleInputChange}
                placeholder="Name"
                className={`block w-full px-4 py-2 mb-2 border ${
                  validationErrors.name ? "border-red-500" : "border-gray-300"
                }`}
              />
              {validationErrors.name && (
                <p className="text-red-500 text-sm">{validationErrors.name}</p>
              )}

              <input
                type="email"
                name="email"
                value={newAdmin.email}
                onChange={handleInputChange}
                placeholder="Email"
                className={`block w-full px-4 py-2 mb-2 border ${
                  validationErrors.email ? "border-red-500" : "border-gray-300"
                }`}
              />
              {validationErrors.email && (
                <p className="text-red-500 text-sm">{validationErrors.email}</p>
              )}

              {/* <input
                type="password"
                name="password"
                value={newAdmin.password}
                onChange={handleInputChange}
                placeholder="Password"
                className={`block w-full px-4 py-2 mb-2 border ${
                  validationErrors.password
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              />
              {validationErrors.password && (
                <p className="text-red-500 text-sm">
                  {validationErrors.password}
                </p>
              )} */}

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"} // Toggle password visibility
                  name="password"
                  value={newAdmin.password}
                  onChange={handleInputChange}
                  placeholder="Password"
                  className={`block w-full px-4 py-2 mb-2 border ${
                    validationErrors.password
                      ? "border-red-500"
                      : "border-gray-300"
                  } pr-12`} // Add padding on the right to accommodate the text
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-blue-500 hover:text-blue-700" // Position the text inside the input
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}{" "}
                  {/* Show the icon when password is hidden */}
                  {/* Text for toggling visibility */}
                </button>
                {validationErrors.password && (
                  <p className="text-red-500 text-sm">
                    {validationErrors.password}
                  </p>
                )}
              </div>

              <input
                type="text"
                name="position"
                value={newAdmin.position}
                onChange={handleInputChange}
                placeholder="Position"
                className={`block w-full px-4 py-2 mb-2 border ${
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

              <input
                type="text"
                name="phone"
                value={newAdmin.phone}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                placeholder="Phone"
                className={`block w-full px-4 py-2 mb-2 border ${
                  validationErrors.phone ? "border-red-500" : "border-gray-300"
                }`}
              />
              {validationErrors.phone && (
                <p className="text-red-500 text-sm">{validationErrors.phone}</p>
              )}

              <div className="flex justify-end mt-4 gap-3">
                <button
                  onClick={handleCancel} // Reset form on Cancel
                  className="px-4 py-2 text-white bg-gray-500 rounded-lg hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveAdmin}
                  className="px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
                >
                  {editingIndex !== null ? "Update" : "Add"}
                </button>
              </div>
            </form>
          </Modal>
        </div>
      </div>
    </>
  );
}

export default Super_Admin_Adminmanagement;
