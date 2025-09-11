const express = require("express");
const { db } = require("../db");
const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const axios = require('axios');

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const roles = req.body.role || "Super-Admin";
    const requiredFields = [name, email, password, roles];

    if (requiredFields.some((field) => !field)) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const saltRounds = 10;
    const hashedPassword = bcrypt.hashSync(password, saltRounds);
    const checkUserQuery = "SELECT * FROM registered_data WHERE email = ?";

    db.query(checkUserQuery, [email], (err, result) => {
      if (err) {
        res.status(500).json({ error: "Internal server error" });
      } else {
        if (result.length > 0) {
          return res.status(400).json({
            error: "User already exists.",
          });
        } else {
          const insertUserQuery = `
              INSERT INTO registered_data  (user_name, email,password,roles ) VALUES (?, ?, ?,?)`;

          const insertUserParams = [name, email, hashedPassword, roles];

          db.query(
            insertUserQuery,
            insertUserParams,
            (insertErr, insertResult) => {
              if (insertErr) {
                res.status(500).json({ error: "Internal server error" });
              } else {
                return res.status(200).json({
                  success: true,
                  message: "User registered successfully",
                });
              }
            }
          );
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error in registration",
      error: error.message,
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(404).send({
        success: false,
        message: "Invaild email or password ",
      });
    }
  
    const checkUserQuery = "SELECT * FROM registered_data WHERE email =?";
    db.query(checkUserQuery, [email], async (err, results) => {
      if (err) {}
      if (results.length === 0) {
        return res.status(404).send({
          success: false,
          message: "email is not  registered",
        });
      }
      const user = results[0];

      //compare  passwords
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return res.status(404).send({
          success: false,
          message: "Invaild password ",
        });
      }

      const token = await JWT.sign({ id: user.user_id }, process.env.JWT_SECRET, {
        expiresIn: "7d", 
    });

      res.status(200).send({
        success: true,
        message: "Login sucessfully",
        user: {
          id: user.user_id,
          name: user.user_name,
          email: user.email,
          roles: user.roles,
          token: token
        },
      });
    });
  } catch (error) {
    res.status(500).send({ success: false, message: "error in login ", error });
  }
};
const employeelogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(404).send({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Check user in MySQL
    const checkUserQuery = "SELECT * FROM employee WHERE email = ?";
    db.query(checkUserQuery, [email], (err, results) => {
      if (err) {
        return res.status(500).send({
          success: false,
          message: "Server error",
        });
      }

      if (results.length === 0) {
        return res.status(404).send({
          success: false,
          message: "Email is not registered",
        });
      }

      const user = results[0];

      if (password !== user.password) {
        return res.status(404).send({
          success: false,
          message: "Invalid password",
        });
      }

      // Generate token
      const token = JWT.sign({ id: user.employeeId }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });

      // Send response
      res.status(200).send({
        success: true,
        message: "Login successfully",
        user: {
          id: user.employeeId,
          name: user.name,
          email: user.email,
          position: user.position,
          roles: user.roles,
        token: token,
     user_id:user.user_id,
        },
      });
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in login",
      error,
    });
  }
};

const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(404).send({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Check admin in MySQL
    const checkAdminsQuery = "SELECT * FROM admins WHERE email = ?";
    db.query(checkAdminsQuery, [email], (err, results) => {
      if (err) {
        return res.status(500).send({
          success: false,
          message: "Server error",
        });
      }

      if (results.length === 0) {
        return res.status(404).send({
          success: false,
          message: "Email is not registered",
        });
      }

      const user = results[0];

      if (password !== user.password) {
        return res.status(404).send({
          success: false,
          message: "Invalid password",
        });
      }

      // Generate token
      const token = JWT.sign({ id: user.admin_id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });

      // Send response
      res.status(200).send({
        success: true,
        message: "Login successfully",
        user: {
          id: user.admin_id,
          name: user.name,
          email: user.email,
          roles: user.roles,
        token: token,
        phone: user.phone,
        user_id:user.user_id,
        },
      });
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in login",
      error,
    });
  }
};


