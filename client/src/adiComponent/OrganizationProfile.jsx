import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import MainHeader from '../components/MainHeader';

const OrganizationProfile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { organization } = location.state;  // Passed organization data from navigation

  return (
    <>
     
    
     <div className="flex min-h-screen">
      <div className="flex-1 p-6">
        <button 
          className="mb-4 text-blue-500"
          onClick={() => navigate(-1)}
        >
          Back to Overview
        </button>

        <h2 className="text-2xl font-bold mb-4">{organization.name}'s Profile</h2>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div>
            <h3 className="font-semibold">Contact Information:</h3>
            <p>{organization.contact}</p>
          </div>

          <div>
            <h3 className="font-semibold">Bank Details:</h3>
            <p>{organization.bankDetails}</p>
          </div>

          <div>
            <h3 className="font-semibold">Logo:</h3>
            {organization.logo ? (
              <img src={`${organization.logo}`} alt={`${organization.name} Logo`} className="object-cover w-24 h-24" />
            ) : (
              <p>No Logo Available</p>
            )}
          </div>

          <div>
            <h3 className="font-semibold">Signature:</h3>
            {organization.signature ? (
              <img src={`${organization.signature}`} alt={`${organization.name} Signature`} className="object-cover w-24 h-24" />
            ) : (
              <p>No Signature Available</p>
            )}
          </div>
        </div>

        {/* Add any other information you'd like to display */}

        {/* Optional Edit Button */}
        <button 
          className="mt-8 px-4 py-2 bg-green-500 text-white rounded"
          onClick={() => navigate(`/editOrganization/${organization.companyId}`, { state: { organization } })}
        >
          Edit Organization
        </button>
      </div>
    </div>
    </>
   
  );
};

export default OrganizationProfile;
