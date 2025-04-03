import React from 'react';

const ResponseTable = ({ responses }) => {
  console.log('Response props:', responses);  // Log the data to ensure it's the correct structure

  // Check if `responses` is an array and has data
  if (!Array.isArray(responses) || responses.length === 0) {
    return <div>No data available or data is in an unexpected format.</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm bg-white border border-gray-200">
        <thead className="bg-gray-200">
          <tr>
            <th className="py-2 px-4 text-left font-semibold text-gray-700">Query ID</th>
            <th className="py-2 px-4 text-left font-semibold text-gray-700">Project Name</th>
            <th className="py-2 px-4 text-left font-semibold text-gray-700">City</th>
            <th className="py-2 px-4 text-left font-semibold text-gray-700">Query Info</th>
            <th className="py-2 px-4 text-left font-semibold text-gray-700">Received On</th>
            <th className="py-2 px-4 text-left font-semibold text-gray-700">Contact Name</th>
            <th className="py-2 px-4 text-left font-semibold text-gray-700">Email</th>
            <th className="py-2 px-4 text-left font-semibold text-gray-700">Phone</th>
          </tr>
        </thead>
        <tbody>
          {responses.map((response, index) => (
            <tr key={index} className="border-b">
              <td className="py-2 px-4">{response.query_id || 'N/A'}</td>
              <td className="py-2 px-4">{response.project_name || 'N/A'}</td>
              <td className="py-2 px-4">{response.city_name || 'N/A'}</td>
              <td className="py-2 px-4">{response.query_info || 'N/A'}</td>
              <td className="py-2 px-4">{response.received_on || 'N/A'}</td>
              <td className="py-2 px-4">{response.contact_name || 'N/A'}</td>
              <td className="py-2 px-4">{response.email || 'N/A'}</td>
              <td className="py-2 px-4">{response.phone || 'N/A'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ResponseTable;
