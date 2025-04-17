import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import cogoToast from "cogo-toast"; 

const SuperRealEstateProjectForm = () => {
  const [formData, setFormData] = useState({
    projectName: "",
    projectId: "",
    location: "",
    total_area: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:9000/api/project-add", formData);

      if (response.status === 200) {
        cogoToast.success("Project added successfully!", { position: "top-right" });
        navigate("/");
      } else {
        cogoToast.error("Failed to add project.", { position: "top-right" });
      }
    } catch (error) {
      console.error("Error submitting the form:", error);
      cogoToast.error("An error occurred while submitting the form.", { position: "top-right" });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white shadow-lg rounded-lg w-full max-w-4xl p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Add Real Estate Project</h1>
        <form onSubmit={handleSubmit}>
          {/* Project Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-gray-600 mb-1">Project Name</label>
              <input
                type="text"
                name="projectName"
                value={formData.projectName}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Enter project name"
              />
            </div>
            <div>
              <label className="block text-gray-600 mb-1">Project ID</label>
              <input
                type="text"
                name="projectId"
                value={formData.projectId}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Enter unique project ID"
              />
            </div>
          </div>

          {/* Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-gray-600 mb-1">Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Enter project location"
              />
            </div>
            <div>
              <label className="block text-gray-600 mb-1">Total Area</label>
              <input
                type="text"
                name="total_area"
                value={formData.total_area}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="e.g., 1BHK, 2BHK"
              />
            </div>
          </div>

          {/* Submission Buttons */}
          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="bg-gray-600 text-white px-6 py-2 rounded-md hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
            >
              Add Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SuperRealEstateProjectForm;
