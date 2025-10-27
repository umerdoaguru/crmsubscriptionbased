import React, { useEffect, useMemo } from "react";

const LeadAnswersModal = ({ isOpen, onClose, lead }) => {
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (e.target.id === "modal-overlay") {
        onClose();
      }
    };
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, [onClose]);

  // ✅ Extract basic info (Name, Email, etc.)
  const basicInfo = useMemo(() => {
    if (!lead?.question_fields_data) return {};
    try {
      const parsed = JSON.parse(lead.question_fields_data);
      const info = {};
      parsed.forEach((item) => {
        if (item.name === "full_name") info.full_name = item.values[0];
        if (item.name === "email") info.email = item.values[0];
        if (item.name === "phone_number") info.phone_number = item.values[0];
        if (item.name === "street_address")
          info.street_address = item.values[0];
      });
      return info;
    } catch (e) {
      console.error("Error parsing basic info", e);
      return {};
    }
  }, [lead]);

  // ✅ Extract Q&A (excluding basic fields)
  const qaList = useMemo(() => {
    if (!lead?.question_fields_data) return [];
    try {
      const parsed = JSON.parse(lead.question_fields_data);
      const ignored = ["full_name", "email", "phone_number", "street_address"];
      return parsed.filter((item) => !ignored.includes(item.name));
    } catch (err) {
      console.error("Invalid question_fields_data", err);
      return [];
    }
  }, [lead]);

  if (!isOpen) return null;

  return (
    <div
      id="modal-overlay"
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
    >
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full mx-4 transform transition-all scale-100 animate-fadeIn">
        {/* ✅ Header */}
        <div className="flex justify-between items-center border-b px-5 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-t-2xl">
          <h3 className="text-lg font-semibold text-white">
            Lead Questions & Answers
          </h3>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 text-2xl font-bold"
          >
            &times;
          </button>
        </div>

        {/* ✅ Basic Info */}
        <div className="px-5 pt-4 pb-2 bg-gray-50 border-b text-sm text-gray-700 space-y-1">
          <p>
            <span className="font-semibold">Name:</span>{" "}
            {basicInfo.full_name || "—"}
          </p>
          <p>
            <span className="font-semibold">Email:</span>{" "}
            {basicInfo.email || "—"}
          </p>
          <p>
            <span className="font-semibold">Phone:</span>{" "}
            {basicInfo.phone_number || "—"}
          </p>
          <p>
            <span className="font-semibold">Address:</span>{" "}
            {basicInfo.street_address || "—"}
          </p>
        </div>

        {/* ✅ Q&A Section */}
        <div className="p-5 max-h-[60vh] overflow-y-auto space-y-4">
          {qaList.length > 0 ? (
            qaList.map((item, idx) => (
              <div
                key={idx}
                className="border rounded-lg p-4 shadow-sm hover:shadow-md transition"
              >
                <p className="font-semibold text-gray-800">
                  Q{idx + 1}: {item.name.replace(/_/g, " ")}
                </p>
                <p className="mt-1 text-gray-600">
                  A: {item.values.join(", ").replace(/_/g, " ")}
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center">
              No questions or answers found for this lead.
            </p>
          )}
        </div>

        {/* ✅ Footer */}
        <div className="flex justify-end px-5 py-3 border-t bg-gray-50 rounded-b-2xl">
          <button
            onClick={onClose}
            className="bg-cyan-600 text-white px-4 py-2 rounded hover:bg-cyan-700 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeadAnswersModal;
