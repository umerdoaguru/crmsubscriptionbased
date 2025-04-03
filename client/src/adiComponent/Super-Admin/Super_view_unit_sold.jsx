import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import MainHeader from "../../components/MainHeader";
import SuperAdminSider from "./SuperAdminSider";
import { useSelector } from "react-redux";





const Super_view_unit_sold = ({id,closeModalUnitSold }) => {
  const [employeeunitsold, setEmployeeUnitSold] = useState([]);  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage] = useState(10);
  const [filterText, setFilterText] = useState("");
  const [render, setRender] = useState(false);
  const superadminuser = useSelector((state) => state.auth.user);
  const token = superadminuser.token;
  
console.log(id);

  const navigate = useNavigate();

  useEffect(() => {
    fetchEmployeeUnitSold();
  }, [id, render]);

  const fetchEmployeeUnitSold = async () => {
    try {
      const response = await axios.get(
        `https://crmdemo.vimubds5.a2hosted.com/api/super-admin-unit-sold-lead-id/${id}`,
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

 

 
 

  
  const handleClose = () => {
    closeModalUnitSold(); // Close the modal
    // closeModalLead(); // Close the lead profile
  };

  return (
    <>
      {/* <MainHeader />
      <SuperAdminSider /> */}
      <div className="relative container mt-4 ">
      <button
          onClick={handleClose}
          className="absolute top-2 left-2 text-[black] hover:text-gray-700 text-[3rem]"
          title="Close"
        >
          ×
        </button>
       

       
        <div className="w-full px-2 mx-auto p-4">
          <div className="w-full px-2 mt-4">
            <h2 className="text-2xl font-bold mb-4 text-center">All Unit Sold</h2>
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
                 {employeeunitsold.map((unitsold, index) => (
                                     <tr key={unitsold.id}>
                                       <td className="px-6 py-4 whitespace-nowrap">
                                         { index + 1}
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

export default Super_view_unit_sold;
