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

module.exports = {
    sendRequestApproveMail
}