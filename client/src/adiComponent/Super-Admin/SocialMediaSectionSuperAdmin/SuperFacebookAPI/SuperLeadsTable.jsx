import { useEffect, useState } from "react";
import axios from "axios";
import ReactPaginate from "react-paginate";
import moment from "moment";
import { useSelector } from "react-redux";
import * as XLSX from "xlsx";
import cogoToast from "cogo-toast";
import LeadAnswersModal from "./LeadAnswersModal";
import { AiFillCheckCircle, AiFillEye } from "react-icons/ai";
import MetaAssignedPopup from "../../../../pages/superAdmin/popupWindows/MetaAssignedPopup";
import Super_Single_Lead_Profile from "../../Super_Single_Lead_Profile";
import { motion } from "framer-motion";

const SuperLeadsTable = ({ isSidebarOpen, type }) => {
  const [metaLeads, setMetaLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newLoading, setNewLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [currentPage, setCurrentPage] = useState(0);

  // Dynamic records per page
  const [leadsPerPage, setLeadsPerPage] = useState(10);

  const [selectedLead, setSelectedLead] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [orgData, setOrgData] = useState(null);
  const [selectedForm, setSelectedForm] = useState("");
  const [modalAssign, setModalAssign] = useState(false);
  const [isModalOpenLeadProfile, setIsModalOpenLeadProfile] = useState(false);
  const [selectedLeadId, setSelectedLeadId] = useState(null);

  // For multi-select assignment
  const [selectedLeads, setSelectedLeads] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  const superadminuser = useSelector((state) => state.auth.user);
  const token = superadminuser.token;

  const handleRowClick = (lead) => {
    setSelectedLeadId(lead);
    setIsModalOpenLeadProfile(true);
  };

  const closeModalLead = () => {
    setIsModalOpenLeadProfile(false);
    setSelectedLeadId(null);
  };

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
        `https://crm-generalize.dentalguru.software/api/getOrgDetailsById/${superadminuser?.staff_org_id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setOrgData(data[0]);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getOrgDataById();
  }, []);

  const fetchAllMetaLeads = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `https://crm-generalize.dentalguru.software/api/getMetaLeadsByOrgId/${superadminuser.staff_org_id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMetaLeads(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  console.log(metaLeads);

  useEffect(() => {
    fetchAllMetaLeads();
  }, []);

  const generateNewMetaLeads = async () => {
    setNewLoading(true);
    try {
      await axios.post(
        `https://crm-generalize.dentalguru.software/api/metaLeadFetchByPageId`,
        {
          pageId: orgData?.org_page_id,
          accessToken: orgData?.org_page_access_token,
          meta_org_id: superadminuser.staff_org_id,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      cogoToast.success("New Meta Leads Fetched Successfully");
      fetchAllMetaLeads();
    } catch (error) {
      console.log(error);
      cogoToast.error("Error Fetching New Meta Leads");
    } finally {
      setNewLoading(false);
    }
  };

  const parseLeadFields = (lead) => {
    try {
      const fields = JSON.parse(lead.question_fields_data);
      const getValue = (fieldName) =>
        fields.find((f) => f.name === fieldName)?.values?.[0] || "";
      return {
        full_name: getValue("full_name"),
        email: getValue("email"),
        phone_number: getValue("phone_number")?.replace("+91", ""),
        street_address: getValue("street_address"),
      };
    } catch {
      return { full_name: "", email: "", phone_number: "", street_address: "" };
    }
  };

  const uniqueFormNames = [
    ...new Set(metaLeads.map((lead) => lead.meta_form_name)),
  ];

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

  //Pagination logic updated for variable leadsPerPage
  const indexOfLastLead = (currentPage + 1) * leadsPerPage;
  const indexOfFirstLead = indexOfLastLead - leadsPerPage;
  const currentLeads = filteredLeads.slice(indexOfFirstLead, indexOfLastLead);
  const pageCount = Math.ceil(filteredLeads.length / leadsPerPage);

  const handlePageClick = (data) => setCurrentPage(data.selected);

  // Handle select individual lead
  const handleSelectLead = (leadId) => {
    setSelectedLeads((prev) =>
      prev.includes(leadId)
        ? prev.filter((id) => id !== leadId)
        : [...prev, leadId]
    );
  };

  // Handle select all
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedLeads([]);
    } else {
      const allIds = currentLeads.map((lead) => lead.meta_id);
      setSelectedLeads(allIds);
    }
    setSelectAll(!selectAll);
  };

  // Handle bulk assign
  const handleBulkAssign = () => {
    if (selectedLeads.length === 0) {
      return cogoToast.warn("Please select at least one lead to assign.");
    }
    const selectedObjects = metaLeads.filter((lead) =>
      selectedLeads.includes(lead.meta_id)
    );
    setSelectedLead(selectedObjects);
    setModalAssign(true);
  };

  //Export to Excel (unchanged)
  const exportToExcel = () => {
    const allQuestions = new Set();
    metaLeads.forEach((lead) => {
      try {
        const fields = JSON.parse(lead.question_fields_data);
        fields.forEach((f) => allQuestions.add(f.name));
      } catch {}
    });
    const questionArray = Array.from(allQuestions);
    const excelData = metaLeads.map((lead, index) => {
      const fields = JSON.parse(lead.question_fields_data || "[]");
      const extract = (name) =>
        fields.find((f) => f.name === name)?.values?.[0] || "";
      const base = {
        "S.No": index + 1,
        "Lead ID": lead.leadgen_id,
        "Form Name": lead.meta_form_name,
        "Generated Date": moment(lead.generated_time).format(
          "DD-MM-YYYY HH:mm"
        ),
        "Lead Status": lead.meta_lead_status,
        "Full Name": extract("full_name"),
        Email: extract("email"),
        Phone: extract("phone_number")?.replace("+91", ""),
        Address: extract("street_address"),
      };
      questionArray.forEach((q) => (base[q] = extract(q)));
      return base;
    });
    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Meta Leads");
    XLSX.writeFile(
      workbook,
      `MetaLeads_${moment().format("YYYYMMDD_HHmm")}.xlsx`
    );
  };

  return (
    <>
      <div className={`container mx-auto p-2`}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-md sm:text-2xl font-bold mb-4">
            Meta Leads Table
          </h2>
          <div className="gap-2 flex">
            <button
              className="bg-orange-500 p-2 px-2 sm:px-4 rounded hover:bg-orange-600 font-semibold text-white text-sm sm:text-lg"
              onClick={generateNewMetaLeads}
              disabled={newLoading}
            >
              {newLoading ? "Generating..." : "Fetch New Meta Leads"}
            </button>
            <button
              className="bg-green-600 p-2 px-2 sm:px-4 rounded hover:bg-green-700 font-semibold text-white text-sm sm:text-lg"
              onClick={exportToExcel}
            >
              Export Meta Leads
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-6 gap-4 mb-4">
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

          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">
              Records per page
            </label>
            <select
              value={leadsPerPage}
              onChange={(e) => setLeadsPerPage(Number(e.target.value))}
              className="border p-2 rounded"
            >
              {[5, 10, 20, 50, 100, 500].map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
          </div>
        </div>

        {selectedLeads.length > 0 && (
          <div className="mb-3 text-right">
            <motion.button
              onClick={handleBulkAssign}
              whileHover={{
                scale: 1.05,
                boxShadow: "0 0 20px rgba(59,130,246,0.5)",
              }}
              whileTap={{ scale: 0.95 }}
              className="relative px-5 py-2.5 rounded-xl font-semibold text-white 
             bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 
             shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden"
            >
              <span className="relative z-10">
                Assign Selected ({selectedLeads.length})
              </span>
              {/* Animated shine effect */}
              <motion.span
                initial={{ x: "-100%" }}
                animate={{ x: ["-100%", "100%"] }}
                transition={{
                  repeat: Infinity,
                  duration: 2,
                  ease: "linear",
                }}
                className="absolute top-0 left-0 w-full h-full 
               bg-gradient-to-r from-transparent via-white/30 to-transparent
               opacity-50"
              />
            </motion.button>
          </div>
        )}

        {loading ? (
          <p>Loading...</p>
        ) : filteredLeads.length > 0 ? (
          <div
            className={`${
              isSidebarOpen ? "w-[75rem]" : "w-[85rem]"
            }  overflow-x-auto`}
          >
            <table className="min-w-full bg-white border">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-2 px-4 border-b text-nowrap">
                    <input
                      type="checkbox"
                      checked={selectAll}
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th className="py-2 px-4 border-b">S.No</th>
                  <th className="py-2 px-4 border-b">Ads Form Name</th>
                  <th className="py-2 px-4 border-b">Full Name</th>
                  <th className="py-2 px-4 border-b">Email</th>
                  <th className="py-2 px-4 border-b">Phone</th>
                  <th className="py-2 px-4 border-b">Address</th>
                  <th className="py-2 px-4 border-b">Generated Date</th>
                  <th className="py-2 px-4 border-b">Assigned To</th>
                  <th className="py-2 px-4 border-b">Status</th>
                  <th className="py-2 px-4 border-b">Action</th>
                </tr>
              </thead>
              <tbody>
                {currentLeads.map((lead, index) => {
                  const parsed = parseLeadFields(lead);
                  return (
                    <tr key={lead.meta_id}>
                      <td className="py-2 px-4 border-b text-center">
                        <input
                          type="checkbox"
                          checked={selectedLeads.includes(lead.meta_id)}
                          onChange={() => handleSelectLead(lead.meta_id)}
                        />
                      </td>
                      <td className="py-2 px-4 border-b text-gray-800">
                        {indexOfFirstLead + index + 1}
                      </td>
                      <td
                        className="px-6 py-4 border-b border-gray-200 underline text-cyan-600 cursor-pointer font-semibold"
                        onClick={() => handleRowClick(lead)}
                      >
                        {lead.meta_form_name}
                      </td>
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
                      <th className="py-2 px-4 border-b font-bold capitalize">
                        {lead?.staff_name || "--"}
                      </th>
                      <td
                        className={`py-2 px-4 border-b ${
                          lead.meta_lead_status === "Pending"
                            ? "text-red-600 font-semibold"
                            : lead.meta_lead_status === "Sold"
                            ? "text-green-600 font-semibold"
                            : "text-gray-800"
                        }`}
                      >
                        {lead.meta_lead_status}
                      </td>

                      <td className="py-3 px-4 border-b">
                        <div className="flex items-center gap-2 justify-center">
                          {lead.meta_lead_status !== "Sold" ? (
                            <>
                              <button
                                onClick={() => handleViewAnswers(lead)}
                                className="flex items-center gap-1 bg-cyan-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-cyan-700 transition-all duration-200"
                              >
                                <AiFillEye className="w-4 h-4" />
                                View
                              </button>

                              <button
                                onClick={() => handleAssigned(lead)}
                                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium text-white transition-all duration-200 shadow-sm
        ${
          lead?.meta_assignedTo
            ? "bg-amber-600 hover:bg-amber-700"
            : "bg-green-600 hover:bg-green-700"
        }`}
                              >
                                <AiFillCheckCircle className="w-4 h-4" />
                                {lead?.meta_assignedTo ? "Re-Assign" : "Assign"}
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                // onClick={() => handleViewAnswers(lead)}
                                className="flex items-center gap-1 bg-gray-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium"
                                disabled
                              >
                                <AiFillEye className="w-4 h-4" />
                                View
                              </button>

                              <button
                                // onClick={() => handleAssigned(lead)}
                                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium text-white transition-all duration-200 shadow-sm bg-gray-600
        `}
                                disabled
                              >
                                <AiFillCheckCircle className="w-4 h-4" />
                                {lead?.meta_assignedTo ? "Re-Assign" : "Assign"}
                              </button>
                            </>
                          )}
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

      {/* Modals */}
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

      {isModalOpenLeadProfile && selectedLeadId && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-[1055]">
          <div className="w-75 bg-white p-6 rounded-lg shadow-lg max-h-[80vh] overflow-auto mx-4 my-5">
            <Super_Single_Lead_Profile
              selectedLeadId={selectedLeadId}
              closeModalLead={closeModalLead}
              type={"meta"}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default SuperLeadsTable;
