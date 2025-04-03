import { useEffect, useState } from 'react';
import axios from 'axios';
import moment from 'moment';
import ReactPaginate from 'react-paginate';
import { useSelector } from 'react-redux';


function SuperAccrs() {
  const [responses, setResponses] = useState([]);
  const [leadsAssigned, setLeadsAssigned] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [leadsPerPage] = useState(10);
  const [currentLead, setCurrentLead] = useState({
    assignedTo: "",
    employeeId: "",
    employeephone: "",
    createdTime:"",
  });
  const superadminuser = useSelector((state) => state.auth.user);
  const token = superadminuser.token;

  const fetchResponses = async () => {
    try {
      const response = await axios.get('https://crmdemo.vimubds5.a2hosted.com/api/get-responses-super-admin',
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }});
      console.log('Response received from API:', response.data);
      setResponses(response.data);   
    } catch (error) {
      console.error('Error fetching 99Acres responses:', error);
    }
  };
  const fetchEmployees = async () => {
    try {
      const response = await axios.get("https://crmdemo.vimubds5.a2hosted.com/api/employee-super-admin",
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }});
      setEmployees(response.data);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };
  const fetchLeadassigned = async () => {
    try {
      const response = await axios.get("https://crmdemo.vimubds5.a2hosted.com/api/leads-super-admin",
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }});
      setLeadsAssigned(response.data);
      // console.log(leadsAssigned);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  useEffect(() => {
    fetchResponses();
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
    if (!currentLead.createdTime) {
      alert("Please Select Assign Date."); // Show an alert message
      return; // Stop further execution if the field is empty
    }
    try {
      setLoading(true)
      await axios.post("https://crmdemo.vimubds5.a2hosted.com/api/leads", {
        lead_no:  selectedLead.leadId,    
        assignedTo:currentLead.assignedTo,
        employeeId:currentLead.employeeId,
        createdTime:  currentLead.createdTime,
        actual_date:  selectedLead.date,
        name: selectedLead.fullName,         
        phone:  selectedLead.phoneNumber,   
        leadSource: "99 Acres", 
        subject: selectedLead.subject,
        address: selectedLead.address,
         assignedBy: "Super Admin"
      });
      fetchResponses(); // Refresh the list
      fetchLeadassigned();
        // Reset form data
    setCurrentLead({
      assignedTo: '',
      employeeId: '',
      createdTime: '',
    
      // Add other fields here if needed
    });
    setSelectedLead({
      leadId: '',
      date: '',
      fullName: '',
      phoneNumber: '',
      address: '',

      // Add other fields here if needed
    });

      closePopup();
    // Format the createdTime using moment
const formattedDate = moment(currentLead.createdTime).format("DD-MM-YYYY"); // Format the date as 'DD-MM-YYYY'

// Generate the WhatsApp link with the formatted date
const whatsappLink = `https://wa.me/${currentLead.employeephone}?text=Hi%20${currentLead.assignedTo},%20you%20have%20been%20assigned%20a%20new%20lead%20with%20the%20following%20details:%0A%0A1)%20Date:-${formattedDate}%0A2)%20Lead%20No.%20${selectedLead.leadId}%0A3)%20Name:%20${selectedLead.fullName}%0A4)%20Phone%20Number:%20${selectedLead.phoneNumber}%0A5)%20Lead%20Source:%2099%20Acres%0A6)%20Address:%20${selectedLead.address}%0A7)%20Project:%20${selectedLead.subject}%0A%0APlease%20check%20your%20dashboard%20for%20details.`;

// Open WhatsApp link
window.open(whatsappLink, "_blank");

setLoading(false)
    } catch (error) {
      setLoading(false)
      console.error("Error adding lead:", error);
    }
  };

  const handleEditClick = (lead) => {
    setSelectedLead({
      leadId: lead.id,
      fullName: lead.contact_name,
      phoneNumber: lead.phone.replace("+91-", ""),
      subject: lead.project_name,
      address: lead.city_name,
      date: moment(lead.received_on).format("YYYY-MM-DD"),
    });
    setShowPopup(true);
  };

 

  const closePopup = () => {
    setShowPopup(false);
    setSelectedLead(null);
  };
  
  
  const filteredLeads = responses.filter(
    (lead) =>
      !leadsAssigned.some(
        (assigned) => assigned.lead_no === lead.id.toString()
      )
  );

 
  const indexOfLastLead = currentPage * leadsPerPage + leadsPerPage;
  const indexOfFirstLead = currentPage * leadsPerPage;
  const  currentLeads = filteredLeads.slice(indexOfFirstLead, indexOfLastLead);

  
  const pageCount = Math.ceil(filteredLeads.length / leadsPerPage);

  
  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  return (
    <>
        <div className="container 2xl:w-[95%]">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">99Acres Responses</h1>
      {responses.length > 0 ? (
       <div className="overflow-x-auto">
       <table className="min-w-full text-sm bg-white border border-gray-200">
         <thead className="bg-gray-200">
           <tr>
             <th className="py-2 px-4 text-left font-semibold text-gray-700">Query ID</th>
             <th className="py-2 px-4 text-left font-semibold text-gray-700">Project Name</th>
             <th className="py-2 px-4 text-left font-semibold text-gray-700">City</th>
         
             <th className="py-2 px-4 text-left font-semibold text-gray-700">Received On</th>
             <th className="py-2 px-4 text-left font-semibold text-gray-700">Contact Name</th>
             <th className="py-2 px-4 text-left font-semibold text-gray-700">Email</th>
             <th className="py-2 px-4 text-left font-semibold text-gray-700">Phone</th>
             <th className="py-2 px-4 text-left font-semibold text-gray-700">Assigned Lead</th>
           </tr>
         </thead>
         <tbody>
           {currentLeads.map((lead, index) => (
             <tr key={index} className="border-b">
               <td className="py-2 px-4">{lead.id || 'N/A'}</td>
               <td className="py-2 px-4">{lead.project_name || 'N/A'}</td>
               <td className="py-2 px-4">{lead.city_name || 'N/A'}</td>
             
               <td className="py-2 px-4">
  {lead.received_on 
    ? `${new Date(lead.received_on).toLocaleDateString('en-GB')} ${new Date(lead.received_on).toLocaleTimeString()}`
    : 'N/A'}
</td>

               <td className="py-2 px-4">{lead.contact_name}</td>
               <td className="py-2 px-4">{lead.email || 'N/A'}</td>
               <td className="py-2 px-4">{lead.phone.replace("+91-", "") || 'N/A' }</td>
               <td className="px-6 py-4 border-b border-gray-200 text-gray-800">
      <button className="text-blue-500 hover:text-blue-700" onClick={() => handleEditClick(lead)}>
        Assign
      </button>
    </td>
             </tr>
           ))}
         </tbody>
       </table>
     </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
        No Data Found
      </div>
      )}
    </div>

   {/* Pagination Component */}
   <div className="mt-4 mb-5 flex justify-center">
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
  

        {/* Popup */}
        {showPopup && selectedLead && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
          <div className="w-full max-w-md p-6 mx-2 bg-white rounded-lg shadow-lg h-[95%] overflow-y-auto">
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
                <option value="Website Inquiries">99 Acres</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Project</label>
              <input
                type="text"
                name="subject"
                value={selectedLead.subject}
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
              <label className="block text-gray-700">Assign Date</label>
              <input
                type="date"
                name="createdTime"
                value={currentLead.createdTime}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border  rounded`}
                
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Actual Date</label>
              <input
                type="date"
                name="actual_date"
                value={selectedLead.date}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border  rounded`}
                disabled
              />
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
    
    </>

  );
}

export default SuperAccrs;
