const express = require("express");
const axios = require("axios");
const cors = require("cors");
const { db } = require("../db");

const metaLeadFetchByPageId = async (req, res) => {
  const { pageId, accessToken, meta_org_id } = req.body;

  if (!pageId || !accessToken || !meta_org_id) {
    return res.status(400).json({
      error: "pageId, accessToken, and meta_org_id are required",
    });
  }

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
                (leadgen_id, meta_form_id, meta_page_id, generated_time, question_fields_data, meta_org_id, meta_lead_status)
                VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [
                  leadId,
                  form.id,
                  pageId,
                  createdTime,
                  fieldData,
                  meta_org_id,
                  "Pending",
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

module.exports = { metaLeadFetchByPageId, getMetaLeadsByOrgId };
