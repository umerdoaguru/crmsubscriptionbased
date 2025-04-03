const LeadsDisplay = ({ leads }) => {
  return (
    <div className="mt-6">
      <h2 className="text-xl font-bold mb-4">Leads Data</h2>
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-2 px-4 border-b">S.No.</th>
            <th className="py-2 px-4 border-b">Lead ID</th>
            <th className="py-2 px-4 border-b">Full Name</th>
            <th className="py-2 px-4 border-b">Phone Number</th>
            <th className="py-2 px-4 border-b">Street Address</th>
            <th className="py-2 px-4 border-b">Created Time</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead, index) => (
            <tr key={lead.id}>
              <td className="py-2 px-4 border-b">{index+1}</td>
              <td className="py-2 px-4 border-b">{lead.lead_id}</td>
              <td className="py-2 px-4 border-b">{lead.full_name}</td>
              <td className="py-2 px-4 border-b">{lead.phone_number}</td>
              <td className="py-2 px-4 border-b">{lead.street_address}</td>
              <td className="py-2 px-4 border-b">
  {lead.created_time 
    ? `${new Date(lead.created_time).toLocaleDateString('en-GB')} ${new Date(lead.created_time).toLocaleTimeString()}`
    : 'N/A'}
</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LeadsDisplay;
