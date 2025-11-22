import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import { useSelector } from "react-redux";
import cogoToast from "cogo-toast";
import getFieldValue from "../../../utils/getFieldValue";

const VisitTab = () => {
  const [visit, setVisit] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage] = useState(10);
  const [filterText, setFilterText] = useState("");
  const [render, setRender] = useState(false);
  const { type, id } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState(null);
  const navigate = useNavigate();
  const EmpId = useSelector((state) => state.auth.user);
  const [loading, setLoading] = useState(false);

  const token = EmpId?.token;
  useEffect(() => {
    fetchvisit();
  }, [id, render]);

  const fetchvisit = async () => {
    try {
      const { data } = await axios.get(
        `https://crm-generalize.dentalguru.software/api/employe-visit/${type}/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setVisit(data);
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
      const res = await axios.delete(
        `https://crm-generalize.dentalguru.software/api/employe-visit/${visit?.visit_id}`
      );
      cogoToast.success("visit data deleted successfully");
      fetchvisit();
    } catch (error) {
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
  const updateVisit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.put(
        `https://crm-generalize.dentalguru.software/api/employe-visit/${modalData?.visit_id}`,
        modalData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        cogoToast.success("Visit updated successfully!");
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
  const currentvisit = visit?.slice(offset, offset + itemsPerPage);
  const pageCount = Math.ceil(visit.length / itemsPerPage);

  const handleBackClick = () => {
    navigate(-1);
  };

  return (
    <>
      <div className="flex">
        <div className="w-full min-h-screen bg-[#F9FAFF] p-2">
          <div className="container sm:mt-2 mt-0">
            <div className="w-full px-2 mx-auto">
              <div className="w-full px-2 mt-4">
                <h2 className="text-2xl font-bold mb-4 text-left">
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
                          Visit type
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Visit Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
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
                            {visit.lead_id || visit.leadgen_id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {visit.name ||
                              getFieldValue(
                                visit.question_fields_data,
                                "full_name"
                              )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {visit.visit_type}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {moment(visit.visit_date)
                              .format("DD MMM YYYY")
                              .toUpperCase()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {visit.vis_status}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button
                              className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-1 px-3 rounded m-1"
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
                        <form onSubmit={updateVisit} className="space-y-4">
                          {/* Visit Date */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              Visit Date
                            </label>
                            <input
                              type="date"
                              name="visit_date"
                              value={modalData.visit_date}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-cyan-500"
                              required
                            />
                          </div>

                          {/* Visit Type */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              Visit Type
                            </label>
                            <select
                              name="visit_type"
                              value={modalData.visit_type}
                              onChange={handleInputChange}
                              className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-cyan-500"
                              required
                            >
                              <option value="">Select Visit Type</option>
                              <option value="Fresh">Fresh</option>
                              <option value="Re-visit">Re-Visit</option>
                              <option value="Self">Self</option>
                              <option value="Associative">Associative</option>
                              <option value="other">Other</option>
                            </select>
                          </div>

                          {/* visit details */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              Visit Details
                            </label>
                            <textarea
                              type="text"
                              name="visit_details"
                              value={modalData.visit_details}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-cyan-500"
                              required
                            />
                          </div>

                          {/* Visit Status */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              Visit Status
                            </label>
                            <select
                              name="vis_status"
                              value={modalData.vis_status}
                              onChange={handleInputChange}
                              className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-cyan-500"
                              required
                            >
                              <option value="">Select Visit Status</option>
                              <option value="Pending">Pending</option>
                              <option value="Done">Done</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          </div>

                          {/* Buttons */}
                          <div className="flex justify-end gap-3 pt-2">
                            <button
                              type="button"
                              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700"
                              onClick={() => setIsModalOpen(false)}
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              disabled={loading}
                              className={`px-4 py-2 rounded text-white ${
                                loading
                                  ? "bg-gray-600"
                                  : "bg-cyan-600 hover:bg-cyan-700"
                              }`}
                            >
                              {loading ? "Saving..." : "Save"}
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

export default VisitTab;
