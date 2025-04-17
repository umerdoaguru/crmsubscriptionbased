import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import UpdateCompanyData from "./UpdateCompanyData";

function MainUpdateCompanyData() {
  const { id } = useParams();
  const navigate = useNavigate();
  const UserId = useSelector((state) => state.auth.user.id);
  const [companyNames, setCompanyNames] = useState([]);

  // const handleUpdateCompanyData = async (CompanyName) => {
  //   navigate(`/updatecompanydata/${id}`);
  // };

  useEffect(() => {
    // Fetch company names from the backend
    const fetchCompanyNames = async () => {
      try {
        const response = await axios.get(
          `http://localhost:9000/api/header-footer-images/company-names/${UserId}`
        );
        if (response.status === 200) {
          setCompanyNames(response.data); // Assuming response.data is an array of company names
          console.log(response);
        } else {
          console.error("Failed to fetch company names");
        }
      } catch (error) {
        console.error("Error fetching company names:", error);
      }
    };

    fetchCompanyNames();
  }, []);

  const handleEditCompany = (company) => {
    navigate(`/updatecompanydata`, { state: { company } });
  };

  return (
    <>
      <div className="container mt-4">
        <h1>Delete Comapany Data </h1>
        <ul className="list-group">
          {companyNames.map((company) => (
            <li key={company} className="list-group-item">
              {company}

              <button
                className="btn btn-success mx-3 float-end"
                onClick={() => handleEditCompany(company)}
              >
                Edit Company
              </button>
            </li>
          ))}
        </ul>
        <br />
        <Link to={`/`} className="btn btn-primary">
          Back
        </Link>
      </div>
    </>
  );
}

export default MainUpdateCompanyData;
