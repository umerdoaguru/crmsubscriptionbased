import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";

import { Redirect } from "react-router-dom";

import { useSelector } from "react-redux";
import UserLogin from "../UserLogin";
import Logout from "../Logout";

const CreateInvoice = () => {
  const EmpId = useSelector((state) => state.auth.user.id);
  const navigate = useNavigate();
  const [invoiceName, setInvoiceName] = useState("");
  const [invoiceAddress, setInvoiceAddress] = useState("");
  const [invoiceAdvancePayment, setInvoiceAdvancePayment] = useState("");
  const [invoiceClient_GST_no, setInvoiceClient_GST_no] = useState("");
  const [invoiceClient_GST_per, setInvoiceClient_GST_per] = useState(0);
  const [invoiceClient_Pan_no, setInvoiceClient_Pan_no] = useState("");
  const [companyGST_no, setCompanyGST_no] = useState("");
  const [companyPan_no, setCompanyPan_no] = useState("");
  const [invoice_no, setInvoice_no] = useState("");
  const [invoiceDate, setInvoiceDate] = useState("");
  const [invoice_Start_Date, setInvoice_Start_Date] = useState("");
  const [invoice_End_Date, setInvoice_End_Date] = useState("");
  const [serviceslist, setServiceslist] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [company_data, setCompany_data] = useState([]);

  const [services, setServices] = useState([
    {
      service_type: "",
      service_name: "",
      actual_price: null,
      offer_price: null,
      subscription_frequency: "",
    },
  ]);
  const [otherServices, setOtherServices] = useState(
    Array(services.length).fill("")
  );
  const [subscriptionFrequencies, setSubscriptionFrequencies] = useState([
    "Yearly",
    "Monthly",
    "Quarterly",
    "Half Yearly",
    "One Time",
    "Weekly",
    "1-5 Day",
  ]);

  const [paymentmode, setpaymentmode] = useState([]);

  const userName = useSelector((state) => state.auth.user.id);

  const handleServiceChange = (index, field, value) => {
    const newServices = [...services];

    if (field === "service_type" && value === "Complimentary") {
      // If the service type is 'Complimentary', disable the offer price and set it to 0
      newServices[index]["offer_price"] = 0;
    }

    if (
      field === "offer_price" &&
      newServices[index].service_type === "Complimentary"
    ) {
      // If the service type is 'Complimentary', set offer price to 0 and disable the input
      newServices[index][field] = 0;
    } else if (
      field === "offer_price" &&
      value > newServices[index].actual_price
    ) {
      // If offer price is greater than actual price, set it to actual price and alert
      alert("Offer price cannot be greater than actual price");
      newServices[index][field] = newServices[index].actual_price;
    } else {
      // Otherwise, update the field normally
      newServices[index][field] = value;
    }

    setServices(newServices);
  };

  const addService = () => {
    setServices([
      ...services,
      {
        service_type: "",
        service_name: "",

        actual_price: null,
        offer_price: null,
        subscription_frequency: "",
      },
    ]);
  };

  const removeService = (index) => {
    const newServices = [...services];
    newServices.splice(index, 1);
    setServices(newServices);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const servicesToSave = services.map((service) => {
        return {
          service_name:
            service.service_name === "Other Service"
              ? otherServices[services.indexOf(service)]
              : service.service_name,
          service_type: service.service_type,
          actual_price: service.actual_price,
          offer_price: service.offer_price,
          subscription_frequency: service.subscription_frequency,
        };
      });

      const response = await axios.post(
        "http://localhost:9000/api/create-invoice",
        {
          invoice_name: invoiceName,
          invoice_no: invoice_no,
          invoice_address: invoiceAddress,
          payment_mode: paymentmode,
          client_gst_no: invoiceClient_GST_no,
          client_gst_per: invoiceClient_GST_per,
          client_pan_no: invoiceClient_Pan_no,
          services: servicesToSave,
          employeeId: EmpId,
          company_type: selectedCompany,
          invoice_date: invoiceDate,
          duration_start_date: invoice_Start_Date,
          duration_end_date: invoice_End_Date,
        }
      );

      navigate(`/final-invoice/${response.data.invoice.id}`);
    } catch (error) {
      console.error(
        "Error adding quotation:",
        error.response?.data || error.message
      );
    }
  };

  const getServicelist = async () => {
    try {
      const res = await axios.get(`http://localhost:9000/api/servicelist`);

      setServiceslist(res.data);
    } catch (error) {}
  };

  useEffect(() => {
    const fetchinvoice = async () => {
      try {
        const response = await axios.get(
          `http://localhost:9000/api/company-data`
        );
        setCompany_data(response.data);

        console.log(response);
      } catch (error) {
        console.error("Error fetching Company_data:", error);
      }
    };

    fetchinvoice();
  }, []);

  useEffect(() => {
    // Fetch existing data from the API
    const fetchCompanyData = async () => {
      try {
        const response = await axios.post(
          "http://localhost:9000/api/company-header-footer",
          {
            company_name: selectedCompany,
          }
        );

        if (response.status === 200) {
          const companyData = response.data;

          // Set input field values with the fetched dat
          setCompanyGST_no(companyData.gst_no);
          setCompanyPan_no(companyData.pan_no);
        } else {
          console.error("Error Company Data:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching company data:", error);
      }
    };

    fetchCompanyData();
  }, [selectedCompany]);

  console.log(companyGST_no, companyPan_no);

  useEffect(() => {
    getServicelist();
  }, []);

  const handleChange = (e, index) => {
    const newServices = [...services];
    newServices[index]["service_name"] = e.target.value;
    setServices(newServices);
  };

  const handleOtherServiceChange = (index, value) => {
    const newOtherServices = [...otherServices];
    newOtherServices[index] = value;
    setOtherServices(newOtherServices);
  };

  const handleCreateServices = () => {
    navigate(``);
  };
  const handleChangeCompany = (e) => {
    setSelectedCompany(e.target.value);
  };

  return (
    <Wrapper>
      <div className="container mx-auto mt-5">
        <div className="grid grid-cols-1">
          <form
            className="bg-white p-6 rounded shadow-2xl"
            onSubmit={handleSubmit}
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-4">
              <div className="lg:col-span-12 text-center lg:text-left">
                <h5 className="text-xl font-semibold mb-4">
                  Invoice Generation System :
                </h5>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              <div className="lg:col-span-3 mb-3">
                <label className="block font-semibold">
                  Select Enter Company Name:
                  <select
                    className="w-full mt-2 p-2 border rounded-lg"
                    id="companyList"
                    name="company_list"
                    onChange={handleChangeCompany}
                    value={selectedCompany}
                    required
                  >
                    <option value="" disabled>
                      Select Company
                    </option>
                    {company_data.map((item, key) => (
                      <option key={key} value={item.company_name}>
                        {item.company_name}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="lg:col-span-3 mb-3">
                <label className="block font-semibold">
                  GST %:
                  <select
                    className="w-full mt-2 p-2 border rounded-lg"
                    id="serviceType"
                    name="service_type"
                    value={invoiceClient_GST_per}
                    onChange={(e) => setInvoiceClient_GST_per(e.target.value)}
                    required
                  >
                    <option value="" disabled>
                      Select GST Type
                    </option>
                    <option value="5">5%</option>
                    <option value="12">12%</option>
                    <option value="18">18%</option>
                    <option value="28">28%</option>
                    <option value="0">No GST</option>
                  </select>
                </label>
              </div>

              <div className="lg:col-span-6"></div>

              <div className="lg:col-span-3 mb-3">
                <input
                  type="text"
                  className="w-full mt-2 p-2 border rounded-lg text-center"
                  id="invoiceName"
                  name="invoice_name"
                  placeholder="Invoice Name"
                  value={invoiceName}
                  onChange={(e) => setInvoiceName(e.target.value)}
                  required
                />
              </div>

              <div className="lg:col-span-3 mb-3">
                <input
                  type="number"
                  className="w-full mt-2 p-2 border rounded-lg text-center"
                  id="invoice_no"
                  name="invoice_no"
                  placeholder="Invoice Number"
                  value={invoice_no}
                  onChange={(e) => setInvoice_no(e.target.value)}
                  required
                />
              </div>

              <div className="lg:col-span-3 mb-3">
                <select
                  className="w-full mt-2 p-2 border rounded-lg"
                  id="paymentMode"
                  name="payment_mode"
                  onChange={(e) => setpaymentmode(e.target.value)}
                  value={paymentmode}
                  required
                >
                  <option value="" disabled>
                    Payment Mode
                  </option>
                  <option value="Payment Cheque">Payment Cheque</option>
                  <option value="Net Banking">Net Banking</option>
                  <option value="UPI">UPI</option>
                  <option value="Cash">Cash</option>
                </select>
              </div>

              {companyPan_no && (
                <div className="lg:col-span-3 mb-3">
                  <input
                    type="text"
                    className="w-full mt-2 p-2 border rounded-lg text-center"
                    id="panCardNumber"
                    name="pan_card_number"
                    placeholder="Enter PAN Card Number (Optional)"
                    value={invoiceClient_Pan_no}
                    onChange={(e) => setInvoiceClient_Pan_no(e.target.value)}
                    maxLength={10}
                  />
                </div>
              )}

              {companyGST_no && (
                <div className="lg:col-span-3 mb-3">
                  <input
                    type="text"
                    className="w-full mt-2 p-2 border rounded-lg text-center"
                    id="gstNumber"
                    name="gst_number"
                    placeholder="Enter GST Number"
                    value={invoiceClient_GST_no}
                    onChange={(e) => setInvoiceClient_GST_no(e.target.value)}
                    maxLength={15}
                    required
                  />
                </div>
              )}

              <div className="lg:col-span-3 mb-3">
                <textarea
                  className="w-full mt-2 p-2 border rounded-lg text-center"
                  id="invoiceName"
                  name="invoice_address"
                  placeholder="Invoice Address"
                  value={invoiceAddress}
                  onChange={(e) => setInvoiceAddress(e.target.value)}
                  required
                />
              </div>

              <div className="lg:col-span-3 mb-3">
                <label className="block font-semibold">
                  Invoice Date:
                  <input
                    type="date"
                    className="w-full mt-2 p-2 border rounded-lg text-center"
                    id="invoiceDate"
                    name="invoiceDate"
                    placeholder="Invoice date"
                    value={invoiceDate}
                    onChange={(e) => setInvoiceDate(e.target.value)}
                    required
                  />
                </label>
              </div>

              {/* <div className="lg:col-span-3 mb-3">
              <label className="block font-semibold">
                Invoice Duration Start Date:
                <input
                  type="date"
                  className="w-full mt-2 p-2 border rounded-lg text-center"
                  id="invoice_Start_Date"
                  name="invoice_Start_Date"
                  placeholder="Invoice_Start_Date"
                  value={invoice_Start_Date}
                  onChange={(e) => setInvoice_Start_Date(e.target.value)}
                  required
                />
              </label>
            </div>
  
            <div className="lg:col-span-3 mb-3">
              <label className="block font-semibold">
                Invoice Duration End Date:
                <input
                  type="date"
                  className="w-full mt-2 p-2 border rounded-lg text-center"
                  id="invoice_End_Date"
                  name="invoice_End_Date"
                  placeholder="Invoice_End_Date"
                  value={invoice_End_Date}
                  onChange={(e) => setInvoice_End_Date(e.target.value)}
                  required
                />
              </label>
            </div> */}
            </div>
            {services.map((service, index) => (
              <div key={index} className="mb-6">
                <div className="grid gap-4 lg:grid-cols-12">
                  <h6 className="col-span-12">Service {index + 1}</h6>

                  <div className="lg:col-span-2">
                    <label className="block">
                      Service Type:
                      <select
                        className="w-full p-2 mt-1 border rounded"
                        id={`serviceType${index}`}
                        name="service_type"
                        onChange={(e) =>
                          handleServiceChange(
                            index,
                            "service_type",
                            e.target.value
                          )
                        }
                        value={service.service_type}
                        required
                      >
                        <option value="" disabled>
                          Select Service Type
                        </option>
                        <option value="Paid">Paid Service</option>
                        <option value="Complimentary">
                          Complimentary Service
                        </option>
                      </select>
                    </label>
                  </div>

                  <div className="lg:col-span-3">
                    <label className="block">
                      Subscription:
                      <select
                        className="w-full p-2 mt-1 border rounded"
                        id={`subscriptionFrequency${index}`}
                        name="subscription_frequency"
                        onChange={(e) =>
                          handleServiceChange(
                            index,
                            "subscription_frequency",
                            e.target.value
                          )
                        }
                        value={service.subscription_frequency}
                        required
                      >
                        <option value="" disabled>
                          Select Subscription Frequency
                        </option>
                        {subscriptionFrequencies.map((frequency, key) => (
                          <option key={key} value={frequency}>
                            {frequency}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>

                  <div className="lg:col-span-3">
                    <label className="block">
                      Service Name:
                      {service.service_name === "Other Service" ? (
                        <input
                          type="text"
                          className="w-full p-2 mt-1 border rounded"
                          value={otherServices[index]}
                          onChange={(e) =>
                            handleOtherServiceChange(index, e.target.value)
                          }
                          required
                        />
                      ) : (
                        <select
                          className="w-full p-2 mt-1 border rounded"
                          id={`servicename${index}`}
                          name="service_name"
                          onChange={(e) => handleChange(e, index)}
                          value={service.service_name}
                          required
                        >
                          <option value="" disabled>
                            Select Service name
                          </option>
                          {serviceslist.map((item, key) => (
                            <option key={key} value={item.service_name}>
                              {item.service_name}
                            </option>
                          ))}
                          <option value="Other Service">Other Service</option>
                        </select>
                      )}
                    </label>
                  </div>

                  <div className="lg:col-span-2">
                    <label className="block">
                      Actual Price:
                      <input
                        type="number"
                        className="w-full p-2 mt-1 border rounded"
                        value={service.actual_price}
                        onChange={(e) =>
                          handleServiceChange(
                            index,
                            "actual_price",
                            parseFloat(e.target.value)
                          )
                        }
                        required
                      />
                    </label>
                  </div>

                  <div className="lg:col-span-2">
                    <label className="block">
                      Offer Price:
                      <input
                        type="number"
                        className="w-full p-2 mt-1 border rounded"
                        value={service.offer_price}
                        onChange={(e) =>
                          handleServiceChange(
                            index,
                            "offer_price",
                            parseFloat(e.target.value)
                          )
                        }
                        required
                      />
                    </label>
                  </div>

                  <div className="lg:col-span-12 text-right">
                    <button
                      type="button"
                      className="bg-red-500 text-white px-4 py-2 rounded"
                      onClick={() => removeService(index)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}

            <div className="flex space-x-3">
              <button
                type="button"
                onClick={addService}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
              >
                Add Service
              </button>

              <button
                type="submit"
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  /* Add your styles here */
`;

export default CreateInvoice;
