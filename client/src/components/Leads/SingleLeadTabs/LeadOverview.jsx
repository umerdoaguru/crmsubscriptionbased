import React from "react";
import getFieldValue from "../../../utils/getFieldValue";

const LeadOverview = ({ leads }) => {
  return (
    <>
      <div className="overflow-x-auto">
        <table className="min-w-full whitespace-nowrap bg-white border">
          <thead>
            <tr>
              <th className="px-6 py-3 border-b-2 border-gray-300">
                Assigned To
              </th>
              <th className="px-6 py-3 border-b-2 border-gray-300">Name</th>
              <th className="px-6 py-3 border-b-2 border-gray-300">Phone</th>
              <th className="px-6 py-3 border-b-2 border-gray-300">
                Lead Source
              </th>
              <th className="px-6 py-3 border-b-2 border-gray-300">
                Lead Status
              </th>
              <th className="px-6 py-3 border-b-2 border-gray-300">Address</th>

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
                Close Date
              </th>
              <th className="px-6 py-3 border-b-2 border-gray-300">
                Assigned Date
              </th>
            </tr>
          </thead>

          <tbody>
            {leads.map((lead, index) => (
              <tr
                key={lead.id}
                className={index % 2 === 0 ? "bg-gray-100" : ""}
              >
                <td className="px-6 py-4 border-b border-gray-200">
                  {lead.staff_name}
                </td>

                <td className="px-6 py-4 border-b border-gray-200">
                  {lead.name ||
                    getFieldValue(lead.question_fields_data, "full_name")}
                </td>

                <td className="px-6 py-4 border-b border-gray-200">
                  {lead.phone ||
                    getFieldValue(lead.question_fields_data, "phone_number")}
                </td>

                <td className="px-6 py-4 border-b border-gray-200">
                  {lead.leadSource || "META"}
                </td>

                <td className="px-6 py-4 border-b border-gray-200">
                  {lead.lead_status || lead.meta_lead_status}
                </td>

                <td className="px-6 py-4 border-b border-gray-200">
                  {lead.address ||
                    getFieldValue(lead.question_fields_data, "street_address")}
                </td>

                <td className="px-6 py-4 border-b border-gray-200">
                  {lead.project_name}
                </td>

                <td className="px-6 py-4 border-b border-gray-200">
                  {lead.project_id}
                </td>

                <td className="px-6 py-4 border-b border-gray-200">
                  {lead.unit_type}
                </td>

                <td className="px-6 py-4 border-b border-gray-200">
                  {lead.unit_number}
                </td>

                <td className="px-6 py-4 border-b border-gray-200">
                  {lead.unit_status}
                </td>

                <td className="px-6 py-4 border-b border-gray-200">
                  {lead.unit_updated_at}
                </td>

                <td className="px-6 py-4 border-b border-gray-200">
                  {lead.createdTime || lead.meta_updated_at}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default LeadOverview;
