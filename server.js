import express from 'express';
import nodemailer from 'nodemailer';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000; 

app.use(cors());
app.use(bodyParser.json());

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

transporter.verify((error) => {
  if (error) {
    console.log('Error with mail server:', error);
  } else {
    console.log('Mail server is ready to send emails');
  }
});

app.use("/", (req, res) => {
  res.json({ message: "Hello World" });
});

app.post('/api/send-email', (req, res) => {
  const { name, email, message } = req.body;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER,
    subject: `New Message from ${name} - ${email}`,
    text: message,
    replyTo: email,
  };

  transporter.sendMail(mailOptions, (error) => {
    if (error) {
      console.log('Error sending email:', error);
      return res.status(500).json({ text: 'Failed to send message' });
    }
    res.status(200).json({ text: 'Message sent successfully' });
  });
});

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

export default app;
