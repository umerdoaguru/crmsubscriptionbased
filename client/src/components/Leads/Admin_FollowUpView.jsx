import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import { useSelector } from "react-redux";
import ReactPaginate from "react-paginate";


import cogoToast from "cogo-toast";
import Sider from './../Sider';
import MainHeader from './../MainHeader';

const Admin_FollowUpView = () => {
  const [follow_up, setFollow_Up] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage] = useState(10); // Number of items per page
  const [filterText, setFilterText] = useState("");
  const [sortAsc, setSortAsc] = useState(true);
  const [render, setRender] = useState(false);
  const { id } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchFollowUp();
  }, [id, render]);
  const adminuser = useSelector((state) => state.auth.user);
  const token = adminuser.token;

  const fetchFollowUp = async () => {
    try {
      const response = await axios.get(
        `https://crmdemo.vimubds5.a2hosted.com/api/employe-follow-up/${id}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }}
      );
      setFollow_Up(response.data);
      console.log(response);
    } catch (error) {
      console.error("Error fetching visit:", error);
    }
  };


  const handleDelete = async (followup) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this follow up?"
    );
    if (isConfirmed) {
      try {
        const response = await axios.delete(
          `https://crmdemo.vimubds5.a2hosted.com/api/employe-follow-up/${followup.id}`
        );
        if (response.status === 200) {
          console.log("follow up deleted successfully");

        }
    
        console.log(response);
        setRender(!render);
      } catch (error) {
        console.error("Error deleting visit:", error);
      }
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
      const response = await axios.put(`https://crmdemo.vimubds5.a2hosted.com/api/employe-follow-up`, modalData);
      if (response.status === 200) {
        cogoToast.success("Follow Up updated successfully!");
        setRender(!render); // Refresh the list after updating
        closeModal(); // Close the modal
      }
    } catch (error) {
      console.error("Error updating visit:", error);
    }
  };


  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };



  const filteredfollowup = follow_up.filter((follow) =>
    follow.name.toLowerCase().includes(filterText.toLowerCase())
  );

  const offset = currentPage * itemsPerPage;
  const currentfollow = filteredfollowup.slice(
    offset,
    offset + itemsPerPage
  );
  const pageCount = Math.ceil(filteredfollowup.length / itemsPerPage);

  const handleBackClick = () => {
    navigate(-1); // -1 navigates to the previous page in history
  };

  return (
    <>
      <MainHeader />
      <Sider />
      <div className="container mt-4 2xl:w-[91%] 2xl:ml-36">
      <button
            onClick={handleBackClick}
            className="bg-blue-500 text-white mt-5 px-4 py-2 rounded"
          >
            Go Back
          </button>
        <div className="w-full px-2 mx-auto p-4">
          <div className="w-full px-2 mt-4">
            <h2 className="text-2xl font-bold mb-4 text-center">
              All Follow Up
            </h2>
            <div className=" overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 border border-gray-300">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      S.no
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
                    Follow Up Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Follow Up Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Report
                    </th>
                   
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentfollow.map((followup, index) => (
                    <tr key={followup.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {offset + index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {followup.lead_id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {followup.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                       {followup.employee_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                       {followup.follow_up_type}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                       {followup.follow_up_date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                       {followup.report}
                      </td>
                   
                    </tr>
                  ))}
                </tbody>
              </table>




              <ReactPaginate
                previousLabel={"previous"}
                nextLabel={"next"}
                breakLabel={"..."}
                pageCount={pageCount}
forcePage={currentPage}
                marginPagesDisplayed={2}
                pageRangeDisplayed={5}
                onPageChange={handlePageClick}
                containerClassName={"flex justify-center space-x-2 mt-4"}
                pageClassName={"bg-white border border-gray-300 rounded-md"}
                pageLinkClassName={
                  "py-2 px-4 text-sm text-gray-700 hover:bg-gray-200"
                }
                previousClassName={"bg-white border border-gray-300 rounded-md"}
                previousLinkClassName={
                  "py-2 px-4 text-sm text-gray-700 hover:bg-gray-200"
                }
                nextClassName={"bg-white border border-gray-300 rounded-md"}
                nextLinkClassName={
                  "py-2 px-4 text-sm text-gray-700 hover:bg-gray-200"
                }
                breakClassName={"bg-white border border-gray-300 rounded-md"}
                breakLinkClassName={
                  "py-2 px-4 text-sm text-gray-700 hover:bg-gray-200"
                }
                activeClassName={"bg-gray-200"}
              />


                    {/* Modal for Editing Follow Up Data */}
                    {isModalOpen && (
  <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
    <div className="bg-white p-6 rounded-lg shadow-lg w-[500px]">
      <h2 className="text-xl mb-4 font-bold">Edit Follow Up</h2>
      <form>
        <div className="mb-4">
          <label className="block text-gray-700">Lead ID:</label>
          <input
            type="text"
            name="lead_id"
            value={modalData.lead_id || ""}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded"
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
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Follow Up Type:</label>
          <input
            type="text"
            name="follow_up_type"
            value={modalData.follow_up_type || ""}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Follow Up Date:</label>
          <input
            type="date"
            name="follow_up_date"
            value={modalData.follow_up_date || ""}
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

export default Admin_FollowUpView;
