import React, { useState, useEffect } from "react";
import { GiFiles } from "react-icons/gi";
import { Link } from "react-router-dom";
import axios from "axios"; // Make sure axios is imported

import { useSelector } from "react-redux";

import MainHeader from "../../../components/MainHeader";
import SuperAdminSider from "../SuperAdminSider";

function SuperMainSocialMediaByProjectContent() {
  const [projects, setProjects] = useState([]);
  const user = useSelector((state) => state.auth.user);
  const token = user?.token;
  const userId = user.id;

  useEffect(() => {
    const fetchProjectDetail = async () => {
      try {
        const response = await axios.get(
          `https://crm-generalize.dentalguru.software/api/super-admin-all-project/${userId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setProjects(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchProjectDetail();
  }, []);

  return (
    <>
      <div className="flex mt-20">
        <div className="w-full min-h-screen bg-[#F9FAFF] p-2">
          <div className="flex-1 max-w-full mt-[5rem]">
            <h2 className="text-2xl text-center font-medium">
              Project Wise Social Interigation
            </h2>
            <div className="mx-auto h-[3px] w-16 bg-[#34495E] my-3"></div>
            <div className="flex flex-wrap justify-around mt-12">
              {projects.map((project) => (
                <div
                  key={project.main_project_id} // Use a unique key for each project
                  className="w-full sm:w-1/2 lg:w-1/3 xl:w-1/4 my-3 p-0 sm-mx-0 mx-3"
                >
                  <Link
                    to={`/social-media-superleads/${project.main_project_id}`}
                  >
                    <div className="shadow-md rounded-2xl overflow-hidden cursor-pointer text-gray-600 border-2">
                      <div className="p-10 flex flex-col items-center text-center">
                        {/* <div className="text-3xl text-gray-700">
                      <GiFiles /> 
                    </div> */}
                        <div className="mt-2">
                          <h5 className="text-gray-800 text-xl font-semibold">
                            {project.project_name} {/* Category name */}
                          </h5>
                        </div>
                        <div className="mt-2">
                          <h5 className="text-gray-800 text-xl font-semibold">
                            {project.location} {/* Category name */}
                          </h5>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default SuperMainSocialMediaByProjectContent;
