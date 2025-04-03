import React from "react";

import { Navigate, Route, Routes } from "react-router-dom";
import { useSelector } from "react-redux";

import QuotationForm1 from "../pages/Quotation/QuotationForm1";

import Final_quotation from "../pages/Quotation/Final_quotation";
import QuotationList from "../pages/Quotation/QuotationList";
import Print_Page from "../pages/Quotation/Print_Page";
import Addservices from "../pages/Quotation/AddServices";
import CreateNotes from "../pages/Quotation/CreateNotes";
import DeleteNotes from "../pages/Quotation/DeleteNotes";
import UpdateNotes from "../pages/Quotation/UpdateNotes";
import Reviews from "../pages/Quotation/Reviews";
import UpdateCompanyData from "../pages/Quotation/UpdateCompanyData";
import DeleteCompanydata from "../pages/Quotation/DeleteCompanydata";
import UpdateQuotationName from "../pages/Quotation/UpdateQuotationName";
import CreateInvoice from "../components/Invoice/CreateInvoice";
import FinalInvoice from "../components/Invoice/FinalInvoice";
import Invoicelist from "../components/Invoice/Invoicelist";
import EditInvoiceName from "../components/Invoice/EditInvoiceName";
import PrintInvoice from "../components/Invoice/PrintInvoice";
import EditInvoice_no from "../components/Invoice/EditInvoiceData/EditInvoice_no";
import EditInvoice_date from "../components/Invoice/EditInvoiceData/EditInvoice_date";
import EditInvoice_start_date from "../components/Invoice/EditInvoiceData/EditInvoice_start_date";
import EditInvoice_end_date from "../components/Invoice/EditInvoiceData/EditInvoice_end_date";
import CreateInvoiceNotes from "../components/Invoice/CreateInvoiceNotes";
import DeleteInvoiceNotes from "../components/Invoice/DeleteInvoiceNotes";
import UpdateInvoiceNotes from "../components/Invoice/UpdateInvoiceNotes";
import AddInvoiceServices from "../components/Invoice/AddInvoiceServices";
import QuotationInvoice from "../components/Invoice/QuotationInvoice";

import Dashboard from "../adiComponent/Dashboard";
import Overview from "../adiComponent/Overview";
import UserProfile from "../adiComponent/userProfile";
import EmployeeManagement from "../adiComponent/EmployManagement";
import EmployeeSingle from "../adiComponent/EmployeSingle";
import SingleOrganization from "../adiComponent/SingleOrganizaton";
import Reporting from "../adiComponent/Reporting";
import Single_Lead_Profile from "../components/Leads/Single_Lead_Profile";
import Landingpage from "../pages/Landingpage";

