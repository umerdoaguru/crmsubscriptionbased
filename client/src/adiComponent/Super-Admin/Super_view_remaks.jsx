import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import MainHeader from "../../components/MainHeader";
import SuperAdminSider from "./SuperAdminSider";
import { useSelector } from "react-redux";





const Super_view_remarks = ({id,closeModalRemark }) => {
  const [remarks, setRemarks] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage] = useState(10);
  const [filterText, setFilterText] = useState("");
  const [render, setRender] = useState(false);
  const superadminuser = useSelector((state) => state.auth.user);
  const token = superadminuser.token;
  
console.log(id);

  const navigate = useNavigate();

  useEffect(() => {
    fetchRemarks();
  }, [id, render]);

  const fetchRemarks = async () => {
    try {
      const response = await axios.get(`https://crmdemo.vimubds5.a2hosted.com/api/remarks-super-admin/${id}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }});
      setRemarks(response.data);
      console.log(response);
    } catch (error) {
      console.error("Error fetching remarks:", error);
    }
  };

 

 
  const filteredRemarks = remarks.filter((remark) =>
    remark.name.toLowerCase().includes(filterText.toLowerCase())
  );

  const offset = currentPage * itemsPerPage;
  const currentRemarks = filteredRemarks.slice(offset, offset + itemsPerPage);
  const pageCount = Math.ceil(filteredRemarks.length / itemsPerPage);
  const handleClose = () => {
    closeModalRemark(); // Close the modal
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
            <h2 className="text-2xl font-bold mb-4 text-center">All Remarks</h2>
            <div className=" overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 border border-gray-300">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      S.no
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Lead Id
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Assigned To
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Remark Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Remark Answer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                 
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentRemarks.map((remark, index) => (
                    <tr key={remark.id}>
                      <td className="px-6 py-4 whitespace-nowrap">{offset + index + 1}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{remark.lead_id}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{remark.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{remark.employee_name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{remark.remark_status}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{remark.answer_remark}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{remark.date}</td>
                  
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

export default Super_view_remarks;
