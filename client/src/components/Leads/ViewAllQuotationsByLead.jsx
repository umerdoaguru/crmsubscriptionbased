import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import { useSelector } from "react-redux";
import ReactPaginate from "react-paginate";
import MainHeader from "../MainHeader";

import cogoToast from "cogo-toast";
import EmployeeeSider from "../EmployeeModule/EmployeeSider";

const EmployeeQuotationList = () => {
  const [quotations, setQuotations] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage] = useState(10); // Number of items per page
  const [filterText, setFilterText] = useState("");
  const [sortAsc, setSortAsc] = useState(true);
  const [render, setRender] = useState(false);
  const { id } = useParams();
const navigate  = useNavigate();
  
const EmpId = useSelector((state) => state.auth.user);

const token = EmpId?.token;
  useEffect(() => {
    fetchQuotations();
  }, [id, render]);

  const fetchQuotations = async () => {
    try {
      const response = await axios.get(
        `http://localhost:9000/api/get-quotation-byLead/${id}`,
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
  //         `http://localhost:9000/api/quotation/${id}`
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
          `http://localhost:9000/api/quotation/${quotation.id}`
        );
        
        if (response.status === 200) {
          console.log("Quotation deleted successfully");
  
          // After deletion, update the leads table status
          try {
            const updateResponse = await axios.put(
              `http://localhost:9000/api/updateOnlyQuotationStatus/${quotation.lead_id}`,
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
        `http://localhost:9000/api/copy-quotation/${quotationId}`
      );
      setRender(!render);
    } catch (error) {
      console.error("Error copying quotation:", error);
    }
  };

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
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
  

  const offset = currentPage * itemsPerPage;
  const currentQuotations = filteredQuotations.slice(
    offset,
    offset + itemsPerPage
  );
  console.log('User Quotation Data :',currentQuotations);
  
  const pageCount = Math.ceil(filteredQuotations.length / itemsPerPage);


  return (
    <>
      <MainHeader />
      <EmployeeeSider />
      <div className="container mt-4 2xl:w-[91%] 2xl:ml-36">
      <div className="mt-[7rem] ">
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
              All Leads Quotation
            </h2>
            <div className="">
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
                  {currentQuotations.map((quotation, index) => (
                    <tr key={quotation.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {offset + index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {quotation.customer_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {quotation.employee_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {moment(quotation.created_date).format("DD/MM/YYYY")}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {quotation.status}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Link to={`/final-quotationBy-emp/${id}/${quotation.id}`}>
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
                  ))}
                </tbody>
              </table>
            
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EmployeeQuotationList;
