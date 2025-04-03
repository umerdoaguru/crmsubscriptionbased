import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const EditInvoiceName = () => {
  const { id } = useParams();
  const [newName, setNewName] = useState("");

  const [showModal, setShowModal] = useState(true);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInvoiceData = async () => {
      try {
        const response = await axios.get(
          `https://crmdemo.vimubds5.a2hosted.com/api/invoice-name/${id}`
        );
        if (response.data) {
          setNewName(response.data[0].invoice_name);
        }
      } catch (error) {
        console.error("Error fetching invoice data:", error);
      }
    };
    fetchInvoiceData();
  }, [id]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.put(
        `https://crmdemo.vimubds5.a2hosted.com/api/invoice-data/${id}`,
        {
          newName,
        }
      );

      if (response.status === 200) {
        setMessage(response.data.message);
        navigate("/invoicelist");
      } else {
        setMessage(response.data.error || "Failed to update invoice");
      }
    } catch (error) {
      console.error("Error updating invoice:", error);
      setMessage("Internal Server Error");
    }

    setShowModal(false);
  };

  const handleClose = () => {
    setShowModal(false);
    navigate("/invoicelist");
  };

  return (
    <>
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Update Invoice</h2>
            </div>
            <form onSubmit={handleSubmit} className="mt-4">
              <div className="mb-4">
                <label
                  htmlFor="formNewName"
                  className="block text-sm font-medium text-gray-700"
                >
                  New Invoice Name
                </label>
                <input
                  type="text"
                  id="formNewName"
                  placeholder="Enter new invoice name"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  className="bg-gray-600 text-white px-4 py-2 rounded mr-2 hover:bg-gray-700"
                  onClick={handleClose}
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </div>
            </form>
            {message && <p className="mt-4 text-sm text-red-600">{message}</p>}
          </div>
        </div>
      )}
    </>
  );
};

export default EditInvoiceName;
