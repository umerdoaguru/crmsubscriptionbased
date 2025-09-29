import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";

function SuperMainSocialMediaByProjectContent() {
  const [projects, setProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const user = useSelector((state) => state.auth.user);
  const token = user?.token;
  const userId = user.staff_id;

  useEffect(() => {
    const fetchProjectDetail = async () => {
      try {
        const { data } = await axios.get(
          `https://crm-generalize.dentalguru.software/api/super-admin-all-project/${user?.staff_org_id}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setProjects(data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };
    fetchProjectDetail();
  }, [userId, user?.staff_org_id, token]);

  // Filtered projects
  const filteredProjects = projects.filter(
    (p) =>
      p.project_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
  const paginatedProjects = filteredProjects.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageClick = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, currentPage + 2);

    if (startPage > 1) {
      pages.push(1);
      if (startPage > 2) pages.push("...");
    }

    // Visible middle pages
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    // Always show last page
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) pages.push("...");
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="flex mt-20">
      <div className="w-full min-h-screen bg-[#F9FAFF] p-4">
        <h2 className="text-2xl text-center font-semibold">
          Project Wise Social Integration
        </h2>
        <div className="mx-auto h-[3px] w-16 bg-cyan-600 my-3"></div>

        {/* Search Bar */}
        <div className="flex justify-end mb-4">
          <input
            type="text"
            placeholder="Search by project or location..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="border w-[20rem] px-4 py-2 rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-cyan-300"
          />
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-xl shadow-md bg-white">
          <table className="w-full table-auto border-collapse">
            <thead className="bg-cyan-600 text-white">
              <tr>
                <th className="px-4 py-3 text-left">#</th>
                <th className="px-4 py-3 text-left">Project Name</th>
                <th className="px-4 py-3 text-left">Location</th>
                <th className="px-4 py-3 text-left">Total Unit</th>
                <th className="px-4 py-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedProjects.length > 0 ? (
                paginatedProjects.map((project, index) => (
                  <tr
                    key={project.main_project_id}
                    className="border-b hover:bg-gray-100"
                  >
                    <td className="px-4 py-2">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>
                    <td className="px-4 py-2 capitalize">
                      {project.project_name}
                    </td>
                    <td className="px-4 py-2 uppercase">{project.location}</td>
                    <td className="px-4 py-2">{project.total_units}</td>
                    <td className="px-4 py-2 text-center">
                      <Link
                        to={`/social-media-superleads/${project.project_id}`}
                        className="bg-cyan-600 hover:bg-cyan-700 text-white px-3 py-1 rounded-lg transition"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="4"
                    className="text-center text-gray-500 py-6 italic"
                  >
                    No matching projects found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination with numbers + ellipsis */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-6 space-x-2">
            {/* Prev Button */}
            <button
              onClick={() => handlePageClick(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded-md border ${
                currentPage === 1
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              Prev
            </button>

            {/* Numbered Pages */}
            {getPageNumbers().map((page, idx) => (
              <button
                key={idx}
                onClick={() => page !== "..." && handlePageClick(page)}
                disabled={page === "..."}
                className={`px-3 py-1 rounded-md border ${
                  page === currentPage
                    ? "bg-cyan-600 text-white"
                    : page === "..."
                    ? "bg-white text-gray-400 cursor-default"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                {page}
              </button>
            ))}

            {/* Next Button */}
            <button
              onClick={() => handlePageClick(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded-md border ${
                currentPage === totalPages
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default SuperMainSocialMediaByProjectContent;
