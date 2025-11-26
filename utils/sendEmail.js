import nodemailer from 'nodemailer';

export async function sendEmail({ to, subject, text, html, attachments }) {
  const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,       // e.g. smtp.gmail.com
    port: process.env.MAIL_PORT,       // e.g. 587
    secure: false,                     // TLS
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    }
  });

  return transporter.sendMail({
    from: `"Eventease" <${process.env.MAIL_USER}>`,
    to,
    subject,
    text,
    html,
    attachments
  });
}
