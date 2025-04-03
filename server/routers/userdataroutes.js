const express = require("express");
const multer = require("multer");
const router = express.Router();

// const {Register,Allregister, Login,} = require('../controllers/UserController');
const {
  Quotation,
  GetQuotation,
  Quotationviaid,
  GetServices,
  deleteQuotation,
  updateServices,
  Notes,
  getNotes,
  deleteNote,
  addServices,
  deleteService,
  getnotes_text,
  UpdateQuotationName,
  CopyQuotationData,
  GetQuotationName,
  updateNote,
  leads_data,
  createLead,
  getLeads,
  updateLead,
  deleteLead,
  employeeData,
  editProfile,
  getAllUsers,
  deleteProfile,
  getleadbyid,
  getAllQuotation,
  updateQuotationStatus,
  socialmediaLead,
  getLeadsVisit,
  getLeadsByIdVisit,
  quotationInformationForm,
  addProject,
  getAllProjects,
  deleteProject,
  editProject,
  addUnit,
  getUnits,
  getUnitById,
  getUnitsByProject,
  deleteUnit,
  updateUnit,
  updateUnitmanualy,
  getUnitsdistributeById,
  getUnitByProjectId,
  getUnitDetailsById,
  editUnitdetails,
} = require("../controllers/UserController");
const upload = require("../controllers/fileUploadController");
const upload1 = require("../config/multerConfig"); // Import multer configuration

const {
  fetchcompanyname,
  company_name_header_footer,
  deleteCompanydata,
  CompanyDataUpload,
  updateCompanyData,
  getCompanydata,
  getcompany_name_data,
} = require("../controllers/Company_Data_Controller");

const {
  register,
  login,
  employeelogin,
  adminLogin,
  sendOtp,
  verifyOtp,
  resetPassword,
  sendOtpEmployee,
  verifyOtpEmployee,
  resetPasswordEmployee,
  sendOtpAdmin,
  verifyOtpAdmin,
  resetPasswordAdmin,
  sendOtpSuperAdmin,
  verifyOtpSuperAdmin,
  resetPasswordSuperAdmin,
} = require("../controllers/UserRegitrationlLogin");

const {
  createServiceList,
  getServicelist,
  deleteServicename,
  updateServiceList,
  getServiceById,
} = require("../controllers/ServicesList");

const {
  createInvoice,
  getInvoice,
  deleteInvoice,
  UpdateInvoiceName,
  GetInvoiceName,
  invoiceserviceid,
  deleteServiceInvoice,
  addServicesInvoice,
  updateServicesInvoice,
  getInvoiceiddata,
  getInvoiceAddress,
  CompanyIncoiceData,
  fetchcompanyinvoicename,
  company_name_invoice_data,
  CopyInvoiceData,
  createNote,
  deleteInvoiceNote,
  getInvoiceNotes,
  createInvoiceNote,
  InvoiceNotes,
  InvoicegetNotes,
  InvoicedeleteNote,
  InvoiceupdateNote,
  UpdateInvoice_No,
  UpdateInvoice_date,
  UpdateInvoice_start_date,
  UpdateInvoice_end_date,
  getInvoiceDate,
  getAllInvoice,
} = require("../controllers/InvoiceController");
const authenticateEmployee = require("../Middleware/authenticateEmployee");
const authenticateAdmin = require("../Middleware/authenticateAdmin");
const { AllgetEmployeebyvisit, getEmployeeLeads, employeeProfile, getEmployeeFollow_Up, getEmployeeRemark, getEmployeeVisit, getLeadQuotation, getEmployeeUnitSold, getEmployeeUnitSoldById, getUnitDataByUnitId, getEmployeeUnitSoldByLeadId } = require("../controllers/employeController");
const authenticateSuperAdmin = require("../Middleware/authenticateSuperAdmin");
const { getAllEmployees } = require("../controllers/OrgsnizationActions");

router.post("/register", register);
router.post("/login", login);

router.post("/sendOtp-employee", sendOtpEmployee);
router.post("/verifyOtp-employee", verifyOtpEmployee);
router.put("/resetPassword-employee",resetPasswordEmployee);

router.post("/sendOtp-admin", sendOtpAdmin);
router.post("/verifyOtp-admin", verifyOtpAdmin);
router.put("/resetPassword-admin",resetPasswordAdmin);

router.post("/sendOtp-superadmin", sendOtpSuperAdmin);
router.post("/verifyOtp-superadmin", verifyOtpSuperAdmin);
router.put("/resetPassword-superadmin",resetPasswordSuperAdmin);

