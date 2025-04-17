import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import { styled } from "styled-components";
import UserLogin from "../../components/UserLogin";
import { FaClipboardList } from "react-icons/fa";
import { IoIosArrowBack } from "react-icons/io";
import { useSelector } from "react-redux";

function SuperQuotationVIew() {
  const navigate = useNavigate();
  const { id, leadId } = useParams();
  const [quotations, setQuotations] = useState([]);
  const [quotationName, setQuotationName] = useState("");
  const [totalActualPrice, setTotalActualPrice] = useState(0);
  const [totalOfferPrice, setTotalOfferPrice] = useState(0);
  const [quotationStatus, setQuotationStatus] = useState("");
  const superadminuser = useSelector((state) => state.auth.user);
  const token = superadminuser.token;

  const fetchQuotations = async () => {
    try {
      const response = await axios.get(`http://localhost:9000/api/quotation-super-admin/${id}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }});
      if (response.status === 200) {
        setQuotationName(response.data[0].customer_name);
        setQuotations(response.data);
        setQuotationStatus(response.data[0].status); // Assuming the status is part of the response

        const actualPriceTotal = response.data.reduce((total, q) => total + q.actual_price, 0);
        const offerPriceTotal = response.data.reduce((total, q) => total + q.offer_price, 0);
        setTotalActualPrice(actualPriceTotal);
        setTotalOfferPrice(offerPriceTotal);
      }
    } catch (error) {
      console.error("Error fetching quotations:", error);
    }
  };

  const handlePrintPage = () => {
    window.print();
  };
  
  useEffect(() => {
    fetchQuotations();
  }, []);

  return (
    <Wrapper>
      <div className="w-full px-2 flex flex-col justify-center items-center">
        <div className=" UserInfo grid grid-cols-12 gap-4">
          <div className=" col-span-12 lg:col-span-4 mt-3">
            <UserLogin />
          </div>
          <div className="col-span-12 lg:col-span-4 mt-3">
            <h5 className="text-center text-xl font-medium">Quotation Name: {quotationName}</h5>
          </div>
        </div>

        <div className="w-full px-2 mt-4">
          <div className="flex justify-between">
            <button
              onClick={() => navigate(-1)}
              className="text-black bg-gray-50 hover:bg-green-600 rounded py-2 px-3 w-auto border border-black flex justify-center items-center gap-1 "
            >
            <IoIosArrowBack /> Back
            </button>
         
          </div>
        </div>

        <div  className="container m-2">
          <div id="quotationData" className="QuotationDataPage">
            <div className="container border border-black rounded-lg h-auto m-2 p-4">
              <div className="flex flex-col justify-center items-center">
                <div>
                  <img src="https://one-realty.in/static/media/company_logo.b0c6ab3fa89a853264a3.png" alt="Company logo" />
                </div>
                <div className="flex flex-col justify-center items-center gap-2 text-black font-bold">
                  <h4 className="underline ">
                    First Floor chamber number 1&2 Dutt Residency,opposite stadium
                  </h4>
                  <h4 className="underline ">
                    North civil lines,Jabalpur(M.P.)Tel  +917614924920
                  </h4>
                  <h4 className="underline ">
                    Email : hronerealty@gmail.com  website : www.onerealty.in
                  </h4>
                  <h4 className="underline ">
                    REGISTRATION NO:- 04/14/01/0060/17    RERA ID NO:- P-JBP-23-4248
                  </h4>

                </div>
                <div className="mt-4">
                  <hr className="my-1" />
                  <h2 className="text-center font-bold text-2xl">QUOTATION</h2>
                  <hr className="my-1" />
                </div>
              </div>
              <div   className="flex flex-col mt-4 gap-3 ">
                {quotations[0] && (
                  <>
                    <div className="w-50 mr-2"><strong>CUSTOMER NAME:</strong> {quotations[0]?.customer_name}</div>
                    <div className="flex w-full">
                      <div className="w-50 mr-2">
                        <strong>CONTACT NUMBER:</strong> {quotations[0]?.contact_number}
                      </div>
                      <div className="w-50 mr-2">
                        <strong>ALTERNATE NUMBER:</strong> {quotations[0]?.alternate_number}
                      </div>
                    </div>
                    <div className="w-50 mr-2"><strong>ADDRESS:</strong> {quotations[0]?.address}</div>
                    <div className="w-full flex">
                      <div className="w-50 mr-2">
                        <strong>ADHAAR NUMBER:</strong> {quotations[0]?.adhaar_number}
                      </div>
                      <div className="w-50 mr-2">
                        <strong>PAN NUMBER:</strong> {quotations[0]?.pan_number}
                      </div>
                    </div>
                    <div className="w-50 mr-2"><strong>PROJECT NAME:</strong> {quotations[0]?.project_name}</div>
                    <div className="w-full flex">

                      <div className="w-50 mr-2"><strong>UNIT NUMBER:</strong> {quotations[0]?.unit_number}</div>
                      <div className="w-50 mr-2"><strong>DIMENSION:</strong> {quotations[0]?.dimension}</div>
                    </div>
                    <div className="w-full flex">
                      <div className="w-50 mr-2"><strong>RATE:</strong> {quotations[0]?.rate}</div>
                      <div className="w-50 mr-2"><strong>VARIANT:</strong> {quotations[0]?.variant}</div>
                    </div>
                    <div className="w-50 mr-2"><strong>TOTAL DEAL:</strong> {quotations[0]?.total_deal}</div>
                    <div className="w-full flex">
                      <div className="w-50 mr-2" v><strong>BOOKING AMOUNT:</strong> {quotations[0]?.booking_amount}</div>
                      <div className="w-50 mr-2"><strong> IN WORDS:</strong> {quotations[0]?.booking_amount_words}</div>
                    </div>
                    <div className="w-full flex">
                      <div className="w-50 mr-2">
                        <strong>PAYMENT MODE:</strong> {quotations[0]?.payment_mode}
                      </div>
                      <div className="w-50 mr-2">
                        <strong>IF FINANCE BANK:</strong> {quotations[0]?.finance_bank}
                      </div>
                    </div>
                    <div className="w-50 mr-2"><strong>DURATION:</strong> {quotations[0]?.duration}</div>
                    <div className="w-full">
                      <div className="w-50 mr-2">
                        <strong>BALANCE AMOUNT:</strong> {quotations[0]?.balance_amount}
                      </div>
                      <div className="w-50 mr-2">
                        <strong> IN WORDS:</strong> {quotations[0]?.balance_amount_words}
                      </div>
                    </div>
                    <div className="w-full flex" >
                      <div className="w-50 mr-2"><strong>PAYMENT DUE DATE 1:</strong> {new Date(quotations[0]?.payment_due_date1).toLocaleDateString()}</div>
                      <div className="w-50 mr-2"><strong>PAYMENT DUE DATE 2:</strong> {new Date(quotations[0]?.payment_due_date2).toLocaleDateString()}</div>
                    </div>
                    <div className="w-full flex">
                    <div className="w-50 mr-2"><strong>PAYMENT DUE DATE 3:</strong> {new Date(quotations[0]?.payment_due_date3).toLocaleDateString()}</div>
                    <div className="w-50 mr-2"><strong>PAYMENT DUE DATE 4:</strong> {new Date(quotations[0]?.payment_due_date4).toLocaleDateString()}</div>
                    </div>
                    <div><strong>REGISTRY CHARGES:</strong> {quotations[0]?.registry_charges}</div>
                    <div><strong>P1 P2 CHARGES:</strong> {quotations[0]?.p1p2_charges}</div>
                    <div><strong>REMARKS:</strong> {quotations[0]?.remarks}</div>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="w-full px-2 mt-4">
            <h4 className="QuoStatus my-2">Quotation Status: <strong className={` ${quotationStatus !== "Approved" ? "text-red-600" : "text-green-600"} p-2 mt-1`}>{quotations[0]?.status}</strong></h4>
            <div className="flex space-x-3 items-center">
              {/* <button
                className="bg-green-500 hover:bg-green-600 text-white rounded py-2 px-4 mt-1"
                onClick={() => navigate(`/review/${id}`)}
              >
                Review Quotation Data
              </button> */}
                <button
                className={`bg-green-700 ${quotationStatus !== "Approved" ? "opacity-50 cursor-not-allowed" : "hover:bg-green-600"} text-white rounded p-2 mt-1`}
                onClick={handlePrintPage}
                disabled={quotationStatus !== "Approved"}
              >
                Print Page
              </button>
            </div>
          </div>
        </div>
      </div>
    </Wrapper>
  );
}

export default SuperQuotationVIew;

const Wrapper = styled.div`
 @media print {
    body * {
      visibility: hidden;
    }
    .QuotationDataPage,
    .QuotationDataPage * {
      visibility: visible;
    }
    .QuotationDataPage {
      position: absolute;
      top: 0;
      left: 50%;       /* Center horizontally */
      transform: translateX(-50%); /* Adjust to be perfectly centered */
      width: 90%;       /* Adjust width as needed */
      margin: 0 auto;
      // text-align: center;
      padding: 0.5rem; /* Reduce padding */
      font-size: 0.8em;
    }

    /* Additional print rules to hide specific elements */
    button,
    .QuoStatus,
    .header,
    .footer,
    .UserInfo,
    .QuotationListBTN {
      display: none;
    }
  }

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
