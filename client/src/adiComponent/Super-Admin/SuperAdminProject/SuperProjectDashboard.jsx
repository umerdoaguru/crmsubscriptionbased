import React from "react";



import MainHeader from './../../../components/MainHeader';
import Superprojectshow from './Superprojectshow';
import SuperAdminSider from "../SuperAdminSider";


const SuperProjectDashBoard = () => {

  return (
    <>
      <MainHeader />
      <SuperAdminSider />
      <h1 className="text-2xl text-center mt-[5rem]">Project Dashboard</h1>
      <div className="mx-auto h-[3px] w-16 bg-[#34495E] my-3"></div>
      <div className="flex min-h-screen overflow-hidden ">
        {/* Main Content */}
        <div className="flex-1 max-w-full 2xl:w-[93%] 2xl:ml-32 ">
          <Superprojectshow/>
        </div>
      </div>
    </>
  );
};

export default SuperProjectDashBoard;
