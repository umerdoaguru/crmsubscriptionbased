const { db } = require("./db");
const path = require("path");
const fs = require("fs");
const moment = require("moment-timezone");
const schedule = require("node-schedule");
const { sendEmail } = require("./utils/emailService");

const inactiveCompany = () => {
  try {
    const now = moment().tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss");
    const today = moment().tz("Asia/Kolkata").format("YYYY-MM-DD");

    // Step 1️⃣ - Get all subscriptions that expired today
    const selectQuery = `
      SELECT *
      FROM subscriptions
      JOIN company_profile ON subscriptions.sub_org_id = company_profile.org_id
      WHERE subscriptions.end_date < ? AND s.sub_status != 'expired'
    `;

    db.query(selectQuery, [today], async (err, results) => {
      if (err) {
        console.error("[inactiveCompany] Database error (SELECT):", err);
        return;
      }

      if (!results.length) {
        console.log(
          `[inactiveCompany] No expired subscriptions found at ${now}`
        );
        return;
      }

      console.log(
        `[inactiveCompany] Found ${results.length} expired subscriptions`
      );

      // Step 2️⃣ - Mark them as expired
      const updateQuery = `
        UPDATE subscriptions
        SET sub_status = 'expired',
            sub_updated_at = ?
        WHERE end_date < ?
      `;

      db.query(updateQuery, [now, today], async (updateErr, updateResult) => {
        if (updateErr) {
          console.error(
            "[inactiveCompany] Database error (UPDATE):",
            updateErr
          );
          return;
        }

        console.log(
          `[inactiveCompany] ${updateResult.affectedRows} subscriptions marked as expired at ${now}`
        );

        // Step 3️⃣ - Send emails to each affected company
        for (const sub of results) {
          try {
            const subject = "Your CRM Guru Subscription Has Expired";
            const text = `Dear ${sub.company_name || "Customer"},
            
Your CRM Guru plan has expired as of ${moment(sub.end_date).format(
              "DD-MM-YYYY"
            )}.
Please renew your subscription to continue using all CRM features.

If you have already renewed, kindly ignore this message.

Best regards,  
The CRM Guru Team`;

            // Optionally use HTML version too
            const html = `
              <p>Dear <strong>${sub.company_name || "Customer"}</strong>,</p>
              <p>Your <strong>CRM Guru</strong> plan has expired on <strong>${moment(
                sub.end_date
              ).format("DD-MM-YYYY")}</strong>.</p>
              <p>Please renew your subscription to continue enjoying all features.</p>
              <p>If you have already renewed, kindly ignore this message.</p>
              <br/>
              <p>Best regards,<br/><strong>The CRM Guru Team</strong></p>
            `;

            await sendEmail(sub.company_email, subject, text, html);
            console.log(`📧 Expiry email sent to: ${sub.company_email}`);
          } catch (mailErr) {
            console.error(
              `[inactiveCompany] Failed to send email to ${sub.company_email}:`,
              mailErr.message
            );
          }
        }
      });
    });
  } catch (error) {
    console.error("[inactiveCompany] Fatal error:", error);
  }
};

function scheduleInactiveCompany() {
  return schedule.scheduleJob(
    "inactive-company-every-day-at-12am",
    { rule: "* * * * *", tz: "Asia/Kolkata" },
    async () => {
      console.log("inactive company triggered every minute (IST)");
      await inactiveCompany();
    }
  );
}

module.exports = { scheduleInactiveCompany, inactiveCompany };
