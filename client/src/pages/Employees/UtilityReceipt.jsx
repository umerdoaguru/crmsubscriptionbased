import React, { useEffect, useState } from "react";

const UtilityReceipt = () => {
  const [utility, setUtility] = useState(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const utilityData = urlParams.get("data");

    if (utilityData) {
      setUtility(JSON.parse(decodeURIComponent(utilityData)));
    }
  }, []);

  const handlePrint = () => {
    window.print();
  };

  if (!utility) return <p>Loading Utility Receipt...</p>;

  return (
    <div className="p-10 max-w-3xl mx-auto bg-white shadow-xl border rounded-md mt-5">
      {/* HEADER */}
      <div className="text-center border-b pb-4">
        <h1 className="text-3xl font-bold text-gray-800">
          Utility Bill Receipt
        </h1>
        <p className="text-gray-500">Real Estate Utility Charge Confirmation</p>
      </div>

      {/* COMPANY DETAILS */}
      <div className="mt-6 text-sm">
        <h2 className="font-semibold text-gray-700 mb-1">Company Details</h2>
        <p>{utility.company_name}</p>
        <p>{utility.company_address}</p>
        <p>Email: {utility.email_id}</p>
        <p>Phone: {utility.moblie_no}</p>
      </div>

      {/* BILL INFORMATION */}
      <div className="mt-6 border-t pt-4">
        <h2 className="text-lg font-bold text-gray-700 mb-3">
          Utility Billing Information
        </h2>

        <table className="w-full text-sm">
          <tbody>
            <tr>
              <td className="font-semibold py-1">Receipt No:</td>
              <td>UTB-{utility.utility_id}</td>
            </tr>

            <tr>
              <td className="font-semibold py-1">Utility Date:</td>
              <td>{utility.utility_date}</td>
            </tr>

            <tr>
              <td className="font-semibold py-1">Utility Type:</td>
              <td>{utility.utility_type}</td>
            </tr>

            <tr>
              <td className="font-semibold py-1">Utility Amount:</td>
              <td>₹ {utility.utility_amount}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* PROJECT & UNIT DETAILS */}
      <div className="mt-6">
        <h2 className="text-lg font-bold text-gray-700 mb-2">
          Project & Unit Details
        </h2>

        <table className="w-full text-sm">
          <tbody>
            <tr>
              <td className="font-semibold py-1">Project Name:</td>
              <td>{utility.project_name}</td>
            </tr>

            <tr>
              <td className="font-semibold py-1">Unit Number:</td>
              <td>{utility.unit_number}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* DESCRIPTION */}
      {utility.description && (
        <div className="mt-6">
          <h2 className="text-lg font-bold text-gray-700 mb-2">Description</h2>
          <p className="text-gray-700 text-sm">{utility.description}</p>
        </div>
      )}

      {/* FOOTER */}
      <div className="mt-10 text-center text-xs text-gray-500 border-t pt-4">
        This is a system-generated utility receipt. No signature required.
      </div>

      {/* ACTION BUTTONS */}
      <div className="mt-6 flex justify-center gap-4 print:hidden">
        <button
          onClick={handlePrint}
          className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700"
        >
          Print / Save PDF
        </button>

        <button
          onClick={() => window.close()}
          className="bg-gray-500 text-white px-5 py-2 rounded hover:bg-gray-600"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default UtilityReceipt;
