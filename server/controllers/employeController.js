const { db } = require("../db");
const moment = require("moment-timezone");
const { sendWhatsAppSoldAlert } = require("../utils/whatsappUtils");

const getEmployeeInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    const sql = `SELECT * FROM invoice_data JOIN invoice_services_data ON invoice_data.invoice_id = invoice_services_data.invoice_id WHERE invoice_data.employeeId = ?`;

    const result = await new Promise((resolve, reject) => {
      db.query(sql, [id], (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error", error: err });
  }
};

const getEmployeeLeads = async (req, res) => {
  try {
    const { id } = req.params;
    const sql = `SELECT * FROM leads join company_staff on company_staff.staff_id = leads.assignedTo left join projects on projects.project_id = leads.main_project_id left join units on units.unit_id = leads.unit_id left join employee_sold_units on employee_sold_units.esu_lead_id = leads.lead_id WHERE leads.assignedTo = ?`;
    db.query(sql, id, (err, result) => {
      if (err) {
        return res.status(400).json({ success: false, message: err.message });
      }
      return res.status(200).send(result);
    });
  } catch (err) {
    res.status(500).json({ message: "Internal Server Erro, error: errr" });
  }
};

const updateOnlyLeadStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { lead_status } = req.body;

    const sql = `UPDATE leads SET lead_status = ? WHERE lead_id = ?`;

    await new Promise((resolve, reject) => {
      db.query(sql, [lead_status, id], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });

    res.status(200).json({ message: "Lead updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: err });
  }
};

const updateOnlyQuotationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { quotation } = req.body;

    const sql = `UPDATE leads SET quotation = ? WHERE lead_id = ?`;

    await new Promise((resolve, reject) => {
      db.query(sql, [quotation, id], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });

    res.status(200).json({ message: "Quotation Status updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: err });
  }
};

const updateLeadStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      lead_status,
      deal_status,
      meeting_status,
      booking_amount,
      payment_mode,
      registry,
      reason,
      follow_up_status,
      d_closeDate,
    } = req.body;

    const sql = `UPDATE leads SET lead_status = ?, deal_status = ?, meeting_status=?, booking_amount = ?, payment_mode = ?, registry = ?,  reason = ?, follow_up_status = ?, d_closeDate = ? WHERE lead_id = ?`;

    await new Promise((resolve, reject) => {
      db.query(
        sql,
        [
          lead_status,
          deal_status,
          meeting_status,
          booking_amount,
          payment_mode,
          registry,
          reason,
          follow_up_status,
          d_closeDate,
          id,
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

    res.status(200).json({ message: "Lead updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

const getEmployeeQuotation = async (req, res) => {
  try {
    const { id } = req.params;
    const sql = "SELECT * FROM quotations_information WHERE employeeId = ?";

    const result = await new Promise((resolve, reject) => {
      db.query(sql, [id], (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });

    // Send the result as a response
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error", error: err });
  }
};

const employeeProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const sql = "SELECT * company_staff WHERE staff_id = ?";

    db.query(sql, id, (err, result) => {
      if (err) {
        res.status(400).json({ success: false, message: err.message });
      }
      res.status(200).send(result);
    });
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error", error: err });
  }
};

const getAllEmployeeTotalLeads = async (req, res) => {
  try {
    const query = `
    SELECT 
    e.employeeId,
    e.name,
    e.email,
    e.phone,
    COUNT(l.lead_id) AS total_leads
    FROM employee e
    LEFT JOIN leads l ON e.employeeId = l.employeeId
    GROUP BY e.employeeId;
    `;

    db.query(query, (err, results) => {
      if (err) {
        return res.status(500).json({ error: "Internal server error" });
      }
      return res.status(200).json({
        success: true,
        employees: results,
      });
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error in fetching employees",
      error: error.message,
    });
  }
};

const getLeadQuotation = async (req, res) => {
  try {
    const { id } = req.params;
    const sql = "SELECT * FROM quotations_information WHERE lead_id = ?";
    const result = await new Promise((resolve, reject) => {
      db.query(sql, [id], (err, results) => {
        if (err) {
          reject(err); // Reject the promise with the error
        } else {
          resolve(results); // Resolve the promise with the results
        }
      });
    });

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error", error: err });
  }
};

const getEmployeeVisit = async (req, res) => {
  try {
    const { type, id } = req.params;

    let sql;

    if (type && type === "meta") {
      sql = `
    SELECT * 
    FROM visit 
    JOIN meta_leads 
      ON meta_leads.leadgen_id COLLATE utf8mb4_general_ci = visit.vis_lead_id COLLATE utf8mb4_general_ci
    JOIN projects AS lead_project 
      ON lead_project.project_id = meta_leads.meta_project_id 
    JOIN company_staff 
      ON company_staff.staff_id = visit.vis_staff_id 
    WHERE visit.vis_lead_id = ?
  `;
    } else {
      sql = `
    SELECT * 
    FROM visit 
    JOIN leads 
      ON leads.lead_id COLLATE utf8mb4_general_ci = visit.vis_lead_id COLLATE utf8mb4_general_ci
    JOIN projects AS lead_project 
      ON lead_project.project_id = leads.main_project_id 
    JOIN company_staff 
      ON company_staff.staff_id = visit.vis_staff_id 
    WHERE visit.vis_lead_id = ?
  `;
    }

    db.query(sql, [id], (err, result) => {
      if (err) {
        return res.status(400).json({ success: false, message: err.message });
      }
      return res.status(200).send(result);
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// const createVisit = (req, res) => {
//   const {
//     vis_staff_id,
//     vis_lead_id,
//     visit_details,
//     visit_type,
//     visit_date,
//     vis_status,
//     lead_status,
//     lead_type,
//   } = req.body;

//   if ((!vis_lead_id || !vis_staff_id || !lead_status, !lead_type)) {
//     return res.status(400).json({
//       success: false,
//       message: "Missing required fields",
//     });
//   }

//   const dateTime = moment().tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss");

//   const insertSql = `
//     INSERT INTO visit (
//       vis_staff_id, vis_lead_id, visit_details, visit_type, visit_date, vis_status, vis_created_at
//     ) VALUES (?,?,?,?,?,?,?)
//   `;

//   const insertParams = [
//     vis_staff_id,
//     vis_lead_id,
//     visit_details,
//     visit_type,
//     visit_date,
//     vis_status,
//     dateTime,
//   ];

//   db.query(insertSql, insertParams, (err, results) => {
//     if (err) {
//       console.error("Error inserting visit:", err);
//       return res.status(500).json({ success: false, message: err.message });
//     }

//     let updateSql = "";
//     let updateParams = [];

//     if (lead_type && lead_type === "meta") {
//       updateSql = `
//         UPDATE meta_leads
//         SET meta_lead_status = ?, meta_updated_at = ?
//         WHERE meta_id = ?
//       `;
//       updateParams = [lead_status, dateTime, vis_lead_id];
//     } else {
//       updateSql = `
//         UPDATE leads
//         SET lead_status = ?, lead_updated_at = ?
//         WHERE lead_id = ?
//       `;
//       updateParams = [lead_status, dateTime, vis_lead_id];
//     }

//     db.query(updateSql, updateParams, (updateErr, updateResult) => {
//       if (updateErr) {
//         console.error("Error updating lead status:", updateErr);
//         return res.status(500).json({
//           success: false,
//           message: "Error updating lead status",
//           error: updateErr.message,
//         });
//       }

//       if (updateResult.affectedRows === 0) {
//         return res.status(404).json({
//           success: false,
//           message: "Lead not found for status update",
//         });
//       }

//       return res.status(201).json({
//         success: true,
//         message: "Visit submitted and lead status updated successfully",
//       });
//     });
//   });
// };

const createVisit = (req, res) => {
  const {
    vis_staff_id,
    vis_lead_id,
    visit_details,
    visit_type,
    visit_date,
    vis_status,
    lead_status,
    lead_type,
  } = req.body;

  // Basic validation
  if (!vis_lead_id || !vis_staff_id || !lead_status || !lead_type) {
    return res.status(400).json({
      success: false,
      message: "Missing required fields",
    });
  }

  const dateTime = moment().tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss");

  // Step 1️⃣: Insert visit entry
  const insertSql = `
    INSERT INTO visit (
      vis_staff_id, vis_lead_id, visit_details, visit_type, visit_date, vis_status, vis_created_at
    ) VALUES (?,?,?,?,?,?,?)
  `;

  const insertParams = [
    vis_staff_id,
    vis_lead_id,
    visit_details,
    visit_type,
    visit_date,
    vis_status,
    dateTime,
  ];

  db.query(insertSql, insertParams, (err, results) => {
    if (err) {
      console.error("❌ Error inserting visit:", err);
      return res.status(500).json({ success: false, message: err.message });
    }

    // Step 2️⃣: Update lead or meta_lead status
    let updateSql = "";
    let updateParams = [];

    if (lead_type && lead_type === "meta") {
      updateSql = `
        UPDATE meta_leads
        SET meta_lead_status = ?, meta_updated_at = ?
        WHERE meta_id = ?
      `;
      updateParams = [lead_status, dateTime, vis_lead_id];
    } else {
      updateSql = `
        UPDATE leads
        SET lead_status = ?, lead_updated_at = ?
        WHERE lead_id = ?
      `;
      updateParams = [lead_status, dateTime, vis_lead_id];
    }

    db.query(updateSql, updateParams, (updateErr, updateResult) => {
      if (updateErr) {
        console.error("❌ Error updating lead status:", updateErr);
        return res.status(500).json({
          success: false,
          message: "Error updating lead status",
          error: updateErr.message,
        });
      }

      if (updateResult.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: "Lead not found for status update",
        });
      }

      // Step 3️⃣: Fetch organization email from company_profile
      const orgQuery = `
        SELECT cp.email_id, cp.company_name, cs.staff_name 
        FROM company_staff cs
        JOIN company_profile cp ON cs.staff_org_id = cp.org_id
        WHERE cs.staff_id = ?
      `;

      db.query(orgQuery, [vis_staff_id], async (orgErr, orgResult) => {
        if (orgErr) {
          console.error("❌ Error fetching organization email:", orgErr);
          return res.status(500).json({
            success: false,
            message: "Error fetching organization email",
          });
        }

        if (orgResult.length === 0) {
          console.warn("⚠️ No organization found for staff ID:", vis_staff_id);
          return res.status(200).json({
            success: true,
            message:
              "Visit created and lead updated, but no organization email found.",
          });
        }

        const { email_id, company_name, staff_name } = orgResult[0];

        // Step 4️⃣: Prepare and send email to admin/company email
        const subject = `CRMGuru - Visit Scheduled Successfully (${company_name})`;

        const text = `Dear Admin,

A new visit has been successfully scheduled by ${staff_name}.

Visit Details:
- Visit Type: ${visit_type || "N/A"}
- Visit Date: ${visit_date || "N/A"}
- Visit Status: ${vis_status || "N/A"}

Please check your CRM dashboard for more information.

Best regards,
CRMGuru Team`;

        const html = `
          <div style="font-family: Arial, sans-serif; line-height:1.6;">
            <p>Dear <strong>Admin</strong>,</p>
            <p>A new visit has been successfully <b>scheduled</b> by <b>${staff_name}</b> in <b>${company_name}</b>.</p>
            <h3 style="margin-top: 20px;">🗓️ Visit Details</h3>
            <table style="border-collapse: collapse; width: 100%; max-width: 600px;">
              <tr><td><b>Visit Type:</b></td><td>${
                visit_type || "N/A"
              }</td></tr>
              <tr><td><b>Visit Date:</b></td><td>${
                visit_date || "N/A"
              }</td></tr>
              <tr><td><b>Visit Status:</b></td><td>${
                vis_status || "N/A"
              }</td></tr>
            </table>
            <br/>
            <p>Please log in to your CRM dashboard to review details.</p>
            <br/>
            <p>Best regards,<br/><strong>CRMGuru Team</strong></p>
          </div>
        `;

        try {
          await sendEmail(email_id, subject, text, html);
          console.log(`📩 Visit notification email sent to admin: ${email_id}`);
        } catch (emailErr) {
          console.error("❌ Email sending failed:", emailErr.message);
        }

        // Step 5️⃣: Final API response
        return res.status(201).json({
          success: true,
          message:
            "Visit submitted, lead status updated, and admin notified successfully.",
        });
      });
    });
  });
};

const updateVisit = (req, res) => {
  const visId = req.params.visId;
  const { visit_details, visit_type, visit_date, vis_status } = req.body;
  const dateTime = moment().tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss");

  let fields = [];
  let values = [];

  if (visit_details !== undefined) {
    fields.push("visit_details = ?");
    values.push(visit_details);
  }
  if (visit_type !== undefined) {
    fields.push("visit_type = ?");
    values.push(visit_type);
  }
  if (visit_date !== undefined) {
    fields.push("visit_date = ?");
    values.push(visit_date);
  }
  if (vis_status !== undefined) {
    fields.push("vis_status = ?");
    values.push(vis_status);
  }

  fields.push("vis_updated_at = ?");
  values.push(dateTime);

  values.push(visId);

  if (fields.length === 1) {
    return res.status(400).json({ error: "No fields provided to update" });
  }

  const sql = `UPDATE visit SET ${fields.join(", ")} WHERE visit_id = ?`;

  db.query(sql, values, (err, results) => {
    if (err) {
      return res
        .status(500)
        .json({ error: "Error updating visit data", details: err.message });
    } else if (results.affectedRows === 0) {
      return res.status(404).json({ error: "Visit not found" });
    } else {
      return res.status(200).json({
        success: true,
        message: "Visit data updated successfully",
      });
    }
  });
};

const deleteVisit = (req, res) => {
  const { id } = req.params;

  // Basic validation
  if (!id) {
    return res.status(400).json({ error: "Visit ID is required" });
  }

  const sql = `DELETE FROM visit WHERE id = ?`;

  db.query(sql, [id], (err, results) => {
    if (err) {
      res.status(500).json({ error: "Error deleting visit" });
    } else if (results.affectedRows === 0) {
      res.status(404).json({ error: "Visit not found" });
    } else {
      res
        .status(200)
        .json({ success: true, message: "Visit deleted successfully" });
    }
  });
};

const getEmployeeFollow_Up = async (req, res) => {
  try {
    const { id } = req.params;
    const sql =
      "SELECT * FROM follow_up_leads join projects on projects.project_id = follow_up_leads.fu_project_id join leads on leads.lead_id = follow_up_leads.fu_lead_id WHERE fu_lead_id = ?";

    const result = await new Promise((resolve, reject) => {
      db.query(sql, [id], (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: "Internal Server Erro, error: errr" });
  }
};

const createFollow_Up = (req, res) => {
  const {
    fu_project_id,
    fu_lead_id,
    fu_employeeId,
    follow_up_type,
    follow_up_date,
    follow_up_report,
  } = req.body;

  const dateTime = moment().tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss");

  const sql = `INSERT INTO follow_up_leads (fu_project_id,
    fu_lead_id,
    fu_employeeId,
    follow_up_type,
    follow_up_date,
    follow_up_report,
    follow_created_at,) VALUES(?,?,?,?,?,?,?)`;

  const insertParams = [
    fu_project_id,
    fu_lead_id,
    fu_employeeId,
    follow_up_type,
    follow_up_date,
    follow_up_report,
    dateTime,
  ];

  db.query(sql, insertParams, (err, results) => {
    if (err) {
      res.status(500).json({ error: "Error inserting data" });
    } else {
      res.status(201).json({
        success: true,
        message: "Follow Up data successfully submitted",
      });
    }
  });
};

const updateFollow_Up = (req, res) => {
  try {
    const fid = req.params.fid;
    const { follow_up_type, follow_up_date, follow_up_report } = req.body;

    // current timestamp
    const dateTime = moment().tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss");

    // Build dynamic SET clause
    let fields = [];
    let values = [];

    if (follow_up_type !== undefined) {
      fields.push("follow_up_type = ?");
      values.push(follow_up_type);
    }

    if (follow_up_date !== undefined) {
      fields.push("follow_up_date = ?");
      values.push(follow_up_date);
    }

    if (follow_up_report !== undefined) {
      fields.push("follow_up_report = ?");
      values.push(follow_up_report);
    }

    // Always update follow_updated_at
    fields.push("follow_updated_at = ?");
    values.push(dateTime);

    if (fields.length === 1) {
      // only updated_at added, no other fields to update
      return res.status(400).json({ error: "No fields provided to update" });
    }

    const sql = `UPDATE follow_up_leads SET ${fields.join(
      ", "
    )} WHERE follow_up_id = ?`;
    values.push(fid);

    db.query(sql, values, (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Error updating Follow Up data" });
      }
      if (results.affectedRows === 0) {
        return res.status(404).json({ error: "Follow Up not found" });
      }
      return res.status(200).json({
        success: true,
        message: "Follow Up data updated successfully",
      });
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error occurred" });
  }
};

const deleteFollow_Up = (req, res) => {
  const { id } = req.params;

  // Basic validation
  if (!id) {
    return res.status(400).json({ error: "Follow Up ID is required" });
  }

  const sql = `DELETE FROM follow_up_leads WHERE id = ?`;

  db.query(sql, [id], (err, results) => {
    if (err) {
      res.status(500).json({ error: "Error deleting visit" });
    } else if (results.affectedRows === 0) {
      res.status(404).json({ error: "Follow Up not found" });
    } else {
      res
        .status(200)
        .json({ success: true, message: "Follow Up deleted successfully" });
    }
  });
};

const getEmployeebyidvisit = async (req, res) => {
  try {
    const { id } = req.params;
    const sql = "SELECT * FROM visit WHERE employeeId = ?";

    const result = await new Promise((resolve, reject) => {
      db.query(sql, [id], (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: "Internal Server Erro, error: errr" });
  }
};

const AllgetEmployeebyvisit = async (req, res) => {
  try {
    const { id } = req.params;
    const sql = "SELECT * FROM visit ";

    const result = await new Promise((resolve, reject) => {
      db.query(sql, (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: "Internal Server Erro, error: errr" });
  }
};

const updateOnlyVisitStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { visit, visit_date } = req.body;

    const sql = `UPDATE leads SET visit = ?, visit_date = ? WHERE lead_id = ?`;

    await new Promise((resolve, reject) => {
      db.query(sql, [visit, visit_date, id], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });

    res.status(200).json({ message: "Visit Status updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: err });
  }
};

const updateOnlyFollowUpStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { follow_up_status } = req.body;

    const sql = `UPDATE leads SET follow_up_status = ? WHERE lead_id = ?`;

    await new Promise((resolve, reject) => {
      db.query(sql, [follow_up_status, id], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });

    res.status(200).json({ message: "Follow Up updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: err });
  }
};

const createRemark = async (req, res) => {
  try {
    const {
      remark_lead_id,
      remark_project_id,
      remark_employeeId,
      remark_status,
      answer_remark,
      remark_date,
      remark_created_at,
    } = req.body;
    const dateTime = moment().tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss");

    // Insert remark
    const sqlRemark = `
      INSERT INTO remark (
       remark_lead_id, remark_project_id, remark_employeeId, remark_status,	answer_remark, remark_date, 	remark_created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?)`;

    const insertParams = [
      remark_lead_id,
      remark_project_id,
      remark_employeeId,
      remark_status,
      answer_remark,
      remark_date,
      dateTime,
    ];

    db.query(sqlRemark, insertParams, (err, result) => {
      if (err) {
        res.status(400).json({ success: false, message: err.message });
      }
      res
        .status(200)
        .json({ success: true, message: "remark created successfully" });
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateRemark = (req, res) => {
  try {
    const rid = req.params.rid;
    const { remark_status, answer_remark, remark_date } = req.body;

    const dateTime = moment().tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss");

    // Dynamic SET clause
    let fields = [];
    let values = [];

    if (remark_status !== undefined) {
      fields.push("remark_status = ?");
      values.push(remark_status);
    }

    if (answer_remark !== undefined) {
      fields.push("answer_remark = ?");
      values.push(answer_remark);
    }

    if (remark_date !== undefined) {
      fields.push("remark_date = ?");
      values.push(remark_date);
    }

    // Always update remark_updated_at
    fields.push("remark_updated_at = ?");
    values.push(dateTime);

    if (fields.length === 0) {
      return res.status(400).json({ error: "No fields provided to update" });
    }

    const sql = `UPDATE remark SET ${fields.join(", ")} WHERE remark_id = ?`;
    values.push(rid);

    db.query(sql, values, (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Error updating remark data" });
      }
      if (results.affectedRows === 0) {
        return res.status(404).json({ error: "Remark not found" });
      }
      return res
        .status(200)
        .json({ success: true, message: "Remark updated successfully" });
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
};

const deleteRemark = (req, res) => {
  const { id } = req.params;

  // Basic validation
  if (!id) {
    return res.status(400).json({ error: "Remark ID is required" });
  }

  const sql = `DELETE FROM remark WHERE id = ?`;

  db.query(sql, [id], (err, results) => {
    if (err) {
      res.status(500).json({ error: "Error deleting remark" });
    } else if (results.affectedRows === 0) {
      res.status(404).json({ error: "Remark not found" });
    } else {
      res
        .status(200)
        .json({ success: true, message: "Remark deleted successfully" });
    }
  });
};

const getEmployeeRemark = async (req, res) => {
  try {
    const { id } = req.params;
    const sql =
      "SELECT * FROM remark join projects on projects.project_id = remark.remark_project_id join leads on leads.lead_id = remark.remark_lead_id WHERE remark.remark_lead_id = ?";

    db.query(sql, id, (err, result) => {
      if (err) {
        res.status(400).json({ success: false, message: err.message });
      }
      res.status(200).send(result);
    });
  } catch (err) {
    res.status(500).json({ message: "Internal Server Erro, error: errr" });
  }
};

const updateOnlyRemarkStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { remark_status } = req.body;

    const sql = `UPDATE leads SET remark_status = ? WHERE lead_id = ?`;

    await new Promise((resolve, reject) => {
      db.query(sql, [remark_status, id], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });

    res.status(200).json({ message: "Remarks Status updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: err });
  }
};
const updateOnlyRemarkAnswerStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { answer_remark } = req.body;

    const sql = `UPDATE leads SET answer_remark = ? WHERE lead_id = ?`;

    await new Promise((resolve, reject) => {
      db.query(sql, [answer_remark, id], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });

    res.status(200).json({ message: "Answer Remark updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: err });
  }
};

const updateOnlyRemarkAnswer = async (req, res) => {
  try {
    const { lead_id, answer_remark, remark_id } = req.body;

    const sqlUpdateLeads = `UPDATE leads SET answer_remark = ? WHERE lead_id = ?`;
    const sqlUpdateRemark = `UPDATE remark SET answer_remark = ? WHERE id = ?`;

    await new Promise((resolve, reject) => {
      db.query(sqlUpdateLeads, [answer_remark, lead_id], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });

    await new Promise((resolve, reject) => {
      db.query(sqlUpdateRemark, [answer_remark, remark_id], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });

    res.status(200).json({
      message: "Answer Remark status updated successfully in both tables",
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

// const createEmployeeUnitSold = (req, res) => {
//   try {
//     const {
//       esu_lead_id,
//       esu_staff_id,
//       esu_unit_id,
//       esu_project_id,
//       esu_sold_date,
//       esu_notes,
//       lead_status,
//       leadType,
//       esu_sale_price,
//       esu_token_amount,
//       esu_token_amount_status,
//       esu_booking_date,
//       esu_final_date,
//       esu_registery_name,
//       esu_registery_date,
//       esu_payment_method,
//       owner_org_id,
//       owner_name,
//       owner_email,
//       owner_phone,
//       owner_address,
//       remaining_amount,
//     } = req.body;

//     if (
//       !esu_lead_id ||
//       !esu_staff_id ||
//       !esu_unit_id ||
//       !lead_status ||
//       !leadType ||
//       !owner_org_id ||
//       !owner_name ||
//       !owner_email ||
//       !owner_phone
//     ) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Missing required fields" });
//     }

//     const dateTime = moment().tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss");

//     // Step 1️⃣: Prevent duplicate sold record for the same lead
//     const checkDuplicateSql =
//       "SELECT esu_id FROM employee_sold_units WHERE esu_lead_id = ? LIMIT 1";
//     db.query(checkDuplicateSql, [esu_lead_id], (dupErr, dupResult) => {
//       if (dupErr)
//         return res
//           .status(400)
//           .json({ success: false, message: dupErr.message });

//       if (dupResult.length > 0) {
//         return res.status(409).json({
//           success: false,
//           message: "This lead is already marked as sold.",
//         });
//       }

//       // Step 2️⃣: Insert owner
//       const insertOwnerSql = `
//         INSERT INTO owner
//           (owner_org_id, owner_name, owner_email, owner_phone, owner_address, owner_created_at)
//         VALUES (?, ?, ?, ?, ?, ?)
//       `;
//       const ownerParams = [
//         owner_org_id,
//         owner_name,
//         owner_email,
//         owner_phone,
//         owner_address,
//         dateTime,
//       ];

//       db.query(insertOwnerSql, ownerParams, (ownerErr, ownerResult) => {
//         if (ownerErr)
//           return res
//             .status(400)
//             .json({ success: false, message: ownerErr.message });

//         const ownerId = ownerResult.insertId;

//         // Step 3️⃣: Insert sold record
//         const insertSoldSql = `
//           INSERT INTO employee_sold_units (
//             esu_lead_id,
//             esu_staff_id,
//             esu_unit_id,
//             esu_project_id,
//             esu_owner_id,
//             esu_sold_date,
//             esu_notes,
//             esu_sale_price,
//             esu_token_amount,
//             esu_token_paid_status,
//             esu_booking_date,
//             esu_final_date,
//             registry_name,
//             registry_date,
//             esu_payment_method,
//             remaining_amount,
//             esu_created_at
//           ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
//         `;
//         const soldParams = [
//           esu_lead_id,
//           esu_staff_id,
//           esu_unit_id,
//           esu_project_id,
//           ownerId,
//           esu_sold_date,
//           esu_notes,
//           esu_sale_price || null,
//           esu_token_amount || null,
//           esu_token_amount_status || null,
//           esu_booking_date || null,
//           esu_final_date || null,
//           esu_registery_name || null,
//           esu_registery_date || null,
//           esu_payment_method || null,
//           remaining_amount || null,
//           dateTime,
//         ];

//         db.query(insertSoldSql, soldParams, (soldErr, soldResult) => {
//           if (soldErr)
//             return res
//               .status(400)
//               .json({ success: false, message: soldErr.message });

//           // Step 4️⃣: Update unit status
//           const updateUnitSql = `
//             UPDATE units
//             SET unit_status = ?, unit_updated_at = ?
//             WHERE unit_id = ?
//           `;
//           db.query(
//             updateUnitSql,
//             ["sold", dateTime, esu_unit_id],
//             (unitErr) => {
//               if (unitErr)
//                 return res
//                   .status(400)
//                   .json({ success: false, message: unitErr.message });

//               // Step 5️⃣: Update lead status
//               let updateLeadSql = "";
//               let leadParams = [];

//               if (leadType === "meta") {
//                 updateLeadSql = `
//                   UPDATE meta_leads
//                   SET meta_lead_status = ?, meta_updated_at = ?
//                   WHERE leadgen_id = ?
//                 `;
//                 leadParams = [lead_status, dateTime, esu_lead_id];
//               } else {
//                 updateLeadSql = `
//                   UPDATE leads
//                   SET lead_status = ?, lead_updated_at = ?
//                   WHERE lead_id = ?
//                 `;
//                 leadParams = [lead_status, dateTime, esu_lead_id];
//               }

//               db.query(updateLeadSql, leadParams, (leadErr, leadResult) => {
//                 if (leadErr)
//                   return res
//                     .status(400)
//                     .json({ success: false, message: leadErr.message });

//                 if (leadResult.affectedRows === 0) {
//                   return res.status(404).json({
//                     success: false,
//                     message: "Lead not found",
//                   });
//                 }

//                 // Step 6️⃣: Fetch company & admin email info
//                 const orgQuery = `
//                   SELECT cp.email_id, cp.company_name, cs.staff_name
//                   FROM company_staff cs
//                   JOIN company_profile cp ON cs.staff_org_id = cp.org_id
//                   WHERE cs.staff_id = ?
//                 `;
//                 db.query(
//                   orgQuery,
//                   [esu_staff_id],
//                   async (orgErr, orgResult) => {
//                     if (orgErr) {
//                       console.error(
//                         "❌ Error fetching organization email:",
//                         orgErr
//                       );
//                       return res.status(500).json({
//                         success: false,
//                         message: "Error fetching organization email",
//                       });
//                     }

//                     if (orgResult.length === 0) {
//                       console.warn(
//                         "⚠️ No organization found for staff ID:",
//                         esu_staff_id
//                       );
//                       return res.status(200).json({
//                         success: true,
//                         message:
//                           "Sale recorded, lead updated, but no organization email found.",
//                       });
//                     }

//                     const { email_id, company_name, staff_name } = orgResult[0];

//                     // Step 7️⃣: Prepare email
//                     const subject = `CRMGuru - Unit Sold Successfully (${company_name})`;
//                     const text = `Dear Admin,

// A new unit has been marked as SOLD by ${staff_name}.

// Sold Details:
// - Unit ID: ${esu_unit_id}
// - Project ID: ${esu_project_id || "N/A"}
// - Sold Date: ${esu_sold_date || "N/A"}
// - Sale Price: ${esu_sale_price || "N/A"}
// - Payment Method: ${esu_payment_method || "N/A"}
// - Owner Name: ${owner_name}

// Please check your CRM dashboard for complete details.

// Best regards,
// CRMGuru Team`;

//                     const html = `
//                     <div style="font-family: Arial, sans-serif; line-height:1.6;">
//                       <p>Dear <strong>Admin</strong>,</p>
//                       <p>A new unit has been successfully <b>sold</b> by <b>${staff_name}</b> in <b>${company_name}</b>.</p>
//                       <h3 style="margin-top: 20px;">🏠 Sold Details</h3>
//                       <table style="border-collapse: collapse; width: 100%; max-width: 600px;">
//                         <tr><td><b>Unit ID:</b></td><td>${esu_unit_id}</td></tr>
//                         <tr><td><b>Project ID:</b></td><td>${
//                           esu_project_id || "N/A"
//                         }</td></tr>
//                         <tr><td><b>Sold Date:</b></td><td>${
//                           esu_sold_date || "N/A"
//                         }</td></tr>
//                         <tr><td><b>Sale Price:</b></td><td>${
//                           esu_sale_price || "N/A"
//                         }</td></tr>
//                         <tr><td><b>Payment Method:</b></td><td>${
//                           esu_payment_method || "N/A"
//                         }</td></tr>
//                         <tr><td><b>Owner Name:</b></td><td>${owner_name}</td></tr>
//                       </table>
//                       <br/>
//                       <p>Please log in to your CRM dashboard for full transaction details.</p>
//                       <br/>
//                       <p>Best regards,<br/><strong>CRMGuru Team</strong></p>
//                     </div>
//                   `;

//                     try {
//                       await sendEmail(email_id, subject, text, html);
//                       console.log(
//                         `📩 Sale notification email sent to admin: ${email_id}`
//                       );
//                     } catch (emailErr) {
//                       console.error(
//                         "❌ Email sending failed:",
//                         emailErr.message
//                       );
//                     }

//                     // Step 8️⃣: Final response
//                     return res.status(201).json({
//                       success: true,
//                       message:
//                         "Owner added, sold details recorded, unit marked as sold, lead updated, and admin notified successfully.",
//                       owner_id: ownerId,
//                       sold_id: soldResult.insertId,
//                     });
//                   }
//                 );
//               });
//             }
//           );
//         });
//       });
//     });
//   } catch (error) {
//     console.error("createEmployeeUnitSold Error:", error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

const createEmployeeUnitSold = (req, res) => {
  try {
    const {
      esu_lead_id,
      esu_staff_id,
      esu_unit_id,
      esu_project_id,
      esu_sold_date,
      esu_notes,
      lead_status,
      leadType,
      esu_sale_price,
      esu_token_amount,
      esu_token_amount_status,
      esu_booking_date,
      esu_final_date,
      esu_registery_name,
      esu_registery_date,
      esu_payment_method,
      owner_org_id,
      owner_name,
      owner_email,
      owner_phone,
      owner_address,
      remaining_amount,
    } = req.body;

    if (
      !esu_lead_id ||
      !esu_staff_id ||
      !esu_unit_id ||
      !lead_status ||
      !leadType ||
      !owner_org_id ||
      !owner_name ||
      !owner_email ||
      !owner_phone
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    const dateTime = moment().tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss");

    // Step 1️⃣: Prevent duplicate sold record for the same lead
    const checkDuplicateSql =
      "SELECT esu_id FROM employee_sold_units WHERE esu_lead_id = ? LIMIT 1";
    db.query(checkDuplicateSql, [esu_lead_id], (dupErr, dupResult) => {
      if (dupErr)
        return res
          .status(400)
          .json({ success: false, message: dupErr.message });

      if (dupResult.length > 0) {
        return res.status(409).json({
          success: false,
          message: "This lead is already marked as sold.",
        });
      }

      // Step 2️⃣: Insert owner
      const insertOwnerSql = `
        INSERT INTO owner 
          (owner_org_id, owner_name, owner_email, owner_phone, owner_address, owner_created_at) 
        VALUES (?, ?, ?, ?, ?, ?)
      `;
      const ownerParams = [
        owner_org_id,
        owner_name,
        owner_email,
        owner_phone,
        owner_address,
        dateTime,
      ];

      db.query(insertOwnerSql, ownerParams, (ownerErr, ownerResult) => {
        if (ownerErr)
          return res
            .status(400)
            .json({ success: false, message: ownerErr.message });

        const ownerId = ownerResult.insertId;

        // Step 3️⃣: Insert sold record
        const insertSoldSql = `
          INSERT INTO employee_sold_units (
            esu_lead_id,
            esu_staff_id,
            esu_unit_id,
            esu_project_id,
            esu_owner_id,
            esu_sold_date,
            esu_notes,
            esu_sale_price,
            esu_token_amount,
            esu_token_paid_status,
            esu_booking_date,
            esu_final_date,
            registry_name,
            registry_date,
            esu_payment_method,
            remaining_amount,
            esu_created_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const soldParams = [
          esu_lead_id,
          esu_staff_id,
          esu_unit_id,
          esu_project_id,
          ownerId,
          esu_sold_date,
          esu_notes,
          esu_sale_price || null,
          esu_token_amount || null,
          esu_token_amount_status || null,
          esu_booking_date || null,
          esu_final_date || null,
          esu_registery_name || null,
          esu_registery_date || null,
          esu_payment_method || null,
          remaining_amount || null,
          dateTime,
        ];

        db.query(insertSoldSql, soldParams, (soldErr, soldResult) => {
          if (soldErr)
            return res
              .status(400)
              .json({ success: false, message: soldErr.message });

          // Step 4️⃣: Update unit status
          const updateUnitSql = `
            UPDATE units 
            SET unit_status = ?, unit_updated_at = ? 
            WHERE unit_id = ?
          `;
          db.query(
            updateUnitSql,
            ["sold", dateTime, esu_unit_id],
            (unitErr) => {
              if (unitErr)
                return res
                  .status(400)
                  .json({ success: false, message: unitErr.message });

              // Step 5️⃣: Update lead status
              let updateLeadSql = "";
              let leadParams = [];

              if (leadType === "meta") {
                updateLeadSql = `
                  UPDATE meta_leads 
                  SET meta_lead_status = ?, meta_updated_at = ? 
                  WHERE leadgen_id = ?
                `;
                leadParams = [lead_status, dateTime, esu_lead_id];
              } else {
                updateLeadSql = `
                  UPDATE leads 
                  SET lead_status = ?, lead_updated_at = ? 
                  WHERE lead_id = ?
                `;
                leadParams = [lead_status, dateTime, esu_lead_id];
              }

              db.query(updateLeadSql, leadParams, (leadErr, leadResult) => {
                if (leadErr)
                  return res
                    .status(400)
                    .json({ success: false, message: leadErr.message });

                if (leadResult.affectedRows === 0) {
                  return res.status(404).json({
                    success: false,
                    message: "Lead not found",
                  });
                }

                // Step 6️⃣: Fetch company & admin email info
                const orgQuery = `
                  SELECT cp.email_id, cp.company_name, cs.staff_name 
                  FROM company_staff cs
                  JOIN company_profile cp ON cs.staff_org_id = cp.org_id
                  WHERE cs.staff_id = ?
                `;
                db.query(
                  orgQuery,
                  [esu_staff_id],
                  async (orgErr, orgResult) => {
                    if (orgErr) {
                      console.error(
                        "❌ Error fetching organization email:",
                        orgErr
                      );
                      return res.status(500).json({
                        success: false,
                        message: "Error fetching organization email",
                      });
                    }

                    if (orgResult.length === 0) {
                      console.warn(
                        "⚠️ No organization found for staff ID:",
                        esu_staff_id
                      );
                      return res.status(200).json({
                        success: true,
                        message:
                          "Sale recorded, lead updated, but no organization email found.",
                      });
                    }

                    const { email_id, company_name, staff_name } = orgResult[0];

                    // Step 7️⃣: Prepare email
                    const subject = `CRMGuru - Unit Sold Successfully (${company_name})`;
                    const text = `Dear Admin,

A new unit has been marked as SOLD by ${staff_name}.

Sold Details:
- Unit ID: ${esu_unit_id}
- Project ID: ${esu_project_id || "N/A"}
- Sold Date: ${esu_sold_date || "N/A"}
- Sale Price: ${esu_sale_price || "N/A"}
- Owner Name: ${owner_name}

Please check your CRM dashboard for complete details.

Best regards,
CRMGuru Team`;

                    const html = `
                    <div style="font-family: Arial, sans-serif; line-height:1.6;">
                      <p>Dear <strong>Admin</strong>,</p>
                      <p>A new unit has been successfully <b>sold</b> by <b>${staff_name}</b> in <b>${company_name}</b>.</p>
                      <h3 style="margin-top: 20px;">🏠 Sold Details</h3>
                      <table style="border-collapse: collapse; width: 100%; max-width: 600px;">
                        <tr><td><b>Unit ID:</b></td><td>${esu_unit_id}</td></tr>
                        <tr><td><b>Project ID:</b></td><td>${
                          esu_project_id || "N/A"
                        }</td></tr>
                        <tr><td><b>Sold Date:</b></td><td>${
                          esu_sold_date || "N/A"
                        }</td></tr>
                        <tr><td><b>Sale Price:</b></td><td>${
                          esu_sale_price || "N/A"
                        }</td></tr>
                        <tr><td><b>Owner Name:</b></td><td>${owner_name}</td></tr>
                      </table>
                      <br/>
                      <p>Please log in to your CRM dashboard for full transaction details.</p>
                      <br/>
                      <p>Best regards,<br/><strong>CRMGuru Team</strong></p>
                    </div>
                  `;

                    try {
                      await sendEmail(email_id, subject, text, html);
                      console.log(
                        `📩 Sale notification email sent to admin: ${email_id}`
                      );
                    } catch (emailErr) {
                      console.error(
                        "❌ Email sending failed:",
                        emailErr.message
                      );
                    }

                    let whatsappStatus = null;
                    try {
                      const adminNumber = process.env.ADMIN_WHATSAPP_NUMBER;
                      const waResponse = await sendWhatsAppSoldAlert(
                        adminNumber,
                        staff_name,
                        esu_unit_id,
                        esu_project_id,
                        esu_sold_date,
                        esu_sale_price,
                        owner_name
                      );

                      whatsappStatus = {
                        success: true,
                        message: `WhatsApp sale alert sent to admin: ${adminNumber}`,
                        wa_message_id: waResponse.messages?.[0]?.id || null,
                      };
                    } catch (waErr) {
                      whatsappStatus = {
                        success: false,
                        message: "WhatsApp alert failed",
                        error:
                          waErr?.error?.message ||
                          waErr?.message ||
                          "Unknown error",
                      };
                    }

                    // Step 8️⃣: Final response
                    return res.status(201).json({
                      success: true,
                      message:
                        "Owner added, sold details recorded, unit marked as sold, lead updated, and admin notified successfully.",
                      owner_id: ownerId,
                      sold_id: soldResult.insertId,
                      whatsapp: whatsappStatus,
                    });
                  }
                );
              });
            }
          );
        });
      });
    });
  } catch (error) {
    console.error("createEmployeeUnitSold Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateEmployeeUnitSold = (req, res) => {
  const {
    id,
    lead_id,
    name,
    employeeId,
    employee_name,
    unit_id,
    unit_no,
    unit_status,
    main_project_id,
    project_name,
    date,
  } = req.body;

  // Basic validation
  if (!id || !lead_id || !name || !unit_no || !unit_status) {
    return res
      .status(400)
      .json({ error: "Please provide all required fields." });
  }

  const sql = `UPDATE employee_sold_units SET 
    lead_id = ?,
    name = ?,
    employeeId = ?,
    employee_name = ?,
    unit_id = ?,
    unit_no = ?,
    unit_status = ?,
    main_project_id = ?,
    project_name = ?,
    date= ? 
    WHERE id = ?`;

  db.query(
    sql,
    [
      lead_id,
      name,
      employeeId,
      employee_name,
      unit_id,
      unit_no,
      unit_status,
      main_project_id,
      project_name,
      date,
      id,
    ],
    (err, results) => {
      if (err) {
        res.status(500).json({ error: "Error updating Unit Sold data" });
      } else if (results.affectedRows === 0) {
        res.status(404).json({ error: "Unit Sold not found" });
      } else {
        res.status(200).json({
          success: true,
          message: "Unit Sold data updated successfully",
        });
      }
    }
  );
};

const deleteEmployeeUnitSold = (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ success: false, message: "ID is required" });
  }

  try {
    const checkQuery = `SELECT * FROM employee_sold_units WHERE esu_id = ?`;
    db.query(checkQuery, [id], (err, result) => {
      if (err) {
        return res.status(500).json({ success: false, message: err.message });
      }

      if (!result || result.length === 0) {
        return res
          .status(404)
          .json({ success: false, message: "Unit Sold not found" });
      }

      const unitId = result[0].esu_unit_id;

      const updateQuery = `UPDATE units SET unit_status = ? WHERE unit_id = ?`;
      db.query(updateQuery, ["available", unitId], (err) => {
        if (err) {
          return res.status(500).json({ success: false, message: err.message });
        }

        const deleteQuery = `DELETE FROM employee_sold_units WHERE esu_id = ?`;
        db.query(deleteQuery, [id], (err, results) => {
          if (err) {
            return res
              .status(500)
              .json({ success: false, message: "Error deleting Unit Sold" });
          }

          if (results.affectedRows === 0) {
            return res
              .status(404)
              .json({ success: false, message: "Unit Sold not found" });
          }

          return res.status(200).json({
            success: true,
            message: "Unit status updated and Unit Sold deleted successfully",
          });
        });
      });
    });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

const getEmployeeUnitSold = async (req, res) => {
  try {
    const { userId } = req.params;
    const sql = "SELECT * FROM  employee_sold_units WHERE user_id = ?";

    const result = await new Promise((resolve, reject) => {
      db.query(sql, [userId], (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: "Internal Server Erro, error: errr" });
  }
};

const getEmployeeUnitSoldById = async (req, res) => {
  try {
    const { id } = req.params;
    const sql =
      "SELECT * FROM employee_sold_units join leads on leads.lead_id = employee_sold_units.esu_lead_id join projects on projects.project_id = leads.main_project_id join company_staff on company_staff.staff_id = employee_sold_units.esu_staff_id join units on units.unit_id = employee_sold_units.esu_unit_id WHERE employee_sold_units.esu_staff_id = ?";

    const result = await new Promise((resolve, reject) => {
      db.query(sql, [id], (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: "Internal Server Erro, error: errr" });
  }
};
const getEmployeeUnitSoldByLeadId = async (req, res) => {
  try {
    const { id } = req.params;
    const sql =
      "SELECT * FROM employee_sold_units join projects on projects.project_id = employee_sold_units.esu_project_id join leads on leads.lead_id = employee_sold_units.esu_lead_id join units on units.unit_id = employee_sold_units.esu_unit_id join company_staff on company_staff.staff_id = employee_sold_units.esu_staff_id WHERE employee_sold_units.esu_lead_id = ?";

    const result = await new Promise((resolve, reject) => {
      db.query(sql, [id], (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: "Internal Server Erro, error: errr" });
  }
};

const getUnitDataByUnitId = async (req, res) => {
  try {
    const { id } = req.params;
    const sql = "SELECT * FROM unit_data WHERE unit_id = ?";

    const result = await new Promise((resolve, reject) => {
      db.query(sql, [id], (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: "Internal Server Erro, error: errr" });
  }
};
const updateOnlyUnitDataStatusById = async (req, res) => {
  try {
    const { id } = req.params;
    const { unit_status } = req.body;

    const sql = `UPDATE unit_data SET status = ? WHERE unit_number = ?`;

    await new Promise((resolve, reject) => {
      db.query(sql, [unit_status, id], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });

    res.status(200).json({ message: "Unit Status updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: err });
  }
};

const updateOnlyUnitStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { unit_number, unit_status } = req.body;

    const sql = `UPDATE leads SET unit_number = ?, unit_status = ? WHERE lead_id = ?`;

    await new Promise((resolve, reject) => {
      db.query(sql, [unit_number, unit_status, id], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });

    res.status(200).json({ message: "Lead of Unit Data updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: err });
  }
};

module.exports = {
  getEmployeeInvoice,
  getEmployeeLeads,
  updateLeadStatus,
  getEmployeeQuotation,
  employeeProfile,
  updateOnlyLeadStatus,
  updateOnlyQuotationStatus,
  getAllEmployeeTotalLeads,
  getLeadQuotation,
  getEmployeeVisit,
  createVisit,
  deleteVisit,
  updateVisit,
  getEmployeeFollow_Up,
  createFollow_Up,
  deleteFollow_Up,
  updateFollow_Up,
  getEmployeebyidvisit,
  AllgetEmployeebyvisit,
  updateOnlyVisitStatus,
  updateOnlyFollowUpStatus,
  createRemark,
  updateRemark,
  deleteRemark,
  getEmployeeRemark,
  updateOnlyRemarkStatus,
  updateOnlyRemarkAnswer,
  updateOnlyRemarkAnswerStatus,
  createEmployeeUnitSold,
  updateEmployeeUnitSold,
  deleteEmployeeUnitSold,
  getEmployeeUnitSold,
  getEmployeeUnitSoldById,
  getUnitDataByUnitId,
  updateOnlyUnitDataStatusById,
  updateOnlyUnitStatus,
  getEmployeeUnitSoldByLeadId,
};
