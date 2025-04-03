

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

import MainHeader from './../../components/MainHeader';
import SuperAdminSider from './SuperAdminSider';
import ReactPaginate from 'react-paginate';

const SuperEmployeeList = () => {
  const [employees, setEmployees] = useState([]);

  const [currentLead, setCurrentLead] = useState({
    lead_no: "",
    assignedTo: "",
    employeeId: "",
    employeephone: "",
    createdTime: "", // Added here
    name: "",
    phone: "",
    leadSource: "",
    subject: "",
    address: "",
    actual_date: "",
   
  });

  const [showPopup, setShowPopup] = useState(false);
  const [loading , setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [customLeadSource, setCustomLeadSource] = useState("");

  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 7; 


  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get('https://crmdemo.vimubds5.a2hosted.com/api/getAllEmployee-Toal-lead');
      const { employees } = response.data;
      setEmployees(employees || []); // Ensure employees is always an array
      console.log(employees);
      
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const handleEmployeeClick = (employeeId) => {
    navigate(`/super-admin-employee-leads/${employeeId}`); 
  };

  const pageCount = Math.ceil(employees.length / itemsPerPage);

  // Pagination logic
  const indexOfLastLead = (currentPage + 1) * itemsPerPage;
  const indexOfFirstLead = indexOfLastLead - itemsPerPage;
  const currentLeads = employees.slice(indexOfFirstLead, indexOfLastLead);
  
  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
    console.log("change current page ", data.selected);
  };
  const validateForm = () => {
    let formErrors = {};
    let isValid = true;

    if (!currentLead.lead_no) {
      formErrors.lead_no = "Lead number is required";
      isValid = false;
    }

    if (!currentLead.assignedTo) {
      formErrors.assignedTo = "Assigned To field is required";
      isValid = false;
    }

    if (!currentLead.name) {
      formErrors.name = "Name is required";
      isValid = false;
    }
    if (!currentLead.createdTime) {
      formErrors.createdTime = "Date is required";
      isValid = false;
    }

    if (!currentLead.phone) {
      formErrors.phone = "Phone number is required";
      isValid = false;
    } else if (!/^\d{10}$/.test(currentLead.phone)) {
      formErrors.phone = "Phone number must be 10 digits";
      isValid = false;
    }

    if (!currentLead.leadSource) {
      formErrors.leadSource = "Lead Source is required";
      isValid = false;
    }
    if (!currentLead.subject) {
      formErrors.subject = "Subject is required";
      isValid = false;
    }
    if (!currentLead.address) {
      formErrors.address = "Address is required";
      isValid = false;
    }

    setErrors(formErrors);
    return isValid;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentLead((prevLead) => {
      const updatedLead = { ...prevLead, [name]: value };

      // If createdTime changes, update actual_date accordingly
      if (name === "createdTime") {
        updatedLead.actual_date = value; // Copy createdTime to actual_date
      }

      // If assignedTo changes, update employeeId and employeephone accordingly
      if (name === "assignedTo") {
        const selectedEmployee = employees.find(
          (employee) => employee.name === value
        );
        if (selectedEmployee) {
          updatedLead.employeeId = selectedEmployee.employeeId;
          updatedLead.employeephone = selectedEmployee.phone; // Store employee's phone number in employeephone
        } else {
          updatedLead.employeeId = ""; // Reset if no match
          updatedLead.employeephone = ""; // Reset employeephone if no match
        }
      }

      return updatedLead;
    });
  };

  const handleCreateClick = () => {
    
    setCurrentLead({
      lead_no: "",
      assignedTo: "",
      employeeId: "",
      employeephone: "",
      name: "",
      phone: "",
      leadSource: "",
      createdTime: "", // Clear out createdTime for new lead
      subject: "",
      address: "",
      actual_date: "",
     
    });
    setShowPopup(true);
  };

  const handleCustomLeadSourceChange = (e) => {
    setCustomLeadSource(e.target.value);
  };


  const saveChanges = async () => {
    if (validateForm()) {
      // Use custom lead source if "Other" is selected
      const leadData = {
        ...currentLead,
        leadSource:
          currentLead.leadSource === "Other"
            ? customLeadSource
            : currentLead.leadSource,
             assignedBy: "Super Admin"
      };
  
      try {
        setLoading(true)
      
       
          // Create new lead
          await axios.post("https://crmdemo.vimubds5.a2hosted.com/api/leads", leadData);
  
          // Construct WhatsApp message link with encoded parameters
          const whatsappLink = `https://wa.me/${currentLead.employeephone}?text=Hi%20${currentLead.assignedTo},%20you%20have%20been%20assigned%20a%20new%20lead%20with%20the%20following%20details:%0A%0A1)%20Lead%20No.%20${currentLead.lead_no}%0A2)%20Name:%20${currentLead.name}%0A3)%20Phone%20Number:%20${currentLead.phone}%0A4)%20Lead%20Source:%20${currentLead.leadSource}%0A5)%20Address:%20${currentLead.address}%0A6)%20Subject:%20${currentLead.subject}%0A%0APlease%20check%20your%20dashboard%20for%20details.`;
  
          // Open WhatsApp link in a new tab
          window.open(whatsappLink, "_blank");
        
          closePopup();
       
        setLoading(false)
      } catch (error) {
        setLoading(false)
        console.error("Error saving lead:", error);
      }
    }
  };

  const closePopup = () => {
    setShowPopup(false);
    setErrors({});
  };

  return (
    <>
      <MainHeader />
      <SuperAdminSider />
      <div className="px-3 pt-5">
        <h1 className="text-2xl text-center mt-[2rem] font-medium">Lead Management</h1>
        <div className="mx-auto h-[3px] w-16 bg-[#34495E] my-3"></div>
      </div>

      <div className=" mt-12 flex flex-col min-h-screen lg:flex-row">
        <main className="flex-1 p-4 lg:p-8">
          <div className="overflow-x-auto 2xl:ml-40 rounded-lg shadow-md">
          <div className="mb-4">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 font-medium"
                onClick={handleCreateClick}
              >
                Add Lead
              </button>
            </div>
            <table className="min-w-full bg-white">
              <thead>
                <tr className="text-sm font-semibold text-left text-gray-600 uppercase bg-gray-200">
                  <th className="px-4 py-3 sm:px-6">Employee Id</th>
                  <th className="px-4 py-3 sm:px-6">Employee Name</th>
                  <th className="px-4 py-3 sm:px-6">Employee Email</th>
                  <th className="px-4 py-3 sm:px-6">Total Leads</th> {/* Add Total Leads Column */}
                </tr>
              </thead>
              <tbody>
                {currentLeads.length > 0 ? (
                  currentLeads
                    .filter((employee) => employee && employee.name) // Ensure employee and employee.name exist
                    .map((employee, index) => (
                      <tr
                        key={employee.employeeId}
                        className="border-b border-gray-200 cursor-pointer hover:bg-gray-100"
                        onClick={() => handleEmployeeClick(employee.employeeId)} 
                      >
                        <td className="px-4 py-4 sm:px-6">{employee.employeeId}</td>
                        <td className="px-4 py-4 sm:px-6">{employee.name}</td>
                        <td className="px-4 py-4 sm:px-6">{employee.email}</td>
                        <td className="px-4 py-4 sm:px-6">{employee.total_leads}</td> {/* Display Total Leads */}
                      </tr>
                    ))
                ) : (
                  <tr>
                    <td colSpan="6" className="py-4 text-center">No employees found</td>
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
        </main>
        {showPopup && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
              <div className="w-full max-w-md p-6 mx-2 bg-white rounded-lg shadow-lg h-[95%] overflow-y-auto">
                <h2 className="text-xl mb-4">
                  {"Add Lead"}
                </h2>
                <div className="mb-4">
                  <label className="block text-gray-700">Lead Number</label>
                  <input
                    type="number"
                    name="lead_no"
                    value={currentLead.lead_no}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border ${
                      errors.lead_no ? "border-red-500" : "border-gray-300"
                    } rounded`}
                  />
                  {errors.lead_no && (
                    <span className="text-red-500">{errors.lead_no}</span>
                  )}
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Assigned To</label>
                  <select
                    name="assignedTo"
                    value={currentLead.assignedTo}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border ${
                      errors.assignedTo ? "border-red-500" : "border-gray-300"
                    } rounded`}
                  >
                    <option value="">Select Employee</option>
                    {employees.map((employee) => (
                      <option key={employee.employee_id} value={employee.name}>
                        {employee.name}
                      </option>
                    ))}
                  </select>
                  {errors.assignedTo && (
                    <span className="text-red-500">{errors.assignedTo}</span>
                  )}
                </div>

                {/* Hidden employeeId field */}
                <input
                  type="hidden"
                  id="employeeId"
                  name="employeeId"
                  value={currentLead.employeeId}
                />

                <div className="mb-4">
                  <label className="block text-gray-700">Assign Date</label>
                  <input
                    type="date"
                    name="createdTime"
                    value={currentLead.createdTime}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-100"
                  />
                  {errors.createdTime && (
                    <span className="text-red-500">{errors.createdTime}</span>
                  )}
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={currentLead.name}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border ${
                      errors.name ? "border-red-500" : "border-gray-300"
                    } rounded`}
                  />
                  {errors.name && (
                    <span className="text-red-500">{errors.name}</span>
                  )}
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Phone</label>
                  <input
                    type="text"
                    name="phone"
                    value={currentLead.phone}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border ${
                      errors.phone ? "border-red-500" : "border-gray-300"
                    } rounded`}
                  />
                  {errors.phone && (
                    <span className="text-red-500">{errors.phone}</span>
                  )}
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Lead Source</label>
                  <select
                    name="leadSource"
                    id="leadSource"
                    value={currentLead.leadSource}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                  >
                    <option value="">Select Lead Source</option>

                    <option value="Referrals">Referrals</option>
                    <option value="Cold Calling">Cold Calling</option>
                    <option value="Email Campaigns">Email Campaigns</option>
                    <option value="Networking Events">Networking Events</option>
                    <option value="Paid Advertising">Paid Advertising</option>
                    <option value="Content Marketing">Content Marketing</option>
                    <option value="SEO">Search Engine Optimization</option>
                    <option value="Trade Shows">Trade Shows</option>

                    <option value="Affiliate Marketing">
                      Affiliate Marketing
                    </option>
                    <option value="Direct Mail">Direct Mail</option>
                    <option value="Online Directories">
                      Online Directories
                    </option>
                    <option value="Other">Other</option>
                  </select>
                  {currentLead.leadSource === "Other" && (
                    <input
                      type="text"
                      value={customLeadSource}
                      onChange={handleCustomLeadSourceChange}
                      placeholder="Enter custom lead source"
                      className="mt-2 w-full px-3 py-2 border border-gray-300 rounded"
                    />
                  )}
                  {errors.leadSource && (
                    <p className="text-red-500 text-xs">{errors.leadSource}</p>
                  )}
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Project</label>
                  <input
                    type="text"
                    name="subject"
                    value={currentLead.subject}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border ${
                      errors.subject ? "border-red-500" : "border-gray-300"
                    } rounded`}
                  />
                  {errors.subject && (
                    <span className="text-red-500">{errors.subject}</span>
                  )}
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Address</label>
                  <input
                    type="text"
                    name="address"
                    value={currentLead.address}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border ${
                      errors.address ? "border-red-500" : "border-gray-300"
                    } rounded`}
                  />
                  {errors.address && (
                    <span className="text-red-500">{errors.address}</span>
                  )}
                </div>

                <div className="flex justify-end">
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 mr-2"
                    onClick={saveChanges} disabled = {loading}
                  >
                       {loading ? 'Save...' : 'Save'}
                  </button>
                  <button
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700"
                    onClick={closePopup}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
      </div>
    </>
  );
};

export default SuperEmployeeList;
