import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

function UpdateServiceList() {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const userId = useSelector((state) => state.auth.user.id);
  const [updatedServices, setUpdatedServices] = useState([]);

  const fetchServiceList = async () => {
    try {
      const response = await axios.get(`http://localhost:9000/api/servicelist`);
      if (response.status === 200) {
        setServices(response.data);
        // Initialize updatedServices state with the fetched services
        setUpdatedServices(response.data.map((service) => ({ ...service })));
      }
    } catch (error) {
      console.error("Error fetching ServiceList", error);
    }
  };

  useEffect(() => {
    fetchServiceList();
  }, []);

  const handleUpdate = async () => {
    try {
      const response = await axios.put(
        `http://localhost:9000/api/servicelist`,
        {
          services: updatedServices,
        }
      );
      if (response.data.success) {
        console.log("Services updated successfully");
        navigate(`/servicenamelist`);
      }
    } catch (error) {
      console.error("Error updating services:", error);
    }
  };

  const handleChange = (index, event) => {
    const updatedServiceList = [...updatedServices];
    updatedServiceList[index] = {
      ...updatedServiceList[index],
      service_name: event.target.value,
    };
    setUpdatedServices(updatedServiceList);
  };

  return (
    <>
      <Link
        to={`/servicenamelist`}
        className="bg-green-500 hover:bg-green-600 text-white mt-3 mx-2 py-2 px-4 rounded"
      >
        <i className="bi bi-arrow-return-left"></i> Back
      </Link>
      <div className="container mx-auto mt-4">
        <h1 className="text-2xl font-bold mb-4">Update Services Name</h1>
        <div className="space-y-4">
          {services.map((service, index) => (
            <div key={index}>
              <input
                type="text"
                className="w-full border border-gray-300 rounded p-2 mt-2"
                value={
                  updatedServices[index]
                    ? updatedServices[index].service_name
                    : service.service_name
                }
                onChange={(event) => handleChange(index, event)}
              />
            </div>
          ))}
          <button
            className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded mt-3"
            onClick={handleUpdate}
          >
            Update Services Name
          </button>
        </div>
      </div>
    </>
  );
}

export default UpdateServiceList;
