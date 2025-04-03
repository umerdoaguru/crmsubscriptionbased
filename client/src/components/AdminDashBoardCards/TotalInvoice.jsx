import React, { useEffect, useState } from "react";
import MainHeader from "../MainHeader";
import Sider from "../Sider";
import axios from "axios";
import moment from "moment";
import { Link } from "react-router-dom";

function TotalInvoice() {
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await axios.get(
          `https://crmdemo.vimubds5.a2hosted.com/api/invoice-data`
        );
        setInvoices(response.data);
        console.log(response);
      } catch (error) {
        console.error("Error fetching invoices:", error);
      }
    };

    fetchInvoices();
  }, []);
  return (
    <>
      <MainHeader />
      <Sider />
      <div className="container">
        <h1 className="text-2xl text-center mt-[5rem]">Total Invoices </h1>
        <div className="mx-auto h-[3px] w-16 bg-[#34495E] my-3"></div>
      </div>
      <div className="container">
        <div className="overflow-y-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-gray-100 border-b">
                <th className="border border-gray-200 px-4 py-2">ID</th>
                <th className="border border-gray-200 px-4 py-2">
                  Invoice Name
                </th>
                <th className="border border-gray-200 px-4 py-2">
                  Invoice Number
                </th>
                <th className="border border-gray-200 px-4 py-2">
                  Created Date
                </th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice, index) => (
                <tr key={invoice.invoice_id} className="border-b">
                  <td className="border border-gray-200 px-4 py-2">
                    {index + 1}
                  </td>
                  <td className="border border-gray-200 px-4 py-2">
                    {invoice.invoice_name}
                  </td>
                  <td className="border border-gray-200 px-4 py-2">
                    {invoice.invoice_no}
                  </td>
                  <td className="border border-gray-200 px-4 py-2">
                    {moment(invoice.created_date).format("DD/MM/YYYY")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default TotalInvoice;