const sendOtpEmployee = (req, res) => {
  const { email } = req.body;

  const selectQuery = "SELECT * FROM employee WHERE email = ?";

  db.query(selectQuery, email, (err, result) => {
    if (err) {
      return res.status(400).json({ success: false, message: err.message });
    } else {
      if (!result || result.length === 0) {
        return res.status(404).json({ success: false, message: "Email not found" });
        
      } 
      else {
        
        
        
        // Random OTP generation
        function generateOTP(length) {
          const chars = "0123456789";
          let otp = "";

          for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * chars.length);
            otp += chars[randomIndex];
          }

          return otp;
        }

        const OTP = generateOTP(6);

    try {
            
        const transporter = nodemailer.createTransport({
         host: 'mail.dentalguru.software',
         port: 465,
         secure: true, // Use SSL
         auth: {
              user: 'crminfo@dentalguru.software',
               pass: 'crmdentalguru@123',
         },
       });
          

          const mailOptions = {
            from: 'crminfo@dentalguru.software',
            to: email,
            subject: "Employee Password Reset OTP",
            text: `Your OTP for password reset is: ${OTP}`,
          };

          transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              return res.status(500).json("An error occurred while sending the email.");
            } else {
              const updateQuery = "INSERT INTO otpcollections (email, code) VALUES (?, ?) ON DUPLICATE KEY UPDATE code = VALUES(code)";
              db.query(updateQuery, [email, OTP], (upErr, upResult) => {
                if (upErr) {
                  return res.status(400).json({ success: false, message: upErr.message });
                }
                return res.status(200).json({message: "OTP sent successfully"});
              });
            }
          });
        } catch (error) {
          return res.status(500).json("An error occurred.");
        }}
    }
  });
};

const verifyOtpEmployee = (req, res) => {
  try {
    const { email, otp } = req.body;
    db.query(
      "SELECT * FROM otpcollections WHERE email = ? AND code = ?",
      [email, otp],
      (err, result) => {
        if (err) {
          return res
            .status(500)
            .json({ success: false, message: "Internal server error" });
        }
        if (result.length > 0) {
          return res
            .status(200)
            .json({ success: true, message: "Otp verification  success" });
        } else {
          return res
            .status(404)
            .json({ success: false, message: "Invalid email or OTP" });
        }
      }
    );
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const resetPasswordEmployee = (req, res) => {
  try {
    const { email, password } = req.body;

    const selectQuery =
      "SELECT * FROM employee WHERE email = ?";
    db.query(selectQuery, email, (err, result) => {
      if (err) {
        res.status(400).json({ success: false, message: err.message });
      }
      if (result && result.length) {
        
        const updateQuery = `UPDATE employee SET password = ? WHERE email = ?`;
        db.query(updateQuery, [password, email], (err, result) => {
          if (err) {
            return res
              .status(400)
              .json({ success: false, message: err.message });
          } else {
            return res.status(200).json({
              success: true,
              message: "Details updated successfully",
            });
          }
        });
      } else {
        return res
          .status(404)
          .json({ success: false, message: "email not found" });
      }
    });
  } catch (error) {
    res.status(500).send({ success: false, message: "Internal server error" });
  }
};

const sendOtpAdmin = (req, res) => {
  const { email } = req.body;

  const selectQuery = "SELECT * FROM admins WHERE email = ?";

  db.query(selectQuery, email, (err, result) => {
    if (err) {
      return res.status(400).json({ success: false, message: err.message });
    } else {
      if (!result || result.length === 0) {
        return res.status(404).json({ success: false, message: "Email not found" });
        
      } 
      else {
        
        
        
        // Random OTP generation
        function generateOTP(length) {
          const chars = "0123456789";
          let otp = "";

          for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * chars.length);
            otp += chars[randomIndex];
          }

          return otp;
        }

        const OTP = generateOTP(6);

         try {
            
        const transporter = nodemailer.createTransport({
         host: 'mail.dentalguru.software',
         port: 465,
         secure: true, 
         auth: {
              user: 'crminfo@dentalguru.software',
               pass: 'crmdentalguru@123',
         },
       });
          

          const mailOptions = {
            from: 'crminfo@dentalguru.software',
            to: email,
            subject: "Admin Password Reset OTP",
            text: `Your OTP for password reset is: ${OTP}`,
          };

          transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              return res.status(500).json("An error occurred while sending the email.");
            } else {
              const updateQuery = "INSERT INTO otpcollections (email, code) VALUES (?, ?) ON DUPLICATE KEY UPDATE code = VALUES(code)";
              db.query(updateQuery, [email, OTP], (upErr, upResult) => {
                if (upErr) {
                  return res.status(400).json({ success: false, message: upErr.message });
                }
                return res.status(200).json({message: "OTP sent successfully"});
              });
            }
          });
        } catch (error) {
          return res.status(500).json("An error occurred.");
        }
    }
    }
  });
};

