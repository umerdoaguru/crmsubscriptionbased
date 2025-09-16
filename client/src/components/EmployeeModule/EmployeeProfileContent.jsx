import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { IoArrowBack } from "react-icons/io5";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

const EmployeeProfileContent = () => {
  const { employeeId } = useParams();
  console.log(employeeId);
  const navigate = useNavigate();

  const [user, setUser] = useState([]);
  const EmpId = useSelector((state) => state.auth.user);

  const token = EmpId?.token;
  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const response = await axios.get(
          `https://crm-generalize.dentalguru.software/api/employeeProfile/${employeeId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUser(response.data[0]);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching employee data:", error);
      }
    };

    fetchEmployee();
  }, [EmpId]);

  const onBack = () => {
    navigate(-1);
  };

  return (
    <>
      <div className="flex mt-20">
        <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-cyan-50 p-6">
          {/* Header with Back Button */}
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={onBack}
              className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-md border hover:bg-cyan-50 hover:text-cyan-700 transition"
            >
              <IoArrowBack className="text-lg" />
              <span className="font-medium">Back</span>
            </button>
            <h2 className="text-3xl font-bold text-cyan-700 tracking-wide">
              Employee Profile
            </h2>
            <div className="w-10" /> {/* spacer for balance */}
          </div>

          {/* Divider */}
          <div className="h-1 w-24 bg-gradient-to-r from-cyan-600 to-blue-500 rounded-full mx-auto mb-10"></div>

          {/* Profile Card */}
          <div className="flex justify-center">
            <div className="w-full md:w-4/5 lg:w-2/3 bg-white rounded-2xl shadow-xl p-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Employee ID */}
                <div>
                  <label className="text-gray-500 font-semibold text-sm uppercase tracking-wider">
                    Employee ID
                  </label>
                  <div className="p-3 mt-1 bg-gray-50 border rounded-xl shadow-sm">
                    <p className="text-gray-800 font-medium">{user.staff_id}</p>
                  </div>
                </div>

                {/* Name */}
                <div>
                  <label className="text-gray-500 font-semibold text-sm uppercase tracking-wider">
                    Name
                  </label>
                  <div className="p-3 mt-1 bg-gray-50 border rounded-xl shadow-sm">
                    <p className="text-gray-800 font-medium">
                      {user.staff_name}
                    </p>
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="text-gray-500 font-semibold text-sm uppercase tracking-wider">
                    Email
                  </label>
                  <div className="p-3 mt-1 bg-gray-50 border rounded-xl shadow-sm">
                    <p className="text-gray-800 font-medium">
                      {user.staff_email}
                    </p>
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="text-gray-500 font-semibold text-sm uppercase tracking-wider">
                    Phone
                  </label>
                  <div className="p-3 mt-1 bg-gray-50 border rounded-xl shadow-sm">
                    <p className="text-gray-800 font-medium">
                      {user.staff_phone}
                    </p>
                  </div>
                </div>

                {/* Role */}
                <div>
                  <label className="text-gray-500 font-semibold text-sm uppercase tracking-wider">
                    Position
                  </label>
                  <div className="p-3 mt-1 bg-gray-50 border rounded-xl shadow-sm">
                    <p className="text-gray-800 font-medium">
                      {user.staff_role}
                    </p>
                  </div>
                </div>

                {/* Created Date */}
                <div>
                  <label className="text-gray-500 font-semibold text-sm uppercase tracking-wider">
                    Created Date
                  </label>
                  <div className="p-3 mt-1 bg-gray-50 border rounded-xl shadow-sm">
                    <p className="text-gray-800 font-medium">
                      {moment(user.staff_created_at).format("DD/MM/YYYY")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EmployeeProfileContent;
