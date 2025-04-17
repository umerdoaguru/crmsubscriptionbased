import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";
import Sider from "../Sider";
import MainHeader from "../MainHeader";

const AddInvoiceServices = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [invoiceName, setInvoiceName] = useState("");
  const [serviceslist, setServiceslist] = useState([]);
  const [otherServices, setOtherServices] = useState([""]);
  const [services, setServices] = useState([
    {
      service_type: "",
      service_name: "",
      actual_price: null,
      offer_price: null,
      subscription_frequency: "",
    },
  ]);
  const [subscriptionFrequencies, setSubscriptionFrequencies] = useState([
    "Yearly",
    "Monthly",
    "Quarterly",
    "One Time",
    "Weekly",
  ]);

  const handleServiceChange = (index, field, value) => {
    const newServices = [...services];
    // newServices[index][field] = value;

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

  const handleOtherServiceChange = (index, value) => {
    const newOtherServices = [...otherServices];
    newOtherServices[index] = value;
    setOtherServices(newOtherServices);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const servicesToSave = services.map((service, index) => {
        return {
          service_name:
            service.service_name === "Other Service"
              ? otherServices[index]
              : service.service_name,
          service_type: service.service_type,

          actual_price: service.actual_price,
          offer_price: service.offer_price,
          subscription_frequency: service.subscription_frequency,
        };
      });

      const response = await axios.post(
        `http://localhost:9000/api/add-invoice-services/${id}`,
        {
          invoice_name: invoiceName,
          services: servicesToSave,
        }
      );

      console.log("Invoice Services added successfully:", response.data);

      navigate(`/final-invoice/${id}`);
    } catch (error) {
      console.error(
        "Error adding invoice service:",
        error.response?.data || error.message
      );
    }
  };

  const getQuotationName = async () => {
    try {
      const response = await axios.get(
        `http://localhost:9000/api/invoice-name/${id}`
      );
      setInvoiceName(response.data[0].invoice_name);
    } catch (error) {
      console.log("Error fetching quotation name:", error);
    }
  };

  const getServicelist = async () => {
    try {
      const res = await axios.get(`http://localhost:9000/api/services`);
      setServiceslist(res.data.services);
    } catch (error) {
      console.log("Error fetching services list:", error);
    }
  };

  useEffect(() => {
    getQuotationName();
    getServicelist();
  }, [id]);

  const handleChange = (e, index) => {
    const newServices = [...services];
    newServices[index]["service_name"] = e.target.value;
    setServices(newServices);
  };

  return (
    <>
      <MainHeader />
      <Sider />
      <Wrapper>
        <div className="container mt-5 px-2 mx-auto p-4">
          <Link
            to={`/final-invoice/${id}`}
            className="btn bg-green-500 text-white mx-3 mt-4 mb-2"
          >
            <i className="bi bi-arrow-return-left mx-1"></i> Back
          </Link>
          <div className="container mt-3">
            <div className="row">
              <form
                className="form-control p-4 border border-gray-300 rounded"
                onSubmit={handleSubmit}
              >
                <h5 className="mb-4 text-center font-semibold">
                  Add Services to Quotation: {invoiceName}
                </h5>

                {services.map((service, index) => (
                  <div key={index}>
                    <div className="row gap-2">
                      <h6 className="font-semibold">Service {index + 1}</h6>

                      <div className="col-lg-2">
                        <label className="form-check-label">
                          Service Type:
                          <select
                            className="form-select mt-1 block w-full p-2 border border-gray-300 rounded"
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

                      <div className="col-lg-2">
                        <label className="form-check-label">
                          Subscription:
                          <select
                            className="form-select mt-1 block w-full p-2 border border-gray-300 rounded"
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

                      <div className="col-lg-2">
                        <label className="form-check-label">
                          Service Name:
                          {service.service_name === "Other Service" ? (
                            <input
                              type="text"
                              className="form-control mt-1 block w-full p-2 border border-gray-300 rounded"
                              value={otherServices[index]}
                              onChange={(e) =>
                                handleOtherServiceChange(index, e.target.value)
                              }
                              required
                            />
                          ) : (
                            <select
                              className="form-select mt-1 block w-full p-2 border border-gray-300 rounded"
                              id={`servicename${index}`}
                              name="service_name"
                              onChange={(e) => handleChange(e, index)}
                              value={service.service_name}
                              required
                            >
                              <option value="" disabled>
                                Select Service Name
                              </option>
                              {serviceslist.map((item, key) => (
                                <option key={key} value={item.service_name}>
                                  {item.service_name}
                                </option>
                              ))}
                              <option value="Other Service">
                                Other Service
                              </option>
                            </select>
                          )}
                        </label>
                      </div>

                      <div className="col-lg-2">
                        <label className="form-check-label">
                          Actual Price:
                          <input
                            type="number"
                            className="form-control mt-1 block w-full p-2 border border-gray-300 rounded"
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

                      <div className="col-lg-2">
                        <label className="form-check-label">
                          Offer Price:
                          <input
                            type="number"
                            className="form-control mt-1 block w-full p-2 border border-gray-300 rounded"
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

                      <div className="col-lg-1 mt-3 mx-lg-4 mx-sm-1 p-1">
                        <button
                          type="button"
                          className="btn bg-red-500 text-white"
                          onClick={() => removeService(index)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  className="btn bg-green-500 text-white mt-2 mb-2"
                  onClick={addService}
                >
                  Add Service
                </button>

                <button
                  type="submit"
                  className="btn bg-green-500 text-white mx-3 mt-2 mb-2"
                >
                  Submit
                </button>
              </form>
            </div>
          </div>
        </div>
      </Wrapper>
    </>
  );
};

export default AddInvoiceServices;

const Wrapper = styled.div`
  .resp {
    width: 100%;
    @media screen and (max-width: 768px) {
      width: 100%;
    }
  }
`;
