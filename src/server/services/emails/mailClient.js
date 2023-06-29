const nodemailer = require("nodemailer");
require('dotenv').config();

const client = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    },
    tls: {rejectUnauthorized: false}
})

module.exports = client;