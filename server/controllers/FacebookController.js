const { db } = require("../db");

const axios = require('axios');
// Save form data to the database
const saveForm = (req, res) => {
  const { formId, formName,project_id } = req.body;

console.log( formId, formName,project_id);


  db.query(
    'INSERT INTO formtable (form_id, form_name,project_id) VALUES (?, ?,?)',
    [formId, formName,project_id],
    (err, result) => {
      if (err) {
        console.error('Error inserting form data:', err);
        return res.status(500).json({ error: 'Failed to save form data' });
      }

      res.status(200).json({ message: 'Form saved successfully!' });
    }
  );
};

const updateForm = (req, res) => {
  const { id, form_id, form_name } = req.body;
  

  // Check if form_id and form_name are provided
  if (!id || !form_id || !form_name ) {
    return res.status(400).json({ error: 'ID ,Form ID and Form Name are required' });
  }

  // Update the form data in the database
  db.query(
    'UPDATE formtable SET  form_id = ?, form_name = ? WHERE id = ?',
    [ form_id,form_name,id],
    (err, result) => {
      if (err) {
        console.error('Error updating form data:', err);
        return res.status(500).json({ error: 'Failed to update form data' });
      }

      // Check if any row was affected by the update
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Form not found' });
      }

      res.status(200).json({ message: 'Form updated successfully!' });
    }
  );
};

const deleteForm = (req, res) => {
  const { id } = req.params;

  // Check if id is provided
  if (!id) {
    return res.status(400).json({ error: 'Form ID is required' });
  }

  // Delete the form from the database
  db.query(
    'DELETE FROM formtable WHERE id = ?',
    [id],
    (err, result) => {
      if (err) {
        console.error('Error deleting form data:', err);
        return res.status(500).json({ error: 'Failed to delete form data' });
      }

      // Check if any row was affected by the delete
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Form not found' });
      }

      res.status(200).json({ message: 'Form deleted successfully!' });
    }
  );
};




// Fetch all forms from the database
const getAllForms = (req, res) => {
  db.query('SELECT * FROM formtable', (err, results) => {
    if (err) {
      console.error('Error fetching forms:', err);
      return res.status(500).json({ error: 'Failed to fetch forms' });
    }
    res.status(200).json(results);
  });
};
const getByProjectIdForms = (req, res) => {
  const { id } = req.params;

  db.query('SELECT * FROM formtable WHERE project_id = ?', [id], (err, results) => {
    if (err) {
      console.error('Error fetching forms:', err);
      return res.status(500).json({ error: 'Failed to fetch forms' });
    }
    res.status(200).json(results);
  });
};

const ACCESS_TOKEN = process.env.ACCESS_TOKEN; // Get from .env
// Fetch leads from Meta API and save to the database
const fetchLeads = async (req, res) => {
    const { formId } = req.body;

    if (!formId) {
      return res.status(400).json({ error: 'Form ID is required' });
    }
  
    try {
      // Fetch leads from Meta API
      const response = await axios.get(`https://graph.facebook.com/v20.0/${formId}?fields=name,leads&access_token=${ACCESS_TOKEN}`);
      console.log(response.data, "sdfs data");
      
  
      const leads = response.data.leads?.data || [];
      
      
  
      // Save the leads to the database
      for (const lead of leads) {
        const leadId = lead.id;
        const fullName = extractFieldValue(lead.field_data, 'full_name');
        const phoneNumber = extractFieldValue(lead.field_data, 'phone_number');
        const streetAddress = extractFieldValue(lead.field_data, 'street_address');
        const createdTime = new Date(lead.created_time);
  
        // Check for duplicate entry before inserting
        const checkDuplicateQuery = `
          SELECT COUNT(*) as count FROM leadstable 
          WHERE lead_id = ? OR  phone_number = ?`;
  
        db.query(checkDuplicateQuery, [leadId, phoneNumber], (err, results) => {
          if (err) {
            console.error('Error checking for duplicate lead:', err);
            return;
          }
  
          if (results[0].count === 0) {
            // Insert into LeadsTable in MySQL if no duplicates found
            const insertQuery = `
              INSERT INTO leadstable (lead_id, full_name, phone_number, street_address, created_time, form_id) 
              VALUES (?, ?, ?, ?, ?, ?)`;
  
            db.query(insertQuery, [leadId, fullName, phoneNumber, streetAddress, createdTime, formId], (insertErr, result) => {
              if (insertErr) {
                console.error('Error inserting lead:', insertErr);
              }
            });
          } else {
            console.log(`Duplicate lead found: ${fullName}, Phone: ${phoneNumber}, Lead ID: ${leadId}. Skipping...`);
          }
        });
      }
  
      res.status(200).json({ message: 'Leads fetched and saved successfully', leads });
    
    } catch (err) {
      console.error('Error fetching leads from Meta API:', err);
      res.status(500).json({ error: 'Failed to fetch leads from Meta API' });
    }
  
  };

// Fetch leads for a specific form ID
const getLeadsByFormId = (req, res) => {
  const formId = req.params.formId;
  db.query('SELECT * FROM leadstable WHERE form_id = ? ORDER BY created_time DESC', [formId], (err, results) => {
    if (err) {
      console.error('Error fetching leads:', err);
      return res.status(500).json({ error: 'Failed to fetch leads' });
    }
    res.status(200).json(results);
  });
};

// Helper function to extract field data
const extractFieldValue = (fieldData, fieldName) => {
  const field = fieldData.find(item => item.name === fieldName);
  return field ? field.values[0] : '';
};

module.exports = { saveForm,updateForm,deleteForm, getAllForms, fetchLeads, getLeadsByFormId,getByProjectIdForms };
