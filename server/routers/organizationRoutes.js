const express = require("express");
const multer = require("multer");
const router = express.Router();
const upload = require("../config/multerConfig");
const {
  addOrganization,
  deleteOrganization,
  updateOrganization,
  getAllOrganizations,
  addEmployee,
  getAllEmployees,
  updateEmployee,
  deleteEmployee,
  getEmployeeById,
  updateSingleEmployee,
  getOrganizationById,
  employeelogin,
  addAdmin,
  getAllAdmins,
  getAdminById,
  updateAdmin,
  deleteAdmin,
} = require("../controllers/OrgsnizationActions");
const authenticateAdmin = require("../Middleware/authenticateAdmin");
const authenticateSuperAdmin = require("../Middleware/authenticateSuperAdmin");

// Route to add an organization (with file upload)
router.post(
  "/addOrganization",
  upload.fields([{ name: "signature" }, { name: "logo" }]),
  addOrganization
);

// Route to get all organizations
router.get("/getOrganization", getAllOrganizations);

// Route to get a single organization by ID (added this route)
router.get("/getOrganization/:id", getOrganizationById);

// Route to delete an organization by ID
router.delete("/deleteOrganization/:id", deleteOrganization);

// Route to update an organization by companyId (with file upload)
router.put(
  "/updateOrganization/:companyId",
  upload.fields([{ name: "signature" }, { name: "logo" }]),
  updateOrganization
);

// Route to add an employee
router.post("/addEmployee", addEmployee);

// Route to get all employees
router.get("/getAllEmployees",authenticateAdmin, getAllEmployees);

// Route to get an employee by ID
router.get("/getEmployeeById/:employeeId",authenticateAdmin, getEmployeeById);

// Route to update an employee by ID
router.put("/updateEmployee/:id", updateEmployee);

// Route to update a single employee by ID (with file upload)
router.put(
  "/updateSingleEmployee/:id",
  upload.fields([{ name: "signature" }, { name: "photo" }]),
  updateSingleEmployee
);

// Route to delete an employee by ID
router.delete("/deleteEmployee/:id", deleteEmployee);
// Route to add an admin
router.post("/addAdmin", addAdmin);

// Route to get all admins
router.get("/getAllAdmins",authenticateSuperAdmin, getAllAdmins);

// Route to get an admin by ID
router.get("/getAdminById/:adminId", getAdminById);

// Route to update an admin by ID
router.put("/updateAdmin/:admin_id", updateAdmin);

// Route to delete an admin by ID
router.delete("/deleteAdmin/:admin_id", deleteAdmin);

// Route to get all admins
router.get("/getAllAdmins", getAllAdmins);

// Route to update an admin by ID
router.put("/updateAdmin/:admin_id", updateAdmin);

// Route to delete an admin by ID
router.delete("/deleteAdmin/:admin_id", deleteAdmin);

module.exports = router;
