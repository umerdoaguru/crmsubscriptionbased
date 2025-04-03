import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import { useSelector } from "react-redux";
import ReactPaginate from "react-paginate";

import MainHeader from '../MainHeader';
import Sider from '../Sider';
import { IoIosArrowBack } from "react-icons/io";

const Admin_view_quotations = () => {
  const [quotations, setQuotations] = useState([]);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage] = useState(10); // Number of items per page
  const [filterText, setFilterText] = useState("");
  const [sortAsc, setSortAsc] = useState(true);
  const [render, setRender] = useState(false);
  const { id } = useParams();
  const adminuser = useSelector((state) => state.auth.user);
  const token = adminuser.token;
  useEffect(() => {
    fetchQuotations();
  }, [id, render]);

  const fetchQuotations = async () => {
    try {
      const response = await axios.get(
        `https://crmdemo.vimubds5.a2hosted.com/api/get-quotation-byLead/${id}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }}
      );
      setQuotations(response.data);
      console.log(response);
    } catch (error) {
      console.error("Error fetching quotations:", error);
    }
  };

  const handleDelete = async (id) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this quotation?"
    );
    if (isConfirmed) {
      try {
        const response = await axios.delete(
          `https://crmdemo.vimubds5.a2hosted.com/api/quotation/${id}`
        );
        if (response.status === 200) {
          console.log("Quotation deleted successfully");
        }
        console.log(response);
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

  const offset = currentPage * itemsPerPage;
  const currentQuotations = filteredQuotations.slice(
    offset,
    offset + itemsPerPage
  );
  const pageCount = Math.ceil(filteredQuotations.length / itemsPerPage);


  return (
    <>
      <MainHeader />
      <Sider />
      <div className="container mt-4 2xl:w-[91%] 2xl:ml-36">
        <div className="w-full px-2 mx-auto p-4">
        <button
              onClick={() => navigate(-1)}
            className="bg-blue-500 text-white mt-5 px-4 py-2 rounded"
          >
            Go Back
          </button>
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
                    <tr key={quotation.quotation_id}>
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
                        <Link to={`/admin_quotationview/${quotation.id}`}>
                          <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-1 px-3 rounded m-1">
                            View
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
              <ReactPaginate
                previousLabel={"previous"}
                nextLabel={"next"}
                breakLabel={"..."}
                pageCount={pageCount}
forcePage={currentPage}
                marginPagesDisplayed={2}
                pageRangeDisplayed={5}
                onPageChange={handlePageClick}
                containerClassName={"flex justify-center space-x-2 mt-4"}
                pageClassName={"bg-white border border-gray-300 rounded-md"}
                pageLinkClassName={
                  "py-2 px-4 text-sm text-gray-700 hover:bg-gray-200"
                }
                previousClassName={"bg-white border border-gray-300 rounded-md"}
                previousLinkClassName={
                  "py-2 px-4 text-sm text-gray-700 hover:bg-gray-200"
                }
                nextClassName={"bg-white border border-gray-300 rounded-md"}
                nextLinkClassName={
                  "py-2 px-4 text-sm text-gray-700 hover:bg-gray-200"
                }
                breakClassName={"bg-white border border-gray-300 rounded-md"}
                breakLinkClassName={
                  "py-2 px-4 text-sm text-gray-700 hover:bg-gray-200"
                }
                activeClassName={"bg-gray-200"}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Admin_view_quotations;
