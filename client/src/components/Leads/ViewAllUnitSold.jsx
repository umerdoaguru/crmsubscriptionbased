import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import { useSelector } from "react-redux";
import ReactPaginate from "react-paginate";
import MainHeader from "../MainHeader";
import EmployeeeSider from "../EmployeeModule/EmployeeSider";
import cogoToast from "cogo-toast";

const ViewAllUnitSold = () => {
  const [employeeunitsold, setEmployeeUnitSold] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage] = useState(10); // Number of items per page
  const [filterText, setFilterText] = useState("");
  const [sortAsc, setSortAsc] = useState(true);
  const [render, setRender] = useState(false);
  const [previousUnit, setPreviousUnit] = useState('');
  const { id } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [unitdata, setUnitData] = useState([]);
  const navigate = useNavigate();
  const EmpId = useSelector((state) => state.auth.user);

  const token = EmpId?.token;
  
  useEffect(() => {
    fetchEmployeeUnitSold();
 
  }, [id, render]);

 
  useEffect(() => {
    if (employeeunitsold.length > 0) {
        fetchUnitdata();
    }
}, [employeeunitsold]); // Runs only when employeeunitsold updates


  const fetchEmployeeUnitSold = async () => {
    try {
      const response = await axios.get(
        `https://crmdemo.vimubds5.a2hosted.com/api/unit-sold-lead-id/${id}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }}
        
      );
      setEmployeeUnitSold(response.data);
      console.log(response);

    } catch (error) {
      console.error("Error fetching visit:", error);
    }
  };

  
  const fetchUnitdata = async () => {
    
    try {
      const response = await axios.get(`https://crmdemo.vimubds5.a2hosted.com/api/unit-data/${employeeunitsold[0].unit_id}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }});
      setUnitData(response.data);
      console.log(unitdata);
      
    } catch (error) {
      console.error("Error fetching Unit Data:", error);
    }
  };


  const handleDelete = async (unitsold) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this Unit Sold?"
    );
    if (isConfirmed) {
      try {
        const response = await axios.delete(
          `https://crmdemo.vimubds5.a2hosted.com/api/unit-sold/${unitsold.id}`
        );
        if (response.status === 200) {
          console.log("Unit Sold deleted successfully");
          cogoToast.success("")
          const putResponse = await axios.put(
            `https://crmdemo.vimubds5.a2hosted.com/api/unit-data/${unitsold.unit_no}`,
            { unit_status: "pending" }
          );
    
          if (putResponse.status === 200) {
            console.log("Unit Status updated successfully:", putResponse.data);
          } else {
            console.error("Error updating Unit Status:", putResponse.data);
            cogoToast.error("Failed to update the lead Unit Status.");
          }  
          const putResponseUnit = await axios.put(
            `https://crmdemo.vimubds5.a2hosted.com/api/updateOnlyUnitStatus/${unitsold.lead_id}`,
            { unit_number: "pending",unit_status: "pending"}
          );
    
          if (putResponseUnit.status === 200) {
            console.log("Unit of Lead Status updated successfully:", putResponseUnit.data);
          } else {
            console.error("Error updating Unit Status:", putResponseUnit.data);
            cogoToast.error("Failed to update the lead Unit Status.");
          }

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
    console.log(data);
    setPreviousUnit(data.unit_no)
    
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
      const response = await axios.put(`https://crmdemo.vimubds5.a2hosted.com/api/unit-sold`, modalData);
      if (response.status === 200) {
        cogoToast.success("Unit Sold updated successfully!");

        const putResponseUnit = await axios.put(
          `https://crmdemo.vimubds5.a2hosted.com/api/updateOnlyUnitStatus/${modalData.lead_id}`,
          { unit_number: modalData.unit_no,unit_status: modalData.unit_status }
        );
  
        if (putResponseUnit.status === 200) {
          console.log("Unit of Lead Status updated successfully:", putResponseUnit.data);
        } else {
          console.error("Error updating Unit Status:", putResponseUnit.data);
          cogoToast.error("Failed to update the lead Unit Status.");
        }
        const putResponseUnitdelete = await axios.put(
          `https://crmdemo.vimubds5.a2hosted.com/api/unit-data/${previousUnit}`,
          { unit_status: "pending" }
        );
  
        if ( putResponseUnitdelete .status === 200) {
          console.log("Unit Status updated successfully:",  putResponseUnitdelete .data);
        } else {
          console.error("Error updating Unit Status:",  putResponseUnitdelete .data);
          cogoToast.error("Failed to update the lead Unit Status.");
        }  


        const putResponse = await axios.put(
          `https://crmdemo.vimubds5.a2hosted.com/api/unit-data/${modalData.unit_no}`,
          { unit_status: modalData.unit_status }
        );
  
        if (putResponse.status === 200) {
          console.log("Unit Status updated successfully:", putResponse.data);
        } else {
          console.error("Error updating Unit Status:", putResponse.data);
          cogoToast.error("Failed to update the lead Unit Status.");
        }


        setRender(!render); // Refresh the list after updating
        closeModal(); // Close the modal
        setPreviousUnit('');
      }
    } catch (error) {
      console.error("Error updating visit:", error);
    }
  };


  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };



  const filteredEmployeeUnitSold = employeeunitsold.filter((unitsold) =>
    unitsold.name.toLowerCase().includes(filterText.toLowerCase())
  );

  const offset = currentPage * itemsPerPage;
  const currentemployeeunitsold = filteredEmployeeUnitSold.slice(
    offset,
    offset + itemsPerPage
  );
  const pageCount = Math.ceil(filteredEmployeeUnitSold.length / itemsPerPage);

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
                    Unit No
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Project Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Unit Status
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
                  {currentemployeeunitsold.map((unitsold, index) => (
                    <tr key={unitsold.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {offset + index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {unitsold.unit_no}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {unitsold.project_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {unitsold.unit_status}
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                       {moment(unitsold.date).format("DD MMM YYYY").toUpperCase()}
                      </td>
                    
                      <td className="px-6 py-4 whitespace-nowrap">
                     
                          <button className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-1 px-3 rounded m-1"
                          onClick={() => openModal(unitsold)}
                          >
                            Edit
                          </button>
                    
                        <button
                          className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded m-1"
                          onClick={() => handleDelete(unitsold)}
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




              

                    {/* Modal for Editing Follow Up Data */}
                    {isModalOpen && (
  <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
    <div className="bg-white p-6 rounded-lg shadow-lg w-[500px]">
      <h2 className="text-xl mb-4 font-bold">Edit Unit Sold</h2>
      <form>
    
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
          <label className="block text-gray-700">Unit Number:</label>
         
            <select
        name="unit_no"
        value={modalData.unit_no || ""}
        onChange={handleInputChange}
        className="border rounded-2xl p-2 w-full"
    >
        <option value="">Select Unit Number</option>
        {unitdata.map((unit) => (
            <option
                key={unit.id}
                value={unit.unit_number}
                disabled={unit.status === "sold"} // Disable sold units
            >
                {unit.status === "sold" ? `Sold ${unit.unit_number}` : `Unit ${unit.unit_number} (Available)`}
            </option>
        ))}
    </select>
        </div>
      

        <div className="mb-4">
          <label className="block text-gray-700">Project Name</label>
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
          <label className="block text-gray-700">Unit Status</label>
          <input
            type="text"
            name="unit_status"
            value={modalData.unit_status || ""}
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

export default ViewAllUnitSold;
