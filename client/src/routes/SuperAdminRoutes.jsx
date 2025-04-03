import React from "react";

import { Route, Routes } from "react-router-dom";
import { useSelector } from "react-redux";

import SuperDash from "../adiComponent/SuperDash";
// import AdminManagement from "../adiComponent/AdminManagement";
import SuperAdminLead from "../adiComponent/Super-Admin/SuperAdminLead";
import SuperAdEmployeemanagement from "../adiComponent/Super-Admin/SuperAdEmployeemanagement";
import SuperQuotationList from "../adiComponent/Super-Admin/SuperQuotationList";
import SuperQuotationVIew from "../adiComponent/Super-Admin/SuperQuotationView";
import SuperReports from "./../adiComponent/Super-Admin/SuperReports";
import Super_Admin_Adminmanagement from "../adiComponent/Super-Admin/Super_Admin_AdminManagement";
import Employee_Single_Lead_Profile from "../components/Leads/Employee_Single_Lead_Profile";
import Single_Lead_Profile from "../components/Leads/Single_Lead_Profile";
import Super_Single_Lead_Profile from "../adiComponent/Super-Admin/Super_Single_Lead_Profile";
import SuperEmployeeList from "../adiComponent/Super-Admin/SuperEmployeeList";
import SuperEmployeeLeads from "../adiComponent/Super-Admin/SuperEmployeeLeads";
import SuperAdminVisit from "../adiComponent/Super-Admin/SuperAdminVisit";
import SuperAdminTotalLead from "../adiComponent/Super-Admin/SuperAdminTotalLead";
import SuperAdminTotalEmployee from "../adiComponent/Super-Admin/SuperAdminTotalEmployee";
import SuperAdminTotalClosedDeal from "../adiComponent/Super-Admin/SuperAdminTotalClosedDeal";
import EmployeeProfile from "../adiComponent/Super-Admin/employeProfile";
import AdminProfile from "../adiComponent/Super-Admin/adminProfile";
import SuperAdminProfile from "../adiComponent/Super-Admin/superAdminProfile";
import Super_view_visit from "../adiComponent/Super-Admin/Super_view_visit";
import Super_view_quotations from "../adiComponent/Super-Admin/Super_view_quotations";
import SuperDataExport from "../adiComponent/Super-Admin/SuperDataExport";
import Super_view_followup from "../adiComponent/Super-Admin/Super_view_followup";
import SuperMainSocialLeads from "../adiComponent/Super-Admin/SocialMediaSectionSuperAdmin/SuperMainSocialLeads";
import Super_view_remarks from "../adiComponent/Super-Admin/Super_view_remaks";
import SuperEmployeedatabyid from "../adiComponent/Super-Admin/SuperEmployeedatabyid";
import SuperMainSocialMediaByProject from './../adiComponent/Super-Admin/SuperSocialMedia/SuperMainSocialMediaByProject';
import SuperSocialMediaLeads from './../adiComponent/Super-Admin/SuperSocialMedia/SuperSocialMediaLeads';
import SuperProjectDashBoard from './../adiComponent/Super-Admin/SuperAdminProject/SuperProjectDashboard';
import Superunits from './../adiComponent/Super-Admin/SuperAdminProject/Superunits';
import SuperDashProject from "../adiComponent/Super-Admin/SuperAdminProject/SuperDashProject";
import SuperUnitsDetails from "../adiComponent/Super-Admin/SuperAdminProject/SuperUnitsDetails";
import SuperAdminSoldUnits from "../adiComponent/Super-Admin/SuperAdminSoldunit";

function SuperAdminRoutes() {
  const user = useSelector((state) => state.auth.user);
  
  return (
    <>
      <Routes>
        {/*super Admin routes by vinay */}
        <Route path="/" element={<SuperDash />} />
        <Route path="/super-admin-dashboard" element={<SuperDash />} />
        <Route path="/super-admin-leads" element={<SuperAdminLead />} />
        <Route path="/super-admin-total-visit" element={<SuperAdminVisit />} />
        <Route path="/super-admin-total-lead" element={<SuperAdminTotalLead/>} />
        <Route path="/super-admin-total-employee" element={<SuperAdminTotalEmployee/>} />
        <Route path="/super-admin-close-data" element={<SuperAdminTotalClosedDeal/>} />
        <Route path="/super-admin-employee-management" element={<SuperAdEmployeemanagement />} />
        <Route path="/super-admin-AdminManagement" element={<Super_Admin_Adminmanagement />} />
        <Route path="/super-admin-employee-list" element={<SuperEmployeeList />} />
        <Route path="/super-admin-employee-leads" element={<SuperEmployeeLeads />} />
{/*         
        <Route path="/super-admin-quotation-section" element={<CreateCompanyProfile />} /> */}
        <Route 
          path="/super-admin-quotationlist"
          element={<SuperQuotationList />}
        />
        <Route
          path="/super-admin-view-quotation/:id"
          element={<SuperQuotationVIew />}
        />
        <Route path="/super-admin-reporting" element={<SuperReports />} />
        <Route
          path="/super-admin-lead-single-data"
          element={<Super_Single_Lead_Profile />}
        />
        <Route
          path="/super-admin-lead-single-data/:id"
          element={<SuperEmployeedatabyid />}
        />
        <Route
          path="/super_view_visit/:id"
          element={<Super_view_visit />}
        />
        <Route
          path="/super_view_visit"
          element={<Super_view_visit />}
        />
        <Route
          path="/super_view_follow_up"
          element={<Super_view_followup/>}
        />
        <Route
          path="/super_view_remarks"
          element={<Super_view_remarks/>}
        />
        <Route
          path="/super-admin-employee-single/:employeeId"
          element={<EmployeeProfile />}
        />
        <Route
          path="/super-admin-admin-employe/:adminId"
          element={<AdminProfile />}
        />

        <Route
          path="/super-admin-profile"
          element={<SuperAdminProfile />}
        />
        <Route
          path="/super-admin-data-export"
          element={<SuperDataExport />}
        />
        <Route path="/main-social-media-super-admin-leads" element={<SuperMainSocialMediaByProject />} />
        <Route path="/social-media-superleads/:id" element={<SuperSocialMediaLeads />} />

        <Route path="/super-admin-project-dash" element={<SuperProjectDashBoard />} />
        <Route path="/super-admin-project-units/:id" element={<Superunits/>} />
        <Route path="/Super-admin-project" element={<SuperDashProject/>} />
        <Route path="/Super-admin-unit-Detail-Dash/:id" element={<SuperUnitsDetails/>} />
        <Route path="/super-admin-Sold-Units" element={<SuperAdminSoldUnits/>} />
      </Routes>
    </>
  );
}

export default SuperAdminRoutes;
