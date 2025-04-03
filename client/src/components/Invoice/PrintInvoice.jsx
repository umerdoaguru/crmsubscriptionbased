import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import img from "../../images/itsolution.png";

import moment from "moment";
import { useSelector } from "react-redux";

function PrintInvoice() {
  const { id } = useParams();
  const [duration, setDuration] = useState(""); // Initialize with Monthly as default
  const [invoice, setInvoice] = useState([]);
  const [invoiceName, setInvoiceName] = useState("");
  const [invoice_no, setInvoice_no] = useState("");
  const [invoiceDate, setInvoiceDate] = useState("");
  const [invoice_Start_Date, setInvoice_Start_Date] = useState("");
  const [invoice_End_Date, setInvoice_End_Date] = useState("");
  const [invoiceAddress, setInvoiceAddress] = useState("");
  const [invoiceClientGst_no, setInvoiceClientGst_no] = useState("");
  const [invoiceClientGst_per, setInvoiceClientGst_per] = useState("");
  const [invoiceClientPan_no, setInvoiceClientPan_no] = useState("");
  const UserId = useSelector((state) => state.auth.user.id);
  const [accountname, setAccountName] = useState("");
  const [accountIFSC, setAccountIFSC] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [companyAddress, setCompanyAddress] = useState("");
  const [companyLogo, setCompanyLogo] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [companyCharges, setCompanyCharges] = useState("");
  const [companyBank, setCompanyBank] = useState("");
  const [companySelected, setCompanySelected] = useState("");
  const [paymentMode, setpaymentMode] = useState("");
  const [advancePayment, setadvancePayment] = useState("");
  const [invoicecompanyType, setinvoicecompanyType] = useState("");
  const [invoiceGstType, setinvoiceGstType] = useState("");
  const [companyMoblie_no, setCompanyMoblie_no] = useState("");

  const [companyGST_no, setCompanyGST_no] = useState("");
  const [companyGST_per, setCompanyGST_per] = useState(0);
  const [companyPan_no, setCompanyPan_no] = useState("");
  const [companyEmail_id, setCompanyEmail_id] = useState("");
  const [companycharge, setCompanycharge] = useState("");
  const [companydigitalsign, setCompanydigitalsign] = useState(null);
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInvoiceAddress = async () => {
      try {
        const response = await axios.get(
          `https://crmdemo.vimubds5.a2hosted.com/api/invoice-address/${id}`
        );
        console.log(response.data);
        if (response.status === 200) {
          const { data } = response;
          console.log(data);

          setInvoiceAddress(data[0].invoice_address);

          setpaymentMode(data[0].payment_mode);
          setadvancePayment(data[0].advance_payment);
          setInvoiceClientGst_no(data[0].client_gst_no);
          setInvoiceClientGst_per(data[0].client_gst_per);
          setInvoiceClientPan_no(data[0].client_pan_no);
          setinvoicecompanyType(data[0].company_type);
          setInvoice_no(data[0].invoice_no);
          setInvoiceDate(data[0].invoice_date);
          setInvoice_Start_Date(data[0].duration_start_date);
          setInvoice_End_Date(data[0].duration_end_date);
        } else {
        }
      } catch (error) {}
    };

    fetchInvoiceAddress();
  }, [id]);

  const fetchInvoice = async () => {
    try {
      const response = await axios.get(
        `https://crmdemo.vimubds5.a2hosted.com/api/invoice/${id}`
      );
      if (response.status === 200) {
        setInvoiceName(response.data[0].invoice_name);
        setInvoice(response.data);
      }
    } catch (error) {}
  };

  const gstpercentagehalf = invoiceClientGst_per / 2;
  const gstpercentagefull = invoiceClientGst_per;

  const renderServiceTables = (
    subscriptionFrequency,
    serviceTypeTitle,
    SelectGstType
  ) => {
    {
      let actualPriceTotal = 0;
      let offerPriceTotal = 0;
      let cgstTotalActualPrice = 0;
      let cgstTotalOfferPrice = 0;
      let sgstTotalOfferPrice = 0;
      let sgstTotalActualPrice = 0;
      let advancePaymentAmount = advancePayment;
      let gstTotalActualPrice = 0;
      let gstTotalOfferPrice = 0;

      const services = invoice.filter(
        (q) =>
          q.subscription_frequency === subscriptionFrequency &&
          q.service_type === serviceTypeTitle
      );

      services.forEach((q) => {
        actualPriceTotal += q.actual_price;
        offerPriceTotal += q.offer_price;
      });

      if (services.length > 0) {
        // Apply GST only for Doaguru Infosystems
        if (SelectGstType === "Excluding") {
          cgstTotalActualPrice = (actualPriceTotal * gstpercentagehalf) / 100;
          sgstTotalActualPrice = (actualPriceTotal * gstpercentagehalf) / 100;
          cgstTotalOfferPrice = (offerPriceTotal * gstpercentagehalf) / 100;
          sgstTotalOfferPrice = (offerPriceTotal * gstpercentagehalf) / 100;
        } else if (SelectGstType === "Excluding") {
          cgstTotalActualPrice = (actualPriceTotal * gstpercentagefull) / 100;
          cgstTotalOfferPrice = (offerPriceTotal * gstpercentagefull) / 100;
        } else if (SelectGstType === "Including") {
          gstTotalActualPrice =
            actualPriceTotal * (100 / (100 + gstpercentagefull));
          gstTotalOfferPrice =
            offerPriceTotal * (100 / (100 + gstpercentagefull));
        }
        // Calculate the total payable amount excluding
        const totalPayableAmountActual =
          actualPriceTotal + cgstTotalActualPrice + sgstTotalActualPrice;
        const totalPayableAmountOffer =
          offerPriceTotal + cgstTotalOfferPrice + sgstTotalOfferPrice;

        // including
        const totalGstPayableAmountActual = parseFloat(
          gstTotalActualPrice.toFixed(2)
        );
        const totalGstPayableAmountOffer = parseFloat(
          gstTotalOfferPrice.toFixed(2)
        );

        // Calculate the remaining amount after deducting advance payment Excluding

        return (
          <div>
            <h5 className="font-semibold">{`${serviceTypeTitle} Services - ${subscriptionFrequency}`}</h5>
            <div className="overflow-y-auto">
              <table className="min-w-full border border-black">
                <thead>
                  <tr>
                    <th className="px-4 py-2 border">Sr.No</th>
                    <th className="px-4 py-2 border">Service Name</th>
                    <th className="px-4 py-2 border">Actual Price(INR)</th>
                    <th className="px-4 py-2 border">Offer Price(INR)</th>
                  </tr>
                </thead>
                <tbody>
                  {services.map((q, index) => (
                    <tr key={q.id}>
                      <td className="px-4 py-2 text-center text-sm font-bold border">
                        {index + 1}
                      </td>
                      <td className="px-4 py-2 text-sm font-bold border">
                        {q.service_name}
                      </td>
                      <td className="px-4 py-2 border">{q.actual_price}</td>
                      <td className="px-4 py-2 border">{q.offer_price}</td>
                    </tr>
                  ))}
                  <tr>
                    <td colSpan="2" className="px-4 py-2 border">
                      Total {`${serviceTypeTitle} Amount`}
                    </td>
                    <td className="px-4 py-2 font-semibold border">
                      {actualPriceTotal}
                    </td>
                    <td className="px-4 py-2 font-semibold border">
                      {offerPriceTotal}
                    </td>
                  </tr>

                  {/* Render GST rows if the selected company is Doaguru Infosystems */}

                  {serviceTypeTitle === "Paid" &&
                    SelectGstType === "Excluding" && (
                      <>
                        <tr>
                          <td
                            colSpan="2"
                            className="px-4 py-2 text-center border"
                          >
                            CGST {invoiceClientGst_per / 2}%
                          </td>
                          <td className="px-4 py-2 font-semibold border">
                            {cgstTotalActualPrice}
                          </td>
                          <td className="px-4 py-2 font-semibold border">
                            {cgstTotalOfferPrice}
                          </td>
                        </tr>
                        <tr>
                          <td
                            colSpan="2"
                            className="px-4 py-2 text-center border"
                          >
                            SGST {invoiceClientGst_per / 2}%
                          </td>
                          <td className="px-4 py-2 font-semibold border">
                            {sgstTotalActualPrice}
                          </td>
                          <td className="px-4 py-2 font-semibold border">
                            {sgstTotalOfferPrice}
                          </td>
                        </tr>
                        <tr>
                          <td colSpan="2" className="px-4 py-2 border">
                            Total Payable Amount
                          </td>
                          <td className="px-4 py-2 font-semibold border">
                            {totalPayableAmountActual}
                          </td>
                          <td className="px-4 py-2 font-semibold border">
                            {totalPayableAmountOffer}
                          </td>
                        </tr>
                      </>
                    )}

                  {/* Including */}

                  {serviceTypeTitle === "Paid" &&
                    SelectGstType === "Including" && (
                      <>
                        <tr>
                          <td
                            colSpan="2"
                            className="px-4 py-2 text-center border"
                          >
                            GST {gstpercentagefull}%
                          </td>
                          <td className="px-4 py-2 font-semibold border">
                            {totalGstPayableAmountActual}
                          </td>
                          <td className="px-4 py-2 font-semibold border">
                            {totalGstPayableAmountOffer}
                          </td>
                        </tr>
                        <tr>
                          <td colSpan="2" className="px-4 py-2 border">
                            Total Payable Amount
                          </td>
                          <td className="px-4 py-2 font-semibold border">
                            {totalGstPayableAmountActual}
                          </td>
                          <td className="px-4 py-2 font-semibold border">
                            {totalGstPayableAmountOffer}
                          </td>
                        </tr>
                      </>
                    )}
                </tbody>
              </table>
            </div>
          </div>
        );
      } else {
        return null;
      }
    }
  };

  const renderPaidServices = (invoiceGstType) => {
    return (
      <>
        {renderServiceTables("Monthly", "Paid", invoiceGstType)}
        {renderServiceTables("Yearly", "Paid", invoiceGstType)}
        {renderServiceTables("One Time", "Paid", invoiceGstType)}
        {renderServiceTables("Quarterly", "Paid", invoiceGstType)}
        {renderServiceTables("Half Yearly", "Paid", invoiceGstType)}
        {renderServiceTables("Weekly", "Paid", invoiceGstType)}
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
        {renderServiceTables("15 Days", "Complimentary")}
        {renderServiceTables("10 Days", "Complimentary")}
        {renderServiceTables("1-5 Days", "Complimentary")}
        {/* Add similar calls for other subscription frequencies for Complimentary services */}
      </>
    );
  };

  const fetchCompanyData = async (companyType) => {
    try {
      // Make a POST request to fetch data for the selected company
      const response = await axios.post(
        "https://crmdemo.vimubds5.a2hosted.com/api/company-name-data",
        {
          company_name: companyType,
        }
      );

      if (response.status === 200) {
        const {
          logo,
          company_name,
          company_name_account_name,
          company_name_account_ifsc,
          company_name_account_number,
          company_address,
          charges,
          bank,
          moblie_no,
          gst_no,
          pan_no,
          email_id,
          digital_sign,
        } = response.data;
        console.log(response);

        // Update the component state with the fetched data
        setCompanyLogo(logo);
        setCompanyName(company_name);
        setAccountName(company_name_account_name);
        setAccountIFSC(company_name_account_ifsc);
        setAccountNumber(company_name_account_number);
        setCompanyAddress(company_address);
        setCompanyCharges(charges);
        setCompanyBank(bank);
        setCompanyMoblie_no(moblie_no);
        setCompanyGST_no(gst_no);
        setCompanyPan_no(pan_no);
        setCompanyEmail_id(email_id);
        setCompanydigitalsign(digital_sign);
      } else {
      }
    } catch (error) {}
  };

  useEffect(() => {
    fetchCompanyData(invoicecompanyType);
  }, [invoicecompanyType]);

  const handlePrintPage = () => {
    if (companyGST_no && !invoiceGstType) {
      // If the company GST number exists but the GST type is not selected, prompt the user to select GST type before printing
      alert("Please select GST Type before printing.");
      return;
    }

    // If the company PAN number exists or if it doesn't exist (since we don't have a condition here), proceed with printing directly, regardless of the selected GST type
    document.title = `Invoice of ${invoiceName}`;
    window.print();
    document.title = "Your Website Title";
  };

  const handleInvoiceGstTypeChange = (e) => {
    setinvoiceGstType(e.target.value);
  };

  const fetchNotes = async () => {
    try {
      const response = await axios.get(
        `https://crmdemo.vimubds5.a2hosted.com/api/invoice-get-notes/${id}`
      );

      if (response.status === 200) {
        setNotes(response.data);
      }
    } catch (error) {}
  };

  useEffect(() => {
    fetchInvoice();

    fetchNotes();
  }, []);

  const parsedInvoiceDate = moment(invoiceDate);

  // Add one day to the parsed date
  const adjustedInvoiceDate = parsedInvoiceDate.add(0, "days");

  // Format the adjusted date as a string in the desired format (YYYY-MM-DD)
  const formattedAdjustedInvoiceDate = adjustedInvoiceDate.format("DD-MM-YYYY");

  const parsedInvoiceDateStart = moment(invoice_Start_Date);

  // Add one day to the parsed date
  const adjustedInvoiceDateStart = parsedInvoiceDateStart.add(0, "days");

  // Format the adjusted date as a string in the desired format (YYYY-MM-DD)
  const formattedAdjustedInvoiceDateStart =
    adjustedInvoiceDateStart.format("DD-MM-YYYY");

  const parsedInvoiceDateEnd = moment(invoice_End_Date);

  // Add one day to the parsed date
  const adjustedInvoiceDateEnd = parsedInvoiceDateEnd.add(0, "days");

  // Format the adjusted date as a string in the desired format (YYYY-MM-DD)
  const formattedAdjustedInvoiceDateEnd =
    adjustedInvoiceDateEnd.format("DD-MM-YYYY");

  const handleAddNotes = () => {
    navigate(`/invoicecreatenotes/${id}`);
  };
  const handleDeleteNotes = () => {
    navigate(`/invoicedeletenotes/${id}`);
  };
  const handleUpdateNotes = () => {
    navigate(`/invoice-update-notes/${id}`);
  };

  return (
    <Wrapper>
      <div>
        <Link
          to={`/final-invoice/${id}`}
          className="bg-green-500 text-white mx-1 mt-3 mb-2 w-1/4 text-center py-2 rounded"
        >
          <i className="bi bi-arrow-return-left mx-1"></i> Back
        </Link>

        <Link
          to="/invoicelist"
          className="bg-green-500 text-white mt-2 float-right w-1/4 text-center py-2 rounded"
        >
          Invoice List
        </Link>

        <div>
          <button
            className="bg-green-500 text-white mb-3 mt-2 w-full p-3 rounded"
            onClick={handlePrintPage}
          >
            Print Page
          </button>
        </div>

        <div>
          <div className="flex">
            <div>
              <img
                src={companyLogo}
                height={200}
                width={200}
                alt=""
                className="mt-[-3rem]"
              />
            </div>
            <div className="ml-4">
              <h6 className="leading-6 text-sm">
                {companyName} Address :- {companyAddress}
                <br /> Mobile Number:-{companyMoblie_no}
                <br />
                {companyGST_no && <>GST Number : - {companyGST_no}</>}
                {companyPan_no && <>Pan Card No. : - {companyPan_no}</>}
                <br /> Email Id :- {companyEmail_id}
              </h6>
            </div>
          </div>

          <div className="flex justify-between mt-4">
            <div>
              Invoice No :- {invoice_no}{" "}
              <Link
                to={`/update-invoice-number/${id}`}
                className="text-blue-500"
              >
                Edit
              </Link>
            </div>
            <div>
              Invoice Date :- {formattedAdjustedInvoiceDate}{" "}
              <Link to={`/update-invoice-date/${id}`} className="text-blue-500">
                Edit
              </Link>
            </div>
          </div>

          <div className="flex justify-between mt-2">
            <div>
              Service Duration :- {formattedAdjustedInvoiceDateStart}{" "}
              <Link
                to={`/update-invoice-start-date/${id}`}
                className="text-blue-500"
              >
                Edit
              </Link>
              &nbsp; to {formattedAdjustedInvoiceDateEnd}{" "}
              <Link
                to={`/update-invoice-end-date/${id}`}
                className="text-blue-500"
              >
                Edit
              </Link>
            </div>
            <div>Payment Mode :- {paymentMode}</div>
          </div>

          <div className="flex mt-3">
            <table className="w-full border border-black">
              <thead>
                <tr>
                  <th className="p-2 border">BILL TO</th>
                  <th className="p-2 border">SHIP TO</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-2 border">
                    <strong>{invoiceName}</strong>
                  </td>
                  <td className="p-2 border">
                    <strong>{invoiceName}</strong>
                  </td>
                </tr>
                <tr>
                  <td className="p-2 border">
                    <h6>{invoiceAddress}</h6>
                  </td>
                  <td className="p-2 border">
                    <h6>{invoiceAddress}</h6>
                  </td>
                </tr>
                {invoiceClientGst_no && (
                  <tr>
                    <td className="p-2 border">
                      <h6>GST:-{invoiceClientGst_no}</h6>
                    </td>
                    <td className="p-2 border">
                      <h6>GST:-{invoiceClientGst_no}</h6>
                    </td>
                  </tr>
                )}
                {invoiceClientPan_no && (
                  <tr>
                    <td className="p-2 border">
                      <h6>Pan Card :-{invoiceClientPan_no}</h6>
                    </td>
                    <td className="p-2 border">
                      <h6>Pan Card :-{invoiceClientPan_no}</h6>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {companyGST_no && (
            <div className="flex mt-3">
              <div className="w-full">
                <h4 className="text-center text-lg">Select GST Type</h4>
                <select
                  className="w-full border border-gray-300 p-2 rounded"
                  id={`invoicegstType`}
                  name="invoicegsttype"
                  onChange={handleInvoiceGstTypeChange}
                  value={invoiceGstType}
                  required
                >
                  <option value="">Select Invoice GST Type</option>
                  <option value="Excluding">Excluding</option>
                  <option value="Including">Including</option>
                </select>
              </div>
            </div>
          )}

          {renderPaidServices(invoiceGstType)}
          {renderComplimentaryServices(invoiceGstType)}

          <div className="mt-3">
            <h5 className="font-bold mb-3">Notes:-</h5>

            <ul>
              {notes.map((note) => (
                <li key={note.id} className="font-bold text-sm leading-5 mb-1">
                  {note.note_text}
                  <p>{note.additional_info}</p>
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-3">
            <button
              className="bg-blue-500 text-white py-2 px-4 rounded mr-2"
              onClick={handleAddNotes}
            >
              Add Notes
            </button>
            <button
              className="bg-red-500 text-white py-2 px-4 rounded mr-2"
              onClick={handleDeleteNotes}
            >
              Delete Notes
            </button>
            <button
              className="bg-teal-500 text-white py-2 px-4 rounded"
              onClick={handleUpdateNotes}
            >
              Edit Notes
            </button>
          </div>

          <div className="flex justify-between mt-6">
            <div>
              <h6 className="font-bold">Bank Details</h6>
              <ul className="list-none leading-6">
                <li>Name : {accountname}</li>
                <li>IFSC Code : {accountIFSC}</li>
                <li>Account No : {accountNumber}</li>
                <li>Bank : {companyBank}</li>
              </ul>
            </div>
            <div>
              <img
                src={companydigitalsign}
                height={200}
                width={200}
                alt=""
                className="mt-4"
              />
            </div>
          </div>

          <div
            className="mx-auto"
            style={{
              height: 1,
              width: "100%",
              backgroundColor: "#34495E",
              marginTop: 0,
              marginBottom: 0,
            }}
          ></div>

          <div className="mt-6">
            <button
              className="bg-green-500 text-white mb-3 mt-2 w-full p-3 rounded"
              onClick={handlePrintPage}
            >
              Print Page
            </button>
          </div>
        </div>
      </div>
    </Wrapper>
  );
}

export default PrintInvoice;

const Wrapper = styled.div`
  .th {
    font-weight: bold;
    font-size: 0.9rem;
  }
  .li1 {
    font-weight: bold;
    font-size: 0.9rem;
    padding: 0.3rem;
  }
  .thbold {
    font-weight: bold;
    font-size: 1rem;
  }
  .thbold1 {
    font-weight: bold;
    font-size: 0.9rem;
  }

  .btn-print {
    @media print {
      display: none;
    }
  }
  .borderremove {
    width: 5.2rem;
    @media print {
      border: none;
    }
  }
  .borderremove1 {
    width: 5.2rem;
    @media print {
      border: none;
    }
  }
  .date-input::-webkit-calendar-picker-indicator {
    display: none;
  }
  .details {
    margin-left: 7rem;
    @media screen and (max-width: 768px) {
      margin-left: 0.5rem;
    }
  }
`;
