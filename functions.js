const nodemailer = require("nodemailer");
const multer = require("multer")

function sendEmailFunction(from, to, subject, text) {

    let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "tiyaabali@gmail.com",
            //pass:"gmailpassword123,"
            pass: process.env.PASSWORD
        },
        tls: {
            rejectUnauthorized: false,
        }
    });

    let mailOptions = {
        from: from,
        to: to,
        subject: subject,
        text: text
    }

    transporter
        .sendMail(mailOptions)
        .then(function (res) {
            console.log('mail is sent')
        })
        .catch(function (err) {
            console.log(err)
        })
}

function uploadImage(){
    
}

module.exports = { sendEmailFunction, uploadImage };