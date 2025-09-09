import React from "react";
import moment from "moment";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";

function AdminProfileContent() {
  const Admin = useSelector((state) => state.auth.user);

  const infoFields = [
    { label: "ID", value: Admin?.id },
    { label: "Name", value: Admin?.name },
    { label: "Email", value: Admin?.email },
    { label: "Role", value: Admin?.roles },
    { label: "User ID", value: Admin?.user_id },
    {
      label: "Created Date",
      value: moment(Admin?.created_date).format("DD/MM/YYYY"),
    },
  ];

  return (
    <div className="flex justify-center mt-36 px-4">
      <motion.div
        className="w-full max-w-5xl bg-gradient-to-br from-white via-blue-50 to-cyan-100 rounded-3xl shadow-2xl p-8"
        initial={{ opacity: 0, scale: 0.9, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* Header */}
        <motion.h2
          className="text-3xl font-bold text-center text-cyan-700"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Admin Profile
        </motion.h2>
        <motion.div
          className="h-1 w-24 bg-cyan-600 mx-auto my-4 rounded-full"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        />

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
  );
}

export default AdminProfileContent;
