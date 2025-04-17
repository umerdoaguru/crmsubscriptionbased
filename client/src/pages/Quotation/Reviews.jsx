import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import { styled } from "styled-components";
import MainHeader from "../../components/MainHeader";
import EmployeeeSider from "../../components/EmployeeModule/EmployeeSider";

function Reviews({ handleClose }) {
  const { id } = useParams();
  const [quotations, setQuotations] = useState([]);
  const [quotationDate, setQuotationDate] = useState(""); // New state to store quotation name
  const [quotationName, setQuotationName] = useState("");

  const [notes, setNotes] = useState([]);
  const [footerImagePath, setFooterImagePath] = useState("");

  const [headerImagePath, setHeaderImagePath] = useState("");

  const fetchQuotations = async () => {
    try {
      const response = await axios.get(
        `
        http://localhost:9000/api/quotation/${id}`
      );

      if (response.status === 200) {
        setQuotationDate(response.data[0].created_date); // Set the quotation name
        setQuotationName(response.data[0].quotation_name);
        setQuotations(response.data);
        console.log(response);
      }
    } catch (error) {
      console.error("Error fetching quotations:", error);
    }
  };
  const fetchNotes = async () => {
    try {
      const response = await axios.get(
        `
        http://localhost:9000/api/notes/${id}`
      );

      if (response.status === 200) {
        setNotes(response.data);
      }
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  };
  const fetchHeaderImage = async () => {
    try {
      const response = await axios.get(
        `
        http://localhost:9000/api/${id}/header`
      );

      if (response.status === 200) {
        // Assuming your response.data structure contains the image URL
        setHeaderImagePath(response.data[0]?.file_path);
        console.log("Footer Image URL:", headerImagePath);
      }
    } catch (error) {
      console.error("Error fetching footer image:", error);
    }
  };

  const handlePrintPage = () => {
    window.print();
  };

  const renderServiceTables = (subscriptionFrequency, serviceTypeTitle) => {
    const actualPriceTotal = quotations.reduce(
      (total, q) =>
        q.subscription_frequency === subscriptionFrequency &&
        q.service_type === serviceTypeTitle
          ? total + q.actual_price
          : total,
      0
    );

    const offerPriceTotal = quotations.reduce(
      (total, q) =>
        q.subscription_frequency === subscriptionFrequency &&
        q.service_type === serviceTypeTitle
          ? total + q.offer_price
          : total,
      0
    );

    const services = quotations.filter(
      (q) =>
        q.subscription_frequency === subscriptionFrequency &&
        q.service_type === serviceTypeTitle
    );
    return (
      actualPriceTotal > 0 && (
        <div className="mt-4">
          <h5 className="text-xl font-semibold mb-3">{`${serviceTypeTitle} Services - ${subscriptionFrequency}`}</h5>
          <div className="max-h-[700px] overflow-y-auto">
            <table className="min-w-full divide-y divide-gray-200 bg-white border border-gray-300 mt-3">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sr.No
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Service Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Service Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actual Price (INR)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Offer Price (INR)
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {services.map((q, index) => (
                  <tr key={q.id}>
                    <td className="px-6 py-4 text-center text-sm font-medium text-gray-900">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {q.service_name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {q.service_description}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {q.actual_price}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {q.offer_price}
                    </td>
                  </tr>
                ))}
                <tr>
                  <td
                    colSpan="3"
                    className="px-6 py-4 text-sm font-medium text-gray-900"
                  >
                    Total {`${serviceTypeTitle} Amount`}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {actualPriceTotal}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {offerPriceTotal}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )
    );
  };

  const renderPaidServices = () => {
    return (
      <>
        {renderServiceTables("Monthly", "Paid")}
        {renderServiceTables("Yearly", "Paid")}
        {renderServiceTables("One Time", "Paid")}
        {renderServiceTables("Quarterly", "Paid")}
        {renderServiceTables("Half Yearly", "Paid")}
        {renderServiceTables("Weekly", "Paid")}
        {renderServiceTables("As Per Requirement", "Paid")}
        {renderServiceTables("15 Days", "Paid")}
        {renderServiceTables("10 Days", "Paid")}
        {renderServiceTables("1-5 Days", "Paid")}
        {/* Add similar calls for other subscription frequencies for Paid services */}
      </>
    );
  };

  const renderComplimentaryServices = () => {
    return (
      <>
        {renderServiceTables("Monthly", "Complimentary")}
        {renderServiceTables("Yearly", "Complimentary")}
        {renderServiceTables("One Time", "Complimentary")}
        {renderServiceTables("Quarterly", "Complimentary")}
        {renderServiceTables("Half Yearly", "Complimentary")}
        {renderServiceTables("Weekly", "Complimentary")}
        {renderServiceTables("As Per Requirement", "Complimentary")}
        {renderServiceTables("15 Days", "Complimentary")}
        {renderServiceTables("10 Days", "Complimentary")}
        {renderServiceTables("1-5 Days", "Complimentary")}
        {/* Add similar calls for other subscription frequencies for Complimentary services */}
      </>
    );
  };

  useEffect(() => {
    fetchQuotations();
    fetchNotes();
  }, []);

  return (
    <>
      <MainHeader />
      <EmployeeeSider />
      <div className="flex flex-col 2xl:ml-44 mt-14 max-w-7xl">
        {/* <Link
          to={`/final-quotation/${id}`}
          className="btn btn-success mx-1 mt-3 mb-2 bg-green-600 text-white hover:bg-green-700 rounded py-2 px-4 inline-flex items-center"
        >
          <i className="bi bi-arrow-return-left mx-1"></i> Back
        </Link> */}

        <div className="mt-4">
          {/* Example: Display date if needed */}
          {/* <p className="text-sm font-medium">Date: {moment(quotationDate).format('DD/MM/YYYY')}</p> */}

          {renderPaidServices()}
          {renderComplimentaryServices()}

          <div className="mt-6">
            <h5 className="text-lg font-semibold mb-3">Notes:</h5>
            <ul className="list-disc pl-5">
              {notes.map((note) => (
                <li key={note.id} className="mb-2">
                  <p>{note.note_text}</p>
                  {note.additional_info && (
                    <p className="text-gray-600">{note.additional_info}</p>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Example: Add footer or any additional content if needed */}
        {/* <div className="mt-6">
          <Footer />
        </div> */}

        <button>
          <Link
            to={`/final-quotation/${id}`}
            className="btn btn-success mx-1 mt-3 mb-2 bg-green-600 text-white hover:bg-green-700 rounded py-2 px-4 inline-flex items-center"
          >
            <i className="bi bi-arrow-return-left mx-1"></i> Back
          </Link>
        </button>
      </div>
    </>
  );
}

export default Reviews;
const Wrapper = styled.div`
  // th {
  //   font-weight: bold;
  //   font-size: 1.2rem;
  // }
  // .table {
  //   border: black;
  // }
  // .th {
  //   font-weight: bold;
  //   font-size: 1.2rem;
  // }
  // li {
  //   font-weight: bold;
  //   font-size: 1rem;
  // }

  // .btn-print {
  //   @media print {
  //     display: none;
  //   }
  // }
  // .no-print {
  //   display: none;

  //   @media print {
  //     display: block;
  //   }
  // }

  // .footimage {
  //   @media print {
  //     position: fixed;
  //     bottom: 0;
  //     left: 0;
  //     right: 0;
  //   }
  // }
`;
