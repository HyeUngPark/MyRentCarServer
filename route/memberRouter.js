/*
    회원 라우팅
*/
var express = require('express');
var router = express.Router();
var schema = require('../schema/commonSchema');
var random = require('../myUtils/random');
var nodemailer = require('nodemailer');

router.get('/idCheck', function(req, res) {
    var params = req.query;
    schema.find({
        workSection: 'MEMBER',
        "subSchema.id": params.loginId
    }, function(err, result) {
        if (err) {
            console.log('error \n', err);
            return res.status(500).send("select error >> " + err)
        }
        console.log(result);
        if (result.length > 0) {
            res.json({ "returnCode": "02" })
        } else {
            res.json({ "returnCode": '01' });
        }
    });
});

router.post('/login', function(req, res) {
    console.log("/login");
    var params = req.query;

    schema.find({
        workSection: 'MEMBER',
        "subSchema.id": params.loginId,
        "subSchema.pw": params.password
    }, function(err, result) {
        if (err) {
            console.log('error \n', err);
            return res.status(500).send("select error >> " + err)
        }
        if (result.length > 0) {
            res.json({ "returnCode": '01', name: result[0].subSchema.name });
        } else {
            res.json({ "returnCode": "02" })
        }
    });
});

    router.post('/join', function(req, res) {
        var params = req.query;
        console.log('/join() \n',params);
        var result = schema.create({
            workSection: 'MEMBER' // 업무 구분 PRODUCT(상품) ORDER(주문) MEMBER(회원)
            ,firstWriteDate: new Date() // 최초작성일
            ,subSchema: { // 업무별 하위 스키마
                mem_id: params.loginId,
                mem_pw: params.password,
                mem_name: params.name,
                // mem_email : params.email,
                mem_phone : params.phoneNumber,
                mem_emailYn : 'N',
                mem_smsYn : 'N'       
            }
        });
        console.log(result);
        res.json({
            login: 'success',
            name: params.name
        });
    });

    router.post('/idSearch',function(req,res){
        var params = req.query;
        console.log('/idSearch() \n',params);
        
        schema.find({
            workSection: 'MEMBER',
            "subSchema.mem_phone": params.phoneNumber,
            "subSchema.mem_name": params.name
        }, function(err, result) {
            if (err) {
                console.log('error \n', err);
                return res.status(500).send("select error >> " + err)
            }
            if (result.length > 0) {
                console.log("★★★ result ★★★ \n",result[0]);
                res.json({ "returnCode": '01', "loginId": result[0].subSchema.mem_id });
            } else {
                res.json({ "returnCode": "02" })
            }
        });
    });

    router.get('/pwSearch',function(req,res){
        var newPw = random.getRandom();
        console.log('pwSearch || ',newPw);
        // 휴대폰 인증 성공
        if(1){
            var transporter = nodemailer.createTransport({
                service: 'gmail'
                ,prot : 587
                ,host :'smtp.gmlail.com'
                ,secure : fasle
                ,requireTLS : true
                , auth: {
                  user: 'dev.hyeung@gmail.com'
                  ,pass: 'clsdo123!'
                //   ,key : "AIzaSyDoJWrdVwBD0ZLcnEkP65vDUMKR6Nnn0wQ"
                }
              });

              var mailOptions = {
                from: 'dev.hyeung@gmail.com',
                to: 'phu8460@naver.com',
                subject: 'MyRentCar 비밀번호 초기화',
                text: '초기화 된 비밀번호는 '+newPw+" 입니다. 로그인 후 변경하시기 바랍니다."
              };
              
              transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                  console.log(error);
                } else {
                  console.log('Email sent: ' + info.response);
                }
              });

        }else{
        // 실패

        }

    });


module.exports = router;