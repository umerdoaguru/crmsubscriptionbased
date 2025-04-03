import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import cogoToast from "cogo-toast";
import axios from "axios";
import ReactPaginate from "react-paginate";
import { FaTrash, FaEdit} from "react-icons/fa";
import MainHeader from './../../../components/MainHeader';
import SuperAdminSider from './../SuperAdminSider';
import { useNavigate} from "react-router-dom";
import { useSelector } from "react-redux";

const Superunits = () => {
  const { id  } = useParams();
  const [currentPage, setCurrentPage] = useState(0);
  const [projects, setProjects] = useState([]);
  const [projectsPerPage] = useState(7);
  const [showModal, setShowModal] = useState(false);
  const [editProject, setEditProject] = useState({});
  const [addform, setaddunit] = useState(false);
  const [units, setUnits] = useState([]);
  const navigate = useNavigate();
  const superadminuser = useSelector((state) => state.auth.user);
  const token = superadminuser.token;

  const [unitData, setUnitData] = useState({
    main_project_id: id  || "", 
    unit_type: "",
    custom_unit_type: "",
    unit_size: "",
    total_units: "",
    base_price: "",
  });


  const fetchUnits = async () => {
    if (!id) return;
    try {
      const response = await axios.get(`https://crmdemo.vimubds5.a2hosted.com/api/super-admin-getUnitsdistributeById/${id}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }});
      if (response.data && response.data.data) {
        const reversedData = [...response.data.data].reverse();
        setUnits(reversedData); 
        
        const sources = reversedData.map((unit) => unit.unit_type).filter((source) => source);
        setDynamicLeadSources(Array.from(new Set(sources)));
      } else {
        setUnits([]);
      }
    } catch (error) {
      console.error("Error fetching units:", error);
      setUnits([]);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUnitData({ ...unitData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const unitTypeToSend =
        unitData.unit_type === "Other" ? unitData.custom_unit_type : unitData.unit_type;
      const payload = { ...unitData, unit_type: unitTypeToSend };
      delete payload.custom_unit_type;

      await axios.post("https://crmdemo.vimubds5.a2hosted.com/api/add-unit", payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      cogoToast.success("Unit added successfully!", { position: "top-center" });
      fetchUnits();
      setaddunit(false);
      setUnitData({
        main_project_id: id  || "", 
        unit_type: "",
        custom_unit_type: "",
        unit_size: "",
        total_units: "",
        base_price: "",
      });
      
    } catch (error) {
      console.error("Error adding unit:", error);
      cogoToast.error("Failed to add unit. Please try again.", { position: "top-center" });
    }
  };

 const handleaddunit = () =>{
  setaddunit((prev) => !prev); 
 }

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
        `https://crmdemo.vimubds5.a2hosted.com/api/edit-unit/${editProject.unit_id}`,
        editProject
      );
      cogoToast.success(data.message || "Unit updated successfully!");
  
      setUnits((prev) =>
        prev.map((unit) =>
          unit.unit_id === editProject.unit_id ? { ...unit, ...editProject } : unit
        )
      );
  
      setShowModal(false);
    } catch (error) {
      console.error("Error updating unit:", error);
      cogoToast.error("An error occurred while updating the unit.");
    }
  };

  // const handleDelete = async (id) => {
  //   const isConfirmed = window.confirm("Are you sure you want to delete this project?");
  //   if (!isConfirmed) return;
  
  //   try {
  //     const { data } = await axios.delete(`https://crmdemo.vimubds5.a2hosted.com/api/delete-unit/${id}`);
  //     cogoToast.success(data.message || "Unit deleted successfully!");
  //     fetchUnits();
  //     // Corrected filtering
  //     setProjects((prev) => prev.filter((unit) => unit.unit_id !== id));
  //   } catch (error) {
  //     console.error("Error deleting unit:", error);
  //     cogoToast.error("An error occurred while deleting the unit.");
  //   }
  // };

  const handleDelete = async (id) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this project?");
    if (!isConfirmed) return;
  
    try {
      let response;
      try {
        response = await axios.delete(`https://crmdemo.vimubds5.a2hosted.com/api/delete-unit/${id}`);
      } catch (error) {
        if (error.response && error.response.status === 400) {
          const userConfirmed = window.confirm(error.response.data.message);
          if (!userConfirmed) return;
          response = await axios.delete(`https://crmdemo.vimubds5.a2hosted.com/api/delete-unit/${id}?confirm=true`);
        } else {
          throw error;
        }
      }
      
      const { data } = response;
      cogoToast.success(data.message || "Unit deleted successfully!");
      fetchUnits();
      setProjects((prev) => prev.filter((unit) => unit.unit_id !== id));
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
      "Other"
    ];
    
    const [dynamicLeadSources, setDynamicLeadSources] = useState([]);
    
    const combinedLeadSources = [
      ...new Set([...hardCodedLeadSources, ...dynamicLeadSources])
    ];
  const [customLeadSource, setCustomLeadSource] = useState("");
    const handleCustomLeadSourceChange = (e) => {
      setCustomLeadSource(e.target.value);
    };
  
    const unitTypeToSend =
    unitData.unit_type === "Other" ? unitData.custom_unit_type : unitData.unit_type;
  const payload = { ...unitData, unit_type: unitTypeToSend };
  delete payload.custom_unit_type;

  return (
  
    <>
      <MainHeader />
      <SuperAdminSider />
      <div className="mt-[6rem] 2xl:ml-40">
          <button
            onClick={() => navigate(-1)}
            className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Back
          </button>
        </div>
      <h1 className="text-2xl text-center mt-[2rem]">Units Management</h1>

      <div className="mx-auto h-[3px] w-16 bg-[#34495E] my-3"></div>
      <div className="flex min-h-screen overflow-hidden ">
        {/* Main Content */}
        <div className="flex-1 max-w-full 2xl:w-[93%] 2xl:ml-32 ">
        <div className="p-4 mt-6 bg-white rounded-lg shadow-lg mx-7 mb-2">
      

      {/* Units Table */}
      <div className="flex justify-between items-center ">
      <h3 className="mb-4 text-lg font-semibold mt-2 mx-1">All units associated with Project ID {id}</h3>
      <button
        onClick={() => handleaddunit()}
        className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
      >
        Add Unit
      </button>
    </div>
      <div className="overflow-x-auto mt-4">
      
  <table className="min-w-full bg-white border rounded-lg shadow-md mt-1">
    <thead>
      <tr className="bg-gray-100 text-gray-700 uppercase text-sm leading-normal">
        <th className="px-6 py-3 border-b border-gray-300 text-left">S.No</th>
        <th className="px-6 py-3 border-b border-gray-300 text-left">Unit ID</th>
        <th className="px-6 py-3 border-b border-gray-300 text-left">Unit Type</th>
        <th className="px-6 py-3 border-b border-gray-300 text-left">Unit Area</th>
        <th className="px-6 py-3 border-b border-gray-300 text-left">Total Units</th>
        {/* <th className="px-6 py-3 border-b border-gray-300 text-left">Units Sold</th> */}
        {/* <th className="px-6 py-3 border-b border-gray-300 text-left">Available</th> */}
        <th className="px-6 py-3 border-b border-gray-300 text-left">Base Price</th>
        <th className="px-6 py-3 border-b-2 border-gray-300">Action</th>
        <th className="px-6 py-3 border-b-2 border-gray-300">Unit Detail</th>
      </tr>
    </thead>
    <tbody>
      {units.length > 0 ? (
        currentItems.map((unit, index) => (
          <tr key={index} className="border-b border-gray-200 hover:bg-gray-50 text-gray-900">
            <td className="px-6 py-4">{currentPage * projectsPerPage + index + 1}</td>
            <td className="px-6 py-4">{unit.unit_id}</td>
            <td className="px-6 py-4">{unit.unit_type}</td>
            <td className="px-6 py-4">{unit.unit_size} sqft</td>
            <td className="px-6 py-4">{unit.total_units}</td>
            {/* <td className="px-6 py-4">{unit.units_sold}</td> */}
            {/* <td className="px-6 py-4 font-semibold"> {unit.total_units - unit.units_sold}</td> */}
            <td className="px-6 py-4 font-semibold"> {unit.base_price}</td>
            <td className="px-6 py-4 border-b border-gray-200 text-gray-800">
            <button onClick={() => handleEdit(unit)} className="mr-2 text-blue-600 hover:text-blue-800"><FaEdit /></button>
            <button onClick={() => handleDelete(unit.unit_id)} className="text-red-600 hover:text-red-800"><FaTrash /></button>
            </td>
            <td className="px-6 py-4 border-b border-gray-200 text-gray-800">
              <Link to={`/Super-admin-unit-Detail-Dash/${unit.unit_id}`} className="inline-block">
                                <button className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition">
                                 Detail
                                </button>
                                </Link>
            </td>
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
      {addform && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4 z-[9999]">
    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
      <button
        onClick={() => setaddunit(false)} 
        className="absolute top-3 right-3 text-gray-600 hover:text-red-500"
      >
        ✖
      </button>

      <h2 className="text-xl font-semibold mb-4 text-gray-700">Add New Unit</h2>
      <form onSubmit={handleSubmit} className="bg-white p-4 shadow-lg rounded-lg">
        <div className="grid grid-cols-1 gap-4">
          {/* Project ID */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Project ID</label>
            <input
              type="number"
              name="main_project_id"
              value={unitData.main_project_id}
              onChange={handleChange}
              placeholder="Project ID"
              className="p-3 border rounded-lg w-full"
              required
              readOnly
            />
          </div>

          {/* Unit Type */}
          {/* <div>
            <label className="block text-gray-700 font-medium mb-1">Unit Type</label>
            <select
              name="unit_type"
              value={unitData.unit_type}
              onChange={handleChange}
              className="p-3 border rounded-lg w-full"
              required
            >
              <option value="">Select Unit Type</option>
              <option value="1BHK">1BHK</option>
              <option value="2BHK">2BHK</option>
              <option value="3BHK">3BHK</option>
              <option value="Bungalow">Bungalow</option>
              <option value="Commercial">Commercial</option>
              <option value="Plot">Plot</option>
              <option value="Villa">Villa</option>
              <option value="Other">Other</option>
            </select>
          </div> */}
          <div>
  <label className="block text-gray-700 font-medium mb-1">Unit Type</label>
  <select
    name="unit_type"
    value={unitData.unit_type}
    onChange={handleChange}
    className="w-full p-2 border rounded"
  >
    <option value="">Select Unit Type</option>
    {combinedLeadSources.map(source => (
      <option key={source} value={source}>
        {source}
      </option>
    ))}
  </select>
  {unitData.unit_type === "Other" && (
    <input
      type="text"
      name="custom_unit_type"
      value={unitData.custom_unit_type}
      onChange={handleChange}
      placeholder="Enter custom unit type"
      className="mt-2 w-full px-3 py-2 border border-gray-300 rounded"
    />
  )}
</div>

          {/* Unit Size */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Unit Area</label>
            <input
              type="number"
              name="unit_size"
              value={unitData.unit_size}
              onChange={handleChange}
              placeholder="e.g., 500sqft, 4000sqft"
              className="p-3 border rounded-lg w-full"
              required
              min={0}
              onKeyDown={(e) => {
                if (e.key === '-' || e.key === 'Subtract') {
                  e.preventDefault();
                }
              }}
            />
          </div>

          {/* Total Units */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Total Units</label>
            <input
              type="number"
              name="total_units"
              value={unitData.total_units}
              onChange={handleChange}
              placeholder="Total Units"
              className="p-3 border rounded-lg w-full"
              required
              min={0}
              onKeyDown={(e) => {
                if (e.key === '-' || e.key === 'Subtract') {
                  e.preventDefault();
                }
              }}
            />
          </div>

          {/* Base Price */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Base Price</label>
            <input
              type="number"
              name="base_price"
              value={unitData.base_price}
              onChange={handleChange}
              placeholder="Base Price"
              className="p-3 border rounded-lg w-full"
              required
              min={0}
              onKeyDown={(e) => {
                if (e.key === '-' || e.key === 'Subtract') {
                  e.preventDefault();
                }
              }}
            />
          </div>

          {/* Submit Button */}
          <div className="mt-4">
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition shadow-md"
            >
              Add Unit
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
)}

      
      {showModal && editProject && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[9999]">
    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
      <h2 className="text-xl font-semibold mb-4 text-gray-700">Edit Unit</h2>

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
          disabled
        />
      </div>

      {/* Total Units */}
      <div className="mb-3">
        <label className="block text-gray-600 mb-1">Total Units</label>
        <input 
          type="text" 
          value={editProject.total_units || ""} 
          onChange={(e) => setEditProject({ ...editProject, total_units: e.target.value })} 
          className="border p-2 w-full rounded focus:ring focus:ring-blue-300" 
          placeholder="Enter total units" 
        />
      </div>

      {/* Units Sold */}
      {/* <div className="mb-3">
        <label className="block text-gray-600 mb-1">Units Sold</label>
        <input 
          type="text" 
          value={editProject.units_sold || ""} 
          onChange={(e) => setEditProject({ ...editProject, units_sold: e.target.value })} 
          className="border p-2 w-full rounded focus:ring focus:ring-blue-300" 
          placeholder="Enter units sold" 
        />
      </div> */}

      {/* Base Price */}
      <div className="mb-3">
        <label className="block text-gray-600 mb-1">Base Price</label>
        <input 
          type="text" 
          value={editProject.base_price || ""} 
          onChange={(e) => setEditProject({ ...editProject, base_price: e.target.value })} 
          className="border p-2 w-full rounded focus:ring focus:ring-blue-300" 
          placeholder="Enter base price" 
          disabled
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
        </div>
      </div>

    
    </>
  );
};

export default Superunits;
