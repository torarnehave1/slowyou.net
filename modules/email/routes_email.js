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

    console.log(req.body);
});

export default router;