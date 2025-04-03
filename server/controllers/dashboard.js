const express = require("express");
const { db } = require("../db");
const path = require('path');



const getOverviewMetrics = async (req, res) => {
    try {
        const query = `
            SELECT
                (SELECT COUNT(*) FROM clients) AS clientsAdded,
                (SELECT COUNT(*) FROM contracts WHERE status = 'signed') AS contractsSigned,
                (SELECT COUNT(*) FROM invoices) AS invoicesSent
        `;
        db.query(query, (err, results) => {
            if (err) {
                console.error('Error fetching overview metrics:', err);
                return res.status(500).json({ error: 'Internal server error' });
            }
            res.status(200).json(results[0]);
        });
    } catch (error) {
        console.error('Error in getOverviewMetrics:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getPaymentsData = async (req, res) => {
    try {
        const query = `
            SELECT
                month,
                SUM(received_amount) AS receivedAmount,
                SUM(due_amount) AS dueAmount
            FROM payments
            GROUP BY month
        `;
        db.query(query, (err, results) => {
            if (err) {
                console.error('Error fetching payments data:', err);
                return res.status(500).json({ error: 'Internal server error' });
            }
            res.status(200).json(results);
        });
    } catch (error) {
        console.error('Error in getPaymentsData:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getDevicesData = async (req, res) => {
    try {
        const query = `
            SELECT
                device_type,
                COUNT(*) AS count
            FROM device_usage
            GROUP BY device_type
        `;
        db.query(query, (err, results) => {
            if (err) {
                console.error('Error fetching devices data:', err);
                return res.status(500).json({ error: 'Internal server error' });
            }
            res.status(200).json(results);
        });
    } catch (error) {
        console.error('Error in getDevicesData:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const addDeviceUsage = async (req, res) => {
    const { device_type } = req.body;

    // Check if the device_type is provided
    if (!device_type) {
        return res.status(400).json({ error: 'Device type is required' });
    }

    // Insert the device usage data into the database
    const query = 'INSERT INTO device_usage (device_type) VALUES (?)';

    try {
        // Execute the query to insert the device type
        await db.query(query, [device_type], (err, result) => {
            if (err) {
                console.error('Error inserting device usage:', err);
                return res.status(500).json({ error: 'Internal server error' });
            }
            // Success response
            res.status(201).json({ success: true, message: 'Device usage recorded successfully' });
        });
    } catch (error) {
        console.error('Error in addDeviceUsage:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
// controllers/dashboard.js

exports.recordDeviceUsage = async (req, res) => {
    const { device_type } = req.body;
    try {
        // Record device usage logic here
        // For example, increment the count in your database

        // Respond with success message
        res.json({
            success: true,
            message: 'Device usage recorded successfully',
        });
    } catch (error) {
        console.error('Error recording device usage:', error);
        res.status(500).json({
            success: false,
            message: 'Error recording device usage',
        });
    }
};

const getLeadsData = async (req, res) => {
    try {
        const query = `
            SELECT name, email, status, duration, date
            FROM leads
        `;
        db.query(query, (err, results) => {
            if (err) {
                console.error('Error fetching leads data:', err);
                return res.status(500).json({ error: 'Internal server error' });
            }
            res.status(200).json(results);
        });
    } catch (error) {
        console.error('Error in getLeadsData:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getToDoList = (req, res) => {
    const query = `
        SELECT title, time, date, status
        FROM todo_items
    `;
    
    db.query(query, (err, results) => {
        if (err) {
            // Log the error and respond with a 500 status code
            console.error('Error fetching to-do list:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }

        // Respond with the results if the query is successful
        res.status(200).json(results);
    });
};

const getToDoById = (req, res) => {
    // Extract the ID from the request parameters
    const { id } = req.params;

    // Validate that the ID is a valid number (you can add more validation if needed)
    if (!id || isNaN(id)) {
        return res.status(400).json({ error: 'Invalid ID format' });
    }

    // SQL query to fetch a specific to-do item by ID
    const query = `
        SELECT title, time, date, status
        FROM todo_items
        WHERE id = ?
    `;
    
    // Execute the query with the ID parameter
    db.query(query, [id], (err, results) => {
        if (err) {
            // Log the error and respond with a 500 status code
            console.error('Error fetching to-do item by ID:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }

        // Check if the result is empty
        if (results.length === 0) {
            return res.status(404).json({ error: 'To-do item not found' });
        }

        // Respond with the result if the query is successful
        res.status(200).json(results[0]);
    });
};

const addToDoItem = (req, res) => {
    const { title, time, date, status } = req.body;

    // Basic validation
    if (!title || !time || !date || typeof status === 'undefined') {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const query = `
        INSERT INTO todo_items (title, time, date, status)
        VALUES (?, ?, ?, ?)
    `;
    
    db.query(query, [title, time, date, status], (err, results) => {
        if (err) {
            console.error('Error adding to-do item:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }

        res.status(201).json({ message: 'To-do item added successfully', id: results.insertId });
    });
};

const deleteToDoItem = (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ error: 'Missing item ID' });
    }

    const query = `
        DELETE FROM todo_items
        WHERE id = ?
    `;
    
    db.query(query, [id], (err, results) => {
        if (err) {
            console.error('Error deleting to-do item:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'To-do item not found' });
        }

        res.status(200).json({ message: 'To-do item deleted successfully' });
    });
};

const updateToDoItem = (req, res) => {
    const { id } = req.params;
    const { title, time, date, status } = req.body;

    if (!id || (title === undefined && time === undefined && date === undefined && status === undefined)) {
        return res.status(400).json({ error: 'Missing item ID or fields to update' });
    }

    // Build the SET clause dynamically
    const setClause = [];
    const values = [];

    if (title !== undefined) {
        setClause.push('title = ?');
        values.push(title);
    }
    if (time !== undefined) {
        setClause.push('time = ?');
        values.push(time);
    }
    if (date !== undefined) {
        setClause.push('date = ?');
        values.push(date);
    }
    if (status !== undefined) {
        setClause.push('status = ?');
        values.push(status);
    }

    values.push(id); // Add the ID to the end for the WHERE clause

    const query = `
        UPDATE todo_items
        SET ${setClause.join(', ')}
        WHERE id = ?
    `;
    
    db.query(query, values, (err, results) => {
        if (err) {
            console.error('Error updating to-do item:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'To-do item not found' });
        }

        res.status(200).json({ message: 'To-do item updated successfully' });
    });
};

// Create a new client
const createClient = async (req, res) => {
    const { name, email } = req.body;
    const query = 'INSERT INTO clients (name, email) VALUES (?, ?)';
    try {
        await db.query(query, [name, email]);
        res.status(201).json({ success: true, message: 'Client added successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Get all clients
const getAllClients = async (req, res) => {
    try {
      // Query to select all clients
      const getAllClientsQuery = "SELECT * FROM clients";
  
      db.query(getAllClientsQuery, (err, result) => {
        if (err) {
          console.error("Error fetching clients from MySQL:", err);
          return res.status(500).json({ success: false, message: "Internal server error" });
        }
  
        if (result.length === 0) {
          return res.status(404).json({ success: false, message: "No clients found" });
        }
  
        // If you need to process the results further, you can do it here
  
        // Return the list of clients
        return res.status(200).json({
          success: true,
          clients: result,
        });
      });
    } catch (error) {
      console.error("Error in fetching clients:", error);
      res.status(500).json({
        success: false,
        message: "Error in fetching clients",
        error: error.message,
      });
    }
  };
  
// Get a single client by ID
const getClientById = async (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM clients WHERE client_id = ?';
    try {
        const [results] = await db.query(query, [id]);
        if (results.length === 0) {
            return res.status(404).json({ error: 'Client not found' });
        }
        res.status(200).json(results[0]);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};


const updateClient = (req, res) => {
    const { id } = req.params;
    const { name, email } = req.body;
    const query = 'UPDATE clients SET name = ?, email = ? WHERE client_id = ?';
  
    // Execute the query with the provided parameters
    db.query(query, [name, email, id], (err, result) => {
      if (err) {
        console.error("Error updating client in MySQL:", err);
        return res.status(500).json({ error: 'Internal server error' });
      }
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Client not found' });
      }
  
      // Client updated successfully
      res.status(200).json({ success: true, message: 'Client updated successfully' });
    });
  };
  

// Delete a client
const deleteClient = async (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM clients WHERE client_id = ?';
    try {
        const [result] = await db.query(query, [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Client not found' });
        }
        res.status(200).json({ success: true, message: 'Client deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

const createContract = (req, res) => {
    const { client_id, start_date, end_date, status } = req.body;  // Extracting all necessary fields
    const query = 'INSERT INTO contracts (client_id, start_date, end_date, status) VALUES (?, ?, ?, ?)';
  
    // Execute the query with the provided parameters
    db.query(query, [client_id, start_date, end_date, status], (err, result) => {
      if (err) {
        console.error("Error adding contract to MySQL:", err);
        return res.status(500).json({ error: 'Internal server error' });
      }
  
      // Contract added successfully
      res.status(201).json({ success: true, message: 'Contract added successfully' });
    });
  };
  

// Get all contracts
const getAllContracts = (req, res) => {
    const query = 'SELECT * FROM contracts';
    
    db.query(query, (err, results) => {
        if (err) {
            console.error("Error fetching contracts from MySQL:", err);
            return res.status(500).json({ error: 'Internal server error' });
        }

        if (results.length === 0) {
            return res.status(404).json({ success: false, message: 'No contracts found' });
        }

        // Return the list of contracts
        return res.status(200).json({
            success: true,
            contracts: results
        });
    });
};


// Get a single contract by ID
const getContractById = (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM contracts WHERE contract_id = ?';

    db.query(query, [id], (err, results) => {
        if (err) {
            console.error("Error fetching contract from MySQL:", err);
            return res.status(500).json({ error: 'Internal server error' });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: 'Contract not found' });
        }

        // Return the contract details
        return res.status(200).json(results[0]);
    });
};


// Update a contract
const updateContract = (req, res) => {
    const { id } = req.params;
    const { client_id, status } = req.body;
    const query = 'UPDATE contracts SET client_id = ?, status = ? WHERE contract_id = ?';

    db.query(query, [client_id, status, id], (err, result) => {
        if (err) {
            console.error("Error updating contract in MySQL:", err);
            return res.status(500).json({ error: 'Internal server error' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Contract not found' });
        }

        res.status(200).json({ success: true, message: 'Contract updated successfully' });
    });
};

// Delete a contract
const deleteContract = async (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM contracts WHERE contract_id = ?';
    try {
        const [result] = await db.query(query, [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Contract not found' });
        }
        res.status(200).json({ success: true, message: 'Contract deleted successfully' });
    } catch (error) {
        console.error("Error deleting contract:", error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const createInvoice = async (req, res) => {
    const { client_id, amount, status } = req.body;
    const query = 'INSERT INTO invoices (client_id, amount, status) VALUES (?, ?, ?)';
    try {
        await db.query(query, [client_id, amount, status]);
        res.status(201).json({ success: true, message: 'Invoice added successfully' });
    } catch (error) {
        console.error("Error adding invoice:", error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


// Get all invoices
const getAllInvoices = (req, res) => {
    const query = 'SELECT * FROM invoices';
    db.query(query, (err, results) => {
        if (err) {
            console.error("Error fetching invoices:", err); // Log the error details
            return res.status(500).json({ error: 'Internal server error' });
        }
        
        if (results.length === 0) {
            return res.status(404).json({ success: false, message: 'No invoices found' });
        }

        res.status(200).json(results);
    });
};




// Get a single invoice by ID
const getInvoiceById = (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM invoices WHERE invoice_id = ?';
    db.query(query, [id], (err, results) => {
        if (err) {
            console.error("Error fetching invoice:", err); // Log the error details
            return res.status(500).json({ error: 'Internal server error' });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: 'Invoice not found' });
        }

        res.status(200).json(results[0]);
    });
};


// Update an invoice
const updateInvoice = (req, res) => {
    const { id } = req.params;
    const { client_id, amount, status } = req.body;
    const query = 'UPDATE invoices SET client_id = ?, amount = ?, status = ? WHERE invoice_id = ?';

    db.query(query, [client_id, amount, status, id], (err, result) => {
        if (err) {
            console.error("Error updating invoice:", err); // Log the error details
            return res.status(500).json({ error: 'Internal server error' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Invoice not found' });
        }

        res.status(200).json({ success: true, message: 'Invoice updated successfully' });
    });
};


// Delete an invoice
const deleteInvoice = (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM invoices WHERE invoice_id = ?';
    
    db.query(query, [id], (err, result) => {
        if (err) {
            console.error("Error deleting invoice:", err); // Log the error details
            return res.status(500).json({ error: 'Internal server error' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Invoice not found' });
        }

        res.status(200).json({ success: true, message: 'Invoice deleted successfully' });
    });
};


const createPayment = (req, res) => {
    const { client_id, received_amount, due_amount, created_at } = req.body;
    const query = 'INSERT INTO payments (client_id, received_amount, due_amount, created_at) VALUES (?, ?, ?, ?)';

    db.query(query, [client_id, received_amount, due_amount, created_at], (err, result) => {
        if (err) {
            console.error("Error creating payment:", err); // Log the error details
            return res.status(500).json({ error: 'Internal server error' });
        }

        res.status(201).json({ success: true, message: 'Payment added successfully' });
    });
};




// Get all payments
const getAllPayments = (req, res) => {
    const query = 'SELECT * FROM payments';
    
    db.query(query, (err, results) => {
        if (err) {
            console.error("Error fetching payments:", err); // Log the error details
            return res.status(500).json({ error: 'Internal server error' });
        }

        res.status(200).json(results);
    });
};


// Get a single payment by ID
const getPaymentById = async (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM payments WHERE payment_id = ?';
    try {
        const [results] = await db.query(query, [id]);
        if (results.length === 0) {
            return res.status(404).json({ error: 'Payment not found' });
        }
        res.status(200).json(results[0]);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Update a payment
const updatePayment = async (req, res) => {
    const { id } = req.params;
    const { client_id, amount, date } = req.body;
    const query = 'UPDATE payments SET client_id = ?, amount = ?, date = ? WHERE payment_id = ?';
    try {
        const [result] = await db.query(query, [client_id, amount, date, id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Payment not found' });
        }
        res.status(200).json({ success: true, message: 'Payment updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Delete a payment
const deletePayment = async (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM payments WHERE payment_id = ?';
    try {
        const [result] = await db.query(query, [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Payment not found' });
        }
        res.status(200).json({ success: true, message: 'Payment deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

const createLead = async (req, res) => {
    const { name, email, status, duration, date } = req.body;
    const query = 'INSERT INTO leads (name, email, status, duration, date) VALUES (?, ?, ?, ?, ?)';
    try {
        await db.query(query, [name, email, status, duration, date]);
        res.status(201).json({ success: true, message: 'Lead added successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Get all leads
const getAllLeads = (req, res) => {
    const query = 'SELECT * FROM leads';
    
    db.query(query, (error, results) => {
        if (error) {
            // Handle the error, respond with an error status and message
            return res.status(500).json({ error: 'Internal server error' });
        }

        // Respond with the results if no error
        res.status(200).json(results);
    });
};


// Get a single lead by ID
const getLeadById = (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM leads WHERE lead_id = ?';

    db.query(query, [id], (error, results) => {
        if (error) {
            // Handle the error, respond with an error status and message
            return res.status(500).json({ error: 'Internal server error' });
        }

        if (results.length === 0) {
            // Handle the case where no lead is found
            return res.status(404).json({ error: 'Lead not found' });
        }

        // Respond with the first result if found
        res.status(200).json(results[0]);
    });
};


// Update a lead
const updateLead = (req, res) => {
    const { id } = req.params;
    const { name, email, status, duration, date } = req.body;
    const query = 'UPDATE leads SET name = ?, email = ?, status = ?, duration = ?, date = ? WHERE lead_id = ?';

    db.query(query, [name, email, status, duration, date, id], (error, result) => {
        if (error) {
            // Handle the error, respond with an error status and message
            return res.status(500).json({ error: 'Internal server error' });
        }

        if (result.affectedRows === 0) {
            // Handle the case where no rows were affected
            return res.status(404).json({ error: 'Lead not found' });
        }

        // Respond with a success message if the lead was updated
        res.status(200).json({ success: true, message: 'Lead updated successfully' });
    });
};


// Delete a lead
const deleteLead = (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM leads WHERE lead_id = ?';

    db.query(query, [id], (error, result) => {
        if (error) {
            // Handle the error, respond with an error status and message
            return res.status(500).json({ error: 'Internal server error' });
        }

        if (result.affectedRows === 0) {
            // Handle the case where no rows were affected
            return res.status(404).json({ error: 'Lead not found' });
        }

        // Respond with a success message if the lead was deleted
        res.status(200).json({ success: true, message: 'Lead deleted successfully' });
    });
};



    module.exports = { createContract, getAllContracts, getContractById, updateContract, deleteContract,createClient, getAllClients, getClientById, updateClient, deleteClient,createInvoice, getAllInvoices, getInvoiceById, updateInvoice, deleteInvoice,createPayment, getAllPayments, getPaymentById, updatePayment, deletePayment, createLead, getAllLeads, getLeadById, updateLead, deleteLead,getOverviewMetrics,getPaymentsData, getLeadsData,getToDoList,getDevicesData,addToDoItem,deleteToDoItem,updateToDoItem,getToDoById,addDeviceUsage };