router.put("/quotation/:quotationId", updateServices);
router.post("/quotation", Quotation);
router.delete("/quotation/:id", deleteQuotation);
router.post("/services/:id", addServices);
router.delete("/services/:serviceId", deleteService);
router.get("/quotation/:id",authenticateEmployee, Quotationviaid);
// router.get("/quotation",GetQuotation);
router.get("/quotation-data",authenticateEmployee, GetQuotation,);

//Route to Quotation Information Form 
router.post("/quotation-information-form", quotationInformationForm)

// Route to update quotation status
router.post("/update-quotation-status", updateQuotationStatus);

router.put("/quotation-data/:quotationId", UpdateQuotationName);
router.post("/copy-quotation/:quotationId", CopyQuotationData);
router.get("/quotation-name/:quotationId", GetQuotationName);

router.get("/services", GetServices);

router.post("/notes", Notes);
router.get("/notes/:quotationId", getNotes);
router.delete("/notes/:noteId", deleteNote);
router.get("/notes_data", getnotes_text);
router.put("/notes", updateNote);

router.post(
  "/upload-company-profile",
  upload.fields([
    { name: "header_img" },
    { name: "footer_img" },
    { name: "logo" },
    { name: "digital_sign" },
  ]),
  CompanyDataUpload
); //ff
router.get("/header-footer-images/company-names", fetchcompanyname);
router.get("/company-data", getCompanydata); //hh
router.post("/company-header-footer", company_name_header_footer);
router.post("/companydata", deleteCompanydata);
router.put(
  "/companydata/:id",
  upload.fields([
    { name: "header_img" },
    { name: "footer_img" },
    { name: "logo" },
    { name: "digital_sign" },
  ]),
  updateCompanyData
); //ff
router.post("/company-name-data", getcompany_name_data); //fcf

router.post("/create-servicelist", createServiceList);
router.get("/servicelist", getServicelist);
router.get("/servicelist/:serviceId", getServiceById);
router.delete("/servicelist/:serviceId", deleteServicename);
router.put("/servicelist", updateServiceList);

router.post("/create-invoice", createInvoice);
router.get("/invoice-data", getInvoice);
router.get("/invoice-data-dash", getAllInvoice);
router.delete("/invoice/:id", deleteInvoice);
router.put("/invoice-data/:invoiceId", UpdateInvoiceName);

router.put("/invoice-no/:invoiceId", UpdateInvoice_No);
router.put("/invoice-date/:invoiceId", UpdateInvoice_date);
router.put("/invoice-start-date/:invoiceId", UpdateInvoice_start_date);
router.put("/invoice-end-date/:invoiceId", UpdateInvoice_end_date);

router.get("/invoice-date/:id", getInvoiceDate);

router.get("/invoice-name/:invoiceId", GetInvoiceName);
router.get("/invoice/:id", invoiceserviceid);
router.get("/invoice-address/:id", getInvoiceAddress);
router.delete("/invoice-service/:serviceId", deleteServiceInvoice);
router.post("/add-invoice-services/:id", addServicesInvoice);
router.put("/invoice/:invoiceId", updateServicesInvoice);
router.post(
  "/upload-invoice-profile",
  upload.fields([{ name: "logo" }]),
  CompanyIncoiceData
);
router.get("/company-invoice-names/:UserId", fetchcompanyinvoicename);
router.post("/company-invoice-data", company_name_invoice_data);
router.post("/copy-invoice/:invoiceId", CopyInvoiceData);

router.post("/invoice-notes", InvoiceNotes);
router.get("/invoice-get-notes/:invoiceId", InvoicegetNotes);
router.delete("/delete-notes/:noteId", InvoicedeleteNote);
router.put("/invoice-update-notes", InvoiceupdateNote);

router.post("/leads", createLead);
// router.post('/facebook-leads',  socialmediaLead);
router.get("/leads/:id",authenticateAdmin, getleadbyid);
router.get("/leads",authenticateAdmin, getLeads);
router.get("/leads-visits/:employeeId", getLeadsByIdVisit);
router.get("/leads-all-visits", getLeadsVisit);
router.put("/leads/:leadId", updateLead);
router.delete("/leads/:leadId", deleteLead);

router.get("/employee",authenticateAdmin, employeeData);
router.get("/employee-super-admin",authenticateSuperAdmin, employeeData);
router.get("/get-invoice-data", getAllInvoice);
router.get("/get-quotation-data", getAllQuotation);

// aditya routes

// Fetch all users
router.get("/getUser", getAllUsers);

// Edit profile with profile picture upload
router.post("/editProfile", upload1.single("profile_picture"), editProfile);
router.delete("/deleteUser", deleteProfile);
// Error handling middleware
router.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

router.post("/employee-login", employeelogin);
router.post("/admin-login", adminLogin);

