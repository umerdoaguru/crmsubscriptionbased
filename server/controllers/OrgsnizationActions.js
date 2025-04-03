const express = require("express");
const { db } = require("../db");
const path = require("path");
const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");
const getAllOrganizations = async (req, res) => {
  try {
    // Query to select all organizations
    const getAllOrgsQuery = "SELECT * FROM organization";

    db.query(getAllOrgsQuery, (err, result) => {
      if (err) {
        console.error("Error fetching organizations from MySQL:", err);
        return res
          .status(500)
          .json({ success: false, message: "Internal server error" });
      }

      if (result.length === 0) {
        return res
          .status(404)
          .json({ success: false, message: "No organizations found" });
      }

      // Construct the base URL for accessing assets
      const baseUrl = `${req.protocol}://${req.get("host")}/Assets/`;

      // Transform the results to include the full URL for images
      const organizationsWithUrls = result.map((org) => ({
        ...org,
        signature: org.signature
          ? baseUrl + org.signature.split("/").pop()
          : null,
        logo: org.logo ? baseUrl + org.logo.split("/").pop() : null,
      }));

      // Return the list of organizations with URLs
      return res.status(200).json({
        success: true,
        organizations: organizationsWithUrls,
      });
    });
  } catch (error) {
    console.error("Error in fetching organizations:", error);
    res.status(500).json({
      success: false,
      message: "Error in fetching organizations",
      error: error.message,
    });
  }
};

const getOrganizationById = async (req, res) => {
  try {
    // Get organization ID from the route parameter
    const organizationId = req.params.id;

    // Query to select the organization by ID
    const getOrgByIdQuery = "SELECT * FROM organization WHERE companyId = ?";

    // Execute the query
    db.query(getOrgByIdQuery, [organizationId], (err, result) => {
      if (err) {
        console.error("Error fetching organization from MySQL:", err);
        return res
          .status(500)
          .json({ success: false, message: "Internal server error" });
      }

      if (result.length === 0) {
        return res
          .status(404)
          .json({ success: false, message: "Organization not found" });
      }

      // Construct the base URL for accessing assets
      const baseUrl = `${req.protocol}://${req.get("host")}/Assets/`;

      // Transform the result to include the full URL for images
      const organization = {
        ...result[0],
        signature: result[0].signature
          ? baseUrl + result[0].signature.split("/").pop()
          : null,
        logo: result[0].logo ? baseUrl + result[0].logo.split("/").pop() : null,
      };

      // Return the organization data
      return res.status(200).json({
        success: true,
        organization,
      });
    });
  } catch (error) {
    console.error("Error in fetching organization:", error);
    res.status(500).json({
      success: false,
      message: "Error in fetching organization",
      error: error.message,
    });
  }
};

