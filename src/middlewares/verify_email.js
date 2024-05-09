
import nodemailer from 'nodemailer';
import { config } from 'dotenv';
config(); // Load environment variables from .env file
const sender = process.env.EMAIL_SENDER;
const password = process.env.EMAIL_PASSWORD;
const sendEmail = async (recipient,token) => {
  if (recipient.includes('string')) {
    console.log('This was a test user.');
    return;
  }
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: sender,
      pass: password,
    },
    tls: {
      rejectUnauthorized: false // Add this line to ignore certificate validation errors
    }
  });
  const mailOptions = {
    from: sender,
    to: recipient,
    subject: 'Please Verify Your Airbnb Profile!',
    html: `Click the link to verify your email: http://localhost:5051/verifyEmail?token=${token}`,
  };
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
    console.log('Message sent!');
    return token;
  } catch (error) {
    console.error('Error sending email:', error);
  }
};
export default sendEmail;