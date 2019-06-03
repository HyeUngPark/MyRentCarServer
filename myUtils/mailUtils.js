/* 
    메일 발송 모듈(gmail)
*/

var nodemailer = require('nodemailer');

var mailSender = {
    sendGmail : function(param){
        var transporter = nodemailer.createTransport({
            service: 'gmail'
            ,prot : 587
            ,host :'smtp.gmlail.com'
            ,secure : false
            ,requireTLS : true
            , auth: {
              user: 'dev.hyeung@gmail.com'
              ,pass: 'clsdo123!'
            //   ,key : "AIzaSyDoJWrdVwBD0ZLcnEkP65vDUMKR6Nnn0wQ"
            }
        });
        var mailOptions = {
            from: 'dev.hyeung@gmail.com',
            to: param.toEmail,
            subject: param.subject,
            text: param.text
        };
            
        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
            console.log(error);
            } else {
            console.log('Email sent: ' + info.response);
            }
        });
        
    }
}

module.exports = mailSender;