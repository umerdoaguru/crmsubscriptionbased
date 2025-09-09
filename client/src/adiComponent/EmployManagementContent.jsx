import React, { useState, useEffect } from "react";
import axios from "axios";
import { BsPencilSquare, BsTrash, BsPlusCircle } from "react-icons/bs";
import Modal from "./Modal";
import { useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";
import { useSelector } from "react-redux";
import AddEditEmployeePopup from "./AddEditEmployeePopup";

const EmployeeManagementContent = () => {
  const [employees, setEmployees] = useState([]);
  const adminuser = useSelector((state) => state.auth.user);
  const token = adminuser.token;
  const userId = adminuser.user_id;
  const [editingIndex, setEditingIndex] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const leadsPerPage = 10;
  const navigate = useNavigate();

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get(
        `https://crm-generalize.dentalguru.software/api/getAllEmployees/${userId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const { employees } = response.data;
      setEmployees(employees || []);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
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
    navigate(`/employee-single/${employeeId}`);
  };

  const pageCount = Math.ceil(employees.length / leadsPerPage);

  // Pagination logic
  const indexOfLastLead = (currentPage + 1) * leadsPerPage;
  const indexOfFirstLead = indexOfLastLead - leadsPerPage;
  const currentEmployees = employees.slice(indexOfFirstLead, indexOfLastLead);

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
    console.log("change current page ", data.selected);
  };

  const handleEditEmployee = (data) => {
    setShowForm(true);
    setEditingIndex(data);
  };

  return (
    <>
      <div className="flex mt-20">
        <div className="w-full min-h-screen bg-[#F9FAFF] p-2">
          <div className="flex flex-col lg:flex-row">
            <div className="flex-grow p-4">
              <center className="text-2xl text-center mt-2 font-medium">
                Empolyee Management
              </center>
              <center className="mx-auto h-[3px] w-16 bg-cyan-600 my-3"></center>

              <div className="gap-4 mb-3">
                <button
                  onClick={() => {
                    setShowForm(true);
                    setEditingIndex(null);
                  }}
                  className="mt-4 px-6 py-2 bg-cyan-600 text-white rounded hover:bg-cyan-700 transition"
                >
                  <BsPlusCircle className="inline-block mr-2" /> Add Employee
                </button>
              </div>

              {/* Employee table */}
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
                    {currentEmployees.length > 0 ? (
                      currentEmployees
                        .filter((employee) => employee && employee.name) // Ensure employee and employee.name exist
                        .map((employee, index) => (
                          <tr
                            key={employee.employeeId}
                            className="border-b border-gray-200 cursor-pointer hover:text-cyan-600 font-semibold"
                            onClick={() =>
                              handleEmployeeClick(employee.employeeId)
                            }
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
                                  }}
                                  className="text-cyan-600 transition duration-200 hover:text-cyan-600"
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
              <div className="mt-3 mb-2 flex justify-center">
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
            </div>
          </div>
        </div>
      </div>
      <AddEditEmployeePopup
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        editingIndex={editingIndex}
        setEditingIndex={setEditingIndex}
        fetchEmployees={fetchEmployees}
      />
    </>
  );
};

export default EmployeeManagementContent;
