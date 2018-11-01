var nodemailer = require('nodemailer');
var fs = require('fs');
var path = require('path');
var logoPath = process.env.LOGO_PATH;
var appName = process.env.APP_NAME;
console.log('process.env.APP_NAME', process.env.APP_NAME);
//var moment = require('moment');
// create reusable transporter object using the default SMTP transport
var transporter = nodemailer.createTransport(process.env.SMTP);
// var setSMTP = {
//  service: 'gmail',
//  auth: {
//         user: 'smartdata.nav@gmail.com',
//         pass: 'rssb@123#'
//     }
// }
//var transporter = nodemailer.createTransport(setSMTP);
module.exports = function(type, sendTo, bodyInfo, callback) {
    console.log("In email", bodyInfo);
    if (sendTo) {
        var emails = sendTo.split(",");
        var sendTo = emails[0].replace(/\s+/g, '');
        var ccemail = "";
        if (emails.length > 1) {
            for (var i = 1; i < emails.length; i++) {
                ccemail = (i == 1 ? (emails[i].replace(/\s+/g, '')) : (ccemail + ', ' + emails[i].replace(/\s+/g, '')));
                console.log("cc", ccemail);
            }
        }
    }
    var mailOptions = {
        from: process.env.FROM_EMAIL
    };
    var htmlFile;
    switch(type)
    {
        case 'RegisterLink':
        var activeLink = process.env.URL+'/verifyEmailUrl/'+bodyInfo.token;
        htmlFile = fs.readFileSync(path.join(__dirname + '/template/registerLink.html'), 'utf-8');
        htmlFile = htmlFile.replace(/activeLink/g, activeLink).replace('$logo', logoPath).replace(/appName/g, appName);
        mailOptions.to = sendTo;
        mailOptions.subject = 'Confirmation email';
        mailOptions.html = htmlFile;
        mailOptions.bodyHtml = htmlFile;

        sendMail(mailOptions, function(emailerr, emailsuccess) {
            if (emailerr) {
                return callback(emailerr, null);
            } else {
                return callback(null, emailsuccess)
            }
        });
        break;
        case 'RegisterCode':
        htmlFile = fs.readFileSync(path.join(__dirname + '/template/registerUser.html'), 'utf-8');
        htmlFile = htmlFile.replace('$confirmationToken', bodyInfo.confirmationToken).replace('$logo', logoPath).replace(/appName/g, appName);
        mailOptions.to = sendTo;
        mailOptions.subject = 'Confirmation token';
        mailOptions.html = htmlFile;
        mailOptions.bodyHtml = htmlFile;

        sendMail(mailOptions, function(emailerr, emailsuccess) {
            if (emailerr) {
                return callback(emailerr, null);
            } else {
                return callback(null, emailsuccess)
            }
        });
        break;
        case 'ForgotPassword':
        htmlFile = fs.readFileSync(path.join(__dirname + '/template/forgotPassword.html'), 'utf-8');
        htmlFile = htmlFile.replace('$email', bodyInfo.email).replace('$password', bodyInfo.password).replace('$logo', logoPath).replace(/appName/g, appName);
        mailOptions.to = sendTo;
        mailOptions.subject = 'Forgot Password';
        mailOptions.html = htmlFile;
        mailOptions.bodyHtml = htmlFile;
        //console.log('ddddddddddd', htmlFile);
        sendMail(mailOptions, function(emailerr, emailsuccess) {
            if (emailerr) {
                return callback(emailerr, null);
            } else {
                return callback(null, emailsuccess)
            }
        });
        break;

        case 'ForgotPasswordOtp':
        htmlFile = fs.readFileSync(path.join(__dirname + '/template/forgotPasswordOtp.html'), 'utf-8');
        htmlFile = htmlFile.replace('$email', bodyInfo.email).replace('$logo', logoPath).replace('$otp',bodyInfo.otp).replace(/appName/g, appName);
        mailOptions.to = sendTo;
        mailOptions.subject = 'Forgot Password';
        mailOptions.html = htmlFile;
        mailOptions.bodyHtml = htmlFile;


        sendMail(mailOptions, function(emailerr, emailsuccess) {
            if (emailerr) {
                return callback(emailerr, null);
            } else {
                return callback(null, emailsuccess)
            }
        });
        break;
    }

    function sendMail(mailOptions, cb) {

        var a = transporter.sendMail(mailOptions, function(error, info) {
            if (error) {
              //  return cb(error, null);
            } else {
                console.log('Message sent: ' + info.response);
                //return cb(null, info);
            }
        });
        return cb(null, null);
        //setTimeout(function(){ return a.abort(); cb(null, null) }, 1500);

    }
};
