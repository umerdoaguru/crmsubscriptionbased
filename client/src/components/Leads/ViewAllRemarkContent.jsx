import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import { useSelector } from "react-redux";
import cogoToast from "cogo-toast";

const ViewAllRemarkContent = () => {
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
      const response = await axios.get(
        `https://crm-generalize.dentalguru.software/api/remarks/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setRemarks(response.data);
      console.log(response);
    } catch (error) {
      console.error("Error fetching remarks:", error);
    }
  };

  console.log(remarks);

  const handleDelete = async (remark) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this remark?"
    );
    if (!isConfirmed) return;

    try {
      // Delete the remark
      const deleteResponse = await axios.delete(
        `https://crm-generalize.dentalguru.software/api/remarks/${remark.remark_id}`
      );

      console.log("Remark deleted successfully");
      setRender((prevRender) => !prevRender);
      fetchRemarks();
    } catch (error) {
      console.error(
        "Error occurred while deleting remark or updating statuses:",
        error
      );
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
      const response = await axios.put(
        `https://crm-generalize.dentalguru.software/api/remarks/${id}`,
        modalData
      );
      cogoToast.success("Remark updated successfully!");
      fetchRemarks();
      setRender(!render);
      closeModal();
    } catch (error) {
      console.error("Error updating remark:", error);
    }
  };

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  const filteredRemarks = remarks.filter((remark) =>
    remark?.name?.toLowerCase().includes(filterText.toLowerCase())
  );

  const offset = currentPage * itemsPerPage;
  const currentRemarks = filteredRemarks.slice(offset, offset + itemsPerPage);
  const pageCount = Math.ceil(filteredRemarks.length / itemsPerPage);

  return (
    <>
      <div className="flex mt-20">
        <div className="w-full min-h-screen bg-[#F9FAFF] p-2">
          <div className="container mt-2">
            <div className="mt-[1rem]">
              <button
                onClick={() => navigate(-1)}
                className="bg-cyan-600 text-white px-3 py-1 max-sm:hidden rounded-lg hover:bg-cyan-600 transition-colors"
              >
                Back
              </button>
            </div>
            <div className="w-full px-2 mx-auto p-4">
              <div className="w-full px-2 mt-4">
                <h2 className="text-2xl font-bold mb-4 text-center">
                  All Remarks
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
                        {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Assigned To
                        </th> */}
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
                          <td className="px-6 py-4 whitespace-nowrap">
                            {offset + index + 1}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {remark.project_name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {remark.remark_lead_id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {remark.name}
                          </td>
                          {/* <td className="px-6 py-4 whitespace-nowrap">
                            {remark.employee_name}
                          </td> */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            {remark.remark_status}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {remark.answer_remark}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {remark.remark_date}
                          </td>
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
                            <label className="block text-gray-700">
                              Project Name:
                            </label>
                            <input
                              type="text"
                              name="project_name"
                              value={modalData.project_name || ""}
                              // onChange={handleInputChange}
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
                              // onChange={handleInputChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded"
                              disabled
                            />
                          </div>

                          <div className="mb-4">
                            <label className="block text-gray-700">
                              Remark Status:
                            </label>
                            <select
                              name="remark_status"
                              placeholder=""
                              value={modalData.remark_status}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-cyan-500"
                            >
                              <option value="">--select--</option>
                              <option value="Pending">Pending</option>
                              <option value="Fresh-Lead">Fresh Lead</option>
                              <option value="Contacted">Contacted</option>
                              <option value="Interested">Interested</option>
                              <option value="Site Visit Scheduled">
                                Site Visit Scheduled
                              </option>
                              <option value="Site Visited">Site Visited</option>
                              <option value="In Discussion">
                                In Discussion
                              </option>
                              <option value="Converted">Converted</option>
                              <option value="Not Interested">
                                Not Interested
                              </option>
                              <option value="Invalid Lead">Invalid Lead</option>
                              <option value="Lost">Lost</option>
                            </select>
                          </div>
                          <div className="mb-4">
                            <label className="block text-gray-700">Date:</label>
                            <input
                              type="date"
                              name="date"
                              value={modalData.remark_date || ""}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-100"
                            />
                          </div>
                          <div className="mb-4">
                            <label className="block text-gray-700">
                              Answer Remark:
                            </label>
                            <textarea
                              type="text"
                              name="answer_remark"
                              value={modalData.answer_remark || ""}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded"
                            />
                          </div>
                          <div className="flex justify-end">
                            <button
                              type="button"
                              onClick={updateRemark}
                              className="bg-cyan-600 text-white px-4 py-2 rounded hover:bg-cyan-700 mr-2"
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
        </div>
      </div>
    </>
  );
};

export default ViewAllRemarkContent;
