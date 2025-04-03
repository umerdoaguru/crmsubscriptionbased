const express = require("express");
const multer = require("multer");
const {  getResponses } = require("../controllers/99AcresController");
const authenticateSuperAdmin = require("../Middleware/authenticateSuperAdmin");
const authenticateAdmin = require("../Middleware/authenticateAdmin");
const router = express.Router();




  router.get("/get-responses-admin",authenticateAdmin,getResponses);
  router.get("/get-responses-super-admin",authenticateSuperAdmin,getResponses);



  module.exports = router;