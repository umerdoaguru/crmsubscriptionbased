const express = require("express");
const axios = require("axios");
const cors = require("cors");
const { db } = require("../db");
const moment = require("moment-timezone");
const xlsx = require("xlsx");

const metaLeadFetchByPageId = async (req, res) => {
  const { pageId, accessToken, meta_org_id } = req.body;

  if (!pageId) {
    return res.status(400).json({
      error: "pageId is required",
    });
  }

  if (!accessToken) {
    return res.status(400).json({
      error: "accessToken is required",
    });
  }

  if (!meta_org_id) {
    return res.status(400).json({
      error: "meta_org_id is required",
    });
  }

  const dateTime = moment().tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss");

  try {
    const formsResp = await axios.get(
      `https://graph.facebook.com/v17.0/${pageId}/leadgen_forms`,
      {
        params: { access_token: accessToken, fields: "id,name" },
      }
    );

    const forms = formsResp.data.data;
    let totalInserted = 0;

    forms.forEach(async (form, formIndex) => {
      const leadsResp = await axios.get(
        `https://graph.facebook.com/v17.0/${form.id}/leads`,
        {
          params: {
            access_token: accessToken,
            fields: "id,created_time,field_data",
          },
        }
      );

      const leads = leadsResp.data.data;

      leads.forEach((lead) => {
        const leadId = lead.id;
        const createdTime = lead.created_time;
        const fieldData = JSON.stringify(lead.field_data);
        const formName = form.name;

        db.query(
          "SELECT meta_id FROM meta_leads WHERE leadgen_id = ?",
          [leadId],
          (err, result) => {
            if (err) {
              console.error("❌ Select error:", err);
              return;
            }

            if (result.length === 0) {
              db.query(
                `INSERT INTO meta_leads 
                (leadgen_id, meta_form_id, meta_form_name, meta_page_id, generated_time, question_fields_data, meta_org_id, meta_lead_status, meta_created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                  leadId,
                  form.id,
                  formName,
                  pageId,
                  createdTime,
                  fieldData,
                  meta_org_id,
                  "Pending",
                  dateTime,
                ],
                (err2) => {
                  if (err2) {
                    console.error("❌ Insert error:", err2);
                  } else {
                    totalInserted++;
                  }
                }
              );
            }
          }
        );
      });

      if (formIndex === forms.length - 1) {
        setTimeout(() => {
          res.json({
            message: "Leads fetched and saved successfully",
            inserted: totalInserted,
          });
        }, 2000);
      }
    });
  } catch (err) {
    console.error("Error fetching leads:", err.response?.data || err.message);
    res.status(500).json({ error: err.message });
  }
};

const getMetaLeadsByOrgId = (req, res) => {
  const orgId = req.params.orgId;
  try {
    const selectQuery = `select * from meta_leads where meta_org_id = ? order by meta_id desc`;
    db.query(selectQuery, orgId, (err, result) => {
      if (err) {
        res.status(400).json({ success: false, message: err.message });
      }
      res.status(200).send(result);
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateAndAssignedMetaLeads = (req, res) => {
  try {
    const mlid = req.params.mlid;
    const {
      meta_assignedTo,
      meta_assignedBy,
      meta_project_id,
      meta_unit_id,
      meta_lead_status,
    } = req.body;
    const dateTime = moment().tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss");

    let fields = [];
    let values = [];

    if (meta_assignedTo) {
      fields.push("meta_assignedTo = ?");
      values.push(meta_assignedTo);
    }

    if (meta_assignedBy) {
      fields.push("meta_assignedBy = ?");
      values.push(meta_assignedBy);
    }

    if (meta_project_id) {
      fields.push("meta_project_id = ?");
      values.push(meta_project_id);
    }

    if (meta_unit_id) {
      fields.push("meta_unit_id = ?");
      values.push(meta_unit_id);
    }

    if (meta_lead_status) {
      fields.push("meta_lead_status = ?");
      values.push(meta_lead_status);
    }

    fields.push("meta_updated_at = ?");
    values.push(dateTime);

    if (fields.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No fields provided for update",
      });
    }

    const updateQuery = `UPDATE meta_leads SET ${fields.join(
      ", "
    )} WHERE meta_id = ?`;
    values.push(mlid);

    db.query(updateQuery, values, (err, result) => {
      if (err) {
        return res.status(400).json({ success: false, message: err.message });
      }

      if (result.affectedRows === 0) {
        return res
          .status(404)
          .json({ success: false, message: "Invalid Meta Lead ID" });
      }

      res.status(200).json({
        success: true,
        message: "Meta Leads details updated successfully",
      });
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAllUnitsByProjectId = (req, res) => {
  try {
    const projectId = req.params.projectId;
    const selectQuery = `select * from units where unit_project_id = ?`;
    db.query(selectQuery, projectId, (err, result) => {
      if (err) {
        return res.status(400).json({ success: false, message: err.message });
      }
      return res.status(200).send(result);
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getMetaLeadsByStaffId = (req, res) => {
  const staffId = req.params.staffId;
  try {
    const selectQuery = `select * from meta_leads join company_staff on company_staff.staff_id = meta_leads.meta_assignedTo join projects on projects.project_id = meta_leads.meta_project_id join units on units.unit_project_id = meta_leads.meta_project_id where meta_leads.meta_assignedTo = ? order by meta_leads.meta_id desc`;
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

const getMetaLeadsByLeadId = (req, res) => {
  const metaId = req.params.metaId;
  try {
    const selectQuery = `select * from meta_leads join company_staff on company_staff.staff_id = meta_leads.meta_assignedTo join projects on projects.project_id = meta_leads.meta_project_id join units on units.unit_project_id = meta_leads.meta_project_id where meta_leads.meta_id = ? order by meta_leads.meta_id desc`;
    db.query(selectQuery, metaId, (err, result) => {
      if (err) {
        res.status(400).json({ success: false, message: err.message });
      }
      res.status(200).send(result);
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateOnlyMetaLeadStatusEmployeeEnd = (req, res) => {
  const { id } = req.params;
  const { lead_status } = req.body;

  if (!id) {
    return res.status(400).json({ message: "Lead ID is required" });
  }

  if (!lead_status) {
    return res.status(400).json({ message: "Lead status is required" });
  }

  const dateTime = moment().tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss");
  const sql = `UPDATE meta_leads 
               SET meta_lead_status = ?, meta_updated_at = ? 
               WHERE meta_id = ?`;

  db.query(sql, [lead_status, dateTime, id], (err, result) => {
    if (err) {
      console.error("Error updating lead status:", err);
      return res
        .status(500)
        .json({ message: "Internal Server Error", error: err.message });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Lead not found" });
    }

    return res.status(200).json({ message: "Lead updated successfully" });
  });
};

const createFinanceCompany = async (req, res) => {
  try {
    const {
      fc_org_id,
      fc_name,
      fc_contact_person,
      fc_contact_phone,
      interest_rate,
    } = req.body;

    const dateTime = moment().tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss");

    if (!fc_org_id || !fc_name) {
      return res.status(400).json({
        success: false,
        message: "Organization ID and name are required",
      });
    }

    db.query(
      `SELECT * FROM finance_companies WHERE fc_name = ?`,
      fc_name,
      (err, result) => {
        if (err) {
          return res.status(400).json({ success: false, message: err.message });
        }

        if (result && result.length > 0) {
          return res.status(400).json({
            success: false,
            message: "Finance company name already exists",
          });
        } else {
          db.query(
            `INSERT INTO finance_companies 
       (fc_org_id, fc_name, fc_contact_person, fc_contact_phone, interest_rate, fc_created_at)
       VALUES (?, ?, ?, ?, ?, ?)`,
            [
              fc_org_id,
              fc_name,
              fc_contact_person,
              fc_contact_phone,
              interest_rate,
              dateTime,
            ],
            (insertErr, insertResult) => {
              if (insertErr) {
                return res.status(400).json({
                  success: false,
                  message: insertErr.message,
                });
              }
              return res.status(201).json({
                success: true,
                message: "Finance Company Added Successfully",
                finance_company_id: result.insertId,
              });
            }
          );
        }
      }
    );
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(400).json({
        success: false,
        message: "Finance company name already exists",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Error adding finance company",
      error: error.message,
    });
  }
};

const createOwnerPayments = (req, res) => {
  try {
    const {
      op_sale_id,
      op_owner_id,
      op_org_id,
      op_amount,
      op_paid_date,
      op_reference_no,
      op_payment_method,
      op_remark,
      op_remaining_amount,
    } = req.body;

    const dateTime = moment().tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss");

    // Insert payment record
    const insertQuery = `
      INSERT INTO owner_payments (
        op_sale_id,
        op_owner_id,
        op_org_id,
        op_amount,
        op_paid_date,
        op_reference_no,
        op_payment_method,
        op_remark,
        op_remaining_amount,
        op_created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?,?)
    `;

    const insertParams = [
      op_sale_id,
      op_owner_id,
      op_org_id,
      op_amount,
      op_paid_date,
      op_reference_no,
      op_payment_method,
      op_remark,
      op_remaining_amount,
      dateTime,
    ];

    db.query(insertQuery, insertParams, (err, result) => {
      if (err) {
        return res.status(400).json({ success: false, message: err.message });
      }

      // Update remaining_amount in employee_sold_units table
      const updateQuery = `
        UPDATE employee_sold_units 
        SET remaining_amount = remaining_amount - ?,
            esu_updated_at = ?
        WHERE esu_id = ?
      `;

      const updateParams = [op_amount, dateTime, op_sale_id];

      db.query(updateQuery, updateParams, (updateErr, updateResult) => {
        if (updateErr) {
          return res
            .status(400)
            .json({ success: false, message: updateErr.message });
        }

        return res.status(200).json({
          success: true,
          message:
            "Owner payment details added and remaining amount updated successfully",
        });
      });
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getOwnerPaymentsByMultiIds = (req, res) => {
  try {
    const { saleId, ownerId, orgId } = req.params;
    const selectQuery = `select * from owner_payments join employee_sold_units on employee_sold_units.esu_id = owner_payments.op_sale_id join owner on owner.owner_id = owner_payments.op_owner_id join company_profile on company_profile.org_id = owner_payments.op_org_id where owner_payments.op_sale_id = ? and owner_payments.op_owner_id = ? and owner_payments.op_org_id = ?`;
    db.query(selectQuery, [saleId, ownerId, orgId], (err, result) => {
      if (err) {
        return res.status(400).json({ success: false, message: err.message });
      }
      return res.status(200).send(result);
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createOwnerLoan = (req, res) => {
  try {
    const {
      loan_org_id,
      loan_owner_id,
      loan_sale_id,
      loan_finance_company_id,
      loan_principal,
      loan_down_payment,
      loan_interest_rate,
      loan_tenure_months,
      loan_emi_amount,
      loan_start_date,
      loan_status,
      loan_ref,
    } = req.body;

    const dateTime = moment().tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss");

    if (
      !loan_org_id ||
      !loan_sale_id ||
      !loan_principal ||
      !loan_interest_rate ||
      !loan_tenure_months ||
      !loan_start_date
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const insertLoanQuery = `
      INSERT INTO owner_loans 
      (loan_org_id, loan_owner_id, loan_sale_id, loan_finance_company_id, loan_principal, loan_down_payment, loan_interest_rate, loan_tenure_months, loan_emi_amount, loan_start_date, loan_status, loan_ref, loan_created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const insertParams = [
      loan_org_id,
      loan_owner_id,
      loan_sale_id,
      loan_finance_company_id,
      loan_principal,
      loan_down_payment,
      loan_interest_rate,
      loan_tenure_months,
      loan_emi_amount,
      loan_start_date,
      loan_status || "active",
      loan_ref,
      dateTime,
    ];

    // Insert loan record first
    db.query(insertLoanQuery, insertParams, (err, loanResult) => {
      if (err) {
        return res.status(400).json({ success: false, message: err.message });
      }

      const loanId = loanResult.insertId;

      // ---------- EMI Schedule Generation ----------
      const principal = parseFloat(loan_principal);
      const rate = parseFloat(loan_interest_rate) / 100 / 12;
      const months = parseInt(loan_tenure_months);
      const emiAmount = parseFloat(loan_emi_amount);

      let remainingPrincipal = principal;
      let installments = [];

      for (let i = 1; i <= months; i++) {
        const interestComponent = remainingPrincipal * rate;
        const principalComponent = emiAmount - interestComponent;
        remainingPrincipal -= principalComponent;

        const dueDate = moment(loan_start_date)
          .add(i * 30, "days")
          .format("YYYY-MM-DD");

        installments.push([
          loan_org_id,
          loanId,
          i,
          dueDate,
          principalComponent.toFixed(2),
          interestComponent.toFixed(2),
          emiAmount.toFixed(2),
          0,
          null,
          "pending",
          dateTime,
          null,
        ]);
      }

      const insertInstallmentsQuery = `
        INSERT INTO loan_installments 
        (inst_org_id, inst_loan_id, installment_number, inst_due_date, principal_component, interest_component, inst_amount, inst_paid_amount, inst_paid_on, inst_paid_status, inst_created_at, inst_updated_at)
        VALUES ?
      `;

      db.query(insertInstallmentsQuery, [installments], (err2) => {
        if (err2) {
          return res.status(400).json({
            success: false,
            message:
              "Loan created but installment schedule failed: " + err2.message,
          });
        }

        return res.status(200).json({
          success: true,
          message: "Owner loan created successfully with EMI schedule",
        });
      });
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getFinanceCompanyByOrg = (req, res) => {
  try {
    const orgId = req.params.orgId;
    const selectQuery = `select * from finance_companies where fc_org_id = ?`;
    db.query(selectQuery, orgId, (err, result) => {
      if (err) {
        return res.status(400).json({ success: false, message: err.message });
      }
      return res.status(200).send(result);
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteFinanceCompany = (req, res) => {
  try {
    const fcId = req.params.fcId;
    const checkQuery = `select * from finance_companies where finance_company_id = ?`;
    db.query(checkQuery, fcId, (err, result) => {
      if (err) {
        return res.status(400).json({ success: false, message: err.message });
      }

      if (result && result.length > 0) {
        const deleteQuery = `delete from finance_companies where finance_company_id = ?`;
        db.query(deleteQuery, fcId, (deleteErr, deleteResult) => {
          if (deleteErr) {
            return res
              .status(400)
              .json({ success: false, message: deleteErr.message });
          }
          return res.status(200).json({
            success: true,
            message: "finance company data deleted successfully",
          });
        });
      } else {
        return res
          .status(400)
          .json({ success: false, message: "invalid finance company ID" });
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateFinanceCompany = (req, res) => {
  try {
    const { fcId } = req.params;
    const { fc_name, fc_contact_person, fc_contact_phone, interest_rate } =
      req.body;

    if (!fcId) {
      return res
        .status(400)
        .json({ success: false, message: "Finance Company ID is required" });
    }

    const checkQuery = `select * from finance_companies where finance_company_id = ?`;
    db.query(checkQuery, fcId, (err, result) => {
      if (err) {
        return res.status(400).json({ success: false, message: err.message });
      }

      if (result && result.length === 0) {
        return res
          .status(400)
          .json({ success: false, message: "Finance company ID not found" });
      }

      const fields = [];
      const values = [];

      if (fc_name) {
        fields.push("fc_name = ?");
        values.push(fc_name);
      }
      if (fc_contact_person) {
        fields.push("fc_contact_person = ?");
        values.push(fc_contact_person);
      }
      if (fc_contact_phone) {
        fields.push("fc_contact_phone = ?");
        values.push(fc_contact_phone);
      }
      if (interest_rate !== undefined) {
        fields.push("interest_rate = ?");
        values.push(interest_rate);
      }

      if (fields.length === 0) {
        return res
          .status(400)
          .json({ success: false, message: "No fields provided to updated" });
      }

      const dateTime = moment()
        .tz("Asia/Kolkata")
        .format("YYYY-MM-DD HH:mm:ss");

      fields.push("fc_updated_at = ?");
      values.push(dateTime);

      values.push(fcId);

      const updateQuery = `update finance_companies set ${fields.join(
        ", "
      )} where finance_company_id = ?`;

      db.query(updateQuery, values, (updateErr, updateResult) => {
        if (updateErr) {
          if (updateErr.code === "ER_DUP_ENTRY") {
            return res.status(400).json({
              success: false,
              message: "finance company name already exists",
            });
          }
          return req
            .status(400)
            .json({ success: false, message: updateErr.message });
        }

        return res.status(200).json({
          success: true,
          message: "Finance company details updated successfully",
        });
      });
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getLoanEmiDetailsByLoanID = (req, res) => {
  try {
    const loanId = req.params.loanId;
    const selectQuery = `select * from owner_loans join loan_installments on loan_installments.inst_loan_id = owner_loans.own_loan_id join finance_companies on finance_companies.finance_company_id = owner_loans.loan_finance_company_id where owner_loans.own_loan_id = ?`;
    db.query(selectQuery, loanId, (err, result) => {
      if (err) {
        return res.status(400).json({ success: false, message: err.message });
      }
      return res.status(200).send(result);
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateInstallments = (req, res) => {
  try {
    const { instId } = req.params;
    const { inst_paid_amount, inst_paid_on, inst_paid_status } = req.body;

    if (!instId) {
      return res
        .status(400)
        .json({ success: false, message: "Installment ID is requirement" });
    }

    const dateTime = moment().tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss");

    const updateQuery = `update loan_installments set inst_paid_amount = ?, inst_paid_on = ?, inst_paid_status = ?, inst_updated_at = ? where installment_id  = ?`;

    const insertParams = [
      inst_paid_amount,
      inst_paid_on,
      inst_paid_status,
      dateTime,
      instId,
    ];

    db.query(updateQuery, insertParams, (err, result) => {
      if (err) {
        return res.status(400).json({ success: false, message: err.message });
      }

      if (result.affectedRows === 0) {
        return res
          .status(404)
          .json({ success: false, message: "Installment not found" });
      }

      return res
        .status(200)
        .json({ success: true, message: "Installment updated successfully" });
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const updateEmployeeUnitSoldUpdate = (req, res) => {
  try {
    const esu_id = req.params.esu_id;
    const {
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
    } = req.body;

    if (!esu_id) {
      return res.status(400).json({
        success: false,
        message: "Missing required parameter: esu_id",
      });
    }

    const dateTime = moment().tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss");

    const fieldsToUpdate = [];
    const values = [];

    if (esu_lead_id !== undefined) {
      fieldsToUpdate.push("esu_lead_id = ?");
      values.push(esu_lead_id);
    }
    if (esu_staff_id !== undefined) {
      fieldsToUpdate.push("esu_staff_id = ?");
      values.push(esu_staff_id);
    }
    if (esu_unit_id !== undefined) {
      fieldsToUpdate.push("esu_unit_id = ?");
      values.push(esu_unit_id);
    }
    if (esu_project_id !== undefined) {
      fieldsToUpdate.push("esu_project_id = ?");
      values.push(esu_project_id);
    }
    if (esu_owner_id !== undefined) {
      fieldsToUpdate.push("esu_owner_id = ?");
      values.push(esu_owner_id);
    }
    if (esu_sold_date !== undefined) {
      fieldsToUpdate.push("esu_sold_date = ?");
      values.push(esu_sold_date);
    }
    if (esu_notes !== undefined) {
      fieldsToUpdate.push("esu_notes = ?");
      values.push(esu_notes);
    }
    if (esu_sale_price !== undefined) {
      fieldsToUpdate.push("esu_sale_price = ?");
      values.push(esu_sale_price);
    }
    if (esu_token_amount !== undefined) {
      fieldsToUpdate.push("esu_token_amount = ?");
      values.push(esu_token_amount);
    }
    if (esu_token_paid_status !== undefined) {
      fieldsToUpdate.push("esu_token_paid_status = ?");
      values.push(esu_token_paid_status);
    }
    if (esu_booking_date !== undefined) {
      fieldsToUpdate.push("esu_booking_date = ?");
      values.push(esu_booking_date);
    }
    if (esu_final_date !== undefined) {
      fieldsToUpdate.push("esu_final_date = ?");
      values.push(esu_final_date);
    }
    if (registry_name !== undefined) {
      fieldsToUpdate.push("registry_name = ?");
      values.push(registry_name);
    }
    if (registry_date !== undefined) {
      fieldsToUpdate.push("registry_date = ?");
      values.push(registry_date);
    }
    if (esu_payment_method !== undefined) {
      fieldsToUpdate.push("esu_payment_method = ?");
      values.push(esu_payment_method);
    }
    if (remaining_amount !== undefined) {
      fieldsToUpdate.push("remaining_amount = ?");
      values.push(remaining_amount);
    }

    fieldsToUpdate.push("esu_updated_at = ?");
    values.push(dateTime);

    if (fieldsToUpdate.length === 1) {
      return res.status(400).json({
        success: false,
        message: "No fields provided for update",
      });
    }

    const updateSql = `
      UPDATE employee_sold_units 
      SET ${fieldsToUpdate.join(", ")} 
      WHERE esu_id = ?
    `;
    values.push(esu_id);

    db.query(updateSql, values, (err, result) => {
      if (err) {
        return res.status(400).json({
          success: false,
          message: err.message,
        });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: "No record found with the given esu_id",
        });
      }

      res.status(200).json({
        success: true,
        message: "Employee sold unit updated successfully",
      });
    });
  } catch (error) {
    console.error("updateEmployeeUnitSold Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getSubscriptionDetailsByOrg = (req, res) => {
  try {
    const orgId = req.params.orgId;
    const selectQuery = `select * from company_profile join company_profile.cp_subscription_id = subscriptions.subscription_id where company_profile.org_id = ?`;
    db.query(selectQuery, orgId, (err, result) => {
      if (err) {
        return res.status(400).json({ success: false, message: err.message });
      }
      return res.status(200).send(result);
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateCompanySubscription = (req, res) => {
  try {
    const { org_id, cp_subscription_id } = req.params;

    if (!org_id || !cp_subscription_id) {
      return res.status(400).json({
        success: false,
        message: "org_id and cp_subscription_id are required",
      });
    }

    const dateTime = moment().tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss");

    const updateQuery = `
      UPDATE company_profile 
      SET cp_subscription_id = ?, company_updated_at = ? 
      WHERE org_id = ?
    `;

    db.query(
      updateQuery,
      [cp_subscription_id, dateTime, org_id],
      (err, result) => {
        if (err) {
          return res.status(400).json({ success: false, message: err.message });
        }

        if (result.affectedRows === 0) {
          return res.status(404).json({
            success: false,
            message: "Company not found or no changes made",
          });
        }

        // Fetch updated record
        const selectQuery = `SELECT * FROM company_profile WHERE org_id = ?`;
        db.query(selectQuery, [org_id], (fetchErr, fetchResult) => {
          if (fetchErr) {
            return res
              .status(400)
              .json({ success: false, message: fetchErr.message });
          }

          res.status(200).json({
            success: true,
            message: "Subscription updated successfully",
            data: fetchResult[0],
          });
        });
      }
    );
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const bulkUploadLeads = (req, res) => {
  try {
    const { lead_org_id } = req.body;
    const dateTime = moment().tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss");

    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded" });
    }

    if (!lead_org_id) {
      return res
        .status(400)
        .json({ success: false, message: "lead_org_id is required" });
    }

    const filePath = req.file.path;

    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    if (!sheetData.length) {
      fs.unlinkSync(filePath);
      return res
        .status(400)
        .json({ success: false, message: "Excel file is empty" });
    }

    const values = sheetData.map((row) => [
      lead_org_id,
      row.name || null,
      row.phone || null,
      row.lead_email || null,
      row.leadSource || null,
      null,
      row.unit_type || null,
      null,
      row.address || null,
      dateTime,
      row.actual_date || null,
    ]);

    const sql = `
      INSERT INTO leads (
        lead_org_id, name, phone, lead_email, leadSource,
        main_project_id, unit_type, unit_id, address, createdTime, actual_date
      ) VALUES ?
    `;

    db.query(sql, [values], (err, result) => {
      fs.unlinkSync(filePath);

      if (err) {
        return res.status(500).json({ success: false, message: err.message });
      }

      res.status(201).json({
        success: true,
        message: `${result.affectedRows} leads added successfully.`,
      });
    });
  } catch (error) {
    if (req.file?.path) fs.unlinkSync(req.file.path);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

module.exports = {
  metaLeadFetchByPageId,
  getMetaLeadsByOrgId,
  updateAndAssignedMetaLeads,
  getAllUnitsByProjectId,
  getMetaLeadsByStaffId,
  getMetaLeadsByLeadId,
  updateOnlyMetaLeadStatusEmployeeEnd,
  createFinanceCompany,
  createOwnerPayments,
  getOwnerPaymentsByMultiIds,
  createOwnerLoan,
  getFinanceCompanyByOrg,
  deleteFinanceCompany,
  updateFinanceCompany,
  getLoanEmiDetailsByLoanID,
  updateInstallments,
  updateEmployeeUnitSoldUpdate,
  getSubscriptionDetailsByOrg,
  updateCompanySubscription,
  bulkUploadLeads,
};
