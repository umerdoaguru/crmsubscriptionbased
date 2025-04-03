import React, { useEffect, useState } from "react";
import axios from "axios";
import ReactPaginate from "react-paginate";
import { FaTrash, FaEdit} from "react-icons/fa";
import cogoToast from "cogo-toast";
import { Link} from "react-router-dom";
import { useSelector } from "react-redux";

const Projectshow = () => {
  const [projects, setProjects] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [projectsPerPage] = useState(7);
  const [showModal, setShowModal] = useState(false);
  const [editProject, setEditProject] = useState({});
  const [addProject, setAddProject] = useState();
  const adminuser = useSelector((state) => state.auth.user);
  const token = adminuser.token;

  
  const [formData, setFormData] = useState({
    projectName: "",
    location: "",
    total_area: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("https://crmdemo.vimubds5.a2hosted.com/api/project-add", formData);

      if (response.status === 200) {
        cogoToast.success("Project added successfully!", { position: "top-right" });
        setAddProject(false);
        const newProject = response.data;
        setProjects((prevProjects) => [newProject, ...prevProjects]);
        fetchProjects();
        setFormData({
          projectName: "",
          location: "",
          total_area: "",
        });
      } else {
        cogoToast.error("Failed to add project.", { position: "top-right" });
      }
    } catch (error) {
      console.error("Error submitting the form:", error);
      cogoToast.error("An error occurred while submitting the form.", { position: "top-right" });
    }
  };

  const handleAddProject = () => {
    setAddProject(true);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const { data } = await axios.get("https://crmdemo.vimubds5.a2hosted.com/api/all-project",
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }});
      setProjects(data.reverse());
    } catch (error) {
      console.error("Error fetching projects:", error);
      cogoToast.error("An error occurred while fetching the projects.");
    }
  };

  // const handleDelete = async (id) => {

  //   const isConfirmed = window.confirm("Are you sure you want to delete this project?");
  //   if (!isConfirmed) return;
  //   try {
  //     const { data } = await axios.delete(`https://crmdemo.vimubds5.a2hosted.com/api/delete-project/${id}`);
  //     cogoToast.success(data.message || "Project deleted successfully!");
  //     setProjects((prev) => prev.filter((project) => project.main_project_id !== id));
  //   } catch (error) {
  //     console.error("Error deleting project:", error);
  //     cogoToast.error("An error occurred while deleting the project.");
  //   }
  // };

  const handleDelete = async (id) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this project?");
    if (!isConfirmed) return;
  
    try {
      let response;
      try {
        response = await axios.delete(`https://crmdemo.vimubds5.a2hosted.com/api/delete-project/${id}`);
      } catch (error) {
        if (error.response && error.response.status === 400) {
          const userConfirmed = window.confirm(error.response.data.message);
          if (!userConfirmed) return;
          response = await axios.delete(`https://crmdemo.vimubds5.a2hosted.com/api/delete-project/${id}?confirm=true`);
        } else {
          throw error;
        }
      }
      
      const { data } = response;
      cogoToast.success(data.message || "Project deleted successfully!");
      setProjects((prev) => prev.filter((project) => project.main_project_id !== id));
    } catch (error) {
      console.error("Error deleting project:", error);
      cogoToast.error("An error occurred while deleting the project.");
    }
  };
  

  const handleEdit = (project) => {
    setEditProject(project);
    setShowModal(true);
  };

  const handleUpdate = async () => {
    try {
      const { data } = await axios.put(`https://crmdemo.vimubds5.a2hosted.com/api/edit-project/${editProject.main_project_id}`, editProject);
      cogoToast.success(data.message || "Project updated successfully!");
      setProjects((prev) => prev.map((project) => (project.main_project_id === editProject.main_project_id ? editProject : project)));
      setShowModal(false);
    } catch (error) {
      console.error("Error updating project:", error);
      cogoToast.error("An error occurred while updating the project.");
    }
  };

  const itemsPerPage = 4;
  const offset = currentPage * itemsPerPage;
  const currentItems = projects.slice(offset, offset + itemsPerPage);
  const pageCount = Math.ceil(projects.length / itemsPerPage);

