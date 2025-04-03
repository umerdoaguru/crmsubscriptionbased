import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import { useSelector } from "react-redux";
import ReactPaginate from "react-paginate";

import cogoToast from "cogo-toast";
import MainHeader from './../MainHeader';
import Sider from './../Sider';

const Admin_ViewAll_Unit_Sold = () => {
  const [employeeunitsold, setEmployeeUnitSold] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage] = useState(10); // Number of items per page
  const [filterText, setFilterText] = useState("");
  const [sortAsc, setSortAsc] = useState(true);
  const [render, setRender] = useState(false);
  const [previousUnit, setPreviousUnit] = useState('');
  const { id } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [unitdata, setUnitData] = useState([]);
  const navigate = useNavigate();
  const adminuser = useSelector((state) => state.auth.user);

  const token = adminuser?.token;
  
  useEffect(() => {
    fetchEmployeeUnitSold();
 
  }, [id, render]);

 



  const fetchEmployeeUnitSold = async () => {
    try {
      const response = await axios.get(
        `https://crmdemo.vimubds5.a2hosted.com/api/admin-unit-sold-lead-id/${id}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }}
        
      );
      setEmployeeUnitSold(response.data);
      console.log(response);

    } catch (error) {
      console.error("Error fetching visit:", error);
    }
  };

  
 


  const filteredEmployeeUnitSold = employeeunitsold.filter((unitsold) =>
    unitsold.name.toLowerCase().includes(filterText.toLowerCase())
  );

  const offset = currentPage * itemsPerPage;
  const currentemployeeunitsold = filteredEmployeeUnitSold.slice(
    offset,
    offset + itemsPerPage
  );
  const pageCount = Math.ceil(filteredEmployeeUnitSold.length / itemsPerPage);

  const handleBackClick = () => {
    navigate(-1); // -1 navigates to the previous page in history
  };

  return (
    <>
      <MainHeader />
      <Sider />
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
              All Unit Sold
            </h2>
            <div className=" overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 border border-gray-300">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      S.no
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Unit No
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Project Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Unit Status
                    </th>
                    
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                    </th>
                  
                  
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentemployeeunitsold.map((unitsold, index) => (
                    <tr key={unitsold.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {offset + index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {unitsold.unit_no}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {unitsold.project_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {unitsold.unit_status}
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                       {moment(unitsold.date).format("DD MMM YYYY").toUpperCase()}
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

export default Admin_ViewAll_Unit_Sold;
