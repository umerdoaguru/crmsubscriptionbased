import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import { useSelector } from "react-redux";
import ReactPaginate from "react-paginate";


import cogoToast from "cogo-toast";
import SuperAdminSider from "./SuperAdminSider";
import MainHeader from './../../components/MainHeader';

const Super_view_followup = ({id,closeModalFollowUp}) => {
  const [follow_up, setFollow_Up] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage] = useState(10); // Number of items per page
  const [filterText, setFilterText] = useState("");

  const [render, setRender] = useState(false);
  const superadminuser = useSelector((state) => state.auth.user);
  const token = superadminuser.token;
 
  const navigate = useNavigate();

  useEffect(() => {
    fetchFollowUp();
  }, [id, render]);
  const handleClose = () => {
    closeModalFollowUp(); // Close the modal
    // closeModalLead(); // Close the lead profile
  };

  const fetchFollowUp = async () => {
    try {
      const response = await axios.get(
        `https://crmdemo.vimubds5.a2hosted.com/api/employe-follow-up-super-admin/${id}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }}
      );
      setFollow_Up(response.data);
      console.log(response);
    } catch (error) {
      console.error("Error fetching visit:", error);
    }
  };


 

 

 




  const filteredfollowup = follow_up.filter((follow) =>
    follow.name.toLowerCase().includes(filterText.toLowerCase())
  );

  const offset = currentPage * itemsPerPage;
  const currentfollow = filteredfollowup.slice(
    offset,
    offset + itemsPerPage
  );
  const pageCount = Math.ceil(filteredfollowup.length / itemsPerPage);

  const handleBackClick = () => {
    navigate(-1); // -1 navigates to the previous page in history
  };

  return (
    <>
     
      <div className=" relative container mt-4 ">
      <button
          onClick={handleClose}
          className="absolute top-2 left-2 text-[black] hover:text-gray-700 text-[3rem]"
          title="Close"
        >
          ×
        </button>
        <div className="w-full px-2 mx-auto p-4">
          <div className="w-full px-2 mt-4">
            <h2 className="text-2xl font-bold mb-4 text-center">
              All Follow Up
            </h2>
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
                    Follow Up Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Follow Up Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Report
                    </th>
                
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentfollow.map((followup, index) => (
                    <tr key={followup.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {offset + index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {followup.lead_id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {followup.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                       {followup.employee_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                       {followup.follow_up_type}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                       {followup.follow_up_date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                       {followup.report}
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

export default Super_view_followup;
