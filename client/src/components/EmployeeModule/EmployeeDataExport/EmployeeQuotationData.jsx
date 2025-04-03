import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import { useSelector } from "react-redux";
import ReactPaginate from "react-paginate";
import * as XLSX from "xlsx";
import styled from "styled-components";
import MainHeader from "../../MainHeader";
import EmployeeSider from "../EmployeeSider";

const EmployeeQuotationData = () => {
  const [quotations, setQuotations] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage] = useState(10); // Number of items per page
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const EmpId = useSelector((state) => state.auth.user.id);

  useEffect(() => {
    const fetchQuotations = async () => {
      try {
        const response = await axios.get(
          `https://crmdemo.vimubds5.a2hosted.com/api/get-quotation-byEmploye/${EmpId}`
        );
        setQuotations(response.data);
      } catch (error) {
        console.error("Error fetching quotations:", error);
      }
    };

    fetchQuotations();
  }, [EmpId]);

  // Filter Quotations based on Date Range
  const filteredQuotations = quotations.filter((quotation) => {
    const createdDate = moment(quotation.created_date, "YYYY-MM-DD");
    const isInDateRange =
      (!startDate || createdDate.isSameOrAfter(startDate)) &&
      (!endDate || createdDate.isSameOrBefore(endDate));
    return isInDateRange;
  });

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  const offset = currentPage * itemsPerPage;
  const currentQuotations = filteredQuotations.slice(
    offset,
    offset + itemsPerPage
  );
  const pageCount = Math.ceil(filteredQuotations.length / itemsPerPage);

  // Excel Export Function
  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredQuotations);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Quotations");
    XLSX.writeFile(workbook, "QuotationData.xlsx");
  };

  return (
    <>
      {/* <MainHeader /> */}
      <EmployeeSider />
      <Wrapper>
        <div className="container px-2 mx-auto mt-16">
          <div className="w-full px-2 mt-4">
            {/* Filter Section */}
            <div className="flex space-x-1 mb-4 sm:flex-row flex-col">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="border p-2"
              />
              <div className=" p-2">
                <p>to</p>
              </div>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="border p-2"
              />
              <div className="respo mx-2 ">
                <button
                  onClick={downloadExcel}
                  className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded "
                >
                  Download Excel
                </button>
              </div>
            </div>

            {/* Table */}
            <div className=" ">
              <table className="min-w-full bg-white border border-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="bg-gray-100 border-b">ID</th>
                    <th className="bg-gray-100 border-b">Quotation Name</th>
                    <th className="bg-gray-100 border-b">Created Date</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
  {currentQuotations.map((quotation, index) => (
    <tr key={quotation.quotation_id}>
      <td className="border border-gray-200 px-4 py-2">
        {/* Ensure offset is calculated correctly */}
        {offset + index + 1}
      </td>
      <td className="border border-gray-200 px-4 py-2">
        {quotation.quotation_name}
      </td>
      <td className="border border-gray-200 px-4 py-2">
        {moment(quotation.created_date).format("DD/MM/YYYY")}
      </td>
    </tr>
  ))}
</tbody>

              </table>

              {/* Pagination */}
              <ReactPaginate
                previousLabel={"previous"}
                nextLabel={"next"}
                breakLabel={"..."}
                pageCount={pageCount}
forcePage={currentPage}
                marginPagesDisplayed={2}
                pageRangeDisplayed={5}
                onPageChange={handlePageClick}
                containerClassName="pagination-container"
                pageClassName="pagination-page"
                pageLinkClassName="pagination-link"
                previousClassName="pagination-previous"
                previousLinkClassName="pagination-link-previous"
                nextClassName="pagination-next"
                nextLinkClassName="pagination-link-next"
                breakClassName="pagination-break"
                breakLinkClassName="pagination-break-link"
                activeClassName="pagination-active"
              />
            </div>
          </div>
        </div>
      </Wrapper>
    </>
  );
};

export default EmployeeQuotationData;
const Wrapper = styled.div`
  .respo {
    @media screen and (max-width: 768px) {
      margin-top: 1rem;
    }
  }
  
  .pagination-container {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.5rem; // Reduced gap for better spacing
    margin-top: 1.5rem;
  }

  .pagination-page {
    background-color: #ffffff;
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transition: background-color 0.3s, transform 0.2s;
  }

  .pagination-link {
    padding: 0.5rem 1rem; // Increased padding for better click area
    font-size: 0.875rem;
    color: #3b82f6;
    text-decoration: none;
    transition: color 0.3s;

    &:hover {
      color: #2563eb;
    }
  }

  .pagination-previous,
  .pagination-next,
  .pagination-break {
    background-color: #ffffff;
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transition: background-color 0.3s, transform 0.2s;
  }

  .pagination-link-previous,
  .pagination-link-next,
  .pagination-break-link {
    padding: 0.5rem 1rem; // Increased padding for consistency
    font-size: 0.875rem;
    color: #374151;
    transition: background-color 0.3s;

    &:hover {
      background-color: #f3f4f6; // Light gray on hover
      transform: translateY(-1px); // Subtle lift effect
    }
  }

  .pagination-active {
    background-color: #1e50ff;
    color: white;
    border: 1px solid #374151;
    border-radius: 0.375rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }

  .pagination-active .pagination-link {
    color: white !important; // Ensure link inside active page is white
  }
`;