const verifyOtpAdmin = (req, res) => {
  try {
    const { email, otp } = req.body;
    db.query(
      "SELECT * FROM otpcollections WHERE email = ? AND code = ?",
      [email, otp],
      (err, result) => {
        if (err) {
          return res
            .status(500)
            .json({ success: false, message: "Internal server error" });
        }
        if (result.length > 0) {
          return res
            .status(200)
            .json({ success: true, message: "Otp verification  success" });
        } else {
          return res
            .status(404)
            .json({ success: false, message: "Invalid email or OTP" });
        }
      }
    );
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const resetPasswordAdmin = (req, res) => {
  try {
    const { email, password } = req.body;

    const selectQuery =
      "SELECT * FROM admins WHERE email = ?";
    db.query(selectQuery, email, (err, result) => {
      if (err) {
        res.status(400).json({ success: false, message: err.message });
      }
      if (result && result.length) {
        
        const updateQuery = `UPDATE admins SET password = ? WHERE email = ?`;
        db.query(updateQuery, [password, email], (err, result) => {
          if (err) {
            return res
              .status(400)
              .json({ success: false, message: err.message });
          } else {
            return res.status(200).json({
              success: true,
              message: "Details updated successfully",
            });
          }
        });
      } else {
        return res
          .status(404)
          .json({ success: false, message: "email not found" });
      }
    });
  } catch (error) {
    res.status(500).send({ success: false, message: "Internal server error" });
  }
};

const sendOtpSuperAdmin = (req, res) => {
  const { email } = req.body;

  const selectQuery = "SELECT * FROM registered_data WHERE email = ?";

  db.query(selectQuery, email, (err, result) => {
    if (err) {
      return res.status(400).json({ success: false, message: err.message });
    } else {
      if (!result || result.length === 0) {
        return res.status(404).json({ success: false, message: "Email not found" });
        
      } 
      else {
        
        
        
        // Random OTP generation
        function generateOTP(length) {
          const chars = "0123456789";
          let otp = "";

          for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * chars.length);
            otp += chars[randomIndex];
          }

          return otp;
        }

        const OTP = generateOTP(6);

        try {
            
        const transporter = nodemailer.createTransport({
         host: 'mail.dentalguru.software',
         port: 465,
         secure: true, // Use SSL
         auth: {
              user: 'crminfo@dentalguru.software',
               pass: 'crmdentalguru@123',
         },
       });
          

          const mailOptions = {
            from: 'crminfo@dentalguru.software',
            to: email,
            subject: "Super Admin Password Reset OTP",
            text: `Your OTP for password reset is: ${OTP}`,
          };

          transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              return res.status(500).json("An error occurred while sending the email.");
            } else {
              const updateQuery = "INSERT INTO otpcollections (email, code) VALUES (?, ?) ON DUPLICATE KEY UPDATE code = VALUES(code)";
              db.query(updateQuery, [email, OTP], (upErr, upResult) => {
                if (upErr) {
                  return res.status(400).json({ success: false, message: upErr.message });
                }
                return res.status(200).json({message: "OTP sent successfully"});
              });
            }
          });
        } catch (error) {
          return res.status(500).json("An error occurred.");
        }
    }
    }
  });
};

