import cron from "node-cron";
import moment from "moment-timezone";
import { db } from "./db";

const updateExpiredSubscriptions = () => {
  const now = moment().tz("Asia/Kolkata");
  const today = now.format("YYYY-MM-DD");
  const logTime = now.format("YYYY-MM-DD HH:mm:ss");

  const query = `
    UPDATE subscriptions
    SET sub_status = 'expired',
        sub_updated_at = ?
    WHERE end_date < ?
      AND sub_status = 'active';
  `;

  db.query(query, [logTime, today], (err, result) => {
    if (err) {
      console.error("❌ Error updating subscriptions:", err);
    } else {
      console.log(`✅ ${result.affectedRows} subscriptions marked as expired.`);
    }
  });
};

export const initializeCronJobs = () => {
  cron.schedule(
    "0 0 * * *",
    () => {
      updateExpiredSubscriptions();
    },
    {
      timezone: "Asia/Kolkata",
    }
  );
};
