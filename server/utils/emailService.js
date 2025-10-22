const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.EMAILHOST,
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAILSENDER,
    pass: process.env.EMAILPASSWORD,
  },
});

async function sendEmail(to, subject, text, html = null) {
  try {
    const mailOptions = {
      from: `"CRMGuru" <${process.env.EMAILSENDER}>`,
      to,
      subject,
      text,
      ...(html && { html }),
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent to ${to}`);
  } catch (error) {
    console.error("❌ Email sending failed:", error.message);
    throw new Error("Email sending failed");
  }
}

module.exports = { sendEmail };
