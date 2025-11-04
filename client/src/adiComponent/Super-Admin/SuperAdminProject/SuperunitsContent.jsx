import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import cogoToast from "cogo-toast";
import axios from "axios";
import ReactPaginate from "react-paginate";
import { FaTrash, FaEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import SuperUnitAddPopup from "./SuperUnitAddPopup";
import SuperUnitUpdatePopup from "./SuperUnitUpdatePopup";
import { FaDatabase } from "react-icons/fa6";
import SuperBulkUnitUploadPopup from "../../../pages/superAdmin/popupWindows/SuperBulkUnitUploadPopup";

const SuperunitsContent = () => {
  const { id } = useParams();
  const [currentPage, setCurrentPage] = useState(0);
  const [projectsPerPage] = useState(7);
  const [showModal, setShowModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [editProject, setEditProject] = useState({});
  const [addUnit, setAddUnit] = useState(false);
  const [units, setUnits] = useState([]);
  const navigate = useNavigate();
  const superadminuser = useSelector((state) => state.auth.user);
  const token = superadminuser.token;
  const [selected, setSelected] = useState();

  const openUpdateModal = (data) => {
    setSelected(data);
    setShowModal(true);
  };

  const fetchUnits = async () => {
    if (!id) return;
    try {
      const response = await axios.get(
        `https://crm-generalize.dentalguru.software/api/super-admin-getUnitsdistributeById/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data && response.data.data) {
        const reversedData = [...response.data.data].reverse();
        setUnits(reversedData);

        const sources = reversedData
          .map((unit) => unit.unit_type)
          .filter((source) => source);
        setDynamicLeadSources(Array.from(new Set(sources)));
      } else {
        setUnits([]);
      }
    } catch (error) {
      console.error("Error fetching units:", error);
      setUnits([]);
    }
  };

  console.log(units);

  const handleaddunit = () => {
    setAddUnit(true);
  };

  const handleEdit = (unit) => {
    setEditProject(unit);
    setShowModal(true);
  };

  const handleUpdate = async () => {
    if (!editProject.unit_id) {
      cogoToast.error("Unit ID is missing.");
      return;
    }

    try {
      console.log("Updating unit:", editProject);
      const { data } = await axios.put(
        `https://crm-generalize.dentalguru.software/api/edit-unit/${editProject.unit_id}`,
        editProject,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      cogoToast.success(data.message || "Unit updated successfully!");

      setUnits((prev) =>
        prev.map((unit) =>
          unit.unit_id === editProject.unit_id
            ? { ...unit, ...editProject }
            : unit
        )
      );

      setShowModal(false);
    } catch (error) {
      console.error("Error updating unit:", error);
      cogoToast.error("An error occurred while updating the unit.");
    }
  };

  const handleDelete = async (id) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this project?"
    );
    if (!isConfirmed) return;

    try {
      const res = await axios.delete(
        `https://crm-generalize.dentalguru.software/api/delete-unit/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchUnits();
    } catch (error) {
      console.error("Error deleting unit:", error);
      cogoToast.error("An error occurred while deleting the unit.");
    }
  };

  const handlePageClick = (event) => {
    const selectedPage = event.selected;
    setCurrentPage(selectedPage);
  };

  useEffect(() => {
    fetchUnits();
  }, [id]);

  const itemsPerPage = 4;
  const offset = currentPage * itemsPerPage;
  const currentItems = units.slice(offset, offset + itemsPerPage);
  const pageCount = Math.ceil(units.length / itemsPerPage);

  const hardCodedLeadSources = [
    "1BHK",
    "2BHK",
    "3BHK",
    "Bungalow",
    "Commercial",
    "Plot",
    "Villa",
    "Other",
  ];

  const [dynamicLeadSources, setDynamicLeadSources] = useState([]);

  const combinedLeadSources = [
    ...new Set([...hardCodedLeadSources, ...dynamicLeadSources]),
  ];
  const [customLeadSource, setCustomLeadSource] = useState("");
  const handleCustomLeadSourceChange = (e) => {
    setCustomLeadSource(e.target.value);
  };

  return (
    <>
      <div className="flex mt-20">
        <div className="w-full min-h-screen bg-[#F9FAFF] p-2">
          <div className="mt-[2rem]">
            <button
              onClick={() => navigate(-1)}
              className="bg-cyan-500 text-white px-3 py-1 rounded-lg hover:bg-cyan-600 transition-colors"
            >
              Back
            </button>
          </div>
          <h2 className="text-2xl text-center mt-[1rem]">Units Management</h2>

          <div className="mx-auto h-[3px] w-16 bg-[#34495E] my-3"></div>
          <div className="flex min-h-screen overflow-hidden ">
            {/* Main Content */}
            <div className="flex-1 max-w-full">
              <div className="p-4 mt-6 bg-white rounded-lg shadow-lg mx-7 mb-2">
                {/* Units Table */}
                <div className="flex justify-between items-center ">
                  <h3 className="mb-4 text-lg font-semibold mt-2 mx-1">
                    All units associated with Project ID {id}
                  </h3>
                  <div className="flex justify-end gap-2">
                     <button
                    onClick={() => handleaddunit()}
                    className="bg-cyan-600 text-white px-6 py-2 rounded-md hover:bg-cyan-700"
                  >
                    Add Unit
                  </button>
                   <button
                    onClick={() => setShowBulkModal(true)}
                    className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 flex gap-2 items-center"
                  >
                   <FaDatabase /> Add Bulk Unit
                  </button>
                  </div>
                 
                </div>
                <div className="overflow-x-auto mt-4">
                  <table className="min-w-full bg-white border rounded-lg shadow-md mt-1">
                    <thead>
                      <tr className="bg-gray-100 text-gray-700 uppercase text-sm leading-normal">
                        <th className="px-6 py-3 border-b border-gray-300 text-left">
                          S.No
                        </th>
                        <th className="px-6 py-3 border-b border-gray-300 text-left">
                          Unit Number
                        </th>
                        <th className="px-6 py-3 border-b border-gray-300 text-left">
                          Unit Area
                        </th>
                        <th className="px-6 py-3 border-b border-gray-300 text-left">
                          Unit Type
                        </th>

                        <th className="px-6 py-3 border-b border-gray-300 text-left">
                          Base Price
                        </th>
                        <th className="px-6 py-3 border-b border-gray-300 text-left">
                          Status
                        </th>
                        <th className="px-6 py-3 border-b-2 border-gray-300">
                          Action
                        </th>
                        {/* <th className="px-6 py-3 border-b-2 border-gray-300">
                          Unit Detail
                        </th> */}
                      </tr>
                    </thead>
                    <tbody>
                      {units.length > 0 ? (
                        currentItems.map((unit, index) => (
                          <tr
                            key={index}
                            className="border-b border-gray-200 hover:bg-gray-50 text-gray-900"
                          >
                            <td className="px-6 py-4">
                              {currentPage * projectsPerPage + index + 1}
                            </td>
                            <td className="px-6 py-4">{unit.unit_number}</td>
                            <td className="px-6 py-4">{unit.unit_area} sqft</td>
                            <td className="px-6 py-4">{unit.unit_type}</td>

                            <td className="px-6 py-4 font-semibold">
                              {" "}
                              {unit.base_price}
                            </td>
                            <td className="px-6 py-4 font-semibold">
                              {" "}
                              {unit.unit_status}
                            </td>
                            <td className="px-6 py-4 border-b border-gray-200 text-gray-800">
                              <button
                                onClick={() => openUpdateModal(unit)}
                                className="mr-2 text-cyan-600 hover:text-cyan-800"
                              >
                                <FaEdit />
                              </button>
                              <button
                                onClick={() => handleDelete(unit.unit_id)}
                                className="text-red-600 hover:text-red-800"
                              >
                                <FaTrash />
                              </button>
                            </td>
                            {/* <td className="px-6 py-4 border-b border-gray-200 text-gray-800">
                              <Link
                                to={`/Super-admin-unit-Detail-Dash/${unit.unit_id}`}
                                className="inline-block"
                              >
                                <button className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-cyan-700 transition">
                                  Detail
                                </button>
                              </Link>
                            </td> */}
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan="7"
                            className="text-center py-4 text-gray-500"
                          >
                            No units available
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="mt-4 flex justify-center">
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
              </div>
            </div>
          </div>
        </div>
      </div>
      <SuperUnitAddPopup
        isOpen={addUnit}
        onClose={() => setAddUnit(false)}
        combinedLeadSources={combinedLeadSources}
        fetchUnits={fetchUnits}
      />
      <SuperUnitUpdatePopup
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        combinedLeadSources={combinedLeadSources}
        fetchUnits={fetchUnits}
        selected={selected}
      />
      <SuperBulkUnitUploadPopup isOpen={showBulkModal} onClose={()=>setShowBulkModal(false)} fetchUnits={fetchUnits} />
    </>
  );
};

export default SuperunitsContent;
