import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import UpdateInvoiceServices from "./UpdateInvoiceServices";
import UserLogin from "../UserLogin";
import Logout from "../Logout";
import Sider from "../Sider";
import MainHeader from "../MainHeader";

function FinalInvoice() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [invoices, setInvoices] = useState([]);
  const [invoiceName, setInvoiceName] = useState([]);
  const [totalActualPrice, setTotalActualPrice] = useState(0);
  const [totalOfferPrice, setTotalOfferPrice] = useState(0);
  const [isUpdateMode, setIsUpdateMode] = useState(false);

  const fetchInvoices = async () => {
    try {
      const response = await axios.get(
        `http://localhost:9000/api/invoice/${id}`
      );

      if (response.status === 200) {
        setInvoiceName(response.data[0].invoice_name);
        setInvoices(response.data);

        const actualPriceTotal = response.data.reduce(
          (total, q) => total + q.actual_price,
          0
        );
        const offerPriceTotal = response.data.reduce(
          (total, q) => total + q.offer_price,
          0
        );

        setTotalActualPrice(actualPriceTotal);
        setTotalOfferPrice(offerPriceTotal);
      }
    } catch (error) {
      console.error("Error fetching quotations:", error);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const filterServicesByType = (type) => {
    return invoices.filter((q) => q.service_type === type);
  };

  const handleDeleteService = async (serviceId) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this row data?"
    );

    if (isConfirmed) {
      try {
        // Make an API call to delete the service
        const response = await axios.delete(
          `http://localhost:9000/api/invoice-service/${serviceId}`
        );

        if (response.status === 200) {
          console.log("Service deleted successfully");
          // You can perform additional actions after successful deletion
          window.location.reload();
        }
      } catch (error) {
        console.error("Error deleting service:", error);
      }
    }
  };

  const handleAddServices = () => {
    navigate(`/addservicesinvoice/${id}`);
  };

  const handleUpdateSuccess = () => {
    console.log("Services updated successfully");
    setIsUpdateMode(false);
  };

  const handleUpdateError = () => {
    console.error("Error updating services");
    // Handle error, e.g., show an error message or update state
  };

  const handleReview = () => {
    navigate(`/review-invoice/${id}`);
    window.scrollTo(0, 0);
  };
  const handlePrintPage = () => {
    navigate(`/print-invoice/${id}`);
  };

  return (
    <>
      <MainHeader />
      <Sider />
      <div className="container mt-5 px-2 mx-auto p-4">
        <div className="flex flex-wrap justify-between items-center mt-3">
          <div className="lg:w-1/3 mt-3">
            <div className="mx-4">
              <UserLogin />
            </div>
          </div>
          <div className="lg:w-1/3 mt-3 text-center">
            <h5>Invoice Name: {invoiceName}</h5>
          </div>
          <div className="lg:w-1/3 mt-3 text-right">
            <div className="mx-2">
              <Logout />
            </div>
          </div>
        </div>

        <div className="w-full px-2 mt-4">
          <div className="grid grid-cols-12 gap-2">
            <div className="col-span-12 lg:col-span-3">
              <Link
                to="/employee-all-quotation"
                className="text-white bg-green-600 hover:bg-green-700 btn w-full"
              >
                <i className="bi bi-arrow-return-left mr-1"></i>Back
              </Link>
            </div>
            <div className="col-span-12 lg:col-span-3">
              <button
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded w-full"
                onClick={() => setIsUpdateMode(true)}
              >
                Update Invoice Services
              </button>
            </div>

            <div className="col-span-12 lg:col-span-3">
              <button
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded w-full"
                onClick={handleAddServices}
              >
                Add Invoice Services
              </button>
            </div>
            <div className="col-span-12 lg:col-span-3">
              <Link to="/invoicelist">
                {" "}
                <button className="text-white text-decoration-none bg-green-600 hover:bg-green-700 font-bold py-2 px-4 rounded w-full">
                  Invoice List
                </button>
              </Link>
            </div>
          </div>
          {isUpdateMode && (
            <UpdateInvoiceServices
              invoiceId={id}
              onUpdateSuccess={handleUpdateSuccess}
              onUpdateError={handleUpdateError}
            />
          )}
        </div>

        <div className="container mx-auto mt-4">
          <div className="mt-3">
            <h4>Paid Services</h4>
            <div className="overflow-y-auto" style={{ maxHeight: "700px" }}>
              <table className="table-auto w-full border-collapse border border-gray-200">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-200 px-4 py-2">Sr.No</th>
                    <th className="border border-gray-200 px-4 py-2">
                      Service Name
                    </th>
                    <th className="border border-gray-200 px-4 py-2">
                      Actual Price (INR)
                    </th>
                    <th className="border border-gray-200 px-4 py-2">
                      Offer Price (INR)
                    </th>
                    <th className="border border-gray-200 px-4 py-2">
                      Subscription
                    </th>
                    <th className="border border-gray-200 px-4 py-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filterServicesByType("Paid").map((q, index) => (
                    <tr key={q.id}>
                      <td className="text-center font-bold border border-gray-200 px-4 py-2">
                        {index + 1}
                      </td>
                      <td className="font-bold border border-gray-200 px-4 py-2">
                        {q.service_name}
                      </td>
                      <td className="border border-gray-200 px-4 py-2">
                        {q.actual_price}
                      </td>
                      <td className="border border-gray-200 px-4 py-2">
                        {q.offer_price}
                      </td>
                      <td className="border border-gray-200 px-4 py-2">
                        {q.subscription_frequency}
                      </td>
                      <td className="border border-gray-200 px-4 py-2">
                        <button
                          className="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-3 rounded"
                          onClick={() =>
                            handleDeleteService(q.service_invoice_id)
                          }
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-3">
            <h4>Complimentary Services</h4>
            <div className="overflow-y-auto" style={{ maxHeight: "700px" }}>
              <table className="table-auto w-full border-collapse border border-gray-200">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-200 px-4 py-2">Sr.No</th>
                    <th className="border border-gray-200 px-4 py-2">
                      Service Name
                    </th>
                    <th className="border border-gray-200 px-4 py-2">
                      Actual Price (INR)
                    </th>
                    <th className="border border-gray-200 px-4 py-2">
                      Offer Price (INR)
                    </th>
                    <th className="border border-gray-200 px-4 py-2">
                      Subscription
                    </th>
                    <th className="border border-gray-200 px-4 py-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filterServicesByType("Complimentary").map((q, index) => (
                    <tr key={q.id}>
                      <td className="text-center font-bold border border-gray-200 px-4 py-2">
                        {index + 1}
                      </td>
                      <td className="font-bold border border-gray-200 px-4 py-2">
                        {q.service_name}
                      </td>
                      <td className="border border-gray-200 px-4 py-2">
                        {q.actual_price}
                      </td>
                      <td className="border border-gray-200 px-4 py-2">
                        {q.offer_price}
                      </td>
                      <td className="border border-gray-200 px-4 py-2">
                        {q.subscription_frequency}
                      </td>
                      <td className="border border-gray-200 px-4 py-2">
                        <button
                          className="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-3 rounded"
                          onClick={() =>
                            handleDeleteService(q.service_invoice_id)
                          }
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-2 text-center">
            <button
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded w-full"
              onClick={handlePrintPage}
            >
              Print Invoice
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default FinalInvoice;
