const mailer = require('./mailClient');
const handlebars = require('handlebars');
const fs = require('fs')
const path = require('path')

const sendRequestApproveMail = (username, recipient) => {

    const template = fs.readFileSync(path.join(__dirname, '/template.hbs'), 'utf8')
    const htmlContent = handlebars.compile(template);

    const mailContent = htmlContent({
        subject: 'המשתמש שלך אושר',
        name: username
    })

    mailer.sendMail({
        from: process.env.EMAIL_USER,
        to: recipient,
        subject: 'המשתמש שלך אושר',
        html: mailContent
    })
}

const sendPasswordMail = (username, recipient, password) => {

    const template = fs.readFileSync(path.join(__dirname, '/passwordTemplate.hbs'), 'utf8')
    const htmlContent = handlebars.compile(template);

    const mailContent = htmlContent({
        subject: 'סיסמה זמנית',
        name: username,
        password
    })

    mailer.sendMail({
        from: process.env.EMAIL_USER,
        to: recipient,
        subject: 'סיסמה זמנית',
        html: mailContent
    })
}


const sendVerificationCodeMail = (username, recipient, code) => {

    const template = fs.readFileSync(path.join(__dirname, '/codeTemplate.hbs'), 'utf8')
    const htmlContent = handlebars.compile(template);

    const mailContent = htmlContent({
        subject: 'קוד אימות',
        name: username,
        code
    })

    mailer.sendMail({
        from: process.env.EMAIL_USER,
        to: recipient,
        subject: 'סיסמה זמנית',
        html: mailContent
    })
}

const sendOrderReadyMail = (username, recipient, orderNumber) => {

    const template = fs.readFileSync(path.join(__dirname, '/orderComplete.hbs'), 'utf8')
    const htmlContent = handlebars.compile(template);

    const mailContent = htmlContent({
        subject: 'הזמנה מוכנה',
        name: username,
        orderNumber
    })

    mailer.sendMail({
        from: process.env.EMAIL_USER,
        to: recipient,
        subject: 'הזמנה מוכנה',
        html: mailContent
    })
}


module.exports = {
    sendRequestApproveMail,
    sendPasswordMail,
    sendVerificationCodeMail,
    sendOrderReadyMail
}