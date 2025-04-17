import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";

function DeleteCompanydata() {
  const { id } = useParams();
  const UserId = useSelector((state) => state.auth.user.id);
  const [companyNames, setCompanyNames] = useState([]);

  const handleDeleteCompanyData = async (CompanyName) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this Company data?"
    );
    if (isConfirmed) {
      try {
        const response = await axios.post(
          "http://localhost:9000/api/companydata",
          {
            company_name: CompanyName,
          }
        );

        if (response.status === 200) {
          console.log("Company Data deleted successfully");
          // Refresh CompanyDatas after deletion
          window.location.reload();
        }
      } catch {
        console.log("Error deleting Company Data");
      }
    }
  };

  useEffect(() => {
    // Fetch company names from the backend
    const fetchCompanyNames = async () => {
      try {
        const response = await axios.get(
          `http://localhost:9000/api/header-footer-images/company-names/${UserId}`
        );
        if (response.status === 200) {
          setCompanyNames(response.data); // Assuming response.data is an array of company names
        } else {
          console.error("Failed to fetch company names");
        }
      } catch (error) {
        console.error("Error fetching company names:", error);
      }
    };

    fetchCompanyNames();
  }, []);

  return (
    <>
      <div className="container mx-auto mt-4 p-4">
        <h1 className="text-2xl font-bold mb-4">Delete Company Data</h1>
        <ul className="list-none">
          {companyNames.map((company) => (
            <li
              key={company}
              className="flex justify-between items-center bg-white p-4 mb-2 border rounded shadow"
            >
              <span>{company}</span>
              <button
                className="btn btn-danger mx-3 bg-red-600 text-white hover:bg-red-700 rounded py-2 px-4"
                onClick={() => handleDeleteCompanyData(company)}
              >
                Delete Company
              </button>
            </li>
          ))}
        </ul>
        <Link
          to={`/`}
          className="btn btn-primary mt-4 bg-blue-600 text-white hover:bg-blue-700 rounded py-2 px-4"
        >
          Back
        </Link>
      </div>
    </>
  );
}

export default DeleteCompanydata;
