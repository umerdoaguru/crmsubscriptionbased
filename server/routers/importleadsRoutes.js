// routes/leads.js
const express = require("express");
const multer = require("multer");
const { importLeads } = require("../controllers/ImportDataLeads");


const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

// POST: /api/leads/import
router.post("/import-leads", upload.single("file"), importLeads);


module.exports = router;
