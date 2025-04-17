import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";

const UpdateQuotation = () => {
  const { id } = useParams();
  const [editData, setEditData] = useState({});
  const [showModal, setShowModal] = useState(true);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuotation = async () => {
      try {
        const response = await axios.get(`http://localhost:9000/api/quotation-name/${id}`);
        if (response.data && response.data.length > 0) {
          const fetchedData = response.data[0];
          setEditData({
            ...fetchedData,
            payment_due_date1: formatDate(fetchedData.payment_due_date1),
            payment_due_date2: formatDate(fetchedData.payment_due_date2),
            payment_due_date3: formatDate(fetchedData.payment_due_date3),
            payment_due_date4: formatDate(fetchedData.payment_due_date4),
          });
        }
      } catch (error) {
        console.error("Error fetching quotation:", error);
      }
    };
    fetchQuotation();
  }, [id]);


  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().split("T")[0]; // Format as 'YYYY-MM-DD'
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.put(`http://localhost:9000/api/quotation-data/${id}`, editData);
      if (response.status === 200) {
        setMessage(response.data.message);
        navigate(-1);
      } else {
        setMessage(response.data.error || "Failed to update quotation");
      }
    } catch (error) {
      console.error("Error updating quotation:", error);
      setMessage("Internal Server Error");
    }
  };

  const handleChange = (e) => {
    setEditData({
      ...editData,
      [e.target.name]: e.target.value,
    });
  };

  const handleClose = () => {
    setShowModal(false);
    navigate(-1);
  };

  return (
    <>
    <Wrapper>
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-60 p-4 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl p-6 overflow-y-auto max-h-[90vh] relative">
            <button
              onClick={handleClose}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              &times;
            </button>
            <h2 className="text-xl font-semibold mb-4 text-center">Update Quotation</h2>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label>CUSTOMER NAME:</label>
                  <input type="text" name="customer_name" value={editData.customer_name || ""} onChange={handleChange} className="input-field w-full" />
                </div>
                <div>
                  <label>CONTACT NUMBER:</label>
                  <input type="text" name="contact_number" value={editData.contact_number || ""} onChange={handleChange} className="input-field w-full" />
                </div>
                <div>
                  <label>ALTERNATE NUMBER:</label>
                  <input type="text" name="alternate_number" value={editData.alternate_number || ""} onChange={handleChange} className="input-field w-full" />
                </div>
                <div>
                  <label>ADDRESS:</label>
                  <input type="text" name="address" value={editData.address || ""} onChange={handleChange} className="input-field w-full" />
                </div>
                <div>
                  <label>ADHAAR NUMBER:</label>
                  <input type="text" name="adhaar_number" value={editData.adhaar_number || ""} onChange={handleChange} className="input-field w-full" />
                </div>
                <div>
                  <label>PAN NUMBER:</label>
                  <input type="text" name="pan_number" value={editData.pan_number || ""} onChange={handleChange} className="input-field w-full" />
                </div>
                <div>
                  <label>PROJECT NAME:</label>
                  <input type="text" name="project_name" value={editData.project_name || ""} onChange={handleChange} className="input-field w-full" />
                </div>
                <div>
                  <label>UNIT NUMBER:</label>
                  <input type="text" name="unit_number" value={editData.unit_number || ""} onChange={handleChange} className="input-field w-full" />
                </div>
                <div>
                  <label>DIMENSION:</label>
                  <input type="text" name="dimension" value={editData.dimension || ""} onChange={handleChange} className="input-field w-full" />
                </div>
                <div>
                  <label>RATE:</label>
                  <input type="text" name="rate" value={editData.rate || ""} onChange={handleChange} className="input-field w-full" />
                </div>
                <div>
                  <label>VARIANT:</label>
                  <input type="text" name="variant" value={editData.variant || ""} onChange={handleChange} className="input-field w-full" />
                </div>
                <div>
                  <label>TOTAL DEAL:</label>
                  <input type="text" name="total_deal" value={editData.total_deal || ""} onChange={handleChange} className="input-field w-full" />
                </div>
                <div>
                  <label>BOOKING AMOUNT:</label>
                  <input type="text" name="booking_amount" value={editData.booking_amount || ""} onChange={handleChange} className="input-field w-full" />
                </div>
                <div>
                  <label>IN WORDS (BOOKING AMOUNT):</label>
                  <input type="text" name="booking_amount_words" value={editData.booking_amount_words || ""} onChange={handleChange} className="input-field w-full" />
                </div>
                <div>
                  <label>PAYMENT MODE:</label>
                  <input type="text" name="payment_mode" value={editData.payment_mode || ""} onChange={handleChange} className="input-field w-full" />
                </div>
                <div>
                  <label>IF FINANCE BANK:</label>
                  <input type="text" name="finance_bank" value={editData.finance_bank || ""} onChange={handleChange} className="input-field w-full" />
                </div>
                <div>
                  <label>DURATION:</label>
                  <input type="text" name="duration" value={editData.duration || ""} onChange={handleChange} className="input-field w-full" />
                </div>
                <div>
                  <label>BALANCE AMOUNT:</label>
                  <input type="text" name="balance_amount" value={editData.balance_amount || ""} onChange={handleChange} className="input-field w-full" />
                </div>
                <div>
                  <label>IN WORDS (BALANCE AMOUNT):</label>
                  <input type="text" name="balance_amount_words" value={editData.balance_amount_words || ""} onChange={handleChange} className="input-field w-full" />
                </div>
                <div>
                  <label>PAYMENT DUE DATE 1:</label>
                  <input type="date" name="payment_due_date1" value={editData.payment_due_date1 || ""} onChange={handleChange} className="input-field w-full" />
                </div>
                <div>
                  <label>PAYMENT DUE DATE 2:</label>
                  <input type="date" name="payment_due_date2" value={editData.payment_due_date2 || ""} onChange={handleChange} className="input-field w-full" />
                </div>
                <div>
                  <label>PAYMENT DUE DATE 3:</label>
                  <input type="date" name="payment_due_date3" value={editData.payment_due_date3 || ""} onChange={handleChange} className="input-field w-full" />
                </div>
                <div>
                  <label>PAYMENT DUE DATE 4:</label>
                  <input type="date" name="payment_due_date4" value={editData.payment_due_date4 || ""} onChange={handleChange} className="input-field w-full" />
                </div>
                <div>
                  <label>REGISTRY CHARGES:</label>
                  <input type="text" name="registry_charges" value={editData.registry_charges || ""} onChange={handleChange} className="input-field w-full" />
                </div>
                <div>
                  <label>P1 P2 CHARGES:</label>
                  <input type="text" name="p1p2_charges" value={editData.p1p2_charges || ""} onChange={handleChange} className="input-field w-full" />
                </div>
                <div>
                  <label>REMARKS:</label>
                  <textarea name="remarks" value={editData.remarks || ""} onChange={handleChange} className="input-field w-full"></textarea>
                </div>
              </div>
              {message && <p className="text-center mt-3 text-red-500">{message}</p>}
              <div className="mt-6 flex justify-center">
                <button type="submit" className="btn-primary">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
      </Wrapper>
    </>
  );
};

export default UpdateQuotation;
const Wrapper = styled.div`
.input-field {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  outline: none;
}

.btn-primary {
  background-color: #007bff;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-primary:hover {
  background-color: #0056b3;
}

`;