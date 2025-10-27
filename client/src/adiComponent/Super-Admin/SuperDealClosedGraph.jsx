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

const SuperDealClosedGraph = () => {
  const [dealStatusData, setDealStatusData] = useState([]);
  const superadminuser = useSelector((state) => state.auth.user);
  const token = superadminuser.token;
  const userId = superadminuser.staff_id;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("default", {
      day: "2-digit",
      month: "short",
    });
  };

  const generateStaticData = (fetchedData) => {
    const data = [];
    const today = new Date();

    for (let i = 0; i < 28; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const formattedDay = formatDate(date);
      const formattedDate = date.toISOString().split("T")[0];

      const matchedLeads = fetchedData.filter(
        (item) =>
          item.unit_updated_at?.split(" ")[0] === formattedDate &&
          item.unit_status === "sold"
      );

      data.push({
        day: formattedDay,
        Close_Deal: matchedLeads.length,
      });
    }

    return data.reverse();
  };

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `https://crm-generalize.dentalguru.software/api/getLeadsByOrg/${superadminuser?.staff_org_id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = response.data;
      console.log(data);
      const formattedData = generateStaticData(data);

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
              margin={{ top: 5, right: 15, left: -40, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis
                allowDecimals={false}
                tickFormatter={(value) =>
                  Number.isInteger(value) ? value : ""
                }
              />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="Close_Deal"
                stroke="#0891b2"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );
};

export default SuperDealClosedGraph;
