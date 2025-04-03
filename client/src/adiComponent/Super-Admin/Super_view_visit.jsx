import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import { useSelector } from "react-redux";
import ReactPaginate from "react-paginate";


import cogoToast from "cogo-toast";
import Sider from './../../components/Sider';
import MainHeader from './../../components/MainHeader';

const Super_view_visit = ({id,closeModalVisit}) => {
  const [visit, setVisit] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage] = useState(10); // Number of items per page
  const [filterText, setFilterText] = useState("");
  const [sortAsc, setSortAsc] = useState(true);
  const [render, setRender] = useState(false);
 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState(null);
  const navigate = useNavigate();

  const handleClose = () => {
    closeModalVisit(); // Close the modal
    // closeModalLead(); // Close the lead profile
  };

  useEffect(() => {
    fetchvisit();
  }, [id, render]);
  const superadminuser = useSelector((state) => state.auth.user);
  const token = superadminuser.token;

  const fetchvisit = async () => {
    try {
      const response = await axios.get(
        `https://crmdemo.vimubds5.a2hosted.com/api/employe-visit-super-admin/${id}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }}
      );
      setVisit(response.data);
      console.log(response);
    } catch (error) {
      console.error("Error fetching visit:", error);
    }
  };




  const filteredvisit = visit.filter((visit) =>
    visit.name.toLowerCase().includes(filterText.toLowerCase())
  );

  const offset = currentPage * itemsPerPage;
  const currentvisit = filteredvisit.slice(
    offset,
    offset + itemsPerPage
  );
  const pageCount = Math.ceil(filteredvisit.length / itemsPerPage);


  return (
    <>
     
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
            <h2 className="text-2xl font-bold mb-4 text-center">
              All Leads visit
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
                      Visit 
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Visit Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Report
                    </th>
                  
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentvisit.map((visit, index) => (
                    <tr key={visit.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {offset + index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {visit.lead_id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {visit.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                       {visit.employee_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                       {visit.visit}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                       {visit.visit_date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                       {visit.report}
                      </td>
                     
                    </tr>
                  ))}
                </tbody>
              </table>





                    {/* Modal for Editing Visit Data */}
          

            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Super_view_visit;
