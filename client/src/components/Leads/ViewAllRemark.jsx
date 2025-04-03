import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import { useSelector } from "react-redux";
import ReactPaginate from "react-paginate";


import cogoToast from "cogo-toast";
import EmployeeeSider from './../EmployeeModule/EmployeeSider';
import MainHeader from './../MainHeader';

const ViewAllRemark = () => {
  const [remarks, setRemarks] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage] = useState(10);
  const [filterText, setFilterText] = useState("");
  const [render, setRender] = useState(false);
  const { id } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState(null);
  const navigate = useNavigate();
  const EmpId = useSelector((state) => state.auth.user);

  const token = EmpId?.token;
  useEffect(() => {
    fetchRemarks();
  }, [id, render]);

  const fetchRemarks = async () => {
    try {
      const response = await axios.get(`https://crmdemo.vimubds5.a2hosted.com/api/remarks/${id}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }});
      setRemarks(response.data);
      console.log(response);
    } catch (error) {
      console.error("Error fetching remarks:", error);
    }
  };

  const handleDelete = async (remark) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this remark?");
    if (!isConfirmed) return;
  
    try {
      // Delete the remark
      const deleteResponse = await axios.delete(`https://crmdemo.vimubds5.a2hosted.com/api/remarks/${remark.id}`);
      if (deleteResponse.status === 200) {
        console.log("Remark deleted successfully");
  
        // Update remark_status in the leads table
        const updateResponse = await axios.put(
          `https://crmdemo.vimubds5.a2hosted.com/api/updateOnlyRemarkStatus/${remark.lead_id}`,
          { remark_status: "pending" }
        );
  
        // Update answer_remark in the leads table
        const updateAnswerResponse = await axios.put(
          `https://crmdemo.vimubds5.a2hosted.com/api/updateOnlyRemarkAnswerStatus/${remark.lead_id}`,
          { answer_remark: "pending" }
        );
  
        if (updateResponse.status === 200 && updateAnswerResponse.status === 200) {
          console.log("Remark status and answer remark updated successfully in leads table");
        } else {
          console.error("Failed to update status or answer remark in leads table");
        }
      } else {
        console.error("Failed to delete remark");
      }
  
      // Re-render the component or refresh data
      setRender((prevRender) => !prevRender);
    } catch (error) {
      console.error("Error occurred while deleting remark or updating statuses:", error);
    }
  };
  

  const openModal = (data) => {

    
    setModalData(data);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalData(null);
  };

  const handleInputChange = (e) => {
    setModalData({
      ...modalData,
      [e.target.name]: e.target.value,
    });
  };

  const updateRemark = async () => {
    try {
      const response = await axios.put(`https://crmdemo.vimubds5.a2hosted.com/api/remarks`, modalData);
      if (response.status === 200) {
        cogoToast.success("Remark updated successfully!");
        const updateResponse = await axios.put(
          `https://crm.one-realty.in/api/updateOnlyRemarkStatus/${modalData.lead_id}`,
          { remark_status: modalData.remark_status }
        );


        if (updateResponse.status === 200) {
          console.log("Remark status  updated successfully in leads table");
        } else {
          console.error("Failed to update status or answer remark in leads table");
        }
        setRender(!render);
        closeModal();
      }
    } catch (error) {
      console.error("Error updating remark:", error);
    }
  };

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  const filteredRemarks = remarks.filter((remark) =>
    remark.name.toLowerCase().includes(filterText.toLowerCase())
  );

  const offset = currentPage * itemsPerPage;
  const currentRemarks = filteredRemarks.slice(offset, offset + itemsPerPage);
  const pageCount = Math.ceil(filteredRemarks.length / itemsPerPage);

  return (
    <>
      <MainHeader />
      <EmployeeeSider />
      <div className="container mt-4 2xl:w-[91%] 2xl:ml-36">
        <div className="mt-[7rem]">
          <button
            onClick={() => navigate(-1)}
            className="bg-blue-500 text-white px-3 py-1 max-sm:hidden rounded-lg hover:bg-blue-600 transition-colors"
          >
            Back
          </button>
        </div>
        <div className="w-full px-2 mx-auto p-4">
          <div className="w-full px-2 mt-4">
            <h2 className="text-2xl font-bold mb-4 text-center">All Remarks</h2>
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
                      Remark Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Remark Answer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentRemarks.map((remark, index) => (
                    <tr key={remark.id}>
                      <td className="px-6 py-4 whitespace-nowrap">{offset + index + 1}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{remark.project_name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{remark.lead_id}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{remark.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{remark.employee_name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{remark.remark_status}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{remark.answer_remark}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{moment(remark.date).format("DD MMM YYYY").toUpperCase()}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-1 px-3 rounded m-1"
                          onClick={() => openModal(remark)}
                        >
                          Edit
                        </button>
                        <button
                          className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded m-1"
                          onClick={() => handleDelete(remark)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
                  <div className="bg-white p-6 rounded-lg shadow-lg w-[500px]">
                    <h2 className="text-xl mb-4 font-bold">Edit Remark</h2>
                    <form>
                    <div className="mb-4">
                        <label className="block text-gray-700">Project Name:</label>
                        <input
                          type="text"
                          name="project_name"
                          value={modalData.project_name|| ""}
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
                        <label className="block text-gray-700">Remark Status:</label>
                        <input
                          type="text"
                          name="remark_status"
                          value={modalData.remark_status || ""}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded"
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-gray-700">Date:</label>
                        <input
                          type="date"
                          name="date"
                          value={modalData.date || ""}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-100"
                        />
                      </div>
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={updateRemark}
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

export default ViewAllRemark;
