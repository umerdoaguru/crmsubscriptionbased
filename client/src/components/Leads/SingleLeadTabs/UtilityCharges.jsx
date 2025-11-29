import React, { useEffect, useState } from "react";
import getFieldValue from "../../../utils/getFieldValue";
import axios from "axios";
import { useParams } from "react-router-dom";
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import UpdateUtilityPopup from "../../EmployeePops/UpdateUtilityPopup";
import cogoToast from "cogo-toast";
import PaymentCreatePopup from "../../EmployeePops/PaymentCreatePopup";

const UtilityCharges = () => {
  const { type, id } = useParams();
  const [loading, setLoading] = useState(false);
  const [utility, setUtility] = useState([]);
  const [updateModal, setUpdateModal] = useState(false);
  const [selected, setSelected] = useState();
  const [isPaymentPopupOpen, setIsPaymentPopupOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState();

  const openPaymentModal = (data) => {
    setSelectedPayment(data);
    setIsPaymentPopupOpen(true);
  };

  const openUpdateModal = (data) => {
    setSelected(data);
    setUpdateModal(true);
  };

  const fetchUtilityBills = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `https://crm-generalize.dentalguru.software/api/getUtilityBYleadId/${id}`
      );
      setUtility(data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUtilityBills();
  }, []);

  const deleteUtilityData = async (id) => {
    try {
      const confirm = window.confirm(`Do you really want to delete ?`);
      if (confirm) {
        const res = await axios.delete(
          `https://crm-generalize.dentalguru.software/api/deleteUtilityCharges/${id}`
        );
        cogoToast.success("utility bill deleted successfully");
        fetchUtilityBills();
      } else {
        return;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const openUtilityReceipt = (bill) => {
    const serialized = encodeURIComponent(JSON.stringify(bill));
    window.open(`/utility-receipt?data=${serialized}`, "_blank");
  };

  return (
    <>
      <div className="overflow-x-auto">
        <table className="min-w-full whitespace-nowrap bg-white border">
          <thead>
            <tr>
              <th className="px-6 py-3 border-b-2 border-gray-300">
                Utility Bill Date
              </th>
              <th className="px-6 py-3 border-b-2 border-gray-300">
                Utility Bill Amount
              </th>
              <th className="px-6 py-3 border-b-2 border-gray-300">Type</th>
              <th className="px-6 py-3 border-b-2 border-gray-300">
                Project Name
              </th>
              <th className="px-6 py-3 border-b-2 border-gray-300">
                Unit Number
              </th>
              <th className="px-6 py-3 border-b-2 border-gray-300">
                Description
              </th>
              <th className="px-6 py-3 border-b-2 border-gray-300">Action</th>
            </tr>
          </thead>

          <tbody>
            {utility?.map((lead, index) => (
              <tr
                key={lead?.utility_id}
                className={index % 2 === 0 ? "bg-gray-100" : ""}
              >
                <td className="px-6 py-4 border-b border-gray-200">
                  {lead?.utility_date}
                </td>

                <td className="px-6 py-4 border-b border-gray-200">
                  {lead?.utility_amount}
                </td>

                <td className="px-6 py-4 border-b border-gray-200">
                  {lead?.utility_type}
                </td>

                <td className="px-6 py-4 border-b border-gray-200">
                  {lead?.project_name}
                </td>

                <td className="px-6 py-4 border-b border-gray-200">
                  {lead?.unit_number}
                </td>

                <td className="px-6 py-4 border-b border-gray-200">
                  {lead?.description}
                </td>

                <td className="px-6 py-4 border-b border-gray-200">
                  {lead?.utility_pay_status !== "paid" && (
                    <>
                      <button
                        className="text-orange-400 font-bold text-2xl"
                        onClick={() => openUpdateModal(lead)}
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="text-red-600 font-bold text-2xl"
                        onClick={() => deleteUtilityData(lead?.utility_id)}
                      >
                        <MdDelete />
                      </button>
                      <button
                        className="bg-green-600 text-white p-2 px-2 rounded hover:bg-green-700"
                        onClick={() => openPaymentModal(lead)}
                      >
                        Make Payment
                      </button>
                    </>
                  )}

                  {lead?.utility_pay_status === "paid" && (
                    <>
                      <button
                        className="bg-gray-600 text-white p-2 px-2 rounded hover:bg-gray-800"
                        onClick={() => openUtilityReceipt(lead)}
                      >
                        Generate Receipt
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <UpdateUtilityPopup
        isOpen={updateModal}
        onClose={() => setUpdateModal(false)}
        selected={selected}
        fetchUtilityBills={fetchUtilityBills}
      />
      <PaymentCreatePopup
        isOpen={isPaymentPopupOpen}
        onClose={() => setIsPaymentPopupOpen(false)}
        selectedPayment={selectedPayment}
        paymentType={"utility"}
        callBackFunc={fetchUtilityBills}
      />
    </>
  );
};

export default UtilityCharges;
