import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import axios from "axios";

const BookingDetails = () => {
  const { type, id } = useParams();
  const [booking, setBooking] = useState([]);

  const fetchBookingData = async () => {
    try {
      const { data } = await axios.get(
        `https://crm-generalize.dentalguru.software/api/getBookingBYleadId/${id}`
      );
      setBooking(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchBookingData();
  }, []);

  console.log(booking);

  return (
    <>
      <div className="overflow-x-auto">
        <table className="min-w-full whitespace-nowrap bg-white border">
          <thead>
            <tr>
              <th className="px-6 py-3 border-b-2 border-gray-300">
                Booking Date
              </th>
              <th className="px-6 py-3 border-b-2 border-gray-300">
                Booking Amount
              </th>
              <th className="px-6 py-3 border-b-2 border-gray-300">
                Owner Name
              </th>
              <th className="px-6 py-3 border-b-2 border-gray-300">
                Owner Email
              </th>
              <th className="px-6 py-3 border-b-2 border-gray-300">
                Owner Phone
              </th>

              <th className="px-6 py-3 border-b-2 border-gray-300">Project</th>
              <th className="px-6 py-3 border-b-2 border-gray-300">
                Project Id
              </th>
              <th className="px-6 py-3 border-b-2 border-gray-300">
                Unit Type
              </th>
              <th className="px-6 py-3 border-b-2 border-gray-300">
                Unit Number
              </th>
              <th className="px-6 py-3 border-b-2 border-gray-300">
                Unit Status
              </th>
              <th className="px-6 py-3 border-b-2 border-gray-300">
                Booking Notes
              </th>
              <th className="px-6 py-3 border-b-2 border-gray-300">
                Booking Created AT
              </th>
              <th className="px-6 py-3 border-b-2 border-gray-300">Actions</th>
            </tr>
          </thead>

          <tbody>
            {booking?.map((lead, index) => (
              <tr
                key={lead?.booking_id}
                className={index % 2 === 0 ? "bg-gray-100" : ""}
              >
                <td className="px-6 py-4 border-b border-gray-200">
                  {lead?.booking_date}
                </td>

                <td className="px-6 py-4 border-b border-gray-200">
                  {lead?.booking_amount}
                </td>

                <td className="px-6 py-4 border-b border-gray-200">
                  {lead?.owner_name}
                </td>

                <td className="px-6 py-4 border-b border-gray-200">
                  {lead?.owner_email}
                </td>

                <td className="px-6 py-4 border-b border-gray-200">
                  {lead?.owner_phone}
                </td>

                <td className="px-6 py-4 border-b border-gray-200">
                  {lead?.project_name}
                </td>

                <td className="px-6 py-4 border-b border-gray-200">
                  {lead?.project_id}
                </td>

                <td className="px-6 py-4 border-b border-gray-200">
                  {lead?.unit_type}
                </td>

                <td className="px-6 py-4 border-b border-gray-200">
                  {lead?.unit_number}
                </td>

                <td className="px-6 py-4 border-b border-gray-200">
                  {lead?.unit_status}
                </td>
                <td className="px-6 py-4 border-b border-gray-200">
                  {lead?.booking_notes}
                </td>

                <td className="px-6 py-4 border-b border-gray-200">
                  {lead?.booking_created_at}
                </td>

                <td className="px-6 py-4 border-b border-gray-200">
                  <button className="text-orange-400 font-bold text-2xl">
                    <FaEdit />
                  </button>
                  <button className="text-red-600 font-bold text-2xl">
                    <MdDelete />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default BookingDetails;
