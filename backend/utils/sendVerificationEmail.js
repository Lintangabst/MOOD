const nodemailer = require("nodemailer");

const sendVerificationEmail = async (email, token) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  const link = `http://localhost:3000/verify?token=${token}`;

  await transporter.sendMail({
    from: '"MOOD App" <no-reply@mood.com>',
    to: email,
    subject: "Verify your email",
    html: `
      <p>Hi, please verify your email by clicking the link below:</p>
      <a href="${link}">Verify Email</a>
    `,
  });
};

module.exports = { sendVerificationEmail };
