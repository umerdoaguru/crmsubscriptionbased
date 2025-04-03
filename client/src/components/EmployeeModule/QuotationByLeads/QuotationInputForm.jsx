import React, { useState } from 'react';
import axios from 'axios'
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import cogoToast from 'cogo-toast';

const QuotationInputForm = ({name}) => {
  const EmpId = useSelector((state) => state.auth.user.id);
  const EmpName = useSelector((state) => state.auth.user.name);
  const { id } = useParams();
  const navigate = useNavigate();
  
  const initialFormData = {
    customerName: name,
    contactNumber: '',
    alternateNumber: '',
    address: '',
    adhaarNumber: '',
    panNumber: '',
    projectName: '',
    unitNumber: '',
    dimension: '',
    rate: '',
    variant: '',
    totalDeal: '',
    bookingAmount: '',
    bookingAmountWords: '',
    paymentMode: '',
    financeBank: '',
    duration: '',
    balanceAmount: '',
    balanceAmountWords: '',
    paymentDueDate1: '',
    paymentDueDate2: '',
    paymentDueDate3: '',
    paymentDueDate4: '',
    registryCharges: '',
    p1p2Charges: '',
    remarks: ''
  };

  const [formData, setFormData] = useState(initialFormData);


    // Function to convert number to words in Indian format
    function numberToWordsIndian(num) {
      const units = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"];
      const teens = ["Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
      const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
      const thousands = ["", "Thousand", "Lakh", "Crore"];
  
      if (num === 0) return "Zero";
  
      const parseTwoDigits = (n) => {
          if (n < 10) return units[n];
          else if (n < 20) return teens[n - 10];
          return tens[Math.floor(n / 10)] + (n % 10 ? " " + units[n % 10] : "");
      };
  
      const parseThreeDigits = (n) => {
          if (n >= 100) {
              return units[Math.floor(n / 100)] + " Hundred" + (n % 100 ? " " + parseTwoDigits(n % 100) : "");
          } else {
              return parseTwoDigits(n);
          }
      };
  
      const getIndianFormattedWords = (number) => {
          let result = "";
          let unitIndex = 0;
  
          // Handle each block of three digits
          while (number > 0) {
              let currentBlock = number % 1000; // Get the current block (Thousand, Lakh, etc.)
              if (currentBlock > 0) {
                  result = parseThreeDigits(currentBlock) + (thousands[unitIndex] ? " " + thousands[unitIndex] : "") + (result ? " " + result : "");
              }
  
              number = Math.floor(number / 1000); // Reduce the number by dividing it by 1000 for the next block
              unitIndex++;
          }
  
          return result.trim(); // Remove extra spaces from the result
      };
  
      return getIndianFormattedWords(num);
  }  
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      let updatedFormData = { ...formData };
  
      // Contact number validation (exactly 10 digits)
      if (name === 'contactNumber') {
        if (value.length <= 10 && /^\d*$/.test(value)) {
          updatedFormData.contactNumber = value;
        }
      }
  
      // Aadhaar number validation (exactly 12 digits)
      else if (name === 'adhaarNumber') {
        if (value.length <= 12 && /^\d*$/.test(value)) {
          updatedFormData.adhaarNumber = value;
        }
      }
  
      // PAN number validation and formatting
      else if (name === 'panNumber') {
        let formattedValue = value.toUpperCase();
  
        // Only allow first 5 characters as letters, next 4 as numbers, last as letter
        if (formattedValue.length <= 5) {
          formattedValue = formattedValue.replace(/[^A-Z]/g, ''); // Only uppercase letters
        } else if (formattedValue.length <= 9) {
          formattedValue = formattedValue.slice(0, 5) + formattedValue.slice(5).replace(/[^0-9]/g, ''); // Only numbers for next 4
        } else {
          formattedValue = formattedValue.slice(0, 9) + formattedValue.slice(9).replace(/[^A-Z]/g, ''); // Last character as letter
        }
  
        updatedFormData.panNumber = formattedValue;
      }
  
      // Automatically convert Booking Amount to words
      else if (name === 'bookingAmount') {
        updatedFormData.bookingAmount = value;
        updatedFormData.bookingAmountWords = value && !isNaN(value) ? numberToWordsIndian(Number(value)) : '';
      }
  
      // Automatically convert Balance Amount to words
      else if (name === 'balanceAmount') {
        updatedFormData.balanceAmount = value;
        updatedFormData.balanceAmountWords = value && !isNaN(value) ? numberToWordsIndian(Number(value)) : '';
      }
  
      // Default case for other fields
      else {
        updatedFormData[name] = value;
      }
  
      console.log('data on change :', updatedFormData);
      setFormData(updatedFormData);
    };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Combine formData with additional fields
      const dataToSubmit = {
        ...formData,
        employeeId: EmpId,
        lead_id: id,
        employee_name: EmpName
      };

      console.log('Submit data check',dataToSubmit);
      

      // Send the POST request to save the quotation
      const response = await axios.post("https://crmdemo.vimubds5.a2hosted.com/api/quotation-information-form", dataToSubmit);
      console.log("Quotation added successfully:", response.data);

      
      // Send the PUT request to update the quotation status
      try {
        const updateResponse = await axios.put(
          `https://crmdemo.vimubds5.a2hosted.com/api/updateOnlyQuotationStatus/${id}`,
          { quotation: "created" }
        );
        if (updateResponse.status === 200) {
          console.log("Updated successfully:", updateResponse.data);
          cogoToast.success("Quotation Created and status updated successfully");
          navigate(`/employee-lead-single-data/${id}`);
        } else {
          console.error("Error updating:", updateResponse.data);
          cogoToast.error("Failed to update the quotation status.");
        }
      } catch (error) {
        console.error("Request failed:", error);
        cogoToast.error("Failed to update the quotation status.");
      }
      console.log("Id check kro kon si he ", response.data.quotation.id);
      
    } catch (error) {
      console.error("Error adding quotation:", error.response?.data || error.message);
    }
  };
  

  // Clear form fields
  const handleClear = () => {
    const confirmed = window.confirm('Are you sure you want to clear all data?');
    if (confirmed) {
      setFormData(initialFormData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-white shadow-md rounded-lg">
      {/* <h2 className="text-2xl font-bold mb-4 text-center">Quotation Information</h2> */}

      {/** Customer Information **/}
      <div className="grid grid-cols-2 gap-4">
        <input type="text" name="customerName" placeholder="Customer Name" value={name} onChange={handleChange} className="p-2 border rounded" required />
        <input type="text" name="contactNumber" placeholder="Contact Number" value={formData.contactNumber} onChange={handleChange} className="p-2 border rounded" required />
        <input type="text" name="alternateNumber" placeholder="Alternate Number" value={formData.alternateNumber} onChange={handleChange} className="p-2 border rounded" maxLength="10"  />
        <input type="text" name="address" placeholder="Address" value={formData.address} onChange={handleChange} className="p-2 border rounded" required />
        <input type="text" name="adhaarNumber" placeholder="Adhaar Number" value={formData.adhaarNumber} onChange={handleChange} className="p-2 border rounded" required />
        <input type="text" name="panNumber" placeholder="PAN Number" value={formData.panNumber} onChange={handleChange} className="p-2 border rounded" maxLength='10' required />
      </div>

      {/** Project Information **/}
      <div className="grid grid-cols-2 gap-4 mt-4">
        <input type="text" name="projectName" placeholder="Project Name" value={formData.projectName} onChange={handleChange} className="p-2 border rounded" required />
        <input type="text" name="unitNumber" placeholder="Unit Number" value={formData.unitNumber} onChange={handleChange} className="p-2 border rounded" required />
        <input type="text" name="dimension" placeholder="Dimension" value={formData.dimension} onChange={handleChange} className="p-2 border rounded" required />
        <input type="text" name="rate" placeholder="Rate" value={formData.rate} onChange={handleChange} className="p-2 border rounded" required />
        <input type="text" name="variant" placeholder="Variant" value={formData.variant} onChange={handleChange} className="p-2 border rounded" required />
      </div>

      {/** Deal and Payment Information **/}
      <div className="grid grid-cols-2 gap-4 mt-4">
        <input type="text" name="totalDeal" placeholder="Total Deal" value={formData.totalDeal} onChange={handleChange} className="p-2 border rounded" required />
        <input type="text" name="bookingAmount" placeholder="Booking Amount" value={formData.bookingAmount} onChange={handleChange} className="p-2 border rounded" required />
        <input type="text" name="bookingAmountWords" placeholder="Booking Amount (In Words)" value={formData.bookingAmountWords} onChange={handleChange} className="p-2 border rounded" required />
        <input type="text" name="paymentMode" placeholder="Payment Mode" value={formData.paymentMode} onChange={handleChange} className="p-2 border rounded" required />
        <input type="text" name="financeBank" placeholder="Finance Bank (if applicable)" value={formData.financeBank} onChange={handleChange} className="p-2 border rounded" required />
        <input type="text" name="duration" placeholder="Duration" value={formData.duration} onChange={handleChange} className="p-2 border rounded" required />
      </div>

      {/** Balance and Payment Due Dates **/}
      <div className="grid grid-cols-2 gap-4 mt-4">
        <input type="text" name="balanceAmount" placeholder="Balance Amount" value={formData.balanceAmount} onChange={handleChange} className="p-2 border rounded" required />
        <input type="text" name="balanceAmountWords" placeholder="Balance Amount (In Words)" value={formData.balanceAmountWords} onChange={handleChange} className="p-2 border rounded" required />

        <div>
          <label className="block text-gray-400">Payment Due Date 1</label>
          <input type="date" name="paymentDueDate1" value={formData.paymentDueDate1} onChange={handleChange} className="p-2 border rounded w-full" required />
        </div>

        <div>
          <label className="block text-gray-400">Payment Due Date 2</label>
          <input type="date" name="paymentDueDate2" value={formData.paymentDueDate2} onChange={handleChange} className="p-2 border rounded w-full" required />
        </div>

        <div>
          <label className="block text-gray-400">Payment Due Date 3</label>
          <input type="date" name="paymentDueDate3" value={formData.paymentDueDate3} onChange={handleChange} className="p-2 border rounded w-full" required />
        </div>

        <div>
          <label className="block text-gray-400">Payment Due Date 4</label>
          <input type="date" name="paymentDueDate4" value={formData.paymentDueDate4} onChange={handleChange} className="p-2 border rounded w-full" required />
        </div>
      </div>

      {/** Charges and Remarks **/}
      <div className="grid grid-cols-2 gap-4 mt-4">
        <input type="text" name="registryCharges" placeholder="Registry Charges" value={formData.registryCharges} onChange={handleChange} className="p-2 border rounded" required />
        <input type="text" name="p1p2Charges" placeholder="P1 P2 Charges" value={formData.p1p2Charges} onChange={handleChange} className="p-2 border rounded" required />
      </div>
      <textarea name="remarks" placeholder="Remarks" value={formData.remarks} onChange={handleChange} className="p-2 border rounded mt-4 w-full" required></textarea>

      <button type="submit" className="mt-6 bg-blue-500 text-white p-2 rounded m-1">Submit</button>
      <button type="button" onClick={handleClear} className="bg-gray-400 text-white p-2 rounded m-1">Clear</button>
    </form>
  );
};

export default QuotationInputForm;




