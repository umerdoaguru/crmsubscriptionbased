import React from "react";
import Sider from "../Sider";
import Projectshow from "./projectshow";
import MainHeader from "../MainHeader";


const ProjectDashBoard = () => {
  
  return (
    <>
      <MainHeader />
      <Sider />
      <h1 className="text-2xl text-center mt-[5rem]">Project Dashboard</h1>
      <div className="mx-auto h-[3px] w-16 bg-[#34495E] my-3"></div>
      <div className="flex min-h-screen overflow-hidden ">
        {/* Main Content */}
        <div className="flex-1 max-w-full 2xl:w-[93%] 2xl:ml-32 ">
          <Projectshow/>
        </div>
      </div>
    </>
  );
};

export default ProjectDashBoard;
