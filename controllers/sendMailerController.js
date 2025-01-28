const nodemailer = require("nodemailer");
const db = require("../models/index");
const UserInfo = db.UserInfo;

const transporter = nodemailer.createTransport({
  pool: true,
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  tls: {
    servername: "smtp.gmail.com",
  },
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER || "alerts.infozit@gmail.com",
    pass: process.env.SMTP_PASS,
  },
});

/**
 * Sends a stored email to a specific recipient.
 * @param {string} subject - Subject of the email.
 * @param {string} body - Body content of the email.
 * @returns {Promise<void>} - Promise resolving to indicate the email was sent.
 */
const sendStoredEmail = async (req, res) => {
  try {
    const { name, email, phoneNumber, source, city, investment } = req.body;

    const data = {
      name,
      email,
      phoneNumber,
      source,
      city,
      investments: investment,
    };

    await UserInfo.create(data);

    // Fetch the data back from the database
    const fetchedData = await UserInfo.findOne({
      where: { phoneNumber },
    });

    if (!fetchedData) {
      return errorResponse(res, "Failed to retrieve user data.", 404);
    }

    const emailBody = generateEmailTemplate(fetchedData);

    // Email options
    const mailOptions = {
      from: process.env.SMTP_USER,
      to: "tsk@kapilengineers.com",
      subject: "Welcome to Our Service",
      text: `Hello ${fetchedData.name},\nWelcome to our service!`,
      html: emailBody,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    res.status(200).json({
      status: "success",
      message: "Email sent successfully.",
    });
  } catch (error) {
    console.error("Error sending email:", error.message);
    return {
      status: "failure",
      message: "Failed to send email.",
    };
  }
};

const generateEmailTemplate = (details) => {
  const { name, phoneNumber, email, city, investments } = details;

  return `
  <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333; padding: 20px;">
    <h2 style="color: #4CAF50;">New Contact Information</h2>
    <p>Below are the details of the contact:</p>
    <table style="border-collapse: collapse; width: 100%; max-width: 600px;">
      <tr style="background-color: #f2f2f2;">
        <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Field</th>
        <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Details</th>
      </tr>
      <tr>
        <td style="border: 1px solid #ddd; padding: 8px;">Name</td>
        <td style="border: 1px solid #ddd; padding: 8px;">${name}</td>
      </tr>
      <tr>
        <td style="border: 1px solid #ddd; padding: 8px;">Number</td>
        <td style="border: 1px solid #ddd; padding: 8px;">${phoneNumber}</td>
      </tr>
      <tr>
        <td style="border: 1px solid #ddd; padding: 8px;">Email</td>
        <td style="border: 1px solid #ddd; padding: 8px;">${email}</td>
      </tr>
      <tr>
        <td style="border: 1px solid #ddd; padding: 8px;">City</td>
        <td style="border: 1px solid #ddd; padding: 8px;">${city}</td>
      </tr>
      <tr>
        <td style="border: 1px solid #ddd; padding: 8px;">Investment</td>
        <td style="border: 1px solid #ddd; padding: 8px;">${investments}</td>
      </tr>
    </table>
    <p style="margin-top: 20px;">Thank you!</p>
  </div>
  `;
};

module.exports = { sendStoredEmail };
