const nodemailer = require('nodemailer');

function sendEmail(to, subject, text, html) {
    const transporter = nodemailer.createTransport({
        host: 'mail.host.com',
        port: 587,
        secure: false,
        auth: {
            user: '',
            pass: ''
        }
    });

    var mailOptions = {
        from: '',
        to: to,
        subject: subject,
        text: text,
        html: html
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

module.exports = sendEmail