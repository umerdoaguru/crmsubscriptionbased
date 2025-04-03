import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import { useSelector } from "react-redux";

import cogoToast from "cogo-toast";
import ReactPaginate from "react-paginate";

const SuperUpdateForm = ({setShowUpdateForm,id}) => {
  const [form, setForm] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage] = useState(4); // Number of items per page
  const [filterText, setFilterText] = useState("");
  const [sortAsc, setSortAsc] = useState(true);
  const [render, setRender] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchFormData();
  }, [id, render]);

  const fetchFormData = async () => {
    try {
      const response = await axios.get(
        `https://crmdemo.vimubds5.a2hosted.com/api/forms/${id}`
      );
      setForm(response.data.reverse());
      console.log(response);
    } catch (error) {
      console.error("Error fetching form:", error);
    }
  };


  const handleDelete = async (form) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this Form?"
    );
    if (isConfirmed) {
      try {
        const response = await axios.delete(
          `https://crmdemo.vimubds5.a2hosted.com/api/deleteform/${form.id}`
        );
        if (response.status === 200) {
          console.log("form deleted successfully");

        }
       
        console.log(response);
        setRender(!render);
      } catch (error) {
        console.error("Error deleting Form:", error);
      }
    }
  };
 // Function to send the PUT request to update the Form data
 const openModal = (data) => {
    setModalData(data);
    console.log(data);
    
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

  // Function to send the PUT request to update the Form data
  const updateFrom = async () => {
    try {
      const response = await axios.put(`https://crmdemo.vimubds5.a2hosted.com/api/updateform`, modalData);
      if (response.status === 200) {
        cogoToast.success("Form updated successfully!");
        setRender(!render); // Refresh the list after updating
        closeModal(); // Close the modal
      }
    } catch (error) {
      console.error("Error updating Form:", error);
    }
  };


  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };



  const filteredForm = form.filter((form) =>
    form.form_name.toLowerCase().includes(filterText.toLowerCase())
  );

  const offset = currentPage * itemsPerPage;
  const currentform = filteredForm.slice(
    offset,
    offset + itemsPerPage
  );
  const pageCount = Math.ceil(filteredForm.length / itemsPerPage);

  const handleBackClick = () => {
    navigate(-1); // -1 navigates to the previous page in history
  };

  return (
    <>
    
      <div className="container  2xl:w-[91%] 2xl:ml-36">
   
        <div className="w-full px-2 mx-auto p-4">
          <div className="w-full px-2">
            <h2 className="text-2xl font-bold mb-4 text-center">
              All  Form
            </h2>
            <div className="">
              <table className="min-w-full divide-y divide-gray-200 border border-gray-300">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      S.no
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                     Form Id 
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                     Form Name
                    </th>
                 
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentform.map((form, index) => (
                    <tr key={form.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {offset + index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {form.form_id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {form.form_name}
                      </td>
                   
                      <td className="px-6 py-4 whitespace-nowrap">
                     
                          <button className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-1 px-3 rounded m-1"
                          onClick={() => openModal(form)}
                          >
                            Edit
                          </button>
                    
                        <button
                          className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded m-1"
                          onClick={() => handleDelete(form)}
                        >
                          Delete
                        </button>
                       
                     
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="2xl:w-[89%] mt-4 mb-3 flex justify-center">
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

              <button
            type="button"
            onClick={() => setShowUpdateForm(false)}  // Hide form on cancel
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 mt-3 rounded"
          >
            Cancel
          </button>


         
                


                    {/* Modal for Editing Visit Data */}
                    {isModalOpen && (
  <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
    <div className="bg-white p-6 rounded-lg shadow-lg w-[500px]">
      <h2 className="text-xl mb-4 font-bold">Edit Form</h2>
      <form>
        <div className="mb-4">
          <label className="block text-gray-700">Form ID:</label>
          <input
            type="number"
            name="form_id"
            value={modalData.form_id || ""}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded"
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700">Form Name:</label>
          <input
            type="text"
            name="form_name"
            value={modalData.form_name || ""}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded"
          />
        </div>

     

        <div className="flex justify-end">
          <button
            type="button"
            onClick={updateFrom}
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

export default SuperUpdateForm;
