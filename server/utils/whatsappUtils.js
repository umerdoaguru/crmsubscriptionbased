const moment = require("moment-timezone");
const schedule = require("node-schedule");
const dotenv = require("dotenv");
const axios = require("axios");
dotenv.config();

const sendWhatsAppSoldAlert = async (
  toNumber,
  staffName,
  unitId,
  projectId,
  soldDate,
  salePrice,
  ownerName
) => {
  try {
    const url = `https://graph.facebook.com/v18.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`;

    const data = {
      messaging_product: "whatsapp",
      to: toNumber, // Admin’s WhatsApp number
      type: "template",
      template: {
        name: "unit_sold_alert", // your approved WhatsApp template name
        language: { code: "en" },
        components: [
          {
            type: "body",
            parameters: [
              { type: "text", text: staffName || "N/A" }, // {{1}}
              { type: "text", text: unitId || "N/A" }, // {{2}}
              { type: "text", text: projectId || "N/A" }, // {{3}}
              { type: "text", text: soldDate || "N/A" }, // {{4}}
              { type: "text", text: salePrice || "N/A" }, // {{5}}
              { type: "text", text: ownerName || "N/A" }, // {{6}}
            ],
          },
        ],
      },
    };

    const headers = {
      Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
      "Content-Type": "application/json",
    };

    const response = await axios.post(url, data, { headers });
    console.log(`✅ WhatsApp alert sent to ${toNumber}`);
    return response.data;
  } catch (error) {
    console.error(
      `❌ WhatsApp alert failed to ${toNumber}:`,
      error.response?.data || error.message
    );
    throw error.response?.data || error;
  }
};

const sendWhatsAppVisitAlert = async (toNumber, name, type, date, status) => {
  try {
    const url = `https://graph.facebook.com/v18.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`;

    const data = {
      messaging_product: "whatsapp",
      to: toNumber, // Admin’s WhatsApp number
      type: "template",
      template: {
        name: "crm_visit_scheduled_alert", // your approved WhatsApp template name
        language: { code: "en" },
        components: [
          {
            type: "body",
            parameters: [
              { type: "text", text: name || "N/A" }, // {{1}}
              { type: "text", text: type || "N/A" }, // {{2}}
              { type: "text", text: date || "N/A" }, // {{3}}
              { type: "text", text: status || "N/A" }, // {{4}}
            ],
          },
        ],
      },
    };

    const headers = {
      Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
      "Content-Type": "application/json",
    };

    const response = await axios.post(url, data, { headers });
    console.log(`✅ WhatsApp visit alert sent to ${toNumber}`);
    return response.data;
  } catch (error) {
    console.error(
      `❌ WhatsApp alert failed to ${toNumber}:`,
      error.response?.data || error.message
    );
    throw error.response?.data || error;
  }
};

module.exports = { sendWhatsAppSoldAlert, sendWhatsAppVisitAlert };
