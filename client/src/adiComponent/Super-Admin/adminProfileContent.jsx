import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

function AdminProfileContent() {
  const superadminuser = useSelector((state) => state.auth.user);
  const token = superadminuser.token;
  const [user, setUser] = useState([]);
  const { adminId } = useParams();
  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const response = await axios.get(
          `https://crm-generalize.dentalguru.software/api/getAdminById/${adminId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUser(response.data.admin);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching employee data:", error);
      }
    };

    fetchEmployee();
  }, [adminId]);

  return (
    <>
      <div className="flex mt-20">
        <div className="w-full min-h-screen bg-[#F9FAFF] p-2">
          <div className="flex flex-col justify-center lg:flex-row mt-2">
            <div className="flex-grow md:p-4 mt-14 lg:mt-0 sm:ml-0">
              <center className="text-2xl text-center mt-8 font-medium">
                Admin Profile
              </center>
              <center className="mx-auto h-[3px] w-16 bg-[#34495E] my-3"></center>
              <div className="flex flex-wrap justify-center mb-4">
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
                      <label className="text-info">User Id</label>
                      <div className="p-2 bg-gray-100 rounded">
                        <p className="m-0">{user?.user_id}</p>
                      </div>
                    </div>

                    <div>
                      <label className="text-info">Created Date</label>
                      <div className="p-2 bg-gray-100 rounded">
                        <p className="m-0">
                          {moment(user?.createdTime)
                            .format("DD MMM YYYY")
                            .toUpperCase()}
                        </p>
                      </div>
                    </div>
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

export default AdminProfileContent;
