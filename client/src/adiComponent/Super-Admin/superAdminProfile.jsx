import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import MainHeader from "./../../components/MainHeader";
import SuperAdminSider from "./SuperAdminSider";
import moment from "moment";

function SuperAdminProfile() {
  const superAdmin = useSelector((state) => state.auth.user); 
  console.log(superAdmin);

  return (
    <>
      <MainHeader />
      <SuperAdminSider />
      <div className="container 2xl:w-[100%] 2xl:ml-32 ">
      <div className="flex flex-col  lg:flex-row mt-14">
        <div className="flex-grow md:p-4 mt-14 lg:mt-0 sm:ml-0">
          <center className="text-2xl text-center mt-8 font-medium">
            Super Admin Profile
          </center>
          <center className="mx-auto h-[3px] w-16 bg-[#34495E] my-3"></center>
          <div className="flex flex-wrap  mb-4">
            <div className="w-full md:w-2/3 md:mx-0 mx-3">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div>
                  <label className="text-info">User ID</label>
                  <div className="p-2 bg-gray-100 rounded">
                    <p className="m-0">{superAdmin?.id}</p>
                  </div>
                </div>

                <div>
                  <label className="text-info">Name</label>
                  <div className="p-2 bg-gray-100 rounded">
                    <p className="m-0">{superAdmin?.name}</p>
                  </div>
                </div>

                <div>
                  <label className="text-info">Email</label>
                  <div className="p-2 bg-gray-100 rounded">
                    <p className="m-0">{superAdmin?.email}</p>
                  </div>
                </div>

                <div>
                  <label className="text-info">Role</label>
                  <div className="p-2 bg-gray-100 rounded">
                    <p className="m-0">{superAdmin?.roles}</p>
                  </div>
                </div>

                <div>
                  <label className="text-info">Created Date</label>
                  <div className="p-2 bg-gray-100 rounded">
                    <p className="m-0">
                      {moment(superAdmin?.created_date).format("DD/MM/YYYY")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div></div>
    </>
  );
}

export default SuperAdminProfile;
