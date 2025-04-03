import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import { useSelector } from "react-redux";
import ReactPaginate from "react-paginate";
import MainHeader from "../MainHeader";
import EmployeeeSider from "../EmployeeModule/EmployeeSider";
import cogoToast from "cogo-toast";

const ViewAllVisit = () => {
  const [visit, setVisit] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage] = useState(10); // Number of items per page
  const [filterText, setFilterText] = useState("");
  const [sortAsc, setSortAsc] = useState(true);
  const [render, setRender] = useState(false);
  const { id } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState(null);
  const navigate = useNavigate();
  const EmpId = useSelector((state) => state.auth.user);

  const token = EmpId?.token;
  useEffect(() => {
    fetchvisit();
  }, [id, render]);

  const fetchvisit = async () => {
    try {
      const response = await axios.get(
        `https://crmdemo.vimubds5.a2hosted.com/api/employe-visit/${id}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }}
      );
      setVisit(response.data);
      console.log(response);
    } catch (error) {
      console.error("Error fetching visit:", error);
    }
  };


  const handleDelete = async (visit) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this visit?"
    );
  
    if (!isConfirmed) return;
  
    try {
      // Delete the visit
      const deleteResponse = await axios.delete(
        `https://crmdemo.vimubds5.a2hosted.com/api/employe-visit/${visit.id}`
      );
  
      if (deleteResponse.status === 200) {
        console.log("Visit deleted successfully");
      } else {
        console.error("Failed to delete visit:", deleteResponse.data);
        cogoToast.error("Failed to delete visit.");
        return;
      }
  
      // Update visit status
      const updateVisitResponse = await axios.put(
        `https://crmdemo.vimubds5.a2hosted.com/api/updateVisitStatus/${visit.lead_id}`,
        { visit: "pending" }
      );
  
      if (updateVisitResponse.status === 200) {
        console.log("Visit status updated successfully:", updateVisitResponse.data);
      } else {
        console.error("Error updating visit status:", updateVisitResponse.data);
        cogoToast.error("Failed to update visit status.");
        return;
      }
  
      // Update lead status
      const updateLeadStatusResponse = await axios.put(
        `https://crmdemo.vimubds5.a2hosted.com/api/updateOnlyLeadStatus/${visit.lead_id}`,
        { lead_status: "pending" }
      );
  
      if (updateLeadStatusResponse.status === 200) {
        console.log(
          "Lead status updated successfully:",
          updateLeadStatusResponse.data
        );
        cogoToast.success("Visit deleted and statuses updated successfully!");
      } else {
        console.error("Error updating lead status:", updateLeadStatusResponse.data);
        cogoToast.error("Failed to update lead status.");
        return;
      }
  
      // Trigger UI update
      setRender((prevRender) => !prevRender);
    } catch (error) {
      console.error("Error occurred during the deletion process:", error);
      cogoToast.error("An error occurred. Please try again.");
    }
  };
  
 // Function to send the PUT request to update the visit data
 const openModal = (data) => {
    setModalData(data);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalData(null);
  };

  // Handle updating field values in modalData
  const handleInputChange = (e) => {
    setModalData({
      ...modalData,
      [e.target.name]: e.target.value,
    });
  };

  // Function to send the PUT request to update the visit data
  const updateVisit = async () => {
    try {
      const response = await axios.put(`https://crmdemo.vimubds5.a2hosted.com/api/employe-visit`, modalData);
      if (response.status === 200) {
        cogoToast.success("Visit updated successfully!");
        setRender(!render); // Refresh the list after updating
    
        closeModal(); // Close the modal
         // Second API call: Update visit status
         const updateResponse = await axios.put(
          `https://crmdemo.vimubds5.a2hosted.com/api/updateVisitStatus/${modalData.lead_id}`,
          { visit: modalData.visit,visit_date:modalData.visit_date }
        );
  
        if (updateResponse.status === 200) {
          console.log("Visit status updated successfully:", updateResponse.data);
          cogoToast.success("Visit status updated successfully");
        } else {
          console.error("Error updating visit status:", updateResponse.data);
          cogoToast.error("Failed to update visit status.");
          return; // Exit if this step fails
        }
      }
    } catch (error) {
      console.error("Error updating visit:", error);
    }
  };


  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };



  const filteredvisit = visit.filter((visit) =>
    visit.name.toLowerCase().includes(filterText.toLowerCase())
  );

  const offset = currentPage * itemsPerPage;
  const currentvisit = filteredvisit.slice(
    offset,
    offset + itemsPerPage
  );
  const pageCount = Math.ceil(filteredvisit.length / itemsPerPage);

  const handleBackClick = () => {
    navigate(-1); // -1 navigates to the previous page in history
  };

  return (
    <>
      <MainHeader />
      <EmployeeeSider />
      <div className="container mt-4 2xl:w-[91%] 2xl:ml-36">
      <div className="mt-[6rem] ">
          <button
            onClick={() => navigate(-1)}
            className="bg-blue-500 text-white px-3 py-1 max-sm:hidden rounded-lg hover:bg-blue-600 transition-colors"
          >
            Back
          </button>
        </div>
        <div className="w-full px-2 mx-auto p-4">
          <div className="w-full px-2 mt-4">
            <h2 className="text-2xl font-bold mb-4 text-center">
              All Leads visit
            </h2>
            <div className=" overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 border border-gray-300">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      S.no
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Project Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                     Lead Id 
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                     Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Assigned To
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Visit 
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Visit Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Report
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentvisit.map((visit, index) => (
                    <tr key={visit.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {offset + index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {visit.project_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {visit.lead_id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {visit.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                       {visit.employee_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                       {visit.visit}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                      {moment(visit.visit_date).format("DD MMM YYYY").toUpperCase()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                       {visit.report}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                     
                          <button className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-1 px-3 rounded m-1"
                          onClick={() => openModal(visit)}
                          >
                            Edit
                          </button>
                    
                        <button
                          className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded m-1"
                          onClick={() => handleDelete(visit)}
                        >
                          Delete
                        </button>
                       
                        {/* <button
                        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-3 rounded m-1"
                        onClick={() =>
                          handleCopyvisit(visit.visit_id)
                        }
                      >
                        Copy
                      </button> */}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>




         
                


                    {/* Modal for Editing Visit Data */}
                    {isModalOpen && (
  <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
    <div className="bg-white p-6 rounded-lg shadow-lg w-[500px]">
      <h2 className="text-xl mb-4 font-bold">Edit Visit</h2>
      <form>
      <div className="mb-4">
          <label className="block text-gray-700">Project Name:</label>
          <input
            type="text"
            name="project_name"
            value={modalData.project_name || ""}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded"
            disabled
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Lead ID:</label>
          <input
            type="text"
            name="lead_id"
            value={modalData.lead_id || ""}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded"
            disabled
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700">Name:</label>
          <input
            type="text"
            name="name"
            value={modalData.name || ""}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded"
            disabled
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Visit:</label>
          <input
            type="text"
            name="visit"
            value={modalData.visit || ""}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Visit Date:</label>
          <input
            type="date"
            name="visit_date"
            value={modalData.visit_date || ""}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-100"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Report:</label>
          <textarea
            name="report"
            value={modalData.report || ""}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded"
          ></textarea>
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={updateVisit}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 mr-2"
          >
            Update
          </button>
          <button
            type="button"
            onClick={closeModal}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  </div>
)}

            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ViewAllVisit;