import EmployeeDashboard from "../components/EmployeeModule/EmployeeDashboard";
import EmployeeLogin from "../components/EmployeeModule/EmployeeLogin";
import EmployeeLead from "../components/EmployeeModule/EmployeeLead";
import EmployeeReport from "../components/EmployeeModule/EmployeeReport";
import EmployeeDataExport from "../components/EmployeeModule/EmployeeDataExport";
import EmployeeQuotationData from "../components/EmployeeModule/EmployeeDataExport/EmployeeQuotationData";
import EmployeeProfile from "../components/EmployeeModule/EmployeeProfile";
import MainQuotation from "../components/EmployeeModule/QuotationEmployee&Invoice/MainQuotationPage";
import TotalEmpLead from "../components/EmployeeModule/EmployeeDashboardCards/AdminDashBoardCards/TotalEmpLead";
import TotalEmployee from "../components/AdminDashBoardCards/TotalEmployee";
import TotalEmpInvoice from "../components/EmployeeModule/EmployeeDashboardCards/AdminDashBoardCards/TotalEmpInvoice";
import TotalEmpQuotation from "../components/EmployeeModule/EmployeeDashboardCards/AdminDashBoardCards/TotalEmpQuotation";
import Leads from "../pages/Leads";
import Employee_Single_Lead_Profile from "../components/Leads/Employee_Single_Lead_Profile";
import QuotationByLeads from "../components/EmployeeModule/QuotationByLeads/QuotationByLeads";
import PrintQuotationBylead from "../components/EmployeeModule/QuotationByLeads/PrintQuotationBylead";
import AddServiceByLead from "./../components/EmployeeModule/QuotationByLeads/AddServiceBylead";
import CreateNotesBylead from "./../components/EmployeeModule/QuotationByLeads/CreateNotesBylead";
import DeleteNoteBylead from "./../components/EmployeeModule/QuotationByLeads/DeleteNoteBylead";
import UpdateNoteBylead from "./../components/EmployeeModule/QuotationByLeads/UpdateNoteBylead";
import FinalQuotationByLeads from "./../components/EmployeeModule/QuotationByLeads/FinalQuotationByLead";
import EmployeeVisitData from "../components/EmployeeModule/EmployeeDataExport/EmployeeVisitData";
import VisitTable from "../components/EmployeeModule/VisitTable";
import CloseTable from "../components/EmployeeModule/CloseTable";
import ViewAllQuotationsByLead from "../components/Leads/ViewAllQuotationsByLead";
import Final_quotationBy_emp from "../pages/Quotation/Final_quotationBy_emp";
import QuotationInputForm from "../components/EmployeeModule/QuotationByLeads/QuotationInputForm";
import ViewAllVisit from "../components/Leads/ViewAllVisit";
import Final_Quotation_All from "../pages/Quotation/Final_Quotation_All";
import ViewAllFollowUp from "../components/Leads/ViewAllFollowUp";
import ViewAllRemark from "../components/Leads/ViewAllRemark";
import ViewAllUnitSold from "../components/Leads/ViewAllUnitSold";
import Employeesoldunit from "../components/EmployeeModule/employeesoldunits";

