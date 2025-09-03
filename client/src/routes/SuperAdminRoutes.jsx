import React from "react";

import { Route, Routes } from "react-router-dom";
import { useSelector } from "react-redux";
import SuperAdminLead from "../adiComponent/Super-Admin/SuperAdminLead";
import SuperQuotationList from "../adiComponent/Super-Admin/SuperQuotationList";
import SuperQuotationVIew from "../adiComponent/Super-Admin/SuperQuotationView";
import Super_Single_Lead_Profile from "../adiComponent/Super-Admin/Super_Single_Lead_Profile";
import SuperEmployeeList from "../adiComponent/Super-Admin/SuperEmployeeList";
import SuperAdminTotalEmployee from "../adiComponent/Super-Admin/SuperAdminTotalEmployee";
import SuperAdminTotalClosedDeal from "../adiComponent/Super-Admin/SuperAdminTotalClosedDeal";
import EmployeeProfile from "../adiComponent/Super-Admin/employeProfile";
import AdminProfile from "../adiComponent/Super-Admin/adminProfile";
import Super_view_visit from "../adiComponent/Super-Admin/Super_view_visit";
import Super_view_followup from "../adiComponent/Super-Admin/Super_view_followup";
import Super_view_remarks from "../adiComponent/Super-Admin/Super_view_remaks";
import SuperEmployeedatabyid from "../adiComponent/Super-Admin/SuperEmployeedatabyid";
import SuperSocialMediaLeads from "./../adiComponent/Super-Admin/SuperSocialMedia/SuperSocialMediaLeads";
import Superunits from "./../adiComponent/Super-Admin/SuperAdminProject/Superunits";
import SuperUnitsDetails from "../adiComponent/Super-Admin/SuperAdminProject/SuperUnitsDetails";
import SuperAdminSoldUnits from "../adiComponent/Super-Admin/SuperAdminSoldunit";
import Super_view_visit_by_id from "../adiComponent/Super-Admin/Super_view_visit_by_id";
import Super_view_follow_by_id from "../adiComponent/Super-Admin/Super_view_follow_by_id";
import Super_view_unit_byid from "../adiComponent/Super-Admin/Super_view_unit_byid";
import Super_view_remark_byid from "./../adiComponent/Super-Admin/Super_view_remark_byid";
import SuperDash from "../pages/superAdmin/SuperDash";
import SuperEmployeeLeads from "../pages/superAdmin/SuperEmployeeLeads";
import SuperMainSocialMediaByProject from "../pages/superAdmin/SuperMainSocialMediaByProject";
import SuperAdminImportData from "../pages/superAdmin/SuperAdminImportData";
import SuperReports from "../pages/superAdmin/SuperReports";
import SuperDataExport from "../pages/superAdmin/SuperDataExport";
import SuperProjectDashBoard from "../pages/superAdmin/SuperProjectDashBoard";
import SuperAdEmployeemanagement from "../pages/superAdmin/SuperAdEmployeemanagement";
import SuperAdminAdminmanagement from "../pages/superAdmin/SuperAdminAdminmanagement";
import SuperAdminProfile from "../pages/superAdmin/SuperAdminProfile";
import SuperDashProject from "../pages/superAdmin/SuperDashProject";
import SuperAdminTotalLead from "../pages/superAdmin/SuperAdminTotalLead";
import SuperAdminVisit from "../pages/superAdmin/SuperAdminVisit";

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
        <Route
          path="/super-admin-total-lead"
          element={<SuperAdminTotalLead />}
        />
        <Route
          path="/super-admin-total-employee"
          element={<SuperAdminTotalEmployee />}
        />
        <Route
          path="/super-admin-close-data"
          element={<SuperAdminTotalClosedDeal />}
        />
        <Route
          path="/super-admin-employee-management"
          element={<SuperAdEmployeemanagement />}
        />
        <Route
          path="/super-admin-AdminManagement"
          element={<SuperAdminAdminmanagement />}
        />
        <Route
          path="/super-admin-employee-list"
          element={<SuperEmployeeList />}
        />
        <Route
          path="/super-admin-employee-leads"
          element={<SuperEmployeeLeads />}
        />

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
          element={<Super_view_visit_by_id />}
        />
        <Route path="/super_view_visit" element={<Super_view_visit />} />
        <Route
          path="/super_view_follow_up/:id"
          element={<Super_view_follow_by_id />}
        />
        <Route path="/super_view_follow_up" element={<Super_view_followup />} />
        <Route
          path="/super_view_remark/:id"
          element={<Super_view_remark_byid />}
        />

        <Route
          path="/super_view_employee_unit/:id"
          element={<Super_view_unit_byid />}
        />
        <Route path="/super_view_remarks" element={<Super_view_remarks />} />

        <Route
          path="/super-admin-employee-single/:employeeId"
          element={<EmployeeProfile />}
        />
        <Route
          path="/super-admin-admin-employe/:adminId"
          element={<AdminProfile />}
        />

        <Route path="/super-admin-profile" element={<SuperAdminProfile />} />
        <Route path="/super-admin-data-export" element={<SuperDataExport />} />
        <Route
          path="/main-social-media-super-admin-leads"
          element={<SuperMainSocialMediaByProject />}
        />
        <Route
          path="/social-media-superleads/:id"
          element={<SuperSocialMediaLeads />}
        />

        <Route
          path="/super-admin-project-dash"
          element={<SuperProjectDashBoard />}
        />
        <Route path="/super-admin-project-units/:id" element={<Superunits />} />
        <Route path="/Super-admin-project" element={<SuperDashProject />} />
        <Route
          path="/Super-admin-unit-Detail-Dash/:id"
          element={<SuperUnitsDetails />}
        />
        <Route
          path="/super-admin-Sold-Units"
          element={<SuperAdminSoldUnits />}
        />

        <Route
          path="/super-admin-import-data"
          element={<SuperAdminImportData />}
        />
      </Routes>
    </>
  );
}

export default SuperAdminRoutes;
