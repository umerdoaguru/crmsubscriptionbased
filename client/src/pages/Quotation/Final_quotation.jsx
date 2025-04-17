import React, { useState, useEffect } from "react";

import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import { styled } from "styled-components";
import UpdateServicesForm from "./UpdateServicesForm";
import UpdateHeaderImageForm from "./UpdateHeaderImageForm";
import UpdateFooterImageForm from "./UpdatFooterImageForm";
import Footer from "./Footer";
import UserLogin from "../../components/UserLogin";
import Logout from "../../components/Logout";

function Final_quotation() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [quotations, setQuotations] = useState([]);
  const [quotationName, setQuotationName] = useState("");
  const [quotationServiceDescription, setQuotationServiceDescription] =
    useState("");
  const [totalActualPrice, setTotalActualPrice] = useState(0);
  const [totalOfferPrice, setTotalOfferPrice] = useState(0);
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const [notes, setNotes] = useState([]);
  const [quotationStatus, setQuotationStatus] = useState(""); // New state for status

  const fetchQuotations = async () => {
    try {
      const response = await axios.get(
        `http://localhost:9000/api/quotation/${id}`
      );

      if (response.status === 200) {
        setQuotationName(response.data[0].quotation_name);
        setQuotations(response.data);

        // Set the status from the response using the correct field name
        setQuotationStatus(response.data[0].status); // Changed to status
        console.log("Quotation Status:", response.data[0].status);

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

  const fetchNotes = async () => {
    try {
      const response = await axios.get(`http://localhost:9000/api/notes/${id}`);

      if (response.status === 200) {
        setNotes(response.data);
      }
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  };

  const handlePrintPage = () => {
    navigate(`/print/${id}`);
  };

  const handleUpdateSuccess = () => {
    console.log("Services updated successfully");
    setIsUpdateMode(false);
    // window.location.reload();
    fetchQuotations();
  };

  const handleUpdateError = () => {
    console.error("Error updating services");
    // Handle error, e.g., show an error message or update state
  };

  const handleAddNotes = () => {
    navigate(`/createnotes/${id}`);
  };

  const handleDeleteNotes = () => {
    navigate(`/deletenotes/${id}`);
  };
  const handleUpdateNotes = () => {
    navigate(`/update-notes/${id}`);
  };

  const handleAddServices = () => {
    navigate(`/addservices/${id}`);
  };
  const handleDeleteService = async (serviceId) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this row data?"
    );

    if (isConfirmed) {
      try {
        // Make an API call to delete the service
        const response = await axios.delete(
          `http://localhost:9000/api/services/${serviceId}`
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

  useEffect(() => {
    fetchQuotations();
    fetchNotes();
    handleUpdateSuccess();
  }, []);

  const filterServicesByType = (type) => {
    return quotations.filter((q) => q.service_type === type);
  };
  const handleReview = () => {
    navigate(`/review/${id}`);
    window.scrollTo(0, 0);
  };
  const handleBackClick = () => {
    navigate(-1); // -1 navigates to the previous page in history
  };
  // const handleNavigation = (quotations_data) => {
  //   // Replace `lead.lead_id` with the actual lead ID you want to navigate to
  //   navigate(`/View_quotations/${quotations_data.lead_id}`);
  // };

  return (
    <>
      <Wrapper>
        <div className="w-full px-2">
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12 lg:col-span-4 mt-3">
              <div className="mx-lg-4 font-medium">
                <UserLogin />
              </div>
            </div>
            <div className="col-span-12 lg:col-span-4 mt-3">
              <h5 className="text-center text-xl font-medium">
                Quotation Name: {quotationName}
              </h5>
            </div>
            {/* <div className="col-span-12 lg:col-span-4 mt-3">
              <div className="flex justify-end mx-lg-2">
                <Logout />
              </div>
            </div> */}
          </div>

          <div className="w-full px-2 mt-4">
            <div className="flex justify-between">
              <div className="">
                <button
                  onClick={() => navigate(-1)}
                  className="text-white bg-green-500 hover:bg-green-600 rounded py-2 px-4 w-auto block text-center"
                >
                  <i className="bi bi-arrow-return-left mx-1"></i>Back
                </button>
              </div>
              <div className="flex space-x-3">
                <div className="">
                  <button
                    className="bg-green-500 hover:bg-green-600 text-white rounded py-2 px-4 w-full"
                    onClick={() => setIsUpdateMode(true)}
                  >
                    Update Services
                  </button>
                </div>
                <div className="">
                  <button
                    className="bg-green-500 hover:bg-green-600 text-white rounded py-2 px-4 w-full"
                    onClick={handleAddServices}
                  >
                    Add Services
                  </button>
                </div>
                <div className="">
                  <Link
                    to="/employee-all-quotation"
                    className="text-white bg-green-500 hover:bg-green-600 rounded py-2 px-4 w-full block text-center"
                  >
                    Quotation List
                  </Link>
                  {/* <button
                    onClick={handleNavigation}
                    className="text-white bg-green-500 hover:bg-green-600 rounded py-2 px-4 w-full block text-center"
                  >
                    Quotation List
                  </button> */}
                </div>
              </div>
            </div>

            {isUpdateMode && (
              <UpdateServicesForm
                quotationId={id}
                onUpdateSuccess={handleUpdateSuccess}
                onUpdateError={handleUpdateError}
              />
            )}
          </div>

          <div className="w-full px-2">
            <div className="w-full px-2 mt-3">
              <h4>Paid Services</h4>
              <div className="overflow-y-auto" style={{ maxHeight: "700px" }}>
                <table className="table-auto w-full border-collapse border border-gray-300">
                  <thead className="bg-gray-200">
                    <tr>
                      <th className="border border-gray-300 p-2">Sr.No</th>
                      <th className="border border-gray-300 p-2">
                        Service Name
                      </th>
                      <th className="border border-gray-300 p-2">
                        Service Description
                      </th>
                      <th className="border border-gray-300 p-2">
                        Actual Price(INR)
                      </th>
                      <th className="border border-gray-300 p-2">
                        Offer Price(INR)
                      </th>
                      <th className="border border-gray-300 p-2">
                        Subscription
                      </th>
                      <th className="border border-gray-300 p-2">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filterServicesByType("Paid").map((q, index) => (
                      <tr key={q.id} className="hover:bg-gray-100">
                        <td className="border border-gray-300 p-2 text-center font-bold">
                          {index + 1}
                        </td>
                        <td className="border border-gray-300 p-2 font-bold">
                          {q.service_name}
                        </td>
                        <td className="border border-gray-300 p-2">
                          {q.service_description
                            .split(".")
                            .map((part, index) => (
                              <p key={index}>
                                {part.trim()}
                                {index !==
                                  q.service_description.split(".").length - 1 &&
                                  "."}
                              </p>
                            ))}
                        </td>
                        <td className="border border-gray-300 p-2">
                          {q.actual_price}
                        </td>
                        <td className="border border-gray-300 p-2">
                          {q.offer_price}
                        </td>
                        <td className="border border-gray-300 p-2">
                          {q.subscription_frequency}
                        </td>
                        <td className="border border-gray-300 p-2">
                          <button
                            className="bg-red-500 hover:bg-red-600 text-white rounded py-1 px-2"
                            onClick={() => handleDeleteService(q.service_id)}
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

            {/* Complimentary Services */}
            <div className="w-full px-2 mt-3">
              <h4>Complimentary Services</h4>
              <div className="overflow-y-auto" style={{ maxHeight: "700px" }}>
                <table className="table-auto w-full border-collapse border border-gray-300">
                  <thead className="bg-gray-200">
                    <tr>
                      <th className="border border-gray-300 p-2">Sr.No</th>
                      <th className="border border-gray-300 p-2">
                        Service Name
                      </th>
                      <th className="border border-gray-300 p-2">
                        Service Description
                      </th>
                      <th className="border border-gray-300 p-2">
                        Actual Price(INR)
                      </th>
                      <th className="border border-gray-300 p-2">
                        Offer Price(INR)
                      </th>
                      <th className="border border-gray-300 p-2">
                        Subscription
                      </th>
                      <th className="border border-gray-300 p-2">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filterServicesByType("Complimentary").map((q, index) => (
                      <tr
                        key={q.id}
                        className="hover:bg-gray-100 border-gray-300  "
                      >
                        <td className="text-center font-bold">{index + 1}</td>
                        <td className="font-bold border p-2">
                          {q.service_name}
                        </td>
                        <td className="whitespace-pre-line border p-2">
                          {q.service_description}
                        </td>
                        <td className="border p-2 th">{q.actual_price}</td>
                        <td className="border p-2 th">{q.offer_price}</td>
                        <td className="border p-2 th">
                          {q.subscription_frequency}
                        </td>
                        <td className="border border-gray-300 p-2">
                          <button
                            className="bg-red-500   hover:bg-red-600 text-white rounded py-1 px-2"
                            onClick={() => handleDeleteService(q.service_id)}
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

            <div className="note mt-3">
              <h5 className="font-bold">Notes:</h5>
              <ul>
                {notes.map((note) => (
                  <li key={note.id}>
                    {note.note_text}
                    <p>{note.additional_info}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="w-full px-2 mt-4">
            <div className="flex space-x-3 items-center">
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white rounded py-2 px-4"
                onClick={handleAddNotes}
              >
                Add Notes
              </button>
              <button
                className="bg-red-500 hover:bg-red-600 text-white rounded py-2 px-4"
                onClick={handleDeleteNotes}
              >
                Delete Notes
              </button>
              <button
                className="bg-teal-500 hover:bg-teal-600 text-white rounded py-2 px-4"
                onClick={handleUpdateNotes}
              >
                Edit Notes
              </button>
              <button
                className="bg-green-500 hover:bg-green-600 text-white rounded py-2 px-4 mt-1"
                onClick={handleReview}
              >
                Review Quotation Data
              </button>
              {/* Print Button */}
              {/* <div className="flex space-x-3 items-center mt-4"> */}
              {/* <button
                className="bg-green-700 hover:bg-green-600 text-white rounded p-2 mt-1"
                onClick={handlePrintPage}
                disabled={quotationStatus !== "	Approved"} // Enable button if approved
              >
                Print Page
              </button> */}
              {/* </div> */}
            </div>
          </div>
        </div>

        {/* <div className="w-full px-2">
        <div className="mt-3 mb-3">
          {isUpdateFooterMode ? (
            <UpdateFooterImageForm
              quotationId={id}
              onBack={() => setIsUpdateHeaderMode(false)}
            />
          ) : (
            <>
              <div className="mt-3 mb-3">
                <img
                  src={footerImagePath}
                  alt="footer not found"
                  style={{ maxWidth: "100%", height: "auto" }}
                />
              </div>
              <button
                className="btn btn-primary mx-2"
                onClick={handleAddFooterImage}
              >
                Add Footer Image
              </button>

              <button
                className="btn btn-primary mx-2"
                onClick={() => setIsUpdateFooterMode(true)}
              >
                Update Footer Image
              </button>
              <button
                className="btn btn-danger mx-2"
                onClick={handleDeleteFooterImage}
              >
                Delete Footer Image
              </button>
            </>
          )}
        </div>
        </div> */}
      </Wrapper>

      {/* <button className="btn btn-success mt-2  mb-3" onClick={handleChangeHeaderFooter}>

           
             Change Footer
         
          </button> */}
    </>
  );
}

export default Final_quotation;

const Wrapper = styled.div`
  th {
    font-weight: bold;
    font-size: 1.2rem;
  }
  .table {
    border: black;
  }
  .th {
    font-weight: bold;
    font-size: 1.2rem;
  }
  li {
    font-weight: bold;
    font-size: 1rem;
  }
`;
