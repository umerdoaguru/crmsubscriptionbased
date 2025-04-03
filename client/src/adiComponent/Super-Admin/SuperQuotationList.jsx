import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import { useSelector } from "react-redux";
import ReactPaginate from "react-paginate";
import SuperAdminSider from "./SuperAdminSider";
import MainHeader from "../../components/MainHeader";


const SuperQuotationList = () => {
  const [quotations, setQuotations] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage] = useState(10); // Number of items per page
  const [filterText, setFilterText] = useState("");
  const [sortAsc, setSortAsc] = useState(true);
  const navigate = useNavigate()
  const superadminuser = useSelector((state) => state.auth.user);
  const token = superadminuser.token;
  useEffect(() => {
    const fetchQuotations = async () => {
      try {
        const response = await axios.get(
          `https://crmdemo.vimubds5.a2hosted.com/api/quotation-data-super-admin`,
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
          }}
        );
        setQuotations(response.data);
        console.log(quotations);
      } catch (error) {
        console.error("Error fetching quotations:", error);
      }
    };

    fetchQuotations();
  }, []);


  const handleFilterChange = (event) => {
    let value = event.target.value;
    if(value === ' ') return;
    
    setFilterText(event.target.value);
  };

  const handleSortChange = () => {
    setSortAsc(!sortAsc);
  };

  const filteredQuotations = quotations.filter((quotation) =>
    quotation.customer_name.toLowerCase().includes(filterText.toLowerCase())
  );

  const pageCount = Math.ceil(filteredQuotations.length / itemsPerPage);

  // Pagination logic
  const indexOfLastLead = (currentPage + 1) * itemsPerPage;
  const indexOfFirstLead = indexOfLastLead - itemsPerPage;
  const currentQuotations = filteredQuotations.slice(indexOfFirstLead, indexOfLastLead);
  
  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
    console.log("change current page ", data.selected);
  };

  // const handleStatusChange = (e, index) => {
  //   const updatedQuotations = [...currentQuotations];
  //   updatedQuotations[index].status = e.target.value;
  //   setQuotations([...quotations]); // Update the full list
  // };

  const handleStatusChange = async (e, index, id) => {
    const newStatus = e.target.value;
    const updatedQuotations = [...currentQuotations];
    updatedQuotations[index].status = newStatus;
    setQuotations([...quotations]);

    try {
      // API call to update status in the backend
      await axios.post(`https://crmdemo.vimubds5.a2hosted.com/api/update-quotation-status`, {
        id: id, // Send the quotation ID
        status: newStatus, // Send the updated status
      });

      // Update the state after successful status update
      setQuotations(updatedQuotations);
      console.log("Status updated successfully");
    } catch (error) {
      console.error("Error updating status:", error);
      // Handle the error if the update fails
    }
  };

  // Function to dynamically apply status classes
  const getStatusClasses = (status) => {
    if (status === "Pending") {
      return "bg-yellow-600 text-white";
    } else if (status === "Approved") {
      return "bg-green-800 text-white";
    } else if (status === "Not Approved") {
      return "bg-red-700 text-white";
    } else {
      return "bg-gray-200 text-gray-700";
    }
  };

  return (
    <>
      <MainHeader />
      <SuperAdminSider />
      <div className="container 2xl:w-[93%] 2xl:ml-32">
      <div className="flex flex-col lg:flex-row">
        
        

        <div className="flex-grow p-4 mt-14 sm:ml-0">
          
       
         
          <center className="text-2xl text-center  font-medium">
            Total Quotations
          </center>
          <center className="mx-auto h-[3px] w-16 bg-[#34495E] my-3"></center>

          <div className="flex justify-between mb-4">
            <input
              type="text"
              placeholder="Filter by Quotation Name"
              value={filterText}
              onChange={handleFilterChange}
              className="form-input border-gray-300 rounded-md shadow-sm w-full max-w-md"
            />
          </div>

          <div className="overflow-x-auto rounded-lg shadow-md">
            <table className="min-w-full bg-white">
              <thead>
                <tr className="text-sm font-semibold text-left text-gray-600 uppercase bg-gray-200">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Employee Id
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Employee Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quotation Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
              {currentQuotations.length > 0 ? (
                currentQuotations.map((quotation, index) => (
                  <tr key={quotation.quotation_id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      { index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {quotation.employeeId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {quotation.employee_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {quotation.customer_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {moment(quotation.created_date).format("DD MMM YYYY").toUpperCase()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link
                        to={`/super-admin-view-quotation/${quotation.id}`}
                      >
                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded m-1">
                          View
                        </button>
                      </Link>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        className={`border border-gray-300 py-1 px-3 rounded  ${getStatusClasses(
                          quotation.status || "Pending"
                        )}`}
                        value={quotation.status || "Pending"}
                        onChange={(e) =>
                          handleStatusChange(e, index, quotation.id)
                        } // Pass quotation_id here
                      >
                        <option value="Pending">Pending</option>
                        <option value="Approved">Approved</option>
                        <option value="Not Approved">Not Approved</option>
                      </select>
                    </td>
                  </tr>
               ) )
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
          <div className="mt-2 mb-2 flex justify-center">
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

export default SuperQuotationList;
