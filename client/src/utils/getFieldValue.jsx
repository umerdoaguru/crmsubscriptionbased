const getFieldValue = (dataString, fieldName) => {
  try {
    const data = JSON.parse(dataString);
    const field = data.find((item) => item.name === fieldName);
    return field ? field.values[0] : "";
  } catch (error) {
    console.error("Invalid question_fields_data:", error);
    return "";
  }
};

export default getFieldValue;
