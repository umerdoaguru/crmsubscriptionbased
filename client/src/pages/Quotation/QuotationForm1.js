import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Redirect } from "react-router-dom";
import { useSelector } from "react-redux";
import UserLogin from "../../components/UserLogin";
import Logout from "../../components/Logout";

const QuotationForm1 = () => {
  const EmpId = useSelector((state) => state.auth.user.id);
  const EmpName = useSelector((state) => state.auth.user.name);
  const navigate = useNavigate();
  const [quotationName, setQuotationName] = useState("");
  const [serviceslist, setServiceslist] = useState([]);
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

  // const handleServiceChange = (index, field, value) => {
  //   const newServices = [...services];
  //   newServices[index][field] = value;
  //   setServices(newServices);
  // };
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
          service_description: service.service_description,
          actual_price: service.actual_price,
          offer_price: service.offer_price,
          subscription_frequency: service.subscription_frequency,
        };
      });
      const response = await axios.post("http://localhost:9000/api/quotation", {
        quotation_name: quotationName,
        services: servicesToSave,
        // employeeId: userId,
        employeeId: EmpId,
        employee_name: EmpName,
      });

      console.log("Quotation added successfully:", response.data);

      navigate(`/final-quotation/${response.data.quotation.id}`);
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
      console.log(res.data);
      setServiceslist(res.data);
    } catch (error) {
      console.log("error", error);
    }
  };

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

  return (
    <div className="p-4">
      {/* <Link
          to={`/quotation-section`}
          className="bg-green-500 text-white px-4 py-2 rounded mt-3 mx-2 inline-block"
        >
          <i className="bi bi-arrow-return-left"></i> Back
        </Link> */}
      <div className="mt-5">
        <div className=" gap-4">
          <form
            className="bg-white p-6 rounded shadow-md"
            onSubmit={handleSubmit}
          >
            <div className="grid lg:grid-cols-12  gap-4 p-2">
              <div className="lg:col-span-2 ">
                <UserLogin />
              </div>

              <div className="lg:col-span-7 lg:text-center  ">
                <h5 className="mb-4">Quotation Generation System</h5>
              </div>

              {/* <div className="lg:col-span-2">
                  <Link
                    to="/quotationlist"
                    className="bg-green-500 text-white px-4 py-2 rounded block text-center"
                  >
                    Quotation List
                  </Link>
                </div> */}
              {/* <div className="lg:col-span-1">
                  <Logout />
                </div> */}
            </div>

            <div className="mb-3">
              <input
                type="text"
                className="w-full p-2 border rounded text-center"
                id="quotationName"
                name="quotation_name"
                placeholder="Quotation Name"
                value={quotationName}
                onChange={(e) => setQuotationName(e.target.value)}
                required
              />
            </div>

            {services.map((service, index) => (
              <div key={index} className="mb-6">
                <div className="grid gap-4 lg:grid-cols-12">
                  <h6 className="">Service {index + 1}</h6>

                  <div className="lg:col-span-12">
                    <label className="block">
                      Service Type:
                      <br />
                      <select
                        className=" p-2 mt-1 border rounded"
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

                  <div className="lg:col-span-2">
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

                  <div className="lg:col-span-2">
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

                  <div className="lg:col-span-4">
                    <label className="block">
                      <div className="flex">
                        <span>Service Description</span>
                        <span className="ml-2 text-sm text-gray-500">
                          (if you want to next line add .(dot) and nextline)
                        </span>
                      </div>
                      <textarea
                        required
                        rows="3"
                        className="w-full p-2 mt-1 border rounded"
                        value={service.service_description}
                        onChange={(e) =>
                          handleServiceChange(
                            index,
                            "service_description",
                            e.target.value
                          )
                        }
                      />
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

                  <div className="">
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
                className="bg-green-500 text-white px-4 py-2 rounded"
                onClick={addService}
              >
                Add Service
              </button>

              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const Wrapper = styled.div`
  /* Add your styles here */
`;

export default QuotationForm1;
