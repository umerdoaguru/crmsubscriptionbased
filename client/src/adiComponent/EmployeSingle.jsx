import axios from "axios";
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { BsPencilSquare, BsTrash } from "react-icons/bs";
import Modal from "../adiComponent/Modal";
import Sider from "../components/Sider";
import MainHeader from "../components/MainHeader";
import { useSelector } from "react-redux";
import moment from "moment";
import ReactPaginate from "react-paginate";

const EmployeeSingle = () => {
  const { employeeId } = useParams();
  const [leads, setLeads] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 7; 

  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [newEmployee, setNewEmployee] = useState({
    name: "",
    email: "",
    position: "",
    phone: "",
    signature: null,
    photo: null,
  });
  const [showForm, setShowForm] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const adminuser = useSelector((state) => state.auth.user);
  const token = adminuser.token;

  // Fetch employee data
  const fetchEmployee = async () => {
    try {
      const response = await axios.get(`https://crmdemo.vimubds5.a2hosted.com/api/getEmployeeById/${employeeId}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }});
      if (response.data.success) {
        setEmployee(response.data.employee);
        setNewEmployee({
          name: response.data.employee.name || "",
          email: response.data.employee.email || "",
          position: response.data.employee.position || "",
          phone: response.data.employee.phone || "",
          signature: null,
          photo: null,
        });
      } else {
        setError("Failed to fetch employee");
      }
    } catch (error) {
      setError("Error fetching employee");
      console.error("Error fetching employee:", error);
    }
  };

  useEffect(() => {
    if (employeeId) {
      fetchEmployee();
    }
  }, [employeeId]);

  const validateForm = async () => {
    const errors = {};

    // Validate Name
    if (!newEmployee.name) errors.name = "Name is required";

    // Validate Email
    if (!newEmployee.email) errors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(newEmployee.email))
      errors.email = "Email is invalid";
    else if (await isEmailTaken(newEmployee.email))
      errors.email = "Email is already taken";

    // Validate Position
    if (!newEmployee.position) errors.position = "Position is required";

    // Validate Phone
    if (!newEmployee.phone) errors.phone = "Phone number is required";
    else if (!/^\d{10}$/.test(newEmployee.phone))
      errors.phone = "Phone number must be 10 digits";
    else if (await isPhoneNumberTaken(newEmployee.phone))
      errors.phone = "Phone number is already taken";

    // Validate Files
    if (
      newEmployee.photo &&
      !["image/jpeg", "image/png"].includes(newEmployee.photo.type)
    )
      errors.photo = "Photo must be an image (jpeg/png)";
    if (
      newEmployee.signature &&
      !["image/jpeg", "image/png"].includes(newEmployee.signature.type)
    )
      errors.signature = "Signature must be an image (jpeg/png)";

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const isEmailTaken = async (email) => {
    try {
      const response = await axios.get('https://crmdemo.vimubds5.a2hosted.com/api/checkEmail', {
        params: { email },
      });
      return response.data.exists;
    } catch (error) {
      console.error("Error checking email:", error);
      return false;
    }
  };

  const isPhoneNumberTaken = async (phone) => {
    try {
      const response = await axios.get('https://crmdemo.vimubds5.a2hosted.com/api/checkPhoneNumber', {
        params: { phone },
      });
      return response.data.exists;
    } catch (error) {
      console.error("Error checking phone number:", error);
      return false;
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "phone") {
      const numericValue = value.replace(/[^0-9]/g, "").slice(0, 10);
      setNewEmployee((prev) => ({ ...prev, [name]: numericValue }));
    } else {
      setNewEmployee((prev) => ({ ...prev, [name]: value }));
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

  const handleFileInput = (e, field) => {
    setNewEmployee((prev) => ({ ...prev, [field]: e.target.files[0] }));
  };

  const handleSaveEmployee = async () => {
    if (!(await validateForm())) return;

    try {
      const formData = new FormData();
      formData.append("name", newEmployee.name);
      formData.append("email", newEmployee.email);
      formData.append("position", newEmployee.position);
      formData.append("phone", newEmployee.phone);

      if (newEmployee.signature) {
        formData.append("signature", newEmployee.signature);
      }

      if (newEmployee.photo) {
        formData.append("photo", newEmployee.photo);
      }

      let response;
      if (editingIndex !== null) {
        response = await axios.put(`https://crmdemo.vimubds5.a2hosted.com/api/updateSingleEmployee/${employee.employeeId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        response = await axios.post('https://crmdemo.vimubds5.a2hosted.com/api/addEmployee', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }

      if (response.data.success) {
        await fetchEmployee();
        setNewEmployee({
          name: "",
          email: "",
          position: "",
          phone: "",
          signature: null,
          photo: null,
        });
        setShowForm(false);
        setEditingIndex(null);
      } else {
        setError("Failed to save employee");
      }
    } catch (error) {
      setError("Error saving employee");
      console.error("Error saving employee:", error);
    }
  };

  const handleEditEmployee = () => {
    if (employee) {
      setNewEmployee({
        name: employee.name || "",
        email: employee.email || "",
        position: employee.position || "",
        phone: employee.phone || "",
        signature: null,
        photo: null,
      });
      setEditingIndex(0);
      setShowForm(true);
    }
  };

  const handleDeleteEmployee = async () => {
    if (employee) {
      const isConfirmed = window.confirm(
        "Are you sure you want to delete this employee?"
      );
      if (isConfirmed) {
        try {
          await axios.delete(`https://crmdemo.vimubds5.a2hosted.com/api/deleteEmployee/${employee.employeeId}`);
          navigate('/employee-management');
        } catch (error) {
          setError("Error deleting employee");
          console.error("Error deleting employee:", error);
        }
      }
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const response = await axios.get(
        `https://crmdemo.vimubds5.a2hosted.com/api/employe-leads-admin/${employeeId}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }});
      const data = response.data;
      setLeads(data);
    } catch (error) {
      console.error("Error fetching leads:", error);
    }
  };
  const handleBackClick = () => {
    navigate(-1); // -1 navigates to the previous page in history
  };
  const pageCount = Math.ceil(leads.length / itemsPerPage);

  // Pagination logic
  const indexOfLastLead = (currentPage + 1) * itemsPerPage;
  const indexOfFirstLead = indexOfLastLead - itemsPerPage;
  const currentLeads = leads.slice(indexOfFirstLead, indexOfLastLead);
  
  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
    console.log("change current page ", data.selected);
  };

  return (
    <>
      <MainHeader />

      <div className="flex flex-col min-h-screen lg:flex-row">
        <div className="lg:w-64">
          <Sider />
        </div>
        <div className="container mt-5 px-2 mx-auto p-4">
          <button
            onClick={handleBackClick}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Go Back
          </button>
          <main className="flex-1 p-4 lg:p-8">
            {/* <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-800">
                Employee Profile
              </h2>
              <button
                onClick={handleEditEmployee}
                className="flex items-center px-4 py-2 text-white transition duration-200 bg-blue-500 rounded-lg shadow-lg hover:bg-blue-600"
              >
                <BsPencilSquare className="mr-2" /> Edit Profile
              </button>
            </div> */}

            {error && <p className="text-red-600">{error}</p>}

            {employee ? (
              <div className="p-6 bg-white rounded-lg shadow-md">
                <div className="flex items-center mb-6">
                  {/* {employee.photo ? (
                    <img
                      src={`https://crmdemo.vimubds5.a2hosted.com/${employee.photo}`}
                      alt="Profile"
                      className="w-24 h-24 border-2 border-gray-300 rounded-full"
                    />
                  ) : (
                    <div className="w-24 h-24 bg-gray-300 border-2 border-gray-300 rounded-full"></div>
                  )} */}
                  <div className="ml-6">
                    <h3 className="text-xl font-semibold text-gray-800">
                      {employee.name || "No Name Available"}
                    </h3>
                    <p className="text-gray-600">
                      {employee.position || "No Position Available"}
                    </p>
                    <p className="text-gray-600">
                      {employee.email || "No Email Available"}
                    </p>
                    <p className="text-gray-600">
                      {employee.phone || "No Phone Available"}
                    </p>
                  </div>
                </div>

                {employee.signature && (
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-gray-800">
                      Signature
                    </h4>
                    <img
                      src={`https://crmdemo.vimubds5.a2hosted.com/${employee.signature}`}
                      alt="Signature"
                      className="w-32 h-16 border-t border-gray-300"
                    />
                  </div>
                )}

                <div className="flex justify-end space-x-4">
                  <button
                    onClick={handleDeleteEmployee}
                    className={`px-4 py-2 text-white rounded-lg shadow-lg ${
                      employee
                        ? "bg-red-500 hover:bg-red-600"
                        : "bg-gray-500 cursor-not-allowed"
                    }`}
                    disabled={!employee}
                  >
                    <BsTrash className="mr-2" /> Delete
                  </button>
                </div>
                <div className="overflow-x-auto mt-4">
                  <table className="min-w-full bg-white border">
                    <thead>
                      <tr>
                        <th className="px-6 py-3 border-b-2 border-gray-300 text-left leading-4 text-gray-600 tracking-wider">
                          S.no
                        </th>
                        <th className="px-6 py-3 border-b-2 border-gray-300 text-left leading-4 text-gray-600 tracking-wider">
                          Lead Number
                        </th>
                        <th className="px-6 py-3 border-b-2 border-gray-300 text-left leading-4 text-gray-600 tracking-wider">
                          Assigned To
                        </th>
                        <th className="px-6 py-3 border-b-2 border-gray-300 text-left leading-4 text-gray-600 tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 border-b-2 border-gray-300 text-left leading-4 text-gray-600 tracking-wider">
                          Name
                        </th>
                        <th className="px-6 py-3 border-b-2 border-gray-300 text-left leading-4 text-gray-600 tracking-wider">
                          Phone
                        </th>
                        <th className="px-6 py-3 border-b-2 border-gray-300 text-left leading-4 text-gray-600 tracking-wider">
                          Lead Source
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentLeads.map((lead, index) => (
                        <tr
                          key={lead.id}
                          className={index % 2 === 0 ? "bg-gray-100" : ""}
                        >
                          <td className="px-6 py-4 border-b border-gray-200 text-gray-800">
                            {index + 1}
                          </td>
                          <Link to={`/lead-single-data/${lead.lead_id}`}>
                            <td className="px-6 py-4 border-b border-gray-200  underline text-[blue]">
                              {lead.lead_no}
                            </td>
                          </Link>
                          <td className="px-6 py-4 border-b border-gray-200 text-gray-800">
                            {lead.assignedTo}
                          </td>
                          <td className="px-6 py-4 border-b border-gray-200 text-gray-800">
                            {moment(lead.createdTime).format("DD MMM YYYY").toUpperCase()}
                          </td>
                          <td className="px-6 py-4 border-b border-gray-200 text-gray-800">
                            {lead.name}
                          </td>
                          <td className="px-6 py-4 border-b border-gray-200 text-gray-800">
                            {lead.phone}
                          </td>
                          <td className="px-6 py-4 border-b border-gray-200 text-gray-800">
                            {lead.leadSource}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <p className="text-gray-600">No employee data available.</p>
            )}
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
            <Modal isOpen={showForm} onClose={() => setShowForm(false)}>
              <h3 className="mb-4 text-lg font-bold">
                {editingIndex !== null ? "Edit Employee" : "Add Employee"}
              </h3>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <input
                  type="text"
                  name="name"
                  value={newEmployee.name}
                  onChange={handleInputChange}
                  placeholder="Name"
                  className={`p-2 border rounded-lg ${
                    validationErrors.name ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {validationErrors.name && (
                  <p className="text-sm text-red-500">
                    {validationErrors.name}
                  </p>
                )}

                <input
                  type="email"
                  name="email"
                  value={newEmployee.email}
                  onChange={handleInputChange}
                  placeholder="Email"
                  className={`p-2 border rounded-lg ${
                    validationErrors.email
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
                {validationErrors.email && (
                  <p className="text-sm text-red-500">
                    {validationErrors.email}
                  </p>
                )}

                <input
                  type="text"
                  name="position"
                  value={newEmployee.position}
                  onChange={handleInputChange}
                  placeholder="Position"
                  className={`p-2 border rounded-lg ${
                    validationErrors.position
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
                {validationErrors.position && (
                  <p className="text-sm text-red-500">
                    {validationErrors.position}
                  </p>
                )}

                <input
                  type="text"
                  name="phone"
                  value={newEmployee.phone}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  placeholder="Phone"
                  className={`p-2 border rounded-lg ${
                    validationErrors.phone
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
                {validationErrors.phone && (
                  <p className="text-sm text-red-500">
                    {validationErrors.phone}
                  </p>
                )}
                <input
                  type="file"
                  accept="image/jpeg, image/png"
                  onChange={(e) => handleFileInput(e, "photo")}
                  className="p-2 border rounded-lg"
                />
                {validationErrors.photo && (
                  <p className="text-sm text-red-500">
                    {validationErrors.photo}
                  </p>
                )}

                <input
                  type="file"
                  accept="image/jpeg, image/png"
                  onChange={(e) => handleFileInput(e, "signature")}
                  className="p-2 border rounded-lg"
                />
                {validationErrors.signature && (
                  <p className="text-sm text-red-500">
                    {validationErrors.signature}
                  </p>
                )}
              </div>
              <div className="flex justify-end mt-6 space-x-4">
                <button
                  onClick={handleSaveEmployee}
                  className="px-4 py-2 text-white bg-blue-500 rounded-lg shadow-lg hover:bg-blue-600"
                >
                  Save
                </button>
                <button
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 text-white bg-gray-500 rounded-lg shadow-lg hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </Modal>
          </main>
        </div>
      </div>
    </>
  );
};

export default EmployeeSingle;
