import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import getFieldValue from "../../../utils/getFieldValue";
import axios from "axios";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import UpdateRegistryModal from "../../EmployeePops/UpdateRegistryModal";

const RegistryDetails = () => {
  const { type, id } = useParams();
  const [registry, setRegistry] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState();
  const [updateModal, setUpdateModal] = useState(false);

  const openUpdateModal = (data) => {
    setSelected(data);
    setUpdateModal(true);
  };

  const fetchRegistryDetails = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `https://crm-generalize.dentalguru.software/api/getRegistryBYleadId/${id}`
      );
      setRegistry(data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistryDetails();
  }, []);

  console.log(registry);

  return (
    <>
      <div className="overflow-x-auto">
        <table className="min-w-full whitespace-nowrap bg-white border">
          <thead>
            <tr>
              <th className="px-6 py-3 border-b-2 border-gray-300">
                Registry Date
              </th>
              <th className="px-6 py-3 border-b-2 border-gray-300">
                Registry Amount
              </th>
              <th className="px-6 py-3 border-b-2 border-gray-300">
                Owner Name
              </th>
              <th className="px-6 py-3 border-b-2 border-gray-300">
                Owner Email
              </th>
              <th className="px-6 py-3 border-b-2 border-gray-300">
                Project Name
              </th>
              <th className="px-6 py-3 border-b-2 border-gray-300">
                Unit Number
              </th>

              <th className="px-6 py-3 border-b-2 border-gray-300">
                Registry Document
              </th>
              <th className="px-6 py-3 border-b-2 border-gray-300">
                Registry Notes
              </th>
              <th className="px-6 py-3 border-b-2 border-gray-300">Action</th>
            </tr>
          </thead>
          {loading ? (
            <>
              <div>
                <p>Loading.......</p>
              </div>
            </>
          ) : (
            <>
              <tbody>
                {registry?.map((lead, index) => (
                  <tr
                    key={lead?.registry_id}
                    className={index % 2 === 0 ? "bg-gray-100" : ""}
                  >
                    <td className="px-6 py-4 border-b border-gray-200">
                      {lead?.registry_date}
                    </td>

                    <td className="px-6 py-4 border-b border-gray-200">
                      {lead?.registry_amount}
                    </td>

                    <td className="px-6 py-4 border-b border-gray-200">
                      {lead?.owner_name}
                    </td>

                    <td className="px-6 py-4 border-b border-gray-200">
                      {lead?.owner_email}
                    </td>

                    <td className="px-6 py-4 border-b border-gray-200">
                      {lead?.project_name}
                    </td>

                    <td className="px-6 py-4 border-b border-gray-200">
                      {lead?.unit_number}
                    </td>

                    <td className="px-6 py-4 border-b border-gray-200">
                      {lead?.registry_document_url ? (
                        <a
                          href={`https://crm-generalize.dentalguru.software/${lead.registry_document_url}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-cyan-600"
                        >
                          View Document
                        </a>
                      ) : (
                        "No Document"
                      )}
                    </td>

                    <td className="px-6 py-4 border-b border-gray-200">
                      {lead?.registry_notes}
                    </td>

                    <td className="px-6 py-4 border-b border-gray-200">
                      <button
                        className="text-orange-400 font-bold text-2xl"
                        onClick={() => openUpdateModal(lead)}
                      >
                        <FaEdit />
                      </button>
                      <button className="text-red-600 font-bold text-2xl">
                        <MdDelete />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </>
          )}
        </table>
      </div>
      <UpdateRegistryModal
        isOpen={updateModal}
        onClose={() => setUpdateModal(false)}
        selected={selected}
        fetchRegistryDetails={fetchRegistryDetails}
      />
    </>
  );
};

export default RegistryDetails;
