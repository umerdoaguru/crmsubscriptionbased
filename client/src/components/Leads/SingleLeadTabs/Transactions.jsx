import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import UpdatePayStatPop from "../../EmployeePops/UpdatePayStatPop";

const Transactions = ({ booking }) => {
  const { type, id } = useParams();
  const user = useSelector((state) => state.auth.user);
  const [transaction, setTransaction] = useState([]);
  const [updateModal, setUpdateModal] = useState(false);
  const [selected, setSelected] = useState();

  const openUpdateModal = (data) => {
    setSelected(data);
    setUpdateModal(true);
  };

  const fetchTransactionData = async () => {
    try {
      const { data } = await axios.get(
        `https://crm-generalize.dentalguru.software/api/getAllTransanctionByESUId/${booking[0]?.esu_id}/${user?.staff_org_id}`
      );
      setTransaction(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchTransactionData();
  }, []);

  console.log(transaction);

  return (
    <>
      <div className="overflow-x-auto">
        <table className="min-w-full whitespace-nowrap bg-white border">
          <thead>
            <tr>
              <th className="px-6 py-3 border-b-2 border-gray-300">
                Transaction Date
              </th>
              <th className="px-6 py-3 border-b-2 border-gray-300">Amount</th>
              <th className="px-6 py-3 border-b-2 border-gray-300">
                Payment Type
              </th>
              <th className="px-6 py-3 border-b-2 border-gray-300">
                Payment Method
              </th>
              <th className="px-6 py-3 border-b-2 border-gray-300">
                Payment Status
              </th>

              <th className="px-6 py-3 border-b-2 border-gray-300">
                Payment Note
              </th>
              <th className="px-6 py-3 border-b-2 border-gray-300">Action</th>
            </tr>
          </thead>

          <tbody>
            {transaction?.map((lead, index) => (
              <tr
                key={lead?.pt_id}
                className={index % 2 === 0 ? "bg-gray-100" : ""}
              >
                <td className="px-6 py-4 border-b border-gray-200">
                  {lead?.txn_date}
                </td>

                <td className="px-6 py-4 border-b border-gray-200">
                  {lead?.pt_amount}
                </td>

                <td className="px-6 py-4 border-b border-gray-200">
                  {lead?.pt_type}
                </td>

                <td className="px-6 py-4 border-b border-gray-200">
                  {lead?.pt_method}
                </td>

                <td className="px-6 py-4 border-b border-gray-200">
                  {lead?.pt_status}
                </td>

                <td className="px-6 py-4 border-b border-gray-200">
                  {lead?.pt_notes}
                </td>

                <td className="px-6 py-4 border-b border-gray-200">
                  <button
                    className="bg-yellow-500 hover:bg-yellow-700 p-2 px-2 rounded"
                    onClick={() => openUpdateModal(lead)}
                  >
                    Update
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <UpdatePayStatPop
        isOpen={updateModal}
        onClose={() => setUpdateModal(false)}
        selected={selected}
        fetchTransactionData={fetchTransactionData}
      />
    </>
  );
};

export default Transactions;
