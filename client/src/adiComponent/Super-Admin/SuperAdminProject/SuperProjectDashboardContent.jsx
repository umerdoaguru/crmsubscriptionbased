import React from "react";
import Superprojectshow from "./Superprojectshow";

const SuperProjectDashBoardContent = () => {
  return (
    <>
      <div className="flex mt-20">
        <div className="w-full min-h-screen bg-[#F9FAFF] p-2">
          <h2 className="text-2xl text-center mt-[1rem]">Project Dashboard</h2>
          <div className="mx-auto h-[3px] w-16 bg-cyan-600 my-3"></div>
          <div className="flex min-h-screen overflow-hidden ">
            {/* Main Content */}
            <div className="flex-1 max-w-full">
              <Superprojectshow />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SuperProjectDashBoardContent;
