import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import ReactPaginate from "react-paginate";
import MainHeader from "../../../components/MainHeader";
import SuperAdminSider from "../SuperAdminSider";
import cogoToast from "cogo-toast";
import { useSelector } from "react-redux";

const SuperUnitsDetails = () => {
  const { id } = useParams();
  const [currentPage, setCurrentPage] = useState(0);
  const [units, setUnits] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editProject, setEditProject] = useState({});
  const [statusFilter, setStatusFilter] = useState("");
  const navigate = useNavigate();
  const superadminuser = useSelector((state) => state.auth.user);
  const token = superadminuser.token;

    
  const fetchUnits = async () => {
    if (!id) return;
    try {
      const response = await axios.get(`https://crmdemo.vimubds5.a2hosted.com/api/super-admin-getUntitsDetailById/${id}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }});
      if (response.data) {
        setUnits(response.data); 
      } else {
        setUnits([]);
      }
    } catch (error) {
      console.error("Error fetching units:", error);
      setUnits([]);
    }
  };

  const handlePageClick = (event) => {
    const selectedPage = event.selected;
    setCurrentPage(selectedPage);
  };

  useEffect(() => {
    fetchUnits();
  }, [id]);

  const filteredUnits = statusFilter
    ? units.filter(unit => unit.status.toLowerCase() === statusFilter.toLowerCase())
    : units;

  const itemsPerPage = 10;
  const offset = currentPage * itemsPerPage;
  const currentItems = filteredUnits.slice(offset, offset + itemsPerPage);
  const pageCount = Math.ceil(filteredUnits.length / itemsPerPage);

  const handleEdit = (unit) => {
    setEditProject(unit); 
    setShowModal(true);
  };

  const handleUpdate = async () => {
    if (!editProject.id) {
      cogoToast.error("Unit ID is missing.");
      return;
    }
  
    try {
      console.log("Updating unit:", editProject);
      const { data } = await axios.put(
        `https://crmdemo.vimubds5.a2hosted.com/api/editUnitdetailsinner/${editProject.id}`,
        editProject
      );
      console.log("Updating unit with id:", editProject.id, editProject);
      cogoToast.success(data.message || "Unit updated successfully!");
  
      setUnits((prev) =>
        prev.map((unit) =>
          unit.id === editProject.id ? { ...unit, ...editProject } : unit
        )
      );
  
      setShowModal(false);
    } catch (error) {
      console.error("Error updating unit:", error);
      cogoToast.error("An error occurred while updating the unit.");
    }
  };

  return (
    <>
      <MainHeader />
      <SuperAdminSider />
      <div className="mt-[7rem] 2xl:ml-40">
          <button
            onClick={() => navigate(-1)}
            className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Back
          </button>
        </div>
      <h1 className="text-2xl text-center mt-[2rem]">Units Details</h1>
      <div className="mx-auto h-[3px] w-16 bg-[#34495E] my-3"></div>
      <div className="flex min-h-screen overflow-hidden">
        {/* Main Content */}
        <div className="flex-1 max-w-full 2xl:w-[93%] 2xl:ml-32">
          <div className="p-4 mt-6 bg-white rounded-lg shadow-lg mx-7 mb-2">
            {/* Filter Buttons */}
            <div className="flex justify-between items-center">
              <h3 className="mb-4 text-lg font-semibold mt-2">
                The Details Of Unit ID {id}
              </h3>
              <div className="flex items-center justify-center p-2">
              <select
              value={statusFilter}
              onChange={(e) => {setStatusFilter(e.target.value);   
                                setCurrentPage(0);}}
              className="border border-gray-300 p-2 rounded-lg bg-white text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all">
              <option value="">All</option>
              <option value="pending">Pending</option>
              <option value="sold">Sold</option>
              </select>
              </div>
            </div>

            {/* Units Table */}
            <div className="overflow-x-auto mt-4">
              <table className="min-w-full bg-white border rounded-lg shadow-md mt-1">
                <thead>
                  <tr className="bg-gray-100 text-gray-700 uppercase text-sm leading-normal">
                    <th className="px-6 py-3 border-b border-gray-300 text-left">S.No</th>
                    <th className="px-6 py-3 border-b border-gray-300 text-left">Unit Type</th>
                    <th className="px-6 py-3 border-b border-gray-300 text-left">Unit Area</th>
                    <th className="px-6 py-3 border-b border-gray-300 text-left">Base Price</th>
                    <th className="px-6 py-3 border-b border-gray-300 text-left">Status</th>
                    <th className="px-6 py-3 border-b border-gray-300 text-left">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUnits.length > 0 ? (
                    currentItems.map((unit, index) => (
                      <tr key={index} className="border-b border-gray-200 hover:bg-gray-50 text-gray-900">
                        <td className="px-6 py-4">{unit.unit_number}</td>
                        <td className="px-6 py-4">{unit.unit_type}</td>
                        <td className="px-6 py-4">{unit.unit_size}</td>
                        <td className="px-6 py-4">{unit.base_price}</td>
                        <td className="px-6 py-4">{unit.status}</td>
                        {/* <button onClick={() => handleEdit(unit)} className="bg-green-600 text-white py-2 px-2 rounded-lg hover:bg-blue-700 transition mt-3">Edit Details</button> */}
                        <button 
  onClick={() => handleEdit(unit)} 
  className={`py-2 px-2 rounded-lg transition mt-3 ${
    unit.status === "sold" 
      ? "bg-gray-400 text-gray-700 cursor-not-allowed" 
      : "bg-green-600 text-white hover:bg-blue-700"
  }`} 
  disabled={unit.status === "sold"}
>
  Edit Details
</button>
                        {/* <button  className="mr-2 text-blue-600 hover:text-blue-800"></button>      */}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center py-4 text-gray-500">
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
        
        {showModal && editProject && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[9999]">
    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
      <h2 className="text-xl font-semibold mb-4 text-gray-700">Edit Unit Details</h2>

      {/* Unit Type */}
      <div className="mb-3">
        <label className="block text-gray-600 mb-1">Unit Type</label>
        <input 
          type="text" 
          value={editProject.unit_type || ""} 
          onChange={(e) => setEditProject({ ...editProject, unit_type: e.target.value })} 
          className="border p-2 w-full rounded focus:ring focus:ring-blue-300" 
          placeholder="Enter unit type" 
          disabled
        />
      </div>

      {/* Unit Size */}
      <div className="mb-3">
        <label className="block text-gray-600 mb-1">Unit Area</label>
        <input 
          type="text" 
          value={editProject.unit_size || ""} 
          onChange={(e) => setEditProject({ ...editProject, unit_size: e.target.value })} 
          className="border p-2 w-full rounded focus:ring focus:ring-blue-300" 
          placeholder="Enter unit size" 
        />
      </div>

      {/* Base Price */}
      <div className="mb-3">
        <label className="block text-gray-600 mb-1">Base Price</label>
        <input 
          type="text" 
          value={editProject.base_price || ""} 
          onChange={(e) => setEditProject({ ...editProject, base_price: e.target.value })} 
          className="border p-2 w-full rounded focus:ring focus:ring-blue-300" 
          placeholder="Enter base price" 
        />
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end">
        <button 
          onClick={() => setShowModal(false)} 
          className="mr-2 bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 transition"
        >
          Cancel
        </button>
        <button 
          onClick={handleUpdate} 
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        >
          Update
        </button>
      </div>
    </div>
  </div>
)}
      </div>
    </>
  );
};

export default SuperUnitsDetails;
