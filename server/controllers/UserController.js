const express = require("express");
const { db } = require("../db");
const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");
const { sendEmail } = require("../utils/emailService");
const { sendWhatsAppLeadAssignedAlert } = require("../utils/whatsappUtils");

const Quotation = async (req, res) => {
  try {
    const { quotation_name, services } = req.body;
    const { employeeId, employee_name, lead_id } = req.body;

    if (!quotation_name || !services || services.length === 0) {
      return res
        .status(400)
        .json({ error: "Quotation name and services are required" });
    }

    const sqlQuotation =
      "INSERT INTO quotations_information (employeeId, employee_name, lead_id) VALUES (?, ?, ?)";
    const resultQuotation = await new Promise((resolve, reject) => {
      db.query(
        sqlQuotation,
        [quotation_name, employeeId, employee_name, lead_id],
        (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        }
      );
    });

    const quotationId = resultQuotation.insertId;
    const quotationName = quotation_name;

    const sqlServices =
      "INSERT INTO services_data (quotation_id, quotation_name, service_type, service_name, service_description, actual_price, offer_price, subscription_frequency) VALUES ?";
    const servicesValues = services.map((service) => [
      quotationId,
      quotationName,
      service.service_type,
      service.service_name,
      service.service_description,
      service.actual_price,
      service.offer_price,
      service.subscription_frequency,
    ]);

    await new Promise((resolve, reject) => {
      db.query(sqlServices, [servicesValues], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });

    res.status(200).json({
      success: true,
      message: "Quotation and services added successfully",
      quotation: {
        id: quotationId,
        quotation_name: quotationName,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const deleteQuotation = async (req, res) => {
  try {
    const { id } = req.params;

    // Begin a transaction
    await new Promise((resolve, reject) => {
      db.beginTransaction((err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });

    // Delete notes associated with the quotation
    const sqlDeleteNotes = "DELETE FROM notes WHERE quotation_id = ?";
    await new Promise((resolve, reject) => {
      db.query(sqlDeleteNotes, [id], (err, result) => {
        if (err) {
          db.rollback(() => reject(err));
        } else {
          resolve(result);
        }
      });
    });

    const sqlDeleteServices =
      "DELETE FROM services_data WHERE quotation_id = ?";
    await new Promise((resolve, reject) => {
      db.query(sqlDeleteServices, [id], (err, result) => {
        if (err) {
          db.rollback(() => reject(err));
        } else {
          resolve(result);
        }
      });
    });

    const sqlDeleteQuotation =
      "DELETE FROM quotations_information WHERE id = ?";
    await new Promise((resolve, reject) => {
      db.query(sqlDeleteQuotation, [id], (err, result) => {
        if (err) {
          db.rollback(() => reject(err));
        } else {
          resolve(result);
        }
      });
    });

    // Commit the transaction
    await new Promise((resolve, reject) => {
      db.commit((err) => {
        if (err) {
          db.rollback(() => reject(err));
        } else {
          resolve();
        }
      });
    });

    res.status(200).json({
      success: true,
      message: "Quotation deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const GetQuotation = async (req, res) => {
  try {
    const sql = "SELECT * FROM quotations_information ORDER BY id DESC";

    const quotations = await new Promise((resolve, reject) => {
      db.query(sql, (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });

    res.status(200).json(quotations);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getAllQuotation = async (req, res) => {
  try {
    const sql = "SELECT * FROM quotations_information";

    const allQuotations = await new Promise((resolve, reject) => {
      db.query(sql, (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });

    res.status(200).json({ message: "Successfull", data: allQuotations });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", success: false, error });
  }
};

const GetQuotationName = async (req, res) => {
  try {
    const { quotationId } = req.params;
    const sql = "SELECT * FROM quotations_information WHERE id = ? ";

    const quotations = await new Promise((resolve, reject) => {
      db.query(sql, [quotationId], (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });

    res.status(200).json(quotations);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const UpdateQuotationName = async (req, res) => {
  try {
    const { quotationId } = req.params;
    const {
      customer_name,
      contact_number,
      alternate_number,
      address,
      adhaar_number,
      pan_number,
      project_name,
      unit_number,
      dimension,
      rate,
      variant,
      total_deal,
      booking_amount,
      booking_amount_words,
      payment_mode,
      finance_bank,
      duration,
      balance_amount,
      balance_amount_words,
      payment_due_date1,
      payment_due_date2,
      payment_due_date3,
      payment_due_date4,
      registry_charges,
      p1p2_charges,
      remarks,
    } = req.body;

    const sql = `
      UPDATE quotations_information SET customer_name = ?, contact_number = ?, alternate_number = ?, address = ?, adhaar_number = ?, pan_number = ?, project_name = ?, unit_number = ?, dimension = ?, rate = ?, variant = ?, total_deal = ?, booking_amount = ?, booking_amount_words = ?, payment_mode = ?, finance_bank = ?, duration = ?,           balance_amount = ?, balance_amount_words = ?, payment_due_date1 = ?, 
          payment_due_date2 = ?, payment_due_date3 = ?, payment_due_date4 = ?, 
          registry_charges = ?, p1p2_charges = ?, remarks = ? 
      WHERE id = ?`;

    // Execute the update query asynchronously
    await new Promise((resolve, reject) => {
      db.query(
        sql,
        [
          customer_name,
          contact_number,
          alternate_number,
          address,
          adhaar_number,
          pan_number,
          project_name,
          unit_number,
          dimension,
          rate,
          variant,
          total_deal,
          booking_amount,
          booking_amount_words,
          payment_mode,
          finance_bank,
          duration,
          balance_amount,
          balance_amount_words,
          payment_due_date1,
          payment_due_date2,
          payment_due_date3,
          payment_due_date4,
          registry_charges,
          p1p2_charges,
          remarks,
          quotationId,
        ],
        (err, results) => {
          if (err) {
            reject(err);
          } else {
            resolve(results);
          }
        }
      );
    });

    res.status(200).json({ message: "Quotation updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const CopyQuotationData = async (req, res) => {
  try {
    const { quotationId } = req.params;
    const sqlQuotation = "SELECT * FROM quotations_information WHERE id = ?";

    const [quotation] = await new Promise((resolve, reject) => {
      db.query(sqlQuotation, [quotationId], (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });

    if (!quotation) {
      return res.status(404).json({ error: "Quotation not found" });
    }

    const newQuotationName = `Copy of ${quotation.quotation_name}`;

    const result = await db.query(
      "INSERT INTO quotations_information (customer_name, user_id) VALUES (?, ?)",
      [newQuotationName, quotation.user_id]
    );

    const sqlgetId =
      "SELECT * FROM quotations_information WHERE customer_name = ?";
    const [getId] = await new Promise((resolve, reject) => {
      db.query(sqlgetId, [newQuotationName], (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
    const newQuotationId = getId.quotation_id;

    const sqlGetServices = "SELECT * FROM services_data WHERE quotation_id = ?";

    const services = await new Promise((resolve, reject) => {
      db.query(sqlGetServices, [quotationId], (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });

    const sqlServices =
      "INSERT INTO services_data (quotation_id, quotation_name, service_type, service_name, service_description, actual_price, offer_price, subscription_frequency) VALUES ?";
    const servicesValues = services.map((service) => [
      newQuotationId,
      newQuotationName,
      service.service_type,
      service.service_name,
      service.service_description,
      service.actual_price,
      service.offer_price,
      service.subscription_frequency,
    ]);

    await new Promise((resolve, reject) => {
      db.query(sqlServices, [servicesValues], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });

    const sqlNotes = "SELECT * FROM notes WHERE quotation_id = ?";

    const getNotes = await new Promise((resolve, reject) => {
      db.query(sqlNotes, [quotationId], (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });

    if (!Array.isArray(getNotes)) {
    } else {
      const notesValues = getNotes.map((note) => [
        note.note_text,
        newQuotationId,
      ]);

      const insertNotesQuery =
        "INSERT INTO notes (note_text, quotation_id) VALUES ?";

      db.query(insertNotesQuery, [notesValues], (err, result) => {
        if (err) {
        } else {
        }
      });
    }

    res
      .status(200)
      .json({ message: "Quotation and services data copied successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

Quotationviaid = (req, res) => {
  try {
    const quotation_id = req.params.id;

    const getQuery = `
    SELECT qd.* 
    FROM quotations_information qd 
    WHERE qd.id = ?
  `;

    db.query(getQuery, quotation_id, (error, result) => {
      if (error) {
        res
          .status(500)
          .json({ error: error, message: "Internal Server Error" });
      } else {
        res.status(200).json(result);
      }
    });
  } catch (error) {
    res.status(500).json({ error: error, message: "Internal Server Error" });
  }
};

const addServices = async (req, res) => {
  try {
    const { id } = req.params;
    const { quotation_name, services } = req.body;

    if (!id || !quotation_name || !services || services.length === 0) {
      return res
        .status(400)
        .json({ error: "Quotation ID, name, and services are required" });
    }

    const servicesValues = services.map((service) => [
      id,
      quotation_name,
      service.service_type,
      service.service_name,
      service.service_description,
      service.actual_price,
      service.offer_price,
      service.subscription_frequency,
    ]);

    const sql =
      "INSERT INTO services_data (quotation_id, quotation_name, service_type, service_name, service_description, actual_price, offer_price, subscription_frequency) VALUES ?";

    await new Promise((resolve, reject) => {
      db.query(sql, [servicesValues], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });

    res
      .status(201)
      .json({ success: true, message: "Services added successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const deleteService = async (req, res) => {
  try {
    const { serviceId } = req.params;

    const result = await new Promise((resolve, reject) => {
      db.query(
        "DELETE FROM services_data WHERE service_id = ?",
        [serviceId],
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
        .json({ success: true, message: "Service deleted successfully" });
    } else {
      res.status(404).json({ error: "Service not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const GetServices = (req, res) => {
  try {
    const getquery = "SELECT * FROM services";

    db.query(getquery, (error, result) => {
      if (error) {
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        const user = result;
        res.status(200).json({
          success: true,
          message: "services added successfully",
          services: user,
        });
      }
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateServices = async (req, res) => {
  try {
    const { quotationId } = req.params;
    const { services } = req.body;

    const updateServicePromises = services.map(async (service) => {
      const sqlUpdateService = `
          UPDATE services_data
          SET
            service_type = ?,
            service_name = ?,
            service_description = ?,
            actual_price = ?,
            offer_price = ?,
            subscription_frequency = ?
          WHERE
            quotation_id = ? AND service_id = ?`;

      const values = [
        service.service_type,
        service.service_name,
        service.service_description,
        service.actual_price,
        service.offer_price,
        service.subscription_frequency,
        quotationId,
        service.service_id,
      ];

      await db.query(sqlUpdateService, values);
    });

    await Promise.all(updateServicePromises);

    res
      .status(200)
      .json({ success: true, message: "Services updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const Notes = (req, res) => {
  const { noteTexts, quotationId } = req.body;
  const values = noteTexts.map((text) => [text, quotationId]);
  const sql = "INSERT INTO notes (note_text, quotation_id) VALUES ?";
  db.query(sql, [values], (err, result) => {
    if (err) {
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      res.status(201).json({ ids: result.insertId });
    }
  });
};

const getNotes = (req, res) => {
  const { quotationId } = req.params;
  const sql = "SELECT * FROM notes WHERE quotation_id = ?";
  db.query(sql, [quotationId], (err, result) => {
    if (err) {
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      res.status(200).json(result);
    }
  });
};

const deleteNote = (req, res) => {
  const noteId = req.params.noteId;
  const sql = "DELETE FROM notes WHERE id = ?";
  db.query(sql, [noteId], (err, result) => {
    if (err) {
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      res.status(200).json({ message: "Note deleted successfully" });
    }
  });
};
const updateNote = async (req, res) => {
  const { notes } = req.body;

  try {
    await Promise.all(
      notes.map(async (note) => {
        const { id, quotation_id, note_text } = note;
        await db.query(
          "UPDATE notes SET note_text = ? WHERE id = ? AND quotation_id = ?",
          [note_text, id, quotation_id]
        );
      })
    );
    res
      .status(200)
      .json({ success: true, message: "Notes updated successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

const getnotes_text = (req, res) => {
  const sql = "SELECT notes_text FROM notes_data";
  db.query(sql, (err, result) => {
    if (err) {
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      const notes = result.map((row) => row.notes_text);
      res.json(notes);
    }
  });
};

// const createLead = (req, res) => {
//   const {
//     lead_org_id,
//     lead_no,
//     name,
//     phone,
//     assignedTo,
//     leadSource,
//     employeeId,
//     project_name,
//     main_project_id,
//     unit_type,
//     unit_id,
//     address,
//     createdTime,
//     actual_date,
//     assignedBy,
//     user_id,
//   } = req.body;
//   console.log(user_id);

//   const sql = `INSERT INTO leads (lead_org_id, lead_no, name, phone, assignedTo, leadSource, employeeId,project_name,main_project_id,unit_type,unit_id,address,createdTime,actual_date,assignedBy,user_id) VALUES (?,?,?,?,?,?,?, ?,?, ?,?, ?, ?,?,?,?)`;
//   db.query(
//     sql,
//     [
//       lead_org_id,
//       lead_no,
//       name,
//       phone,
//       assignedTo,
//       leadSource,
//       employeeId,
//       project_name,
//       main_project_id,
//       unit_type,
//       unit_id,
//       address,
//       createdTime,
//       actual_date,
//       assignedBy,
//       user_id,
//     ],
//     (err, results) => {
//       if (err) {
//         res.status(500).json({ error: "Error inserting data" });
//       } else {
//         res
//           .status(201)
//           .json({ success: true, message: "Lead data successfully submitted" });
//       }
//     }
//   );
// };

const createLead = (req, res) => {
  const {
    lead_org_id,
    name,
    phone,
    lead_email,
    assignedTo,
    leadSource,
    main_project_id,
    unit_type,
    unit_id,
    address,
    createdTime,
    actual_date,
    assignedBy,
  } = req.body;

  const sql = `INSERT INTO leads 
    (lead_org_id, name, phone, lead_email, assignedTo, leadSource, main_project_id, unit_type, unit_id, address, createdTime, actual_date, assignedBy) 
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`;

  db.query(
    sql,
    [
      lead_org_id,
      name,
      phone,
      lead_email,
      assignedTo,
      leadSource,
      main_project_id,
      unit_type,
      unit_id,
      address,
      createdTime,
      actual_date,
      assignedBy,
    ],
    async (err, results) => {
      if (err) {
        return res.status(500).json({ success: false, message: err.message });
      }

      if (assignedTo) {
        const staffQuery =
          "SELECT staff_name, staff_email, staff_phone FROM company_staff WHERE staff_id = ?";

        db.query(staffQuery, [assignedTo], async (err, staffResult) => {
          if (err) {
            console.error("Error fetching staff details:", err.message);
          } else if (staffResult.length > 0) {
            const staff = staffResult[0];

            const subject = "CRMGuru - New General Lead Assigned";

            const text = `Dear ${staff.staff_name},

A new lead has been assigned to you in CRMGuru.

Please log in to your dashboard to view the lead details.

Best regards,
CRMGuru Team`;

            const html = `
              <p>Dear <strong>${staff.staff_name}</strong>,</p>
              <p>A new lead has been <strong>assigned to you</strong> in <b>CRMGuru</b>.</p>
              <p>Please log in to your dashboard to check the details.</p>
              <br/>
              <p>Best regards,<br/>CRMGuru Team</p>
            `;

            // -----------------------------
            // ✔ Send Email
            // -----------------------------
            try {
              await sendEmail(staff.staff_email, subject, text, html);
              console.log("Lead assignment email sent to:", staff.staff_email);
            } catch (emailErr) {
              console.error("Email sending failed:", emailErr.message);
            }

            // -----------------------------
            // ✔ Send WhatsApp Alert
            // -----------------------------
            if (staff.staff_phone) {
              try {
                await sendWhatsAppLeadAssignedAlert(
                  staff.staff_phone,
                  staff.staff_name
                );
                console.log("WhatsApp lead alert sent to:", staff.staff_phone);
              } catch (waErr) {
                console.error("WhatsApp sending failed:", waErr);
              }
            } else {
              console.warn("No phone number found for staff:", assignedTo);
            }
          } else {
            console.warn("No staff found with ID:", assignedTo);
          }
        });
      }

      return res
        .status(201)
        .json({ success: true, message: "Lead data successfully submitted" });
    }
  );
};

const getleadbyid = (req, res) => {
  try {
    const { id } = req.params;
    const getQuery = `SELECT * FROM leads join company_staff on company_staff.staff_id = leads.assignedTo join projects on projects.project_id = leads.main_project_id join units on units.unit_project_id = leads.main_project_id WHERE leads.lead_id = ?`;
    db.query(getQuery, [id], (error, result) => {
      if (error) {
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        res.status(200).json(result);
      }
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getvisit = (req, res) => {
  try {
    const { id } = req.params;
    const getQuery = `SELECT * FROM leads WHERE lead_id = ?`;
    db.query(getQuery, [id], (error, result) => {
      if (error) {
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        res.status(200).json(result);
      }
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getLeads = (req, res) => {
  const { userId } = req.params;
  const sql =
    "SELECT * FROM leads join company_staff on company_staff.staff_id = leads.assignedTo WHERE leads.lead_org_id = ? ORDER BY lead_id DESC";
  db.query(sql, [userId], (err, results) => {
    if (err) {
      res.status(500).json({ success: false, message: err.message });
    } else {
      res.status(200).send(results);
    }
  });
};

const updateLead = async (req, res) => {
  try {
    const { leadId } = req.params;
    const {
      lead_no,
      name,
      phone,
      assignedTo,
      leadSource,
      employeeId,
      createdTime,
      actual_date,
      project_name,
      main_project_id,
      unit_type,
      unit_id,
      address,
    } = req.body;

    const sql = `UPDATE leads SET lead_no = ?, name = ?, phone = ?, assignedTo = ?, employeeId = ?, leadSource = ?, createdTime = ?, actual_date = ?, project_name= ?,main_project_id = ?,unit_type = ?, unit_id = ?, address = ? WHERE lead_id = ?`;

    await new Promise((resolve, reject) => {
      db.query(
        sql,
        [
          lead_no,
          name,
          phone,
          assignedTo,
          employeeId,
          leadSource,
          createdTime,
          actual_date,
          project_name,
          main_project_id,
          unit_type,
          unit_id,
          address,
          leadId,
        ],
        (err, results) => {
          if (err) {
            reject(err);
          } else {
            resolve(results);
          }
        }
      );
    });

    if (assignedTo) {
      const staffQuery =
        "SELECT staff_name, staff_email FROM company_staff WHERE staff_id = ?";
      db.query(staffQuery, [assignedTo], async (err, staffResult) => {
        if (err) {
          console.error("Error fetching staff details:", err.message);
        } else if (staffResult.length > 0) {
          const staff = staffResult[0];

          const subject = "CRMGuru - New Lead Assigned";
          const text = `Dear ${staff.staff_name},

A new lead has been assigned to you in CRMGuru.

Please log in to your dashboard to view the lead details.

Best regards,
CRMGuru Team`;

          const html = `
            <p>Dear <strong>${staff.staff_name}</strong>,</p>
            <p>A new lead has been <strong>assigned to you</strong> in <b>CRMGuru</b>.</p>
            <p>Please log in to your dashboard to check the details.</p>
            <br/>
            <p>Best regards,<br/>CRMGuru Team</p>
          `;

          try {
            await sendEmail(staff.staff_email, subject, text, html);
            console.log("Lead assignment email sent to:", staff.staff_email);
          } catch (emailErr) {
            console.error("Email sending failed:", emailErr.message);
          }
        } else {
          console.warn("No staff found with ID:", assignedTo);
        }
      });
    }

    res.status(200).json({ message: "Lead updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const deleteLead = (req, res) => {
  const { leadId } = req.params;

  if (!leadId) {
    return res.status(400).json({ error: "Lead ID is required" });
  }

  const sqlVisit = `DELETE FROM visit WHERE lead_id = ?`;
  db.query(sqlVisit, [leadId], (err, visitResults) => {
    if (err) {
      return res.status(500).json({ error: "Error deleting from visit table" });
    }

    const sqlLeads = `DELETE FROM leads WHERE lead_id = ?`;
    db.query(sqlLeads, [leadId], (err, leadResults) => {
      if (err) {
        return res
          .status(500)
          .json({ error: "Error deleting from leads table" });
      }

      if (leadResults.affectedRows === 0) {
        return res.status(404).json({ error: "Lead not found" });
      }

      res.status(200).json({
        success: true,
        message: "Lead data successfully deleted from both tables",
      });
    });
  });
};

const employeeData = (req, res) => {
  const { id } = req.params;
  const sql = `SELECT * FROM employee WHERE user_id = ?`;

  db.query(sql, [id], (err, results) => {
    if (err) {
      res.status(500).json({ error: "Error fetchinf data " });
    } else {
      res.status(201).json(results);
    }
  });
};

const editProfile = async (req, res) => {
  try {
    const { user_name, email, phone, mobile, address, interested_in, bio } =
      req.body;
    const profile_picture = req.file ? req.file.buffer : null;

    if (!user_name || !email) {
      return res.status(400).json({ error: "Name and email are required" });
    }

    const checkUserQuery = "SELECT * FROM user_data WHERE email = ?";
    db.query(checkUserQuery, [email], (err, result) => {
      if (err) {
        return res.status(500).json({ error: "Internal server error" });
      }

      if (result.length === 0) {
        const insertUserQuery = `
          INSERT INTO user_data (user_name, email, profile_picture, phone, mobile, address, interested_in, bio)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const insertParams = [
          user_name,
          email,
          profile_picture,
          phone,
          mobile,
          address,
          interested_in,
          bio,
        ];

        db.query(insertUserQuery, insertParams, (insertErr) => {
          if (insertErr) {
            return res.status(500).json({ error: "Internal server error" });
          } else {
            return res.status(201).json({
              success: true,
              message: "New user profile created successfully",
            });
          }
        });
      } else {
        const updateUserQuery = `UPDATE user_data SET user_name = ?, profile_picture = ?, phone = ?, mobile = ?, address = ?, interested_in = ?, bio = ? WHERE email = ?`;

        const updateParams = [
          user_name,
          profile_picture,
          phone,
          mobile,
          address,
          interested_in,
          bio,
          email,
        ];

        db.query(updateUserQuery, updateParams, (updateErr) => {
          if (updateErr) {
            return res.status(500).json({ error: "Internal server error" });
          } else {
            return res.status(200).json({
              success: true,
              message: "User profile updated successfully",
            });
          }
        });
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error in editing profile",
      error: error.message,
    });
  }
};

const deleteProfile = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const deleteUserQuery = "DELETE FROM user_data WHERE email = ?";
    db.query(deleteUserQuery, [email], (err, result) => {
      if (err) {
        return res.status(500).json({ error: "Internal server error" });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "User not found" });
      }

      return res
        .status(200)
        .json({ success: true, message: "Profile deleted successfully" });
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const getAllUsersQuery = "SELECT * FROM user_data";

    db.query(getAllUsersQuery, (err, result) => {
      if (err) {
        return res.status(500).json({ error: "Internal server error" });
      }

      return res.status(200).json({
        success: true,
        data: result,
        message: "Users retrieved successfully",
      });
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error in retrieving users",
      error: error.message,
    });
  }
};

const updateQuotationStatus = async (req, res) => {
  try {
    const { id, status } = req.body;

    if (!id || !status) {
      return res.status(400).json({
        message: "quotation_id and status are required",
        success: false,
      });
    }

    const sql = "UPDATE quotations_information SET status = ? WHERE id = ?";

    const updateStatus = await new Promise((resolve, reject) => {
      db.query(sql, [status, id], (err, result) => {
        if (err) {
          return reject(err);
        }
        resolve(result);
      });
    });

    if (updateStatus.affectedRows === 0) {
      return res.status(404).json({
        message: "Quotation not found",
        success: false,
      });
    }

    res.status(200).json({
      message: "Quotation status updated successfully",
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
      success: false,
      error: error.message,
    });
  }
};

const quotationInformationForm = async (req, res) => {
  const formData = req.body;

  const query = `INSERT INTO quotations_information (customer_name, contact_number, alternate_number, address, adhaar_number, pan_number,
    project_name, unit_number, dimension, rate, variant, total_deal, booking_amount, booking_amount_words, payment_mode, finance_bank, duration, balance_amount, balance_amount_words, payment_due_date1, payment_due_date2, payment_due_date3, payment_due_date4, registry_charges, p1p2_charges, remarks, employeeId, employee_name, lead_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  const values = [
    formData.customerName,
    formData.contactNumber,
    formData.alternateNumber,
    formData.address,
    formData.adhaarNumber,
    formData.panNumber,
    formData.projectName,
    formData.unitNumber,
    formData.dimension,
    formData.rate,
    formData.variant,
    formData.totalDeal,
    formData.bookingAmount,
    formData.bookingAmountWords,
    formData.paymentMode,
    formData.financeBank,
    formData.duration,
    formData.balanceAmount,
    formData.balanceAmountWords,
    formData.paymentDueDate1,
    formData.paymentDueDate2,
    formData.paymentDueDate3,
    formData.paymentDueDate4,
    formData.registryCharges,
    formData.p1p2Charges,
    formData.remarks,
    formData.employeeId,
    formData.employee_name,
    formData.lead_id,
  ];

  db.query(query, values, (err, result) => {
    if (err) {
      res.status(500).json({ message: "Error saving data" });
      return;
    }
    res
      .status(200)
      .json({ message: "Data saved successfully", id: result.insertId });
  });
};

const getLeadsByIdVisit = (req, res) => {
  const employeeId = req.params.employeeId;

  const sql = `select * from visit join leads on leads.lead_id = visit.vis_lead_id join projects on projects.project_id = leads.main_project_id join company_staff on company_staff_staff_id = visit.vis_staff_id where visit.vis_staff_id = ?`;

  db.query(sql, [employeeId], (err, results) => {
    if (err) {
      res.status(400).json({ success: false, error: err.message });
    } else {
      res.status(200).send(results);
    }
  });
};

const getLeadsVisit = (req, res) => {
  const sql = `
    SELECT 
      visit.visit,
      visit.visit_date,
      visit.report,
        leads.lead_id,
      leads.lead_no,
      leads.name,
      leads.assignedTo,
      leads.employeeId,
      leads.createdTime,
      leads.actual_date,
      leads.phone,
      leads.leadSource,
      leads.lead_status,
      leads.subject,
      leads.booking_amount,
      leads.payment_mode,
      leads.registry,
      leads.address,
      leads.quotation,
      leads.quotation_status,
      leads.deal_status,
      leads.d_closeDate,
      leads.status,
      leads.reason,
      leads.follow_up_status
    FROM 
      leads
    LEFT JOIN 
      visit ON visit.lead_id = leads.lead_id AND visit.employeeId = leads.employeeId;
  `;

  db.query(sql, (err, results) => {
    if (err) {
      res.status(500).json({ error: "Error fetching data" });
    } else {
      res.status(200).json(results);
    }
  });
};

const addProject = (req, res) => {
  const { project_org_id, user_id, projectName, location, total_area } =
    req.body;

  if (!project_org_id || !projectName || !location || !total_area || !user_id) {
    return res.status(400).json({ error: "Required fields are missing." });
  }

  const query = `
    INSERT INTO projects (
      project_org_id, user_id, project_name, location, total_area
    ) VALUES (?, ?, ?,?, ?)
  `;

  const values = [project_org_id, user_id, projectName, location, total_area];

  db.query(query, values, (err, result) => {
    if (err) {
      return res.status(500).json({ success: false, message: err.message });
    }

    res.status(200).json({ message: "Project added successfully." });
  });
};

const getAllProjects = (req, res) => {
  const { userId, orgId } = req.params;
  const query =
    "SELECT * FROM projects WHERE user_id = ? and project_org_id = ?";

  db.query(query, [userId, orgId], (err, results) => {
    if (err) {
      console.error("Error fetching projects from database:", err);
      return res.status(500).json({ error: "Failed to fetch projects." });
    }

    res.status(200).send(results);
  });
};

const editProject = (req, res) => {
  const { id } = req.params;
  const { project_name, location, total_area } = req.body;

  const sql = `
    UPDATE projects
    SET project_name = ?, location = ?, total_area = ?
    WHERE main_project_id = ?
  `;

  db.query(sql, [project_name, location, total_area, id], (err, result) => {
    if (err) {
      console.error("Error updating project:", err);
      return res.status(500).json({ message: "Server error", error: err });
    }

    if (result.affectedRows > 0) {
      res.status(200).json({ message: "Project updated successfully" });
    } else {
      res.status(404).json({ message: "Project not found" });
    }
  });
};

const deleteProject = async (req, res) => {
  const { id } = req.params;

  try {
    const leadsResult = await new Promise((resolve, reject) => {
      db.query(
        "SELECT * FROM leads WHERE main_project_id = ? AND project_name <> ''",
        [id],
        (err, result) => {
          if (err) return reject(err);
          resolve(result);
        }
      );
    });

    if (leadsResult.length > 0 && req.query.confirm !== "true") {
      return res.status(400).json({
        message:
          "This project is allocated. Are you sure you want to delete it? Click OK to confirm, or Cancel to abort.",
      });
    }

    const deleteResult = await new Promise((resolve, reject) => {
      db.query(
        "DELETE FROM projects WHERE main_project_id = ?",
        [id],
        (err, result) => {
          if (err) return reject(err);
          resolve(result);
        }
      );
    });

    if (deleteResult.affectedRows > 0) {
      res.status(200).json({ message: "Project deleted successfully" });
    } else {
      res.status(404).json({ message: "Project not found" });
    }
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
};

const updateUnit = async (req, res) => {
  const unit_id = req.params.id;
  const { unit_type, unit_size, total_units, custom_unit_type, base_price } =
    req.body;
  const updatedAt = moment().tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss");

  try {
    const fields = [];
    const values = [];

    if (unit_type !== undefined) {
      fields.push("unit_type = ?");
      values.push(unit_type);
    }

    if (custom_unit_type !== undefined) {
      fields.push("custom_unit_type = ?");
      values.push(custom_unit_type);
    }

    if (unit_size !== undefined) {
      fields.push("unit_size = ?");
      values.push(unit_size);
    }
    if (total_units !== undefined) {
      fields.push("total_units = ?");
      values.push(total_units);
    }
    if (base_price !== undefined) {
      fields.push("base_price = ?");
      values.push(base_price);
    }

    fields.push("unit_updated_at = ?");
    values.push(updatedAt);

    if (fields.length === 0) {
      return res.status(400).json({ message: "No fields provided to update" });
    }

    values.push(unit_id);

    const sql = `UPDATE units SET ${fields.join(", ")} WHERE unit_id = ?`;

    db.query(sql, values, async (err, result) => {
      if (err) {
        return res.status(500).json({ message: "Server error", error: err });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Unit not found" });
      }

      res
        .status(200)
        .json({ success: true, message: "Unit updated successfully" });
    });
  } catch (err) {
    res.status(500).json({ message: "Unexpected error", error: err });
  }
};

const addUnit = async (req, res) => {
  try {
    const {
      unit_org_id,
      unit_project_id,
      unit_number,
      unit_area,
      unit_type,
      custom_unit_type,
      base_price,
      unit_status,
    } = req.body;
    const dateTime = moment().tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss");

    if (!unit_project_id || !unit_type || !unit_area) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const insertUnitQuery = `INSERT INTO units (unit_org_id, unit_project_id, unit_number, unit_area, unit_type, custom_unit_type, base_price, unit_status, unit_created_at) 
                           VALUES (?, ?, ?, ?, ?,?,?, ?,?)`;

    const insertParams = [
      unit_org_id,
      unit_project_id,
      unit_number,
      unit_area,
      unit_type,
      custom_unit_type,
      base_price,
      unit_status,
      dateTime,
    ];
    db.query(insertUnitQuery, insertParams, (err, result) => {
      if (err) {
        res.status(400).json({ success: false, message: err.message });
      }
      res
        .status(200)
        .json({ success: true, message: "unit added successfully" });
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const editUnitdetails = (req, res) => {
  const id = req.params.id;
  const { base_price, unit_size } = req.body;

  const sql = `
    UPDATE unit_data
    SET base_price = ?, unit_size = ?
    WHERE id = ?
  `;

  db.query(sql, [base_price, unit_size, req.params.id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Server error", error: err });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Unit not found for update" });
    }

    res.status(200).json({
      message: "Unit updated successfully",
      data: {
        base_price,
        unit_size,
      },
    });
  });
};

const deleteUnit = async (req, res) => {
  try {
    const unit_id = req.params.id;
    const deleteQuery = `DELETE FROM units WHERE unit_id = ?`;

    db.query(deleteQuery, [unit_id], (err, result) => {
      if (err) {
        return res.status(400).json({ success: false, message: err.message });
      }

      if (result.affectedRows === 0) {
        return res
          .status(404)
          .json({ success: false, message: "Unit not found" });
      }

      return res
        .status(200)
        .json({ success: true, message: "Unit deleted successfully" });
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const getUnits = async (req, res) => {
  const { main_project_id, unit_type } = req.query;

  let query = "SELECT * FROM units ORDER BY unit_id DESC;";
  let queryParams = [];

  if (main_project_id || unit_type) {
    query += " WHERE";
    if (main_project_id) {
      query += " main_project_id = ?";
      queryParams.push(main_project_id);
    }
    if (unit_type) {
      if (main_project_id) {
        query += " AND";
      }
      query += " unit_type = ?";
      queryParams.push(unit_type);
    }
  }

  try {
    const result = await new Promise((resolve, reject) => {
      db.query(query, queryParams, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });

    if (result.length === 0) {
      return res.status(404).json({ message: "No units found" });
    }

    res.status(200).json({
      message: "Units retrieved successfully",
      data: result,
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch units",
      error: err.message || "Unknown error",
    });
  }
};

const getUnitById = async (req, res) => {
  const project_id = req.params.id;

  if (!project_id) {
    return res
      .status(400)
      .json({ message: "project_id is required in the URL" });
  }

  const query = "SELECT * FROM projects WHERE main_project_id = ?"; // `main_project_id` primary key hai

  try {
    const result = await new Promise((resolve, reject) => {
      db.query(query, [project_id], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });

    if (result.length === 0) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.status(200).json({
      message: "Project retrieved successfully",
      data: result[0],
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch project",
      error: err.message || "Unknown error",
    });
  }
};

const getUnitsdistributeById = (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "main_project_id is required" });
  }

  const query = "SELECT * FROM units WHERE main_project_id = ?";
  db.query(query, [id], (err, results) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Database error", error: err.message });
    }

    if (results.length === 0) {
      return res
        .status(404)
        .json({ message: "No units found for this project" });
    }
    return res.status(200).json({ data: results });
  });
};

const getUnitsByProject = async (req, res) => {
  const main_project_id = req.query.main_project_id;

  if (!main_project_id) {
    return res
      .status(400)
      .json({ message: "main_project_id is required as a query parameter" });
  }

  const query = "SELECT * FROM units WHERE main_project_id = ?";

  try {
    const result = await new Promise((resolve, reject) => {
      db.query(query, [main_project_id], (err, result) => {
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
        .json({ message: "No units found for this project" });
    }

    res.status(200).json({
      message: "Units for project retrieved successfully",
      data: result,
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch units for project",
      error: err.message || "Unknown error",
    });
  }
};

const updateUnitmanualy = async (req, res) => {
  const unit_id = req.params.unit_id;
  const {
    unit_type,
    unit_size,
    total_units,
    units_sold,
    base_price,
    additional_costs,
    amenities,
  } = req.body;

  const units_remaining = total_units - units_sold;

  const query = `UPDATE units SET 
                    unit_type = ?, 
                    unit_size = ?, 
                    total_units = ?, 
                    units_sold = ?, 
                    units_remaining = ?, 
                    base_price = ?, 
                    additional_costs = ?, 
                    amenities = ?
                  WHERE unit_id = ?`;

  try {
    const result = await new Promise((resolve, reject) => {
      db.query(
        query,
        [
          unit_type,
          unit_size,
          total_units,
          units_sold,
          units_remaining,
          base_price,
          additional_costs,
          amenities,
          unit_id,
        ],
        (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        }
      );
    });

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Unit not found for update" });
    }

    res.status(200).json({
      message: "Unit updated successfully",
      data: {
        unit_id,
        unit_type,
        unit_size,
        total_units,
        units_sold,
        units_remaining,
        base_price,
        additional_costs,
        amenities,
      },
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to update unit",
      error: err.message || "Unknown error",
    });
  }
};

const getUnitByProjectId = async (req, res) => {
  const main_project_id = req.params.id;

  if (!main_project_id) {
    return res
      .status(400)
      .json({ message: "main_project_id is required in the URL" });
  }

  const query = "SELECT * FROM units WHERE main_project_id = ?"; // `main_project_id` primary key hai

  try {
    const result = await new Promise((resolve, reject) => {
      db.query(query, [main_project_id], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });

    if (result.length === 0) {
      return res.status(404).json({ message: "Project unit not found" });
    }

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch project unit",
      error: err.message || "Unknown error",
    });
  }
};

const getUnitDetailsById = async (req, res) => {
  const unit_id = req.params.id;
  if (!unit_id) {
    return res.status(400).json({ message: "unit_id is required in the URL" });
  }

  const query = "SELECT * FROM unit_data WHERE unit_id = ?";

  try {
    const result = await new Promise((resolve, reject) => {
      db.query(query, [unit_id], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });

    if (result.length === 0) {
      return res.status(404).json({ message: "Unit not found" });
    }

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch unit details",
      error: err.message || "Unknown error",
    });
  }
};

module.exports = {
  Quotation,
  GetQuotation,
  Quotationviaid,
  addServices,
  deleteService,
  GetServices,
  deleteQuotation,
  updateServices,
  Notes,
  getNotes,
  getnotes_text,
  deleteNote,
  UpdateQuotationName,
  CopyQuotationData,
  GetQuotationName,
  updateNote,
  createLead,
  getleadbyid,
  getLeads,
  updateLead,
  deleteLead,
  employeeData,
  editProfile,
  getAllUsers,
  deleteProfile,
  getAllQuotation,
  updateQuotationStatus,
  getLeadsByIdVisit,
  getLeadsVisit,
  quotationInformationForm,
  addProject,
  getAllProjects,
  editProject,
  deleteProject,
  addUnit,
  updateUnit,
  deleteUnit,
  getUnits,
  getUnitById,
  getUnitsByProject,
  updateUnitmanualy,
  getUnitsdistributeById,
  getUnitByProjectId,
  getUnitDetailsById,
  editUnitdetails,
};
