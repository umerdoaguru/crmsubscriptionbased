import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import FinanceCompanySavePopup from "./popupWindows/FinanceCompanySavePopup";
import cogoToast from "cogo-toast";
import FinanceCompanyUpdatePopup from "./popupWindows/FinanceCompanyUpdatePopup";

const FinanceCompanySettingContent = () => {
  const user = useSelector((state) => state.auth.user);
  const [companies, setCompanies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [addModal, setAddModal] = useState(false);
  const [updateModal, setUpdateModal] = useState(false);
  const [selected, setSelected] = useState(null);

  const openUdpateModal = (data) => {
    setUpdateModal(true);
    setSelected(data);
  };

  const fetchCompanies = async () => {
    if (!user?.staff_org_id) return;

    try {
      const { data } = await axios.get(
        `https://crm-generalize.dentalguru.software/api/getFinanceCompanyByOrg/${user.staff_org_id}`
      );
      setCompanies(data || []);
    } catch (error) {
      console.error("Error fetching companies:", error);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, [user?.staff_org_id]);

  const deleteFinanceCompany = async (id) => {
    try {
      const confirm = window.confirm(
        "Do you really want to delete company data ?"
      );
      if (confirm) {
        const res = await axios.delete(
          `https://crm-generalize.dentalguru.software/api/deleteFinanceCompany/${id}`
        );
        cogoToast.success("company deleted successfully");
        fetchCompanies();
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Filter companies by name
  const filteredCompanies = companies.filter((company) =>
    company.fc_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredCompanies.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredCompanies.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <>
      <div className="flex mt-20">
        <div className="w-full min-h-full bg-[#F9FAFF] p-2">
          <div className="p-4 md:p-8">
            <h2 className="text-2xl font-semibold mb-4 text-center text-gray-800">
              Finance Companies
            </h2>

            {/* Search Filter */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-3">
              <input
                type="text"
                placeholder="Search by company name..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="border border-gray-300 rounded-lg p-2 w-full sm:w-1/3 focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <button
                className="p-2 px-4 rounded bg-sky-600 text-white hover:bg-sky-700"
                onClick={() => setAddModal(true)}
              >
                + Add Finance Company
              </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto bg-white shadow-md rounded-lg">
              <table className="min-w-full table-auto text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 text-left font-semibold text-gray-700">
                      #
                    </th>
                    <th className="px-4 py-2 text-left font-semibold text-gray-700">
                      Company Name
                    </th>
                    <th className="px-4 py-2 text-left font-semibold text-gray-700">
                      Contact Person
                    </th>
                    <th className="px-4 py-2 text-left font-semibold text-gray-700">
                      Phone
                    </th>
                    <th className="px-4 py-2 text-left font-semibold text-gray-700">
                      Interest Rate
                    </th>
                    <th className="px-4 py-2 text-left font-semibold text-gray-700">
                      Created At
                    </th>
                    <th className="px-4 py-2 text-left font-semibold text-gray-700">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.length > 0 ? (
                    paginatedData.map((item, index) => (
                      <tr
                        key={item.finance_company_id}
                        className="border-b hover:bg-gray-50"
                      >
                        <td className="px-4 py-2">
                          {(currentPage - 1) * itemsPerPage + index + 1}
                        </td>
                        <td className="px-4 py-2 font-medium text-gray-800">
                          {item.fc_name}
                        </td>
                        <td className="px-4 py-2">{item.fc_contact_person}</td>
                        <td className="px-4 py-2">{item.fc_contact_phone}</td>
                        <td className="px-4 py-2">{item.interest_rate}%</td>
                        <td className="px-4 py-2 text-gray-600">
                          {new Date(item.fc_created_at).toLocaleDateString(
                            "en-IN",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            }
                          )}
                        </td>
                        <td className="px-4 py-2">
                          <div className="flex justify-start gap-2">
                            <button
                              className="bg-sky-600 p-2 px-4 rounded hover:bg-sky-700 text-white font-bold"
                              onClick={() => openUdpateModal(item)}
                            >
                              Edit
                            </button>
                            <button
                              className="bg-red-600 p-2 px-4 rounded hover:bg-red-700 text-white font-bold"
                              onClick={() =>
                                deleteFinanceCompany(item?.finance_company_id)
                              }
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="6"
                        className="text-center py-6 text-gray-500 font-medium"
                      >
                        No records found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-center mt-6 gap-3 flex-wrap items-center">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                className={`px-4 py-1 rounded-lg border ${
                  currentPage === 1
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                Prev
              </button>

              <span className="text-gray-700 font-medium">
                Page {currentPage} of {totalPages}
              </span>

              <button
                disabled={currentPage === totalPages}
                onClick={() =>
                  setCurrentPage((p) => Math.min(p + 1, totalPages))
                }
                className={`px-4 py-1 rounded-lg border ${
                  currentPage === totalPages
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Add Modal */}
      <FinanceCompanySavePopup
        isOpen={addModal}
        onClose={() => setAddModal(false)}
        fetchCompanies={fetchCompanies}
      />
      <FinanceCompanyUpdatePopup
        isOpen={updateModal}
        onClose={() => setUpdateModal(false)}
        fetchCompanies={fetchCompanies}
        selected={selected}
      />
    </>
  );
};

export default FinanceCompanySettingContent;
