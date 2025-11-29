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

        const bookingId = result.insertId;

        return res.status(201).json({
          message: "Booking created successfully",
          data: {
            bookingId,
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

const getBookingBYleadId = (req, res) => {
  try {
    const { leadId } = req.params;
    const selectQuery = `select * from booking_details left join employee_sold_units on employee_sold_units.esu_id = booking_details.booking_esu_id left join owner on owner.owner_id = employee_sold_units.esu_owner_id left join projects on projects.project_id = employee_sold_units.esu_project_id left join units on units.unit_id = employee_sold_units.esu_unit_id where booking_details.booking_lead_id = ?`;
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

const updateBooking = (req, res) => {
  try {
    const { bookingId } = req.params;
    const { booking_amount, booking_date, booking_notes } = req.body;

    if (!bookingId) {
      return res.status(400).json({ message: "bookingId is required" });
    }

    const fields = [];
    const values = [];

    if (booking_amount !== undefined) {
      fields.push("booking_amount = ?");
      values.push(booking_amount);
    }

    if (booking_date !== undefined) {
      fields.push("booking_date = ?");
      values.push(booking_date);
    }

    if (booking_notes !== undefined) {
      fields.push("booking_notes = ?");
      values.push(booking_notes || null);
    }

    if (fields.length === 0) {
      return res.status(400).json({
        message: "No valid fields provided for update",
      });
    }

    const dateTime = moment().tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss");

    fields.push("booking_updated_at = ?");
    values.push(dateTime);

    values.push(bookingId);

    const updateQuery = `
      UPDATE booking_details
      SET ${fields.join(", ")}
      WHERE booking_id = ?
    `;

    db.query(updateQuery, values, (err, result) => {
      if (err) {
        console.error("Update Error:", err);
        return res.status(500).json({ message: "Database Update Error" });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Booking not found" });
      }

      return res.status(200).json({
        message: "Booking updated successfully",
        updated_fields: fields.map((f) => f.split("=")[0].trim()),
      });
    });
  } catch (error) {
    console.error("Unexpected Error:", error);
    return res.status(500).json({ message: error.message });
  }
};

const createRegistry = (req, res) => {
  try {
    const {
      registry_esu_id,
      registry_lead_id,
      registry_amount,
      registry_date,
      registry_notes,
    } = req.body;

    const registry_document_url = req.file
      ? `/registry_documents/${req.file.filename}`
      : null;

    if (
      !registry_esu_id ||
      !registry_lead_id ||
      !registry_amount ||
      !registry_date
    ) {
      return res.status(400).json({
        message:
          "registry_esu_id, registry_lead_id, registry_amount and registry_date are required",
      });
    }

    const currentTime = moment()
      .tz("Asia/Kolkata")
      .format("YYYY-MM-DD HH:mm:ss");

    const insertQuery = `
      INSERT INTO registry_details 
      (
        registry_esu_id,
        registry_lead_id,
        registry_amount,
        registry_date,
        registry_document_url,
        registry_notes,
        registry_created_at,
        registry_updated_at
      ) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      registry_esu_id,
      registry_lead_id,
      registry_amount,
      registry_date,
      registry_document_url || null,
      registry_notes || null,
      currentTime,
      currentTime,
    ];

    db.query(insertQuery, values, (err, result) => {
      if (err) {
        if (err.code === "ER_DUP_ENTRY") {
          return res.status(409).json({
            message:
              "Duplicate: registry_lead_id or registry_esu_id must be unique",
          });
        }
        return res.status(500).json({ message: "Database error", error: err });
      }

      const updateESUQuery = `
        UPDATE employee_sold_units
        SET esu_status = 'registry_done',
            esu_updated_at = ?
        WHERE esu_id = ?
      `;

      db.query(
        updateESUQuery,
        [currentTime, registry_esu_id],
        (updateErr, updateResult) => {
          if (updateErr) {
            return res.status(500).json({
              message: "Registry added but failed to update ESU status",
              error: updateErr,
            });
          }

          res.status(200).json({
            message: "Registry record created successfully & ESU updated",
            registry_id: result.insertId,
          });
        }
      );
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

const getRegistryBYleadId = async (req, res) => {
  try {
    const { leadId } = req.params.leadId;
    const selectQuery = `select * from registry_details left join employee_sold_units on employee_sold_units.esu_id = registry_details.registry_esu_id left join owner on owner.owner_id = employee_sold_units.esu_owner_id left join projects on projects.project_id = employee_sold_units.esu_project_id left join units on units.unit_id = employee_sold_units.esu_unit_id where registry_details.registry_lead_id = ?`;
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

const updateRegistry = (req, res) => {
  try {
    const { registry_id } = req.params;

    if (!registry_id) {
      return res.status(400).json({ message: "registry_id is required" });
    }

    const { registry_amount, registry_date, registry_notes } = req.body;

    const registry_document_url = req.file
      ? `/registry_documents/${req.file.filename}`
      : null;

    let updateFields = [];
    let values = [];

    if (registry_amount) {
      updateFields.push("registry_amount = ?");
      values.push(registry_amount);
    }

    if (registry_date) {
      updateFields.push("registry_date = ?");
      values.push(registry_date);
    }

    if (registry_notes) {
      updateFields.push("registry_notes = ?");
      values.push(registry_notes);
    }

    if (registry_document_url) {
      updateFields.push("registry_document_url = ?");
      values.push(registry_document_url);
    }

    if (updateFields.length === 0) {
      return res.status(400).json({ message: "No fields provided to update" });
    }

    updateFields.push("registry_updated_at = ?");
    const currentTime = moment()
      .tz("Asia/Kolkata")
      .format("YYYY-MM-DD HH:mm:ss");
    values.push(currentTime);

    values.push(registry_id);

    const updateQuery = `
      UPDATE registry_details 
      SET ${updateFields.join(", ")}
      WHERE registry_id = ?
    `;

    db.query(updateQuery, values, (err, result) => {
      if (err) {
        return res.status(500).json({ message: "Database error", error: err });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Registry record not found" });
      }

      res.status(200).json({
        message: "Registry record updated successfully",
      });
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

const deleteRegistry = (req, res) => {
  try {
    const { registry_id } = req.params;

    if (!registry_id) {
      return res
        .status(400)
        .json({ success: false, message: "registry_id is required" });
    }

    const checkQuery = `SELECT * FROM registry_details WHERE registry_id = ?`;

    db.query(checkQuery, [registry_id], (err, result) => {
      if (err) {
        return res.status(500).json({ success: false, message: err.message });
      }

      if (!result || result.length === 0) {
        return res
          .status(404)
          .json({ success: false, message: "Invalid registry ID" });
      }

      const deleteQuery = `DELETE FROM registry_details WHERE registry_id = ?`;

      db.query(deleteQuery, [registry_id], (err) => {
        if (err) {
          return res.status(500).json({ success: false, message: err.message });
        }

        return res.status(200).json({
          success: true,
          message: "Registry deleted successfully",
        });
      });
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const addUtilityCharges = (req, res) => {
  try {
    const {
      utility_esu_id,
      utility_lead_id,
      utility_type,
      utility_amount,
      utility_date,
      description,
    } = req.body;

    const dateTime = moment().tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss");

    const insertQuery = `
      INSERT INTO booking_details
      ( utility_esu_id,
      utility_lead_id,
      utility_type,
      utility_amount,
      utility_date,
      description, utility_created_at, utility_updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
      insertQuery,
      [
        utility_esu_id,
        utility_lead_id,
        utility_type,
        utility_amount,
        utility_date,
        description,
        dateTime,
        dateTime,
      ],
      (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: "Database Insert Error" });
        }

        const utilityId = result.insertId;

        return res.status(201).json({
          message: "Booking created successfully",
          data: {
            utilityId,
            utility_esu_id,
            utility_lead_id,
            utility_type,
            utility_amount,
            utility_date,
            description,
          },
        });
      }
    );
  } catch (error) {
    console.error("Unexpected Error:", error);
    return res.status(500).json({ message: error.message });
  }
};

const getUtilityBYleadId = async (req, res) => {
  try {
    const { leadId } = req.params.leadId;
    const selectQuery = `select * from utility_charges left join employee_sold_units on employee_sold_units.esu_id = utility_charges.utility_esu_id left join owner on owner.owner_id = employee_sold_units.esu_owner_id left join projects on projects.project_id = employee_sold_units.esu_project_id left join units on units.unit_id = employee_sold_units.esu_unit_id where utility_charges.utility_lead_id = ?`;
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

const updateUtilityCharges = (req, res) => {
  try {
    const { utility_id } = req.params;

    if (!utility_id) {
      return res.status(400).json({
        message: "utility_id is required",
      });
    }

    const {
      utility_esu_id,
      utility_lead_id,
      utility_type,
      utility_amount,
      utility_date,
      description,
    } = req.body;

    let updateFields = [];
    let updateValues = [];

    if (utility_esu_id !== undefined) {
      updateFields.push("utility_esu_id = ?");
      updateValues.push(utility_esu_id);
    }

    if (utility_lead_id !== undefined) {
      updateFields.push("utility_lead_id = ?");
      updateValues.push(utility_lead_id);
    }

    if (utility_type !== undefined) {
      updateFields.push("utility_type = ?");
      updateValues.push(utility_type);
    }

    if (utility_amount !== undefined) {
      updateFields.push("utility_amount = ?");
      updateValues.push(utility_amount);
    }

    if (utility_date !== undefined) {
      updateFields.push("utility_date = ?");
      updateValues.push(utility_date);
    }

    if (description !== undefined) {
      updateFields.push("description = ?");
      updateValues.push(description);
    }

    if (updateFields.length === 0) {
      return res.status(400).json({
        message: "No fields provided to update",
      });
    }

    const dateTime = moment().tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss");
    updateFields.push("utility_updated_at = ?");
    updateValues.push(dateTime);

    updateValues.push(utility_id);

    const updateQuery = `
      UPDATE utility_charges
      SET ${updateFields.join(", ")}
      WHERE utility_id = ?
    `;

    db.query(updateQuery, updateValues, (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Database Update Error" });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({
          message: "Utility record not found",
        });
      }

      return res.status(200).json({
        message: "Utility charges updated successfully",
        updatedFields: req.body,
      });
    });
  } catch (error) {
    console.error("Unexpected Error:", error);
    return res.status(500).json({ message: error.message });
  }
};

const deleteUtilityCharges = (req, res) => {
  try {
    const { utility_id } = req.params;

    if (!utility_id) {
      return res.status(400).json({
        message: "utility_id is required",
      });
    }

    const checkQuery = `SELECT * from utility_charges WHERE utility_id = ?`;

    db.query(checkQuery, [utility_id], (err, result) => {
      if (err) {
        console.error("Check Error:", err);
        return res.status(500).json({ message: "Database Error" });
      }

      if (result.length === 0) {
        return res.status(404).json({
          message: "Utility record not found",
        });
      }

      const deleteQuery = `DELETE FROM utility_charges WHERE utility_id = ?`;

      db.query(deleteQuery, [utility_id], (err, deleteResult) => {
        if (err) {
          console.error("Delete Error:", err);
          return res.status(500).json({ message: "Database Delete Error" });
        }

        return res.status(200).json({
          message: "Utility charges deleted successfully",
          deletedId: utility_id,
        });
      });
    });
  } catch (error) {
    console.error("Unexpected Error:", error);
    return res.status(500).json({ message: error.message });
  }
};

const updateSoldDetails = (req, res) => {
  try {
    const { esu_id, leadId, type } = req.params;
    const { esu_sale_price, esu_final_sold_date, esu_payment_method } =
      req.body;

    if (!esu_id || !leadId || !type) {
      return res.status(400).json({
        success: false,
        message: "esu_id, leadId and type are required",
      });
    }

    const esu_status = "sold";
    const dateTime = moment().tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss");
    const esu_updated_at = dateTime;

    const updateESUQuery = `
      UPDATE employee_sold_units 
      SET 
        esu_sale_price = ?, 
        esu_status = ?, 
        esu_final_sold_date = ?, 
        esu_payment_method = ?, 
        esu_updated_at = ?
      WHERE esu_id = ?
    `;

    const esuData = [
      esu_sale_price,
      esu_status,
      esu_final_sold_date,
      esu_payment_method,
      esu_updated_at,
      esu_id,
    ];

    db.query(updateESUQuery, esuData, (err, result) => {
      if (err) {
        console.error("ESU Update error:", err);
        return res.status(500).json({
          success: false,
          message: "Database update error while updating ESU",
        });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: "ESU record not found",
        });
      }

      let leadQuery = "";
      let successMsg = "";

      if (type === "general") {
        leadQuery = `
            UPDATE leads 
            SET lead_status = 'Sold'
            WHERE lead_id = ?
        `;
        successMsg = "General lead updated to Sold";
      } else if (type === "meta") {
        leadQuery = `
            UPDATE meta_leads 
            SET meta_lead_status = 'Sold'
            WHERE meta_id = ?
        `;
        successMsg = "Meta lead updated to Sold";
      } else {
        return res.status(400).json({
          success: false,
          message: "Invalid type. Use 'general' or 'meta'",
        });
      }

      db.query(leadQuery, [leadId], (leadErr, leadResult) => {
        if (leadErr) {
          console.error("Lead Update Error:", leadErr);
          return res.status(500).json({
            success: false,
            message: "Error updating lead status",
          });
        }

        if (leadResult.affectedRows === 0) {
          return res.status(404).json({
            success: false,
            message: "Lead record not found for provided leadId",
          });
        }

        return res.status(200).json({
          success: true,
          message: "Sold unit and lead status updated successfully",
          leadUpdate: successMsg,
        });
      });
    });
  } catch (error) {
    console.error("Server error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const addPaymentRecord = (req, res) => {
  try {
    const {
      pt_org_id,
      txn_id,
      pt_esu_id,
      pt_amount,
      pt_type,
      pt_method,
      receipt_url,
      pt_notes,
    } = req.body;

    const dateTime = moment().tz("Asia/Kolkata").format("DD-MM-YYYY HH:mm:ss");

    if (!txn_id || !pt_amount || !pt_type || !pt_method || !pt_org_id) {
      return res.status(400).json({
        success: false,
        message:
          "txn_id, pt_amount, pt_type, pt_org_id, pt_method are required",
      });
    }

    const query = `
      INSERT INTO payment_transactions 
      (pt_org_id, txn_id, pt_esu_id, pt_amount, pt_type, pt_method, txn_date, receipt_url, pt_notes, pt_created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      pt_org_id,
      txn_id,
      pt_esu_id || null,
      pt_amount,
      pt_type,
      pt_method,
      txn_date || null,
      receipt_url || null,
      pt_notes || null,
      dateTime,
    ];

    db.query(query, values, (err, result) => {
      if (err) {
        console.error("Insert Error:", err);
        return res.status(500).json({
          success: false,
          message: "Database error",
          error: err,
        });
      }

      return res.status(200).json({
        success: true,
        message: "Payment saved successfully",
        paymentId: result.insertId,
      });
    });
  } catch (error) {
    console.error("Catch Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const updatePaymentStatus = (req, res) => {
  const { bookingId } = req.params;
  const updatedAt = moment().tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss");

  const sqlQuery = `
    UPDATE booking_details 
    SET booking_pay_status = 'paid',
        booking_updated_at = ?
    WHERE booking_id = ?
  `;

  db.query(sqlQuery, [updatedAt, bookingId], (err, result) => {
    if (err) {
      console.error("Error updating booking:", err);
      return res.status(500).json({ message: "Database error" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Booking not found" });
    }

    return res.status(200).json({
      message: "Booking payment status updated to paid",
      booking_id: bookingId,
      updated_at: updatedAt,
    });
  });
};

const updateRegistryPaymentStatus = (req, res) => {
  const { registryId } = req.params;

  const updatedAt = moment().tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss");

  const sqlQuery = `
    UPDATE registry_details
    SET registry_pay_status = 'paid',
        registry_updated_at = ?
    WHERE registry_id = ?
  `;

  db.query(sqlQuery, [updatedAt, registryId], (err, result) => {
    if (err) {
      console.error("Error updating registry:", err);
      return res.status(500).json({ message: "Database error" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Registry record not found" });
    }

    return res.status(200).json({
      message: "Registry payment status updated to paid",
      registry_id: registryId,
      updated_at: updatedAt,
    });
  });
};

const updateUtilityPaymentStatus = (req, res) => {
  const { utilityId } = req.params;

  const updatedAt = moment().tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss");

  const sqlQuery = `
    UPDATE utility_charges
    SET utility_pay_status = 'paid',
        utility_updated_at = ?
    WHERE utility_id = ?
  `;

  db.query(sqlQuery, [updatedAt, utilityId], (err, result) => {
    if (err) {
      console.error("Error updating utility:", err);
      return res.status(500).json({ message: "Database error" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Utility record not found" });
    }

    return res.status(200).json({
      message: "Utility payment status updated to paid",
      registry_id: utilityId,
      updated_at: updatedAt,
    });
  });
};

const getAllTransanctionByESUId = (req, res) => {
  try {
    const { esuId, orgId } = req.params;
    const selectQuery = `select * from payment_transactions join company_profile on company_profile.org_id = payment_transactions.pt_org_id join employee_sold_units on employee_sold_units.esu_id = payment_transactions.pt_esu_id where payment_transactions.pt_org_id = ? and payment_transactions.pt_esu_id = ?`;
    db.query(selectQuery, [orgId, esuId], (err, result) => {
      if (err) {
        return res.status(400).json({ success: false, message: err.message });
      }
      return res.status(200).send(result);
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updatePaymentRecord = (req, res) => {
  try {
    const { payId } = req.params;
    const { txn_date, pt_method, pt_notes } = req.body;

    if (!payId) {
      return res.status(400).json({
        success: false,
        message: "Payment ID is required",
      });
    }

    // Prepare fields to update
    let updateFields = [];
    let values = [];

    if (txn_date) {
      updateFields.push("txn_date = ?");
      values.push(txn_date);
    }

    if (pt_method) {
      updateFields.push("pt_method = ?");
      values.push(pt_method);
    }

    if (pt_notes) {
      updateFields.push("pt_notes = ?");
      values.push(pt_notes);
    }

    if (updateFields.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid fields provided to update",
      });
    }

    // Add updated_at timestamp
    const updatedTime = moment()
      .tz("Asia/Kolkata")
      .format("DD-MM-YYYY HH:mm:ss");
    updateFields.push("pt_updated_at = ?");
    values.push(updatedTime);

    values.push(payId);

    const query = `
      UPDATE payment_transactions
      SET ${updateFields.join(", ")}
      WHERE id = ?
    `;

    db.query(query, values, (err, result) => {
      if (err) {
        console.error("Update Error:", err);
        return res.status(500).json({
          success: false,
          message: "Database error",
          error: err,
        });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: "Payment record not found",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Payment updated successfully",
      });
    });
  } catch (error) {
    console.error("Catch Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

module.exports = {
  createBooking,
  getBookingBYleadId,
  updateBooking,
  createRegistry,
  getRegistryBYleadId,
  updateRegistry,
  deleteRegistry,
  addUtilityCharges,
  getUtilityBYleadId,
  updateUtilityCharges,
  deleteUtilityCharges,
  updateSoldDetails,
  addPaymentRecord,
  updatePaymentStatus,
  updateRegistryPaymentStatus,
  updateUtilityPaymentStatus,
  getAllTransanctionByESUId,
  updatePaymentRecord,
};
