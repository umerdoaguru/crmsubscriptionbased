import React, { useState } from "react";
import { GiFiles } from "react-icons/gi";
import SuperWebsiteLeads from "../SocialMediaSectionSuperAdmin/SuperWebsiteLeads";
import SuperAccrs from "../SocialMediaSectionSuperAdmin/SuperAccrsLeads";
import SuperLeadsTable from "../SocialMediaSectionSuperAdmin/SuperFacebookAPI/SuperLeadsTable";
import { useNavigate } from "react-router-dom";

function SuperSocialMediaLeadsContent() {
  const [selectedComponent, setSelectedComponent] = useState("FacebookData");
  const navigate = useNavigate();

  return (
    <>
      <div className="flex mt-20">
        <div className="w-full min-h-screen bg-[#F9FAFF] p-2">
          <div className="mt-[1rem] ">
            <button
              onClick={() => navigate(-1)}
              className="bg-cyan-600 text-white px-3 py-1 rounded-lg hover:bg-cyan-700 transition-colors"
            >
              Back
            </button>
          </div>
          <div className="container">
            <h2 className="text-2xl text-center mt-[1rem] font-medium">
              Social Media Leads
            </h2>
            <div className="mx-auto h-[3px] w-16 bg-cyan-600 my-3"></div>

            <div className="flex flex-wrap justify-around mt-5">
              <div className="w-full sm:w-1/2 lg:w-1/4 xl:w-1/5 my-3 p-0 sm-mx-0 mx-3 ">
                <div
                  className={` shadow-lg rounded-lg overflow-hidden cursor-pointer ${
                    selectedComponent === "FacebookData"
                      ? "bg-cyan-600 text-white"
                      : ""
                  }`} // Change background color if active
                  onClick={() => setSelectedComponent("FacebookData")} // Set selected component
                >
                  <div className="p-4 flex flex-col items-center text-center">
                    <div
                      className={`text-3xl ${
                        selectedComponent === "FacebookData"
                          ? "text-white"
                          : "text-gray-700"
                      }`}
                    >
                      <GiFiles />
                    </div>
                    <div className="mt-2">
                      <h5
                        className={`text-xl font-semibold ${
                          selectedComponent === "FacebookData"
                            ? "text-white"
                            : "text-gray-800"
                        }`}
                      >
                        Facebook Leads Data
                      </h5>
                      <p
                        className={`${
                          selectedComponent === "FacebookData"
                            ? "text-white"
                            : "text-gray-600"
                        }`}
                      >
                        {}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Conditionally render the selected component */}
            <div className="w-full h-[calc(100vh-10rem)] overflow-y-auto">
              {selectedComponent === "FacebookData" && <SuperLeadsTable />}
              {selectedComponent === "WebsiteData" && <SuperWebsiteLeads />}
              {selectedComponent === "99AcresData" && <SuperAccrs />}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default SuperSocialMediaLeadsContent;
