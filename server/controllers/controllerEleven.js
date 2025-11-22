const express = require("express");
const { db } = require("../db");
const moment = require("moment-timezone");

const createBooking = (req, res) => {
  try {
    const {
      booking_esu_id,
      booking_org_id,
      booking_amount,
      booking_date,
      booking_notes,
    } = req.body;

    const dateTime = moment().tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss");

    if (!booking_amount || !booking_date) {
      return res
        .status(400)
        .json({ message: "booking_amount and booking_date are required" });
    }

    const insertQuery = `
      INSERT INTO booking_details
      (booking_esu_id, booking_org_id, booking_amount, booking_date, booking_notes, booking_created_at, booking_updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    // DB INSERT
    db.query(
      insertQuery,
      [
        booking_esu_id || null,
        booking_org_id || null,
        booking_amount,
        booking_date,
        booking_notes || null,
        dateTime,
        dateTime,
      ],
      (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: "Database Insert Error" });
        }

        const booking_id = result.insertId;

        return res.status(201).json({
          message: "Booking created successfully",
          data: {
            booking_id,
            booking_esu_id,
            booking_org_id,
            booking_amount,
            booking_date,
            booking_notes,
          },
        });
      }
    );
  } catch (error) {
    console.error("Unexpected Error:", error);
    return res.status(500).json({ message: error.message });
  }
};

const getBookingBYleadId = async (req, res) => {
  try {
    const { leadId } = req.params.leadId;
    const selectQuery = `select * from booking_details left join employee_sold_units on employee_sold_units.esu_id = booking_details.booking_esu_id left join owner on owner.owner_id = employee_sold_units.esu_owner_id where employee_sold_units.esu_lead_id = ?`;
    db.query(selectQuery, leadId, (err, result) => {
      if (err) {
        return res.status(400).json({ success: false, message: err.message });
      }
      return res.status(200).send(result);
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { createBooking, getBookingBYleadId };
