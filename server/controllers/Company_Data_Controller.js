const { db } = require("../db");
const axios = require('axios');
const xlsx = require("xlsx");
const moment = require("moment");
const JWT = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const { OAuth2Client } = require('google-auth-library');
dotenv.config();

const ACCESS_TOKEN = process.env.ACCESS_TOKEN;

const client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

const CompanyDataUpload = async (req, res) => {
  try {
    if (!req.files || !req.files.header_img || !req.files.footer_img) {
      return res
        .status(400)
        .json({ error: "Logo , header_img and footer_img are required" });
    }

    const { header_img, footer_img, logo, digital_sign } = req.files;
    const {
      company_name,
      company_name_account_name,
      company_name_account_ifsc,
      company_name_account_number,
      bank,
      company_address,
      moblie_no,
      gst_no,
      pan_no,
      email_id,
    } = req.body;

    const headerImagePath =
      "https://crm-generalize.dentalguru.software/uploads/" + header_img[0].filename;
    const footerImagePath =
      "https://crm-generalize.dentalguru.software/uploads/" + footer_img[0].filename;
    const logoImagePath = "https://crm-generalize.dentalguru.software/uploads/" + logo[0].filename;
    const DigitalsignImagePath =
      "https://crm-generalize.dentalguru.software/uploads/" + digital_sign[0].filename;

    // Insert header and footer images with the associated company_id
    const insertHeaderFooterImages = await new Promise((resolve, reject) => {
      const sqlImages =
        "INSERT INTO company_profile ( header_img, footer_img, company_name,company_name_account_name,company_name_account_ifsc,company_name_account_number,  bank, company_address, moblie_no,gst_no,pan_no,email_id,logo,digital_sign) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
      const values = [
        headerImagePath,
        footerImagePath,
        company_name,
        company_name_account_name,
        company_name_account_ifsc,
        company_name_account_number,
        bank,
        company_address,
        moblie_no,
        gst_no,
        pan_no,
        email_id,
        logoImagePath,
        DigitalsignImagePath,
      ];

      db.query(sqlImages, values, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });

    res.status(201).json({
      success: true,
      message: " Company profile uploaded successfully",
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const company_name_header_footer = async (req, res) => {
  try {
    const { company_name } = req.body;
    const result = await new Promise((resolve, reject) => {
      const sql = "SELECT * FROM company_profile WHERE company_name = ?";
      db.query(sql, [company_name], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });

    if (result.length === 0) {
      return res
        .status(404)
        .json({ error: "Header and footer images not found" });
    }

    const images = result[0];
    res.status(200).json(images);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getcompany_name_data = async (req, res) => {
  try {
    const { company_name } = req.body;
    const result = await new Promise((resolve, reject) => {
      const sql = "SELECT * FROM  company_profile WHERE company_name = ?";
      db.query(sql, [company_name], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });

    if (result.length === 0) {
      return res.status(404).json({ error: "company data not found" });
    }

    const invoice_data = result[0];
    res.status(200).json(invoice_data);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const fetchcompanyname = async (req, res) => {
  try {
    const UserId = req.params.UserId;
    const query = "SELECT * FROM company_profile "; // Query to retrieve unique company names

    db.query(query, [UserId], (err, results) => {
      if (err) {
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        const companyNames = results.map((row) => row.company_name); // Extract company names from the query results
        res.status(200).json(companyNames); // Send company names as JSON response
      }
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getCompanydata = async (req, res) => {
  try {
    const sql = "SELECT * FROM company_profile";
    const company_data = await new Promise((resolve, reject) => {
      db.query(sql, (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });

    res.status(200).json(company_data);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const deleteCompanydata = async (req, res) => {
  try {
    const { company_name } = req.body;
    const result = await new Promise((resolve, reject) => {
      db.query(
        "DELETE FROM company_profile WHERE company_name = ?",
        [company_name],
        (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        }
      );
    });

 
    if (result.affectedRows > 0) {
      res
        .status(200)
        .json({ success: true, message: "Companydata deleted successfully" });
    } else {
      res.status(404).json({ error: "Companydata not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateCompanyData = async (req, res) => {
  try {
    if (!req.files || !req.files.header_img || !req.files.footer_img) {
      return res
        .status(400)
        .json({ error: "Both header_img and footer_img are required" });
    }

    const { header_img, footer_img, logo, digital_sign } = req.files;
    const {
      company_name,
      company_name_account_name,
      company_name_account_ifsc,
      company_name_account_number,
      bank,
      company_address,
      moblie_no,
      gst_no,
      pan_no,
      email_id,
    } = req.body;

    const headerImagePath =
      "https://crm-generalize.dentalguru.software/uploads/" + header_img[0].filename;
    const footerImagePath =
      "https://crm-generalize.dentalguru.software/uploads/" + footer_img[0].filename;
    const logoImagePath = "https://crm-generalize.dentalguru.software/uploads/" + logo[0].filename;
    const DigitalsignImagePath =
      "https://crm-generalize.dentalguru.software/uploads/" + digital_sign[0].filename;

    // Update header and footer images with the associated company_id
    const updateHeaderFooterImages = await new Promise((resolve, reject) => {
      const sqlImages = `
        UPDATE company_profile 
        SET 
          header_img = ?,
          footer_img = ?,
          company_name = ?,
          company_name_account_name = ?,
          company_name_account_ifsc = ?,
          company_name_account_number = ?,
          bank = ? ,
          company_address = ?,
          moblie_no = ?,
          gst_no = ?,
          pan_no=?,
          email_id = ?,
          logo = ? ,
          digital_sign = ?
        WHERE id = ? `;
      const values = [
        headerImagePath,
        footerImagePath,
        company_name,
        company_name_account_name,
        company_name_account_ifsc,
        company_name_account_number,
        bank,
        company_address,
        moblie_no,
        gst_no,
        pan_no,
        email_id,
        logoImagePath,
        DigitalsignImagePath,
        req.params.id,
      ];

      db.query(sqlImages, values, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });

    res.status(200).json({
      success: true,
      message: "Header and Footer images updated successfully",
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getResponses = (req, res) => {
    db.query('SELECT * FROM responses_99acres ORDER BY received_on DESC', (err, results) => {
      if (err) return res.status(500).json({ error: 'Failed to fetch data from database' });
      res.json(results);
    });
  };
  
  
const importLeads = (req, res) => {
  try {
    const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    if (!sheetData.length) {
      return res.status(400).json({ error: 'No data found in the Excel file' });
    }

    // Form data from frontend
    const {
      assignedTo,
      employeeId,
      main_project_id,
      project_name,
      unit_type,
      unit_id,
      assignedBy,
      user_id,
      assigned_date
    } = req.body;

    const convertExcelDate = (excelDate) => {
      return typeof excelDate === "number"
        ? moment(new Date((excelDate - 25569) * 86400 * 1000)).format("YYYY-MM-DD")
        : moment(excelDate, "DD-MM-YYYY").isValid()
        ? moment(excelDate, "DD-MM-YYYY").format("YYYY-MM-DD")
        : null;
    };

    const values = sheetData.map((lead) => [
      lead["Lead Number"] || null,
      lead["Name"] || null,
      lead["Phone"] || null,
      assignedTo,
      lead["Lead Source"] || null,
      employeeId,
      project_name,
      main_project_id,
      unit_type,
      unit_id,
      lead["Address"] || null,
      assigned_date || moment().format("YYYY-MM-DD"),
      convertExcelDate(lead["Actual Date"]),
      assignedBy,
      user_id,
    ]);
    console.log(values);
    

    const sql = `
      INSERT INTO leads (
        lead_no,
        name,
        phone,
        assignedTo,
        leadSource,
        employeeId,
        project_name,
        main_project_id,
        unit_type,
        unit_id,
        address,
        createdTime,
        actual_date,
        assignedBy,
        user_id
      ) VALUES ?
    `;

    db.query(sql, [values], (err, result) => {
      if (err) {
        return res.status(500).json({ error: 'Database insert failed', details: err });
      }
      res.status(200).json({ message: 'Leads imported successfully', inserted: result.affectedRows });
    });

  } catch (error) {
    res.status(500).json({ error: 'File processing failed', details: error.message });
  }
};  

const saveForm = (req, res) => {
  const { formId, formName,project_id } = req.body;
  db.query(
    'INSERT INTO formtable (form_id, form_name,project_id) VALUES (?, ?,?)',
    [formId, formName,project_id],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to save form data' });
      }
      res.status(200).json({ message: 'Form saved successfully!' });
    }
  );
};

const updateForm = (req, res) => {
  const { id, form_id, form_name } = req.body;
  
  if (!id || !form_id || !form_name ) {
    return res.status(400).json({ error: 'ID ,Form ID and Form Name are required' });
  }

  db.query(
    'UPDATE formtable SET  form_id = ?, form_name = ? WHERE id = ?',
    [ form_id,form_name,id],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to update form data' });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Form not found' });
      }
      res.status(200).json({ message: 'Form updated successfully!' });
    }
  );
};

const deleteForm = (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: 'Form ID is required' });
  }

  db.query(
    'DELETE FROM formtable WHERE id = ?',
    [id],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to delete form data' });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Form not found' });
      }
      res.status(200).json({ message: 'Form deleted successfully!' });
    }
  );
};

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

const fetchLeads = async (req, res) => {
    const { formId } = req.body;

    if (!formId) {
      return res.status(400).json({ error: 'Form ID is required' });
    }
  
    try {
      const response = await axios.get(`https://graph.facebook.com/v20.0/${formId}?fields=name,leads&access_token=${ACCESS_TOKEN}`);
   
      const leads = response.data.leads?.data || [];
   
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

const extractFieldValue = (fieldData, fieldName) => {
  const field = fieldData.find(item => item.name === fieldName);
  return field ? field.values[0] : '';
};

const googleOAuthLogin = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Google OAuth token is required'
      });
    }

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, picture } = payload;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Unable to retrieve email from Google account'
      });
    }

    const checkUserQuery = "SELECT * FROM registered_data WHERE email = ?";
    db.query(checkUserQuery, [email], async (err, results) => {
      if (err) {
        console.error("Error checking user in MySQL:", err);
        return res.status(500).json({
          success: false,
          message: "Database error occurred"
        });
      }

      if (results.length > 0) {
        const user = results[0];
        
        if (user.roles !== 'Super-Admin') {
          return res.status(403).json({
            success: false,
            message: 'Only Super Admin can login via Google OAuth'
          });
        }

        if (!user.is_oauth) {
          const updateOAuthQuery = "UPDATE registered_data SET is_oauth = 1 WHERE user_id = ?";
          db.query(updateOAuthQuery, [user.user_id], (updateErr) => {
            if (updateErr) {
              console.error("Error updating OAuth flag:", updateErr);
            }
          });
        }

        // Generate JWT token
        const jwtToken = JWT.sign({ id: user.user_id }, process.env.JWT_SECRET, {
          expiresIn: "7d",
        });

        return res.status(200).json({
          success: true,
          message: "Google OAuth login successful",
          user: {
            id: user.user_id,
            name: user.user_name,
            email: user.email,
            roles: user.roles,
            token: jwtToken,
            user_id: user.user_id,
            is_oauth: true
          },
        });
      } else {
        
        const saltRounds = 10;
        const randomPassword = Math.random().toString(36).slice(-8);
        const hashedPassword = bcrypt.hashSync(randomPassword, saltRounds);

        const insertUserQuery = `
          INSERT INTO registered_data (user_name, email, password, roles, status, is_oauth, created_date) 
          VALUES (?, ?, ?, 'Super-Admin', 'active', 1, NOW())
        `;

        const insertUserParams = [name || email.split('@')[0], email, hashedPassword];

        db.query(insertUserQuery, insertUserParams, (insertErr, insertResult) => {
          if (insertErr) {
            console.error("Error creating new user:", insertErr);
            return res.status(500).json({
              success: false,
              message: "Error creating user account"
            });
          }

          const newUserId = insertResult.insertId;

          // Generate JWT token for new user
          const jwtToken = JWT.sign({ id: newUserId }, process.env.JWT_SECRET, {
            expiresIn: "7d",
          });

          return res.status(201).json({
            success: true,
            message: "New Super Admin account created and logged in successfully",
            user: {
              id: newUserId,
              name: name || email.split('@')[0],
              email: email,
              roles: 'Super-Admin',
              token: jwtToken,
              user_id: newUserId,
              is_oauth: true
            },
          });
        });
      }
    });

  } catch (error) {
    console.error("Google OAuth error:", error);
    return res.status(500).json({
      success: false,
      message: "Google OAuth verification failed",
      error: error.message
    });
  }
};

const googleOAuthCallback = async (req, res) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({
        success: false,
        message: 'Authorization code is required'
      });
    }

    const { tokens } = await client.getToken(code);
    client.setCredentials(tokens);

    const userInfoResponse = await client.request({
      url: 'https://www.googleapis.com/oauth2/v2/userinfo'
    });

    const { email, name } = userInfoResponse.data;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Unable to retrieve email from Google account'
      });
    }

    // Check if user exists in registered_data table
    const checkUserQuery = "SELECT * FROM registered_data WHERE email = ?";
    
    db.query(checkUserQuery, [email], async (err, results) => {
      if (err) {
        console.error("Error checking user in MySQL:", err);
        return res.status(500).json({
          success: false,
          message: "Database error occurred"
        });
      }

      if (results.length > 0) {
        // User exists - check if they are Super Admin
        const user = results[0];
        
        if (user.roles !== 'Super-Admin') {
          return res.status(403).json({
            success: false,
            message: 'Only Super Admin can login via Google OAuth'
          });
        }

        if (!user.is_oauth) {
          const updateOAuthQuery = "UPDATE registered_data SET is_oauth = 1 WHERE user_id = ?";
          db.query(updateOAuthQuery, [user.user_id], (updateErr) => {
            if (updateErr) {
              console.error("Error updating OAuth flag:", updateErr);
            }
          });
        }

        // Generate JWT token
        const jwtToken = JWT.sign({ id: user.user_id }, process.env.JWT_SECRET, {
          expiresIn: "7d",
        });

        return res.status(200).json({
          success: true,
          message: "Google OAuth login successful",
          user: {
            id: user.user_id,
            name: user.user_name,
            email: user.email,
            roles: user.roles,
            token: jwtToken,
            user_id: user.user_id,
            is_oauth: true
          },
        });
      } else {
      
        const saltRounds = 10;
        // Generate a random password for OAuth users (they won't use it)
        const randomPassword = Math.random().toString(36).slice(-8);
        const hashedPassword = bcrypt.hashSync(randomPassword, saltRounds);

        const insertUserQuery = `
          INSERT INTO registered_data (user_name, email, password, roles, status, is_oauth, created_date) 
          VALUES (?, ?, ?, 'Super-Admin', 'active', 1, NOW())
        `;

        const insertUserParams = [name || email.split('@')[0], email, hashedPassword];

        db.query(insertUserQuery, insertUserParams, (insertErr, insertResult) => {
          if (insertErr) {
            console.error("Error creating new user:", insertErr);
            return res.status(500).json({
              success: false,
              message: "Error creating user account"
            });
          }

          const newUserId = insertResult.insertId;

          // Generate JWT token for new user
          const jwtToken = JWT.sign({ id: newUserId }, process.env.JWT_SECRET, {
            expiresIn: "7d",
          });

          return res.status(201).json({
            success: true,
            message: "New Super Admin account created and logged in successfully",
            user: {
              id: newUserId,
              name: name || email.split('@')[0],
              email: email,
              roles: 'Super-Admin',
              token: jwtToken,
              user_id: newUserId,
              is_oauth: true
            },
          });
        });
      }
    });

  } catch (error) {
    console.error("Google OAuth callback error:", error);
    return res.status(500).json({
      success: false,
      message: "Google OAuth callback failed",
      error: error.message
    });
  }
};

const getGoogleAuthUrl = (req, res) => {
  try {
    const authUrl = client.generateAuthUrl({
      access_type: 'offline',
      scope: ['profile', 'email'],
      redirect_uri: process.env.GOOGLE_REDIRECT_URI
    });

    res.status(200).json({
      success: true,
      authUrl: authUrl
    });
  } catch (error) {
    console.error("Error generating Google auth URL:", error);
    res.status(500).json({
      success: false,
      message: "Error generating authentication URL"
    });
  }
};

const createServiceList = async (req, res) => {
  try {
    const { services } = req.body;
    const servicesValues = services.map((service) => [service.service_name]);
    const sql = "INSERT INTO services (service_name) VALUES ?";
    await new Promise((resolve, reject) => {
      db.query(sql, [servicesValues], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });

res.status(201).json({ success: true, message: 'Services added successfully' });
  } catch (error) {
    console.error('Error adding services:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}


const getServicelist = async (req,res)=>{
 const sql = `SELECT * FROM services`;
 db.query(sql,(err,result)=>{
  if(err){
    console.error('Error feching services:',err);
    res.status(500).json({error:"Internal Server Error"})
  } else{
  res.status(200).json(result);
  }
 })
}

const getServiceById = async(req,res)=>{
  const {serviceId} = req.params;
  const sql = `SELECT * FROM services WHERE service_id = ? `
  db.query(sql, [serviceId], (err,result)=>{
    if(err){
      console.error('Error feching services:',err);
      res.status(500).json({error:"Internal Server Error"})
    } else{
    res.status(200).json(result);
    }
   })
}

const deleteServicename = async(req,res)=>{
  const {serviceId} = req.params;
  const sql = `DELETE FROM services WHERE service_id = ? `

  db.query(sql,[serviceId],(error ,result)=>{
    if(error){
      console.error("Error of Deleteing Service");
      res.status(500).json({error:"Internal Server Error "});
    } else{
      console.log("Successful Delete Service");
      res.status(200).json({success:"Successful Delete Service"})
    }
  })
}

const updateServiceList = async (req, res) => {
  try {
    const { services } = req.body;
    for (const service of services) {
      const { service_name, service_id } = service;
      const sql = `UPDATE services SET service_name = ? WHERE service_id = ?`;
      await new Promise((resolve, reject) => {
        db.query(sql, [service_name, service_id], (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        });
      });
    }
    res.status(200).json({ success: true, message: 'Services updated successfully' });
  } catch (error) {
    console.error('Error updating services:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

module.exports = {
  CompanyDataUpload,
  company_name_header_footer,
  fetchcompanyname,
  deleteCompanydata,
  updateCompanyData,
  getCompanydata,
  getcompany_name_data,
  getResponses,
  importLeads,
  saveForm,
  updateForm,
  deleteForm, 
  getAllForms, 
  fetchLeads, 
  getLeadsByFormId,
  getByProjectIdForms,
  googleOAuthLogin,
  googleOAuthCallback,
  getGoogleAuthUrl,
  createServiceList,
  getServicelist,
  deleteServicename,
  updateServiceList, 
  getServiceById
};
