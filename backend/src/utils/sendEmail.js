const nodemailer = require("nodemailer");
const { Resend } = require("resend");

const sendEmail = async (options) => {
  // If Resend API key is provided, use Resend!
  if (process.env.RESEND_API_KEY) {
    const resend = new Resend(process.env.RESEND_API_KEY);
    
    try {
      const data = await resend.emails.send({
        from: 'Aslenix POS <onboarding@resend.dev>',
        to: options.email,
        subject: options.subject,
        text: options.message,
        html: options.html,
      });
      console.log("Email sent via Resend:", data);
      return null; // No preview URL for real emails
    } catch (error) {
      console.error("Resend error:", error);
      throw error;
    }
  }

  // Fallback: Generate test SMTP service account from ethereal.email if no API key
  console.log("No RESEND_API_KEY found in .env, falling back to Ethereal Email test popups.");
  const testAccount = await nodemailer.createTestAccount();
  
  const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });

  const mailOptions = {
    from: '"Aslenix POS" <test@ethereal.email>',
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html,
  };

  const info = await transporter.sendMail(mailOptions);

  const previewUrl = nodemailer.getTestMessageUrl(info);
  console.log("Preview URL: %s", previewUrl);
  return previewUrl;
};

module.exports = sendEmail;