function EmployeeRoutes() {
  const user = useSelector((state) => state.auth.user);

  return (
    <> 
      <div style={{ overflow: "hidden" }}>
        <Routes>
          {/* Admin routes */}

          {/* <Route path="/leads" element={  <Leads/>} /> */}

          <Route path="/" element={<EmployeeDashboard />} />
          <Route path="/employees-dashboard" element={<EmployeeDashboard />} />

          <Route path="/employees-total-leads" element={<TotalEmpLead />} />
          <Route path="/employees-visit-data" element={<EmployeeVisitData />} />
          {/* <Route path="/employees-visit-data" element={<EmployeeVisitData />} /> */}
          <Route path="/visit-data" element={<VisitTable />} />
          <Route path="/employee-sold" element={<Employeesoldunit/>} />
          <Route path="/close-data" element={<CloseTable />} />
          <Route
            path="/employees-total-quotations"
            element={<TotalEmpQuotation />}
          />
          <Route
            path="/employees-total-invoices"
            element={<TotalEmpInvoice />}
          />

          <Route path="/quotation-form" element={<QuotationForm1 />} />
          {/* Input Form details  */}
          <Route path="/quotation-information-form" element={<QuotationInputForm />} />

          <Route path="/final-quotation/:id" element={<Final_quotation />} />
          <Route path="/final-quotationBy-emp/:leadId/:id" element={<Final_quotationBy_emp />} />
          <Route path="/final-quotationBy-emp/:id" element={<Final_Quotation_All />} />
         

          <Route path="/print/:id" element={<Print_Page />} />

          <Route path="/addservices/:id" element={<Addservices />} />
          <Route path="/createnotes/:id" element={<CreateNotes />} />
          <Route path="/deletenotes/:id" element={<DeleteNotes />} />
          <Route path="/update-notes/:id" element={<UpdateNotes />} />
          <Route path="/review/:id" element={<Reviews />} />
          <Route path="/updatecompanydata" element={<UpdateCompanyData />} />
          <Route path="/deletecompanydata" element={<DeleteCompanydata />} />
          <Route
            path="/update-quotation-name/:id"
            element={<UpdateQuotationName />}
          />

          <Route path="/create-invoice" element={<CreateInvoice />} />
          <Route path="/final-invoice/:id" element={<FinalInvoice />} />
          <Route path="/invoicelist" element={<Invoicelist />} />
          <Route
            path="/update-invoice-name/:id"
            element={<EditInvoiceName />}
          />
          <Route path="/print-invoice/:id" element={<PrintInvoice />} />
          <Route
            path="/addservicesinvoice/:id"
            element={<AddInvoiceServices />}
          />

          <Route
            path="/update-invoice-number/:id"
            element={<EditInvoice_no />}
          />
          <Route
            path="/update-invoice-date/:id"
            element={<EditInvoice_date />}
          />
          <Route
            path="/update-invoice-start-date/:id"
            element={<EditInvoice_start_date />}
          />
          <Route
            path="/update-invoice-end-date/:id"
            element={<EditInvoice_end_date />}
          />

          <Route
            path="/invoicecreatenotes/:id"
            element={<CreateInvoiceNotes />}
          />
          <Route
            path="/invoicedeletenotes/:id"
            element={<DeleteInvoiceNotes />}
          />
          <Route
            path="/invoice-update-notes/:id"
            element={<UpdateInvoiceNotes />}
          />

          <Route path="/quotation-invoice/:id" element={<QuotationInvoice />} />

          <Route
            path="/employee-lead-single-data/:id"
            element={<Employee_Single_Lead_Profile />}
          />
          <Route
            path="/View_quotations/:id"
            element={<ViewAllQuotationsByLead />}
          />
          <Route
            path="/view_visit/:id"
            element={<ViewAllVisit />}
          />
          <Route
            path="/view_follow_up/:id"
            element={<ViewAllFollowUp />}
          />
          <Route
            path="/view_unit_sold/:id"
            element={<ViewAllUnitSold />}
          />
          <Route
            path="/view_remark/:id"
            element={<ViewAllRemark />}
          />

          <Route path="/overview" element={<Overview />} />

          <Route path="/edit-profile" element={<UserProfile />} />
          {/* <Route path="/employee-management" element={<EmployeeManagement />} /> */}
          <Route
            path="/employee-single/:employeeId"
            element={<EmployeeSingle />}
          />
          <Route
            path="/singleOrganization/:id"
            element={<SingleOrganization />}
          />
          <Route path="/reporting" element={<Reporting />} />

          {/* employees routes */}
          <Route path="/employee-leads" element={<EmployeeLead />} />
          <Route path="/employee-report" element={<EmployeeReport />} />
          <Route
            path="/employee-data-export"
            element={<EmployeeDataExport />}
          />
          <Route path="/employee-all-quotation" element={<MainQuotation />}/>
          <Route path="/employee-profile" element={<EmployeeProfile />} />
          <Route path="/quotation-by-lead/:id" element={<QuotationByLeads />} />
          <Route
            path="/final-quotation-by-lead/:id"
            element={<FinalQuotationByLeads />}
          />

          <Route
            path="/quotationprint-by-lead/:id"
            element={<PrintQuotationBylead />}
          />

          <Route
            path="/quotationaddservices-by-lead/:id"
            element={<AddServiceByLead />}
          />
          <Route
            path="/quotationcreatenotes-by-lead/:id"
            element={<CreateNotesBylead />}
          />
          <Route
            path="/quotationdeletenotes-by-lead/:id"
            element={<DeleteNoteBylead />}
          />
          <Route
            path="/quotationupdatenotes-by-lead/:id"
            element={<UpdateNoteBylead />}
          />
        </Routes>
      </div>
    </>
  );
}

export default EmployeeRoutes;
