import express from 'express';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();


router.get('/mail', async (req, res) => {
  res.render('view_email_send');
});


router.post('/send-email', async (req, res) => {
  const { to, subject, message } = req.body;


  console.log('To:', to);
  console.log('Subject:', subject);
  console.log('Message:', message);

  // Create a transporter
  let transporter = nodemailer.createTransport({
    host: 'smtp.sendgrid.net',
    port: 587,
    secure: false,
    auth: {
      user: 'apikey',
      pass: process.env.SMTP_API_KEY,
    },
  });

  // Set up email data with the parameters from the request body
  let mailOptions = {
    from: '"SlowYou.net" <post@slowyou.net>',
    to: to,
    subject: subject,
    text: message,
  };

  // Send the email
  try {
    let info = await transporter.sendMail(mailOptions);
    console.log('Message sent: %s', info.messageId);
    res.send('Email sent');
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).send('Error sending email');
  }
});

export default router;