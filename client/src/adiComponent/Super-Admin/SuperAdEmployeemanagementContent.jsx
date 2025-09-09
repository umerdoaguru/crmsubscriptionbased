import React, { useState, useEffect } from "react";
import axios from "axios";
import { BsPencilSquare, BsTrash, BsPlusCircle } from "react-icons/bs";

import { useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";
import { useSelector } from "react-redux";
import SuperAddEditEmployeePopup from "./SuperAdminProject/SuperAddEditEmployeePopup";

const SuperAdEmployeemanagementContent = () => {
  const [employees, setEmployees] = useState([]);
  const superadminuser = useSelector((state) => state.auth.user);
  const userId = superadminuser.id;
  const token = superadminuser.token;
  const [newEmployee, setNewEmployee] = useState({
    name: "",
    email: "",
    password: "",
    position: "",
    phone: "",
    user_id: userId,
  });
  const [editingIndex, setEditingIndex] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const navigate = useNavigate(); // Initialize useNavigate

  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 7;

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get(
        `https://crm-generalize.dentalguru.software/api/getAllEmployees-super-admin/${userId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const { employees } = response.data;
      console.log(employees);
      setEmployees(employees || []); // Ensure employees is always an array
    } catch (error) {
      console.error("Error fetching employees:", error);
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

    if (!newEmployee.name) errors.name = "Name is required";

    if (!newEmployee.email) errors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(newEmployee.email))
      errors.email = "Email is invalid";

    if (!newEmployee.password) errors.password = "Password is required";

    // Validate Position
    if (!newEmployee.position) errors.position = "Position is required";

    // Validate Phone
    if (!newEmployee.phone) errors.phone = "Phone number is required";
    else if (!/^\d{10}$/.test(newEmployee.phone))
      errors.phone = "Phone number must be 10 digits";

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const isEmailTaken = async (email) => {
    try {
      const response = await axios.get(
        "https://crm-generalize.dentalguru.software/api/checkEmail",
        {
          params: { email },
        }
      );
      return response.data.exists;
    } catch (error) {
      console.error("Error checking email:", error);
      return false; // Assuming email check fails means it's not taken
    }
  };

  const handleEditEmployee = (data) => {
    setEditingIndex(data);
    setShowForm(true);
  };

  const handleDeleteEmployee = async (employeeId) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this employee?"
    );
    if (isConfirmed) {
      try {
        await axios.delete(
          `https://crm-generalize.dentalguru.software/api/deleteEmployee/${employeeId}`
        );
        fetchEmployees();
      } catch (error) {
        console.error("Error deleting employee:", error);
      }
    }
  };

  const handleEmployeeClick = (employeeId) => {
    navigate(`/super-admin-employee-single/${employeeId}`);
  };

  const cancelButton = () => {
    setNewEmployee({
      name: "",
      email: "",
      password: "",
      position: "",
      phone: "",
    });
    setShowForm(false);
    setValidationErrors({});
  };
  const pageCount = Math.ceil(employees.length / itemsPerPage);

  // Pagination logic
  const indexOfLastLead = (currentPage + 1) * itemsPerPage;
  const indexOfFirstLead = indexOfLastLead - itemsPerPage;
  const currentemployee = employees.slice(indexOfFirstLead, indexOfLastLead);

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
    console.log("change current page ", data.selected);
  };

  return (
    <>
      <div className="flex mt-20">
        <div className="w-full min-h-screen bg-[#F9FAFF] p-2">
          <div className=" container px-3">
            <h2 className="text-2xl text-center mt-[2rem] font-medium">
              Employee Management
            </h2>
            <div className="mx-auto h-[3px] w-16 bg-cyan-600 my-3"></div>
          </div>

          <div className=" container flex flex-col min-h-screen lg:flex-row">
            <main className="flex-1 p-4 lg:p-8">
              <div className="flex flex-col-reverse items-start justify-between mb-8 lg:flex-row lg:items-center">
                <button
                  onClick={() => {
                    setShowForm(true);
                    setEditingIndex(null);
                  }}
                  className="flex items-center px-4 py-2 font-medium text-white transition duration-200 bg-cyan-500 rounded-lg shadow-lg hover:bg-cyan-600"
                >
                  <BsPlusCircle className="mr-2 font-medium" /> Add Employee
                </button>
              </div>

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
                    {currentemployee.length > 0 ? (
                      currentemployee
                        .filter((employee) => employee && employee.name) // Ensure employee and employee.name exist
                        .map((employee, index) => (
                          <tr
                            key={employee.employeeId}
                            className="border-b border-gray-200 cursor-pointer hover:text-cyan-600"
                            onClick={() =>
                              handleEmployeeClick(employee.employeeId)
                            } // Navigate on row click
                          >
                            <td className="px-4 py-4 sm:px-6">
                              {employee.name}
                            </td>
                            <td className="px-4 py-4 sm:px-6">
                              {employee.email}
                            </td>
                            <td className="px-4 py-4 sm:px-6">
                              {employee.position}
                            </td>
                            <td className="px-4 py-4 sm:px-6">
                              {employee.phone}
                            </td>
                            <td className="px-4 py-4 sm:px-6">
                              <div className="flex space-x-2 sm:space-x-4">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleEditEmployee(employee);
                                  }} // Now index is available
                                  className="text-cyan-500 transition duration-200 hover:text-cyan-600"
                                >
                                  <BsPencilSquare size={20} />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteEmployee(employee.employeeId);
                                  }}
                                  className="text-red-500 transition duration-200 hover:text-red-600"
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
                          No employees found
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
            </main>
          </div>
        </div>
      </div>
      <SuperAddEditEmployeePopup
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        editingIndex={editingIndex}
        setEditingIndex={setEditingIndex}
        fetchEmployees={fetchEmployees}
      />
    </>
  );
};

export default SuperAdEmployeemanagementContent;
