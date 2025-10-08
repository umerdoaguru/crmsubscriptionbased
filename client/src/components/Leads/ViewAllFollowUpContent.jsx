import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import { useSelector } from "react-redux";
import cogoToast from "cogo-toast";

const getFieldValue = (dataString, fieldName) => {
  try {
    const data = JSON.parse(dataString);
    const field = data.find((item) => item.name === fieldName);
    return field ? field.values[0] : "";
  } catch (error) {
    console.error("Invalid question_fields_data:", error);
    return "";
  }
};

const ViewAllFollowUpContent = () => {
  const [follow_up, setFollow_Up] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage] = useState(10);
  const [filterText, setFilterText] = useState("");
  const [render, setRender] = useState(false);
  const { type, id } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState(null);
  const navigate = useNavigate();
  const EmpId = useSelector((state) => state.auth.user);

  const token = EmpId?.token;
  useEffect(() => {
    fetchFollowUp();
  }, [id, render]);

  const fetchFollowUp = async () => {
    try {
      let apiUrl = "";

      if (type === "meta") {
        apiUrl = `https://crm-generalize.dentalguru.software/api/getEmployeeFollow_UpMeta/${id}`;
      } else {
        apiUrl = `https://crm-generalize.dentalguru.software/api/getEmployeeFollow_Up/${id}`;
      }

      const { data } = await axios.get(apiUrl, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      setFollow_Up(data);
    } catch (error) {
      console.error("Error fetching follow up:", error);
    }
  };

  console.log(follow_up);

  const handleDelete = async (followup) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this follow up?"
    );
    if (isConfirmed) {
      try {
        const response = await axios.delete(
          `https://crm-generalize.dentalguru.software/api/employe-follow-up/${followup.follow_up_id}`
        );
        fetchFollowUp();
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

  const updateVisit = async () => {
    try {
      const response = await axios.put(
        `https://crm-generalize.dentalguru.software/api/employe-follow-up/${modalData?.follow_up_id}`,
        modalData
      );
      if (response.status === 200) {
        cogoToast.success("Follow Up updated successfully!");
        setRender(!render);
        closeModal();
      }
    } catch (error) {
      console.error("Error updating visit:", error);
    }
  };

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  const offset = currentPage * itemsPerPage;
  const currentfollow = follow_up.slice(offset, offset + itemsPerPage);
  const pageCount = Math.ceil(follow_up.length / itemsPerPage);

  const handleBackClick = () => {
    navigate(-1);
  };

  return (
    <>
      <div className="flex mt-20">
        <div className="w-full min-h-screen bg-[#F9FAFF] p-2">
          <div className="container mt-2">
            <div className="mt-[1rem] ">
              <button
                onClick={() => navigate(-1)}
                className="bg-cyan-500 text-white px-3 py-1 max-sm:hidden rounded-lg hover:bg-cyan-600 transition-colors"
              >
                Back
              </button>
            </div>
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
                          Follow Up Type
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Follow Up Date
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
                      {currentfollow.map((followup, index) => (
                        <tr key={followup.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {offset + index + 1}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {followup.project_name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {followup.lead_id || followup.leadgen_id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {followup.name ||
                              getFieldValue(
                                followup.question_fields_data,
                                "full_name"
                              )}
                          </td>
                          {/* <td className="px-6 py-4 whitespace-nowrap">
                            {followup.employee_name}
                          </td> */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            {followup.follow_up_type}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {moment(followup.follow_up_date)
                              .format("DD MMM YYYY")
                              .toUpperCase()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {followup.follow_up_report}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button
                              className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-1 px-3 rounded m-1"
                              onClick={() => openModal(followup)}
                            >
                              Edit
                            </button>

                            <button
                              className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded m-1"
                              onClick={() => handleDelete(followup)}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {/* Modal for Editing Follow Up Data */}
                  {isModalOpen && (
                    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
                      <div className="bg-white p-6 rounded-lg shadow-lg w-[500px]">
                        <h2 className="text-xl mb-4 font-bold">
                          Edit Follow Up
                        </h2>
                        <form>
                          <div className="mb-4">
                            <label className="block text-gray-700">
                              Project Name:
                            </label>
                            <input
                              type="text"
                              name="lead_id"
                              value={modalData.project_name || ""}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded"
                              disabled
                            />
                          </div>
                          <div className="mb-4">
                            <label className="block text-gray-700">
                              Lead ID:
                            </label>
                            <input
                              type="text"
                              name="lead_id"
                              value={modalData.lead_id || modalData?.leadgen_id}
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
                              value={
                                modalData.name ||
                                getFieldValue(
                                  modalData.question_fields_data,
                                  "full_name"
                                )
                              }
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded"
                              disabled
                            />
                          </div>

                          <div className="mb-4">
                            <label className="block text-gray-700">
                              Follow Up Type:
                            </label>
                            <input
                              type="text"
                              name="follow_up_type"
                              value={modalData.follow_up_type || ""}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded"
                            />
                          </div>

                          <div className="mb-4">
                            <label className="block text-gray-700">
                              Follow Up Date:
                            </label>
                            <input
                              type="date"
                              name="follow_up_date"
                              value={modalData.follow_up_date || ""}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-100"
                            />
                          </div>

                          <div className="mb-4">
                            <label className="block text-gray-700">
                              Report:
                            </label>
                            <textarea
                              name="follow_up_report"
                              value={modalData.follow_up_report || ""}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded"
                            ></textarea>
                          </div>

                          <div className="flex justify-end">
                            <button
                              type="button"
                              onClick={updateVisit}
                              className="bg-cyan-500 text-white px-4 py-2 rounded hover:bg-cyan-700 mr-2"
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

export default ViewAllFollowUpContent;
