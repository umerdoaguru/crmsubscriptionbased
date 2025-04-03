import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import moment from "moment";



import Sider from "../Sider";
import MainHeader from './../MainHeader';
import { useSelector } from "react-redux";


const Admin_RemarksView = () => {
  const [remarks, setRemarks] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage] = useState(10);
  const [filterText, setFilterText] = useState("");
  const [render, setRender] = useState(false);
  const { id } = useParams();

  const navigate = useNavigate();

  useEffect(() => {
    fetchRemarks();
  }, [id, render]);
  const adminuser = useSelector((state) => state.auth.user);
  const token = adminuser.token;

  const fetchRemarks = async () => {
    try {
      const response = await axios.get(`https://crmdemo.vimubds5.a2hosted.com/api/remarks-admin/${id}`,
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

  return (
    <>
      <MainHeader />
      <Sider />
      <div className="container mt-4 2xl:w-[91%] 2xl:ml-36">
        <div className="mt-[7rem]">
          <button
            onClick={() => navigate(-1)}
            className="bg-blue-500 text-white px-3 py-1 max-sm:hidden rounded-lg hover:bg-blue-600 transition-colors"
          >
            Back
          </button>
        </div>
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

export default Admin_RemarksView;
