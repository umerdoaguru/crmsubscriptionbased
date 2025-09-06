import React from "react";

import { Navigate, Route, Routes } from "react-router-dom";
import { useSelector } from "react-redux";

import Registration from "../components/Registration";
import QuotationForm1 from "../pages/Quotation/QuotationForm1";
import CreateCompanyProfile from "../pages/Quotation/CreateCompanyProfile";

import UpdateCompanyData from "../pages/Quotation/UpdateCompanyData";
import DeleteCompanydata from "../pages/Quotation/DeleteCompanydata";

import Invoicelist from "../components/Invoice/Invoicelist";
import LeadData from "../components/DataExport/LeadData";
import QuotationData from "../components/DataExport/QuotationData";
import InvoiceData from "../components/DataExport/InvoiceData";
import Overview from "../adiComponent/Overview";
import UserProfile from "../adiComponent/userProfile";
import SingleOrganization from "../adiComponent/SingleOrganizaton";
import Reporting from "../adiComponent/Reporting";
import ServicenameList from "../pages/Quotation/ServicenameList";
import CreateServicelist from "../pages/Quotation/CreateServicelist";
import DeleteServiceName from "../pages/Quotation/DeleteServiceName";
import UpdateServiceList from "../pages/Quotation/UpdateServiceList";

import QuotationList from "../pages/Quotation/QuotationList";
import AdminQuotationVIew from "../pages/Quotation/AdminQuotationVIew";
import AdminInvoiceView from "../components/Invoice/AdminInvoiceView";
import TotalEmployee from "../components/AdminDashBoardCards/TotalEmployee";
import TotalQuotation from "../components/AdminDashBoardCards/TotalQuotation";
import TotalInvoice from "../components/AdminDashBoardCards/TotalInvoice";
import MainSocialLeads from "../components/SocialMediaLeads/MainSocialLeads";
import QuotationlistAdmin from "../components/AdminDashBoardCards/AdminQuotationlist/QuotationlistAdmin";
import Admin_view_quotations from "../components/Leads/Admin_view_quotations";
import Admin_QuotationView from "../components/Leads/Admin_QuotationView";
import Admin_RemarksView from "../components/Leads/Admin_RemarksView";
import AdminDashboard from "../pages/Admin/AdminDashboard";
import AdminLeads from "../pages/Admin/AdminLeads";
import MainSocialMediaByProject from "../pages/Admin/MainSocialMediaByProject";
import ImportLeadsAdmin from "../pages/Admin/ImportLeadsAdmin";
import AdminReport from "../pages/Admin/AdminReport";
import DataExport from "../pages/Admin/DataExport";
import ProjectDashBoard from "../pages/Admin/ProjectDashBoard";
import EmployeeManagement from "../pages/Admin/EmployeeManagement";
import DashProject from "../pages/Admin/DashProject";
import AdminTotalLead from "../pages/Admin/AdminTotalLead";
import TotalVisit from "../pages/Admin/TotalVisit";
import AdminTotalClosedDeal from "../pages/Admin/AdminTotalClosedDeal";
import EmployeesoldUnitCards from "../pages/Admin/EmployeesoldUnitCards";
import SingleLeadProfile from "../pages/Admin/SingleLeadProfile";
import SocialMediaLeads from "../pages/Admin/SocialMediaLeads";
import Units from "../pages/Admin/Units";
import UnitDetailDash from "../pages/Admin/UnitDetailDash";
import EmployeeSingle from "../pages/Admin/EmployeeSingle";
import AdminProfile from "../pages/Admin/AdminProfile";
import AdminViewVisit from "../pages/Admin/AdminViewVisit";
import AdminFollowUpView from "../pages/Admin/AdminFollowUpView";
import AdminViewAllUnitSold from "../pages/Admin/AdminViewAllUnitSold";

function AdminRoutes() {
  const user = useSelector((state) => state.auth.user);
  return (
    <>
      <Routes>
        {/* Admin routes */}
        <Route path="/" element={<AdminDashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/leads" element={<AdminLeads />} />
        <Route
          path="/main-social-media-leads"
          element={<MainSocialMediaByProject />}
        />
        <Route path="/admin-import-data" element={<ImportLeadsAdmin />} />
        <Route path="/admin-report" element={<AdminReport />} />
        <Route path="/data-export" element={<DataExport />} />
        <Route path="/Project-Dash" element={<ProjectDashBoard />} />
        <Route path="/employee-management" element={<EmployeeManagement />} />
        <Route path="/admin-profile" element={<AdminProfile />} />
        <Route path="/admin-project" element={<DashProject />} />
        <Route path="/admin-total-leads" element={<AdminTotalLead />} />
        <Route path="/admin-total-visit" element={<TotalVisit />} />
        <Route path="/admin-total-closed" element={<AdminTotalClosedDeal />} />
        <Route
          path="/employee-sold-units"
          element={<EmployeesoldUnitCards />}
        />
        <Route path="/lead-single-data/:id" element={<SingleLeadProfile />} />
        <Route path="/social-media-leads/:id" element={<SocialMediaLeads />} />
        <Route path="/project-units/:id" element={<Units />} />
        <Route
          path="/admin-unit-Detail-Dash/:id"
          element={<UnitDetailDash />}
        />
        <Route
          path="/employee-single/:employeeId"
          element={<EmployeeSingle />}
        />
        <Route path="/admin_view_visit/:id" element={<AdminViewVisit />} />
        <Route
          path="/admin_view_follow_up/:id"
          element={<AdminFollowUpView />}
        />
        <Route
          path="/admin_view_unit_sold/:id"
          element={<AdminViewAllUnitSold />}
        />

        {/* =========================================================================== */}

        {/* <Route path="/admincrmonerealty" element={<Registration />} />
        <Route path="/admin-total-employees" element={<TotalEmployee />} />
        <Route path="/quotation-form" element={<QuotationForm1 />} />
        <Route path="/quotation-section" element={<CreateCompanyProfile />} />
        <Route
          path="/admin-view-quotation/:id"
          element={<AdminQuotationVIew />}
        />
        <Route
          path="/admin_quotationview/:id"
          element={<Admin_QuotationView />}
        />
        <Route path="/admin-view-invoice/:id" element={<AdminInvoiceView />} />
        <Route path="/updatecompanydata" element={<UpdateCompanyData />} />
        <Route path="/deletecompanydata" element={<DeleteCompanydata />} />
        <Route path="/servicenamelist" element={<ServicenameList />} />
        <Route path="/create-servicelist" element={<CreateServicelist />} />
        <Route path="/delete-servicename" element={<DeleteServiceName />} />
        <Route path="/update-servicename" element={<UpdateServiceList />} />
        <Route path="/invoicelist" element={<Invoicelist />} />
        <Route path="/quotationlist" element={<QuotationList />} />
        <Route path="/lead-data" element={<LeadData />} />
        <Route path="/quotation-data" element={<QuotationData />} />
        <Route path="/invoice-data" element={<InvoiceData />} />
        <Route path="/overview" element={<Overview />} />
        <Route path="/edit-profile" element={<UserProfile />} />
        
       
        
        <Route path="/admin_view_remark/:id" element={<Admin_RemarksView />} />
        <Route
          path="/admin_view_quotations/:id"
          element={<Admin_view_quotations />}
        />
        <Route
          path="/singleOrganization/:id"
          element={<SingleOrganization />}
        />
        <Route path="/reporting" element={<Reporting />} /> */}
      </Routes>
    </>
  );
}

export default AdminRoutes;