const handlePageClick = ({ selected }) => {
  setCurrentPage(selected);
};

  return (
    <div className="p-4 mt-6 bg-white rounded-lg shadow-lg mx-7 mb-2">
      <div className="flex justify-between items-center">
      <h3 className="mb-4 text-lg font-semibold">All Projects</h3>
      <button
        onClick={handleAddProject}
        className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
      >
        Add Project
      </button>
    </div>

      <div className="overflow-x-auto mt-4">
        <table className="min-w-full bg-white border">
          <thead>
            <tr>
              <th className="px-6 py-3 border-b-2 border-gray-300">S.no</th>
              <th className="px-6 py-3 border-b-2 border-gray-300">Project Name</th>
              <th className="px-6 py-3 border-b-2 border-gray-300">Project ID</th>
              <th className="px-6 py-3 border-b-2 border-gray-300">Location</th>
              <th className="px-6 py-3 border-b-2 border-gray-300">Total Area</th>
              <th className="px-6 py-3 border-b-2 border-gray-300">Action</th>
              <th className="px-6 py-3 border-b-2 border-gray-300">Unit Profile</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length > 0 ? (
              currentItems.map((project, index) => (
                <tr key={project.main_project_id} className={index % 2 === 0 ? "bg-gray-100" : ""}>
                  <td className="px-6 py-4 border-b border-gray-200 text-gray-800">{currentPage * projectsPerPage + index + 1}</td>
                  <td className="px-6 py-4 border-b border-gray-200 text-gray-800">{project.project_name}</td>
                  <td className="px-6 py-4 border-b border-gray-200 text-gray-800">{project.main_project_id }</td>
                  <td className="px-6 py-4 border-b border-gray-200 text-gray-800">{project.location}</td>
                  <td className="px-6 py-4 border-b border-gray-200 text-gray-800">{project.total_area}</td>
                  <td className="px-6 py-4 border-b border-gray-200 text-gray-800">
                    <button onClick={() => handleEdit(project)} className="mr-2 text-blue-600 hover:text-blue-800"><FaEdit /></button>
                    <button onClick={() => handleDelete(project.main_project_id)} className="text-red-600 hover:text-red-800"><FaTrash /></button>
                  </td>
                  <td className="px-6 py-4 border-b border-gray-200 text-gray-800">
                    
                  <Link to={`/project-units/${project.main_project_id}`} className="inline-block">
                  <button className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition">
                   Profile
                  </button>
                  </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-gray-500">No Data Available</td>
              </tr>
            )}
          </tbody>
         
        </table>
      </div>
      
      <div className="mt-4 flex justify-center">
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

      {addProject && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4 z-[9999]">
        <div className="bg-white shadow-xl rounded-2xl w-full max-w-3xl p-8 transition-all transform scale-95 hover:scale-100">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-6 text-center">Add Real Estate Project</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Project Name</label>
              <input
                type="text"
                name="projectName"
                value={formData.projectName}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm"
                placeholder="Enter project name"
              />
            </div>
      
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm"
                placeholder="Enter project location"
              />
            </div>
      
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Total Area</label>
              <input
                type="text"
                name="total_area"
                value={formData.total_area}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm"
                placeholder="e.g., 5000sqft, 40000sqft"
              />
            </div>
      
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => setAddProject(false)}
                className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-all shadow-md"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all shadow-md"
              >
                Add Project
              </button>
            </div>
          </form>
        </div>
      </div>
      )}

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[9999]">
        <div className="bg-white p-6 rounded-lg">
          <h2 className="text-xl mb-4">Edit Project</h2>
          
          <div> 
          <label className="block text-gray-600 mb-1">Projct Name</label>
          <input type="text" value={editProject.project_name} onChange={(e) => setEditProject({ ...editProject, project_name: e.target.value })} className="border p-2 w-full mb-2" placeholder="Project Name" />
          </div>

          <div>
          <label className="block text-gray-600 mb-1">Location</label>
          <input type="text" value={editProject.location} onChange={(e) => setEditProject({ ...editProject, location: e.target.value })} className="border p-2 w-full mb-2" placeholder="Location" />
          </div>
          <div>             
          <label className="block text-gray-600 mb-1">Total Area</label>
          <input type="text" value={editProject.total_area} onChange={(e) => setEditProject({ ...editProject, total_area: e.target.value })} className="border p-2 w-full mb-2" placeholder="Total Area" min={0}
              onKeyDown={(e) => {
                if (e.key === '-' || e.key === 'Subtract') {
                  e.preventDefault();
                }
              }}/>
          </div>

          <div className="flex justify-end">
            <button onClick={() => setShowModal(false)} className="mr-2 bg-gray-300 px-4 py-2 rounded">Cancel</button>
            <button onClick={handleUpdate} className="bg-blue-500 text-white px-4 py-2 rounded">Update</button>
          </div>
        </div>
      </div>
      )}

       
    </div>
  );
};

export default Projectshow;