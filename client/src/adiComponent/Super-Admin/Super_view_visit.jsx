import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import getFieldValue from "../../utils/getFieldValue";

const Super_view_visit = ({ selectedLeadId, closeModalVisit, type }) => {
  const [visit, setVisit] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage] = useState(10);
  const [render, setRender] = useState(false);

  const handleClose = () => {
    closeModalVisit();
  };

  useEffect(() => {
    fetchvisit();
  }, [selectedLeadId, render]);

  const superadminuser = useSelector((state) => state.auth.user);
  const token = superadminuser.token;

  const fetchvisit = async () => {
    try {
      const { data } = await axios.get(
        `https://crm-generalize.dentalguru.software/api/employe-visit/${type}/${
          selectedLeadId?.lead_id || selectedLeadId?.leadgen_id
        }`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(data);
      setVisit(data);
    } catch (error) {
      console.error("Error fetching quotations:", error);
    }
  };

  const offset = currentPage * itemsPerPage;
  const currentvisit = visit.slice(offset, offset + itemsPerPage);
  const pageCount = Math.ceil(visit.length / itemsPerPage);

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
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Assigned To
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Visit Type
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
                        {visit.name ||
                          getFieldValue(
                            visit.question_fields_data,
                            "full_name"
                          )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {visit.staff_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {visit.visit_type}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {visit.visit_date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {visit.visit_details}
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
