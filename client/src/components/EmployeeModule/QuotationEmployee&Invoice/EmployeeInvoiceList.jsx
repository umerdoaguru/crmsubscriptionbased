import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import { useSelector } from "react-redux";
import ReactPaginate from "react-paginate";

const EmployeeInvoiceList = () => {
  const [invoices, setInvoices] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage] = useState(10); // Number of items per page
  const [filterText, setFilterText] = useState("");
  const EmpId = useSelector((state) => state.auth.user.id);
  const location = useLocation();

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await axios.get(
          `https://crmdemo.vimubds5.a2hosted.com/api/get-employee-invoice/${EmpId}`
        );
        setInvoices(response.data);
        console.log(response);
      } catch (error) {
        console.error("Error fetching invoices:", error);
      }
    };

    fetchInvoices();
  }, [EmpId]);

  const handleDelete = async (id) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this invoice?"
    );
    if (isConfirmed) {
      try {
        const response = await axios.delete(
          `https://crmdemo.vimubds5.a2hosted.com/api/invoice/${id}`
        );
        if (response.status === 200) {
          console.log("Invoice deleted successfully");
          window.location.reload();
        }
      } catch (error) {
        console.error("Error deleting invoice:", error);
      }
    }
  };

  const handleCopyInvoice = async (invoiceId) => {
    try {
      const response = await axios.post(
        `https://crmdemo.vimubds5.a2hosted.com/api/copy-invoice/${invoiceId}`
      );
      console.log(response.data.message);
      window.location.reload();
    } catch (error) {
      console.error("Error copying invoice:", error);
    }
  };

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  const handleFilterChange = (event) => {
    setFilterText(event.target.value);
  };

  const filteredInvoices = invoices.filter((invoice) =>
    invoice.invoice_name.toLowerCase().includes(filterText.toLowerCase())
  );

  const offset = currentPage * itemsPerPage;
  const currentInvoices = filteredInvoices.slice(offset, offset + itemsPerPage);
  const pageCount = Math.ceil(filteredInvoices.length / itemsPerPage);

  return (
    <>
      <div className="container mx-auto px-4">
        {location.pathname.endsWith("invoicelist") && (
          <Link to="/quotation-section" className="text-white">
            <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-2 flex items-center">
              <i className="bi bi-arrow-return-left mr-1"></i>Back
            </button>
          </Link>
        )}

        <div className="container mx-auto mt-4">
          <h2 className="text-2xl font-bold mb-4">List of Invoices</h2>
          <div className="flex justify-between mb-2">
            <input
              type="text"
              placeholder="Filter by Invoice Name"
              value={filterText}
              onChange={handleFilterChange}
              className="form-control w-1/2 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
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
                  <th className="border border-gray-200 px-4 py-2">Action</th>
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
                    <td className="border border-gray-200 px-4 py-2 flex flex-wrap space-x-2">
                      <Link to={`/final-invoice/${invoice.invoice_id}`}>
                        <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-1 px-2 rounded m-1">
                          View
                        </button>
                      </Link>
                      <Link to={`/update-invoice-name/${invoice.invoice_id}`}>
                        <button className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-1 px-2 rounded m-1">
                          Edit
                        </button>
                      </Link>
                      <button
                        className="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-2 rounded m-1"
                        onClick={() => handleDelete(invoice.invoice_id)}
                      >
                        Delete
                      </button>
                      {/* <button
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded m-1"
                        onClick={() => handleCopyInvoice(invoice.invoice_id)}
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
              containerClassName={"pagination flex justify-center mt-4"}
              pageClassName={"page-item"}
              pageLinkClassName={
                "page-link  border border-gray-300 rounded-md shadow-sm px-4 py-2 mx-1 hover:bg-gray-200"
              }
              previousClassName={"page-item"}
              previousLinkClassName={
                "page-link  border border-gray-300 rounded-md shadow-sm px-4 py-2 mx-1 hover:bg-gray-200"
              }
              nextClassName={"page-item"}
              nextLinkClassName={
                "page-link  border border-gray-300 rounded-md shadow-sm px-4 py-2 mx-1 hover:bg-gray-200"
              }
              breakClassName={"page-item"}
              breakLinkClassName={
                "page-link  border border-gray-300 rounded-md shadow-sm px-4 py-2 mx-1 hover:bg-gray-200"
              }
              activeClassName={"active "}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default EmployeeInvoiceList;
