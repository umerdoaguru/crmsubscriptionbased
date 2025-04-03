
import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
// import cogoToast from "cogo-toast";
import axios from "axios";
import ReactPaginate from "react-paginate";
// import { FaTrash, FaEdit} from "react-icons/fa";
import MainHeader from "../MainHeader";
import Sider from "../Sider";
import { useNavigate} from "react-router-dom";
import { useSelector } from "react-redux";
import cogoToast from "cogo-toast";


const UnitDetailDash = () => {
  const { id  } = useParams();
  const [currentPage, setCurrentPage] = useState(0);
  // const [projects, setProjects] = useState([]);
  // const [projectsPerPage] = useState(7);
  const [showModal, setShowModal] = useState(false);
  const [editProject, setEditProject] = useState({});
  const [addform, setaddunit] = useState(false);
  const [units, setUnits] = useState([]);
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState("");

  // const [unitData, setUnitData] = useState({
  //   main_project_id: id  || "", 
  //   unit_type: "",
  //   custom_unit_type: "",
  //   unit_size: "",
  //   total_units: "",
  //   base_price: "",
  // });
  const adminuser = useSelector((state) => state.auth.user);
  const token = adminuser.token;



  const fetchUnits = async () => {
    if (!id) return;
    try {
      const response = await axios.get(`https://crmdemo.vimubds5.a2hosted.com/api/getUntitsDetailById/${id}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }});
      if (response.data && response.data) {
        setUnits(response.data); 
        
      } else {
        setUnits([]);
      }
    } catch (error) {
      console.error("Error fetching units:", error);
      setUnits([]);
    }
  };

  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   setUnitData({ ...unitData, [name]: value });
  // };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   try {
  //     const unitTypeToSend =
  //       unitData.unit_type === "Other" ? unitData.custom_unit_type : unitData.unit_type;
  //     const payload = { ...unitData, unit_type: unitTypeToSend };
  //     delete payload.custom_unit_type;

  //     await axios.post("https://crmdemo.vimubds5.a2hosted.com/api/add-unit", payload, {
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //     });

  //     cogoToast.success("Unit added successfully!", { position: "top-center" });
  //     fetchUnits();
  //     setaddunit();
  //     setUnitData({
  //       main_project_id: id  || "", 
  //       unit_type: "",
  //       custom_unit_type: "",
  //       unit_size: "",
  //       total_units: "",
  //       base_price: "",
  //     });
      
  //   } catch (error) {
  //     console.error("Error adding unit:", error);
  //     cogoToast.error("Failed to add unit. Please try again.", { position: "top-center" });
  //   }
  // };

//  const handleaddunit = () =>{
//   setaddunit((prev) => !prev);

//  }

  // const handleEdit = (unit) => {
  //   setEditProject(unit); 
  //   setShowModal(true);
  // };

  // const handleUpdate = async () => {
  //   if (!editProject.unit_id) {
  //     cogoToast.error("Unit ID is missing.");
  //     return;
  //   }
  
  //   try {
  //     console.log("Updating unit:", editProject);
  //     const { data } = await axios.put(
  //       `https://crmdemo.vimubds5.a2hosted.com/api/edit-unit/${editProject.unit_id}`,
  //       editProject
  //     );
  //     cogoToast.success(data.message || "Unit updated successfully!");
  
  //     setUnits((prev) =>
  //       prev.map((unit) =>
  //         unit.unit_id === editProject.unit_id ? { ...unit, ...editProject } : unit
  //       )
  //     );
  
  //     setShowModal(false);
  //   } catch (error) {
  //     console.error("Error updating unit:", error);
  //     cogoToast.error("An error occurred while updating the unit.");
  //   }
  // };

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
      <Sider />
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
      <div className="flex min-h-screen overflow-hidden ">
        {/* Main Content */}
        <div className="flex-1 max-w-full 2xl:w-[93%] 2xl:ml-32 ">
        <div className="p-4 mt-6 bg-white rounded-lg shadow-lg mx-7 mb-2">
      

      {/* Units Table */}
      <div className="overflow-x-auto mt-4">
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
      {units.length > 0 ? (
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
            {/* <td className="px-6 py-4 border-b border-gray-200 text-gray-800">
            <button onClick={() => handleEdit(unit)} className="mr-2 text-blue-600 hover:text-blue-800"><FaEdit /></button>
            <button onClick={() => handleDelete(unit.unit_id)} className="text-red-600 hover:text-red-800"><FaTrash /></button>
            </td> */}     
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
        <div> </div>
  // <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4 z-[9999]">
  //   <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
  //     <button
  //       onClick={() => setaddunit(false)} 
  //       className="absolute top-3 right-3 text-gray-600 hover:text-red-500"
  //     >
  //       ✖
  //     </button>

  //     <h2 className="text-xl font-semibold mb-4 text-gray-700">Add New Unit</h2>
  //     <form onSubmit={handleSubmit} className="bg-white p-4 shadow-lg rounded-lg">
  //       <div className="grid grid-cols-1 gap-4">
  //         {/* Project ID */}
  //         <div>
  //           <label className="block text-gray-700 font-medium mb-1">Project ID</label>
  //           <input
  //             type="number"
  //             name="main_project_id"
  //             value={unitData.main_project_id}
  //             onChange={handleChange}
  //             placeholder="Project ID"
  //             className="p-3 border rounded-lg w-full"
  //             required
  //             readOnly
  //           />
  //         </div>

  //         {/* Unit Type */}
  //         <div>
  //           <label className="block text-gray-700 font-medium mb-1">Unit Type</label>
  //           <select
  //             name="unit_type"
  //             value={unitData.unit_type}
  //             onChange={handleChange}
  //             className="p-3 border rounded-lg w-full"
  //             required
  //           >
  //             <option value="">Select Unit Type</option>
  //             <option value="1BHK">1BHK</option>
  //             <option value="2BHK">2BHK</option>
  //             <option value="3BHK">3BHK</option>
  //             <option value="Bungalow">Bungalow</option>
  //             <option value="Commercial">Commercial</option>
  //             <option value="Plot">Plot</option>
  //             <option value="Villa">Villa</option>
  //             <option value="Other">Other</option>
  //           </select>
  //         </div>

  //         {/* Custom Unit Type */}
  //         {unitData.unit_type === "Other" && (
  //           <div>
  //             <label className="block text-gray-700 font-medium mb-1">Custom Unit Type</label>
  //             <input
  //               type="text"
  //               name="custom_unit_type"
  //               value={unitData.custom_unit_type}
  //               onChange={handleChange}
  //               placeholder="Enter custom unit type"
  //               className="p-3 border rounded-lg w-full"
  //               required
  //             />
  //           </div>
  //         )}

  //         {/* Unit Size */}
  //         <div>
  //           <label className="block text-gray-700 font-medium mb-1">Unit Area</label>
  //           <input
  //             type="number"
  //             name="unit_size"
  //             value={unitData.unit_size}
  //             onChange={handleChange}
  //             placeholder="Unit Area"
  //             className="p-3 border rounded-lg w-full"
  //             required
  //           />
  //         </div>

  //         {/* Total Units */}
  //         <div>
  //           <label className="block text-gray-700 font-medium mb-1">Total Units</label>
  //           <input
  //             type="number"
  //             name="total_units"
  //             value={unitData.total_units}
  //             onChange={handleChange}
  //             placeholder="Total Units"
  //             className="p-3 border rounded-lg w-full"
  //             required
  //           />
  //         </div>

  //         {/* Base Price */}
  //         <div>
  //           <label className="block text-gray-700 font-medium mb-1">Base Price</label>
  //           <input
  //             type="number"
  //             name="base_price"
  //             value={unitData.base_price}
  //             onChange={handleChange}
  //             placeholder="Base Price"
  //             className="p-3 border rounded-lg w-full"
  //             required
  //           />
  //         </div>

  //         {/* Submit Button */}
  //         <div className="mt-4">
  //           <button
  //             type="submit"
  //             className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition shadow-md"
  //           >
  //             Add Unit
  //           </button>
  //         </div>
  //       </div>
  //     </form>
  //   </div>
  // </div>
)}

      
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
        </div>
      </div>
    </>
  );
};

export default UnitDetailDash;
