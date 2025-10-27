import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import moment from "moment";
import axios from "axios";
import UpdateProfilePopup from "../adiComponent/Super-Admin/UpdateProfilePopup";
import ChangePasswordPopup from "../adiComponent/Super-Admin/ChangePasswordPopup";

const AdminProfileContent = () => {
  const superadminuser = useSelector((state) => state.auth.user);
  const token = superadminuser.token;
  const superAdmin = useSelector((state) => state.auth.user);
  const [profileData, setProfileData] = useState([]);
  const [updateModal, setUpdateModal] = useState(false);
  const [passwordModal, setPasswordModal] = useState(false);
  const [selected, setSelected] = useState(null);

  const openPopupWindow = (data) => {
    setSelected(data);
    setUpdateModal(true);
  };

  const changePopupWindow = (data) => {
    setSelected(data);
    setPasswordModal(true);
  };

  const fetchEmployeeData = async () => {
    try {
      const { data } = await axios.get(
        `https://crm-generalize.dentalguru.software/api/getEmployeeDetails/${superAdmin?.staff_id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setProfileData(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchEmployeeData();
  }, []);

  console.log(profileData);

  const infoFields = [
    { label: "User ID", value: profileData[0]?.staff_id },
    { label: "Name", value: profileData[0]?.staff_name },
    { label: "Email", value: profileData[0]?.staff_email },
    { label: "Role", value: profileData[0]?.staff_role },
    { label: "Phone", value: profileData[0]?.staff_phone },
    {
      label: "Created Date",
      value: moment(profileData[0]?.staff_created_date).format("DD/MM/YYYY"),
    },
  ];

  const heading = () => {
    let headText = "";
    if (superAdmin?.staff_role === "superadmin") {
      headText = "Super Admin Profile";
    } else if (superAdmin?.staff_role === "admin") {
      headText = "Admin Profile";
    } else {
      headText = "Employee Profile";
    }
    return headText;
  };

  const headerText = heading();
  console.log(headerText);

  return (
    <>
      <div className="flex justify-center mt-36 px-4">
        <motion.div
          className="w-full max-w-5xl bg-gradient-to-br from-white via-blue-50 to-cyan-100 rounded-3xl shadow-2xl p-8"
          initial={{ opacity: 0, scale: 0.9, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {/* Header with Button */}
          <div className="flex items-center justify-between">
            {/* Left side - Heading */}
            <motion.h2
              className="text-3xl font-bold text-cyan-700"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {headerText}
            </motion.h2>

            {/* Right side - Buttons */}
            <div className="flex gap-3">
              <motion.button
                className="px-5 py-2 bg-cyan-600 text-white font-medium rounded-lg shadow hover:bg-cyan-700 transition"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => openPopupWindow(profileData[0])}
              >
                Update Profile
              </motion.button>

              <motion.button
                className="px-5 py-2 bg-cyan-600 text-white font-medium rounded-lg shadow hover:bg-cyan-700 transition"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => changePopupWindow(profileData[0])}
              >
                Change Password
              </motion.button>
            </div>
          </div>

          {/* Profile Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {infoFields.map((field, idx) => (
              <motion.div
                key={idx}
                className="bg-white rounded-2xl shadow-md p-4 hover:shadow-lg transition cursor-default border border-gray-100"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * idx }}
                whileHover={{ scale: 1.03 }}
              >
                <p className="text-sm text-cyan-600 font-semibold mb-1">
                  {field.label}
                </p>
                <p className="text-gray-800 font-medium break-all">
                  {field.value || "—"}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
      <UpdateProfilePopup
        isOpen={updateModal}
        onClose={() => setUpdateModal(false)}
        selected={selected}
        fetchEmployeeData={fetchEmployeeData}
      />
      <ChangePasswordPopup
        isOpen={passwordModal}
        onClose={() => setPasswordModal(false)}
        selected={selected}
      />
    </>
  );
};

export default AdminProfileContent;
