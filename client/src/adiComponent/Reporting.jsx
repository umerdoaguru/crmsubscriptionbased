import React, { useState, useEffect } from "react";
import { BsDownload, BsFilter } from "react-icons/bs";
import * as XLSX from "xlsx";
import MainHeader from "../components/MainHeader";
import Sider from "../components/Sider";
import axios from "axios";
import Pagination from "./comp/pagination";
import moment from "moment";

import SuperAdminSider from './Super-Admin/SuperAdminSider';

const Reporting = () => {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState("All");
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("quotation");
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredData, setFilteredData] = useState(data);
  const [rowPerPage, setRowPerPage] = useState(5);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [dataFields, setDataFields] = useState({
    quotation: {
      heading: ["Id", "Quotation Name", "Employee Name", "Date"],
      columns: [
        "quotation_id",
        "quotation_name",
        "employee_name",
        "created_date",
      ],
      quotation: [],
    },
    invoice: {
      heading: [
        "id ",
        "Invoice Name",
        "Employee Name",
        "Amount",
        "Payment Mode",
        "Date",
      ],
      columns: [
        "invoice_id",
        "invoice_name",
        "employee_name",
        "offer_price",
        "payment_mode",
        "created_date",
      ],
      invoice: [],
    },
    employee: {
      heading: ["Id", "Name", "Email", "Position", "date"],
      columns: ["employeeId", "name", "email", "position", "createdTime"],
      employee: [],
    },
    leads: {
      heading: [
        "Lead No.",
        "Assigned To",
        "Lead Name",
        "Phone Number",
        "Date",
        "Lead Source",
        "Quotation Status",
        "Invoice Status",
        "Deal Status",
        "FollowUp Status",
      ],
      columns: [
        "lead_no",
        "assignedTo",
        "name",
        "phone",
        "createdTime",
        "leadSource",
        "quotation_status",
        "invoice_status",
        "deal_status",
        "follow_up_status",
      ],
      leads: [],
    },
  });

  useEffect(() => {
    filterData();
  }, [selectedCategory, filter]);

  const filterData = () => {
    const filteredData = data[selectedCategory]?.filter((item) => {
      const currentDate = new Date();

      // Parse the date from created_date or createdTime, whichever exists
      const itemDate = new Date(item.created_date || item.createdTime);

      let filterCondition = false;

      if (filter === "week") {
        // Get the last Sunday and the current date for the week range
        const lastSunday = new Date(currentDate);
        lastSunday.setDate(currentDate.getDate() - currentDate.getDay()); // Last Sunday
        lastSunday.setHours(0, 0, 0, 0); // Start of the day

        const nextSaturday = new Date(lastSunday);
        nextSaturday.setDate(lastSunday.getDate() + 6); // Following Saturday

        filterCondition = itemDate >= lastSunday && itemDate <= nextSaturday;
      } else if (filter === "month") {
        // Get the start and end of the previous month
        const firstDayOfThisMonth = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          1
        );
        const lastDayOfThisMonth = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth() + 1,
          0
        ); // Last day of the current month

        filterCondition =
          itemDate >= firstDayOfThisMonth && itemDate <= lastDayOfThisMonth;
      } else if (filter === "year") {
        // Get the start and end of the current year
        const startOfYear = new Date(currentDate.getFullYear(), 0, 1); // January 1st
        const endOfYear = new Date(
          currentDate.getFullYear(),
          11,
          31,
          23,
          59,
          59
        ); // December 31st

        filterCondition = itemDate >= startOfYear && itemDate <= endOfYear;
      } else if (filter === "All") {
        return true;
      }

      return filterCondition;
    });

    console.log(filteredData);
    // Update the dataFields state for the selected category with the filtered data
    setDataFields((prevDataFields) => ({
      ...prevDataFields,
      [selectedCategory]: {
        ...prevDataFields[selectedCategory],
        [selectedCategory]: filteredData, // Update the specific category with filtered data
      },
    }));
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  // const handleFilterChange = (event) => {
  //   setFilter(event.target.value);
  // };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
    // Add any additional logic to apply the filter to your data here
    console.log("Filter changed to:", event.target.value);
  };

  const handleDownload = () => {
    // Items per page (5 in this case, or any other number you are using)
    const itemsPerPage = 5;

    // Calculate the start and end index for the current page
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    // Get the data for the current page
    const paginatedData = dataFields[selectedCategory][selectedCategory].slice(
      startIndex,
      endIndex
    );

    // Convert the paginated data to Excel
    const ws = XLSX.utils.json_to_sheet(paginatedData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

    // Write the Excel file
    XLSX.writeFile(
      wb,
      `${selectedCategory}-${filter}-data-page-${currentPage}.xlsx`
    );
  };

  const quotationAxios = axios.create({
    baseURL: "https://crmdemo.vimubds5.a2hosted.com/api",
  });

  const invoiceAxios = axios.create({
    baseURL: "https://crmdemo.vimubds5.a2hosted.com/api",
  });

  const employeeAxios = axios.create({
    baseURL: "https://crmdemo.vimubds5.a2hosted.com/api",
  });

  const leadsAxios = axios.create({
    baseURL: "https://crmdemo.vimubds5.a2hosted.com/api",
  });

  const formatData = (data) => {
    return data.map((item) => ({
      ...item,
      created_date: moment(item.created_date).format("DD/MM/YYYY"),
      createdTime: moment(item.createdTime).format("DD/MM/YYYY"),
    }));
  };

  const getQuotationData = async () => {
    try {
      const results = await Promise.allSettled([
        quotationAxios.get("/get-quotation-data"),
        invoiceAxios.get("/get-invoice-data"),
        employeeAxios.get("/employee"),
        leadsAxios.get("/leads"),
      ]);

      // Initialize empty response objects
      let quotationData = [];
      let invoiceData = [];
      let employeeData = [];
      let leadsData = [];

      // Handle each result
      results.forEach((result, index) => {
        if (result.status === "fulfilled") {
          switch (index) {
            case 0:
              quotationData = formatData(result.value.data.data);
              break;
            case 1:
              invoiceData = formatData(result.value.data.data);
              break;
            case 2:
              employeeData = formatData(result.value.data);
              break;
            case 3:
              leadsData = formatData(result.value.data);
              break;
            default:
              break;
          }
        } else {
          console.error(
            `Error fetching data for index ${index}:`,
            result.reason
          );
        }
      });

      const combinedData = {
        quotation: quotationData,
        invoice: invoiceData,
        employee: employeeData,
        leads: leadsData,
      };

      const updatedDataFields = {
        ...dataFields,
        quotation: {
          ...dataFields.quotation,
          quotation: combinedData.quotation,
        },
        invoice: {
          ...dataFields.invoice,
          invoice: combinedData.invoice,
        },
        employee: {
          ...dataFields.employee,
          employee: combinedData.employee,
        },
        leads: {
          ...dataFields.leads,
          leads: combinedData.leads,
        },
      };

      setDataFields(updatedDataFields);
      console.log(combinedData);
      setData(combinedData);
    } catch (error) {
      console.log("Unexpected error:", error);
    }
  };

  useEffect(() => {
    getQuotationData();
  }, []);

  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredLeads);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Leads");
    XLSX.writeFile(workbook, "LeadsData.xlsx");
  };

  return (
    <>
      <MainHeader />
      <Sider />
      <div className="flex flex-col lg:flex-row">
        <div className="flex-grow p-4 mt-14 lg:mt-0 lg:ml-36 sm:ml-0">
          <center className="text-2xl text-center mt-8 font-medium">
            Reports
          </center>
          <center className="mx-auto h-[3px] w-16 bg-[#34495E] my-3"></center>

          <div className="gap-4 mb-3">
            <div className="flex flex-col space-y-4 lg:space-y-0 md:flex-row justify-between  mb-8">
              <div className="flex flex-wrap justify-center max-sm:justify-center">
                <div className="flex flex-wrap justify-center items-center p-2   rounded-lg mt-0">
                {["quotation", "invoice", "employee", "leads"].map(
                    (category) => (
                      <button
                        key={category}
                        onClick={() => handleCategoryClick(category)}
                        className={`mb-2 mr-2 px-3 py-1 rounded-lg  font-medium ${
                          selectedCategory === category
                            ? "bg-blue-500 text-white"
                            : "bg-gray-200"
                        }`}
                      >
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </button>
                    )
                  )}
                </div>

                <div className="md:flex sm:w-auto sm:flex-1 md:w-full items-center justify-center ">
                  {/* Date Filter */}
                  <div className="flex   md:items-center sm:items-center md:mr-2 mb-2 rounded-lg mt-0">
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="border lg:px-2 py-1 rounded"
                    />
                    <div className="p-2">
                      <p>to</p>
                    </div>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="border px-2 py-1 rounded"
                    />
                  </div>
                  <div className="respo md:mx-2 mb-2 ">
                    <button
                      onClick={downloadExcel}
                      className="bg-blue-500 text-white lg:font-medium font-base  lg:px-3 px-1 py-1 rounded hover:bg-blue-700 sm:auto w-full"
                    >
                      Download
                    </button>
                  </div>
                  {/* </div> */}

                  <div className="flex justify-start items-center px-1 py-1 bg-gray-100 border mr-2 mb-2 rounded-lg mt-0">
                    <BsFilter className="lg:mr-2 mr-0" />
                    <select
                      value={filter}
                      onChange={handleFilterChange}
                      className="bg-transparent  border-gray-300 rounded sm:px-2 sm:py-1 px-0 py-0 w-full outline-none "
                    >
                      <option value="All">All</option>
                      <option value="week">Week</option>
                      <option value="month">Month</option>
                      <option value="half-year">Half Year</option>
                      <option value="year">Year</option>
                    </select>
                  </div>

                  <div className="respo flex-1 md:mx-2 mb-2 ">
                    <button
                      onClick={handleDownload}
                      className="bg-blue-500 flex justify-center items-center text-white lg:font-medium font-base  lg:px-3 px-1 py-1 rounded hover:bg-blue-700 sm:auto w-full"
                    >
                      <BsDownload className="mr-2" /> Download
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto rounded-lg shadow-md">
            <table className="min-w-full bg-white">
              <thead>
                <tr className="text-sm font-semibold text-left text-gray-600 uppercase bg-gray-200">
                  {dataFields?.[selectedCategory].heading.map((heading) => (
                    <th className="px-4 py-3">{heading}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {dataFields?.[selectedCategory]?.[selectedCategory]?.length >
                0 ? (
                  dataFields?.[selectedCategory]?.[selectedCategory]
                    .slice(
                      (currentPage - 1) * rowPerPage,
                      currentPage * rowPerPage
                    )
                    .map((item, index) => (
                      <tr key={index} className="border-b border-gray-200">
                        {dataFields[selectedCategory]?.columns.map((column) => (
                          <td className="px-4 py-3">{item[column]}</td>
                        ))}
                      </tr>
                    ))
                ) : (
                  <tr>
                    <td colSpan="5" className="py-4 text-center">
                      No data found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <Pagination
            currentPage={currentPage}
            totalItems={data?.[selectedCategory]?.length}
            itemsPerPage={rowPerPage}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </>
  );
};

export default Reporting;
