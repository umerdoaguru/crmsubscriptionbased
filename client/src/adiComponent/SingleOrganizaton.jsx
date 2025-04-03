import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import MainHeader from "../components/MainHeader";

const SingleOrganization = () => {
  const { id } = useParams();
  const [organization, setOrganization] = useState(null);
  const [error, setError] = useState(null); // To handle any errors

  useEffect(() => {
    fetchOrganization();
  }, [id]);

  const fetchOrganization = async () => {
    try {
      const response = await axios.get(
        `https://crmdemo.vimubds5.a2hosted.com/api/getOrganization/${id}`
      );
      setOrganization(response.data.organization);
    } catch (error) {
      console.error("Error fetching organization:", error);
      setError("Failed to load organization details. Please try again later.");
    }
  };

  if (error) {
    return <div className="text-red-500">{error}</div>; // Show error message if there is an error
  }

  if (!organization) {
    return <div className="text-center text-gray-600">Loading...</div>; // Show loading while fetching organization details
  }

  // Basic validation: Display default placeholders if any critical data is missing
  const displayLogo = organization.logo
    ? organization.logo
    : "/default-logo.png";
  const displaySignature = organization.signature
    ? organization.signature
    : "/default-signature.png";
  const displayContact =
    organization.contact || "No contact information available";
  const displayBankDetails =
    organization.bankDetails || "No bank details available";
  const displayEmail = organization.email_id || "No email provided";
  const displayBankName = organization.bankname || "No bank name provided";
  const displayIfscCode = organization.ifsc_code || "No IFSC code provided";
  const displayAccNo = organization.acc_no || "No account number provided";
  const displayType = organization.type || "No account type provided";
  const displayZipCode = organization.zip_code || "No ZIP code provided";
  const displayLocation = organization.location || "No location provided";
  const displayDistrict = organization.district || "No district provided";

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-50 to-gray-100">
        <div className="w-full max-w-4xl p-10 bg-white rounded-lg shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-extrabold text-gray-800">
              {organization.name || "No Name Available"}
            </h2>
            <img
              src={displayLogo}
              alt="Company Logo"
              className="object-cover w-24 h-24 border-2 border-gray-300 rounded-lg shadow-sm"
            />
          </div>

          <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2">
            <div>
              <h4 className="text-lg font-semibold text-gray-600">Contact:</h4>
              <p className="text-gray-700">{displayContact}</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-gray-600">Email:</h4>
              <p className="text-gray-700">{displayEmail}</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-gray-600">
                Bank Name:
              </h4>
              <p className="text-gray-700">{displayBankName}</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-gray-600">
                IFSC Code:
              </h4>
              <p className="text-gray-700">{displayIfscCode}</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-gray-600">
                Account Number:
              </h4>
              <p className="text-gray-700">{displayAccNo}</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-gray-600">
                Account Type:
              </h4>
              <p className="text-gray-700">{displayType}</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-gray-600">ZIP Code:</h4>
              <p className="text-gray-700">{displayZipCode}</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-gray-600">Location:</h4>
              <p className="text-gray-700">{displayLocation}</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-gray-600">District:</h4>
              <p className="text-gray-700">{displayDistrict}</p>
            </div>
          </div>

          <div className="mb-8">
            <h4 className="text-lg font-semibold text-gray-600">
              Bank Details:
            </h4>
            <pre className="p-4 text-gray-800 rounded-lg shadow-inner bg-gray-50">
              {displayBankDetails}
            </pre>
          </div>

          <div className="mb-8">
            <h4 className="text-lg font-semibold text-gray-600">Signature:</h4>
            <img
              src={displaySignature}
              alt="Signature"
              className="w-32 h-32 border-2 border-gray-300 rounded-lg shadow-sm"
            />
          </div>

          <div className="flex justify-between mt-6">
            <button
              onClick={() => window.history.back()}
              className="px-6 py-2 font-semibold text-white transition duration-200 bg-blue-600 rounded-lg shadow-lg hover:bg-blue-700"
            >
              Back
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SingleOrganization;
