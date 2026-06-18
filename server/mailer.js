const nodemailer = require('nodemailer');
require('dotenv').config();

let transporter;
let isMockTransporter = false;

async function initMailer() {
  if (process.env.SMTP_USER && process.env.SMTP_PASS) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: process.env.SMTP_PORT || 587,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  } else {
    try {
      // Generate test SMTP service account from ethereal.email
      let testAccount = await nodemailer.createTestAccount();
      console.log("Using Ethereal test email account: ", testAccount.user);
      transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
    } catch (error) {
      console.error("Failed to create Ethereal test account:", error.message);
      console.log("Emails will be printed to console instead.");
      isMockTransporter = true;
      transporter = {
        sendMail: async (mailOptions) => {
          console.log("Mock Email Sent:");
          console.log("To:", mailOptions.to);
          console.log("Subject:", mailOptions.subject);
          console.log("Link in body:", mailOptions.html.match(/href="([^"]+)"/)?.[1] || "No link found");
          return { messageId: 'mock-id' };
        }
      };
    }
  }
}

initMailer();

const sendVerificationEmail = async (toEmail, token) => {
  const verificationLink = `http://localhost:5173/verify-email?token=${token}`;

  const mailOptions = {
    from: '"Kaliyar Sharif Portal" <no-reply@kaliyar.com>',
    to: toEmail,
    subject: 'Verify your email address',
    html: `
      <h2>Welcome to Kaliyar Sharif Portal!</h2>
      <p>Please click the link below to verify your email address:</p>
      <a href="${verificationLink}" style="display:inline-block; padding: 10px 20px; background-color: #2e7d32; color: white; text-decoration: none; border-radius: 5px; margin-top: 10px; margin-bottom: 10px;">Verify Email</a>
      <p>Or copy and paste this link into your browser: <br/> <a href="${verificationLink}">${verificationLink}</a></p>
    `
  };

  try {
    let info = await transporter.sendMail(mailOptions);
    console.log('Verification email sent: %s', info.messageId);
    if (!process.env.SMTP_USER && !isMockTransporter) {
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    }
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};

module.exports = { sendVerificationEmail };
