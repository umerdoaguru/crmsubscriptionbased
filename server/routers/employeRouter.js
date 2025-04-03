const express = require("express");
const multer = require("multer");
const {
  getEmployeeInvoice,
  employeeProfile,
  getEmployeeLeads,
  updateLeadStatus,
  getEmployeeQuotation,
  updateOnlyLeadStatus,
  updateOnlyQuotationStatus,
  getAllEmployeeTotalLeads,
  getLeadQuotation,
  getEmployeeVisit,
  createVisit,
  updateVisit,
  deleteVisit,
  getEmployeebyidvisit,
  AllgetEmployeebyvisit,
  updateOnlyVisitStatus,
  updateFollow_Up,
  deleteFollow_Up,
  createFollow_Up,
  getEmployeeFollow_Up,
  updateOnlyFollowUpStatus,createRemark,updateRemark,deleteRemark,getEmployeeRemark,
  updateOnlyRemarkStatus,
  updateOnlyRemarkAnswer,
  updateOnlyRemarkAnswerStatus,
  createEmployeeUnitSold,
  updateEmployeeUnitSold,
  deleteEmployeeUnitSold,
  getEmployeeUnitSold,
  getEmployeeUnitSoldById,
  getUnitDataByUnitId,
  updateOnlyUnitDataStatusById,
  updateOnlyUnitStatus,
  getEmployeeUnitSoldByLeadId
} = require("../controllers/employeController");
const authenticateEmployee = require("../Middleware/authenticateEmployee");
const { getleadbyid } = require("../controllers/UserController");
const router = express.Router();

router.get("/get-employee-invoice/:id",authenticateEmployee, getEmployeeInvoice);
router.get("/employeeProfile/:id",authenticateEmployee, employeeProfile);
router.get("/employe-leads/:id",authenticateEmployee, getEmployeeLeads);
router.get("/employebyid-visit/:id",authenticateEmployee, getEmployeebyidvisit);
router.get("/employe-all-visit",authenticateEmployee, AllgetEmployeebyvisit);
router.put("/updateVisitStatus/:id", updateOnlyVisitStatus);

router.get("/employe-visit/:id",authenticateEmployee, getEmployeeVisit);
router.put('/employe-visit', updateVisit);           
router.delete('/employe-visit/:id', deleteVisit); 
router.post("/employe-visit", createVisit);

router.get("/employe-follow-up/:id",authenticateEmployee, getEmployeeFollow_Up);
router.put('/employe-follow-up', updateFollow_Up);           
router.delete('/employe-follow-up/:id', deleteFollow_Up); 
router.post("/employe-follow-up", createFollow_Up);
router.put("/updateOnlyFollowUpStatus/:id", updateOnlyFollowUpStatus);



router.put("/updateLeadStatus/:id", updateLeadStatus);
router.put("/updateOnlyLeadStatus/:id", updateOnlyLeadStatus);
router.put("/updateOnlyQuotationStatus/:id", updateOnlyQuotationStatus);
router.get("/get-quotation-byEmploye/:id",authenticateEmployee, getEmployeeQuotation);
router.get("/get-quotation-byLead/:id",authenticateEmployee, getLeadQuotation);
router.get("/getAllEmployee-Toal-lead",authenticateEmployee, getAllEmployeeTotalLeads);





router.post("/remarks", createRemark);


router.put("/remarks", updateRemark);


router.delete("/remarks/:id", deleteRemark);


router.get("/remarks/:id",authenticateEmployee, getEmployeeRemark);

router.put("/updateOnlyRemarkStatus/:id", updateOnlyRemarkStatus);
router.put("/updateOnlyRemarkAnswerStatus/:id", updateOnlyRemarkAnswerStatus);
router.put("/updateOnlyAnswerRemark", updateOnlyRemarkAnswer);
router.get("/leads-employee/:id",authenticateEmployee, getleadbyid);


router.post("/unit-sold", createEmployeeUnitSold);
router.put("/unit-sold", updateEmployeeUnitSold);
router.delete("/unit-sold/:id", deleteEmployeeUnitSold);
router.get("/unit-sold", getEmployeeUnitSold);
router.get("/unit-sold/:id",authenticateEmployee, getEmployeeUnitSoldById);
router.get("/unit-sold-lead-id/:id",authenticateEmployee, getEmployeeUnitSoldByLeadId);

router.get("/unit-data/:id",authenticateEmployee, getUnitDataByUnitId);
router.put("/unit-data/:id", updateOnlyUnitDataStatusById);

router.put("/updateOnlyUnitStatus/:id", updateOnlyUnitStatus);





module.exports = router;
