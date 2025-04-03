const express = require('express');
const router = express.Router();
const upload = require('../config/multerConfig');

// Import the controller functions
const {
    createContract, getAllContracts, getContractById, updateContract, deleteContract,
    createClient, getAllClients, getClientById, updateClient, deleteClient,
    createInvoice, getAllInvoices, getInvoiceById, updateInvoice, deleteInvoice,
    createPayment, getAllPayments, getPaymentById, updatePayment, deletePayment,
    createLead, getAllLeads, getLeadById, updateLead, deleteLead,
    getOverviewMetrics, getPaymentsData, getLeadsData, getToDoList,
    addToDoItem, deleteToDoItem, updateToDoItem, getDevicesData, getToDoById, addDeviceUsage
} = require('../controllers/dashboard');

// Contract Routes
// router.route('/contracts')
//     .post(createContract)
//     .get(getAllContracts);

// router.route('/contracts/:id')
//     .get(getContractById)
//     .put(updateContract)
//     .delete(deleteContract);

// // Client Routes
// router.route('/clients')
//     .post(createClient)
//     .get(getAllClients);

// router.route('/clients/:id')
//     .get(getClientById)
//     .put(updateClient)
//     .delete(deleteClient);

// // Invoice Routes
// router.route('/invoices')
//     .post(createInvoice)
//     .get(getAllInvoices);

// router.route('/invoices/:id')
//     .get(getInvoiceById)
//     .put(updateInvoice)
//     .delete(deleteInvoice);

// // Payment Routes
// router.route('/payments')
//     .post(createPayment)
//     .get(getAllPayments);

// router.route('/payments/:id')
//     .get(getPaymentById)
//     .put(updatePayment)
//     .delete(deletePayment);

// // Lead Routes
// router.route('/leads')
//     .post(createLead)
//     .get(getAllLeads);

// router.route('/leads/:id')
//     .get(getLeadById)
//     .put(updateLead)
//     .delete(deleteLead);

// Overview Metrics Route
// router.get('/overview-metrics', getOverviewMetrics);

// // Payment Data Route
// router.get('/payments-data', getPaymentsData);

// // Leads Data Route
// router.get('/leads-data', getLeadsData);

// // To-Do List Routes
// router.route('/todo-list')
//     .get(getToDoList)
//     .post(addToDoItem);

// router.route('/todo-list/:id')
//     .get(getToDoById)        
//     .delete(deleteToDoItem)
//     .put(updateToDoItem);

// // Devices Data Routes
// router.route('/devices-data')
//     .get(getDevicesData);  

// router.route('/device-usage')
//     .post(addDeviceUsage);  

module.exports = router;
