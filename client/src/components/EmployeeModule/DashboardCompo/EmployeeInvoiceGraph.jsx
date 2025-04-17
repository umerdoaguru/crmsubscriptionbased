import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
// import { useDispatch, useSelector } from "react-redux";
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
import styled from "styled-components";

const EmployeeInvoiceGraph = () => {
  const [loading, setLoading] = useState(false);
  const [invoiceData, setInvoiceData] = useState([]); // Update to store structured data
  const EmpId = useSelector((state) => state.auth.user);  
  const token = EmpId?.token;
  useEffect(() => {
    const getAppointList = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:9000/api/get-employee-invoice/${EmpId.id}`,
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
          }}
        );
        const invoiceList = response.data;

        // Get the current date and the date 28 days ago
        const today = new Date();
        const pastDate = new Date(today);
        pastDate.setDate(today.getDate() - 28); // Subtract 28 days

        // Convert dates to ISO strings for easy comparison
        const formattedToday = today.toISOString().split("T")[0];
        const formattedPastDate = pastDate.toISOString().split("T")[0];

        // Filter invoices that were created within the last 28 days
        const filteredInvoices = invoiceList.filter((item) => {
          const invoiceDate = item.created_date?.split("T")[0];
          return (
            invoiceDate >= formattedPastDate && invoiceDate <= formattedToday
          );
        });

        console.log(filteredInvoices);

        let result = {};

        // Group and calculate data
        filteredInvoices.forEach((item) => {
          const date = item.created_date.split("T")[0]; // Extract the date part
          if (!result[date]) {
            result[date] = { date, invoices: 0, Amount: 0 }; // Initialize
          }
          result[date].invoices += 1; // Count invoices
          result[date].Amount += parseFloat(item.offer_price); // Sum amounts
        });

        // Convert the result object to an array of objects
        const structuredData = Object.values(result);
        console.log(structuredData);

        setInvoiceData(structuredData); // Set the structured data in state
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.log(error);
      }
    };

    getAppointList();
  }, []);

  return (
    <Wrapper>
      <>
        <div className="w-full max-w-4xl mx-auto p-4 border rounded-lg shadow-md bg-white">
          <h2 className="text-xl font-bold mb-2">Daily Invoice Overview</h2>
          <p className="text-sm text-gray-500 mb-4">
            Invoices for the past 28 days
          </p>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              width={400}
              height={300}
              data={invoiceData}
              margin={{
                top: 5,
                right: 30,
                left: 0,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tick={{
                  fontSize: 0,
                  transform: "translate(-10,0)",
                  dy: 5,
                  fill: "#666",
                  // fontWeight: "bold",
                }}
              />
              <YAxis yAxisId="left"   allowDecimals={false} 
  tickFormatter={(value) => Number.isInteger(value) ? value : ''}/>
              <YAxis yAxisId="right" orientation="right"   allowDecimals={false} 
  tickFormatter={(value) => Number.isInteger(value) ? value : ''}/>
              <Tooltip />
              <Legend />
              <Bar
                dataKey="invoices"
                fill="#8884d8"
                yAxisId="left"
                name="Invoices"
                barSize={15}
              />
              <Bar
                dataKey="Amount"
                fill="#c23616"
                yAxisId="right"
                name="Amount"
                barSize={15}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </>
    </Wrapper>
  );
};

export default EmployeeInvoiceGraph;

const Wrapper = styled.div`
  #main {
    // background-color: #55efc4;
    width: 100%;
    border-radius: 5px;
    padding: 2rem;
    box-shadow: 0px 2px 18px #bdbaba;
    display: flex;
    justify-content: center;
  }
  @media screen and (max-width: 768px) {
    padding: 20px;
    font-size: small;
  }
`;
