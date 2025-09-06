import React from "react";
import Sider from "../Sider";
import Projectshow from "./projectshow";
import MainHeader from "../MainHeader";

const ProjectDashBoardContent = () => {
  return (
    <>
      <div className="flex mt-20">
        <div className="w-full min-h-screen bg-[#F9FAFF] p-2">
          <h2 className="text-2xl text-center mt-[2rem]">Project Dashboard</h2>
          <div className="mx-auto h-[3px] w-16 bg-[#34495E] my-3"></div>
          <div className="flex min-h-screen overflow-hidden ">
            {/* Main Content */}
            <div className="flex-1 max-w-full">
              <Projectshow />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProjectDashBoardContent;
