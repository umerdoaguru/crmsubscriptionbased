const express = require('express');
const { saveForm, getAllForms, fetchLeads, getLeadsByFormId, updateForm, deleteForm, getByProjectIdForms } = require('../controllers/FacebookController');
const authenticateAdmin = require('../Middleware/authenticateAdmin');
const authenticateSuperAdmin = require('../Middleware/authenticateSuperAdmin');
const router = express.Router();


// Routes for form operations
router.post('/forms', saveForm);
router.put('/updateform', updateForm);
router.delete('/deleteform/:id', deleteForm);
router.post('/forms', saveForm);
router.get('/forms', getAllForms);
router.get('/forms/:id', getByProjectIdForms);

// Route to fetch leads from Meta API
router.post('/leads/fetch', fetchLeads);

// Route to fetch leads by form ID
router.get('/Leads-data-fetch-admin/:formId', authenticateAdmin,getLeadsByFormId);
router.get('/Leads-data-fetch-super-admin/:formId',authenticateSuperAdmin, getLeadsByFormId);

module.exports = router;
