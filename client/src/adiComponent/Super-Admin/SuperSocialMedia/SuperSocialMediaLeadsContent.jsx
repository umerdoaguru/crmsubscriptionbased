import React, { useState } from "react";
import { GiFiles } from "react-icons/gi";
import SuperWebsiteLeads from "../SocialMediaSectionSuperAdmin/SuperWebsiteLeads";
import SuperAccrs from "../SocialMediaSectionSuperAdmin/SuperAccrsLeads";
import SuperLeadsTable from "../SocialMediaSectionSuperAdmin/SuperFacebookAPI/SuperLeadsTable";
import { useNavigate } from "react-router-dom";
import { FaMeta } from "react-icons/fa6";
import { CgWebsite } from "react-icons/cg";
import { SiGoogleads } from "react-icons/si";

function SuperSocialMediaLeadsContent({ isSidebarOpen }) {
  const [selectedComponent, setSelectedComponent] = useState("FacebookData");
  const navigate = useNavigate();

  return (
    <>
      <div
        className={`${
          isSidebarOpen ? "ml-60 w-[85%] 3xl:w-[90%]" : "ml-28 w-[95%]"
        } flex mt-20`}
      >
        <div className="w-full min-h-full bg-[#F9FAFF] p-2">
          {/* <div className="mt-[1rem] ">
            <button
              onClick={() => navigate(-1)}
              className="bg-cyan-600 text-white px-3 py-1 rounded-lg hover:bg-cyan-700 transition-colors"
            >
              Back
            </button>
          </div> */}
          <div className="container">
            <h2 className="text-2xl text-center mt-[1rem] font-medium">
              Digital Marketing Leads
            </h2>
            <div className="mx-auto h-[3px] w-16 bg-cyan-600 my-3"></div>

            <div className="flex flex-wrap justify-center gap-6 mt-5 mb-3">
              {/* Meta Leads Data */}
              <div className={`w-full sm:w-1/2 lg:w-1/4 xl:w-1/5`}>
                <div
                  className={`rounded-2xl shadow-md overflow-hidden cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-xl ${
                    selectedComponent === "FacebookData"
                      ? "bg-gradient-to-r from-cyan-500 to-cyan-600 text-white"
                      : "bg-white text-gray-800"
                  }`}
                  onClick={() => setSelectedComponent("FacebookData")}
                >
                  <div className="p-6 flex flex-col items-center text-center">
                    <div
                      className={`text-4xl mb-3 transition-colors duration-300 ${
                        selectedComponent === "FacebookData"
                          ? "text-white"
                          : "text-cyan-600"
                      }`}
                    >
                      <FaMeta />
                    </div>
                    <h5 className="text-lg font-semibold">Meta Leads Data</h5>
                    <p
                      className={`text-sm mt-1 ${
                        selectedComponent === "FacebookData"
                          ? "text-white/80"
                          : "text-gray-500"
                      }`}
                    >
                      Track leads from Meta
                    </p>
                  </div>
                </div>
              </div>

              {/* Website Inquiries */}
              <div className={`w-full sm:w-1/2 lg:w-1/4 xl:w-1/5`}>
                <div
                  className={`rounded-2xl shadow-md overflow-hidden cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-xl ${
                    selectedComponent === "WebsiteData"
                      ? "bg-gradient-to-r from-cyan-500 to-cyan-600 text-white"
                      : "bg-white text-gray-800"
                  }`}
                  onClick={() => setSelectedComponent("WebsiteData")}
                >
                  <div className="p-6 flex flex-col items-center text-center">
                    <div
                      className={`text-4xl mb-3 transition-colors duration-300 ${
                        selectedComponent === "WebsiteData"
                          ? "text-white"
                          : "text-cyan-600"
                      }`}
                    >
                      <CgWebsite />
                    </div>
                    <h5 className="text-lg font-semibold">
                      Website Inquiries Data
                    </h5>
                    <p
                      className={`text-sm mt-1 ${
                        selectedComponent === "WebsiteData"
                          ? "text-white/80"
                          : "text-gray-500"
                      }`}
                    >
                      All website leads in one place
                    </p>
                  </div>
                </div>
              </div>

              {/* Google Data */}
              <div className={`w-full sm:w-1/2 lg:w-1/4 xl:w-1/5`}>
                <div
                  className={`rounded-2xl shadow-md overflow-hidden cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-xl ${
                    selectedComponent === "GoogleData"
                      ? "bg-gradient-to-r from-cyan-500 to-cyan-600 text-white"
                      : "bg-white text-gray-800"
                  }`}
                  onClick={() => setSelectedComponent("GoogleData")}
                >
                  <div className="p-6 flex flex-col items-center text-center">
                    <div
                      className={`text-4xl mb-3 transition-colors duration-300 ${
                        selectedComponent === "GoogleData"
                          ? "text-white"
                          : "text-cyan-600"
                      }`}
                    >
                      <SiGoogleads />
                    </div>
                    <h5 className="text-lg font-semibold">Google Leads Data</h5>
                    <p
                      className={`text-sm mt-1 ${
                        selectedComponent === "GoogleData"
                          ? "text-white/80"
                          : "text-gray-500"
                      }`}
                    >
                      View Google Ads leads
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Conditionally render the selected component */}
            <div className="w-full h-[calc(100vh-10rem)] overflow-y-auto">
              {selectedComponent === "FacebookData" && (
                <SuperLeadsTable isSidebarOpen={isSidebarOpen} />
              )}
              {selectedComponent === "GoogleData" && (
                <SuperLeadsTable isSidebarOpen={isSidebarOpen} />
              )}
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
