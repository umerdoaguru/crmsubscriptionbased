import React, { useState } from "react";
import axios from "axios";

const UpdateHeaderImageForm = ({ quotationId }) => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  const handleUpdateHeaderImage = async () => {
    try {
      if (!selectedFile) {
        // Handle the case where no file is selected

        console.error("No file selected");
        return;
      }

      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await axios.put(
        `https://crmdemo.vimubds5.a2hosted.com/api/header/${quotationId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        console.log("Header image updated successfully");

        window.location.reload();
      } else {
        console.error("Error updating header image:", response.data.error);
      }
    } catch (error) {
      console.error("Error updating header image:", error);
    }
  };

  return (
    <div>
      <h2>Update Header Image</h2>
      <input className="form-control" type="file" onChange={handleFileChange} />
      <button
        className="btn btn-success mt-3"
        onClick={handleUpdateHeaderImage}
      >
        Update Image of Header
      </button>
    </div>
  );
};

export default UpdateHeaderImageForm;
