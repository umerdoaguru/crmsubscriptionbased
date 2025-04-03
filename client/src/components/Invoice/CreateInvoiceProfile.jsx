import React, { useEffect, useState } from "react";
import axios from "axios";

import { Link, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import styled from "styled-components";
import UserLogin from "../../pages/UserLogin";
import Logout from "../../pages/Logout";
import cogoToast from "cogo-toast";

function CreateInvoiceProfile() {
  const { id } = useParams();

  const [headerImage, setHeaderImage] = useState(null);

  const [companyNameBranch, setCompanyNameBranch] = useState("");
  const [accountName, setAccountName] = useState("");
  const [accountIFSC, setAccountIFSC] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [companyAddress, setCompanyAddress] = useState("");
  const [companyCharge, setCompanyCharge] = useState("");
  const [companyBank, setCompanyBank] = useState("");
  const navigate = useNavigate();
  const UserId = useSelector((state) => state.auth.user.id);

  const handleHeaderImageChange = (e) => {
    setHeaderImage(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();

      formData.append("employeeId", UserId);
      formData.append("company_name", companyNameBranch);
      formData.append("company_name_account_name", accountName);
      formData.append("company_name_account_ifsc", accountIFSC);
      formData.append("company_name_account_number", accountNumber);
      formData.append("company_address", companyAddress);
      formData.append("charges", companyCharge);
      formData.append("bank", companyBank);

      const response = await axios.post(
        "https://crmdemo.vimubds5.a2hosted.com/api/upload-invoice-profile",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success === true) {
        // Trigger CogoToast success message
        cogoToast.success(`${response.data.message}`);

        // Reset input values after successful upload
        setHeaderImage(null);

        setCompanyNameBranch("");
        setAccountName("");
        setAccountIFSC("");
        setAccountNumber("");
        setCompanyAddress("");
        setCompanyCharge("");
        setCompanyBank("");
      } else {
        console.error(
          "Error uploading company data and images:",
          response.statusText
        );
      }
    } catch (error) {
      console.error("Error uploading company data and images:", error.message);
    }
  };

  return (
    <Wrapper>
      <div className="container-fluid mt-5">
        <div className="form-control">
          <div className="d-flex justify-content-between">
            <div className="mx-3 mt-3">
              {" "}
              <UserLogin />
            </div>
            <div className=" mt-3 mx-3 ">
              {" "}
              <Logout />
            </div>
          </div>
          <div className="row g-2 mt-2"></div>
          <h3 className="text-center mt-2">Create Invoice Company Profile</h3>
          <div className="row">
            <div className="col-lg-3"></div>
            <div className="col-lg-6">
              {" "}
              <div className="form-control text-center">
                <div className="">
                  <label className="form-check-label ">
                    Company Name :
                    <input
                      type="text"
                      className="form-control mb-2"
                      value={companyNameBranch}
                      onChange={(e) => setCompanyNameBranch(e.target.value)}
                    />
                  </label>

                  <label className="form-check-label ">
                    Company Address :
                    <input
                      type="text"
                      className="form-control mb-2 mx-2"
                      value={companyAddress}
                      onChange={(e) => setCompanyAddress(e.target.value)}
                    />
                  </label>
                </div>

                <h6>Company Name Payment Detail :-</h6>

                <label className="form-check-label">
                  Account Name :
                  <input
                    type="text"
                    className="form-control mb-2"
                    value={accountName}
                    onChange={(e) => setAccountName(e.target.value)}
                  />
                </label>

                <label className="form-check-label mx-lg-2  ">
                  IFSC Code :
                  <input
                    type="text"
                    className="form-control mb-2"
                    value={accountIFSC}
                    onChange={(e) => setAccountIFSC(e.target.value)}
                  />
                </label>

                <label className="form-check-label ">
                  Account Number :
                  <input
                    type="text"
                    className="form-control mb-2"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                  />
                </label>
                <label className="form-check-label mx-2 ">
                  Company Charge :
                  <input
                    type="text"
                    className="form-control mb-2"
                    value={companyCharge}
                    onChange={(e) => setCompanyCharge(e.target.value)}
                  />
                </label>
                <br />
                <label className="form-check-label mx-2 ">
                  Company Bank :
                  <input
                    type="text"
                    className="form-control mb-2"
                    value={companyBank}
                    onChange={(e) => setCompanyBank(e.target.value)}
                  />
                </label>
                <br />

                <label className="form-check-label">
                  Logo Image :
                  <input
                    type="file"
                    className="form-control  mb-2"
                    accept="image/*"
                    onChange={handleHeaderImageChange}
                  />
                </label>

                <br />
                <br />
                <button className="btn btn-success " onClick={handleUpload}>
                  Upload
                </button>
              </div>
            </div>
            <div className="col-lg-3"></div>
          </div>
        </div>
      </div>
      {/* <div className="" style={{ border: '1px solid #ccc', padding: '10px', margin: '10px', borderRadius: '5px' }}>

    <Header/>
</div>

<div className="" style={{ border: '1px solid #cccccc', padding: '10px', margin: '10px', borderRadius: '5px' }}>
<Footer/>

</div> */}
    </Wrapper>
  );
}

export default CreateInvoiceProfile;

const Wrapper = styled.div`
  img {
    width: -webkit-fill-available;
  }
`;
