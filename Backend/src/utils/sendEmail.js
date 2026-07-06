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

const sendApprovalEmail = async (toEmail, carrierName) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: `"Carryz.online" <${process.env.SMTP_USER}>`,
    to: toEmail,
    bcc: process.env.SMTP_USER,
    subject: "Your Carryz carrier account is approved!",
    html: `
      <!DOCTYPE html>
      <html>
        <body style="margin:0;padding:0;background:#f4f4f4;font-family:Arial,sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:40px 0;">
            <tr>
              <td align="center">
                <table width="520" cellpadding="0" cellspacing="0"
                       style="background:#ffffff;border-radius:12px;overflow:hidden;
                              box-shadow:0 2px 8px rgba(0,0,0,0.08);">

                  <tr>
                    <td style="background:linear-gradient(135deg,#4f46e5,#7c3aed);
                               padding:32px 40px;text-align:center;">
                      <h1 style="color:#ffffff;margin:0;font-size:26px;font-weight:700;">Carryz.online</h1>
                      <p style="color:#c7d2fe;margin:8px 0 0;font-size:13px;">Sri Lanka's trusted parcel network</p>
                    </td>
                  </tr>

                  <tr>
                    <td style="padding:36px 40px;">
                      <p style="color:#374151;font-size:16px;margin:0 0 12px;">
                        Hi ${carrierName},
                      </p>
                      <p style="color:#6b7280;font-size:15px;line-height:1.6;margin:0 0 16px;">
                        Great news! Your Carryz carrier account has been 
                        <strong style="color:#16a34a;">approved</strong> by our admin team.
                      </p>
                      <p style="color:#6b7280;font-size:15px;line-height:1.6;margin:0 0 28px;">
                        You can now log in and start listing your travels to carry parcels across Sri Lanka.
                      </p>

                      <!-- What you can do now -->
                      <table cellpadding="0" cellspacing="0" width="100%"
                             style="background:#f0fdf4;border-radius:8px;margin-bottom:28px;">
                        <tr>
                          <td style="padding:20px 24px;">
                            <p style="margin:0 0 10px;font-size:14px;font-weight:600;color:#15803d;">
                              What you can do now:
                            </p>
                            <p style="margin:4px 0;font-size:14px;color:#374151;">✅ Log in to your carrier dashboard</p>
                            <p style="margin:4px 0;font-size:14px;color:#374151;">✅ Add your travel routes and dates</p>
                            <p style="margin:4px 0;font-size:14px;color:#374151;">✅ Accept parcel requests from customers</p>
                            <p style="margin:4px 0;font-size:14px;color:#374151;">✅ Earn by carrying parcels on your trips</p>
                          </td>
                        </tr>
                      </table>

                      <table cellpadding="0" cellspacing="0" width="100%">
                        <tr>
                          <td align="center">
                            <a href="${process.env.CLIENT_URL}/login"
                               style="display:inline-block;background:#4f46e5;color:#ffffff;
                                      text-decoration:none;padding:14px 36px;border-radius:8px;
                                      font-size:15px;font-weight:600;">
                              Log in to Carryz.online
                            </a>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>

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

const sendRegistrationRequestEmail = async (carrierName, carrierNic, carrierPhone, carrierCategory) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: `"Carryz.online" <${process.env.SMTP_USER}>`,
    to: process.env.SMTP_USER,       // sends to yourself (admin)
    subject: "New carrier registration request",
    html: `
      <!DOCTYPE html>
      <html>
        <body style="margin:0;padding:0;background:#f4f4f4;font-family:Arial,sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:40px 0;">
            <tr>
              <td align="center">
                <table width="520" cellpadding="0" cellspacing="0"
                       style="background:#ffffff;border-radius:12px;overflow:hidden;
                              box-shadow:0 2px 8px rgba(0,0,0,0.08);">

                  <tr>
                    <td style="background:linear-gradient(135deg,#4f46e5,#7c3aed);
                               padding:32px 40px;text-align:center;">
                      <h1 style="color:#ffffff;margin:0;font-size:26px;font-weight:700;">Carryz.online Admin</h1>
                      <p style="color:#c7d2fe;margin:8px 0 0;font-size:13px;">New carrier registration</p>
                    </td>
                  </tr>

                  <tr>
                    <td style="padding:36px 40px;">
                      <p style="color:#374151;font-size:16px;margin:0 0 20px;">
                        A new carrier has registered and is waiting for your approval.
                      </p>

                      <table cellpadding="0" cellspacing="0" width="100%"
                             style="background:#f8fafc;border-radius:8px;margin-bottom:28px;
                                    border:1px solid #e5e7eb;">
                        <tr>
                          <td style="padding:20px 24px;">
                            <p style="margin:0 0 6px;font-size:13px;font-weight:600;
                                      color:#6b7280;text-transform:uppercase;letter-spacing:0.5px;">
                              Carrier Details
                            </p>
                            <table width="100%" cellpadding="0" cellspacing="0"
                                   style="margin-top:12px;">
                              <tr>
                                <td style="font-size:14px;color:#6b7280;padding:6px 0;width:120px;">Name</td>
                                <td style="font-size:14px;color:#111827;font-weight:500;padding:6px 0;">
                                  ${carrierName}
                                </td>
                              </tr>
                              <tr style="border-top:1px solid #e5e7eb;">
                                <td style="font-size:14px;color:#6b7280;padding:6px 0;">NIC</td>
                                <td style="font-size:14px;color:#111827;font-weight:500;padding:6px 0;">
                                  ${carrierNic}
                                </td>
                              </tr>
                              <tr style="border-top:1px solid #e5e7eb;">
                                <td style="font-size:14px;color:#6b7280;padding:6px 0;">Phone</td>
                                <td style="font-size:14px;color:#111827;font-weight:500;padding:6px 0;">
                                  ${carrierPhone}
                                </td>
                              </tr>
                              <tr style="border-top:1px solid #e5e7eb;">
                                <td style="font-size:14px;color:#6b7280;padding:6px 0;">Category</td>
                                <td style="font-size:14px;color:#111827;font-weight:500;padding:6px 0;">
                                  ${carrierCategory}
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>

                      <table cellpadding="0" cellspacing="0" width="100%">
                        <tr>
                          <td align="center">
                            <a href="${process.env.CLIENT_URL}/admin"
                               style="display:inline-block;background:#4f46e5;color:#ffffff;
                                      text-decoration:none;padding:14px 36px;border-radius:8px;
                                      font-size:15px;font-weight:600;">
                              Review in Admin Dashboard
                            </a>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>

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

// ← update exports
module.exports = { sendPasswordResetEmail, sendApprovalEmail, sendRegistrationRequestEmail };

