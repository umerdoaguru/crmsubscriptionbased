import { useEffect, useState } from "react";
import axios from "axios";
import ReactPaginate from "react-paginate";
import moment from "moment";
import { useSelector } from "react-redux";
import * as XLSX from "xlsx";
import toast from "react-hot-toast";
import cogoToast from "cogo-toast";
import LeadAnswersModal from "./LeadAnswersModal";

const SuperLeadsTable = () => {
  const [metaLeads, setMetaLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newLoading, setNewLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [leadsPerPage] = useState(10);
  const [selectedLead, setSelectedLead] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const superadminuser = useSelector((state) => state.auth.user);
  const token = superadminuser.token;

  const handleViewAnswers = (lead) => {
    setSelectedLead(lead);
    setModalOpen(true);
  };

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
      const res = await axios.get(
        `https://crm-generalize.dentalguru.software/api/metaLeadFetchByPageId`,
        {
          pageId: "",
          accessToken: "",
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

    return searchMatch && dateMatch;
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
      <div className="container mx-auto p-4">
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
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-4">
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
        </div>

        {/* ✅ Table */}
        {loading ? (
          <p>Loading...</p>
        ) : filteredLeads.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-2 px-4 border-b">S.No</th>
                  {/* <th className="py-2 px-4 border-b">Lead ID</th> */}
                  <th className="py-2 px-4 border-b">Full Name</th>
                  <th className="py-2 px-4 border-b">Email</th>
                  <th className="py-2 px-4 border-b">Phone</th>
                  <th className="py-2 px-4 border-b">Address</th>
                  <th className="py-2 px-4 border-b">Generated Date</th>
                  <th className="py-2 px-4 border-b">Status</th>
                  <th className="py-2 px-4 border-b">Action</th>
                </tr>
              </thead>
              <tbody>
                {currentLeads.map((lead, index) => {
                  const parsed = parseLeadFields(lead);

                  return (
                    <tr key={lead.meta_id}>
                      <td className="py-2 px-4 border-b">
                        {indexOfFirstLead + index + 1}
                      </td>
                      {/* <td className="py-2 px-4 border-b">{lead.leadgen_id}</td> */}
                      <td className="py-2 px-4 border-b">{parsed.full_name}</td>
                      <td className="py-2 px-4 border-b">{parsed.email}</td>
                      <td className="py-2 px-4 border-b">
                        {parsed.phone_number}
                      </td>
                      <td className="py-2 px-4 border-b">
                        {parsed.street_address}
                      </td>
                      <td className="py-2 px-4 border-b">
                        {moment(lead.generated_time).format("DD-MM-YYYY HH:mm")}
                      </td>
                      <td className="py-2 px-4 border-b">
                        {lead.meta_lead_status}
                      </td>
                      <td className="py-2 px-4 border-b">
                        <button
                          className="bg-gradient-to-r from-cyan-500 to-cyan-600 text-white p-2 rounded hover:from-cyan-600 hover:to-cyan-700 transition-colors"
                          onClick={() => handleViewAnswers(lead)}
                        >
                          View Answer
                        </button>
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
    </>
  );
};

export default SuperLeadsTable;
