import express from 'express';
import sgMail from '@sendgrid/mail';
import { config } from 'dotenv';

// Load environment variables from sendgrid.env file
config({ path: './sendgrid.env' });

// Set SendGrid API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
console.log(process.env.SENDGRID_API_KEY)


const router = express.Router();

// Route to render the email form
router.get('/email-view', (req, res) => {
  res.render('view_email_send');
});

// Route to handle the form submission
router.post('/send-email', (req, res) => {
  const { to, subject } = req.body;
const message = 'adsfasfas'
  const msg = {
    to: 'torarnehave@gmail.com',
    from: 'post@slowyou.net', // Change to your verified sender
    subject: 'Dette er en melding',
    text: 'text i meldingen',
    html: `<strong>${message}</strong>`
  };

  sgMail
    .send(msg)
    .then(() => {
      console.log('Email sent');
      res.send('Email sent');
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error sending email');
    });
});

export default router;