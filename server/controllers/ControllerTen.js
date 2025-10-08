const express = require("express");
const axios = require("axios");
const cors = require("cors");
const { db } = require("../db");
const moment = require("moment-timezone");

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

module.exports = {
  metaLeadFetchByPageId,
  getMetaLeadsByOrgId,
  updateAndAssignedMetaLeads,
  getAllUnitsByProjectId,
  getMetaLeadsByStaffId,
  getMetaLeadsByLeadId,
  updateOnlyMetaLeadStatusEmployeeEnd,
};