const verifyOtpSuperAdmin = (req, res) => {
  try {
    const { email, otp } = req.body;
    db.query(
      "SELECT * FROM otpcollections WHERE email = ? AND code = ?",
      [email, otp],
      (err, result) => {
        if (err) {
          return res
            .status(500)
            .json({ success: false, message: "Internal server error" });
        }
        if (result.length > 0) {
          return res
            .status(200)
            .json({ success: true, message: "Otp verification  success" });
        } else {
          return res
            .status(404)
            .json({ success: false, message: "Invalid email or OTP" });
        }
      }
    );
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const resetPasswordSuperAdmin = (req, res) => {
  try {
    const { email, password } = req.body;

    const selectQuery =
      "SELECT * FROM registered_data WHERE email = ?";
    db.query(selectQuery, email, (err, result) => {
      if (err) {
        res.status(400).json({ success: false, message: err.message });
      }
      if (result && result.length) {
        const saltRounds = 10;
        const hashedPassword = bcrypt.hashSync(password, saltRounds);
        const updateQuery = `UPDATE registered_data SET password = ? WHERE email = ?`;
        db.query(updateQuery, [hashedPassword, email], (err, result) => {
          if (err) {
            return res
              .status(400)
              .json({ success: false, message: err.message });
          } else {
            return res.status(200).json({
              success: true,
              message: "Details updated successfully",
            });
          }
        });
      } else {
        return res
          .status(404)
          .json({ success: false, message: "email not found" });
      }
    });
  } catch (error) {
    res.status(500).send({ success: false, message: "Internal server error" });
  }
};

const saveWebsiteAPI = (req, res) => {
  const { api } = req.body;
  if (!api) {
    return res.status(400).json({ error: 'api is required' });
  }

  db.query(
    'INSERT INTO website_api (api) VALUES (?)',
    [api],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to save form data' });
      }
      res.status(200).json({ message: 'Api saved successfully!' });
    }
  );
};

const updateWebsiteAPI = (req, res) => {
  const { id, api } = req.body;
  
  if (!id ) {
    return res.status(400).json({ error: 'ID is required' });
  }

  db.query(
    'UPDATE website_api SET  api = ? WHERE id = ?',
    [ api,id],
    (err, result) => {
      if (err) {
        return res.status(500).json({error:'Failed to update Website Api data'});
      }
      
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Website Api not found' });
      }

      res.status(200).json({ message: 'Website Api updated successfully!' });
    }
  );
};

const deleteWebsiteAPI = (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: 'Api is required' });
  }

  db.query(
    'DELETE FROM website_api WHERE id = ?',
    [id],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to delete Website Api data' });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Website Api not found' });
      }

      res.status(200).json({ message: 'Website Api deleted successfully!' });
    }
  );
};

const getwebsite_api = (req, res) => {
  db.query('SELECT * FROM website_api', (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to fetch Website Api ' });
    }
    res.status(200).json(results);
  });
};

module.exports = { 
    register, 
    login, 
    employeelogin, 
    adminLogin,
    resetPasswordEmployee,
    verifyOtpEmployee,
    sendOtpEmployee,
    resetPasswordAdmin,
    verifyOtpAdmin,
    sendOtpAdmin,
    resetPasswordSuperAdmin,
    verifyOtpSuperAdmin,
    sendOtpSuperAdmin, 
    saveWebsiteAPI,
    updateWebsiteAPI,
    deleteWebsiteAPI, 
    getwebsite_api 
};
