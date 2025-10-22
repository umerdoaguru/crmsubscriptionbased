import React, { useState, useEffect } from "react";
import LeadReport from "../components/AdminReport/LeadReport";
import VisitReport from "../components/AdminReport/VisitReport";
import ClosedDealReport from "../components/AdminReport/ClosedDealReport";
import SoldUnitsReport from "../components/AdminReport/SoldUnitsReport";
import { RiCommunityFill } from "react-icons/ri";
import { FaHouseChimney } from "react-icons/fa6";
import { SiGoogleads } from "react-icons/si";
import MetaLeadReport from "../components/AdminReport/MetaLeadReport";

const AdminReportContent = () => {
  const [selectedComponent, setSelectedComponent] = useState("LeadData");

  return (
    <>
      <div className="flex mt-20">
        <div className="w-full min-h-screen bg-[#F9FAFF] p-2">
          <div className="container">
            {/* Title */}
            <h2 className="text-3xl text-center mt-6 font-semibold tracking-wide text-gray-800">
              Report
            </h2>
            <div className="mx-auto h-[3px] w-20 bg-cyan-600 my-4 rounded-full"></div>

            {/* Card Section */}
            <div className="flex flex-wrap justify-center gap-6 mt-4">
              {/* Leads */}
              <div
                className={`transition-all duration-300 transform hover:scale-105 shadow-md rounded-2xl cursor-pointer w-40 sm:w-48 ${
                  selectedComponent === "LeadData"
                    ? "bg-cyan-600 text-white shadow-lg shadow-cyan-300/50"
                    : "bg-white text-gray-800 hover:bg-gray-100"
                }`}
                onClick={() => setSelectedComponent("LeadData")}
              >
                <div className="p-6 flex flex-col items-center text-center">
                  <div
                    className={`text-4xl mb-2 ${
                      selectedComponent === "LeadData"
                        ? "text-white"
                        : "text-cyan-600"
                    }`}
                  >
                    <SiGoogleads />
                  </div>
                  <p className="text-lg font-semibold">Leads</p>
                </div>
              </div>

              {/* Site Visit */}
              <div
                className={`transition-all duration-300 transform hover:scale-105 shadow-md rounded-2xl cursor-pointer w-40 sm:w-48 ${
                  selectedComponent === "VisitData"
                    ? "bg-cyan-600 text-white shadow-lg shadow-cyan-300/50"
                    : "bg-white text-gray-800 hover:bg-gray-100"
                }`}
                onClick={() => setSelectedComponent("VisitData")}
              >
                <div className="p-6 flex flex-col items-center text-center">
                  <div
                    className={`text-4xl mb-2 ${
                      selectedComponent === "VisitData"
                        ? "text-white"
                        : "text-cyan-600"
                    }`}
                  >
                    <FaHouseChimney />
                  </div>
                  <h5 className="text-lg font-semibold">Site Visit</h5>
                </div>
              </div>

              {/* Closed Deal */}
              {/* <div
                         className={`transition-all duration-300 transform hover:scale-105 shadow-md rounded-2xl cursor-pointer w-40 sm:w-48 ${
                           selectedComponent === "ClosedData"
                             ? "bg-cyan-600 text-white shadow-lg shadow-cyan-300/50"
                             : "bg-white text-gray-800 hover:bg-gray-100"
                         }`}
                         onClick={() => setSelectedComponent("ClosedData")}
                       >
                         <div className="p-6 flex flex-col items-center text-center">
                           <div
                             className={`text-4xl mb-2 ${
                               selectedComponent === "ClosedData"
                                 ? "text-white"
                                 : "text-cyan-600"
                             }`}
                           >
                             <FaHandshake />
                           </div>
                           <h5 className="text-lg font-semibold">Closed Deal</h5>
                         </div>
                       </div> */}

              {/* Sold Units */}
              <div
                className={`transition-all duration-300 transform hover:scale-105 shadow-md rounded-2xl cursor-pointer w-40 sm:w-48 ${
                  selectedComponent === "SoldUnits"
                    ? "bg-cyan-600 text-white shadow-lg shadow-cyan-300/50"
                    : "bg-white text-gray-800 hover:bg-gray-100"
                }`}
                onClick={() => setSelectedComponent("SoldUnits")}
              >
                <div className="p-6 flex flex-col items-center text-center">
                  <div
                    className={`text-4xl mb-2 ${
                      selectedComponent === "SoldUnits"
                        ? "text-white"
                        : "text-cyan-600"
                    }`}
                  >
                    <RiCommunityFill />
                  </div>
                  <h5 className="text-lg font-semibold">Sold Units</h5>
                </div>
              </div>
            </div>

            {/* Render Selected Component */}
            <div className="w-full h-[calc(100vh-12rem)] overflow-y-auto mt-6 bg-white shadow-inner rounded-xl p-4">
              {selectedComponent === "LeadData" && <LeadReport />}
              {selectedComponent === "metaLeadData" && <MetaLeadReport />}
              {selectedComponent === "VisitData" && <VisitReport />}
              {selectedComponent === "ClosedData" && <ClosedDealReport />}
              {selectedComponent === "SoldUnits" && <SoldUnitsReport />}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminReportContent;
