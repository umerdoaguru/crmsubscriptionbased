import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import MainHeader from "../MainHeader";
import Sider from "../Sider";
import ReactPaginate from "react-paginate";

const DashProject = () => {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [projectsPerPage, setProjectsPerPage] = useState(7);
  const navigate = useNavigate();
  const adminuser = useSelector((state) => state.auth.user);
  const token = adminuser.token;

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await axios.get("https://crmdemo.vimubds5.a2hosted.com/api/all-project", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      setProjects(response.data);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  useEffect(() => {
    let filtered = projects;
    if (searchTerm) {
      const trimmedSearchTerm = searchTerm.toLowerCase().trim();
      filtered = filtered.filter((project) =>
        ["project_name", "project_id", "location"].some((key) =>
          project[key]?.toLowerCase().includes(trimmedSearchTerm)
        )
      );
    }
    setFilteredProjects(filtered);
    setCurrentPage(0);
  }, [searchTerm, projects]);

  const handlePageClick = (data) =>
    setCurrentPage(data.selected);

  const handleLeadsPerPageChange = (e) => {
    const value = e.target.value;
    console.log("Selected Value:", value);
  
    const parsedValue = value === "All" ? filteredProjects.length : Number(value);
    console.log("Parsed Value:", parsedValue);
  
    setProjectsPerPage(parsedValue);
    setCurrentPage(0);
  };
  
  const itemsPerPage = projectsPerPage === Infinity ? filteredProjects.length : projectsPerPage;
  const offset = projectsPerPage === Infinity ? 0 : currentPage * itemsPerPage;
  
  const currentProjects =
    projectsPerPage === Infinity
      ? filteredProjects
      : filteredProjects.slice(offset, offset + itemsPerPage);
  
  const pageCount = projectsPerPage === Infinity ? 1 : Math.ceil(filteredProjects.length / itemsPerPage);
  
  

  return (
    <>
      <MainHeader />
      <Sider />
      <div className="container">
        <div className="mt-[6rem] 2xl:ml-40">
          <button
            onClick={() => navigate(-1)}
            className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Back
          </button>
        </div>
        <h1 className="text-2xl text-center">Project List</h1>
        <div className="mx-auto h-[3px] w-16 bg-[#34495E] my-3"></div>
        <div className="  px-6 2xl:ml-40">
        <div className="flex justify-between mb-1" >
          <input
            type="text"
            placeholder="Search by Project Name, ID, or Location"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border rounded-2xl p-2 w-1/4 mb-3"
          />
          <select
            onChange={handleLeadsPerPageChange}
            className="border rounded-2xl p-2 w-1/4 mb-3"
          
          >
            <option value={5}>Number of rows: 5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value="All">All</option>
          </select>
          </div>
          </div>
        <div className="overflow-x-auto mt-1 px-6 2xl:ml-40">

          <table className="container bg-white border">
            <thead>
              <tr>
                <th className="px-6 py-3 border-b-2 border-gray-300 text-left leading-4 text-gray-600 tracking-wider">S.no</th>
                <th className="px-6 py-3 border-b-2 border-gray-300 text-left leading-4 text-gray-600 tracking-wider">Project Name</th>
                <th className="px-6 py-3 border-b-2 border-gray-300 text-left leading-4 text-gray-600 tracking-wider">Project ID</th>
                <th className="px-6 py-3 border-b-2 border-gray-300 text-left leading-4 text-gray-600 tracking-wider">Location</th>
                <th className="px-6 py-3 border-b-2 border-gray-300 text-left leading-4 text-gray-600 tracking-wider">Total Area</th>
              </tr>
            </thead>
            <tbody>
              {currentProjects.map((project, index) => (
                <tr key={project.main_project_id}
                className={index % 2 === 0 ? "bg-gray-100" : ""}>
                  <td className="px-6 py-4 border-b border-gray-200 text-gray-800">{index + 1 + currentPage * projectsPerPage}</td>
                  <td className="px-6 py-4 border-b border-gray-200 text-gray-800">
                    <Link to={`/project-units/${project.main_project_id}`} className="inline-block">
                    {project.project_name}
                    </Link></td>
                  <td className="px-6 py-4 border-b border-gray-200 text-gray-800">{project.main_project_id}</td>
                  <td className="px-6 py-4 border-b border-gray-200 text-gray-800">{project.location}</td>
                  <td className="px-6 py-4 border-b border-gray-200 text-gray-800">{project.total_area}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-2 mb-2 flex justify-center">

          <ReactPaginate
          previousLabel={"Previous"}
          nextLabel={"Next"}
          breakLabel={"..."}
          pageCount={pageCount}
forcePage={currentPage}
          marginPagesDisplayed={2}
          pageRangeDisplayed={3}
          onPageChange={handlePageClick}
          containerClassName={"pagination"}
          activeClassName={"active"}
          pageClassName={"page-item"}
          pageLinkClassName={"page-link"}
          previousClassName={"page-item"}
          nextClassName={"page-item"}
          previousLinkClassName={"page-link"}
          nextLinkClassName={"page-link"}
          breakClassName={"page-item"}
          breakLinkClassName={"page-link"}
        />
        </div>
      </div>
    </>
  );
};

export default DashProject;