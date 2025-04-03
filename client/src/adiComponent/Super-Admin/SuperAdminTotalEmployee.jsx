import axios from 'axios';
import React, { useEffect, useState } from 'react';
import MainHeader from '../../components/MainHeader';
import SuperAdminSider from './SuperAdminSider';
import { useNavigate } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import styled from 'styled-components';
import { useSelector } from 'react-redux';

function SuperAdminTotalEmployee() {
  const [employees, setEmployees] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const employeesPerPage = 7; // Number of employees to display per page
  const navigate = useNavigate();
  const superadminuser = useSelector((state) => state.auth.user);
  const token = superadminuser.token;

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get('https://crmdemo.vimubds5.a2hosted.com/api/getAllEmployees-super-admin',
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }});
      const { employees } = response.data;
      setEmployees(employees || []); // Ensure employees is always an array
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const pageCount = Math.ceil(employees.length / employeesPerPage);

  // Pagination logic
  const indexOfLastLead = (currentPage + 1) * employeesPerPage;
  const indexOfFirstLead = indexOfLastLead - employeesPerPage;
  const currentemployees = employees.slice(indexOfFirstLead, indexOfLastLead);
  
  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
    console.log("change current page ", data.selected);
  };

  const handleEmployeeClick = (employeeId) => {
    navigate(`/super-admin-employee-single/${employeeId}`);
  };

  return (
    <>
      <MainHeader />
      <SuperAdminSider />
      <div className="container mt-[5rem]">
      <div className="mt-[7rem] 2xl:ml-40 ">
          <button
            onClick={() => navigate(-1)}
            className="bg-blue-500 text-white px-3 py-1 max-sm:hidden rounded-lg hover:bg-blue-600 transition-colors"
          >
            Back
          </button>
        </div>
        <h1 className="text-2xl text-center ">Total Employees</h1>
        <div className="mx-auto h-[3px] w-16 bg-[#34495E] my-3"></div>
      </div>

      <div className="overflow-x-auto rounded-lg shadow-md xl:ml-48 mx-12">
        <table className="container bg-white">
          <thead>
            <tr className="text-sm font-semibold text-left text-gray-600 uppercase bg-gray-200">
              <th className="px-4 py-3 sm:px-6">Name</th>
              <th className="px-4 py-3 sm:px-6">Email</th>
              <th className="px-4 py-3 sm:px-6">Role</th>
              <th className="px-4 py-3 sm:px-6">Phone</th>
            </tr>
          </thead>
          <tbody>
            {currentemployees.length > 0 ? (
              currentemployees
                .filter((employee) => employee && employee.name)
                .map((employee, index) => (
                  <tr
                    key={employee.employeeId}
                    className="border-b border-gray-200 cursor-pointer hover:bg-gray-100"
                    onClick={() => handleEmployeeClick(employee.employeeId)}
                  >
                    <td className="px-4 py-4 sm:px-6">{employee.name}</td>
                    <td className="px-4 py-4 sm:px-6">{employee.email}</td>
                    <td className="px-4 py-4 sm:px-6">{employee.position}</td>
                    <td className="px-4 py-4 sm:px-6">{employee.phone}</td>
                  </tr>
                ))
            ) : (
              <tr>
                <td colSpan="4" className="py-4 text-center">No employees found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-3 mb-2 flex justify-center">
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
    </>
  );
}

export default SuperAdminTotalEmployee;

