const nodemailer = require("nodemailer");

module.exports = async ({ from, to, subject, text, html }) => {
    let transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASSWORD,
        },
    });

   let info = await transporter.sendMail({
        from: `Transferra <prthakur2003@gmail.com>`,
        to: to, 
        subject: subject, 
        text: text, 
        html: html, 
    });
    
    console.log("Message sent: %s", info.messageId);
};