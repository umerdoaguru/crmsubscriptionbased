import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { Redirect } from "react-router-dom";
import { useSelector } from "react-redux";

import { useLocation } from "react-router-dom";
import UserLogin from "../../UserLogin";
import Logout from "../../Logout";
import cogoToast from "cogo-toast";
import MainHeader from "./../../MainHeader";
import Sider from "../../Sider";
import EmployeeeSider from "../EmployeeSider";
import QuotationInputForm from "./QuotationInputForm";
import { MdNumbers } from "react-icons/md";

const QuotationByLeads = () => {
  const EmpId = useSelector((state) => state.auth.user.id);
  const EmpName = useSelector((state) => state.auth.user.name);
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { name } = location.state || {}; // Retrieve name from state



  
  const handleSubmit = async (formData) => {
    try {
      // Combine the parent and child form data
      const dataToSubmit = {
        employeeId: EmpId,
        lead_id: id,
        employee_name: EmpName,
  
      };
  
      const response = await axios.post("http://localhost:9000/api/quotation", dataToSubmit);
      
      console.log("Quotation added successfully:", response.data);
      
      try {
        const updateResponse = await axios.put(
          `http://localhost:9000/api/updateOnlyQuotationStatus/${id}`,
          { quotation: "created" }
        );
  
        if (updateResponse.status === 200) {
          console.log("Updated successfully:", updateResponse.data);
          cogoToast.success("Quotation Created and status updated successfully");
        } else {
          console.error("Error updating:", updateResponse.data);
          cogoToast.error("Failed to update the quotation status.");
        }
      } catch (error) {
        console.error("Request failed:", error);
        cogoToast.error("Failed to update the quotation status.");
      }
  
      navigate(`/final-quotation-by-lead/${response.data.quotation.id}`);
    } catch (error) {
      console.error("Error adding quotation:", error.response?.data || error.message);
    }
  };
  

  return (
    <>
      <MainHeader />
      <EmployeeeSider />
      <div className="flex flex-col  2xl:ml-44 ">
      <div className="mt-[4rem] ">
          <button
            onClick={() => navigate(-1)}
            className="bg-blue-500 text-white px-3 py-1 max-sm:hidden rounded-lg hover:bg-blue-600 transition-colors"
          >
            Back
          </button>
        </div>
        <div className="p-4 ">
          <div className="">
            <div className=" gap-4">
              <div
                className="bg-white p-6 rounded shadow-md" >
                <div className="grid lg:grid-cols-12  gap-4 p-2">
                  <div className="lg:col-span-2 font-medium ">
                    <UserLogin />
                  </div>

                  <div className="lg:col-span-7 lg:text-center  ">
                    <center className="text-2xl text-center mt-8 font-medium">
                      Quotation Generation System
                    </center>
                    <center className="mx-auto h-[3px] w-16 bg-[#34495E] my-3"></center>
                  </div>
                </div>               
                  <div className="mb-6">
                    <div className="grid gap-4 lg:grid-cols-1">
                        <h6>Leads Name: <span className="font-bold">{name}</span></h6>
                        {/* Quotation Information Form here */}
                      <div>
                      <QuotationInputForm name={name} />

                      </div>
                    </div>
                  </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};



export default QuotationByLeads;