router.post("/employee-login", employeelogin);
router.post("/admin-login", adminLogin);
router.get("/quotation-data-admin",authenticateAdmin, GetQuotation,);
router.get("/quotation-admin/:id",authenticateAdmin, Quotationviaid);
router.get("/employe-all-visit-admin",authenticateAdmin, AllgetEmployeebyvisit);
router.get("/employe-leads-admin/:id",authenticateAdmin, getEmployeeLeads);
router.get("/employe-follow-up-admin/:id",authenticateAdmin, getEmployeeFollow_Up);
router.get("/remarks-admin/:id",authenticateAdmin, getEmployeeRemark);
router.get("/employe-visit-admin/:id",authenticateAdmin, getEmployeeVisit);
router.get("/get-quotation-byLead-admin/:id",authenticateAdmin, getLeadQuotation);


router.get("/leads-super-admin",authenticateSuperAdmin, getLeads);
router.get("/employe-all-visit-super-admin",authenticateSuperAdmin, AllgetEmployeebyvisit);
router.get("/quotation-data-super-admin",authenticateSuperAdmin, GetQuotation,);
router.get("/quotation-super-admin/:id",authenticateSuperAdmin, Quotationviaid);
router.get("/getAllEmployees-super-admin",authenticateSuperAdmin, getAllEmployees);
router.get("/employe-leads-super-admin/:id",authenticateSuperAdmin, getEmployeeLeads);
router.get("/employeeProfile-super-admin/:id",authenticateSuperAdmin, employeeProfile);
router.get("/employee-super-admin",authenticateSuperAdmin, employeeData);
router.get("/employe-follow-up-super-admin/:id",authenticateSuperAdmin, getEmployeeFollow_Up);
router.get("/remarks-super-admin/:id",authenticateSuperAdmin, getEmployeeRemark);
router.get("/leads-super-admin/:id",authenticateSuperAdmin, getleadbyid);

router.get("/employe-visit-super-admin/:id",authenticateSuperAdmin, getEmployeeVisit);
router.get("/get-quotation-byLead-super-admin/:id",authenticateSuperAdmin, getLeadQuotation);

// Project Related routes
router.post("/project-add", addProject);
router.get("/all-project",authenticateAdmin, getAllProjects);
router.delete("/delete-project/:id", deleteProject);
router.put("/edit-project/:id", editProject);

router.post("/add-unit", addUnit);
router.get('/units',authenticateAdmin, getUnits);
router.get('/units/:id',authenticateAdmin, getUnitById);
router.get('/getUnitsdistributeById/:id',authenticateAdmin, getUnitsdistributeById);
router.get('/units/project',authenticateAdmin, getUnitsByProject);
router.delete("/delete-unit/:id", deleteUnit);
router.put("/edit-unit/:id", updateUnit);
router.put('/updateUnitmanualy/:unit_id', updateUnitmanualy);
router.get('/project-unit/:id',authenticateAdmin, getUnitByProjectId);
router.get('/getUntitsDetailById/:id',authenticateAdmin, getUnitDetailsById);
router.put('/editUnitdetailsinner/:id', editUnitdetails);

router.get("/admin-unit-sold",authenticateAdmin, getEmployeeUnitSold);
router.get("/admin-unit-sold/:id",authenticateAdmin, getEmployeeUnitSoldById);
router.get("/admin-unit-data/:id",authenticateAdmin, getUnitDataByUnitId);
router.get("/admin-unit-sold-lead-id/:id",authenticateAdmin, getEmployeeUnitSoldByLeadId);

router.get("/super-admin-all-project",authenticateSuperAdmin, getAllProjects);
router.get('/super-admin-units',authenticateSuperAdmin, getUnits);
router.get('/super-admin-units/:id',authenticateSuperAdmin, getUnitById);
router.get('/super-admin-getUnitsdistributeById/:id',authenticateSuperAdmin, getUnitsdistributeById);
router.get('/super-admin-units/project',authenticateSuperAdmin, getUnitsByProject);
router.get('/super-admin-project-unit/:id',authenticateSuperAdmin, getUnitByProjectId);
router.get('/super-admin-getUntitsDetailById/:id',authenticateSuperAdmin, getUnitDetailsById);

router.get("/super-admin-unit-sold",authenticateSuperAdmin, getEmployeeUnitSold);
router.get("/super-admin-unit-sold/:id",authenticateSuperAdmin, getEmployeeUnitSoldById);
router.get("/super-admin-unit-data/:id",authenticateSuperAdmin, getUnitDataByUnitId);
router.get("/super-admin-unit-sold-lead-id/:id",authenticateSuperAdmin, getEmployeeUnitSoldByLeadId);
          
module.exports = router;
