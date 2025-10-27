import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import { useSelector } from "react-redux";

const Super_view_unit_sold = ({ selectedLeadId, closeModalUnitSold, type }) => {
  const [employeeunitsold, setEmployeeUnitSold] = useState([]);
  const [render, setRender] = useState(false);
  const superadminuser = useSelector((state) => state.auth.user);
  const token = superadminuser.token;

  useEffect(() => {
    fetchEmployeeUnitSold();
  }, [selectedLeadId, render]);

  const fetchEmployeeUnitSold = async () => {
    try {
      let apiUrl = "";

      if (type === "meta") {
        apiUrl = `https://crm-generalize.dentalguru.software/api/getEmployeeUnitSoldByLeadIdMeta/${selectedLeadId.leadgen_id}`;
      } else {
        apiUrl = `https://crm-generalize.dentalguru.software/api/unit-sold-lead-id/${selectedLeadId.lead_id}`;
      }

      const response = await axios.get(apiUrl, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      setEmployeeUnitSold(response.data);
    } catch (error) {
      console.error("Error fetching visit:", error);
    }
  };

  const handleClose = () => {
    closeModalUnitSold();
  };

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
                  {employeeunitsold.map((unitsold, index) => (
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {unitsold.unit_number}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {unitsold.project_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {unitsold.unit_status}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        {moment(unitsold.date)
                          .format("DD MMM YYYY")
                          .toUpperCase()}
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
