const nodemailer = require("nodemailer");

/**
 * Creates a reusable Nodemailer transporter.
 * Uses Gmail SMTP with an App Password (not your real Gmail password).
 *
 * To get an App Password:
 *   Google Account → Security → 2-Step Verification → App Passwords
 *   Generate one for "Mail" → copy into GMAIL_APP_PASSWORD in .env
 */
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,       // smtp.hostinger.com
    port: parseInt(process.env.SMTP_PORT), // 465
    secure: process.env.SMTP_SECURE === "true", // true for port 465
    auth: {
      user: process.env.SMTP_USER,     // noreply@carryz.lk
      pass: process.env.SMTP_PASS,     // your Hostinger email password
    },
  });
};

/**
 * Sends the password-reset email.
 *
 * @param {string} toEmail   - recipient email address
 * @param {string} resetUrl  - full reset link (includes raw token)
 * @param {string} userName  - user's name for personalisation
 */
const sendPasswordResetEmail = async (toEmail, resetUrl, userName) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: `"Carryz.online" <${process.env.SMTP_USER}>`,
    to: toEmail,
    bcc: process.env.SMTP_USER,
    subject: "Reset your Carryz password",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        </head>
        <body style="margin:0;padding:0;background:#f4f4f4;font-family:Arial,sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:40px 0;">
            <tr>
              <td align="center">
                <table width="520" cellpadding="0" cellspacing="0"
                       style="background:#ffffff;border-radius:12px;overflow:hidden;
                              box-shadow:0 2px 8px rgba(0,0,0,0.08);">

                  <!-- Header -->
                  <tr>
                    <td style="background:linear-gradient(135deg,#4f46e5,#7c3aed);
                               padding:32px 40px;text-align:center;">
                      <h1 style="color:#ffffff;margin:0;font-size:26px;font-weight:700;
                                 letter-spacing:-0.5px;">Carryz.online</h1>
                      <p style="color:#c7d2fe;margin:8px 0 0;font-size:13px;">
                        Sri Lanka's trusted parcel network
                      </p>
                    </td>
                  </tr>

                  <!-- Body -->
                  <tr>
                    <td style="padding:36px 40px;">
                      <p style="color:#374151;font-size:16px;margin:0 0 12px;">
                        Hi ${userName},
                      </p>
                      <p style="color:#6b7280;font-size:15px;line-height:1.6;margin:0 0 28px;">
                        We received a request to reset the password for your Carryz account.
                        Click the button below — this link is valid for
                        <strong style="color:#374151;">30 minutes</strong>.
                      </p>

                      <!-- CTA button -->
                      <table cellpadding="0" cellspacing="0" width="100%">
                        <tr>
                          <td align="center">
                            <a href="${resetUrl}"
                               style="display:inline-block;background:#4f46e5;color:#ffffff;
                                      text-decoration:none;padding:14px 36px;border-radius:8px;
                                      font-size:15px;font-weight:600;letter-spacing:0.2px;">
                              Reset my password
                            </a>
                          </td>
                        </tr>
                      </table>

                      <p style="color:#9ca3af;font-size:12px;margin:28px 0 0;line-height:1.5;">
                        If you didn't request this, you can safely ignore this email —
                        your password won't change.
                        <br/><br/>
                        Or copy this link into your browser:<br/>
                        <a href="${resetUrl}" style="color:#4f46e5;word-break:break-all;">
                          ${resetUrl}
                        </a>
                      </p>
                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td style="background:#f9fafb;padding:20px 40px;
                               border-top:1px solid #e5e7eb;text-align:center;">
                      <p style="color:#9ca3af;font-size:12px;margin:0;">
                        © ${new Date().getFullYear()} Carryz.online · Sri Lanka
                      </p>
                    </td>
                  </tr>

                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendPasswordResetEmail };