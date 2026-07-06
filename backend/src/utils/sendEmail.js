const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  let transporter;

  if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    // Create a transporter using Gmail SMTP, explicitly forcing IPv4 to fix Render's IPv6 routing bugs
    transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      family: 4, // Force IPv4
    });
  } else {
    // Fallback: Generate test SMTP service account from ethereal.email
    console.log("No Gmail credentials found in .env, falling back to Ethereal Email test popups.");
    const testAccount = await nodemailer.createTestAccount();

    transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
  }

  const mailOptions = {
    from: process.env.EMAIL_USER ? `"मिठ्ठो चिया & Tiffin घर" <${process.env.EMAIL_USER}>` : '"मिठ्ठो चिया & Tiffin घर" <test@ethereal.email>',
    replyTo: process.env.EMAIL_USER,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html || `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
        <h2 style="color: #4f46e5;">मिठ्ठो चिया & Tiffin घर</h2>
        <p style="white-space: pre-wrap; font-size: 16px;">${options.message}</p>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
        <p style="font-size: 12px; color: #999;">This is an automated system message. Please do not reply directly to this email.</p>
      </div>
    `,
  };

  const info = await transporter.sendMail(mailOptions);

  if (!process.env.EMAIL_USER) {
    const previewUrl = nodemailer.getTestMessageUrl(info);
    console.log("Preview URL: %s", previewUrl);
    return previewUrl; // Return the preview URL so we can show it in the UI
  }

  console.log("Email sent successfully via Gmail SMTP.");
  return null;
};

module.exports = sendEmail;
