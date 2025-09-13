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
};
