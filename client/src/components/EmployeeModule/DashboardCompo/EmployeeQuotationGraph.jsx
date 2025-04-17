import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import axios from "axios";
import { useSelector } from "react-redux";

const EmployeeQuotationGraph = () => {
  const [quotationData, setQuotationData] = useState([]);
  const EmpId = useSelector((state) => state.auth.user.id);
  // Function to format the date to "DD MMM" format
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("default", {
      day: "2-digit",
      month: "short",
    });
  };

  // Generate static structure for the past 28 days
  const generateStaticData = (fetchedData) => {
    const data = [];
    const today = new Date();

    // Iterate over the past 28 days
    for (let i = 0; i < 28; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const formattedDay = date.toLocaleDateString("default", {
        day: "2-digit",
        month: "short",
      });
      const formattedDate = date.toISOString().split("T")[0]; // Format date as "YYYY-MM-DD"

      // Filter quotations that match the `created_date` for this specific day
      const matchedQuotations = fetchedData.filter(
        (item) => item.created_date.split("T")[0] === formattedDate
      );

      console.log(
        `Date: ${formattedDate}, Quotations: ${matchedQuotations.length}`
      );

      // Push the day and the number of quotations created on that day
      data.push({
        day: formattedDay, // Day in "DD MMM" format
        Quotation: matchedQuotations.length, // Count the number of matched quotations
      });
    }

    return data.reverse(); // Keep the data in chronological order from oldest to newest
  };

  // Fetch data from the API
  const fetchData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:9000/api/get-quotation-byEmploye/${EmpId}`
      ); // Adjust the API route as necessary
      const data = response.data;

      const formattedData = generateStaticData(data);
      console.log(formattedData);

      setQuotationData(formattedData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto p-4 border rounded-lg shadow-md bg-white">
      <h2 className="text-xl font-bold mb-2">Daily Quotation Overview</h2>
      <p className="text-sm text-gray-500 mb-4">
        Quotation for the past 28 days
      </p>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={quotationData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" />
          <YAxis   allowDecimals={false} 
  tickFormatter={(value) => Number.isInteger(value) ? value : ''} />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="Quotation"
            stroke="#1C4E80"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default EmployeeQuotationGraph;
