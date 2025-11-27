import React, { useEffect, useState } from "react";

const BookingReceipt = () => {
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const bookingData = urlParams.get("data");

    if (bookingData) {
      setBooking(JSON.parse(decodeURIComponent(bookingData)));
    }
  }, []);

  const handlePrint = () => {
    window.print();
  };

  if (!booking) return <p>Loading receipt...</p>;

  return (
    <div className="p-10 max-w-3xl mx-auto bg-white shadow-xl border rounded-md mt-5">
      {/* HEADER */}
      <div className="text-center border-b pb-4">
        <h1 className="text-3xl font-bold text-gray-800">Booking Receipt</h1>
        <p className="text-gray-500">
          Real Estate Customer Booking Confirmation
        </p>
      </div>

      {/* COMPANY INFO */}
      <div className="mt-6 text-sm">
        <h2 className="font-semibold text-gray-700 mb-1">Company Details</h2>
        <p>{booking.company_name}</p>
        <p>{booking?.company_address}</p>
        <p>Email: {booking?.email_id}</p>
        <p>Phone: {booking?.moblie_no}</p>
      </div>

      {/* RECEIPT INFO */}
      <div className="mt-6 border-t pt-4">
        <h2 className="text-lg font-bold text-gray-700 mb-3">
          Receipt Information
        </h2>

        <table className="w-full text-sm">
          <tbody>
            <tr>
              <td className="font-semibold py-1">Receipt No:</td>
              <td>RCP-{booking.booking_id}</td>
            </tr>
            <tr>
              <td className="font-semibold py-1">Booking Date:</td>
              <td>{booking.booking_date}</td>
            </tr>
            <tr>
              <td className="font-semibold py-1">Payment Status:</td>
              <td className="text-green-700 font-semibold">
                {booking.booking_pay_status}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* OWNER INFO */}
      <div className="mt-6">
        <h2 className="text-lg font-bold text-gray-700 mb-2">
          Customer Details
        </h2>
        <table className="w-full text-sm">
          <tbody>
            <tr>
              <td className="font-semibold py-1">Owner Name:</td>
              <td>{booking.owner_name}</td>
            </tr>
            <tr>
              <td className="font-semibold py-1">Email:</td>
              <td>{booking.owner_email}</td>
            </tr>
            <tr>
              <td className="font-semibold py-1">Phone:</td>
              <td>{booking.owner_phone}</td>
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
              <td>{booking.project_name}</td>
            </tr>
            <tr>
              <td className="font-semibold py-1">Unit Type:</td>
              <td>{booking.unit_type}</td>
            </tr>
            <tr>
              <td className="font-semibold py-1">Unit Number:</td>
              <td>{booking.unit_number}</td>
            </tr>
            <tr>
              <td className="font-semibold py-1">Booking Amount:</td>
              <td>₹ {booking.booking_amount}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* NOTES */}
      {booking.booking_notes && (
        <div className="mt-6">
          <h2 className="text-lg font-bold text-gray-700 mb-2">Notes</h2>
          <p className="text-gray-700 text-sm">{booking.booking_notes}</p>
        </div>
      )}

      {/* FOOTER */}
      <div className="mt-10 text-center text-xs text-gray-500 border-t pt-4">
        This is a system-generated receipt. No signature required.
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

export default BookingReceipt;
