import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import cogoToast from "cogo-toast";
import moment from "moment";
import OwnerPaymentSavePopup from "../../pages/Employees/EmpPopupWindow/OwnerPaymentSavePopup";
import OwnerLoanAddPopup from "../../pages/Employees/EmpPopupWindow/OwnerLoanAddPopup";

const ViewAllUnitSoldContent = () => {
  const [unitSoldData, setUnitSoldData] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { type, id } = useParams();
  const EmpId = useSelector((state) => state.auth.user);
  const token = EmpId?.token;
  const [ownPayment, setOwnPayment] = useState([]);
  const [ownPaymentModal, setOwnPaymentModal] = useState(false);
  const [ownerLoanModal, setOwnerLoanModal] = useState(false);
  const [loanInstallment, setLoanInstallment] = useState([]);

  console.log(unitSoldData);

  useEffect(() => {
    fetchUnitSoldData();
  }, [id]);

  const fetchLoanInstallments = async () => {
    try {
      const { data } = await axios.get(
        `https://crm-generalize.dentalguru.software/api/getLoanEmiDetailsByLoanID/${unitSoldData[0]?.esu_owner_id}/${EmpId?.staff_org_id}/${unitSoldData[0]?.esu_id}`
      );
      setLoanInstallment(data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchOwnerPayments = async () => {
    try {
      const { data } = await axios.get(
        `https://crm-generalize.dentalguru.software/api/getOwnerPaymentsByMultiIds/${unitSoldData[0]?.esu_id}/${unitSoldData[0]?.esu_owner_id}/${EmpId?.staff_org_id}`
      );
      setOwnPayment(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchOwnerPayments();
    fetchLoanInstallments();
  }, [unitSoldData]);

  console.log(ownPayment);

  const fetchUnitSoldData = async () => {
    try {
      setLoading(true);
      const apiUrl =
        type === "meta"
          ? `https://crm-generalize.dentalguru.software/api/getEmployeeUnitSoldByLeadIdMeta/${id}`
          : `https://crm-generalize.dentalguru.software/api/unit-sold-lead-id/${id}`;

      const { data } = await axios.get(apiUrl, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      setUnitSoldData(Array.isArray(data) ? data : [data]);
    } catch (error) {
      console.error("Error fetching unit sold data:", error);
      cogoToast.error("Failed to fetch unit sold details");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (esu_id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this record?"
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(
        `https://crm-generalize.dentalguru.software/api/unit-sold/${type}/${esu_id}`
      );
      cogoToast.success("Unit Sold deleted successfully!");
      fetchUnitSoldData();
    } catch (error) {
      console.error("Error deleting unit:", error);
      cogoToast.error("Failed to delete record");
    }
  };

  const handleSimpleAction = (action) => {
    cogoToast.info(`${action} feature coming soon`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-xl text-gray-600">
        Loading Unit Sold Details...
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-[#F9FAFF] pt-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-gray-700">
              Unit Sold Details
            </h2>
            <button
              onClick={() => navigate(-1)}
              className="bg-cyan-600 text-white px-4 py-2 rounded-lg hover:bg-cyan-700"
            >
              Back
            </button>
          </div>

          {unitSoldData.length === 0 ? (
            <div className="text-center text-gray-500 mt-10">
              No unit sold details found.
            </div>
          ) : (
            unitSoldData.map((data, i) => (
              <div
                key={i}
                className="bg-white shadow-md rounded-xl p-6 mb-10 border border-gray-200"
              >
                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3 justify-end mb-6">
                  {unitSoldData[0]?.esu_payment_method === "EMI" && (
                    <>
                      <button
                        onClick={() => setOwnerLoanModal(true)}
                        className="bg-indigo-500 text-white px-4 py-1 rounded-md hover:bg-indigo-600"
                      >
                        + Add Loan
                      </button>
                      {/* <button
                        onClick={() => handleSimpleAction("Manage EMI")}
                        className="bg-yellow-500 text-white px-4 py-1 rounded-md hover:bg-yellow-600"
                      >
                        + Manage EMI
                      </button> */}
                    </>
                  )}

                  {unitSoldData?.remaining_amount > 0 && (
                    <>
                      <button
                        onClick={() => setOwnPaymentModal(true)}
                        className="bg-green-500 text-white px-4 py-1 rounded-md hover:bg-green-600"
                      >
                        + Add Payment
                      </button>
                    </>
                  )}
                </div>

                {/* Project & Unit Details */}
                <h3 className="text-xl font-semibold mb-3 text-cyan-700">
                  Project & Unit Details
                </h3>
                <div className="grid sm:grid-cols-2 gap-2 text-gray-700 mb-6">
                  <p>
                    <strong>Project Name:</strong> {data.project_name}
                  </p>
                  <p>
                    <strong>Unit No:</strong> {data.unit_number}
                  </p>
                  <p>
                    <strong>Unit Type:</strong> {data.unit_type}
                  </p>
                  <p>
                    <strong>Area:</strong> {data.unit_area} sqft
                  </p>
                  <p>
                    <strong>Base Price:</strong> ₹{data.base_price}
                  </p>
                  <p>
                    <strong>Sale Price:</strong> ₹{data.esu_sale_price}
                  </p>
                  <p>
                    <strong>Status:</strong> {data.unit_status}
                  </p>
                  <p>
                    <strong>Remaining Amount:</strong> ₹{data.remaining_amount}
                  </p>
                </div>

                {/* Sale & Payment Details */}
                <h3 className="text-xl font-semibold mb-3 text-cyan-700">
                  Sale & Token Payment Details
                </h3>
                <div className="grid sm:grid-cols-2 gap-2 text-gray-700 mb-6">
                  <p>
                    <strong>Sold Date:</strong>{" "}
                    {moment(data.esu_sold_date).format("DD MMM YYYY")}
                  </p>
                  <p>
                    <strong>Booking Date:</strong>{" "}
                    {moment(data.esu_booking_date).format("DD MMM YYYY")}
                  </p>
                  <p>
                    <strong>Final Date:</strong>{" "}
                    {moment(data.esu_final_date).format("DD MMM YYYY")}
                  </p>
                  <p>
                    <strong>Registry Date:</strong>{" "}
                    {data.registry_date
                      ? moment(data.registry_date).format("DD MMM YYYY")
                      : "—"}
                  </p>
                  <p>
                    <strong>Payment Mode:</strong> {data.esu_payment_method}
                  </p>
                  <p>
                    <strong>Token Amount:</strong> ₹{data.esu_token_amount}
                  </p>
                  <p>
                    <strong>Token Status:</strong> {data.esu_token_paid_status}
                  </p>
                </div>

                <div className="grid sm:grid-cols-2 gap-2 text-gray-700 mb-6">
                  <p>
                    <strong>Sold Date:</strong>{" "}
                    {moment(data.esu_sold_date).format("DD MMM YYYY")}
                  </p>
                  <p>
                    <strong>Booking Date:</strong>{" "}
                    {moment(data.esu_booking_date).format("DD MMM YYYY")}
                  </p>
                  <p>
                    <strong>Final Date:</strong>{" "}
                    {moment(data.esu_final_date).format("DD MMM YYYY")}
                  </p>
                  <p>
                    <strong>Registry Date:</strong>{" "}
                    {data.registry_date
                      ? moment(data.registry_date).format("DD MMM YYYY")
                      : "—"}
                  </p>
                  <p>
                    <strong>Payment Mode:</strong> {data.esu_payment_method}
                  </p>
                  <p>
                    <strong>Token Amount:</strong> ₹{data.esu_token_amount}
                  </p>
                  <p>
                    <strong>Token Status:</strong> {data.esu_token_paid_status}
                  </p>
                </div>

                {/* Owner Details */}
                <h3 className="text-xl font-semibold mb-3 text-cyan-700">
                  Owner Details
                </h3>
                <div className="grid sm:grid-cols-2 gap-2 text-gray-700 mb-6">
                  <p>
                    <strong>Name:</strong> {data.owner_name}
                  </p>
                  <p>
                    <strong>Phone:</strong> {data.owner_phone}
                  </p>
                  <p>
                    <strong>Email:</strong> {data.owner_email}
                  </p>
                  <p>
                    <strong>Address:</strong> {data.owner_address}
                  </p>
                </div>

                {/* Staff Details */}
                <h3 className="text-xl font-semibold mb-3 text-cyan-700">
                  Staff Details
                </h3>
                <div className="grid sm:grid-cols-2 gap-2 text-gray-700 mb-6">
                  <p>
                    <strong>Name:</strong> {data.staff_name}
                  </p>
                  <p>
                    <strong>Phone:</strong> {data.staff_phone}
                  </p>
                  <p>
                    <strong>Email:</strong> {data.staff_email}
                  </p>
                  <p>
                    <strong>Role:</strong>{" "}
                    {data.staff_role
                      ? data.staff_role.charAt(0).toUpperCase() +
                        data.staff_role.slice(1)
                      : ""}
                  </p>
                </div>

                {/* Notes Section */}
                {data.esu_notes && (
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold mb-2 text-cyan-700">
                      Notes
                    </h3>
                    <p className="bg-gray-50 border p-3 rounded-lg text-gray-700">
                      {data.esu_notes}
                    </p>
                  </div>
                )}

                {/* Buttons */}
                <div className="mt-6 flex justify-end gap-3">
                  <button
                    onClick={() => handleSimpleAction("Update Details")}
                    className="bg-cyan-600 text-white px-5 py-2 rounded-lg hover:bg-cyan-700"
                  >
                    Update Details
                  </button>
                  {ownPayment?.length === 0 && (
                    <>
                      <button
                        onClick={() => handleDelete(data.esu_id)}
                        className="bg-red-500 text-white px-5 py-2 rounded-lg hover:bg-red-600"
                      >
                        Delete Record
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
        {ownPayment.length > 0 && (
          <>
            <div className="w-full p-4">
              <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4">
                Owner Payment History Details
              </h2>

              <div className="overflow-x-auto rounded-xl shadow-lg border border-gray-200">
                {ownPayment && ownPayment.length > 0 ? (
                  <table className="min-w-full text-sm md:text-base text-gray-700">
                    <thead className="bg-gradient-to-r from-sky-600 to-sky-500 text-white">
                      <tr>
                        <th className="px-4 py-3 text-left font-semibold">
                          Sr. No.
                        </th>
                        <th className="px-4 py-3 text-left font-semibold">
                          Owner Name
                        </th>
                        <th className="px-4 py-3 text-left font-semibold">
                          Sale Price
                        </th>
                        <th className="px-4 py-3 text-left font-semibold">
                          Remaining Amount
                        </th>
                        <th className="px-4 py-3 text-left font-semibold">
                          Paid Amount
                        </th>
                        <th className="px-4 py-3 text-left font-semibold">
                          Paid Date
                        </th>
                        <th className="px-4 py-3 text-left font-semibold">
                          Payment Method
                        </th>
                        <th className="px-4 py-3 text-left font-semibold">
                          Remark
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-200 bg-white">
                      {ownPayment.map((item, index) => (
                        <tr
                          key={index}
                          className="hover:bg-blue-50 transition-colors duration-200"
                        >
                          <td className="px-4 py-2">{index + 1}</td>
                          <td className="px-4 py-2 font-medium text-gray-900">
                            {item?.owner_name || "-"}
                          </td>
                          <td className="px-4 py-2">
                            ₹{item?.esu_sale_price || "-"}
                          </td>
                          <td className="px-4 py-2">
                            ₹{item?.op_remaining_amount || "-"}
                          </td>
                          <td className="px-4 py-2 text-green-600 font-semibold">
                            ₹{item?.op_amount || 0}
                          </td>
                          <td className="px-4 py-2">
                            {item?.op_paid_date || "Not Available"}
                          </td>
                          <td className="px-4 py-2 capitalize">
                            {item?.op_payment_method || "-"}
                          </td>
                          <td className="px-4 py-2 text-gray-600">
                            {item?.op_remark || "-"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="text-center py-10 text-gray-500 text-base md:text-lg">
                    No data to display
                  </div>
                )}
              </div>
            </div>
          </>
        )}
        {loanInstallment.length > 0 && (
          <>
            <div className="w-full p-4">
              <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4">
                Owner EMI Installment Payment History Details
              </h2>

              <div className="overflow-x-auto rounded-xl shadow-lg border border-gray-200">
                {loanInstallment && loanInstallment.length > 0 ? (
                  <table className="min-w-full text-sm md:text-base text-gray-700">
                    <thead className="bg-gradient-to-r from-sky-600 to-sky-500 text-white">
                      <tr>
                        <th className="px-4 py-3 text-left font-semibold">
                          Sr. No.
                        </th>
                        <th className="px-4 py-3 text-left font-semibold">
                          Owner Name
                        </th>
                        <th className="px-4 py-3 text-left font-semibold">
                          Sale Price
                        </th>
                        <th className="px-4 py-3 text-left font-semibold">
                          Remaining Amount
                        </th>
                        <th className="px-4 py-3 text-left font-semibold">
                          Paid Amount
                        </th>
                        <th className="px-4 py-3 text-left font-semibold">
                          Paid Date
                        </th>
                        <th className="px-4 py-3 text-left font-semibold">
                          Payment Method
                        </th>
                        <th className="px-4 py-3 text-left font-semibold">
                          Remark
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-200 bg-white">
                      {loanInstallment?.map((item, index) => (
                        <tr
                          key={index}
                          className="hover:bg-blue-50 transition-colors duration-200"
                        >
                          <td className="px-4 py-2">{index + 1}</td>
                          <td className="px-4 py-2 font-medium text-gray-900">
                            {item?.owner_name || "-"}
                          </td>
                          <td className="px-4 py-2">
                            ₹{item?.esu_sale_price || "-"}
                          </td>
                          <td className="px-4 py-2">
                            ₹{item?.op_remaining_amount || "-"}
                          </td>
                          <td className="px-4 py-2 text-green-600 font-semibold">
                            ₹{item?.op_amount || 0}
                          </td>
                          <td className="px-4 py-2">
                            {item?.op_paid_date || "Not Available"}
                          </td>
                          <td className="px-4 py-2 capitalize">
                            {item?.op_payment_method || "-"}
                          </td>
                          <td className="px-4 py-2 text-gray-600">
                            {item?.op_remark || "-"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="text-center py-10 text-gray-500 text-base md:text-lg">
                    No data to display
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      <OwnerPaymentSavePopup
        isOpen={ownPaymentModal}
        onClose={() => setOwnPaymentModal(false)}
        unitSoldData={unitSoldData}
        fetchUnitSoldData={fetchUnitSoldData}
        fetchOwnerPayments={fetchOwnerPayments}
      />
      <OwnerLoanAddPopup
        isOpen={ownerLoanModal}
        onClose={() => setOwnerLoanModal(false)}
        unitSoldData={unitSoldData}
        fetchUnitSoldData={fetchUnitSoldData}
      />
    </>
  );
};

export default ViewAllUnitSoldContent;
