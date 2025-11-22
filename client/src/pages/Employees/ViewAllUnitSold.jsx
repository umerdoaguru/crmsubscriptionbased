import { useState } from "react";
import React from "react";
import Sidebar from "../../utils/Sidebar";
import Topbar from "../../utils/Topbar";
import ViewAllUnitSoldContent from "../../components/Leads/ViewAllUnitSoldContent";
import { useDispatch, useSelector } from "react-redux";
import { toggleSidebar } from "../../store/UiSlice";

const ViewAllUnitSold = ({ type, id }) => {
  const dispatch = useDispatch();
  const isSidebarOpen = useSelector((state) => state.ui.isSidebarOpen);

  return (
    <div>
      <div className="flex min-h-screen w-full">
        {/* Sidebar */}
        <Sidebar
          isSidebarOpen={isSidebarOpen}
          toggleSidebar={() => dispatch(toggleSidebar())}
        />

        {/* Main Content */}
        <div
          className={`main-content transition-all w-full duration-300 ${
            isSidebarOpen ? "ml-60" : "sm:ml-28 ml-5"
          }`}
        >
          <Topbar isSidebarOpen={isSidebarOpen} />
          <div className=""></div>

          <ViewAllUnitSoldContent />
        </div>
      </div>
    </div>
  );
};
export default ViewAllUnitSold;
