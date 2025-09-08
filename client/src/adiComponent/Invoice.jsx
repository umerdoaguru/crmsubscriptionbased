import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import moment from "moment";
import { useSelector } from "react-redux";

const LeadVisitChart = () => {
  const [loading, setLoading] = useState(false);
  const [visitData, setVisitData] = useState([]);
  const [error, setError] = useState(null);
  const adminuser = useSelector((state) => state.auth.user);
  const token = adminuser.token;
  const userId = adminuser.user_id;

  useEffect(() => {
    const fetchLeadsData = async () => {
      setLoading(true); // Start loading

      try {
        const response = await axios.get(
          `https://crm-generalize.dentalguru.software/api/leads-data-user-id/${userId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const allLeads = response.data.filter((lead) =>
          ["fresh", "re-visit", "self", "associative"].includes(lead.visit)
        );

        const today = moment();
        const startDate = moment().subtract(28, "days");

        const formatDate = (date) => moment(date).format("MMM DD");

        const filteredLeads = allLeads.filter((lead) => {
          const leadDate = moment(lead.visit_date, "YYYY-MM-DD HH:mm:ss");
          return leadDate.isBetween(startDate, today, undefined, "[]");
        });

        // Group by date
        const groupedLeads = filteredLeads.reduce((acc, lead) => {
          const date = formatDate(
            moment(lead.visit_date, "YYYY-MM-DD HH:mm:ss")
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
        setVisitData(leadsData);
      } catch (error) {
        console.error("Error fetching leads data:", error);
        setError("Failed to load leads data");
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchLeadsData();
  }, []);

  return (
    <>
      <div className="mx-2">
        <div className="w-full max-w-4xl mx-auto p-4 border rounded-lg shadow-md bg-white ">
          <h2 className="text-xl font-bold mb-2">Daily Visit Overview</h2>
          <p className="text-sm text-gray-500 mb-4">
            {" "}
            Leads for the past 28 days
          </p>
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p> // Display error message
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                width={400}
                height={300}
                data={visitData}
                margin={{
                  top: 5,
                  right: 15,
                  left: -40,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="createdDate" // Use correct data key 'createdDate'
                  tick={{
                    fontSize: 12,
                    transform: "translate(-10,0)",
                    dy: 5,
                    fill: "#666",
                  }}
                />
                <YAxis
                  allowDecimals={false}
                  tickFormatter={(value) =>
                    Number.isInteger(value) ? value : ""
                  }
                />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="Leads" // Corrected to 'Leads' from 'totalVisits'
                  fill="#0891b2"
                  name="Total Visit"
                  barSize={15}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </>
  );
};

export default LeadVisitChart;
