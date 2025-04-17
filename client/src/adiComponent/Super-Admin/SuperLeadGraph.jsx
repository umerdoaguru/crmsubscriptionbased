import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import axios from "axios";
import moment from "moment";
import { useSelector } from "react-redux";

const SuperLeadGraph = () => {
  const [leadsData, setLeadsData] = useState([]);
  const [error, setError] = useState(null);
  const superadminuser = useSelector((state) => state.auth.user);
  const token = superadminuser.token;
  useEffect(() => {
    const fetchLeadsData = async () => {
      try {
        const response = await axios.get("http://localhost:9000/api/leads-super-admin",
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
          }});
        const allLeads = response.data;

        const today = moment();
        const startDate = moment().subtract(28, "days"); // 28 days range including today

        // Format dates to 'MMM DD' for display
        const formatDate = (date) => moment(date).format("MMM DD");

        // Filter the data for the last 28 days including today
        const filteredLeads = allLeads.filter((lead) => {
          const leadDate = moment(lead.createdTime, "YYYY-MM-DD HH:mm:ss"); // Parse the string
          return leadDate.isBetween(startDate, today, undefined, "[]"); // Check date range
        });

        // Group by date
        const groupedLeads = filteredLeads.reduce((acc, lead) => {
          const date = formatDate(
            moment(lead.createdTime, "YYYY-MM-DD HH:mm:ss")
          );
          if (!acc[date]) {
            acc[date] = 0;
          }
          acc[date] += 1;
          return acc;
        }, {});

        const leadsData = [];
        for (let i = 0; i <= 27; i++) {
          const date = moment().subtract(i, "days");
          const formattedDate = formatDate(date);
          leadsData.push({
            createdDate: formattedDate,
            Leads: groupedLeads[formattedDate] || 0,
          });
        }

        leadsData.reverse();
        setLeadsData(leadsData);
      } catch (error) {
        console.error("Error fetching leads data:", error);
        setError("Failed to load leads data");
      }
    };

    fetchLeadsData();
  }, []);

  return (
    <>
    <div className="mx-2">
        <div className="w-full max-w-4xl  p-4 border rounded-lg shadow-md bg-white ">
      <h2 className="text-xl font-bold mb-2">Daily Leads Overview</h2>
      {error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <>
          <p className="text-sm text-gray-500 mb-4">Leads for the past 28 days</p>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={leadsData} margin={{ top: 5, right: 30, left: 0, bottom: 25 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="createdDate"
                tick={{ fill: "gray" }}
                angle={0}
                textAnchor="middle"
              />
              <YAxis tick={{ fill: "gray" }}   allowDecimals={false} 
  tickFormatter={(value) => Number.isInteger(value) ? value : ''}/>
              <Tooltip />
              <Bar
                dataKey="Leads"
                name="Leads"
                fill="#EA6A47"
                radius={[10, 10, 0, 0]}
                barSize={15}
              />
            </BarChart>
          </ResponsiveContainer>
        </>
      )}
    </div>
    </div>
    
    </>

  );
};

export default SuperLeadGraph;
