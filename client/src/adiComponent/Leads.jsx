import React, { useState } from "react";
import { BsPencilSquare, BsTrash, BsPlusCircle } from "react-icons/bs";
import Sider from "../components/Sider";

const Leads = () => {
  // Sample state data for leads
  const [leads, setLeads] = useState([
    {
      id: "LEAD001",
      name: "John Doe",
      number: "+1 234 567 890",
      address: "1234 Elm St, Springfield",
      interestedIn: "Product A",
      priority: "High",
    },
    {
      id: "LEAD002",
      name: "Jane Smith",
      number: "+1 987 654 321",
      address: "5678 Oak St, Shelbyville",
      interestedIn: "Service B",
      priority: "Medium",
    },
  ]);

  // State to manage new lead data and form visibility
  const [newLead, setNewLead] = useState({
    id: "",
    name: "",
    number: "",
    address: "",
    interestedIn: "",
    priority: "",
  });
  
  const [editingIndex, setEditingIndex] = useState(null); // Track editing index
  const [showForm, setShowForm] = useState(false); // State for form visibility

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewLead((prev) => ({ ...prev, [name]: value }));
  };

  // Add or Edit a lead
  const handleSaveLead = () => {
    if (editingIndex !== null) {
      // Edit existing lead
      const updatedLeads = [...leads];
      updatedLeads[editingIndex] = newLead;
      setLeads(updatedLeads);
      setEditingIndex(null);
    } else {
      // Add a new lead
      setLeads((prev) => [...prev, { ...newLead, id: `LEAD${leads.length + 1}` }]);
    }

    setNewLead({ id: "", name: "", number: "", address: "", interestedIn: "", priority: "" });
    setShowForm(false); // Hide the form after saving
  };

  // Edit a lead
  const handleEditLead = (index) => {
    const leadToEdit = leads[index];
    setNewLead(leadToEdit);
    setEditingIndex(index);
    setShowForm(true); // Show the form when editing
  };

  // Delete a lead
  const handleDeleteLead = (index) => {
    setLeads(leads.filter((_, i) => i !== index));
  };

  return (
    <div className="flex min-h-screen">
      <Sider />
      <main className="flex-1 p-6 ml-0 lg:p-8 lg:ml-64 xl:ml-80">
        {/* Top Section: Title and Add Lead Button */}
        <div className="flex flex-col items-start justify-between mb-8 lg:flex-row lg:items-center">
          <h2 className="mb-4 text-2xl font-bold text-gray-800 lg:mb-0">Leads Overview</h2>
          <button
            onClick={() => { setShowForm(true); setEditingIndex(null); }} // Reset form for new entry
            className="flex items-center px-4 py-2 text-white transition duration-200 bg-blue-500 rounded-lg shadow-lg hover:bg-blue-600"
          >
            <BsPlusCircle className="mr-2" /> Add Lead
          </button>
        </div>

        {/* Table for Displaying Leads */}
        <div className="overflow-x-auto rounded-lg shadow-md">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="text-sm font-semibold text-left text-gray-600 uppercase bg-gray-200">
                <th className="px-4 py-3 sm:px-6">Lead ID</th>
                <th className="px-4 py-3 sm:px-6">Name</th>
                <th className="px-4 py-3 sm:px-6">Number</th>
                <th className="px-4 py-3 sm:px-6">Address</th>
                <th className="px-4 py-3 sm:px-6">Interested In</th>
                <th className="px-4 py-3 sm:px-6">Priority</th>
                <th className="px-4 py-3 sm:px-6">Actions</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead, index) => (
                <tr key={index} className="border-b border-gray-200 hover:bg-gray-100">
                  <td className="px-4 py-4 sm:px-6">{lead.id}</td>
                  <td className="px-4 py-4 sm:px-6">{lead.name}</td>
                  <td className="px-4 py-4 sm:px-6">{lead.number}</td>
                  <td className="px-4 py-4 sm:px-6">{lead.address}</td>
                  <td className="px-4 py-4 sm:px-6">{lead.interestedIn}</td>
                  <td className="px-4 py-4 sm:px-6">{lead.priority}</td>
                  <td className="px-4 py-4 sm:px-6">
                    <div className="flex space-x-2 sm:space-x-4">
                      <button
                        onClick={() => handleEditLead(index)}
                        className="text-blue-500 transition duration-200 hover:text-blue-600"
                      >
                        <BsPencilSquare size={20} />
                      </button>
                      <button
                        onClick={() => handleDeleteLead(index)}
                        className="text-red-500 transition duration-200 hover:text-red-600"
                      >
                        <BsTrash size={20} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Form for Adding or Editing a Lead */}
        {showForm && (
          <div className="p-4 mt-8 bg-white rounded-lg shadow-md">
            <h3 className="mb-4 text-lg font-bold">{editingIndex !== null ? "Edit Lead" : "Add Lead"}</h3>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <input
                type="text"
                name="name"
                value={newLead.name}
                onChange={handleInputChange}
                placeholder="Lead Name"
                className="p-2 border rounded-lg"
              />
              <input
                type="text"
                name="number"
                value={newLead.number}
                onChange={handleInputChange}
                placeholder="Contact Number"
                className="p-2 border rounded-lg"
              />
              <input
                type="text"
                name="address"
                value={newLead.address}
                onChange={handleInputChange}
                placeholder="Address"
                className="p-2 border rounded-lg"
              />
              <input
                type="text"
                name="interestedIn"
                value={newLead.interestedIn}
                onChange={handleInputChange}
                placeholder="Interested In"
                className="p-2 border rounded-lg"
              />
              <input
                type="text"
                name="priority"
                value={newLead.priority}
                onChange={handleInputChange}
                placeholder="Priority (e.g., High, Medium, Low)"
                className="p-2 border rounded-lg"
              />
            </div>
            <div className="flex justify-end mt-4">
              <button
                onClick={handleSaveLead}
                className="px-4 py-2 text-white transition duration-200 bg-green-500 rounded-lg shadow-lg hover:bg-green-600"
              >
                {editingIndex !== null ? "Update Lead" : "Save Lead"}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Leads;