const addOrganization = async (req, res) => {
  try {
    // Destructure organization fields from request body
    const {
      name,
      contact,
      bankDetails,
      email_id,
      bankname,
      ifsc_code,
      acc_no,
      type,
      zip_code,
      location,
      district,
    } = req.body;

    // Retrieve file paths for signature and logo, if available
    const signaturePath = req.files.signature
      ? `/Assets/${req.files.signature[0].filename}`
      : null;
    const logoPath = req.files.logo
      ? `/Assets/${req.files.logo[0].filename}`
      : null;

    // Insert data into the database
    const query = `
      INSERT INTO organization (
        name,
        contact,
        bankDetails,
        email_id,
        bankname,
        ifsc_code,
        acc_no,
        type,
        zip_code,
        location,
        district,
        signature,
        logo
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const values = [
      name,
      contact,
      bankDetails,
      email_id,
      bankname,
      ifsc_code,
      acc_no,
      type,
      zip_code,
      location,
      district,
      signaturePath,
      logoPath,
    ];

    // Execute the database query
    db.query(query, values, (err, results) => {
      if (err) {
        console.error("Error executing query:", err);
        return res.status(500).json({ error: "Internal server error" });
      }
      res.status(200).json({ message: "Organization added successfully" });
    });
  } catch (error) {
    // Handle any unexpected errors
    console.error("Error adding organization:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const addEmployee = async (req, res) => {
  try {
    const { name, email, password, position, phone } = req.body;

    // Validations for required fields
    if (!name || !email) {
      return res.status(400).json({ message: "Name and email are required" });
    }

    // Query to check if an employee with the same email already exists
    const checkEmailQuery = `SELECT * FROM employee WHERE email = ?`;

    db.query(checkEmailQuery, [email], (emailErr, emailResult) => {
      if (emailErr) {
        console.error("Error checking email:", emailErr);
        return res.status(500).json({ message: "Internal server error" , error: emailErr});
      }

      if (emailResult.length > 0) {
        // If the email already exists, return a conflict response
        return res.status(400).json({
          success: false,
          message: "Email already exists",
        });
      }

      // If the email does not exist, proceed with inserting the employee
      const insertEmployeeQuery = `
        INSERT INTO employee (name, email, password, position, phone)
        VALUES (?, ?, ?, ?, ?)
      `;

      const insertEmployeeParams = [
        name,
        email,
        password,
        position || null,
        phone || null,
      ];

      db.query(
        insertEmployeeQuery,
        insertEmployeeParams,
        (insertErr, insertResult) => {
          if (insertErr) {
            console.error("Error inserting employee:", insertErr);
            return res.status(500).json({ message: "Internal server error" , error: emailErr});
          }

          // Employee added successfully
          return res.status(201).json({
            success: true,
            message: "Employee added successfully",
            employeeId: insertResult.insertId, // Returning the auto-generated employee ID
          });
        }
      );
    });
  } catch (error) {
    console.error("Error in adding employee:", error);
    res.status(500).json({
      success: false,
      message: "Error in adding employee",
      error: error.message,
    });
  }
};


// const addEmployee = async (req, res) => {
//   try {
//     const { name, email, password, position, phone, salary } = req.body;

//     // Validations
//     const requiredFields = [name, email, password];
//     if (requiredFields.some((field) => !field)) {
//       return res.status(400).json({ error: 'Name, email, and password are required' });
//     }

//     // Hash the password
//     const saltRounds = 10;
//     const hashedPassword = bcrypt.hashSync(password, saltRounds);

//     // Insert employee into the database with hashed password
//     const insertEmployeeQuery = `
//       INSERT INTO employee (name, email, password, position, phone, salary)
//       VALUES (?, ?, ?, ?, ?, ?)
//     `;

//     const insertEmployeeParams = [
//       name,
//       email,
//       hashedPassword, // Use the hashed password
//       position || null,
//       phone || null,
//       salary || null,
//     ];

//     db.query(insertEmployeeQuery, insertEmployeeParams, (insertErr, insertResult) => {
//       if (insertErr) {
//         console.error('Error inserting employee:', insertErr);
//         return res.status(500).json({ error: 'Internal server error' });
//       } else {
//         console.log('Employee added successfully');
//         return res.status(201).json({
//           success: true,
//           message: 'Employee added successfully',
//           employeeId: insertResult.insertId, // Returning the auto-generated ID
//         });
//       }
//     });
//   } catch (error) {
//     console.error('Error in adding employee:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error in adding employee',
//       error: error.message,
//     });
//   }
// };

const getAllEmployees = async (req, res) => {
  try {
    // Query to get all employees
    const getAllEmployeesQuery = "SELECT * FROM employee";

    db.query(getAllEmployeesQuery, (err, results) => {
      if (err) {
        console.error("Error fetching employees from MySQL:", err);
        return res.status(500).json({ error: "Internal server error" });
      }

      // Return the results
      return res.status(200).json({
        success: true,
        employees: results,
      });
    });
  } catch (error) {
    console.error("Error in getting employees:", error);
    res.status(500).json({
      success: false,
      message: "Error in getting employees",
      error: error.message,
    });
  }
};

const getEmployeeById = async (req, res) => {
  const { employeeId } = req.params;

  try {
    const getEmployeeByIdQuery = "SELECT * FROM employee WHERE employeeId = ?";

    db.query(getEmployeeByIdQuery, [employeeId], (err, result) => {
      if (err) {
        console.error("Error fetching employee by ID from MySQL:", err);
        return res.status(500).json({ error: "Internal server error" });
      }

      if (result.length === 0) {
        return res.status(404).json({ message: "Employee not found" });
      }

      return res.status(200).json({
        success: true,
        employee: result[0], // Return a single employee
      });
    });
  } catch (error) {
    console.error("Error in getting employee by ID:", error);
    res.status(500).json({
      success: false,
      message: "Error in getting employee by ID",
      error: error.message,
    });
  }
};

const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password, position, phone } = req.body;

    if (!id) {
      return res.status(400).json({ error: "Employee ID is required" });
    }

    const query = ` UPDATE employee SET name = ?, email = ?, password = ?, position = ?, phone = ?  WHERE employeeId = ?`;

    const params = [
      name,
      email,
      password,
      position || null,
      phone || null,
      id,
    ];

    db.query(query, params, (err, results) => {
      if (err) {
        console.error("Error updating employee:", err);
        return res.status(500).json({ error: "Internal server error" });
      }

      if (results.affectedRows === 0) {
        return res.status(404).json({ error: "Employee not found" });
      }

      res
        .status(200)
        .json({ success: true, message: "Employee updated successfully" });
    });
  } catch (error) {
    console.error("Error in updateEmployee:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
const updateSingleEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, position, phone } = req.body;

    if (!id) {
      return res.status(400).json({ message: "Employee ID is required" });
    }

    // Retrieve file paths for photo and signature, if available
    const photoPath = req.files.photo
      ? `/Assets/${req.files.photo[0].filename}`
      : null;
    const signaturePath = req.files.signature
      ? `/Assets/${req.files.signature[0].filename}`
      : null;

    const query = `
      UPDATE employee
      SET name = ?, email = ?, position = ?, phone = ?,  photo = COALESCE(?, photo), signature = COALESCE(?, signature)
      WHERE employeeId = ?
    `;

    const params = [
      name,
      email,
      position || null,
      phone || null,
      photoPath,
      signaturePath,
      id,
    ];

    db.query(query, params, (err, results) => {
      if (err) {
        console.error("Error updating employee:", err);
        return res.status(500).json({ message: "Internal server error", error: err });
      }

      if (results.affectedRows === 0) {
        return res.status(404).json({ message: "Employee not found" });
      }

      res
        .status(200)
        .json({ success: true, message: "Employee updated successfully" });
    });
  } catch (error) {
    console.error("Error in updateEmployee:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};

const deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params; // This is the auto-generated employeeId

    if (!id) {
      return res.status(400).json({ error: "Employee ID is required" });
    }

    const query = "DELETE FROM employee WHERE employeeId = ?";

    db.query(query, [id], (err, results) => {
      if (err) {
        console.error("Error deleting employee:", err);
        return res.status(500).json({ error: "Internal server error" });
      }

      if (results.affectedRows === 0) {
        return res.status(404).json({ error: "Employee not found" });
      }

      res
        .status(200)
        .json({ success: true, message: "Employee deleted successfully" });
    });
  } catch (error) {
    console.error("Error in deleteEmployee:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const deleteOrganization = async (req, res) => {
  try {
    // Extract companyId from URL parameters
    const { id } = req.params;

    // Validate companyId
    if (!id) {
      return res.status(400).json({ error: "Company ID is required" });
    }

    // Check if the organization exists
    const checkOrgQuery = "SELECT * FROM organization WHERE companyId = ?";

    db.query(checkOrgQuery, [id], (err, result) => {
      if (err) {
        console.error("Error checking if organization exists in MySQL:", err);
        return res.status(500).json({ error: "Internal server error" });
      }

      if (result.length === 0) {
        return res.status(404).json({ error: "Organization not found" });
      } else {
        // Organization found, proceed with deletion
        const deleteOrgQuery = "DELETE FROM organization WHERE companyId = ?";

        db.query(deleteOrgQuery, [id], (deleteErr, deleteResult) => {
          if (deleteErr) {
            console.error("Error deleting organization:", deleteErr);
            return res.status(500).json({ error: "Internal server error" });
          } else {
            console.log("Organization deleted successfully");
            return res.status(200).json({
              success: true,
              message: "Organization deleted successfully",
            });
          }
        });
      }
    });
  } catch (error) {
    console.error("Error in deleting organization:", error);
    res.status(500).json({
      success: false,
      message: "Error in deleting organization",
      error: error.message,
    });
  }
};

const updateOrganization = async (req, res) => {
  try {
    const { companyId } = req.params; // Changed to companyId
    const {
      name,
      contact,
      bankDetails,
      email_id,
      bankname,
      ifsc_code,
      acc_no,
      type,
      zip_code,
      location,
      district,
    } = req.body;

    // Retrieve file paths for signature and logo, if available
    const signaturePath = req.files.signature
      ? `/Assets/${req.files.signature[0].filename}`
      : null;
    const logoPath = req.files.logo
      ? `/Assets/${req.files.logo[0].filename}`
      : null;

    // Construct the SQL query with placeholders for all fields
    const query = `
        UPDATE organization 
        SET 
          name = COALESCE(?, name),
          contact = COALESCE(?, contact),
          bankDetails = COALESCE(?, bankDetails),
          email_id = COALESCE(?, email_id),
          bankname = COALESCE(?, bankname),
          ifsc_code = COALESCE(?, ifsc_code),
          acc_no = COALESCE(?, acc_no),
          type = COALESCE(?, type),
          zip_code = COALESCE(?, zip_code),
          location = COALESCE(?, location),
          district = COALESCE(?, district),
          signature = COALESCE(?, signature),
          logo = COALESCE(?, logo)
        WHERE companyId = ?
      `;

    const values = [
      name,
      contact,
      bankDetails,
      email_id,
      bankname,
      ifsc_code,
      acc_no,
      type,
      zip_code,
      location,
      district,
      signaturePath,
      logoPath,
      companyId,
    ];

    // Execute the database query
    db.query(query, values, (err, results) => {
      if (err) {
        console.error("Error executing query:", err);
        return res.status(500).json({ error: "Internal server error" });
      }

      if (results.affectedRows === 0) {
        return res.status(404).json({ error: "Organization not found" });
      }

      // Return success message
      res.status(200).json({ message: "Organization updated successfully" });
    });
  } catch (error) {
    console.error("Error updating organization:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getAllAdmins = async (req, res) => {
  try {
    // Query to get all admins
    const getAllAdminsQuery = "SELECT * FROM admins";

    db.query(getAllAdminsQuery, (err, results) => {
      if (err) {
        console.error("Error fetching admins from MySQL:", err);
        return res.status(500).json({ error: "Internal server error" });
      }

      // Return the results
      return res.status(200).json({
        success: true,
        admins: results,
      });
    });
  } catch (error) {
    console.error("Error in getting admins:", error);
    res.status(500).json({
      success: false,
      message: "Error in getting admins",
      error: error.message,
    });
  }
};

const getAdminById = async (req, res) => {
  const { adminId } = req.params;
  try {
    const getAdminByIdQuery = "SELECT * FROM admins WHERE admin_id = ?";

    db.query(getAdminByIdQuery, [adminId], (err, result) => {
      if (err) {
        console.error("Error fetching admin by ID from MySQL:", err);
        return res.status(500).json({ error: "Internal server error" });
      }

      if (result.length === 0) {
        return res.status(404).json({ message: "Admin not found" });
      }

      return res.status(200).json({
        success: true,
        admin: result[0], // Return a single admin
      });
    });
  } catch (error) {
    console.error("Error in getting admin by ID:", error);
    res.status(500).json({
      success: false,
      message: "Error in getting admin by ID",
      error: error.message,
    });
  }
};

const addAdmin = async (req, res) => {
  const { name, email, password, position, phone } = req.body;

  try {
    // Query to check if an admin with the same email already exists
    const checkEmailQuery = `SELECT * FROM admins WHERE email = ?`;

    db.query(checkEmailQuery, [email], (err, results) => {
      if (err) {
        console.error("Error checking email:", err);
        return res.status(500).json({ error: "Internal server error" });
      }

      if (results.length > 0) {
        // If the email already exists, return an error response
        return res.status(400).json({
          success: false,
          message: "Email already exists",
        });
      }

      // If the email does not exist, proceed with adding the admin
      const addAdminQuery = `
        INSERT INTO admins (name, email, password, position, phone)
        VALUES (?, ?, ?, ?,?)
      `;

      db.query(
        addAdminQuery,
        [name, email, password, position, phone],
        (err, results) => {
          if (err) {
            console.error("Error adding admin:", err);
            return res.status(500).json({ error: "Internal server error" });
          }

          res.status(201).json({
            success: true,
            message: "Admin added successfully",
          });
        }
      );
    });
  } catch (error) {
    console.error("Error in adding admin:", error);
    res.status(500).json({
      success: false,
      message: "Error in adding admin",
      error: error.message,
    });
  }
};


const updateAdmin = async (req, res) => {
  const { admin_id } = req.params;
  const { name, email, position, phone, password } = req.body; // Added password

  if (!admin_id) {
    return res.status(400).json({ error: "Admin ID is required" });
  }

  // Optional: Validate the password if necessary, e.g., check length or strength

  try {
    // Update the query to include the password
    const updateAdminQuery = `
      UPDATE admins
      SET name = ?, email = ?, position = ?, phone = ?, password = ?
      WHERE admin_id = ?
    `;

    console.log(name, email, position, phone, password, admin_id); // Log the new password

    db.query(
      updateAdminQuery,
      [name, email, position, phone, password, admin_id], // Include password in the values array
      (err, results) => {
        if (err) {
          console.error("Error updating admin:", err);
          return res.status(500).json({ error: "Internal server error" });
        }

        if (results.affectedRows === 0) {
          return res.status(404).json({ error: "Admin not found" });
        }

        res.status(200).json({
          success: true,
          message: "Admin updated successfully",
        });
      }
    );
  } catch (error) {
    console.error("Error in updating admin:", error);
    res.status(500).json({
      success: false,
      message: "Error in updating admin",
      error: error.message,
    });
  }
};

const deleteAdmin = async (req, res) => {
  const { admin_id } = req.params; // Change admin_id to admin_id
  console.log("Admin ID received:", admin_id); // Log admin_id

  if (!admin_id) {
    return res.status(400).json({ error: "Admin ID is required" });
  }

  try {
    const deleteAdminQuery = "DELETE FROM admins WHERE admin_id = ?"; // Use admin_id in SQL query
    db.query(deleteAdminQuery, [admin_id], (err, results) => {
      if (err) {
        console.error("Error deleting admin from DB:", err);
        return res.status(500).json({ error: "Database error", details: err });
      }

      if (results.affectedRows === 0) {
        return res.status(404).json({ error: "Admin not found" });
      }

      res.status(200).json({
        success: true,
        message: "Admin deleted successfully",
      });
    });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while deleting admin",
      error: error.message,
    });
  }
};

module.exports = {
  getAllOrganizations,
  addOrganization,
  deleteOrganization,
  updateOrganization,
  addEmployee,
  getAllEmployees,
  updateEmployee,
  deleteEmployee,
  getEmployeeById,
  updateSingleEmployee,
  getOrganizationById,
  getAllAdmins,
  getAdminById,
  addAdmin,
  updateAdmin,
  deleteAdmin,
};
