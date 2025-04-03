import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import { useSelector } from "react-redux";
import ReactPaginate from "react-paginate";


import cogoToast from "cogo-toast";

import EmployeeeSider from './../EmployeeSider';
import MainHeader from './../../MainHeader';

const MainQuoatationPage = () => {
  const [quotations, setQuotations] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage] = useState(10); // Number of items per page
  const [filterText, setFilterText] = useState("");
  const [sortAsc, setSortAsc] = useState(true);
  const [render, setRender] = useState(false);
  const { id } = useParams();

  const EmpId = useSelector((state) => state.auth.user);

  const token = EmpId?.token;

  useEffect(() => {
    fetchQuotations();
  }, [id, render]);

  const fetchQuotations = async () => {
    try {
      const response = await axios.get(
        `https://crmdemo.vimubds5.a2hosted.com/api/quotation-data`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }}
      );
      setQuotations(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching quotations:", error);
    }
  };

  console.log(quotations);
  

  // const handleDelete = async (id) => {
  //   const isConfirmed = window.confirm(
  //     "Are you sure you want to delete this quotation?"
  //   );
  //   if (isConfirmed) {
  //     try {
  //       const response = await axios.delete(
  //         `https://crmdemo.vimubds5.a2hosted.com/api/quotation/${id}`
  //       );
  //       if (response.status === 200) {
  //         console.log("Quotation deleted successfully");
  //       }
  //       console.log(response);
  //       setRender(!render);
  //     } catch (error) {
  //       console.error("Error deleting quotation:", error);
  //     }
  //   }
  // };

  const handleDelete = async (quotation) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this quotation?"
    );
    if (isConfirmed) {
      try {
        // Delete the quotation
        const response = await axios.delete(
          `https://crmdemo.vimubds5.a2hosted.com/api/quotation/${quotation.id}`
        );
        
        if (response.status === 200) {
          console.log("Quotation deleted successfully");
  
          // After deletion, update the leads table status
          try {
            const updateResponse = await axios.put(
              `https://crmdemo.vimubds5.a2hosted.com/api/updateOnlyQuotationStatus/${quotation.lead_id}`,
              { quotation: "not created" }
            );
  
            if (updateResponse.status === 200) {
              console.log("Status updated successfully:", updateResponse.data);
              cogoToast.success("Quotation deleted and status updated successfully");
            } else {
              console.error("Error updating status:", updateResponse.data);
              cogoToast.error("Failed to update the quotation status.");
            }
          } catch (error) {
            console.error("Request failed while updating status:", error);
            cogoToast.error("Failed to update the quotation status.");
          }
        }
        setRender(!render);
      } catch (error) {
        console.error("Error deleting quotation:", error);
      }
    }
  };
  

  const handleCopyQuotation = async (quotationId) => {
    try {
      const response = await axios.post(
        `https://crmdemo.vimubds5.a2hosted.com/api/copy-quotation/${quotationId}`
      );
      setRender(!render);
    } catch (error) {
      console.error("Error copying quotation:", error);
    }
  };



  const handleFilterChange = (event) => {
    setFilterText(event.target.value);
  };

  const handleSortChange = () => {
    setSortAsc(!sortAsc);
  };

  const filteredQuotations = quotations.filter(
    (quotation) =>
      quotation.customer_name &&
      quotation.customer_name.toLowerCase().includes(filterText.toLowerCase())
  );

  console.log('filteredQuotations', filteredQuotations);
  

  const pageCount = Math.ceil(filteredQuotations.length / itemsPerPage);

  // Pagination logic
  const indexOfLastLead = (currentPage + 1) * itemsPerPage;
  const indexOfFirstLead = indexOfLastLead - itemsPerPage;
  const currentQuotations= filteredQuotations.slice(indexOfFirstLead, indexOfLastLead);
  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
    console.log("change current page ", data.selected);
  };
  return (
    <>
      <MainHeader />
      <EmployeeeSider />
      <div className="container mt-4 2xl:w-[91%] 2xl:ml-36 ">
        <div className="w-full px-2 mx-auto p-4 ">
          <div className="w-full px-2 mt-4 ">
            <h2 className="text-2xl font-bold mb-4 text-center">
              All Leads Quotation
            </h2>
            <div className="overflow-x-auto rounded-lg shadow-md">
              <table className="min-w-full divide-y divide-gray-200 border border-gray-300">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quotation Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created By 
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quotation Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                {currentQuotations.length > 0 ? ( 
                  currentQuotations.map((quotation, index) => (
                    <tr key={quotation.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        { index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {quotation.customer_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {quotation.employee_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                      
                        {moment(quotation.created_date).format("DD MMM YYYY").toUpperCase()}

                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {quotation.status}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Link to={`/final-quotationBy-emp/${quotation.id}`}>
                          <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-1 px-3 rounded m-1">
                            View
                          </button>
                        </Link>
                        <button
                          className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded m-1"
                          onClick={() => handleDelete(quotation)}
                        >
                          Delete
                        </button>
                        <Link
                          to={`/update-quotation-name/${quotation.id}`}
                        >
                          <button className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-1 px-3 rounded m-1">
                            Edit
                          </button>
                        </Link>
                        {/* <button
                        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-3 rounded m-1"
                        onClick={() =>
                          handleCopyQuotation(quotation.quotation_id)
                        }
                      >
                        Copy
                      </button> */}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={11} className="py-4 text-center">
                      No data found
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
    </>
  );
};

export default MainQuoatationPage;
