const nodemailer = require("nodemailer");
const fs = require('fs')
require('dotenv').config()

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });


async function forgetEmail(user, url, email) {
    const html = fs.readFileSync('modules/forgot.html', 'utf-8')
    const newHTML = html.replace('${url}', url).replace('${user}', user)
    const info = await transporter.sendMail({
      from: process.env.SMTP_USER, // sender address
      to: email, // list of receivers
      subject: "Redefinição de senha", // Subject line
      html: newHTML
    });
  }
  module.exports = {forgetEmail}