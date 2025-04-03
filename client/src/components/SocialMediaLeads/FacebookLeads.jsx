// export default FacebookLeads;

import { useState, useEffect } from "react";
import axios from "axios";
import CircleLoader from "react-spinners/CircleLoader";
import { BsPencilSquare } from "react-icons/bs";
import moment from "moment";
import ReactPaginate from "react-paginate";

const FacebookLeads = () => {
  const [leads, setLeads] = useState([]);
  const [leadsAssigned, setLeadsAssigned] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [formName, setFormName] = useState([]);

  const [currentLead, setCurrentLead] = useState({
    assignedTo: "",
    employeeId: "",
    employeephone: "",
  });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const [leadsPerPage] = useState(10);

  // Meta API Token
  const ACCESS_TOKEN =
    "EAAMAWRBboPIBO87PPmdJdsBd0WjJUw3GZBhYaS1fzmHE97k41JXyRIMhjTmV6lk3VGRRZCJvlrF2fZAJJgANlIwVosGuH30Qaz5eAimreSB57CNisVZArX5tLke0JqMkhZBDuJdlhXlGA5SZBSa1BQjZBUqBVNdUiUXmsPoZB7212Wg2rlPaNelheIlVm1g6Dc96APXfMoX7";

  // Meta API formId
  const formId = 1935750583597667;

  const fetchLeads = async () => {
    try {
      // const response = await axios.get(
      //   `https://graph.facebook.com/v20.0/${formId}/leads?access_token=${ACCESS_TOKEN}`
      // );
      const response = await axios.get(`https://graph.facebook.com/v20.0/${formId}?fields=name%2Cleads&access_token=${ACCESS_TOKEN}`);

      // const leadsData = response.data.data;
      // setLeads(leadsData); // Update local state with leads
      console.log(leads);
      setLeads(response.data.leads?.data);
  
      
      setFormName(response.data.name);
    
      
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch leads data");
      setLoading(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await axios.get("https://crmdemo.vimubds5.a2hosted.com/api/employee");
      setEmployees(response.data);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };
  const fetchLeadassigned = async () => {
    try {
      const response = await axios.get("https://crmdemo.vimubds5.a2hosted.com/api/leads");
      setLeadsAssigned(response.data);
      // console.log(leadsAssigned);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  useEffect(() => {
    fetchLeads();
    fetchEmployees();
    fetchLeadassigned();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentLead((prevLead) => {
      const updatedLead = { ...prevLead, [name]: value };
  
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
  

  const saveChanges = async () => {
    if (!currentLead.assignedTo) {
      alert("Please assign the lead to an employee."); // Show an alert message
      return; // Stop further execution if the field is empty
    }
    try {
      await axios.post("https://crmdemo.vimubds5.a2hosted.com/api/leads", {
        lead_no:  selectedLead.leadId,    
        assignedTo:currentLead.assignedTo,
        employeeId:currentLead.employeeId,
        createdTime:  selectedLead.date,
        name: selectedLead.fullName,         
        phone:  selectedLead.phoneNumber,   
        leadSource: "Facebook Campaign", 
        subject:  formName, 
        address:selectedLead.address,
         assignedBy: "Admin"
      });
      fetchLeads(); // Refresh the list
      fetchLeadassigned();
      closePopup();
      const whatsappLink = `https://wa.me/${currentLead.employeephone}?text=Hi%20${currentLead.assignedTo},%20you%20have%20been%20assigned%20a%20new%20lead%20with%20the%20following%20details:%0A%0A1)%20Lead%20No.%20${selectedLead.leadId}%0A2)%20Name:%20${selectedLead.fullName}%0A3)%20Phone%20Number:%20${selectedLead.phoneNumber}%0A4)%20Lead%20Source:%20${`Facebook Campaign`}%0A5)%20Address:%20${selectedLead.address}%0A6)%20Subject:%20${formName}%0A%0APlease%20check%20your%20dashboard%20for%20details.`;
      // Open WhatsApp link
      window.open(whatsappLink, "_blank");


    } catch (error) {
      console.error("Error adding lead:", error);
    }
  };

  const handleEditClick = (lead) => {
    console.log(lead);
    setSelectedLead({
      leadId: lead.id,
     
      fullName: extractFieldValue(lead.field_data, "full_name"),
      address: extractFieldValue(lead.field_data, "street_address"),
      phoneNumber: extractFieldValue(lead.field_data, "phone_number"),
      date: moment(lead.created_time).format("YYYY-MM-DD"), // Format the createdTime
    });

    setShowPopup(true);
  };

  const extractFieldValue = (fieldData, fieldName) => {
    const field = fieldData.find((item) => item.name === fieldName);
    return field ? field.values[0] : "";
  };

  const closePopup = () => {
    setShowPopup(false);
    setSelectedLead(null);
  };
  // Pagination logic
  const indexOfLastLead = (currentPage + 1) * leadsPerPage;
  const indexOfFirstLead = indexOfLastLead - leadsPerPage;
  const currentLeads = leads.slice(indexOfFirstLead, indexOfLastLead);

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  if (loading)
    return (
      <div>
        <center>
          <CircleLoader color="red" />
        </center>
      </div>
    );
  if (error) return <div>{error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl text-center font-bold mb-4">
        Facebook Leads Table
      </h1>
      <div className="mx-auto h-[3px] w-16 bg-[#34495E] my-3"></div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
          <th colSpan="6" className='py-2 px-4 border-b"'>Ad Name : {formName}</th>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border-b">Lead S.no</th>
              <th className="py-2 px-4 border-b">Lead ID</th>
              <th className="py-2 px-4 border-b">Full Name</th>
              <th className="py-2 px-4 border-b">Phone Number</th>
              <th className="py-2 px-4 border-b">Address</th>
              <th className="py-2 px-4 border-b">Subject</th>
              <th className="py-2 px-4 border-b">Date</th>
              <th className="py-2 px-4 border-b">Assign Lead</th>
            </tr>
          </thead>
          <tbody>
            {currentLeads
              .filter(
                (lead) =>
                  !leadsAssigned.some(
                    (assigned) => assigned.lead_no === lead.id
                  )
              )
              .map((lead, index) => (
                <tr key={lead.id}>
                  <td className="py-2 px-4 border-b">{index + 1}</td>
                  <td className="py-2 px-4 border-b">{lead.id}</td>
                  <td className="py-2 px-4 border-b">
                    {extractFieldValue(lead.field_data, "full_name")}
                  </td>
                  <td className="py-2 px-4 border-b">
                    {extractFieldValue(lead.field_data, "phone_number")}
                  </td>
                  <td className="py-2 px-4 border-b">
                    {extractFieldValue(lead.field_data, "street_address")}
                  </td>
                  <td className="py-2 px-4 border-b">{formName}</td>

                  <td className="py-2 px-4 border-b">
  {lead.created_time 
    ? `${new Date(lead.created_time).toLocaleDateString('en-GB')} ${new Date(lead.created_time).toLocaleTimeString()}`
    : 'N/A'}
</td>

                  <td className="px-6 py-4 border-b border-gray-200 text-gray-800">
                    <button
                      className="text-blue-500 hover:text-blue-700"
                      onClick={() => handleEditClick(lead)}
                    >
                      Assign
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      {/* {showPopup && selectedLead && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[400px]">
            <h2 className="text-xl mb-4">{'Lead Details'}</h2>
            <div className="mb-2">
              <strong>Lead ID:</strong> {selectedLead.leadId}
            </div>
            <div className="mb-2">
              <strong>Full Name:</strong> {selectedLead.fullName}
            </div>
            <div className="mb-2">
              <strong>Phone Number:</strong> {selectedLead.phoneNumber}
            </div>
            <button
              onClick={closePopup}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Close
            </button>
          </div>
        </div>
      )} */}
      {showPopup && selectedLead && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[500px]">
            <h2 className="text-xl mb-4">{"Add Lead"}</h2>
            <div className="mb-4">
              <label className="block text-gray-700">Lead Number</label>
              <input
                type="number"
                name="lead_no"
                value={selectedLead.leadId}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border  rounded`}
                disabled
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Assigned To</label>
              <select
                name="assignedTo"
                value={currentLead.assignedTo}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded`}
              >
                <option value="">Select Employee</option>
                {employees.map((employee) => (
                  <option key={employee.employee_id} value={employee.name}>
                    {employee.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Hidden employeeId field */}
            <input
              type="hidden"
              id="employeeId"
              name="employeeId"
              value={currentLead.employeeId}
            />

            <div className="mb-4">
              <label className="block text-gray-700">Name</label>
              <input
                type="text"
                name="name"
                value={selectedLead.fullName}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border  rounded`}
                disabled
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Phone</label>
              <input
                type="text"
                name="phone"
                value={selectedLead.phoneNumber}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded`}
                disabled
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Lead Source</label>
              <select
                name="leadSource"
                id="leadSource"
                value={currentLead.leadSource}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                disabled
              >
                <option value="Website Inquiries">Facebook Campaign</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Subject</label>
              <input
                type="text"
                name="subject"
                value={formName}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border  rounded`}
                disabled
              />
            </div>
            <div className="mb-4">
                  <label className="block text-gray-700">Address</label>
                  <input
                    type="text"
                    name="address"
                    value={selectedLead.address}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded`}
                    disabled
                  />
                  
                </div>
            <div className="mb-4">
              <label className="block text-gray-700">Date</label>
              <input
                type=""
                name="createdTime"
                value={selectedLead.date}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border  rounded`}
                disabled
              />
            </div>

            <div className="flex justify-end">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 mr-2"
                onClick={saveChanges}
              >
                Save
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

      {/* Pagination */}
      <div className="mt-4 flex justify-center">
        <ReactPaginate
          previousLabel={"Previous"}
          nextLabel={"Next"}
          breakLabel={"..."}
          pageCount={Math.ceil(leads.length / leadsPerPage)}
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
  );
};

export default FacebookLeads;
