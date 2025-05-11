import nodemailer from "nodemailer";

/**
 * Send payload to an email address using Gmail SMTP
 * @param fileName - The name of the file (used in the email subject)
 * @param content - The content to send in the email
 */
export const sendPayloadToEmail = async (fileName: string, content: string) => {
  try {
    // Configure the Gmail SMTP transporter
    const transporter = nodemailer.createTransport({
      service: "gmail", // Use Gmail's SMTP service
      auth: {
        user: process.env.GMAIL_USER, // Your Gmail address
        pass: process.env.GMAIL_APP_PASSWORD, // Your Gmail App Password
      },
    });

    // Send the email
    const info = await transporter.sendMail({
      from: `"INSA Personality Test" <${process.env.GMAIL_USER}>`, // Sender address
      to: process.env.RECIPIENT_EMAIL, // Recipient email address
      subject: `Payload File: ${fileName}`, // Subject line
      text: `Here is the content of the file "${fileName}":\n\n${content}`, // Plain text body
    });

    console.log(`✅ Email sent: ${info.messageId}`);
    return info.messageId;
  } catch (error) {
    console.error("❌ Error sending email:", error);
    throw error;
  }
};