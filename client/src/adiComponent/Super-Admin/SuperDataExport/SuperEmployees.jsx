import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import * as XLSX from "xlsx";
import ReactPaginate from "react-paginate"; // Import ReactPaginate
// import Sider from "../Sider";


import { useSelector } from "react-redux";
import Header from './../../../pages/Quotation/Header';

function SuperEmployees() {
  const [employee, setEmployee] = useState([]);
  const [filteredEmployee, setFilteredEmployee] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const leadsPerPage = 6; // Default leads per page
  const superadminuser = useSelector((state) => state.auth.user);
  const token = superadminuser.token;
  useEffect(() => {
    fetchEmployees();
  }, []);
  

  const fetchEmployees = async () => {
    try {
      const response = await axios.get("https://crmdemo.vimubds5.a2hosted.com/api/employee-super-admin",
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }});
      setEmployee(response.data);
      setFilteredEmployee(response.data);
    } catch (error) {
      console.error("Error fetching employee:", error);
    }
  };

  useEffect(() => {
    if (startDate && endDate) {
      const filtered = employee.filter((employees) => {
        const createdTime = moment(employees.createdTime, "YYYY-MM-DD");
        return createdTime.isBetween(startDate, endDate, undefined, "[]");
      });
      setFilteredEmployee(filtered);
    } else {
      setFilteredEmployee(employee);
    }
  }, [startDate, endDate, employee]);



  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredEmployee);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "employee");
    XLSX.writeFile(workbook, "employeeData.xlsx");
  };

  // Pagination logic
   // Calculate total number of pages
   const pageCount = Math.ceil(filteredEmployee.length / leadsPerPage);

   // Pagination logic
   const indexOfLastLead = (currentPage + 1) * leadsPerPage;
   const indexOfFirstLead = indexOfLastLead - leadsPerPage;
   const currentItems = filteredEmployee.slice(indexOfFirstLead, indexOfLastLead);
   
   const handlePageClick = (data) => {
     setCurrentPage(data.selected);
     console.log("change current page ", data.selected);
   };
  return (
    <>
      <Header />
      {/* <Sider /> */}
      <div className="container 2xl:w-[95%]">
        <h1 className="text-2xl text-center mt-[2rem] font-medium">
          Employee Data
        </h1>
        <div className="mx-auto h-[3px] w-16 bg-[#34495E] my-3"></div>

        {/* Date Filter */}
        <div className="flex  mb-4 sm:flex-row flex-col gap-2">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border p-1"
          />
          <div className="p-1">
            <p>to</p>
          </div>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border p-1"
          />
          <div className="respo  ">
            <button
              onClick={downloadExcel}
              className="bg-blue-500 text-white font-medium px-4 py-2 rounded hover:bg-blue-700"
            >
              Download Excel
            </button>
          </div>
        </div>

        {/* Employee Table */}
        <div className="overflow-x-auto mt-4">
          <table className="min-w-full bg-white border">
            <thead>
              <tr>
                <th className="px-6 py-3 border-b-2 border-gray-300">S.no</th>
                <th className="px-6 py-3 border-b-2 border-gray-300">Employees Number</th>
                <th className="px-6 py-3 border-b-2 border-gray-300">Name</th>
                <th className="px-6 py-3 border-b-2 border-gray-300">Email Id</th>
                <th className="px-6 py-3 border-b-2 border-gray-300">Position</th>
                <th className="px-6 py-3 border-b-2 border-gray-300">Phone</th>
                <th className="px-6 py-3 border-b-2 border-gray-300">Created Date</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((employees, index) => (
                <tr key={employees.id} className={index % 2 === 0 ? "bg-gray-100" : ""}>
                  <td className="px-6 py-4 border-b border-gray-200 text-gray-800">{index + 1}</td>
                  <td className="px-6 py-4 border-b border-gray-200 text-gray-800">{employees.employeeId}</td>
                  <td className="px-6 py-4 border-b border-gray-200 text-gray-800">{employees.name}</td>
                  <td className="px-6 py-4 border-b border-gray-200 text-gray-800">{employees.email}</td>
                  <td className="px-6 py-4 border-b border-gray-200 text-gray-800">{employees.position}</td>
                  <td className="px-6 py-4 border-b border-gray-200 text-gray-800">{employees.phone}</td>
                  <td className="px-6 py-4 border-b border-gray-200 text-gray-800">{moment(employees.createdTime).format("DD MMM YYYY").toUpperCase()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
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
    </>
  );
}

export default SuperEmployees;


