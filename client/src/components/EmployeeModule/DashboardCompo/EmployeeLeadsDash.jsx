import React, { useState } from "react";
import EmployeeLeadsReport from "./EmployeeLeadsReport";
import EmpMetaLeads from "./EmpMetaLeads";
import EmpWebLeads from "./EmpWebLeads";
import EmpGoogleLeads from "./EmpGoogleLeads";

const EmployeeLeadsDash = () => {
  const [activeTab, setActiveTab] = useState("general");

  const tabs = [
    { id: "general", label: "General" },
    { id: "meta", label: "Meta" },
    { id: "website", label: "Website" },
    { id: "google", label: "Google" },
  ];

  const renderComponent = () => {
    switch (activeTab) {
      case "general":
        return <EmployeeLeadsReport />;
      case "meta":
        return <EmpMetaLeads />;
      case "website":
        return <EmpWebLeads />;
      case "google":
        return <EmpGoogleLeads />;
      default:
        return <EmployeeLeadsReport />;
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">
        Leads Dashboard
      </h2>

      {/* Tabs */}
      <div className="flex flex-wrap gap-3 mb-6 border-b border-gray-200 pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-2 sm:px-5 py-2 rounded-md font-medium text-sm transition-all duration-200 
              ${
                activeTab === tab.id
                  ? "bg-sky-600 text-white shadow-md"
                  : "bg-gray-300 text-gray-700 hover:bg-gray-200"
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Render Selected Tab */}
      <div className="mt-4">{renderComponent()}</div>
    </div>
  );
};

export default EmployeeLeadsDash;
