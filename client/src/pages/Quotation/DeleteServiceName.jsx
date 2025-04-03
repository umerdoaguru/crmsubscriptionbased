import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

function DeleteServiceName() {
  const [serviceList, SetServiceList] = useState([]);
  const serviceId = useSelector((state) => state.auth.user.id);

  const fetchServicelist = async () => {
    try {
      const response = await axios.get(`https://crmdemo.vimubds5.a2hosted.com/api/servicelist`);
      if (response.status === 200) {
        SetServiceList(response.data);
      }
    } catch (error) {
      console.log("Error fetching ServiceList", error);
    }
  };

  useEffect(() => {
    fetchServicelist();
  }, []);

  const handleDelete = async (service_Id) => {
    const isConfirmed = window.confirm(
      "Are You Sure You Want to delete this Service Name?"
    );
    if (isConfirmed) {
      try {
        const response = await axios.delete(
          `https://crmdemo.vimubds5.a2hosted.com/api/servicelist/${service_Id}`
        );
        if (response.status === 200) {
          console.log("Service Name Deleted successfully");
          fetchServicelist();
        }
      } catch {
        console.log("Error deleting Service Name");
      }
    }
  };

  return (
    <>
      <Link to={`/servicenamelist`} className="btn btn-success mt-3 mx-2">
        <i className="bi bi-arrow-return-left"></i> Back
      </Link>
      <div className="container mt-3">
        <h1>Delete Service Name</h1>
        <ul
          className="list-group"
          style={{ maxHeight: "700px", overflowY: "auto" }}
        >
          {serviceList.map((service) => (
            <li key={service.service_id} className="list-group-item">
              {service.service_name}
              <button
                className="btn btn-danger float-end"
                onClick={() => handleDelete(service.service_id)}
              >
                Delete Service Name
              </button>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default DeleteServiceName;
