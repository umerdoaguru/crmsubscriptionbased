import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import UpdateOrgModal from "./popupWindows/UpdateOrgModal";
import { MdManageAccounts } from "react-icons/md";
import SubsPaymentModal from "./popupWindows/SubsPaymentModal";

const SuperSettingContent = () => {
  const user = useSelector((state) => state.auth.user);
  console.log(user);
  const [updateModal, setUpdateModal] = useState(false);
  const [orgData, setOrgData] = useState(null);
  const [selected, setSelected] = useState();
  const [paymentModal, setPaymentModal] = useState(false);

  const updateModalfunc = (data) => {
    setUpdateModal(true);
    setSelected(data);
  };

  console.log(updateModal);

  const getOrgDataById = async () => {
    try {
      const { data } = await axios.get(
        `https://crm-generalize.dentalguru.software/api/getSubscriptionDetailsByOrg/${user?.staff_org_id}`,
        {
          headers: { Authorization: `Bearer ${user?.token}` },
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


  return (
    <>
      <div className="flex mt-20">
        <div className="w-full min-h-full bg-[#F9FAFF] p-2">
          <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
            <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
              {/* HEADER */}
              <div className="bg-gradient-to-r from-sky-400 to-sky-600 text-white py-5 px-6">
                <h1 className="text-2xl font-bold">Company Profile</h1>
                <p className="text-sm opacity-80">
                  Organization Information Overview
                </p>
              </div>

              {/* BASIC INFORMATION */}
              <section className="px-6 py-5 border-b">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                  Basic Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Company Name</p>
                    <div className="bg-gray-50 border rounded-lg px-3 py-2">
                      {orgData?.company_name || "—"}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Industry</p>
                    <div className="bg-gray-50 border rounded-lg px-3 py-2">
                      {orgData?.industry || "—"}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Email ID</p>
                    <div className="bg-gray-50 border rounded-lg px-3 py-2 break-words">
                      {orgData?.email_id || "—"}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Mobile No.</p>
                    <div className="bg-gray-50 border rounded-lg px-3 py-2">
                      {orgData?.moblie_no || "—"}
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-500 mb-1">Address</p>
                    <div className="bg-gray-50 border rounded-lg px-3 py-2">
                      {orgData?.company_address || "—"}
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-500 mb-1">Website URL</p>
                    <div className="bg-gray-50 border rounded-lg px-3 py-2 break-words">
                      {orgData?.website_url || "—"}
                    </div>
                  </div>
                </div>
              </section>

              {/* FINANCIAL DETAILS */}
              <section className="px-6 py-5 border-b">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                  Financial Details
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Account Name</p>
                    <div className="bg-gray-50 border rounded-lg px-3 py-2">
                      {orgData?.company_name_account_name || "—"}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">IFSC Code</p>
                    <div className="bg-gray-50 border rounded-lg px-3 py-2">
                      {orgData?.company_name_account_ifsc || "—"}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Account Number</p>
                    <div className="bg-gray-50 border rounded-lg px-3 py-2">
                      {orgData?.company_name_account_number || "—"}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Bank</p>
                    <div className="bg-gray-50 border rounded-lg px-3 py-2">
                      {orgData?.bank || "—"}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">GST No.</p>
                    <div className="bg-gray-50 border rounded-lg px-3 py-2">
                      {orgData?.gst_no || "—"}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">PAN No.</p>
                    <div className="bg-gray-50 border rounded-lg px-3 py-2">
                      {orgData?.pan_no || "—"}
                    </div>
                  </div>
                </div>
              </section>

              {/* META & ACCESS */}
              <section className="px-6 py-5 border-b">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                  Meta & Access
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Page ID</p>
                    <div className="bg-gray-50 border rounded-lg px-3 py-2">
                      {orgData?.org_page_id || "—"}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">
                      Page Access Token
                    </p>
                    <div className="bg-gray-50 border rounded-lg px-3 py-2 break-words">
                      {orgData?.org_page_access_token || "—"}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">
                      Company Created At
                    </p>
                    <div className="bg-gray-50 border rounded-lg px-3 py-2">
                      {orgData?.company_created_at || "—"}
                    </div>
                  </div>
                </div>
              </section>
              <div className="px-6 py-4">
                <button
                  className="bg-sky-500 hover:bg-sky-600 text-white p-2 rounded"
                  onClick={() => updateModalfunc(orgData)}
                >
                  Edit Details
                </button>
              </div>

              {/* End MEDIA */}
            </div>
            {/* ✅ MEDIA & BRANDING — Partitioned clearly */}
            <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden mt-4">
              <div className="bg-gray-50 p-4">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                  Media & Branding
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Header */}
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Header Image</p>
                    {orgData?.header_img ? (
                      <img
                        src={orgData.header_img}
                        alt="Header"
                        className="w-full max-h-32 object-contain border rounded-lg bg-white p-2"
                      />
                    ) : (
                      <div className="bg-white border rounded-lg px-3 py-8 text-center text-gray-400">
                        No Image
                      </div>
                    )}
                  </div>

                  {/* Footer */}
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Footer Image</p>
                    {orgData?.footer_img ? (
                      <img
                        src={orgData.footer_img}
                        alt="Footer"
                        className="w-full max-h-32 object-contain border rounded-lg bg-white p-2"
                      />
                    ) : (
                      <div className="bg-white border rounded-lg px-3 py-8 text-center text-gray-400">
                        No Image
                      </div>
                    )}
                  </div>

                  {/* Logo */}
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Logo</p>
                    {orgData?.logo ? (
                      <img
                        src={orgData.logo}
                        alt="Logo"
                        className="w-full max-h-32 object-contain border rounded-lg bg-white p-2"
                      />
                    ) : (
                      <div className="bg-white border rounded-lg px-3 py-8 text-center text-gray-400">
                        No Image
                      </div>
                    )}
                  </div>

                  {/* Digital Sign */}
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Digital Sign</p>
                    {orgData?.digital_sign ? (
                      <img
                        src={orgData.digital_sign}
                        alt="Digital Sign"
                        className="w-full max-h-32 object-contain border rounded-lg bg-white p-2"
                      />
                    ) : (
                      <div className="bg-white border rounded-lg px-3 py-8 text-center text-gray-400">
                        No Image
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="px-6 py-4">
                <button className="bg-sky-500 hover:bg-sky-600 text-white p-2 rounded">
                  Edit Details
                </button>
              </div>
            </div>
            {/* SUBSCRIPTION DETAILS */}
            <div className="max-w-5xl px-4 p-4 mx-auto bg-white rounded-2xl shadow-lg overflow-hidden mt-4">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Subscription Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Plan Name</p>
                  <div className="bg-gray-50 border rounded-lg px-3 py-2">
                    {orgData?.plan_name || "—"}
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-1">Billing Cycle</p>
                  <div className="bg-gray-50 border rounded-lg px-3 py-2">
                    {orgData?.cycle_name || "—"}
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-1">Price</p>
                  <div className="bg-gray-50 border rounded-lg px-3 py-2">
                    {orgData?.price || "—"}
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-1">Start Date</p>
                  <div className="bg-gray-50 border rounded-lg px-3 py-2">
                    {orgData?.start_date || "—"}
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-1">End Date</p>
                  <div className="bg-gray-50 border rounded-lg px-3 py-2">
                    {orgData?.end_date || "—"}
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-1">Status</p>
                  <div
                    className={`bg-gray-50 border rounded-lg px-3 py-2 capitalize font-medium ${
                      orgData?.sub_status === "active"
                        ? "text-green-600"
                        : orgData?.sub_status === "expired"
                        ? "text-red-600"
                        : orgData?.sub_status === "cancelled"
                        ? "text-gray-500"
                        : orgData?.sub_status === "trial"
                        ? "text-blue-600"
                        : "text-yellow-600"
                    }`}
                  >
                    {orgData?.sub_status || "—"}
                  </div>
                </div>
              </div>
              <div className="py-4">
                <button
                  className="flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white px-3 py-2 rounded"
                  onClick={() => setPaymentModal(true)}
                >
                  <MdManageAccounts className="text-lg" />
                  <span>Renew Subscription</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <UpdateOrgModal
        isOpen={updateModal}
        onClose={() => setUpdateModal(false)}
        selected={selected}
        getOrgDataById={getOrgDataById}
      />

      <SubsPaymentModal
        isOpen={paymentModal}
        onClose={() => setPaymentModal(false)}
        orgData={orgData}
      />
    </>
  );
};

export default SuperSettingContent;
