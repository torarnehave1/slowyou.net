import express from "express";
import nodemailer from "nodemailer";

const router = express.Router();

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'slowyou.net@gmail.com',
    pass: 'thuo hsxf fpco xgxt',
  },
});

router.post("/send-email", async (req, res) => {
    const { to, subject, text } = req.body;

  
    try {
      await transporter.sendMail({
          from: 'slowyou.net@gmail.com',
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