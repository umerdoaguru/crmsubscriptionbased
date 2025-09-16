const express = require("express");
const { db } = require("../db");
const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const axios = require("axios");
const moment = require("moment-timezone");
const crypto = require("crypto");
const dotenv = require("dotenv");
const razorpay = require("../config/razorpay");
dotenv.config();

const insertNewPlan = (req, res) => {
  try {
    const { plan_name, description } = req.body;
    const dateTime = moment().tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss");
    const insertQuery = `insert into plans (plan_name, description, plan_created_at) values (?,?,?)`;
    db.query(insertQuery, [plan_name, description, dateTime], (err, result) => {
      if (err) {
        res.status(400).json({ success: false, message: err.message });
      }
      res
        .status(200)
        .json({ success: true, message: "Plan added successfully" });
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "internal server error" });
  }
};

const insertBillingCycle = (req, res) => {
  try {
    const { cycle_name, duration_in_months } = req.body;
    const insertQuery = `insert into billing_cycles (cycle_name, duration_in_months) values (?,?)`;
    db.query(insertQuery, [cycle_name, duration_in_months], (err, result) => {
      if (err) {
        res.status(400).json({ success: false, message: err.message });
      }
      res
        .status(200)
        .json({ success: true, message: "Plan cycle added successfully" });
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "internal server error" });
  }
};

const insertPlanPricing = (req, res) => {
  try {
    const { pricing_plan_id, pricing_cycle_id, price, discount } = req.body;
    const dateTime = moment().tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss");
    const insertQuery = `insert into plan_pricing (	pricing_plan_id, pricing_cycle_id, price, discount, pricing_created_at) values (?,?,?,?,?)`;
    const insertParams = [
      pricing_plan_id,
      pricing_cycle_id,
      price,
      discount,
      dateTime,
    ];

    db.query(insertQuery, insertParams, (err, result) => {
      if (err) {
        res.status(400).json({ success: false, message: err.message });
      }
      res
        .status(200)
        .json({ success: true, message: "Plan pricing added successfully" });
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "internal server error" });
  }
};

const getAllPlanDetails = (req, res) => {
  try {
    const selectQuery = `select * from plans join plan_pricing on plan_pricing.pricing_plan_id = plans.plan_id join billing_cycles on billing_cycles.cycle_id = plan_pricing.pricing_cycle_id where billing_cycles.cycle_name = 'monthly'`;
    db.query(selectQuery, (err, result) => {
      if (err) {
        res.status(400).json({ success: false, message: err.message });
      }
      res.status(200).send(result);
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "internal server error" });
  }
};

const getAllPlanDetailsByPlanId = (req, res) => {
  try {
    const planId = req.params.planId;
    const selectQuery = `select * from plans join plan_pricing on plan_pricing.pricing_plan_id = plans.plan_id join billing_cycles on billing_cycles.cycle_id = plan_pricing.pricing_cycle_id where plans.plan_id = ?`;
    db.query(selectQuery, planId, (err, result) => {
      if (err) {
        res.status(400).json({ success: false, message: err.message });
      }
      res.status(200).send(result);
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "internal server error" });
  }
};

