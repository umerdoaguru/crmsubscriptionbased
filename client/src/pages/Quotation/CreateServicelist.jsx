import React, { useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Sider from "../../components/Sider";
import MainHeader from "../../components/MainHeader";

const CreateServicelist = () => {
  const navigate = useNavigate();
  const userId = useSelector((state) => state.auth.user.id);
  const [services, setServices] = useState([{ service_name: "" }]); // Initialize with an empty service

  const addService = () => {
    setServices([...services, { service_name: "" }]);
  };

  const handleServiceChange = (index, event) => {
    const newServices = [...services];
    newServices[index].service_name = event.target.value;
    setServices(newServices);
  };

  const removeService = (index) => {
    const updatedServices = [...services];
    updatedServices.splice(index, 1);
    setServices(updatedServices);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        `http://localhost:9000/api/create-servicelist`,
        {
          services: services.filter(
            (service) => service.service_name.trim() !== ""
          ), // Filter out empty services
        }
      );
      console.log(response.data); // Log the response from the server
      navigate("/servicenamelist");
    } catch (error) {
      console.error("Error creating services:", error);
    }
  };

  return (
    <>
      <MainHeader />
      <Sider />
      <div className="container mt-5 px-2 mx-auto p-4">
        <Link
          to={`/servicenamelist`}
          className="bg-green-500 hover:bg-green-600 text-white mt-3 mx-2 py-2 px-4 rounded"
        >
          <i className="bi bi-arrow-return-left"></i> Back
        </Link>

        <div className="container mx-auto mt-4">
          <h2 className="text-2xl font-bold mb-4">Create Services</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {services.map((service, index) => (
              <div
                className="flex justify-between items-center space-x-2"
                key={index}
              >
                <input
                  className="form-input w-3/4 border border-gray-300 rounded p-2 mt-2"
                  type="text"
                  value={service.service_name}
                  onChange={(event) => handleServiceChange(index, event)}
                  placeholder="Enter service name"
                />
                <button
                  type="button"
                  className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded mt-2"
                  onClick={() => removeService(index)}
                >
                  Remove
                </button>
              </div>
            ))}
            <div>
              <button
                type="button"
                className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded mt-3"
                onClick={addService}
              >
                Add Service
              </button>
            </div>
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded mt-3"
            >
              Create Services
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default CreateServicelist;
