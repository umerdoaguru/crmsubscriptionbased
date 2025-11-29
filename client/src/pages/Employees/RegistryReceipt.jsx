import React, { useEffect, useState } from "react";

const RegistryReceipt = () => {
  const [registry, setRegistry] = useState(null);
  console.log(registry);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const regData = urlParams.get("data");

    if (regData) {
      setRegistry(JSON.parse(decodeURIComponent(regData)));
    }
  }, []);

  const handlePrint = () => {
    window.print();
  };

  if (!registry) return <p>Loading receipt...</p>;

  return (
    <div className="p-10 max-w-3xl mx-auto bg-white shadow-xl border rounded-md mt-5">
      {/* HEADER */}
      <div className="text-center border-b pb-4">
        <h1 className="text-3xl font-bold text-gray-800">Registry Receipt</h1>
        <p className="text-gray-500">Official Registry Payment Confirmation</p>
      </div>

      {/* COMPANY DETAILS */}
      <div className="mt-6 text-sm">
        <h2 className="font-semibold text-gray-700 mb-1">Company Details</h2>
        <p>{registry.company_name}</p>
        <p>{registry.company_address}</p>
        <p>Email: {registry.email_id}</p>
        <p>Phone: {registry.moblie_no}</p>
      </div>

      {/* REGISTRY INFO */}
      <div className="mt-6 border-t pt-4">
        <h2 className="text-lg font-bold text-gray-700 mb-3">
          Registry Information
        </h2>

        <table className="w-full text-sm">
          <tbody>
            <tr>
              <td className="font-semibold py-1">Receipt No:</td>
              <td>REG-{registry.registry_id}</td>
            </tr>

            <tr>
              <td className="font-semibold py-1">Registry Date:</td>
              <td>{registry.registry_date}</td>
            </tr>

            <tr>
              <td className="font-semibold py-1">Registry Amount:</td>
              <td>₹ {registry.registry_amount}</td>
            </tr>

            <tr>
              <td className="font-semibold py-1">Payment Status:</td>
              <td
                className={`font-semibold ${
                  registry.registry_pay_status === "paid"
                    ? "text-green-700"
                    : "text-red-600"
                }`}
              >
                {registry.registry_pay_status}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* OWNER DETAILS */}
      <div className="mt-6">
        <h2 className="text-lg font-bold text-gray-700 mb-2">
          Customer / Owner Details
        </h2>

        <table className="w-full text-sm">
          <tbody>
            <tr>
              <td className="font-semibold py-1">Owner Name:</td>
              <td>{registry.owner_name}</td>
            </tr>

            <tr>
              <td className="font-semibold py-1">Email:</td>
              <td>{registry.owner_email}</td>
            </tr>

            <tr>
              <td className="font-semibold py-1">Phone:</td>
              <td>{registry.owner_phone}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* PROJECT + UNIT DETAILS */}
      <div className="mt-6">
        <h2 className="text-lg font-bold text-gray-700 mb-2">
          Project & Unit Details
        </h2>

        <table className="w-full text-sm">
          <tbody>
            <tr>
              <td className="font-semibold py-1">Project Name:</td>
              <td>{registry.project_name}</td>
            </tr>

            <tr>
              <td className="font-semibold py-1">Unit Number:</td>
              <td>{registry.unit_number}</td>
            </tr>

            <tr>
              <td className="font-semibold py-1">Unit Type:</td>
              <td>{registry.unit_type}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* REGISTRY DOCUMENT */}
      <div className="mt-6">
        <h2 className="text-lg font-bold text-gray-700 mb-2">
          Registry Document
        </h2>

        {registry.registry_document_url ? (
          <a
            href={`https://crm-generalize.dentalguru.software/${registry.registry_document_url}`}
            target="_blank"
            className="text-blue-600 underline"
          >
            Click to View Uploaded Registry Document
          </a>
        ) : (
          <p className="text-gray-600 text-sm">No document uploaded</p>
        )}
      </div>

      {/* NOTES */}
      {registry.registry_notes && (
        <div className="mt-6">
          <h2 className="text-lg font-bold text-gray-700 mb-2">Notes</h2>
          <p className="text-gray-700 text-sm">{registry.registry_notes}</p>
        </div>
      )}

      {/* FOOTER */}
      <div className="mt-10 text-center text-xs text-gray-500 border-t pt-4">
        This is a system-generated registry receipt. No signature required.
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

export default RegistryReceipt;
