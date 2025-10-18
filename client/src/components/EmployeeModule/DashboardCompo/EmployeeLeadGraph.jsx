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
import axios from "axios";
import moment from "moment";
import { useSelector } from "react-redux";

const EmployeeLeadsGraph = () => {
  const [chartData, setChartData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const superadminuser = useSelector((state) => state.auth.user);
  const token = superadminuser?.token;
  const orgId = superadminuser?.staff_org_id;

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);

        // ✅ Fetch only Leads and MetaLeads
        const [leadsRes, metaLeadsRes] = await Promise.all([
          axios.get(
            `https://crm-generalize.dentalguru.software/api/employe-leads/${superadminuser?.staff_id}`,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          ),
          axios.get(
            `https://crm-generalize.dentalguru.software/api/getMetaLeadsByStaffId/${superadminuser.staff_id}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          ),
        ]);

        const allLeads = leadsRes.data || [];
        const allMetaLeads = metaLeadsRes.data || [];
        console.log(allMetaLeads);

        const today = moment();
        const startDate = moment().subtract(28, "days");
        const formatDate = (date) => moment(date).format("MMM DD");

        // ✅ Helper: group data by date (custom date key)
        const groupByDate = (data, dateKey) =>
          data.reduce((acc, item) => {
            const dateValue = item[dateKey];
            if (!dateValue) return acc;

            const parsedDate = moment(dateValue, [
              "YYYY-MM-DD HH:mm:ss",
              "YYYY-MM-DD",
            ]);
            if (!parsedDate.isValid()) return acc;

            const formatted = formatDate(parsedDate);
            if (parsedDate.isBetween(startDate, today, undefined, "[]")) {
              acc[formatted] = (acc[formatted] || 0) + 1;
            }

            return acc;
          }, {});

        // ✅ Use correct date keys for each dataset
        const leadsGrouped = groupByDate(allLeads, "createdTime");
        const metaLeadsGrouped = groupByDate(allMetaLeads, "generated_time");

        // ✅ Prepare chart data for last 28 days
        const finalData = [];
        for (let i = 0; i <= 27; i++) {
          const date = moment().subtract(i, "days");
          const formattedDate = formatDate(date);
          finalData.push({
            createdDate: formattedDate,
            Leads: leadsGrouped[formattedDate] || 0,
            MetaLeads: metaLeadsGrouped[formattedDate] || 0,
          });
        }

        finalData.reverse();
        setChartData(finalData);
      } catch (error) {
        console.error("Error fetching chart data:", error);
        setError("Failed to load chart data");
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [token, orgId]);

  return (
    <div className="mx-2">
      <div className="w-full max-w-5xl p-4 border rounded-lg shadow-md bg-white">
        <h2 className="text-xl font-bold mb-2">Daily Leads Overview</h2>

        {loading ? (
          <p className="text-gray-500">Loading data...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <>
            <p className="text-sm text-gray-500 mb-4">
              Data for the past 28 days
            </p>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={chartData}
                margin={{ top: 5, right: 15, left: -40, bottom: 25 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="createdDate" tick={{ fill: "gray" }} />
                <YAxis tick={{ fill: "gray" }} allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="Leads"
                  name="Leads"
                  fill="#0891b2"
                  radius={[10, 10, 0, 0]}
                  barSize={14}
                />
                <Bar
                  dataKey="MetaLeads"
                  name="Meta Leads"
                  fill="#f59e0b"
                  radius={[10, 10, 0, 0]}
                  barSize={14}
                />
              </BarChart>
            </ResponsiveContainer>
          </>
        )}
      </div>
    </div>
  );
};

export default EmployeeLeadsGraph;
