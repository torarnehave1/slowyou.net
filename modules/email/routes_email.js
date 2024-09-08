import express from "express";
import nodemailer from "nodemailer";
import dotenv from 'dotenv';
dotenv.config();


const username = process.env.EMAIL_USERNAME;
const password = process.env.EMAIL_PASSWORD;


const router = express.Router();

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: username,
    pass: password,
  },
});

router.post("/send-email", async (req, res) => {
    const { to, subject, text } = req.body;

  
    try {
      await transporter.sendMail({
          from: username,
          to: to,
          subject:subject,
          text:text
      });

      res.json({ message: 'Email sent successfully' });
      
  } catch (error) {
      res.status(500).json({ error: 'Error sending email: ' + error.message });
  }
});
export default router;