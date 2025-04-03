import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import MainHeader from "./../../components/MainHeader";
import SuperAdminSider from "./SuperAdminSider";

const mockEmployeeData = {
  employeeId: 1,
  name: "John Doe",
  email: "john.doe@example.com",
  phone: "9876543210",
  position: "Software Engineer",
  designation: "Developer",
  createdTime: "2024-09-01 12:00:00",
  signature: "john-sign.png",
  photo: "john-profile.png",
};

function AdminProfile() {
  const [user, setUser] = useState([]); // Initialize state for employee data
  const {adminId} = useParams();
  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const response = await axios.get(
          `https://crmdemo.vimubds5.a2hosted.com/api/getAdminById/${adminId}`
        ); // Fetch employee data
        setUser(response.data.admin); // Set employee data to state
        console.log(response.data); // Debug: log employee data
      } catch (error) {
        console.error("Error fetching employee data:", error);
      }
    };

    fetchEmployee();
  }, [adminId]);

  return (
    <>
      <MainHeader />
      <SuperAdminSider />
      <div className="flex flex-col justify-center lg:flex-row mt-14">
        <div className="flex-grow md:p-4 mt-14 lg:mt-0 sm:ml-0">
          <center className="text-2xl text-center mt-8 font-medium">
            Admin Profile
          </center>
          <center className="mx-auto h-[3px] w-16 bg-[#34495E] my-3"></center>
          <div className="flex flex-wrap justify-center mb-4">
            {/* <div className="w-full lg:w-1/3">
            <img
              src={user?.photo ? `path_to_images/${user?.photo}` : img} // Use employee photo if available
              alt="employee-profile"
              className="rounded-lg"
            />
          </div> */}
            <div className="w-full md:w-2/3 md:mx-0 mx-3">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div>
                  <label className="text-info">Employee ID</label>
                  <div className="p-2 bg-gray-100 rounded">
                    <p className="m-0">{user?.admin_id}</p>
                  </div>
                </div>

                <div>
                  <label className="text-info">Name</label>
                  <div className="p-2 bg-gray-100 rounded">
                    <p className="m-0">{user?.name}</p>
                  </div>
                </div>

                <div>
                  <label className="text-info">Email</label>
                  <div className="p-2 bg-gray-100 rounded">
                    <p className="m-0">{user?.email}</p>
                  </div>
                </div>

                <div>
                  <label className="text-info">Phone</label>
                  <div className="p-2 bg-gray-100 rounded">
                    <p className="m-0">{user?.phone}</p>
                  </div>
                </div>

                <div>
                  <label className="text-info">Position</label>
                  <div className="p-2 bg-gray-100 rounded">
                    <p className="m-0">{user?.position}</p>
                  </div>
                </div>

                <div>
                  <label className="text-info">Created Date</label>
                  <div className="p-2 bg-gray-100 rounded">
                    <p className="m-0">
                     
                      {moment(user?.createdTime).format("DD MMM YYYY").toUpperCase()}
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
}

export default AdminProfile;
