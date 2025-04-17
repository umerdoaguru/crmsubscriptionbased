import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import styled from "styled-components";

const EmployeeCloseGraph = () => {
  const [dealStatusData, setDealStatusData] = useState([]);

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
      const formattedDay = formatDate(date);
      const formattedDate = date.toISOString().split("T")[0]; // Format date as "YYYY-MM-DD"

      // Filter leads that match the `d_closeDate` for this specific day
      const matchedLeads = fetchedData.filter(
        (item) =>
          item.d_closeDate.split("T")[0] === formattedDate &&
          item.deal_status?.trim().toLowerCase() !== "pending"
      );

      console.log(`Date: ${formattedDate}, Leads: ${matchedLeads.length}`);

      // Push the day and the number of closed deals for that day
      data.push({
        day: formattedDay, // Day in "DD MMM" format
        Close_Deal: matchedLeads.length, // Count the number of matched leads
      });
    }

    return data.reverse(); // Keep the data in chronological order from oldest to newest
  };

  // Fetch data from the API
  const fetchData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:9000/api/leads`
      );
      const data = response.data;

      const formattedData = generateStaticData(data);
      console.log("Formatted Data: ", formattedData);

      setDealStatusData(formattedData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
    <div className="mx-2">
      <div className="w-full max-w-4xl mx-auto p-4 border rounded-lg shadow-md bg-white">
        <h2 className="text-xl font-bold mb-2">Closed Deal Overview</h2>
        <p className="text-sm text-gray-500 mb-4">
          Deal status for the past 28 days
        </p>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={dealStatusData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis   allowDecimals={false} 
  tickFormatter={(value) => Number.isInteger(value) ? value : ''}/>
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="Close_Deal"
              stroke="#1C4E80"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      </div>
    </>
  );
};

export default EmployeeCloseGraph;


