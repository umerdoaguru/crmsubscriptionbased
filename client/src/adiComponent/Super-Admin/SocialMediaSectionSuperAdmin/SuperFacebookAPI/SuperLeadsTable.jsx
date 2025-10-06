import { useEffect, useState } from "react";
import axios from "axios";
import ReactPaginate from "react-paginate";
import moment from "moment";
import { useSelector } from "react-redux";
import * as XLSX from "xlsx";
import toast from "react-hot-toast";
import cogoToast from "cogo-toast";
import LeadAnswersModal from "./LeadAnswersModal";
import { AiFillCheckCircle, AiFillEye } from "react-icons/ai";
import MetaAssignedPopup from "../../../../pages/superAdmin/popupWindows/MetaAssignedPopup";

const SuperLeadsTable = ({ isSidebarOpen }) => {
  const [metaLeads, setMetaLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newLoading, setNewLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [leadsPerPage] = useState(5);
  const [selectedLead, setSelectedLead] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [orgData, setOrgData] = useState(null);
  const [selectedForm, setSelectedForm] = useState("");
  const [modalAssign, setModalAssign] = useState(false);

  const superadminuser = useSelector((state) => state.auth.user);
  const token = superadminuser.token;

  const handleViewAnswers = (lead) => {
    setSelectedLead(lead);
    setModalOpen(true);
  };

  const handleAssigned = (lead) => {
    setSelectedLead(lead);
    setModalAssign(true);
  };

  const getOrgDataById = async () => {
    try {
      const { data } = await axios.get(
        `https://crm-generalize.dentalguru.software/api/getOrgDetailsById/${superadminuser?.staff_org_id}`
      );
      setOrgData(data[0]);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getOrgDataById();
  }, []);

  console.log(orgData);

  // ✅ Fetch Meta Leads
  const fetchAllMetaLeads = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `https://crm-generalize.dentalguru.software/api/getMetaLeadsByOrgId/${superadminuser.staff_org_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMetaLeads(data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllMetaLeads();
  }, []);

  const generateNewMetaLeads = async () => {
    setNewLoading(true);
    try {
      const res = await axios.post(
        `https://crm-generalize.dentalguru.software/api/metaLeadFetchByPageId`,
        {
          pageId: orgData?.org_page_id,
          accessToken: orgData?.org_page_access_token,
          meta_org_id: superadminuser.staff_org_id,
        }
      );
      cogoToast.success("New Meta Leads Fetched Successfully");
      fetchAllMetaLeads();
      setNewLoading(false);
    } catch (error) {
      console.log(error);
      setNewLoading(false);
      cogoToast.error("Error Fetching New Meta Leads");
    }
  };

  // ✅ Helper function to parse question_fields_data safely
  const parseLeadFields = (lead) => {
    try {
      const fields = JSON.parse(lead.question_fields_data);

      const getValue = (fieldName) => {
        const field = fields.find((f) => f.name === fieldName);
        return field?.values?.[0] || "";
      };

      return {
        full_name: getValue("full_name"),
        email: getValue("email"),
        phone_number: getValue("phone_number")?.replace("+91", ""),
        street_address: getValue("street_address"),
      };
    } catch (e) {
      console.error("Error parsing lead fields", e);
      return {
        full_name: "",
        email: "",
        phone_number: "",
        street_address: "",
      };
    }
  };

  const uniqueFormNames = [
    ...new Set(metaLeads.map((lead) => lead.meta_form_name)),
  ];

  // ✅ Filter logic
  const filteredLeads = metaLeads.filter((lead) => {
    const parsed = parseLeadFields(lead);

    const searchMatch =
      parsed.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      parsed.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      parsed.phone_number.includes(searchTerm);

    const dateMatch =
      (!dateFrom || moment(lead.generated_time).isSameOrAfter(dateFrom)) &&
      (!dateTo || moment(lead.generated_time).isSameOrBefore(dateTo));

    const formMatch = !selectedForm || lead.meta_form_name === selectedForm;

    return searchMatch && dateMatch && formMatch;
  });

  // ✅ Pagination logic
  const indexOfLastLead = (currentPage + 1) * leadsPerPage;
  const indexOfFirstLead = indexOfLastLead - leadsPerPage;
  const currentLeads = filteredLeads.slice(indexOfFirstLead, indexOfLastLead);
  const pageCount = Math.ceil(filteredLeads.length / leadsPerPage);

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  // excel sheet
  const parseLeadFieldsForExcel = (lead) => {
    try {
      return JSON.parse(lead.question_fields_data);
    } catch {
      return [];
    }
  };

  const extractFieldValue = (fields, fieldName) => {
    const field = fields.find((f) => f.name === fieldName);
    return field?.values?.[0] || "";
  };

  // ✅ Filter logic
  const filteredLeadsForExcel = metaLeads.filter((lead) => {
    const fields = parseLeadFieldsForExcel(lead);
    const full_name = extractFieldValue(fields, "full_name")?.toLowerCase();
    const email = extractFieldValue(fields, "email")?.toLowerCase();
    const phone = extractFieldValue(fields, "phone_number")?.replace("+91", "");

    const searchMatch =
      full_name.includes(searchTerm.toLowerCase()) ||
      email.includes(searchTerm.toLowerCase()) ||
      phone.includes(searchTerm);

    const dateMatch =
      (!dateFrom || moment(lead.generated_time).isSameOrAfter(dateFrom)) &&
      (!dateTo || moment(lead.generated_time).isSameOrBefore(dateTo));

    return searchMatch && dateMatch;
  });

  // ✅ Pagination logic
  const indexOfLastLeadForExcel = (currentPage + 1) * leadsPerPage;
  const indexOfFirstLeadForExcel = indexOfLastLeadForExcel - leadsPerPage;
  const currentLeadsForExcel = filteredLeadsForExcel.slice(
    indexOfFirstLeadForExcel,
    indexOfLastLeadForExcel
  );

  // ✅ Export to Excel with Q&A
  const exportToExcel = () => {
    // 1️⃣ Collect all unique question names
    const allQuestions = new Set();
    metaLeads.forEach((lead) => {
      const fields = parseLeadFieldsForExcel(lead);
      fields.forEach((f) => {
        allQuestions.add(f.name);
      });
    });

    const questionArray = Array.from(allQuestions);

    // 2️⃣ Build Excel data
    const excelData = metaLeads.map((lead, index) => {
      const fields = parseLeadFieldsForExcel(lead);

      const base = {
        "S.No": index + 1,
        "Lead ID": lead.leadgen_id,
        "Form ID": lead.meta_form_id,
        "Form Name": lead.meta_form_name,
        "Page ID": lead.meta_page_id,
        "Generated Date": moment(lead.generated_time).format(
          "DD-MM-YYYY HH:mm"
        ),
        "Lead Status": lead.meta_lead_status,
      };

      // Full name, email, phone, address from known field names
      const full_name = extractFieldValue(fields, "full_name");
      const email = extractFieldValue(fields, "email");
      const phone = extractFieldValue(fields, "phone_number")?.replace(
        "+91",
        ""
      );
      const address = extractFieldValue(fields, "street_address");

      base["Full Name"] = full_name;
      base["Email"] = email;
      base["Phone"] = phone;
      base["Address"] = address;

      // 3️⃣ Add question answers dynamically
      questionArray.forEach((qName) => {
        const answer = extractFieldValue(fields, qName);
        base[qName] = answer;
      });

      return base;
    });

    // 4️⃣ Convert to sheet and export
    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Meta Leads");

    XLSX.writeFile(
      workbook,
      `MetaLeads_With_QA_${moment().format("YYYYMMDD_HHmm")}.xlsx`
    );
  };

  return (
    <>
      <div className="container mx-auto p-2">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold mb-4">Meta Leads Table</h2>
          <div className="gap-2 flex">
            <button
              className="bg-orange-500 p-2 px-4 rounded hover:bg-orange-600 font-semibold text-white"
              onClick={generateNewMetaLeads}
              disabled={newLoading}
            >
              {newLoading ? "Generating...." : "Fetch New Meta Leads"}
            </button>
            <button
              className="bg-green-600 p-2 px-4 rounded hover:bg-green-700 font-semibold text-white"
              onClick={exportToExcel}
            >
              Export Meta Leads
            </button>
          </div>
        </div>

        {/* ✅ Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 mb-4">
          <div className="flex flex-col col-span-2">
            <label className="text-sm font-medium text-gray-700 mb-1">
              Search
            </label>
            <input
              type="text"
              placeholder="Search by name, email or number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border p-2 rounded"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">
              From Date
            </label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="border p-2 rounded"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">
              To Date
            </label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="border p-2 rounded"
            />
          </div>

          {/* ✅ New Dropdown for Form Name */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">
              Form Name
            </label>
            <select
              value={selectedForm}
              onChange={(e) => setSelectedForm(e.target.value)}
              className="border p-2 rounded"
            >
              <option value="">All Forms</option>
              {uniqueFormNames.map((form, idx) => (
                <option key={idx} value={form}>
                  {form}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* ✅ Table */}
        {loading ? (
          <p>Loading...</p>
        ) : filteredLeads.length > 0 ? (
          <div
            className={`${
              isSidebarOpen ? "w-[75rem]" : "w-[85rem]"
            } overflow-x-auto`}
          >
            <table className="min-w-full bg-white border">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-2 px-4 border-b text-nowrap">S.No</th>
                  <th className="py-2 px-4 border-b text-nowrap">
                    Ads Form Name
                  </th>
                  <th className="py-2 px-4 border-b text-nowrap">Full Name</th>
                  <th className="py-2 px-4 border-b text-nowrap">Email</th>
                  <th className="py-2 px-4 border-b text-nowrap">Phone</th>
                  <th className="py-2 px-4 border-b text-nowrap">Address</th>
                  <th className="py-2 px-4 border-b text-nowrap">
                    Generated Date
                  </th>
                  <th className="py-2 px-4 border-b text-nowrap">Status</th>
                  <th className="py-2 px-4 border-b text-nowrap">Action</th>
                </tr>
              </thead>
              <tbody>
                {currentLeads.map((lead, index) => {
                  const parsed = parseLeadFields(lead);

                  return (
                    <tr key={lead.meta_id}>
                      <td className="py-2 px-4 border-b text-gray-800">
                        {indexOfFirstLead + index + 1}
                      </td>
                      <td className="py-2 px-4 border-b text-gray-800">
                        {lead.meta_form_name}
                      </td>
                      <td className="py-2 px-4 border-b text-gray-800">
                        {parsed.full_name}
                      </td>
                      <td className="py-2 px-4 border-b text-gray-800">
                        {parsed.email}
                      </td>
                      <td className="py-2 px-4 border-b text-gray-800">
                        {parsed.phone_number}
                      </td>
                      <td className="py-2 px-4 border-b text-gray-800">
                        {parsed.street_address}
                      </td>
                      <td className="py-2 px-4 border-b text-gray-800">
                        {moment(lead.generated_time).format("DD-MM-YYYY HH:mm")}
                      </td>
                      <td
                        className={`py-2 px-4 border-b ${
                          lead.meta_lead_status === "Pending"
                            ? "text-red-600 font-semibold"
                            : "text-gray-800"
                        }`}
                      >
                        {lead.meta_lead_status}
                      </td>
                      <td className="py-3 px-4 border-b text-gray-800">
                        <div className="flex items-center gap-2 justify-center">
                          <button
                            className="flex items-center gap-1 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium shadow-md hover:from-cyan-600 hover:to-cyan-700 transition-all duration-200 hover:scale-105"
                            onClick={() => handleViewAnswers(lead)}
                          >
                            <AiFillEye className="w-4 h-4" />
                            View Answers
                          </button>

                          {/* Assign Lead Button */}
                          <button
                            className="flex items-center gap-1 bg-gradient-to-r from-green-500 to-green-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium shadow-md hover:from-green-600 hover:to-green-700 transition-all duration-200 hover:scale-105"
                            onClick={() => handleAssigned(lead)}
                          >
                            <AiFillCheckCircle className="w-4 h-4" />
                            Assign Lead
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* ✅ Pagination */}
            <div className="mt-4 flex justify-center">
              <ReactPaginate
                previousLabel={"Previous"}
                nextLabel={"Next"}
                breakLabel={"..."}
                pageCount={pageCount}
                forcePage={currentPage}
                marginPagesDisplayed={2}
                pageRangeDisplayed={3}
                onPageChange={handlePageClick}
                containerClassName={"pagination flex space-x-2"}
                activeClassName={"bg-cyan-500 text-white px-3 py-1 rounded"}
                pageClassName={"px-3 py-1 border rounded"}
                previousClassName={"px-3 py-1 border rounded"}
                nextClassName={"px-3 py-1 border rounded"}
                breakClassName={"px-3 py-1"}
              />
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-500 mt-6">No leads found</p>
        )}
      </div>
      <LeadAnswersModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        lead={selectedLead}
      />
      <MetaAssignedPopup
        isOpen={modalAssign}
        onClose={() => setModalAssign(false)}
        lead={selectedLead}
        fetchAllMetaLeads={fetchAllMetaLeads}
      />
    </>
  );
};

export default SuperLeadsTable;
