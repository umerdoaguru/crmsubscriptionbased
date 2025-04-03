import React from "react";
import { MdExposure } from "react-icons/md";

const UpdateLeadField = ({ field, value, onChange }) => {
  const { name, label, type, options } = field;

  if (type === "select") {
    return (
      <div className="mb-4">
        <label className="block text-gray-700">{label}</label>
        <select
          name={name}
          value={value}
          onChange={onChange}
          className="w-full p-2 border rounded"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    );
  }

  if (type === "textarea") {
    return (
      <div className="mb-4">
        <label className="block text-gray-700">{label}</label>
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          className="w-full p-2 border rounded"
        />
      </div>
    );
  }
  if (type === "text") {
    return (
      <div className="mb-4">
        <label className="block text-gray-700">{label}</label>
        <input
          name={name}
          value={value}
          onChange={onChange}
          className="w-full p-2 border rounded"
        />
      </div>
    );
  }

  // Render a date input
  if (type === "date") {
    return (
      <div className="mb-4">
        <label className="block text-gray-700">{label}</label>
        <input
          type="date"
          name={name}
          value={value}
          onChange={onChange}
          className="w-full p-2 border rounded"
        />
      </div>
    );

    return null;
  }
};

export default UpdateLeadField;
