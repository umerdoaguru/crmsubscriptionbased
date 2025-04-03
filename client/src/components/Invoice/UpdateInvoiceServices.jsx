import React, { useState, useEffect } from "react";
import axios from "axios";
const UpdateInvoiceServices = ({
  invoiceId,
  onUpdateSuccess,
  onUpdateError,
}) => {
  const [services, setServices] = useState([]);

  const fetchServices = async () => {
    try {
      const response = await axios.get(
        `https://crmdemo.vimubds5.a2hosted.com/api/invoice/${invoiceId}`
      );
      setServices(response.data);
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `https://crmdemo.vimubds5.a2hosted.com/api/invoice/${invoiceId}`,
        {
          services,
        }
      );

      if (response.data.success) {
        console.log("Services updated successfully");
        onUpdateSuccess();
      }
    } catch (error) {
      console.error("Error updating services:", error);
      onUpdateError();
    }
  };

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

  useEffect(() => {
    fetchServices();
  }, [invoiceId]);

  const handleUpdateClose = () => {
    onUpdateSuccess();
  };

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white p-6 border border-gray-300 rounded">
        {/* Form components for updating services */}
        {services.map((service, index) => (
          <div key={index} className="mb-6">
            <div className="flex flex-wrap items-center gap-4">
              <h6 className="font-semibold">Service {index + 1}</h6>

              <div className="w-full md:w-1/5">
                <label className="block text-sm font-medium text-gray-700">
                  Service Type:
                  <input
                    className="mt-1 block w-full p-2 border border-gray-300 rounded focus:ring focus:ring-green-200 focus:border-green-500"
                    type="text"
                    value={service.service_type}
                    onChange={(e) =>
                      handleServiceChange(index, "service_type", e.target.value)
                    }
                  />
                </label>
              </div>

              <div className="w-full md:w-1/5">
                <label className="block text-sm font-medium text-gray-700">
                  Subscription:
                  <input
                    className="mt-1 block w-full p-2 border border-gray-300 rounded focus:ring focus:ring-green-200 focus:border-green-500"
                    type="text"
                    value={service.subscription_frequency}
                    onChange={(e) =>
                      handleServiceChange(
                        index,
                        "subscription_frequency",
                        e.target.value
                      )
                    }
                  />
                </label>
              </div>

              <div className="w-full md:w-1/5">
                <label className="block text-sm font-medium text-gray-700">
                  Service Name:
                  <input
                    className="mt-1 block w-full p-2 border border-gray-300 rounded focus:ring focus:ring-green-200 focus:border-green-500"
                    type="text"
                    value={service.service_name}
                    onChange={(e) =>
                      handleServiceChange(index, "service_name", e.target.value)
                    }
                  />
                </label>
              </div>

              <div className="w-full md:w-1/5">
                <label className="block text-sm font-medium text-gray-700">
                  Actual Price:
                  <input
                    className="mt-1 block w-full p-2 border border-gray-300 rounded focus:ring focus:ring-green-200 focus:border-green-500"
                    type="number"
                    value={service.actual_price}
                    onChange={(e) =>
                      handleServiceChange(
                        index,
                        "actual_price",
                        parseFloat(e.target.value)
                      )
                    }
                  />
                </label>
              </div>

              <div className="w-full md:w-1/5">
                <label className="block text-sm font-medium text-gray-700">
                  Offer Price:
                  <input
                    className="mt-1 block w-full p-2 border border-gray-300 rounded focus:ring focus:ring-green-200 focus:border-green-500"
                    type="number"
                    value={service.offer_price}
                    onChange={(e) =>
                      handleServiceChange(
                        index,
                        "offer_price",
                        parseFloat(e.target.value)
                      )
                    }
                  />
                </label>
              </div>
            </div>
          </div>
        ))}

        <div className="flex justify-start gap-4">
          <button
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            onClick={handleUpdate}
          >
            Update Services
          </button>
          <button
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            onClick={handleUpdateClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateInvoiceServices;
