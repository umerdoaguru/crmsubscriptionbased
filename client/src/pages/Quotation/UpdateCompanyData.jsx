import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate, useParams } from "react-router-dom";

function UpdateCompanyData() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [headerImage, setHeaderImage] = useState(null);
  const [footerImage, setFooterImage] = useState(null);
  const [companyName, setCompanyName] = useState("");
  const [accountName, setAccountName] = useState("");
  const [accountIFSC, setAccountIFSC] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [companyAddress, setCompanyAddress] = useState("");
  const [accountBank_Name, setAccountBank_Name] = useState("");
  const [companyMoblie_no, setCompanyMoblie_no] = useState("");
  const [companyGST_no, setCompanyGST_no] = useState("");
  const [companyGST_per, setCompanyGST_per] = useState("");
  const [companyPan_no, setCompanyPan_no] = useState("");
  const [companyEmail_id, setCompanyEmail_id] = useState("");
  const [logoImage, setLogoImage] = useState(null);
  const [companydigitalsign, setCompanydigitalsign] = useState(null);
  const [idcompany, setIdCompany] = useState("");
  const [userId, setUserId] = useState("");
  const [selectedFileHeader, setSelectedFileHeader] = useState(false);
  const [selectedFileFooter, setSelectedFileFooter] = useState(false);
  const [selectedFileLogo, setSelectedFileLogo] = useState(false);
  const [selectedFileSign, setSelectedFileSign] = useState(false);
  const [showModal, setShowModal] = useState(true);

  const location = useLocation();
  const { company } = location.state;
  console.log(company);

  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        const response = await axios.post(
          "http://localhost:9000/api/company-header-footer",
          {
            company_name: company,
          }
        );

        if (response.status === 200) {
          const companyData = response.data;
          setIdCompany(companyData.id);
          setUserId(companyData.user_id);
          setCompanyName(companyData.company_name);
          setAccountName(companyData.company_name_account_name);
          setAccountIFSC(companyData.company_name_account_ifsc);
          setAccountNumber(companyData.company_name_account_number);
          setCompanyAddress(companyData.company_address);
          setAccountBank_Name(companyData.bank);
          setCompanyMoblie_no(companyData.moblie_no);
          setCompanyGST_no(companyData.gst_no);
          setCompanyGST_per(companyData.gst_per);
          setCompanyPan_no(companyData.pan_no);
          setCompanyEmail_id(companyData.email_id);
        } else {
          console.error("Error Company Data:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching company data:", error);
      }
    };

    fetchCompanyData();
  }, [company]);

  const handleHeaderImageChange = (e) => {
    setHeaderImage(e.target.files[0]);
    setSelectedFileHeader(true);
  };

  const handleFooterImageChange = (e) => {
    setFooterImage(e.target.files[0]);
    setSelectedFileFooter(true);
  };

  const handleLogoImageChange = (e) => {
    setLogoImage(e.target.files[0]);
    setSelectedFileLogo(true);
  };

  const handleDigitalsignImageChange = (e) => {
    setCompanydigitalsign(e.target.files[0]);
    setSelectedFileSign(true);
  };

  const handleUpload = async () => {
    try {
      // if (!selectedFileHeader || !selectedFileFooter || !selectedFileLogo || !selectedFileSign) {
      //   alert('All image files must be selected');
      //   return;
      // }
      const formData = new FormData();
      formData.append("header_img", headerImage);
      formData.append("footer_img", footerImage);
      formData.append("user_id", userId);
      formData.append("company_name", companyName);
      formData.append("company_name_account_name", accountName);
      formData.append("company_name_account_ifsc", accountIFSC);
      formData.append("company_name_account_number", accountNumber);
      formData.append("company_address", companyAddress);
      formData.append("bank", accountBank_Name);
      formData.append("moblie_no", companyMoblie_no);
      formData.append("gst_no", companyGST_no);
      formData.append("gst_per", companyGST_per);
      formData.append("pan_no", companyPan_no);
      formData.append("email_id", companyEmail_id);
      formData.append("logo", logoImage);
      formData.append("digital_sign", companydigitalsign);

      const response = await axios.put(
        `http://localhost:9000/api/companydata/${idcompany}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        console.log("Header and footer images updated successfully");
        navigate("/quotation-section");
      } else {
        console.error(
          "Error updating header and footer images:",
          response.statusText
        );
      }
    } catch (error) {
      console.error("Error updating header and footer images:", error.message);
    }
  };

  const handleClose = () => {
    setShowModal(false);
    navigate("/quotation-section");
  };

  return (
    <>
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50 ">
          <div className="bg-white rounded-lg shadow-lg w-auto max-h-[100vh] overflow-auto mx-3 mt-3 mb-3  p-4 ">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg sm:text-xl font-bold">
                Update Company Details
              </h2>
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={handleClose}
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              </button>
            </div>
            <form>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label
                    className="block text-gray-700 font-medium mb-2"
                    htmlFor="companyName"
                  >
                    Company Name
                  </label>
                  <input
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                    type="text"
                    id="companyName"
                    placeholder="Enter company name"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                  />
                </div>
                <div>
                  <label
                    className="block text-gray-700 font-medium mb-2"
                    htmlFor="companyAddress"
                  >
                    Company Address
                  </label>
                  <input
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                    type="text"
                    id="companyAddress"
                    placeholder="Enter company address"
                    value={companyAddress}
                    onChange={(e) => setCompanyAddress(e.target.value)}
                  />
                </div>
                <div>
                  <label
                    className="block text-gray-700 font-medium mb-2"
                    htmlFor="companyMobileNumber"
                  >
                    Company Mobile Number
                  </label>
                  <input
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                    type="text"
                    id="companyMobileNumber"
                    placeholder="Enter company mobile number"
                    value={companyMoblie_no}
                    onChange={(e) => setCompanyMoblie_no(e.target.value)}
                  />
                </div>
                <div>
                  <label
                    className="block text-gray-700 font-medium mb-2"
                    htmlFor="companyEmailId"
                  >
                    Company Email Id
                  </label>
                  <input
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                    type="email"
                    id="companyEmailId"
                    placeholder="Enter company email"
                    value={companyEmail_id}
                    onChange={(e) => setCompanyEmail_id(e.target.value)}
                  />
                </div>
                {companyGST_no && (
                  <div>
                    <label
                      className="block text-gray-700 font-medium mb-2"
                      htmlFor="companyGstNumber"
                    >
                      GST Number
                    </label>
                    <input
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                      type="text"
                      id="companyGstNumber"
                      placeholder="Enter GST number"
                      value={companyGST_no}
                      onChange={(e) => setCompanyGST_no(e.target.value)}
                    />
                  </div>
                )}
                {companyPan_no && (
                  <div>
                    <label
                      className="block text-gray-700 font-medium mb-2"
                      htmlFor="companyPanNumber"
                    >
                      PAN Number
                    </label>
                    <input
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                      type="text"
                      id="companyPanNumber"
                      placeholder="Enter PAN number"
                      value={companyPan_no}
                      onChange={(e) => setCompanyPan_no(e.target.value)}
                    />
                  </div>
                )}
                <div>
                  <label
                    className="block text-gray-700 font-medium mb-2"
                    htmlFor="accountName"
                  >
                    Account Name
                  </label>
                  <input
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                    type="text"
                    id="accountName"
                    placeholder="Enter account name"
                    value={accountName}
                    onChange={(e) => setAccountName(e.target.value)}
                  />
                </div>
                <div>
                  <label
                    className="block text-gray-700 font-medium mb-2"
                    htmlFor="accountIFSC"
                  >
                    IFSC Code
                  </label>
                  <input
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                    type="text"
                    id="accountIFSC"
                    placeholder="Enter IFSC code"
                    value={accountIFSC}
                    onChange={(e) => setAccountIFSC(e.target.value)}
                  />
                </div>
                <div>
                  <label
                    className="block text-gray-700 font-medium mb-2"
                    htmlFor="accountNumber"
                  >
                    Account Number
                  </label>
                  <input
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                    type="text"
                    id="accountNumber"
                    placeholder="Enter account number"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                  />
                </div>
                <div>
                  <label
                    className="block text-gray-700 font-medium mb-2"
                    htmlFor="bankName"
                  >
                    Bank Name
                  </label>
                  <input
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                    type="text"
                    id="bankName"
                    placeholder="Enter bank name"
                    value={accountBank_Name}
                    onChange={(e) => setAccountBank_Name(e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label
                    className="block text-gray-700 font-medium mb-2"
                    htmlFor="headerImage"
                  >
                    Header Image
                  </label>
                  <input
                    className="w-full text-gray-700 border rounded-lg p-2"
                    type="file"
                    accept="image/*"
                    onChange={handleHeaderImageChange}
                  />
                </div>
                <div>
                  <label
                    className="block text-gray-700 font-medium mb-2"
                    htmlFor="footerImage"
                  >
                    Footer Image
                  </label>
                  <input
                    className="w-full text-gray-700 border rounded-lg p-2"
                    type="file"
                    accept="image/*"
                    onChange={handleFooterImageChange}
                  />
                </div>
                <div>
                  <label
                    className="block text-gray-700 font-medium mb-2"
                    htmlFor="logoImage"
                  >
                    Logo Image
                  </label>
                  <input
                    className="w-full text-gray-700 border rounded-lg p-2"
                    type="file"
                    accept="image/*"
                    onChange={handleLogoImageChange}
                  />
                </div>
                <div>
                  <label
                    className="block text-gray-700 font-medium mb-2"
                    htmlFor="digitalSignImage"
                  >
                    Digital Signature Image
                  </label>
                  <input
                    className="w-full text-gray-700 border rounded-lg p-2"
                    type="file"
                    accept="image/*"
                    onChange={handleDigitalsignImageChange}
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                  onClick={handleUpload}
                >
                  Update Company Data
                </button>
              </div>
            </form>
            <div className="mt-4">
              <button
                className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
                onClick={handleClose}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default UpdateCompanyData;
