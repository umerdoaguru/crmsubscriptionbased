import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import { styled } from "styled-components";
import moment from "moment";
import Header from "./Header";
import Footer from "./Footer";

import EditableSeoPayment from "./EditableSeoPayment";
import EditablePaymentTable from "./EditablePaymentWebTable";
import { useSelector } from "react-redux";
import UserLogin from "../../components/UserLogin";
import Logout from "../../components/Logout";
import MainHeader from "../../components/MainHeader";
import EmployeeeSider from "../../components/EmployeeModule/EmployeeSider";

function Print_Page() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quotations, setQuotations] = useState([]);
  const [quotationDate, setQuotationDate] = useState(""); // New state to store quotation name
  const [quotationName, setQuotationName] = useState("");
  const [companyNames, setCompanyNames] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [accountname, setAccountName] = useState("");
  const [accountIFSC, setAccountIFSC] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [companyAddress, setCompanyAddress] = useState("");

  const [isCompanySelected, setIsCompanySelected] = useState(false); // Track if a company is selected

  const [notes, setNotes] = useState([]);
  const [footerImagePath, setFooterImagePath] = useState("");

  const [headerImagePath, setHeaderImagePath] = useState("");

  const UserId = useSelector((state) => state.auth.user.id);
  const [rowVisible, setRowVisible] = useState(true);

  const fetchQuotations = async () => {
    try {
      const response = await axios.get(
        `https://crmdemo.vimubds5.a2hosted.com/api/quotation/${id}`
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
      const response = await axios.get(`https://crmdemo.vimubds5.a2hosted.com/api/notes/${id}`);

      if (response.status === 200) {
        setNotes(response.data);
      }
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  };

  useEffect(() => {
    // Fetch company names from the backend
    const fetchCompanyNames = async () => {
      try {
        const response = await axios.get(
          `https://crmdemo.vimubds5.a2hosted.com/api/header-footer-images/company-names`
        );
        if (response.status === 200) {
          setCompanyNames(response.data); // Assuming response.data is an array of company names
        } else {
          console.error("Failed to fetch company names");
        }
      } catch (error) {
        console.error("Error fetching company names:", error);
      }
    };

    fetchCompanyNames();
  }, []);

  const handleCompanyNameChange = (e) => {
    setSelectedCompany(e.target.value);
    setIsCompanySelected(true); // Set company selected to true when a company is selected
  };

  const handlePrintPage = () => {
    if (!isCompanySelected) {
      // If no company is selected, prevent printing
      alert("Please select a company name Branch before printing.");
      return;
    }

    document.title = `Quotation of ${quotationName}`;
    window.print();
    document.title = "Your Website Title";
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
    const toggleRowVisibility = () => {
      setRowVisible(!rowVisible);
    };

    return (
      actualPriceTotal > 0 && (
        <div className="mt-4">
          <h5 className="font-bold text-lg">{`${serviceTypeTitle} Services - ${subscriptionFrequency}`}</h5>
          <div className="overflow-auto">
            <table className="min-w-full divide-y divide-gray-300 border border-gray-300">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 border border-gray-300 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sr.No
                  </th>
                  <th className="px-6 py-3 border border-gray-300 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Service Name
                  </th>
                  <th className="px-6 py-3 border border-gray-300 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Service Description
                  </th>
                  <th className="px-6 py-3 border border-gray-300 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actual Price (INR)
                  </th>
                  <th className="px-6 py-3 border border-gray-300 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Offer Price (INR)
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {services.map((q, index) => (
                  <tr key={q.id}>
                    <td className="px-6 py-4 border border-gray-300 text-center text-sm font-bold">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 border border-gray-300 text-sm font-bold">
                      {q.service_name}
                    </td>
                    <td className="px-6 py-4 border border-gray-300 text-sm">
                      {q.service_description.split(".").map((part, index) => (
                        <p key={index}>
                          {part.trim()}
                          {index !==
                            q.service_description.split(".").length - 1 && "."}
                        </p>
                      ))}
                    </td>
                    <td className="px-6 py-4 border border-gray-300 text-sm">
                      {q.actual_price}
                    </td>
                    <td className="px-6 py-4 border border-gray-300 text-sm">
                      {q.offer_price}
                    </td>
                  </tr>
                ))}
                {rowVisible && (
                  <tr>
                    <td
                      colSpan="3"
                      className="px-6 py-4 border border-gray-300 font-bold text-sm"
                    >
                      Total {`${serviceTypeTitle} Amount`}
                    </td>
                    <td className="px-6 py-4 border border-gray-300 font-bold text-sm">
                      {actualPriceTotal}
                    </td>
                    <td className="px-6 py-4 border border-gray-300 font-bold text-sm">
                      {offerPriceTotal}
                    </td>
                  </tr>
                )}
                <tr className="bg-gray-50 btn-print">
                  <td
                    colSpan="5"
                    className="px-6 py-4 text-center border border-gray-300"
                  >
                    <button
                      className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                      onClick={toggleRowVisibility}
                    >
                      {rowVisible ? "Hide" : "Show"}
                    </button>
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

  const renderWebsiteDevelopmentPaymentConditions = () => {
    // Find the service with the name "Website Design & Development"
    const websiteDevelopmentService = quotations.find(
      (service) => service.service_name === "Website Design & Development"
    );
    const moblieDevelopmentService = quotations.find(
      (service) =>
        service.service_name ===
        "Mobile Application Development (Android & IOS)"
    );
    const softwareDevelopmentService = quotations.find(
      (service) => service.service_name === "Software Development"
    );
    const graphicDesiginService = quotations.find(
      (service) => service.service_name === "Graphic & Logo Designing"
    );
    const videoEditingService = quotations.find(
      (service) => service.service_name === "Video Editing"
    );

    // Check if the service exists
    if (
      websiteDevelopmentService ||
      moblieDevelopmentService ||
      softwareDevelopmentService ||
      graphicDesiginService ||
      videoEditingService
    ) {
      return (
        <div className=" mt-2">
          <h4 className="mt-4">
            Payment Conditions for Website/Moblie/Software Development /Graphic
            & Logo Designing/Video Editing
          </h4>

          <EditablePaymentTable />
        </div>
      );
    } else {
      return null; // Return null if the service is not found
    }
  };

  const renderSEOPaymentConditions = () => {
    // Find the service with the name "SEO, SMO, and SMM"
    const seoService = quotations.find(
      (service) => service.service_name === "Search Engine Optimization (SEO)"
    );
    const smmService = quotations.find(
      (service) => service.service_name === "Social Media Marketing (SMM)"
    );
    const smoService = quotations.find(
      (service) => service.service_name === "Social Media Optimization (SMO)"
    );
    const bulkwhatsappService = quotations.find(
      (service) => service.service_name === "Bulk WhatsApp"
    );
    const youtubeService = quotations.find(
      (service) => service.service_name === "YouTube Optimization"
    );
    const GMBService = quotations.find(
      (service) => service.service_name === "Google My Business Assist"
    );
    const GoogleReviewsService = quotations.find(
      (service) => service.service_name === "Google Reviews"
    );
    const GooglePPCAdsService = quotations.find(
      (service) => service.service_name === "Google PPC Ads"
    );
    const websitemodifyService = quotations.find(
      (service) => service.service_name === "Website Modification & Maintenance"
    );

    // Check if the service exists
    if (
      seoService ||
      smmService ||
      smoService ||
      bulkwhatsappService ||
      youtubeService ||
      GMBService ||
      GoogleReviewsService ||
      GooglePPCAdsService ||
      websitemodifyService
    ) {
      return (
        <div className=" mt-2">
          <h4 className="mt-4">
            Payment Conditions for SEO/SMO/SMM/Bulk WhatsApp/YouTube
            Optimization/GMB/Google Reviews/Google PPC Ads/Website Modification
            & Maintenance
          </h4>

          <EditableSeoPayment />
        </div>
      );
    } else {
      return null; // Return null if the service is not found
    }
  };

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.post(
          "https://crmdemo.vimubds5.a2hosted.com/api/company-header-footer",
          {
            company_name: selectedCompany,
          }
        );
        console.log(response);

        if (response.status === 200) {
          const {
            company_name_account_name,
            company_name_account_ifsc,
            company_name_account_number,
            company_address,
          } = response.data;
          setAccountName(company_name_account_name);
          setAccountIFSC(company_name_account_ifsc);
          setAccountNumber(company_name_account_number);
          setCompanyAddress(company_address);
        } else {
          console.error(
            "Error fetching header and footer images:",
            response.statusText
          );
        }
      } catch (error) {
        console.error(
          "Error fetching header and footer images:",
          error.message
        );
      }
    };

    fetchImages();
  });

  useEffect(() => {
    fetchQuotations();
    fetchNotes();
  }, []);

  const handleDelete = () => {
    navigate(`/deletecompanydata/${id}`);
  };

  const handleUpdate = () => {
    navigate(`/mainupdatecompanydata/${id}`);
  };

  return (
    <>
      <MainHeader />
      <EmployeeeSider />
      <div className="flex flex-col 2xl:ml-44 mt-14 max-w-9xl">
        <div className="md:flex  max-sm:flex-col md:justify-between sm:justify-start  px-4">
          <div className="mx-3 btn-print mt-2 font-medium">
            <UserLogin />
          </div>
          {/* <div className=" mt-3 print:hidden">
            <Link
              to="/quotationlist"
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600  w-75 btn-print"
            >
              Quotation List
            </Link>
          </div> */}
        </div>

        <div className="flex justify-between items-center px-4 mt-3 mb-2">
          {/* <div className="">
            <Link
              to={`/final-quotation/${id}`}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mx-1 w-25 btn-print"
            >
              <i className="bi bi-arrow-return-left mx-1"></i> Back
            </Link>
          </div> */}
        </div>

        {/* <div className="container px-4">
    <button
      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mb-3 mt-2 w-full btn-print"
      onClick={handlePrintPage}
    >
      Print Page
    </button>
  </div> */}

        <div className="w-full px-4 mt-2">
          <h1 className="text-xl font-bold btn-print">Select Company Data</h1>
          <select
            className="form-select w-64 mt-2 mb-3 px-2 py-2 border rounded btn-print"
            value={selectedCompany}
            onChange={handleCompanyNameChange}
            required
          >
            <option value="">Select Company</option>
            {companyNames.map((company, index) => (
              <option className="px-4" key={index} value={company}>
                {company}
              </option>
            ))}
          </select>
        </div>

        <Header companyName={selectedCompany} quotationName={quotationName} />

        <div className="mt-5 px-4">
          <h2 className="text-2xl font-bold">
            Plan & Quotation for {quotationName}
          </h2>
          {renderPaidServices()}
          {renderComplimentaryServices()}

          <div className="mt-3">
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
          <div className="mt-2">
            {renderWebsiteDevelopmentPaymentConditions()}
          </div>
          <div className="mt-2 mb-3">{renderSEOPaymentConditions()}</div>

          <div>
            <table className="min-w-full divide-y divide-gray-300 mt-3 border border-gray-300">
              <thead className="bg-gray-100">
                <tr>
                  <th colSpan="3" className="text-center py-2 font-semibold">
                    Payment Details
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-4 py-2">{accountname}</td>
                  <td className="px-4 py-2">{accountIFSC}</td>
                  <td className="px-4 py-2">{accountNumber}</td>
                </tr>
                {/* Other payment details */}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-3 mb-2 px-4">
          <h6 className="text-lg">Address: {companyAddress}</h6>
        </div>

        <div className="container flex justify-center">
          <button
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mb-3 mt-2 w-auto btn-print print:hidden"
            onClick={handlePrintPage}
          >
            Print Page
          </button>
        </div>

        <Footer companyName={selectedCompany} />
      </div>

      {/* <Lastpage/> */}
    </>
  );
}

export default Print_Page;
const Wrapper = styled.div`
  // .thbold {
  //   font-weight: bold;
  //   font-size: 1.2rem;
  // }
  // th {
  //   font-weight: bold;
  //   font-size: 1rem;
  // }
  // .table {
  //   border: black;
  // }
  // .th {
  //   font-weight: bold;
  //   font-size: 1rem;
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

  // .footimage {
  //   @media print {
  //     /* position: fixed; */
  //     bottom: 0;
  //     left: 0;
  //     right: 0;
  //   }
  // }
`;
