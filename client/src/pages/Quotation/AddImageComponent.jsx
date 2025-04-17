import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";

const AddImageComponent = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [quotationId, setQuotationId] = useState("");
  const [imageType, setImageType] = useState("");
  const { quotationId: paramQuotationId, imageType: paramImageType } =
    useParams();
  const navigate = useNavigate();

  useEffect(() => {
    // Pre-fill input fields with URL parameters if available
    if (paramQuotationId) setQuotationId(paramQuotationId);
    if (paramImageType) setImageType(paramImageType);
  }, [paramQuotationId, paramImageType]);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleImageUpload = async () => {
    try {
      if (!quotationId || !imageType) {
        console.error("Quotation ID and image type are required");
        return;
      }

      const formData = new FormData();
      formData.append("image", selectedFile);

      await axios.post(
        `http://localhost:9000/api/${quotationId}/${imageType}`,
        formData
      );

      console.log("Image uploaded successfully");
      navigate(`/final-quotation/${quotationId}`);
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  return (
    <div className="container mt-4">
      <div className="row g-2">
        <div className="col-lg-6">
          <input
            type="text"
            className="form-control"
            placeholder="Quotation ID"
            value={quotationId}
            onChange={(e) => setQuotationId(e.target.value)}
            disabled // Disable the input field
          />
        </div>
        <div className="col-lg-6">
          <input
            type="text"
            placeholder="Image Type"
            className="form-control"
            value={imageType}
            onChange={(e) => setImageType(e.target.value)}
            disabled // Disable the input field
          />
        </div>
        <input
          className="form-control"
          type="file"
          onChange={handleFileChange}
        />
      </div>

      <button className="btn btn-success mt-3" onClick={handleImageUpload}>
        Upload Image
      </button>
      <Link
        to={`/final-quotation/${quotationId}`}
        className="btn btn-primary mt-3 mx-2"
      >
        Back to Final Quotation
      </Link>
    </div>
  );
};

export default AddImageComponent;
