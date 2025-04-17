import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import styled from "styled-components";

function ReviewInvoice() {
  const { id } = useParams();
  const [invoices, setInvoices] = useState([]);
  const [invoiceDate, setInvoiceDate] = useState(""); // New state to store quotation name
  const [invoiceName, setInvoiceName] = useState("");
  const [notes, setNotes] = useState([]);

  const fetchInvoice = async () => {
    try {
      const response = await axios.get(
        `http://localhost:9000/api/invoice/${id}`
      );

      if (response.status === 200) {
        setInvoiceDate(response.data[0].created_date); // Set the invoice name
        setInvoiceName(response.data[0].invoice_name);
        setInvoices(response.data);
        console.log(response);
      }
    } catch (error) {
      console.error("Error fetching invoice:", error);
    }
  };

  const fetchNotes = async () => {
    try {
      const response = await axios.get(
        `http://localhost:9000/api/invoice-get-notes/${id}`
      );

      if (response.status === 200) {
        setNotes(response.data);
      }
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  };

  const renderServiceTables = (subscriptionFrequency, serviceTypeTitle) => {
    let actualPriceTotal = 0;
    let offerPriceTotal = 0;

    const services = invoices.filter(
      (q) =>
        q.subscription_frequency === subscriptionFrequency &&
        q.service_type === serviceTypeTitle
    );

    services.forEach((q) => {
      actualPriceTotal += q.actual_price;
      offerPriceTotal += q.offer_price;
    });

    return (
      actualPriceTotal > 0 && (
        <div className="mt-1">
          <h5 className="fw-bold">{`${serviceTypeTitle} Services - ${subscriptionFrequency}`}</h5>
          <div className="" style={{ maxHeight: "auto", overflowY: "auto" }}>
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Sr.No</th>
                  <th>Service Name</th>
                  {/* <th>Service Description</th> */}
                  <th>Actual Price(INR)</th>
                  <th>Offer Price(INR)</th>
                </tr>
              </thead>
              <tbody>
                {services.map((q, index) => (
                  <tr key={q.id}>
                    <td
                      className="text-center"
                      style={{ fontSize: "1rem", fontWeight: "bold" }}
                    >
                      {index + 1}
                    </td>
                    <td style={{ fontSize: "1rem", fontWeight: "bold" }}>
                      {q.service_name}
                    </td>
                    {/* <td>{q.service_description}</td> */}
                    <td className="th">{q.actual_price}</td>
                    <td className="th">{q.offer_price}</td>
                  </tr>
                ))}
                <tr>
                  <td colSpan="2" className="th">
                    Total {`${serviceTypeTitle} Amount`}
                  </td>
                  <td className="thbold">{actualPriceTotal}</td>
                  <td className="thbold">{offerPriceTotal}</td>
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

        {/* Add similar calls for other subscription frequencies for Complimentary services */}
      </>
    );
  };
  useEffect(() => {
    fetchInvoice();
    fetchNotes();
  }, []);
  return (
    <Wrapper>
      <Link
        to={`/final-invoice/${id}`}
        className="btn btn-success mx-1 mt-3 mb-2 btn-print "
      >
        <i className="bi bi-arrow-return-left mx-1"></i> Back
      </Link>

      <div className="container-fluid mt-5">
        <h3 className="mt-4">Plan & Quotation for {invoiceName}</h3>
        {renderPaidServices()}

        {renderComplimentaryServices()}
      </div>
      <div className="note mt-3">
        <h5 className=" fw-bold">Notes:-</h5>

        <ul>
          {notes.map((note) => (
            <li
              key={note.id}
              className="fw-bold "
              style={{ lineHeight: "0.5rem", fontSize: "0.9rem" }}
            >
              {note.note_text}
              <p>{note.additional_info}</p>
            </li>
          ))}
        </ul>
      </div>
      <Link
        to={`/final-invoice/${id}`}
        className="btn btn-success mx-1 mt-3 mb-2 btn-print "
      >
        <i className="bi bi-arrow-return-left mx-1"></i> Back
      </Link>
    </Wrapper>
  );
}

export default ReviewInvoice;
const Wrapper = styled.div`
  .th {
    font-weight: bold;
    font-size: 1rem;
  }
  li {
    font-weight: bold;
    font-size: 1rem;
  }
  .thbold {
    font-weight: bold;
    font-size: 1.2rem;
  }
  .thbold1 {
    font-weight: bold;
    font-size: 1rem;
  }
`;