const createCompanyProfile = (req, res) => {
  try {
    const {
      company_name,
      industry,
      moblie_no,
      email_id,
      company_address,
      cp_subscription_id,
    } = req.body;
    const dateTime = moment().tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss");

    const checkQuery = `SELECT * FROM company_profile WHERE email_id = ?`;
    db.query(checkQuery, [email_id], (checkErr, checkResult) => {
      if (checkErr) {
        return res
          .status(400)
          .json({ success: false, message: checkErr.message });
      }

      if (checkResult.length > 0) {
        return res.status(409).json({
          success: false,
          message: "Email already exists, please use another one",
        });
      }

      const insertQuery = `INSERT INTO company_profile 
        (company_name, industry, moblie_no, email_id, company_address, cp_subscription_id, company_created_at) 
        VALUES (?,?,?,?,?, ?)`;
      const insertParams = [
        company_name,
        industry,
        moblie_no,
        email_id,
        company_address,
        cp_subscription_id,
        dateTime,
      ];

      db.query(insertQuery, insertParams, (err, result) => {
        if (err) {
          return res.status(400).json({ success: false, message: err.message });
        }

        const orgId = result.insertId;

        const getQuery = `SELECT * FROM company_profile WHERE org_id = ?`;
        db.query(getQuery, [orgId], (fetchErr, fetchResult) => {
          if (fetchErr) {
            return res
              .status(400)
              .json({ success: false, message: fetchErr.message });
          }

          res.status(200).json({
            success: true,
            message: "Company/Organization added successfully",
            data: fetchResult[0],
          });
        });
      });
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const saveSubscription = (req, res) => {
  try {
    const {
      sub_transaction_id,
      sub_pricing_id,
      start_date,
      end_date,
      sub_status,
    } = req.body;
    const dateTime = moment().tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss");

    const insertQuery = `INSERT INTO subscriptions 
        (sub_transaction_id,
      sub_pricing_id,
      start_date,
      end_date,
      sub_status,sub_created_at) 
        VALUES (?,?,?,?,?, ?)`;
    const insertParams = [
      sub_transaction_id,
      sub_pricing_id,
      start_date,
      end_date,
      sub_status,
      dateTime,
    ];

    db.query(insertQuery, insertParams, (err, result) => {
      if (err) {
        return res.status(400).json({ success: false, message: err.message });
      }
      res.status(200).json({
        success: true,
        message: "subscription saved successfully",
      });
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const addNewCompanyStaff = (req, res) => {
  try {
    const {
      staff_org_id,
      staff_role,
      staff_name,
      staff_email,
      staff_phone,
      staff_password,
      staff_status,
    } = req.body;

    const dateTime = moment().tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss");

    // Check if email already exists
    const checkQuery = `SELECT * FROM company_staff WHERE staff_email = ?`;
    db.query(checkQuery, [staff_email], async (checkErr, checkResult) => {
      if (checkErr) {
        return res
          .status(400)
          .json({ success: false, message: checkErr.message });
      }

      if (checkResult.length > 0) {
        return res.status(409).json({
          success: false,
          message: "Email already exists, please use another one",
        });
      }

      try {
        // Hash password with bcrypt
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(staff_password, saltRounds);

        const insertQuery = `INSERT INTO company_staff 
          (staff_org_id, staff_role, staff_name, staff_email, staff_phone, staff_password, staff_status, staff_created_at) 
          VALUES (?,?,?,?,?,?,?,?)`;

        const insertParams = [
          staff_org_id,
          staff_role,
          staff_name,
          staff_email,
          staff_phone,
          hashedPassword,
          staff_status,
          dateTime,
        ];

        db.query(insertQuery, insertParams, (err, result) => {
          if (err) {
            return res
              .status(400)
              .json({ success: false, message: err.message });
          }
          return res.status(201).json({
            success: true,
            message: "Staff member added successfully",
            staff_id: result.insertId,
          });
        });
      } catch (hashError) {
        return res
          .status(500)
          .json({ success: false, message: "Error hashing password" });
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const addSubscriptionTransactions = (req, res) => {
  try {
    const { transaction_ref, trans_email, trans_amount, trans_status } =
      req.body;

    const dateTime = moment().tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss");
    const insertQuery = `INSERT INTO subscription_transactions 
          ( transaction_ref, trans_email, trans_amount, trans_paid_at, trans_status, trans_created_at) 
          VALUES (?,?,?,?,?,?)`;

    const insertParams = [
      transaction_ref,
      trans_email,
      trans_amount,
      dateTime,
      trans_status,
      dateTime,
    ];

    db.query(insertQuery, insertParams, (err, result) => {
      if (err) {
        return res.status(400).json({ success: false, message: err.message });
      }
      return res.status(201).json({
        success: true,
        message: "Transaction added successfully",
        staff_id: result.insertId,
      });
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const createRazorTransaction = async (req, res) => {
  try {
    const { amount } = req.body;

    const options = {
      amount: amount,
      currency: "INR",
      receipt: "receipt_" + Date.now(),
    };

    const order = await razorpay.orders.create(options);

    res.json({
      success: true,
      orderId: order.id,
      currency: order.currency,
      amount: order.amount,
    });
  } catch (error) {
    console.error("❌ Order creation failed:", error);
    res.status(500).json({ success: false, message: "Order creation failed" });
  }
};

const verifyRazorPayment = (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      trans_email,
      trans_amount,
      sub_pricing_id, // from frontend (selectedCycle.pricing_id)
      duration_days, // from frontend (selectedCycle.duration_days)
    } = req.body;

    // Step 1: Verify signature
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (expectedSign !== razorpay_signature) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid signature" });
    }

    // Step 2: Insert into subscription_transactions
    const dateTime = moment().tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss");
    const insertTransactionQuery = `
      INSERT INTO subscription_transactions 
      (transaction_ref, trans_email, trans_amount, trans_paid_at, trans_status, trans_created_at) 
      VALUES (?,?,?,?,?,?)
    `;

    const transactionParams = [
      razorpay_payment_id,
      trans_email,
      trans_amount,
      dateTime,
      "success",
      dateTime,
    ];

    db.query(insertTransactionQuery, transactionParams, (err, result) => {
      if (err) {
        return res.status(400).json({ success: false, message: err.message });
      }

      const transactionId = result.insertId;

      // Step 3: Insert into subscriptions
      const startDate = moment().tz("Asia/Kolkata").format("YYYY-MM-DD");
      const endDate = moment()
        .tz("Asia/Kolkata")
        .add(duration_days, "days")
        .format("YYYY-MM-DD");

      const insertSubQuery = `
        INSERT INTO subscriptions 
        (sub_transaction_id, sub_pricing_id, start_date, end_date, sub_status, sub_created_at) 
        VALUES (?,?,?,?,?,?)
      `;

      const subParams = [
        transactionId,
        sub_pricing_id,
        startDate,
        endDate,
        "active",
        dateTime,
      ];

      db.query(insertSubQuery, subParams, (subErr, subResult) => {
        if (subErr) {
          return res
            .status(400)
            .json({ success: false, message: subErr.message });
        }

        return res.json({
          success: true,
          message: "✅ Payment verified, transaction & subscription saved",
          transaction_id: transactionId,
          subscription_id: subResult.insertId,
        });
      });
    });
  } catch (error) {
    console.error("❌ Payment verification failed:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const OneOnlylogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send({
        success: false,
        message: "Invalid email or password",
      });
    }

    const checkUserQuery = "SELECT * FROM company_staff WHERE staff_email = ?";
    db.query(checkUserQuery, [email], async (err, results) => {
      if (err) {
        return res
          .status(500)
          .send({ success: false, message: "DB error", error: err.message });
      }

      if (results.length === 0) {
        return res.status(404).send({
          success: false,
          message: "Email is not registered",
        });
      }

      const user = results[0];

      // compare passwords
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return res.status(401).send({
          success: false,
          message: "Invalid password",
        });
      }

      const token = JWT.sign({ id: user.user_id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });

      res.status(200).send({
        success: true,
        message: "Login successfully",
        user: {
          ...user,
          token,
        },
      });
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in login",
      error: error.message,
    });
  }
};

const sendOtpOnlyOne = (req, res) => {
  const { email } = req.body;

  const selectQuery = "SELECT * FROM company_staff WHERE staff_email = ?";

  db.query(selectQuery, email, (err, result) => {
    if (err) {
      return res.status(400).json({ success: false, message: err.message });
    } else {
      if (!result || result.length === 0) {
        return res
          .status(404)
          .json({ success: false, message: "Email not found" });
      } else {
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
            host: "mail.dentalguru.software",
            port: 465,
            secure: true, // Use SSL
            auth: {
              user: "crminfo@dentalguru.software",
              pass: "crmdentalguru@123",
            },
          });

          const mailOptions = {
            from: "crminfo@dentalguru.software",
            to: email,
            subject: "CRMGuru User Password Reset OTP",
            text: `Your OTP for password reset is: ${OTP}`,
          };

          transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              return res
                .status(500)
                .json("An error occurred while sending the email.");
            } else {
              const updateQuery =
                "INSERT INTO otpcollections (email, code) VALUES (?, ?) ON DUPLICATE KEY UPDATE code = VALUES(code)";
              db.query(updateQuery, [email, OTP], (upErr, upResult) => {
                if (upErr) {
                  return res
                    .status(400)
                    .json({ success: false, message: upErr.message });
                }
                return res
                  .status(200)
                  .json({ message: "OTP sent successfully" });
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

const getEmployeeDetails = (req, res) => {
  try {
    const staffId = req.params.staffId;
    const selectQuery = `select * from company_staff staff_id = ?`;
    db.query(selectQuery, staffId, (err, result) => {
      if (err) {
        res.status(400).json({ success: false, message: err.message });
      }
      res.status(200).send(result);
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateEmployeeDetails = async (req, res) => {
  try {
    const staffId = req.params.staffId;
    const {
      staff_role,
      staff_name,
      staff_email,
      staff_phone,
      staff_password,
      staff_status,
    } = req.body;

    const dateTime = moment().tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss");

    let fields = [];
    let values = [];

    if (staff_role) {
      fields.push("staff_role = ?");
      values.push(staff_role);
    }
    if (staff_name) {
      fields.push("staff_name = ?");
      values.push(staff_name);
    }
    if (staff_email) {
      fields.push("staff_email = ?");
      values.push(staff_email);
    }
    if (staff_phone) {
      fields.push("staff_phone = ?");
      values.push(staff_phone);
    }
    if (staff_password) {
      const hashedPassword = await bcrypt.hash(staff_password, 10);
      fields.push("staff_password = ?");
      values.push(hashedPassword);
    }
    if (staff_status) {
      fields.push("staff_status = ?");
      values.push(staff_status);
    }

    fields.push("staff_updated_at = ?");
    values.push(dateTime);

    if (fields.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "No fields provided for update" });
    }

    const updateQuery = `UPDATE company_staff SET ${fields.join(
      ", "
    )} WHERE staff_id = ?`;
    values.push(staffId);

    db.query(updateQuery, values, (err, result) => {
      if (err) {
        return res.status(400).json({ success: false, message: err.message });
      }

      if (result.affectedRows === 0) {
        return res
          .status(404)
          .json({ success: false, message: "Employee not found" });
      }

      res.status(200).json({
        success: true,
        message: "Employee details updated successfully",
      });
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getEmployeeByOrg = (req, res) => {
  try {
    const orgId = req.params.orgId;
    const selectQuery = `select * from company_staff where staff_org_id = ?`;
    db.query(selectQuery, orgId, (err, result) => {
      if (err) {
        res.status(400).json({ success: false, message: err.message });
      }
      res.status(200).send(result);
    });
  } catch (error) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  insertNewPlan,
  insertBillingCycle,
  insertPlanPricing,
  getAllPlanDetails,
  getAllPlanDetailsByPlanId,
  createCompanyProfile,
  saveSubscription,
  addNewCompanyStaff,
  addSubscriptionTransactions,
  createRazorTransaction,
  verifyRazorPayment,
  OneOnlylogin,
  sendOtpOnlyOne,
  getEmployeeDetails,
  updateEmployeeDetails,
  getEmployeeByOrg,
};
