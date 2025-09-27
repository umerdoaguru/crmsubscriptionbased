import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";
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
import { useSelector } from "react-redux";

const SuperLeadAllVisitChart = () => {
  const [loading, setLoading] = useState(false);
  const [visitData, setVisitData] = useState([]);
  const [error, setError] = useState(null);
  const superadminuser = useSelector((state) => state.auth.user);
  const token = superadminuser.token;

  const fetchLeadsData = async () => {
    setLoading(true);

    try {
      const { data } = await axios.get(
        `https://crm-generalize.dentalguru.software/api/leads-all-visits`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setVisitData(data);
    } catch (error) {
      console.error("Error fetching leads data:", error);
      setError("Failed to load leads data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeadsData();
  }, []);

  console.log(visitData);

  const chartData = useMemo(() => {
    const grouped = visitData?.reduce((acc, visit) => {
      const date = visit.visit_date;
      if (!date) return acc;

      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(grouped).map(([date, count]) => ({
      createdDate: date,
      Leads: count,
    }));
  }, [visitData]);

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
                data={chartData}
                margin={{
                  top: 5,
                  right: 15,
                  left: -40,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="createdDate"
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
                  dataKey="Leads"
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

export default SuperLeadAllVisitChart;
