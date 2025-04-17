import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";
import { useSelector } from "react-redux";

const Addservices = () => {
  const { id } = useParams();
  const userId = useSelector((state) => state.auth.user.id);
  const navigate = useNavigate();
  const [quotationName, setQuotationName] = useState("");
  const [serviceslist, setServiceslist] = useState([
    { service_name: "Lead Generation" },
    { service_name: "Sales Pipeline Management" },
    { service_name: "Customer Segmentation" },
    { service_name: "Email Marketing Automation" },
    { service_name: "Data Analytics and Reporting" },
    { service_name: "Campaign Management" },
    { service_name: "Customer Support Management" },
    { service_name: "Social Media Integration" },
    { service_name: "Workflow Automation" },
    { service_name: "Customer Relationship Management (CRM) Setup" },
    { service_name: "Client Onboarding Services" },
    { service_name: "Marketing Analytics" },
    { service_name: "Contact Management" },
    { service_name: "Sales Forecasting" },
    { service_name: "Customer Feedback Analysis" },
    { service_name: "Performance Tracking" },
    { service_name: "Task Management" },
    { service_name: "Integration Services (API)" },
    { service_name: "Consulting Services" },
    { service_name: "Training and Support" },
  ]);

  const [services, setServices] = useState([
    {
      service_type: "",
      service_name: "",
      service_description: "",
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
    "As Per Requirement",
    "Weekly",
    "15 Days",
    "10 Days",
    "1-5 Days",
  ]);

  const handleServiceChange = (index, field, value) => {
    const newServices = [...services];

    if (field === "service_type" && value === "Complimentary") {
      newServices[index]["offer_price"] = 0;
    }

    if (
      field === "offer_price" &&
      newServices[index].service_type === "Complimentary"
    ) {
      newServices[index][field] = 0;
    } else if (
      field === "offer_price" &&
      value > newServices[index].actual_price
    ) {
      alert("Offer price cannot be greater than actual price");
      newServices[index][field] = newServices[index].actual_price;
    } else {
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
        service_description: "",
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
          service_description: service.service_description,
          actual_price: service.actual_price,
          offer_price: service.offer_price,
          subscription_frequency: service.subscription_frequency,
        };
      });

      const response = await axios.post(
        `http://localhost:9000/api/services/${id}`,
        {
          quotation_name: quotationName,
          services: servicesToSave,
        }
      );

      console.log("Services added successfully:", response.data);

      navigate(`/final-quotation/${id}`);
    } catch (error) {
      console.error(
        "Error adding services:",
        error.response?.data || error.message
      );
    }
  };

  const getQuotationName = async () => {
    try {
      const response = await axios.get(
        `http://localhost:9000/api/quotation/${id}`
      );
      setQuotationName(response.data[0].quotation_name);
    } catch (error) {
      console.log("Error fetching quotation name:", error);
    }
  };

  const getServicelist = async () => {
    try {
      const res = await axios.get(
        `http://localhost:9000/api/servicelist/${userId}`
      );
      console.log(res.data);
      setServiceslist(res.data);
    } catch (error) {
      console.log("error", error);
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
    <Wrapper>
      <div className="container mt-5">
        <form
          className="form-control p-4 bg-white rounded shadow"
          onSubmit={handleSubmit}
        >
          <h5 className="mb-4 text-center text-lg font-bold">
            Add Services to Quotation: {quotationName}
            <Link
              to={`/final-quotation/${id}`}
              className="btn bg-green-600 text-white mx-3 mb-2 float-end hover:bg-green-700"
            >
              <i className="bi bi-arrow-return-left mx-1"></i> Back
            </Link>
          </h5>

          {services.map((service, index) => (
            <div key={index} className="mb-6">
              <div className="grid gap-4 md:grid-cols-12">
                <h6 className="col-span-12 text-lg font-semibold">
                  Service {index + 1}
                </h6>
                <div className="col-span-12">
                  <label className="block text-sm font-medium text-gray-700">
                    Service Type:
                    <select
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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
                <div className="col-span-12 md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Subscription:
                    <select
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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
                <div className="col-span-12 md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Service Name:
                    {service.service_name === "Other Service" ? (
                      <input
                        type="text"
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        value={otherServices[index]}
                        onChange={(e) =>
                          handleOtherServiceChange(index, e.target.value)
                        }
                        required
                      />
                    ) : (
                      <select
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        id={`servicename${index}`}
                        name="service_name"
                        onChange={(e) => handleChange(e, index)}
                        value={service.service_name}
                        required
                      >
                        <option value="" disabled>
                          Select Service Name
                        </option>
                        {serviceslist?.map((item, key) => (
                          <option key={key} value={item.service_name}>
                            {item.service_name}
                          </option>
                        ))}
                        <option value="Other Service">Other Service</option>
                      </select>
                    )}
                  </label>
                </div>
                <div className="col-span-12 md:col-span-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Service Description:
                    <textarea
                      required
                      rows="3"
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      value={service.service_description}
                      onChange={(e) =>
                        handleServiceChange(
                          index,
                          "service_description",
                          e.target.value
                        )
                      }
                    ></textarea>
                  </label>
                </div>
                <div className="col-span-12 md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Actual Price:
                    <input
                      type="number"
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      value={service.actual_price}
                      onChange={(e) =>
                        handleServiceChange(
                          index,
                          "actual_price",
                          e.target.value
                        )
                      }
                      required
                    />
                  </label>
                </div>
                <div className="col-span-12 md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Offer Price:
                    <input
                      type="number"
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      value={service.offer_price}
                      onChange={(e) =>
                        handleServiceChange(
                          index,
                          "offer_price",
                          e.target.value
                        )
                      }
                      required
                    />
                  </label>
                </div>
              </div>
              <button
                type="button"
                className="btn bg-red-600 text-white mt-2 hover:bg-red-700"
                onClick={() => removeService(index)}
              >
                Remove Service
              </button>
            </div>
          ))}

          <button
            type="button"
            className="btn bg-green-600 text-white mt-2 mb-2 hover:bg-green-700"
            onClick={addService}
          >
            Add Service
          </button>

          <button
            type="submit"
            className="btn bg-green-600 text-white mx-3 mt-2 mb-2 hover:bg-green-700"
          >
            Submit
          </button>
        </form>
      </div>
    </Wrapper>
  );
};

export default Addservices;

const Wrapper = styled.div``;
