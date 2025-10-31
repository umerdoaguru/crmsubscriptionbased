import axios from "axios";
import React, { useEffect, useState } from "react";
import { MdManageAccounts } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import SubsPaymentModal from "./superAdmin/popupWindows/SubsPaymentModal";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../store/UserSlice";

const UniSubPage = () => {
  const user = useSelector((state) => state.auth.user);
  console.log(user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [updateModal, setUpdateModal] = useState(false);
  const [orgData, setOrgData] = useState(null);
  const [selected, setSelected] = useState();
  const [paymentModal, setPaymentModal] = useState(false);
  const [subStatus, setSubStatus] = useState([]);

  const checkSubStatus = async () => {
    try {
      const { data } = await axios.get(
        `https://crm-generalize.dentalguru.software/api/checkSubscriptionValidity/${user?.staff_org_id}`,
        {
          headers: { Authorization: `Bearer ${user?.token}` },
        }
      );
      setSubStatus(data);
    } catch (error) {
      console.log(error);
      if (error?.response?.data?.message === "Unauthorized - Token Expired") {
        dispatch(logoutUser());
        navigate("/");
      }
    }
  };

  useEffect(() => {
    checkSubStatus();
  }, [user]);

  console.log(subStatus);

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
      if (error?.response?.data?.message === "Unauthorized - Token Expired") {
        dispatch(logoutUser());
        navigate("/");
      }
    }
  };

  useEffect(() => {
    getOrgDataById();
  }, []);

  console.log(orgData);

  return (
    <>
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
      <SubsPaymentModal
        isOpen={paymentModal}
        onClose={() => setPaymentModal(false)}
        orgData={orgData}
      />
    </>
  );
};

export default UniSubPage;
