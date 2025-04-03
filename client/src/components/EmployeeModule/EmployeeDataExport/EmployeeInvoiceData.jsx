import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import { useSelector } from "react-redux";
import ReactPaginate from "react-paginate";
import * as XLSX from "xlsx";
import styled from "styled-components";

const EmployeeInvoiceData = () => {
  const [invoices, setInvoices] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage] = useState(10);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const EmpId = useSelector((state) => state.auth.user);
  const token = EmpId?.token;

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await axios.get(
          `https://crmdemo.vimubds5.a2hosted.com/api/get-employee-invoice/${EmpId.id}`,
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
          }}
        );
        setInvoices(response.data);
      } catch (error) {
        console.error("Error fetching invoices:", error);
      }
    };

    fetchInvoices();
  }, [EmpId]);

  // Filter Invoices based on Date Range
  const filteredInvoices = invoices.filter((invoice) => {
    const createdDate = moment(invoice.created_date, "YYYY-MM-DD");
    const isInDateRange =
      (!startDate || createdDate.isSameOrAfter(startDate)) &&
      (!endDate || createdDate.isSameOrBefore(endDate));
    return isInDateRange;
  });

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  const offset = currentPage * itemsPerPage;
  const currentInvoices = filteredInvoices.slice(offset, offset + itemsPerPage);
  const pageCount = Math.ceil(filteredInvoices.length / itemsPerPage);

  // Excel Export Function
  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredInvoices);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Invoices");
    XLSX.writeFile(workbook, "InvoiceData.xlsx");
  };

  return (
    <Wrapper>
      <div className="container mx-auto px-4">
        <div className="container mx-auto mt-4">
          {/* Filter Section */}
          <div className="flex space-x-1 mb-4 sm:flex-row flex-col">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border p-2"
            />
            <div className="p-2">
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
                className=" text-white px-4 py-2 rounded bg-blue-500 hover:bg-blue-700"
              >
                Download Excel
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-y-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr className="bg-gray-100 border-b">
                  <th className="border border-gray-200 px-4 py-2">ID</th>
                  <th className="border border-gray-200 px-4 py-2">
                    Invoice Name
                  </th>
                  <th className="border border-gray-200 px-4 py-2">
                    Invoice Number
                  </th>
                  <th className="border border-gray-200 px-4 py-2">
                    Created Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentInvoices.map((invoice, index) => (
                  <tr key={invoice.invoice_id} className="border-b">
                    <td className="border border-gray-200 px-4 py-2">
                      {offset + index + 1}
                    </td>
                    <td className="border border-gray-200 px-4 py-2">
                      {invoice.invoice_name}
                    </td>
                    <td className="border border-gray-200 px-4 py-2">
                      {invoice.invoice_no}
                    </td>
                    <td className="border border-gray-200 px-4 py-2">
                      {moment(invoice.created_date).format("DD/MM/YYYY")}
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
              containerClassName={"pagination flex justify-center mt-4"}
              pageClassName={"page-item"}
              pageLinkClassName={
                "page-link  border border-gray-300 rounded-md shadow-sm px-4 py-2 mx-1 "
              }
              previousClassName={"page-item"}
              previousLinkClassName={
                "page-link  border border-gray-300 rounded-md shadow-sm px-4 py-2 mx-1 "
              }
              nextClassName={"page-item"}
              nextLinkClassName={
                "page-link  border border-gray-300 rounded-md shadow-sm px-4 py-2 mx-1 "
              }
              breakClassName={"page-item"}
              breakLinkClassName={
                "page-link  border border-gray-300 rounded-md shadow-sm px-4 py-2 mx-1 "
              }
              activeClassName={"active  hover:bg-blue-700 "}
            />
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

export default EmployeeInvoiceData;
const Wrapper = styled.div`
  .respo {
    @media screen and (max-width: 768px) {
      margin-top: 1rem;
    }
  }
`;
