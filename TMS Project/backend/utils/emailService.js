const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const sendEmail = async (subject, text, to = process.env.NOTIFICATION_EMAIL) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to,
            subject,
            text
        };

        if (!process.env.EMAIL_PASS || process.env.EMAIL_PASS === 'your_app_password_here') {
            const skipMsg = 'Skipping email send: EMAIL_PASS not configured.\n';
            console.log(skipMsg);
            fs.appendFileSync(path.join(__dirname, '../email_debug.log'), `[${new Date().toISOString()}] SKIP: ${skipMsg}`);
            console.log(`Email content - Subject: ${subject}, Body: ${text}`);
            return;
        }

        const info = await transporter.sendMail(mailOptions);
        const successMsg = `Email sent: ${info.response}\n`;
        console.log(successMsg);
        fs.appendFileSync(path.join(__dirname, '../email_debug.log'), `[${new Date().toISOString()}] SUCCESS: ${successMsg}`);
    } catch (error) {
        const errorMsg = `Error sending email: ${error.message}\n`;
        console.error(errorMsg);
        fs.appendFileSync(path.join(__dirname, '../email_debug.log'), `[${new Date().toISOString()}] ERROR: ${errorMsg}`);
    }
};

module.exports = { sendEmail };
